import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
})

export const urlFor = (source: any) => {
  return builder.image(source)
}
