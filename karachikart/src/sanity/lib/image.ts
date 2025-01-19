import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder({
  projectId: 'cw0d40u9',
  dataset: 'production',
})

export const urlFor = (source: any) => {
  return builder.image(source)
}
