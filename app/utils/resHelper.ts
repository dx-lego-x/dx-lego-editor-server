import { Context } from 'egg'
import { BaseResponse } from '../types.d.ts/base'
import { GlobalErrorTypes, globalErrorEntities } from '../error'

function success(ctx: Context, res: any) {
  const body: BaseResponse<any> = {
    errno: 0,
    data: res ? res : null
  }
  ctx.body = body
  ctx.status = 200
}

function error(ctx: Context, options: { errno: number, message?: any, extra?: any }) {
  const { errno, message, extra } = options
  const body: BaseResponse<any> = {
    errno,
    message,
    data: extra
  }
  ctx.body = body
  ctx.status = 200
}

function errorWithType(ctx: Context, type: GlobalErrorTypes) {
  const { errno, message } = globalErrorEntities[type]

  return error(ctx, { errno, message })
}

const resHelper = {
  success,
  error,
  errorWithType,
}

export default resHelper
