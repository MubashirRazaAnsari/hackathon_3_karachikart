import { type SchemaTypeDefinition } from 'sanity'
import newProduct from './newProduct'
import secondhandProduct from './secondhandProduct'
import order from './order'
import review from './review'
import customer from './customer'
import seller from './seller'
import serviceProvider from './serviceProvider'
import services from './services'
import category from './category'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [newProduct,user, secondhandProduct , order , review , customer ,seller ,serviceProvider, services ,category ],
}
