import { userErrorMessages } from './user.error'

export interface ErrorEntity {
  errno: number
  message: string
}

export type GlobalErrorTypes = keyof typeof userErrorMessages

export const globalErrorEntities = {
  ...userErrorMessages
}
