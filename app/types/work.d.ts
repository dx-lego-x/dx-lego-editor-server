import { DxBrickProps, TextProps } from 'dx-lego-bricks'
import { ObjectId } from 'mongoose'

export interface DxBrickEditProps {
  isHidden?: boolean
  isLocked?: boolean
}

export interface DxBrickSchema<T = any> {
  id?: string
  title?: string // 组件名称
  desc?: string // 组件描述
  component?: string // 组件对应的组件名（大写）
  sampleImg?: string // 组件展示时的示例图片
  props?: DxBrickProps<T> // 组件属性，包括style和custom
  editProps?: DxBrickEditProps
}

export type DxPageSchema = DxBrickSchema<{ children: DxBrickSchema[], [key: string]: any }>

export interface DxLegoSchema {
  pages: DxPageSchema[]
  currentPageId: string
  curerntPageSelected: boolean
  currentBrickId: string
}

export interface ChannelProps {
  name: string
  id: string
}

export interface WorkModelProps {
  // id?: number
  uuid: string
  title: string
  desc: string
  coverImg?: string
  schemas?: DxLegoSchema
  isTemplate?: boolean
  isPublic?: boolean
  isHot?: boolean
  author: string
  copiedCount: number
  status: 'removed' | 'not-published' | 'published'
  user: ObjectId
  latestPublishAt?: Date
  channels?: ChannelProps[]
}

export interface WorkProps extends WorkModelProps {
  _id: string
  id: string
}

export interface SelectorBrickModelProps {
  id: string
  type: 'text' | 'image' | 'shape'
  schema: DxBrickSchema<any>
}

export interface SelectorBrickProps extends SelectorBrickModelProps {
  _id: string
  id: string
}
