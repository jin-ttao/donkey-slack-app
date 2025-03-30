import { App } from '@slack/bolt';
import { User } from '../models/User';
import { CONFIG } from '../config';

const generateGoogleAuthUrl = (slackUserId: string, teamId: string) => {
  const state = `${teamId}:${slackUserId}`;
  const redirectUri = `${CONFIG.BASE_URL}/auth/google/callback`;
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CONFIG.GOOGLE.CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=email%20profile&` +
    `state=${encodeURIComponent(state)}`;
};

const handleAuthFlow = async (userId: string, teamId: string, say: any) => {
  const user = await User.findOne({
    workspaces: teamId
  });

  if (!user) {
    const authUrl = generateGoogleAuthUrl(userId, teamId);
    await say({
      text: `안녕하세요! <@${userId}>님, 서비스 이용을 위해 Google 계정으로 로그인이 필요합니다.`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `안녕하세요! <@${userId}>님,\n서비스 이용을 위해 Google 계정으로 로그인이 필요합니다.`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Google로 로그인',
                emoji: true
              },
              url: authUrl,
              style: 'primary'
            }
          ]
        }
      ]
    });
    return true;
  }
  return false;
};

export const registerEventHandlers = (app: App) => {
  app.event('app_mention', async ({ event, say }) => {
    try {
      const needsAuth = await handleAuthFlow(event.user || '', event.team || '', say);
      if (!needsAuth) {
        await say({
          text: `안녕하세요! <@${event.user}>님, 무엇을 도와드릴까요?`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `안녕하세요! <@${event.user}>님, 무엇을 도와드릴까요?`
              }
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error handling app_mention event:', error);
    }
  });

  app.message(async ({ message, context, say }) => {
    try {
      if ('channel_type' in message && 
          message.channel_type === 'im' && 
          'user' in message && 
          typeof message.user === 'string') {
        const teamId = context.teamId || 'unknown';
        const needsAuth = await handleAuthFlow(message.user, teamId, say);
        if (!needsAuth) {
          await say('어떤 도움이 필요하신가요?');
        }
      }
    } catch (error) {
      console.error('Error handling message event:', error);
    }
  });
}; 
