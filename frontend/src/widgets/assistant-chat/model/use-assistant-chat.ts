import {
  DEFAULT_SUGGESTIONS,
  INITIAL_ASSISTANT_MESSAGE,
  assistantApi,
  type AssistantMessage,
} from '@/entities/assistant';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';

function createMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useAssistantChat() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chatMutation = useMutation({
    mutationFn: assistantApi.sendMessage,
  });

  const submitMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || chatMutation.isPending) return;

    setInputValue('');
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: 'user', content: message },
    ]);

    chatMutation.mutate(
      { message },
      {
        onSuccess: (data) => {
          setMessages((current) => [
            ...current,
            { id: createMessageId(), role: 'assistant', content: data.reply },
          ]);
          setSuggestions(data.suggestions.length > 0 ? data.suggestions : DEFAULT_SUGGESTIONS);
        },
        onError: () => {
          setMessages((current) => [
            ...current,
            {
              id: createMessageId(),
              role: 'assistant',
              content: 'Mình chưa lấy được dữ liệu lúc này. Hãy kiểm tra backend rồi thử lại.',
            },
          ]);
        },
      }
    );
  };

  const handleReset = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setInputValue('');
    chatMutation.reset();
  };

  return {
    inputValue,
    setInputValue,
    messages,
    suggestions,
    bottomRef,
    chatMutation,
    submitMessage,
    handleReset,
  };
}
