import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { UserProps } from '../types/user'
import { ChannelProps, WorkProps } from '../types/work'
import { ModelName } from '../types/base'

type SubjectKeys = keyof UserProps | keyof WorkProps | keyof ChannelProps
type Conditions = Partial<Record<SubjectKeys, any>>

// action subject fields conditions
export default function defineRoles(user: UserProps) {
  const { can, build } = new AbilityBuilder(createMongoAbility)

  const _can = (action: string, subject: ModelName | 'Channel', fields?: SubjectKeys[] | Conditions, conditions?: Conditions) => {
    if (!fields) {
      can(action, subject)
    } else if (typeof fields === 'object' && !Array.isArray(fields)) {
      can(action, subject, fields)
    } else {
      can(action, subject, fields, conditions)
    }
  }

  if (user) {
    if (user.role === 'admin') {
      can('manage', 'all')
    } else {
      _can('read', 'User', { _id: user._id })
      _can('update', 'User', [ 'nickName', 'picture' ], { _id: user._id })

      _can('create', 'Work', [ 'title', 'desc', 'schemas', 'coverImg' ])
      _can('read', 'Work', { user: user._id })
      _can('update', 'Work', [ 'title', 'desc', 'schemas', 'coverImg' ], { user: user._id })
      _can('delete', 'Work', { user: user._id })
      _can('publish', 'Work', { user: user._id })

      _can('create', 'Channel', [ 'name', 'id' ], { user: user._id })
      _can('read', 'Channel', { user: user._id })
      _can('update', 'Channel', [ 'name' ], { user: user._id })
      _can('delete', 'Channel', [ 'name' ], { user: user._id })
    }
  }

  return build()
}
