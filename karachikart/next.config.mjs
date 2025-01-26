/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.sanity.io', 'fakestoreapi.com'],
      },
    jest: {
        setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts']
    }
};

export default nextConfig;
