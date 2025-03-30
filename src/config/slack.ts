import { App } from '@slack/bolt';
import { CONFIG } from './index';

export const slackApp = new App({
  token: CONFIG.SLACK.BOT_TOKEN,
  signingSecret: CONFIG.SLACK.SIGNING_SECRET,
  socketMode: true,
  appToken: CONFIG.SLACK.APP_TOKEN,
});
