import { Service } from 'egg'
import { ChannelProps, DxLegoSchema, SelectorBrickProps, WorkModelProps, WorkProps } from '../types/work'
import { UserTokenProps } from './user'
import { Types } from 'mongoose'
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
import { IndexCondition } from '../types/base'
import { defaultIndexCondition } from '../utils/constants'
// import { DxBrickStyleProps } from 'dx-lego-bricks'

function genEmptySchema(): DxLegoSchema {
  const pageId = uuidv4()

  return {
    pages: [{
      id: pageId,
      title: '新页面',
      desc: '暂无描述',
      component: 'Page',
      sampleImg: '',
      props: {
        style: {
          position: 'relative',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '560px',
        },
        custom: {
          children: [],
        }
      },
    }],
    currentPageId: pageId,
    currentBrickId: ''
  }
}

const defaultTextStyleProps: any = {
  width: 'auto',
  height: 'auto',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  color: '#262626',
  backgroundColor: '#FFFFFF',
  borderStyle: 'none',
  borderColor: '#262626',
  borderWidth: '0px',
  borderRadius: '0px',
  boxShadow: '0px 0px 0px #FFFFFF',
  opacity: '1',
  position: 'static',
  left: '0px',
  top: '0px',
  right: '0px',
  bottom: '0px',
  fontFamily: 'unset',
  fontSize: '14px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: 'normal',
  textAlign: 'left',
}

function genBrickList(): { id: string, groupType: string, groupName: string, groupBricks: SelectorBrickProps[] }[] {
  return [{
    id: '1',
    groupType: 'text',
    groupName: '文本组件',
    groupBricks: [{
      _id: '1',
      id: '1',
      type: 'text',
      schema: {
        title: '正文组件',
        desc: '',
        component: 'Text',
        sampleImg: '',
        props: {
          style: defaultTextStyleProps,
          custom: { text: '正文组件' }
        }
      }
    }, {
      _id: '2',
      id: '2',
      type: 'text',
      schema: {
        title: '标题组件',
        desc: '',
        component: 'Text',
        sampleImg: '',
        props: {
          style: { ...defaultTextStyleProps, fontSize: '18px', fontWeight: 'bold' },
          custom: { text: '标题组件' }
        }
      }
    }, {
      _id: '3',
      id: '3',
      type: 'text',
      schema: {
        title: '小标题组件',
        desc: '',
        component: 'Text',
        sampleImg: '',
        props: {
          style: { ...defaultTextStyleProps, fontSize: '16px', fontWeight: 'bold' },
          custom: { text: '小标题组件' }
        }
      }
    }]
  }]
}

export default class WorkService extends Service {
  async createEmptyWork(payload: Partial<WorkModelProps>) {
    const { ctx } = this
    const { _id } = ctx.state.user as UserTokenProps
    const { title = '', desc = '', author = '' } = payload

    const uuid = nanoid(6)
    const schemas = genEmptySchema()

    const emptyWork: WorkModelProps = {
      uuid,
      title,
      desc,
      coverImg: '',
      schemas,
      isTemplate: false,
      isPublic: false,
      isHot: false,
      author,
      copiedCount: 0,
      status: 'not-published',
      // @ts-ignore
      user: Types.ObjectId(_id)
    }

    const createdWork = await ctx.model.Work.create(emptyWork) as WorkProps
    if (createdWork) {
      const { id } = createdWork
      await this.createChannel('默认', id)
      return await this.findWork({ id })
    }

    return null
  }

  async createChannel(name: string, workId: string) {
    const { ctx } = this

    const newChannel: ChannelProps = {
      name,
      id: nanoid(6)
    }

    await ctx.model.Work.findOneAndUpdate({ id: workId }, { $push: { channels: newChannel } })
  }

  async findWork(options: Partial<WorkProps>) {
    return await this.ctx.model.Work.findOne(options)
  }

  async findWorks(condition: IndexCondition) {
    const { ctx } = this
    const fcondition: Required<IndexCondition> = { ...defaultIndexCondition, ...condition }
    const { pageIndex, pageSize, select, populate, customSort, find } = fcondition
    const skip = pageIndex * pageSize
    const list = await ctx.model.Work
      .find(find)
      .select(select)
      .populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean()

    const count = await ctx.model.Work.find(find).count()
    return { count, list, pageSize, pageIndex }
  }

  async findSelectorBricksWithGroup() {
    // todo 配置到数据库
    return genBrickList()
  }

  async updateWork(uuid: string, updatePayload?: Partial<WorkModelProps>) {
    const { ctx } = this

    const newWork = await ctx.model.Work.findOneAndUpdate({ uuid }, updatePayload, { new: true }).lean()
    return newWork
  }
}
