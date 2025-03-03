module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://eth-mainnet.g.alchemy.com/v2/demo/:path*",
      },
    ];
  },
};
