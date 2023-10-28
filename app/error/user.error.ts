export const userErrorMessages = {
  infoFetchFail: {
    errno: 101001,
    message: '用户信息获取失败'
  },

  createUserAlreadyExists: {
    errno: 101002,
    message: '已注册，请直接登录'
  },

  loginFail: {
    errno: 101003,
    message: '用户不存在或密码错误'
  },

  genVeriCodeFail: {
    errno: 101004,
    message: '获取验证码失败，请不要频繁获取验证码'
  },

  loginFailWithVeriCode: {
    errno: 101005,
    message: '登录失败，验证码错误'
  },

  oauthLoginFail: {
    errno: 101006,
    message: '授权登录失败'
  },

  registerParamsError: {
    errno: 101007,
    message: '注册参数错误，无法注册'
  }
}
