import { Prisma, type PrismaClient } from '@prisma/client'
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
import { MovieReposity } from './movie-repository'

export class MovieAdapter implements MovieReposity {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  private handleError(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code, 'Message:', error.message)
    } else if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('An unknown error', error)
    }
  }

  async getMovies(): Promise<GetMovieResponse> {
    try {
      const movies = await this.prisma.movie.findMany()

      if (movies.length === 0) return { status: 200, data: [], error: null }
      return { status: 200, data: movies, error: null }
    } catch (error) {
      this.handleError(error)
      return { status: 500, data: null, error: 'Failed to retrieve movies' }
    }
  }

  async getMovieById(
    id: number
  ): Promise<GetMovieResponse | MovieNotFoundResponse> {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } })
      if (movie) return { status: 200, data: movie, error: null }
      return { status: 404, data: null, error: `Movie with ID ${id} not found` }
    } catch (error) {
      this.handleError(error)
      return { status: 500, data: null, error: 'Internal server error' }
    }
  }

  async getMovieByName(title: string): Promise<GetMovieResponse> {
    try {
      const movie = await this.prisma.movie.findFirst({ where: { title } })

      if (movie) return { status: 200, data: movie, error: null }
      return {
        status: 404,
        data: null,
        error: `Movie with title "${title}" not found`
      }
    } catch (error) {
      this.handleError(error)
      return { status: 500, data: null, error: 'Internal server error' }
    }
  }

  // Delete a movie by its ID
  async deleteMovieById(
    id: number
  ): Promise<DeleteMovieResponse | MovieNotFoundResponse> {
    try {
      await this.prisma.movie.delete({ where: { id } })
      return { status: 200, message: `Movie with ID ${id} has been deleted` }
    } catch (error) {
      // Handle specific error codes (e.g., movie not found)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return { status: 404, error: `Movie with ID ${id} not found` }
      }
      this.handleError(error)
      throw error // Re-throw other errors
    }
  }

  // Add a new movie with validation
  async addMovie(
    data: CreateMovieRequest,
    id?: number
  ): Promise<CreateMovieResponse | ConflictMovieResponse> {
    try {
      // Check if movie (id and title) already exists
      if (id && (await this.prisma.movie.findUnique({ where: { id } }))) {
        return { status: 409, error: `Movie with ID ${data.id} already exists` }
      }

      if (
        await this.prisma.movie.findFirst({
          where: { title: data.title }
        })
      ) {
        return {
          status: 409,
          error: `Movie with title ${data.title} already exists`
        }
      }

      // Create the new movie
      const movie = await this.prisma.movie.create({
        data: id ? { ...data, id } : data
      })

      return { status: 200, data: movie }
    } catch (error) {
      this.handleError(error)
      return { status: 500, error: 'Internal server error' }
    }
  }

  async updateMovie(
    data: Partial<UpdateMovieRequest>,
    id: number
  ): Promise<
    UpdateMovieResponse | MovieNotFoundResponse | ConflictMovieResponse
  > {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } })
      if (movie) {
        return { status: 404, error: `Movie with ID ${id} not found` }
      }

      const updatedMovie = await this.prisma.movie.update({
        where: { id },
        data
      })

      return { status: 200, data: updatedMovie }
    } catch (error) {
      this.handleError(error)
      return { status: 500, error: 'Internal server error' }
    }
  }
}
