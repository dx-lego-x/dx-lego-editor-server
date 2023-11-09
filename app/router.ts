import { Application } from 'egg'
import userRouter from './router/user.router'
import workRouter from './router/work.router'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/', controller.home.index)

  userRouter(app)
  workRouter(app)
}
