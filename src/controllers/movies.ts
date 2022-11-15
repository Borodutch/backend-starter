import { Controller, Get } from 'amala'
import { movie } from '@/types/movie-schema'

@Controller('/movies')
export default class MovieController {
  @Get('/')
  async getMovie() {
    const movies = await movie.find({ year: 1984, runtime: 100 })
    console.log(movies)
    return movies
  }
}
