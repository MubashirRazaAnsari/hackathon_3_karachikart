import { createClient } from 'next-sanity'
import { config } from './config'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // Set to false for write operations
  token: process.env.SANITY_API_TOKEN,
})

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-13',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published'
})
