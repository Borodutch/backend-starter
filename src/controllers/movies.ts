import { Body, Controller, Delete, Get, Patch, Post, Query } from 'amala'
import { Movie } from '@/models/Movie'
import MovieRequest, { MovieTitleRequest } from '@/validators/MovieRequest'

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
  createMessage(
    @Body({ required: true })
    {
      title,
      runtime,
      _id,
      year,
      num_mflix_comments,
      fullplot,
      imdb,
      lastupdated,
      plot,
      rated,
      released,
      text,
      type,
      tomatoes,
      awards,
    }: MovieRequest
  ) {
    return Movie.create({
      title,
      runtime,
      _id,
      year,
      num_mflix_comments,
      fullplot,
      imdb,
      lastupdated,
      plot,
      rated,
      released,
      text,
      type,
      tomatoes,
      awards,
    })
  }

  @Delete('/')
  deleteMovie(@Query('id') id: string) {
    return Movie.findByIdAndDelete(id)
  }

  @Patch('/')
  async UpdateMovie(
    @Query('id') id: string,
    @Body() { title }: MovieTitleRequest
  ) {
    await Movie.findByIdAndUpdate(id, { title })
    return Movie.findById(id)
  }
}
