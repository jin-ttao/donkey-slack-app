import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/donkey-slack-app',
  },
  SLACK: {
    BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
    SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET || '',
    APP_TOKEN: process.env.SLACK_APP_TOKEN || '',
    CLIENT_ID: process.env.SLACK_CLIENT_ID || '',
    CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET || '',
    REDIRECT_URI: process.env.SLACK_REDIRECT_URI || 'http://localhost:3000/auth/slack/callback',
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  },
  CLAUDE: {
    API_KEY: process.env.ANTHROPIC_API_KEY || '',
    MODEL: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
