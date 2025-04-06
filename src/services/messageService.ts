import { Message, MessageType } from '../models/Message';

export interface MessageData {
  userId: string;
  content: string;
  threadId: string;
  type: MessageType;
  metadata?: Record<string, any>;
}

export async function saveMessage(data: MessageData) {
  const message = new Message(data);
  await message.save();
  return message;
}

export async function saveMessages(messages: MessageData[]) {
  return Promise.all(messages.map(saveMessage));
} 