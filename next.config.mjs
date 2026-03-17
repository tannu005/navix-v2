/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;