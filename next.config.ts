import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Aria was previously called Jarvis. Preserve any existing inbound
      // links by redirecting /projects/jarvis → /projects/aria.
      {
        source: "/projects/jarvis",
        destination: "/projects/aria",
        permanent: true,
      },
      // BoulderBuddy was previously slugged "bouldering-app".
      {
        source: "/projects/bouldering-app",
        destination: "/projects/boulder-buddy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
