import {
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi'
import {
  CreateMovieSchema,
  CreateMovieResponseSchema,
  ConflictMovieResponseSchema,
  GetMovieResponseSchema,
  MovieNotFoundResponseSchema,
  DeleteMovieResponseSchema,
  UpdateMovieSchema,
  UpdateMovieResponseSchema
} from '../@types/schema'
import type { ParameterObject } from 'openapi3-ts/oas31'

const registry = new OpenAPIRegistry()
registry.register('CreateMovieRequest', CreateMovieSchema)
registry.register('CreateMovieResponse', CreateMovieResponseSchema)
registry.register('ConflictMovieResponse', ConflictMovieResponseSchema)
registry.register('GetMovieResponse', GetMovieResponseSchema)
registry.register('MovieNotFoundResponse', MovieNotFoundResponseSchema)
registry.register('CreateMovieRequest', DeleteMovieResponseSchema)
registry.register('UpdateMovieRequest', UpdateMovieSchema)
registry.register('UpdateMovieResponse', UpdateMovieResponseSchema)

const MOVIE_ID_PARAM: ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Movie ID'
}

const MOVIE_NAME_PARAM: ParameterObject = {
  name: 'name',
  in: 'query',
  required: false,
  schema: { type: 'string' },
  description: 'Movie name to query'
}

registry.registerPath({
  method: 'get',
  path: '/',
  summary: 'Health check',
  responses: {
    200: {
      description: 'Server is running',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Server is running' }
            }
          }
        }
      }
    }
  }
})

registry.registerPath({
  method: 'get',
  path: '/movies',
  summary: 'Get all movies matches with query',
  description: 'Provide name to query specific movie',
  parameters: [MOVIE_NAME_PARAM],
  responses: {
    200: {
      description: 'List of movies match with query',
      content: {
        'application/json': {
          schema: GetMovieResponseSchema
        }
      }
    },
    404: {
      description: 'No movie matches with query',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
})

registry.registerPath({
  method: 'get',
  path: '/movies/{id}',
  summary: 'Get all movies matches with provided ID',
  description: 'Provide ID to query specific movie',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'List of movies match with provided ID',
      content: {
        'application/json': {
          schema: GetMovieResponseSchema
        }
      }
    },
    404: {
      description: 'No movie matches with query',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
})

registry.registerPath({
  method: 'post',
  path: '/movies',
  summary: 'Add movie into system',
  description: 'Add movie into movie database',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMovieSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Add movie into system successfully',
      content: {
        'application/json': {
          schema: CreateMovieResponseSchema
        }
      }
    },
    400: {
      description: 'Invalid request body',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      }
    },
    409: {
      description: 'Movie has conflicts with existing one',
      content: {
        'application/json': {
          schema: ConflictMovieResponseSchema
        }
      }
    },
    500: { description: 'Internal server error' }
  }
})

registry.registerPath({
  method: 'delete',
  path: '/movies/{id}',
  summary: 'Delete movie from system',
  description: 'Delete movie from movie database',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'Delete movie with id {id} has been deleted',
      content: {
        'application/json': {
          schema: DeleteMovieResponseSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    },
    500: { description: 'Internal server error' }
  }
})

registry.registerPath({
  method: 'put',
  path: '/movies/{id}',
  summary: 'Update movie detail',
  description: 'Update movie detail',
  parameters: [MOVIE_ID_PARAM],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateMovieSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie with id {id} has been updated',
      content: {
        'application/json': {
          schema: UpdateMovieResponseSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    },
    500: { description: 'Internal server error' }
  }
})

const generator = new OpenApiGeneratorV31(registry.definitions)

export const openApiDec = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Movie API',
    version: '0.0.1',
    description: 'API for managing movie'
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local development server' },
    {
      url: 'https://movie-api.example.com',
      description: 'Production development server'
    }
  ]
})
