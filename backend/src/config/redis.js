// src/config/redis.js
const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

client.on('error', (err) => console.error('❌ Redis Client Error:', err));

(async () => {
  await client.connect();
  console.log('✅ Connected to Redis Cloud');
})();

module.exports = client;
