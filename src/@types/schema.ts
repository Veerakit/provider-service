import { number, z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

const movieSchema = z.object({
  id: z.number().int().openapi({ example: 1, description: 'Movie ID' }),
  title: z.string().openapi({ example: 'In time', description: 'Movie name' }),
  year: z
    .number()
    .int()
    .openapi({ example: 2024, description: 'Release year' }),
  rating: z.number().openapi({ example: 4.8, description: 'Rating' })
})

export const CreateMovieSchema = z
  .object({
    id: z.number().optional().openapi({ example: 1, description: 'Movie ID' }),
    title: z
      .string()
      .min(1)
      .openapi({ example: 'The Cat', description: 'Movie name' }),
    year: z
      .number()
      .int()
      .min(1998)
      .max(2025)
      .openapi({ example: 2012, description: 'Release year' }),
    rating: z.number().max(5.0).openapi({ example: 3.5, description: 'Rating' })
  })
  .openapi('CreateMovieRequest')

export const CreateMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 201, description: 'Created status code' }),
    data: movieSchema,
    error: z.string().optional().openapi({ description: 'Error message' })
  })
  .openapi('CreateMovieResponse')

export const ConflictMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 409, description: 'Conflict status code' }),
    error: z.string().optional().openapi({
      example: 'Movie already exists',
      description: 'Error message'
    })
  })
  .openapi('ConflictMovieResponse')

export const GetMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Success status code' }),
    data: z.union([
      movieSchema.nullable().openapi({
        example: { id: 2, title: 'The instance', year: 2024, rating: 4.2 },
        description: 'Movie detail || null if not found'
      }),
      z.array(movieSchema).openapi({
        example: [],
        description: 'List of Movie detail || empty array if not found'
      })
    ]),
    error: z.string().nullable().optional().openapi({
      description: 'Error message if an error occurred, otherwise null',
      example: null
    })
  })
  .openapi('GetMovieResponse')

export const MovieNotFoundResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 404, description: 'Not found response code' }),
    error: z.string().openapi({
      example: 'Movie not found',
      description: 'Movie not found error message'
    })
  })
  .openapi('MovieNotFoundResponse')

export const DeleteMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Success status code' }),
    message: z.string().openapi({
      example: 'Movie with ID {id} has been deleted',
      description: 'Delete movie message'
    })
  })
  .openapi('CreateMovieRequest')

export const UpdateMovieSchema = z
  .object({
    id: z
      .number()
      .int()
      .optional()
      .openapi({ example: 3, description: 'Movie ID' }),
    title: z
      .string()
      .min(1)
      .optional()
      .openapi({ example: 'On time', description: 'Movie name' }),
    year: z
      .number()
      .int()
      .optional()
      .openapi({ example: 2017, description: 'Release year' }),
    rating: number().optional().openapi({ example: 3.7, description: 'Raing' })
  })
  .openapi('UpdateMovieRequest')

export const UpdateMovieResponseSchema = z
  .object({
    status: z
      .number()
      .int()
      .openapi({ example: 200, description: 'Success status code' }),
    data: movieSchema.openapi({ description: 'updated movie detail' }),
    error: z.string().optional().openapi({ description: 'error message' })
  })
  .openapi('UpdateMovieResponse')
