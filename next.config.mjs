/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/pashaslayer.github.io/' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pashaslayer.github.io/' : '',
  images: {
    unoptimized: true
  }
}

export default nextConfig