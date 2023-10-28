import { Controller } from 'egg'
import resHelper from '../utils/resHelper'

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this

    resHelper.success(ctx, { msg: 'hello egg' })
  }
}
