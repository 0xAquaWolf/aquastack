import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../../'), // Point to monorepo root
  },
  transpilePackages: ['@svq/ui', '@svq/shared'], // Transpile shared packages
}

export default nextConfig
