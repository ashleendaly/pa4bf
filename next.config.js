/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import withSerwistInit from "@serwist/next";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: true,
});

/** @type {import("next").NextConfig} */
const config = withSerwist({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/apy/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/apy/:path*"
            : "/apy/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/openapi.json"
            : "/api/openapi.json",
      },
    ];
  },
});

export default config;
