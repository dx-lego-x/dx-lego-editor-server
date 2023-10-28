import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.baseUrl = 'prod.url'

  // config.mongoose = {
  //   url: 'xxx',
  //   options: {
  //     user: process.env.MONGO_DB_USER,
  //     pass: process.env.MONGO_DB_PASS,
  //   }
  // }

  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: '127.0.0.1',
  //     password: process.env.REDIS_PASS,
  //     db: 0
  //   }
  // }

  config.security = {
    domainWhiteList: [
      'https://dxcloud.com',
      'https://www.dxcloud.com',
      'http://120.25.236.117:81',
      'http://10.178.112.113:8080',
      'http://localhost:8080',
      'http://localhost:8081'
    ]
  }

  config.jwtExpires = '2 days'

  // @ts-ignore
  config.giteeOauthConfig = {
    redirectUrl: 'https://api.dxcloud.com/api/v1/user/passport/gitee/callback'
  }
  config.H5BaseUrl = 'https://page.dxcloud.com'

  return config
}
