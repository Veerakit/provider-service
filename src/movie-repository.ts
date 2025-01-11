import {
  DeleteMovieResponse,
  CreateMovieRequest,
  UpdateMovieRequest,
  UpdateMovieResponse,
  CreateMovieResponse,
  ConflictMovieResponse,
  MovieNotFoundResponse,
  GetMovieResponse
} from './@types'

export interface MovieRepository {
  getMovies(): Promise<GetMovieResponse>
  getMovieById(id: number): Promise<GetMovieResponse | MovieNotFoundResponse>
  getMovieByTitle(
    name: string
  ): Promise<GetMovieResponse | MovieNotFoundResponse>
  deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse>
  addMovie(
    data: CreateMovieRequest,
    id?: number
  ): Promise<CreateMovieResponse | ConflictMovieResponse>
  updateMovie(
    data: UpdateMovieRequest,
    id: number
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  >
}
