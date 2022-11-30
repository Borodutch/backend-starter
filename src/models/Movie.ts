import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'

class IdmbClass {
  @prop({ required: false })
  public rating!: number

  @prop({ required: false })
  public votes!: number

  @prop({ required: false })
  public id!: number
}

class AwardClass {
  @prop({ required: false })
  public wins!: number

  @prop({ required: false })
  public nominations!: number

  @prop({ required: false })
  public text!: string
}

class TomatoesClass {
  @prop({ required: false })
  public rating!: number

  @prop({ required: false })
  public numReviews!: number

  @prop({ required: false })
  public meter!: number
}

@modelOptions({ schemaOptions: { collection: 'movies' } })
class MovieClass {
  @prop({ required: false })
  public imdb?: IdmbClass

  @prop({ required: false })
  public awards?: AwardClass

  @prop({ required: false })
  public tomatoes?: TomatoesClass

  @prop({ required: false })
  public plot?: string

  @prop({ required: false })
  public title!: string

  @prop({ required: false })
  public fullplot?: string

  @prop({ required: false })
  public released?: string

  @prop({ required: false })
  public rated?: string

  @prop({ required: false })
  public lastupdated?: string

  @prop({ required: false })
  public type?: string

  @prop({ required: false })
  public runtime!: number

  @prop({ required: false })
  public num_mflix_comments?: number

  @prop({ required: false })
  public year!: number

  @prop({ required: false })
  public _id?: mongoose.Types.ObjectId
}

// eslint-disable-next-line import/prefer-default-export
export const Movie = getModelForClass(MovieClass)
