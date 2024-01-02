import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config()

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1640351848156_1111'

  // add your egg config in here
  // config.middleware = [ 'unhandledError' ] // 已经在app.ts中定义

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,

    baseUrl: 'default.url',

    giteeOauthConfig: {
      cid: process.env.GITEE_CID,
      secret: process.env.GITEE_SECRET,
      redirectUrl: 'http://localhost:7001/api/v1/user/passport/gitee/callback',
      authUrl: 'https://gitee.com/oauth/token?grant_type=authorization_code',
      userAPI: 'https://gitee.com/api/v5/user',
    },

    H5BaseUrl: 'http://localhost:7001/pages',
    jwtExpires: '8h'
  }

  config.security = {
    csrf: {
      enable: false
    },

    xframe: {
      enable: false,
      value: 'ALLOW-FROM',
    },

    domainWhiteList: [ 'http://localhost:3000' ]
  }

  config.mongoose = {
    url: 'mongodb://localhost:27017/dx_lego_x',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }

  config.bcrypt = {
    saltRounds: 10
  }

  config.jwt = {
    secret: '1234567890',
    enable: true,
    match: [
      '/api/v1/user/fetchUserInfo',
      '/api/v1/work',
      '/api/v1/utils/uploadImage',
      '/api/v1/channel',
    ],
  }

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    }
  }

  // config.cors = {
  //   origin: '*',
  //   allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH'
  // } // 使用security的domainWhiteList配置取代

  config.view = {
    defaultViewEngine: 'nunjucks'
  }

  config.multipart = {
    mode: 'file',
    tmpdir: join(appInfo.baseDir, 'uploads'),
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '1mb'
  }

  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/static', dir: join(appInfo.baseDir, 'app/public/static') },
      // { prefix: '/dx-page', dir: join(appInfo.baseDir, 'client-web-x/dx-page/build') }, // react build文件夹跟路径
      // { prefix: '/static', dir: join(appInfo.baseDir, 'client-web-x/dx-page/build/static') }, // react build文件夹下的静态文件读取
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') }
    ]
  }

  config.apiPrefix = {
    v1: '/api/v1'
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  }
}
