import { GlobalErrorTypes } from '../error'
import { Controller } from 'egg'
import resHelper from '../utils/resHelper'
import { ParameterRules, ValidateError } from 'parameter'

export default function validateInput(rules: ParameterRules | ((body: any) => ParameterRules), errorType: GlobalErrorTypes) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value
    descriptor.value = function(...args) {
      // @ts-ignore
      const { ctx, app } = this as Controller
      const body = ctx.request.body
      let errors: ValidateError[] | null = null
      if (typeof rules === 'function') {
        // @ts-ignore
        errors = app.validator.validate(rules(body), body)
      } else {
        // @ts-ignore
        errors = app.validator.validate(rules, body)
      }

      if (errors && errors.length > 0) {
        ctx.logger.info('validateInput error ->', errors)
        return resHelper.errorWithType(ctx, errorType)
      }

      return originMethod.apply(this, args)
    }
  }
}
