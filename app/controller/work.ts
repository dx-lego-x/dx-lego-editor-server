import { Controller } from 'egg'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import validateInput from '../decorator/validateInput'
import resHelper from '../utils/resHelper'
import { IndexCondition } from '../types/base'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import checkPermission from '../decorator/checkPermission'

export default class WorkController extends Controller {

  @validateInput({ title: 'string' }, 'workParamsError')
  @checkPermission('Work', { errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async createWork() {
    const { ctx, service } = this
    try {
      // const { _id } = ctx.state.user
      // const userData = await service.user.findUser({ _id })
      const userData = ctx.userInfo
      if (!userData) {
        throw new Error('没有用户信息无法进行作品创建')
      }

      const workData = await service.work.createEmptyWork({ ...ctx.request.body, author: userData.nickName || userData.username })

      if (workData) {
        resHelper.success(ctx, workData)
      } else {
        throw new Error('workdata in null')
      }

    } catch (error) {
      resHelper.errorWithType(ctx, 'workUnknownError')
    }
  }

  @checkPermission('Work', { queryKey: 'uuid', ctxArgsOption: { key1: 'params', key2: 'uuid' }, errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async fetchWork() {
    const { ctx } = this
    // const uuid = ctx.params.uuid
    // console.log('uuid ->', uuid)

    // const workData = await ctx.service.work.findWork({ uuid })
    // if (workData) {
    //   resHelper.success(ctx, workData)
    // } else {
    //   resHelper.errorWithType(ctx, 'workNotExisted')
    // }
    const workData = ctx.record
    if (workData) {
      resHelper.success(ctx, workData)
    } else {
      resHelper.errorWithType(ctx, 'workNotExisted')
    }
  }

  @checkPermission('Work', { skipPermmisonCheck: true, errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async myList() {
    const { ctx } = this

    const userId = ctx.state.user._id
    const { pageIndex, pageSize, isTemplate, title } = ctx.query

    const data = await this.fetchWorkList({
      userId,
      pageIndex,
      pageSize,
      isTemplate,
      title,
    })

    if (data) {
      resHelper.success(ctx, data)
    } else {
      resHelper.errorWithType(ctx, 'workUnknownError')
    }
  }

  private async fetchWorkList(options: any) {
    const { service } = this

    const { userId, pageIndex, pageSize, isTemplate, title } = options

    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }), // i means Case insensitivity to match upper and lower cases.
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) })
    }

    const listCondition: IndexCondition = {
      select: 'id uuid author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickname picture' },
      find: findCondition,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) })
    }

    const data = await service.work.findWorks(listCondition)
    return data
  }

  @checkPermission('Work', { skipPermmisonCheck: true, errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async fetchSelectorBricks() {
    const { ctx, service } = this
    const data = await service.work.findSelectorBricksWithGroup()

    resHelper.success(ctx, data)
  }

  @checkPermission('Work', { queryKey: 'uuid', ctxArgsOption: { key1: 'params', key2: 'uuid' }, errorTypes: { onUserError: 'workControlWithoutUserInfo' } })
  async updateWork() {
    const { ctx, service } = this
    const { uuid } = ctx.params
    const updatePayload = ctx.request.body

    if (!updatePayload || Object.keys(updatePayload).length === 0) {
      return resHelper.errorWithType(ctx, 'workParamsError')
    }

    const data = await service.work.updateWork(uuid, ctx.request.body)
    if (data) {
      resHelper.success(ctx, data)
    } else {
      resHelper.errorWithType(ctx, 'workUnknownError')
    }
  }
}
