import { Controller, Application } from 'egg'
import resHelper from '../utils/resHelper'
import { UserLoginProps, UserRegisterProps } from '../service/user'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import validateInput from '../decorator/validateInput'
import { ParameterRuleItem, ParameterRules } from 'parameter'

const userValidateRules: ParameterRules = {
  username: { type: 'string', required: true, min: 4 },
  password: { type: 'password', required: true, min: 2 },
  email: { type: 'email' },
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/ },
  nickName: { type: 'string', min: 4, allowEmpty: true },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeRegisterRules(body?: UserRegisterProps): ParameterRules {
  const { type = 'email' } = body || {}

  const baseRules = {
    username: userValidateRules.username,
    password: userValidateRules.password,
    nickName: userValidateRules.nickName
  }

  if (type === 'phoneNumber') {
    return {
      ...baseRules,
      email: {
        ...userValidateRules.email as ParameterRuleItem,
        allowEmpty: true,
      },
      phoneNumber: {
        ...userValidateRules.phoneNumber as ParameterRuleItem,
        required: true
      }
    }
  }

  return {
    ...baseRules,
    email: {
      ...userValidateRules.email as ParameterRuleItem,
      required: true
    },
    phoneNumber: {
      ...userValidateRules.phoneNumber as ParameterRuleItem,
      allowEmpty: true
    }
  }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeLoginRules(body?: UserLoginProps): ParameterRules {
  const { type = 'username' } = body || {}
  if (type === 'phoneNumber') {
    // todo
  }

  return {
    username: userValidateRules.username,
    password: userValidateRules.password
  }
}

function genToken(app: Application, _id: string, id: string) {
  // 这里会把username和_id存到ctx.state.user里
  // @ts-ignore
  return app.jwt.sign({ _id, id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires })
}

// 测试账号：test2，密码：11
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

    const userData = await service.user.findUser({ id: ctx.state.user.id })
    if (userData) {
      resHelper.success(ctx, userData)
    } else {
      resHelper.errorWithType(ctx, 'infoFetchFail')
    }
  }

  @validateInput(makeRegisterRules, 'registerParamsError')
  async register() {
    const { ctx, service } = this
    const registerProps = ctx.request.body as UserRegisterProps
    const { username } = registerProps

    const userData = await service.user.findUser({ username })
    ctx.logger.info('register ->', 'find username', userData)
    if (userData) {
      return resHelper.errorWithType(ctx, 'createUserAlreadyExists')
    }

    ctx.logger.info('register ->', 'params', registerProps)

    // if (!username || !password || !type || (type === 'email' && !email) || (type === 'phoneNumber' && !phoneNumber)) {
    //   return resHelper.errorWithType(ctx, 'registerParamsError')
    // }

    const res = await service.user.createUser(registerProps)
    ctx.logger.info('register ->', 'success with data', res)
    return resHelper.success(ctx, {})
  }

  @validateInput(makeLoginRules, 'loginFail')
  async login() {
    const { app, ctx, service } = this
    const loginParams = ctx.request.body as UserLoginProps
    const { type = 'username' } = loginParams

    if (type !== 'username') {
      return resHelper.errorWithType(ctx, 'loginFail')
    }

    const { username = '', password = '' } = loginParams

    const userData = await service.user.findUser({ username }, true)
    if (!userData || !userData.password || !await ctx.compare(password, userData.password)) {
      return resHelper.errorWithType(ctx, 'loginFail')
    }

    const token = genToken(app, userData._id + '', userData.id + '')
    resHelper.success(ctx, { token })
  }
}
