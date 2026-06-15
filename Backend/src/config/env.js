require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error(" JWT_SECRET is required in .env file");
}

if (!process.env.MONGODB_URI) {
  throw new Error(" MONGODB_URI is required in .env file");
}

if (!process.env.PORT) {
  throw new Error(" PORT is required in .env file");
}

const envConfig = {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
};

module.exports = envConfig;
