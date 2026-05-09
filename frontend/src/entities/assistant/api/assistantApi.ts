import { apiClient } from '@/shared/api';
import type { AssistantChatRequest, AssistantChatResponse } from '../model/types';

export const assistantApi = {
  sendMessage: async (payload: AssistantChatRequest) => {
    const { data } = await apiClient.post<AssistantChatResponse>('/ai/chat', payload);
    return data;
  },
};
