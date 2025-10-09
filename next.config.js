/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
  remotePatterns: [
{
protocol: "https",
hostname: "*.googleusercontent.com",
},
{
protocol: "https",
hostname: "dawid-food-ordering.s3.amazonaws.com",
},
{
protocol: "https",
hostname: "images.unsplash.com", // ✅ added Unsplash support
},
{
protocol: "https",
hostname: "cdn.pixabay.com", // ✅ optional - good to have if you use Pixabay
},
{
protocol: "https",
hostname: "res.cloudinary.com", // ✅ optional - for Cloudinary images
},
],
},
};

module.exports = nextConfig;
