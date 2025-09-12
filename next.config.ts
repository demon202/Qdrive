import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental:{
    serverActions: {
      bodySizeLimit: '100MB',
    },
    
  },
 images : {
  remotePatterns: [
    {protocol:'https',
    hostname: 'cdn.pixabay.com'}, 
    {protocol:'https',
    hostname: 'cloud.appwrite.io'},
    {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      },
  ]}
};

export default nextConfig;
