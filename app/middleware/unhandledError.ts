import { Context } from 'egg'
import resHelper from '../utils/resHelper'

export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error: any) {
      if (error && error.status === 401) {
        console.log('用户登录失效', 401)
        // return resHelper.error(ctx, { errno: -1 })
        return resHelper.errorWithType(ctx, 'tokenInvalidError')
      }

      throw error
    }
  }
}
