import type { ZodSchema } from 'zod'
import type {
  GetMovieResponse,
  CreateMovieRequest,
  CreateMovieResponse,
  MovieNotFoundResponse,
  ConflictMovieResponse,
  DeleteMovieResponse,
  UpdateMovieRequest,
  UpdateMovieResponse
} from './@types'
import type { MovieRepository } from './movie-repository'
import { CreateMovieSchema, UpdateMovieSchema } from './@types/schema'

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {
    this.movieRepository = movieRepository
  }

  async getMovies(): Promise<GetMovieResponse> {
    return this.movieRepository.getMovies()
  }

  async getMovieById(
    id: number
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.getMovieById(id)
  }

  async getMovieByTitle(
    title: string
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.getMovieByTitle(title)
  }

  async deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse> {
    return this.movieRepository.deleteMovieById(id)
  }

  async addMovie(
    data: CreateMovieRequest,
    id?: number
  ): Promise<CreateMovieResponse | ConflictMovieResponse> {
    const validate = validateSchema(CreateMovieSchema, data)
    if (!validate.success) return { status: 400, error: validate.error }
    return this.movieRepository.addMovie(data, id)
  }

  async updateMovie(
    data: UpdateMovieRequest,
    id: number
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  > {
    const validate = validateSchema(UpdateMovieSchema, data)
    if (!validate.success) return { status: 400, error: validate.error }
    return this.movieRepository.updateMovie(data, id)
  }
}

function validateSchema<T>(
  schema: ZodSchema,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  const error = result.error.errors
    .map((err) => `${err.path.join('.')} - ${err.message}`)
    .join(', ')
  return { success: false, error }
}
