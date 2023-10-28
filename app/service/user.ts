import { Service } from 'egg'
import { UserProps } from '../types.d.ts/user'

export type UserRegisterProps = Pick<UserProps, 'username' | 'password' | 'email' | 'phoneNumber' | 'nickName' | 'type'>
export type UserResponseProps = Pick<UserProps, 'id' | 'username' | 'password' | 'email' | 'phoneNumber' | 'nickName' | 'sex' | 'picture' | 'createdAt' | 'role'>

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

  public async findByUsername(username: string, needPassword = false) {
    const userData = await this.ctx.model.User.findOne({ username })

    let returnData: Partial<UserResponseProps> | null = null
    if (userData) {
      const { id, username, password, email, nickName, sex, picture, phoneNumber, createdAt, role } = userData as UserProps

      returnData = {
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
