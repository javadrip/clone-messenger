/** @type {import('next').NextConfig} */
const nextConfig = {
  // Seems to introduce bug in Image component in Avatar.tsx
  // experimental: {
  //   swcPlugins: [["next-superjson-plugin", {}]],
  // },
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
