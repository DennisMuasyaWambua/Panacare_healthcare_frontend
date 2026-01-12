/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress the browser is not defined error by setting this webpack config
  // This is a common error with Next.js when libraries assume browser environment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        module: false,
        browser: false, // This will prevent the "browser is not defined" error
      };
    }

    return config;
  },
  // Disable React StrictMode in development to prevent double mounting
  reactStrictMode: false,
};

export default nextConfig;
