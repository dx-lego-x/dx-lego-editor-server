import { Application } from 'egg'
import userRouter from './router/user.router'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/', controller.home.index)

  userRouter(app)
}
