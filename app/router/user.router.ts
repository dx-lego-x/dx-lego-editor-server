import { Application } from 'egg'

export const USER_PREFIX = '/user'

export default (app: Application) => {
  const { controller, router, config } = app
  const prefix = config.apiPrefix.v1 + USER_PREFIX

  router.get(prefix + '/userInfo', controller.user.index)
  router.post(prefix + '/login', controller.user.login)
  router.post(prefix, controller.user.register)
  router.get(prefix + '/fetchUserInfo', controller.user.fetchUserInfo)
}
