export const DHL_CONFIG = {
  API_KEY: process.env.DHL_API_KEY!,
  API_SECRET: process.env.DHL_API_SECRET!,
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.dhl.com'
    : 'https://api-sandbox.dhl.com',
  VERSION: 'v2', // API version
}; 