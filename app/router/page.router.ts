import { Application } from 'egg'

const PAGE_PREFIX = '/page'

export default (app: Application) => {
  const { router, controller } = app

  router.get(PAGE_PREFIX + '/:uuid', controller.page.preview)
}
