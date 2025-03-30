import { App } from '@slack/bolt';

export const registerEventHandlers = (app: App) => {
  app.event('app_mention', async ({ event, say }) => {
    try {
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
    } catch (error) {
      console.error('Error handling app_mention event:', error);
    }
  });

  app.message(async ({ message, say }) => {
    try {
      if (message.channel_type === 'im') {
        await say('DM으로 메시지를 보내셨네요! 어떤 도움이 필요하신가요?');
      }
    } catch (error) {
      console.error('Error handling message event:', error);
    }
  });
}; 