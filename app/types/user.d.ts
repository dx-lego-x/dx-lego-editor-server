export interface UserModelProps {
  username: string
  password: string
  email?: string
  nickName?: string
  sex?: 'male' | 'female'
  picture?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  type: 'email' | 'phoneNumber' | 'oauth'
  provider?: string
  oauthId?: string
  role?: 'admin' | 'normal'
}

export interface UserProps extends UserModelProps {
  _id: string
  id: string
}
