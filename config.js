// Configuration for the backend
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  mongodbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/manvith-charcoal',
  jwtSecret: process.env.JWT_SECRET || 'manvith-charcoal-secret-key-2024',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;

