export type AssistantIntent =
  | 'summary'
  | 'expense_by_category'
  | 'recent_transactions'
  | 'saving_advice'
  | 'help';

export interface AssistantChatRequest {
  message: string;
}

export interface AssistantChatResponse {
  reply: string;
  intent: AssistantIntent;
  suggestions: string[];
}

export interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}
