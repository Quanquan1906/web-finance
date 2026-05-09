import { assistantApi, type AssistantMessage } from '@/entities/assistant';
import { useSpeechRecognition } from '@/shared/hooks/use-speech-recognition';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { Bot, Loader2, MessageCircle, Mic, MicOff, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

const DEFAULT_SUGGESTIONS = [
  'Tổng thu chi tháng này',
  'Danh mục nào tốn tiền nhất?',
  'Giao dịch gần đây',
  'Gợi ý tiết kiệm cho tôi',
];

const initialAssistantMessage: AssistantMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào, mình là trợ lý tài chính. Bạn có thể hỏi về tổng thu chi, danh mục chi tiêu hoặc giao dịch gần đây.',
};

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderMessageContent(content: string) {
  const lines = content.split('\n');

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function AssistantChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([initialAssistantMessage]);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { error: speechError, isListening, isSupported, startListening, stopListening } = useSpeechRecognition();

  const chatMutation = useMutation({
    mutationFn: assistantApi.sendMessage,
  });

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isOpen, messages, chatMutation.isPending]);

  const submitMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || chatMutation.isPending) return;

    setInputValue('');
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: 'user',
        content: message,
      },
    ]);

    chatMutation.mutate(
      { message },
      {
        onSuccess: (data) => {
          setMessages((current) => [
            ...current,
            {
              id: createMessageId(),
              role: 'assistant',
              content: data.reply,
            },
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([initialAssistantMessage]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setInputValue('');
    stopListening();
    chatMutation.reset();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening({
      onResult: (transcript) => {
        setInputValue((current) => {
          const trimmedCurrent = current.trim();
          return trimmedCurrent ? `${trimmedCurrent} ${transcript}` : transcript;
        });
      },
    });
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:right-6">
      {isOpen ? (
        <section className="absolute bottom-16 right-0 flex h-[560px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-background shadow-2xl shadow-emerald-950/15">
          <header className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 py-3 text-white">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/15">
              <Bot className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold">Trợ lý tài chính</h2>
              <p className="truncate text-xs text-emerald-50/85">Hỏi nhanh từ dữ liệu thu chi của bạn</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/15 hover:text-white"
              onClick={handleReset}
              aria-label="Làm mới hội thoại"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/15 hover:text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng trợ lý"
            >
              <X className="size-4" />
            </Button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col bg-slate-50/80">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => {
                const isUser = message.role === 'user';

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                        isUser
                          ? 'rounded-br-md bg-emerald-600 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                );
              })}

              {chatMutation.isPending ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                    <Loader2 className="size-4 animate-spin text-emerald-600" />
                    Đang phân tích dữ liệu...
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                    disabled={chatMutation.isPending}
                    onClick={() => submitMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {speechError ? <p className="mb-2 text-xs text-red-600">{speechError}</p> : null}

              <form className="flex items-end gap-2" onSubmit={handleSubmit}>
                <Textarea
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submitMessage(inputValue);
                    }
                  }}
                  placeholder="Hỏi về thu chi của bạn..."
                  className="max-h-28 min-h-11 resize-none rounded-xl bg-slate-50 text-sm"
                  disabled={chatMutation.isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className={`shrink-0 rounded-xl ${
                    isListening ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : ''
                  }`}
                  disabled={!isSupported || chatMutation.isPending}
                  onClick={handleVoiceInput}
                  title={isSupported ? 'Nhập bằng giọng nói' : 'Trình duyệt chưa hỗ trợ micro'}
                  aria-label={isListening ? 'Dừng nghe giọng nói' : 'Nhập bằng giọng nói'}
                >
                  {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
                <Button
                  type="submit"
                  size="icon-lg"
                  className="shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  aria-label="Gửi câu hỏi"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      <Button
        type="button"
        size="icon-lg"
        className="relative size-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/25 hover:bg-emerald-700"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Đóng trợ lý tài chính' : 'Mở trợ lý tài chính'}
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!isOpen ? (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-white text-emerald-600">
            <Sparkles className="size-3" />
          </span>
        ) : null}
      </Button>
    </div>
  );
}
