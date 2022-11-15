import mongoose, { Date, Schema } from 'mongoose'

const MovieAwardsSchema = new mongoose.Schema({
  wins: Number,
  nominations: Number,
  text: String,
})
const MovieImdbSchema = new mongoose.Schema({
  rating: Number,
  votes: Number,
  id: Number,
})
const MovieTomatoesSchema = new mongoose.Schema({
  rating: Number,
  numReviews: Number,
  meter: Number,
})

const MovieSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  title: String,
  fullplot: String,
  countries: [String],
  released: { type: Date },
  directors: [String],
  rated: String,
  awards: MovieAwardsSchema,
  lastupdated: String,
  year: Number,
  imdb: MovieImdbSchema,
  type: String,
  tomatoes: MovieTomatoesSchema,
})

// eslint-disable-next-line import/prefer-default-export
export const movie = mongoose.model('movies', MovieSchema)
