const Zernio = require("@zernio/node").default;
const envConfig = require("./env-config");

const zernio = new Zernio({
  apiKey: envConfig.ZERNIO_API_KEY,
  baseUrl: "https://zernio.com/api",
});

module.exports = zernio;
