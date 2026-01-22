import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      // ✅ Tu bucket S3 exacto
      {
        protocol: "https",
        hostname: "ecommerce-suplementacionfsa-2025.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },

      // (Opcional) si en algún momento usás CloudFront
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
