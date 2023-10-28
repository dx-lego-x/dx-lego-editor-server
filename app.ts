import { Application, IBoot } from 'egg'

export default class AppBoot implements IBoot {
  private readonly app: Application

  constructor(app: Application) {
    this.app = app
  }

  configWillLoad() {
    // 修改配置的最后时机，这里是为了把unhandledError放到所有error处理的最前面
    this.app.config.coreMiddleware.push('unhandledError')
  }
}
