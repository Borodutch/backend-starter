import { Body, Controller, Get, IsNumber, IsString, Post, Query } from 'amala'
import { Movie } from '@/models/Movie'
import MovieRequest from '@/types/MovieRequest'

@Controller('/movies')
export default class MovieController {
  @Get('/')
  async getMovieByYear(
    @Query('year') year: number,
    @Query('length') runtime: number
  ) {
    if (!year && !runtime) {
      const result = await Movie.aggregate([{ $sample: { size: 10 } }])
      return {
        message: 'Return 10 random movies',
        data: result,
      }
    }
    const movies = await Movie.find({ year: year, runtime: runtime })
    return { message: 'Return filtered movies', data: movies }
  }

  @Post('/')
  async postMovie(@Body({ required: true }) body: MovieRequest) {
    const result = await body
    return { message: 'Movie just posted', data: result }
  }
}
