import { userErrorMessages } from './user.error'
import { workErrorMessages } from './work.error'
import { commonErrorMessages } from './common.error'

export interface ErrorEntity {
  errno: number
  message: string
}

export type GlobalErrorTypes =
  keyof typeof userErrorMessages |
  keyof typeof workErrorMessages |
  keyof typeof commonErrorMessages

export const globalErrorEntities: Record<GlobalErrorTypes, ErrorEntity> = {
  ...userErrorMessages,
  ...workErrorMessages,
  ...commonErrorMessages,
}
