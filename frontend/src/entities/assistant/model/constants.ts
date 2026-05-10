import type { AssistantMessage } from './types';

export const DEFAULT_SUGGESTIONS: string[] = [
  'Tổng thu chi tháng này',
  'Danh mục nào tốn tiền nhất?',
  'Giao dịch gần đây',
  'Gợi ý tiết kiệm cho tôi',
];

export const INITIAL_ASSISTANT_MESSAGE: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào, mình là trợ lý tài chính. Bạn có thể hỏi về tổng thu chi, danh mục chi tiêu hoặc giao dịch gần đây.',
};
