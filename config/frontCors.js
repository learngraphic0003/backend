// For CommonJS syntax
const dotenv = require('dotenv');
dotenv.config();

const corsOptions = {
  origin: process.env.frontend_url,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { corsOptions };
