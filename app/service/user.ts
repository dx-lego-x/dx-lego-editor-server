import { Service } from 'egg'
import { UserProps } from '../types/user'

export type UserRegisterProps = Pick<UserProps, 'username' | 'password' | 'email' | 'phoneNumber' | 'nickName' | 'type'>
export type UserResponseProps = Pick<UserProps, '_id' | 'id' | 'username' | 'password' | 'email' | 'phoneNumber' | 'nickName' | 'sex' | 'picture' | 'createdAt' | 'role'>
export type UserTokenProps = Pick<UserProps, '_id' | 'id'>

export interface UserLoginProps {
  type: 'username' | 'phoneNumber' | 'oauth'
  username?: string
  phoneNumber?: string
  password?: string
  authCode?: string
}

export default class UserService extends Service {
  public async createUser(payload: UserRegisterProps) {
    const { ctx } = this
    const { username, password, email, type, phoneNumber, nickName } = payload

    const hashedPassword = await ctx.genHash(password)
    const userData = await ctx.model.User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      nickName: nickName ? nickName : 'dx-lego-' + username,
      type,
      role: 'normal'
    })

    return userData
  }

  public async findUser(options: Partial<UserProps>, needPassword = false) {
    const userData = await this.ctx.model.User.findOne(options)

    let returnData: Partial<UserResponseProps> | null = null
    if (userData) {
      const { _id, id, username, password, email, nickName, sex, picture, phoneNumber, createdAt, role } = userData as UserProps

      returnData = {
        _id,
        id,
        username,
        email,
        nickName,
        sex,
        picture,
        phoneNumber,
        createdAt,
        role,
      }

      if (needPassword) {
        returnData.password = password
      }
    }

    return returnData
  }

}
