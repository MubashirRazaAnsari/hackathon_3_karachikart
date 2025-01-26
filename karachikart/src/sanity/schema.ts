import { type SchemaTypeDefinition } from 'sanity'
import review from './schemaTypes/review'
// ... other imports ...

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    review,
    // ... other types ...
  ],
}
