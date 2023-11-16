import { Application } from 'egg'
import * as AutoIncrementFactory from 'mongoose-sequence'
import { WorkModelProps } from '../types/work'

function initWorkModel(app: Application) {
  // @ts-ignore
  const autoIncrement = AutoIncrementFactory(app.mongoose)
  // @ts-ignore
  const Schema = app.mongoose.Schema

  const workSchema = new Schema<WorkModelProps>({
    uuid: { type: String, unique: true },
    title: { type: String },
    desc: { type: String },
    coverImg: { type: String },
    schemas: { type: Object },
    isTemplate: { type: Boolean },
    isPublic: { type: Boolean },
    isHot: { type: Boolean },
    author: { type: String },
    copiedCount: { type: Number, default: 0 },
    status: { type: String, default: 'not-published' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    latestPublishAt: { type: Date },
    channels: { type: Array },
  }, {
    timestamps: true
  })

  workSchema.plugin(autoIncrement, { inc_field: 'id', id: 'works_id_counter' })
  // @ts-ignore
  return app.mongoose.model('Work', workSchema)
}

export default initWorkModel
