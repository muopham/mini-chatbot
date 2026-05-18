/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ẩn X-Powered-By header để giảm information disclosure (security)
  poweredByHeader: false,

  // Bật compression (default true, explicit để rõ ràng)
  compress: true,

  images: {
    // Hỗ trợ modern image formats — browser sẽ tự chọn format tốt nhất
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  experimental: {
    // Tối ưu tree-shaking cho lucide-react — giảm bundle size
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
