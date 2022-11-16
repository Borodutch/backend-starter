import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import mongoose from 'mongoose'

class IdmbClass {
  @prop({ required: true })
  public rating!: number

  @prop({ required: true })
  public votes!: number

  @prop({ required: true })
  public id!: number
}

class AwardClass {
  @prop({ required: true })
  public wins!: number

  @prop({ required: true })
  public nominations!: number

  @prop({ required: true })
  public text!: string
}

class TomatoesClass {
  @prop({ required: true })
  public rating!: number

  @prop({ required: true })
  public numReviews!: number

  @prop({ required: true })
  public meter!: number
}

@modelOptions({ schemaOptions: { collection: 'movies' } })
class MovieClass {
  @prop({ required: true })
  public imdb!: IdmbClass

  @prop({ required: true })
  public awards!: AwardClass

  @prop({ required: true })
  public tomatoes!: TomatoesClass

  @prop({ type: String, required: true })
  public genres!: string[]

  @prop({ type: String, required: true })
  public cast!: string[]

  @prop({ type: String, required: true })
  public countries!: string[]

  @prop({ type: String, required: true })
  public directors!: string[]

  @prop({ required: true })
  public plot!: string

  @prop({ required: true })
  public title!: string

  @prop({ required: true })
  public fullplot!: string

  @prop({ required: true })
  public released!: string

  @prop({ required: true })
  public rated!: string

  @prop({ required: true })
  public lastupdated!: string

  @prop({ required: true })
  public type!: string

  @prop({ required: true })
  public runtime!: number

  @prop({ required: true })
  public num_mflix_comments!: number

  @prop({ required: true })
  public year!: number

  @prop({ required: true })
  public _id?: mongoose.Types.ObjectId
}

// eslint-disable-next-line import/prefer-default-export
export const Movie = getModelForClass(MovieClass)
