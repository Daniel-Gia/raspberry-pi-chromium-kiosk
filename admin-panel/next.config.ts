import os from "node:os";
import type { NextConfig } from "next";

const localNetworkAddresses = Object.values(os.networkInterfaces()).flatMap((interfaces) =>
  interfaces
    ?.filter((networkInterface) => networkInterface.family === "IPv4" && !networkInterface.internal)
    .map((networkInterface) => networkInterface.address) ?? [],
);

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost", ...localNetworkAddresses],
};

export default nextConfig;
