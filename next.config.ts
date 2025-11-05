import type { NextConfig } from "next";

const gatewayUrl =
  process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || "https://ivory-famous-cardinal-181.mypinata.cloud";
const hostname = gatewayUrl.replace(/^https?:\/\//, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: [
        hostname ||
        "ivory-famous-cardinal-181.mypinata.cloud",
    ],
  },
};

export default nextConfig;
