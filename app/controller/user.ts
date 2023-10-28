import { Controller, Application } from 'egg'
import resHelper from '../utils/resHelper'
import { UserRegisterProps } from '../service/user'

function genToken(app: Application, username: string, id: string) {
  // 这里会把username和_id存到ctx.state.user里
  return app.jwt.sign({ username, id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires })
}

export default class UserController extends Controller {

  async index() {
    const { ctx } = this

    resHelper.success(ctx, { token: '1234' })
  }

  async fetchUserInfo() {
    const { ctx, service } = this
    if (!ctx.state.user) {
      ctx.logger.info('ctx.state.user为空')
      return resHelper.errorWithType(ctx, 'infoFetchFail')
    }

    const userData = await service.user.findByUsername(ctx.state.user.username)
    if (userData) {
      resHelper.success(ctx, userData)
    } else {
      resHelper.errorWithType(ctx, 'infoFetchFail')
    }
  }

  async register() {
    const { ctx, service } = this
    const registerProps = ctx.request.body as UserRegisterProps
    const { username, password, email, phoneNumber, type } = registerProps

    const userData = await service.user.findByUsername(username)
    ctx.logger.info('register ->', 'find username', userData)
    if (userData) {
      return resHelper.errorWithType(ctx, 'createUserAlreadyExists')
    }

    ctx.logger.info('register ->', 'params', registerProps)

    if (!username || !password || !type || (type === 'email' && !email) || (type === 'phoneNumber' && !phoneNumber)) {
      return resHelper.errorWithType(ctx, 'registerParamsError')
    }

    const res = await service.user.createUser(registerProps)
    ctx.logger.info('register ->', 'success with data', res)
    return resHelper.success(ctx, {})
  }

  async login() {
    const { app, ctx, service } = this
    const { username, password } = ctx.request.body

    const userData = await service.user.findByUsername(username, true)
    if (!userData || !userData.password || !await ctx.compare(password, userData.password)) {
      return resHelper.errorWithType(ctx, 'loginFail')
    }

    const token = genToken(app, userData.username + '', userData.id + '')
    resHelper.success(ctx, { token })
  }
}
