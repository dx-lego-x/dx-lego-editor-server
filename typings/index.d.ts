import 'egg'
import { Model } from 'mongoose'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }

  interface Context {
    genHash(plainText: string): Promise<string>
    compare(plainText: string, hash: string): Promise<boolean>
  }

  interface EggAppConfig {
    bcrypt: {
      saltRounds: number
    },

    giteeOauthConfig: {
      cid: string
      secret: string
      redirectUrl: string,
      authUrl: string
      userAPI: string
    },

    H5BaseUrl: string,

    baseUrl: string,

    apiPrefix: {
      v1: string
    }
  }
}