import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { CONFIG } from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { slackApp } from './config/slack';
import { registerEventHandlers } from './slack/events';
import authRouter from './routes/auth';

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

registerEventHandlers(slackApp);

app.get('/', (req, res) => {
  res.type('text/plain').send('Donkey Slack App is running!');
});

app.use(errorHandler);

(async () => {
  try {
    await slackApp.start();
    console.log('⚡️ Bolt app is running!');
    
    app.listen(CONFIG.PORT, () => {
      console.log(`Server is running on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error('Error starting Bolt app:', error);
    process.exit(1);
  }
})();
