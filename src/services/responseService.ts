import { WebClient } from '@slack/web-api';
import { MessageType } from '../models/Message';
import { saveMessage } from './messageService';

export interface ResponseData {
  channel: string;
  threadId: string;
  userId: string;
  content: string;
  metadata?: Record<string, any>;
}

export async function sendResponse(client: WebClient, data: ResponseData) {
  if (!data.channel || !data.threadId || !data.userId) {
    throw new Error('Required fields are missing');
  }

  const response = await client.chat.postMessage({
    channel: data.channel,
    thread_ts: data.threadId,
    text: data.content
  });

  if (!response.ts) {
    throw new Error('Failed to get message timestamp');
  }

  await saveMessage({
    userId: 'AI_COACH',
    content: data.content,
    threadId: response.ts,
    type: MessageType.AI_COACH,
    metadata: data.metadata
  });

  return response;
}
