import { MovieService } from './movie-service'
import type { MovieRepository } from './movie-repository'
import type { Movie } from '@prisma/client'
import { generateMovieWithoutId } from './test-helpers/factories'

describe('Movie Service', () => {
  let movieService: MovieService
  let mockMovieReposity: jest.Mocked<MovieRepository>
  const id = 1
  const mockMovie: Movie = { ...generateMovieWithoutId(), id }

  beforeEach(() => {
    mockMovieReposity = {
      getMovies: jest.fn(),
      getMovieById: jest.fn(),
      getMovieByTitle: jest.fn(),
      getMovieByName: jest.fn(),
      deleteMovieById: jest.fn(),
      addMovie: jest.fn(),
      updateMovie: jest.fn()
    } as jest.Mocked<MovieRepository>
    movieService = new MovieService(mockMovieReposity)
  })

  // getMovies
  it('should get all movies', async () => {
    const expectedResult = {
      status: 200,
      data: [mockMovie],
      error: null
    }

    mockMovieReposity.getMovies.mockResolvedValue(expectedResult)
    const result = await movieService.getMovies()
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.getMovies).toHaveBeenCalledTimes(1)
  })

  // getMovieById
  it('should get movie by id', async () => {
    const expectedResult = {
      status: 200,
      data: mockMovie,
      error: null
    }

    mockMovieReposity.getMovieById.mockResolvedValue(expectedResult)
    const result = await movieService.getMovieById(id)
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledWith(id)
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledTimes(1)
  })

  it('should return null if movie not found by id', async () => {
    const expectedResult = {
      status: 404,
      data: null,
      error: `Movie with ID ${id} not found`
    }

    mockMovieReposity.getMovieById.mockResolvedValue(expectedResult)
    const result = await movieService.getMovieById(id)
    expect(result).toStrictEqual(expectedResult)
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledWith(id)
    expect(mockMovieReposity.getMovieById).toHaveBeenCalledTimes(1)
  })

  // getMovieByTitle
  it('should get movie by title', async () => {
    mockMovieReposity.getMovieByTitle.mockResolvedValue({
      status: 200,
      data: mockMovie,
      error: null
    })

    const result = await movieService.getMovieByTitle(mockMovie.title)
    // @ts-expect-error it should return with data
    expect(result.data).toEqual(mockMovie)
    expect(mockMovieReposity.getMovieByTitle).toHaveBeenCalledWith(
      mockMovie.title
    )
    expect(mockMovieReposity.getMovieByTitle).toHaveBeenCalledTimes(1)
  })

  it('should return null if movie not found by title', async () => {
    mockMovieReposity.getMovieByTitle.mockResolvedValue({
      status: 404,
      data: null,
      error: `Movie with title ${mockMovie.title} not found`
    })

    const result = await movieService.getMovieByTitle(mockMovie.title)
    // @ts-expect-error it should return null
    expect(result.data).toBeNull()
    expect(mockMovieReposity.getMovieByTitle).toHaveBeenCalledWith(
      mockMovie.title
    )
    expect(mockMovieReposity.getMovieByTitle).toHaveBeenCalledTimes(1)
  })

  // deleteMovieById
  it('should delete movie by id', async () => {
    const expectedResult = {
      status: 200,
      message: `Movie with ID ${id} has been deleted`
    }

    mockMovieReposity.deleteMovieById.mockResolvedValue(expectedResult)
    const result = await movieService.deleteMovieById(id)
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.deleteMovieById).toHaveBeenCalledWith(id)
    expect(mockMovieReposity.deleteMovieById).toHaveBeenCalledTimes(1)
  })

  it('should return 404 when to be deleted movie not found', async () => {
    const expectedResult = {
      status: 404,
      error: `Movie with ID ${id} not found`
    }

    mockMovieReposity.deleteMovieById.mockResolvedValue(expectedResult)
    const result = await movieService.deleteMovieById(id)
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.deleteMovieById).toHaveBeenCalledWith(id)
    expect(mockMovieReposity.deleteMovieById).toHaveBeenCalledTimes(1)
  })

  // addMovie
  it('should add movie', async () => {
    const expectedResult = {
      status: 201,
      data: mockMovie
    }

    mockMovieReposity.addMovie.mockResolvedValue(expectedResult)
    const result = await movieService.addMovie(mockMovie)
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.addMovie).toHaveBeenCalledWith(
      mockMovie,
      undefined
    )
    expect(mockMovieReposity.addMovie).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if addMovie validation fails', async () => {
    const expectResult = {
      status: 400,
      error:
        'year - Number must be greater than or equal to 1998, rating - Number must be less than or equal to 5'
    }

    const invalidMovieData = {
      title: 'The Beginning',
      year: 980,
      rating: 7.5,
      director: 'Jesus, son of Joseph'
    }

    const result = await movieService.addMovie(invalidMovieData)
    expect(result).toEqual(expectResult)
  })

  it('should update movie', async () => {
    const expectedResult = { status: 200, data: mockMovie }
    mockMovieReposity.updateMovie.mockResolvedValue(expectedResult)

    const result = await movieService.updateMovie({ title: 'AT' }, id)
    expect(result).toEqual(expectedResult)
    expect(mockMovieReposity.updateMovie).toHaveBeenCalledWith(
      { title: 'AT' },
      id
    )
    expect(mockMovieReposity.updateMovie).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if addMovie validation fails', async () => {
    const expectResult = {
      status: 400,
      error: 'title - String must contain at least 1 character(s)'
    }

    const invalidMovieData = { title: '' }

    const result = await movieService.updateMovie(invalidMovieData, id)
    expect(result).toEqual(expectResult)
  })
})
