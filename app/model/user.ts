import { Application } from 'egg'
import { Schema } from 'mongoose'
import * as AutoIncrementFactory from 'mongoose-sequence'
import { UserModelProps } from '../types.d.ts/user'

// export interface UserProps {
//   username: string
//   password: string
//   email?: string
//   nickName?: string
//   picture?: string
//   phoneNumber?: string
//   createdAt: Date
//   updatedAt: Date
//   type: 'email' | 'phoneNumber' | 'oauth'
//   provider?: string
//   oauthId?: string
//   role?: 'admin' | 'member' | 'visitor'
// }

function initUserModel(app: Application) {
  const autoIncrement = AutoIncrementFactory(app.mongoose)
  const userSchema = new Schema<UserModelProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    email: { type: String },
    nickName: { type: String },
    sex: { type: String, default: 'male' },
    picture: { type: String },
    phoneNumber: { type: String },
    type: { type: String, default: 'email' },
    provider: { type: String },
    oauthId: { type: String },
    role: { type: String, default: 'normal' },
  }, {
    timestamps: true,
    // toJSON: {
    //   transform(_, ret) {
    //     delete ret.password
    //     delete ret.__v
    //   },
    // }
  })

  userSchema.plugin(autoIncrement, { inc_field: 'id', id: 'users_id_counter' })
  return app.mongoose.model<UserModelProps>('User', userSchema)

}

export default initUserModel
