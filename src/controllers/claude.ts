import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../config';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

const anthropic = new Anthropic({
  apiKey: CONFIG.CLAUDE.API_KEY,
});

export async function generateClaudeResponse(messages: ClaudeMessage[]): Promise<string> {
  if (!CONFIG.CLAUDE.API_KEY) {
    throw new Error('Claude API key is not set');
  }

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.CLAUDE.MODEL,
      max_tokens: 1000,
      system: "당신은 유능한 AI 코치입니다. 사용자의 목표 달성을 돕고 진행 상황을 추적하며 필요한 조언을 제공합니다.",
      messages: messages
    });

    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    return textContent || 'No text content found in response';
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
} 