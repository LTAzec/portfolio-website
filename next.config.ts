import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at the request config (default path ./i18n/request.ts).
const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
