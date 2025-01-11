import type { Movie } from '@prisma/client'
import { Prisma, PrismaClient } from '@prisma/client'
import type { DeepMockProxy } from 'jest-mock-extended'
import { mockDeep } from 'jest-mock-extended'
import { MovieAdapter } from './movie-adapter'
import {
  generateMovieWithId,
  generateMovieWithoutId
} from './test-helpers/factories'

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client')
  return {
    ...actualPrisma,
    PrismaClient: jest.fn(() => mockDeep<PrismaClient>())
  }
})

describe('Movie Adapter', () => {
  let prismaMock: DeepMockProxy<PrismaClient>
  let movieAdapter: MovieAdapter

  const mockMovie: Movie = generateMovieWithId()

  beforeEach(() => {
    prismaMock = new PrismaClient() as DeepMockProxy<PrismaClient>
    movieAdapter = new MovieAdapter(prismaMock)
  })

  describe('getMovies', () => {
    it('should be able to get movies when movie qty. > 0', async () => {
      prismaMock.movie.findMany.mockResolvedValue([mockMovie])
      const result = await movieAdapter.getMovies()
      expect(result.data).toEqual([mockMovie])
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1)
    })

    it('should be able to get movies when movie qty. = 0', async () => {
      prismaMock.movie.findMany.mockResolvedValue([])
      const result = await movieAdapter.getMovies()
      expect(result.data).toEqual([])
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1)
    })

    it('should handle get movies error', async () => {
      prismaMock.movie.findMany.mockRejectedValue(
        new Error('Failed to retrieve movies')
      )
      const result = await movieAdapter.getMovies()
      expect(result.data).toBeNull()
      expect(prismaMock.movie.findMany).toHaveBeenCalledTimes(1)
    })
  })

  describe('getMovieById', () => {
    it('should be able to get movie by id', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(mockMovie)
      const result = await movieAdapter.getMovieById(mockMovie.id)
      // @ts-expect-error it should return data
      expect(result.data).toEqual(mockMovie)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      })
    })

    it('should return null when id is matched', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null)
      const result = await movieAdapter.getMovieById(mockMovie.id)
      // @ts-expect-error it should return null
      expect(result.data).toBeNull()
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      })
    })

    it('should handle get movie by id error', async () => {
      prismaMock.movie.findUnique.mockRejectedValue(
        new Error('Failed to retrieve movie by id')
      )
      const result = await movieAdapter.getMovieById(mockMovie.id)
      // @ts-expect-error it should return null
      expect(result.data).toBeNull()
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      })
    })
  })

  describe('getMovieByTitle', () => {
    it('should be able to get movie by title', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(mockMovie)
      const result = await movieAdapter.getMovieByTitle(mockMovie.title)
      expect(result.data).toEqual(mockMovie)
      expect(prismaMock.movie.findFirst).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { title: mockMovie.title }
      })
    })

    it('should return null when no title is matched', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(null)
      const result = await movieAdapter.getMovieByTitle(mockMovie.title)
      expect(result.data).toBeNull()
      expect(prismaMock.movie.findFirst).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { title: mockMovie.title }
      })
    })

    it('should handle get movie by title error ', async () => {
      prismaMock.movie.findFirst.mockRejectedValue(
        new Error('Failed to retrieve movie by title')
      )
      const result = await movieAdapter.getMovieByTitle(mockMovie.title)
      expect(result.data).toBeNull()
      expect(prismaMock.movie.findFirst).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { title: mockMovie.title }
      })
    })
  })

  describe('deleteMovieById', () => {
    const id = 999

    it('should be able to delete movie by id', async () => {
      prismaMock.movie.delete.mockResolvedValue(mockMovie)
      const result = await movieAdapter.deleteMovieById(mockMovie.id)
      const expectResult = {
        status: 200,
        message: `Movie with ID ${mockMovie.id} has been deleted`
      }
      expect(result).toEqual(expectResult)
      expect(prismaMock.movie.delete).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.delete).toHaveBeenCalledWith({
        where: { id: mockMovie.id }
      })
    })

    it('should return error when movie is not found', async () => {
      prismaMock.movie.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Movie not found', {
          code: 'P2025',
          clientVersion: '1'
        })
      )
      const result = await movieAdapter.deleteMovieById(id)
      const expectResult = {
        status: 404,
        error: `Movie with ID ${id} not found`
      }
      expect(result).toStrictEqual(expectResult)
      expect(prismaMock.movie.delete).toHaveBeenCalledWith({
        where: { id: id }
      })
    })

    it('should handle delete movie by id error and rethrow error', async () => {
      const error = new Error('Unexpected error')
      prismaMock.movie.delete.mockRejectedValue(error)

      // Spy on the handleError method to ensure it's called
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleErrorSpy = jest.spyOn(movieAdapter as any, 'handleError')

      // Expect the method to throw the error
      await expect(movieAdapter.deleteMovieById(id)).rejects.toThrow(
        'Unexpected error'
      )
      expect(handleErrorSpy).toHaveBeenCalledWith(error)
      expect(prismaMock.movie.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('addMovie', () => {
    const id = 1
    const movieDataWithoutId = generateMovieWithoutId()
    const movieData = { id, ...movieDataWithoutId }

    it('should be able to add movie without id', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null)
      prismaMock.movie.findFirst.mockResolvedValue(null)
      prismaMock.movie.create.mockResolvedValue(movieData)

      const result = await movieAdapter.addMovie(movieDataWithoutId)
      const expectResult = { status: 201, data: movieData }
      expect(result).toEqual(expectResult)
      expect(prismaMock.movie.create).toHaveBeenCalledWith({
        data: movieDataWithoutId
      })
    })

    it('should be able to add movie with id', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null)
      prismaMock.movie.findFirst.mockResolvedValue(null)
      prismaMock.movie.create.mockResolvedValue(movieData)

      const result = await movieAdapter.addMovie(movieDataWithoutId, id)
      const expectResult = { status: 201, data: movieData }
      expect(result).toEqual(expectResult)
      expect(prismaMock.movie.create).toHaveBeenCalledWith({ data: movieData })
    })

    it('should return conflict when movie with identical id exists', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(movieData)
      const result = await movieAdapter.addMovie(movieDataWithoutId, id)
      const expectResult = {
        status: 409,
        error: `Movie with ID ${movieData.id} already exists`
      }
      expect(result).toEqual(expectResult)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id }
      })
    })

    it('should return conflict when movie with identical title exists', async () => {
      prismaMock.movie.findFirst.mockResolvedValue(movieData)
      const result = await movieAdapter.addMovie(movieDataWithoutId, id)
      const expectResult = {
        status: 409,
        error: `Movie with title ${movieData.title} already exists`
      }
      expect(result).toEqual(expectResult)
      expect(prismaMock.movie.findFirst).toHaveBeenCalledWith({
        where: { title: movieDataWithoutId.title }
      })
    })

    it('should handle add movie error', async () => {
      const error = new Error('Unexpected error')
      prismaMock.movie.findUnique.mockResolvedValue(null)
      prismaMock.movie.findFirst.mockResolvedValue(null)
      prismaMock.movie.create.mockRejectedValue(error)

      // @ts-nocheck please help me
      const handleErrorSpy = jest.spyOn(movieAdapter, 'handleError')
      const result = await movieAdapter.addMovie(movieDataWithoutId)
      const expectResult = { status: 500, error: 'Internal server error' }
      expect(result).toStrictEqual(expectResult)
      expect(handleErrorSpy).toHaveBeenCalledWith(error)
    })
  })

  describe('updateMovie', () => {
    const id = 2
    const existingMovie = {
      title: 'Kungfu Panda 1',
      year: 2020,
      id: id,
      rating: 4.5,
      director: 'Po the dragon warrior'
    }
    const updateMovieData = {
      title: 'Sifu',
      year: 2024,
      rating: 4.7,
      director: 'Fisu'
    }
    const updatedMovie = { id, ...updateMovieData }

    it('should be able to update movie', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(existingMovie)
      prismaMock.movie.update.mockResolvedValue(updatedMovie)

      const result = await movieAdapter.updateMovie(updateMovieData, id)
      const expectResult = { status: 200, data: updatedMovie }
      expect(result).toStrictEqual(expectResult)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id }
      })
      expect(prismaMock.movie.update).toHaveBeenCalledWith({
        where: { id },
        data: updateMovieData
      })
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1)
      expect(prismaMock.movie.update).toHaveBeenCalledTimes(1)
    })

    it('should return 404 when movie is not found', async () => {
      prismaMock.movie.findUnique.mockResolvedValue(null)
      const result = await movieAdapter.updateMovie(updateMovieData, id)
      const expectResult = {
        status: 404,
        error: `Movie with ID ${id} not found`
      }
      expect(result).toStrictEqual(expectResult)
      expect(prismaMock.movie.findUnique).toHaveBeenCalledWith({
        where: { id }
      })
      expect(prismaMock.movie.findUnique).toHaveBeenCalledTimes(1)
    })

    it('should handle update movie error', async () => {
      const error = new Error('Unexpected error')
      prismaMock.movie.findUnique.mockResolvedValue(existingMovie)
      prismaMock.movie.update.mockRejectedValue(error)

      const handleErrorSpy = jest.spyOn(movieAdapter, 'handleError')
      const result = await movieAdapter.updateMovie(updateMovieData, id)
      const expectResult = { status: 500, error: 'Internal server error' }
      expect(result).toStrictEqual(expectResult)
      expect(handleErrorSpy).toHaveBeenCalledWith(error)
    })
  })
})
