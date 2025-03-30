export const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/donkey',
  SLACK: {
    BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    APP_TOKEN: process.env.SLACK_APP_TOKEN,
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const; 
