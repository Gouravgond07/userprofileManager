
const dotenv = require('dotenv');
const path = require('path')
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

let keys = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'dev', // it will be dev or prod
  serverPort: process.env.SERVER_PORT || 3000,
  BCRYPT_SALT: 12,
  mongodbConfig: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'dravya',
    user: process.env.MONGO_USER || '',
    pass: process.env.MONGO_PASS || '',
    MONGO_ENVIRONMENT: process.env.MONGO_ENVIRONMENT || 'dev'
  },
  jwtConfig: {
    expireDuration: process.env.JWT_EXPIRE_DURATION || '1h',
    secreteKey: 'secreat'
  },
  rootDir: path.join(__dirname, '..'),
  s3Config: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
    bucket: process.env.bucket
  }
};

module.exports = keys;