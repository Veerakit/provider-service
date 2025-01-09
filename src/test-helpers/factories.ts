import { faker } from '@faker-js/faker'
import type { Movie } from '@prisma/client'

export const generateMovieWithoutId = (): Omit<Movie, 'id'> => {
  return {
    title: faker.lorem.words(3),
    year: faker.date.past({ years: 30 }).getFullYear(),
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
  }
}

export const generateMovieWithId = (): Movie => {
  return {
    id: faker.number.int({ min: 1, max: 9999 }),
    title: faker.lorem.words(3),
    year: faker.date.past({ years: 30 }).getFullYear(),
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
  }
}
