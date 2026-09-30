import type { NextConfig } from "next";

const isStaticExport = process.env.APP500_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
