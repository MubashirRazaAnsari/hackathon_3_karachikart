import { createClient } from 'next-sanity'
import { config } from './config'

export const client = createClient(config)

export const serverClient = createClient({
  ...config,
  token: process.env.SANITY_API_TOKEN,
})
