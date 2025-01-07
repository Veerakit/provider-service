import { truncateTable } from './prisma_helpers'

export async function globalSetup(): Promise<void> {
  console.log('Run global setup before start...')
  await truncateTable()
}
