import { Controller, Context } from 'egg'
import resHelper from '../utils/resHelper'
import { GlobalErrorTypes } from '../error'
import { ModelName } from '../types/base'
import defineRoles from '../role'
import { UserProps } from '../types/user'
import { subject } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { difference } from 'lodash/fp'

interface ModelMapping {
  mongoose: ModelName
  casl: string
}

interface CheckOption {
  action?: string
  queryKey?: string
  ctxArgsOption?: {
    key1: 'params' | 'body',
    key2: string
  }
  errorTypes?: {
    onUserError?: GlobalErrorTypes
    onPermissionDenied?: GlobalErrorTypes
  }
  skipPermmisonCheck?: boolean
}

const method2Action: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete'
}

const defaultCheckOption: CheckOption = {
  queryKey: 'id',
  ctxArgsOption: { key1: 'params', key2: 'id' },
}

function getQueryConditions(ctx: Context, option?: CheckOption) {
  const checkOption = { ...defaultCheckOption, ...option } as Required<CheckOption>
  console.log('2 ->', option, checkOption)
  const { queryKey, ctxArgsOption } = checkOption
  const source = ctxArgsOption.key1 === 'params' ? ctx.params : ctx.request.body
  const queryConditions = { [queryKey]: source[ctxArgsOption.key2] }
  return queryConditions
}

// 注意：checkPermission时会将查询到的userInfo和具体数据record保存到ctx下面，后续无需重复查询
export default function checkPermission(modelName: ModelName | ModelMapping, option?: CheckOption) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value

    descriptor.value = async function(...args: any) {
      // @ts-ignore
      const { ctx } = this as Controller
      const { onUserError = 'requestWithoutUser', onPermissionDenied = 'permissionDenied' } = option?.errorTypes || {}

      // 先检查用户是否存在，不存在直接返回错误
      if (!ctx.state && !ctx.state.user) {
        return resHelper.errorWithType(ctx, onUserError)
      }
      // 加上用户信息供后续服务使用
      const userInfo = await ctx.service.user.findUser({ _id: ctx.state.user._id })
      if (!userInfo) {
        return resHelper.errorWithType(ctx, onUserError)
      }
      ctx.userInfo = userInfo

      if (!option || option.skipPermmisonCheck !== true) {
        const { method } = ctx.request
        const action = option?.action ? option.action : method2Action[method]

        // const checkOption = { ...defaultCheckOption, ...option }
        // const search = checkOption.ctxArgsOption?.key1 === 'params' ? ctx.params : ctx.request.body
        const queryConditions = getQueryConditions(ctx, option)

        const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose
        const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl

        let permission = false
        let fieldsPermission = true
        const ability = defineRoles(userInfo as UserProps)
        const rule = ability.relevantRuleFor(action, caslModelName)

        if (rule && rule.conditions) {
          console.log('1 ->', queryConditions)
          const record = await ctx.model[mongooseModelName].findOne(queryConditions).lean()
          permission = ability.can(action, subject(caslModelName, record))
          ctx.record = record

        } else {
          permission = ability.can(action, caslModelName)
        }

        if (rule && rule.fields) {
          const permittedFields = permittedFieldsOf(ability, action, caslModelName, { fieldsFrom: rule => rule.fields || [] })
          if (permittedFields.length > 0) {
            const payloadFields = Object.keys(ctx.request.body)
            fieldsPermission = difference(payloadFields, permittedFields).length === 0
          }
        }

        if (!permission || !fieldsPermission) {
          return resHelper.errorWithType(ctx, onPermissionDenied)
        }

      }
      await originMethod.apply(this, args)
    }
  }
}
