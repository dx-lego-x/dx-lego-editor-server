import { Application } from 'egg'

export const WORK_PREFIX = '/work'

export default (app: Application) => {
  const { controller, router, config } = app
  const prefix = config.apiPrefix.v1 + WORK_PREFIX

  router.get(prefix + '/selectorBricks', controller.work.fetchSelectorBricks)
  router.get(prefix + '/myWorks', controller.work.myList)
  router.post(prefix, controller.work.createWork)
  router.get(prefix + '/:uuid', controller.work.fetchWork)
  router.patch(prefix + '/:uuid', controller.work.updateWork)
}
