import { createClient } from '@sanity/client';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { categories } from '../data/new-products';
import { newProducts } from '../data/new-products';
import { secondhandProducts } from '../data/secondhand-products';
import { sellers } from '../data/sellers';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-03-13',
  useCdn: false
});

async function uploadImageToSanity(imageUrl: string) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop()
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

async function importData() {
  try {
    // Upload sellers first
    console.log('Uploading sellers...');
    for (const seller of sellers) {
      console.log(`Processing seller: ${seller.name}`);
      const sanitySeller = {
        _type: 'seller',
        _id: seller._id,
        sellerId: seller.sellerId,
        name: seller.name,
        email: seller.email,
        phone: seller.phone
      };
      await client.createIfNotExists(sanitySeller);
      console.log(`Seller uploaded successfully: ${seller.name}`);
    }

    // Upload categories
    console.log('Uploading categories...');
    for (const category of categories) {
      console.log(`Processing category: ${category.name}`);
      const sanityCategory = {
        _type: 'category',
        _id: category.categoryId,
        name: category.name,
        subcategories: category.subcategories,
        tags: category.tags
      };
      await client.createIfNotExists(sanityCategory);
      console.log(`Category uploaded successfully: ${category.name}`);
    }

    // Upload new products
    console.log('Uploading new products...');
    for (const product of newProducts) {
      console.log(`Processing new product: ${product.name}`);
      let imageRef = null;
      if (product.productImage) {
        imageRef = await uploadImageToSanity(product.productImage);
      }

      const sanityProduct = {
        _type: 'newProduct',
        _id: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        tags: product.tags,
        category: {
          _type: 'reference',
          _ref: categories.find(c => c.name === product.category)?.categoryId || 'uncategorized'
        },
        sellerId: {
          _type: 'reference',
          _ref: product.sellerId
        },
        productImage: imageRef ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageRef,
          },
        } : undefined,
      };

      console.log('Uploading new product to Sanity:', sanityProduct.name);
      await client.createIfNotExists(sanityProduct);
      console.log(`New product uploaded successfully: ${product.name}`);
    }

    // Upload secondhand products
    console.log('Uploading secondhand products...');
    for (const product of secondhandProducts) {
      console.log(`Processing secondhand product: ${product.name}`);
      let imageRef = null;
      if (product.productImage) {
        imageRef = await uploadImageToSanity(product.productImage);
      }

      const sanityProduct = {
        _type: 'secondhandProduct',
        _id: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        condition: product.condition,
        tags: product.tags,
        category: {
          _type: 'reference',
          _ref: categories.find(c => c.name === product.category)?.categoryId || 'uncategorized'
        },
        sellerId: {
          _type: 'reference',
          _ref: product.sellerId
        },
        productImage: imageRef ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageRef,
          },
        } : undefined,
      };

      console.log('Uploading secondhand product to Sanity:', sanityProduct.name);
      await client.createIfNotExists(sanityProduct);
      console.log(`Secondhand product uploaded successfully: ${product.name}`);
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Run the import
importData().catch(console.error); 