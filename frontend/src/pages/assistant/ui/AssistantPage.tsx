import { assistantApi, type AssistantMessage } from '@/entities/assistant';
import { useSpeechRecognition } from '@/shared/hooks/use-speech-recognition';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { Bot, Loader2, Mic, MicOff, RotateCcw, Send, Sparkles } from 'lucide-react';
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
  return content.split('\n').map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function AssistantPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([initialAssistantMessage]);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { error: speechError, isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition();

  const chatMutation = useMutation({
    mutationFn: assistantApi.sendMessage,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, chatMutation.isPending]);

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
    <div className="mx-auto flex h-[calc(100vh-6.5rem)] w-full max-w-full flex-col overflow-hidden px-4 py-5 lg:px-6">
      <div className="mb-5 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            AI Trợ lý tài chính
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hỏi nhanh về thu chi, danh mục và giao dịch từ dữ liệu của bạn.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="w-fit rounded-xl bg-white shadow-sm"
        >
          <RotateCcw className="size-4" />
          Làm mới
        </Button>
      </div>

      <section className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-gradient-to-b from-emerald-50 via-white to-white p-6 lg:block">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-900/10">
            <Bot className="size-6" />
          </div>

          <div className="mt-5">
            <h2 className="text-lg font-semibold text-slate-950">Bạn có thể hỏi</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Chọn nhanh một câu hỏi mẫu hoặc nhập câu hỏi của bạn ở khung chat.
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-left text-sm font-medium text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                disabled={chatMutation.isPending}
                onClick={() => submitMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col bg-slate-50/70">
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white/95 px-5 py-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Sparkles className="size-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-950">Cuộc trò chuyện</h2>
              <p className="truncate text-xs text-muted-foreground">
                Dữ liệu được lấy từ giao dịch trong tài khoản hiện tại.
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => {
              const isUser = message.role === 'user';

              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] break-words rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[72%] ${
                      isUser
                        ? 'rounded-br-lg bg-emerald-600 text-white shadow-emerald-900/10'
                        : 'rounded-bl-lg border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              );
            })}

            {chatMutation.isPending ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-3xl rounded-bl-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <Loader2 className="size-4 animate-spin text-emerald-600" />
                  Đang phân tích dữ liệu...
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white/95 p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={chatMutation.isPending}
                  onClick={() => submitMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {speechError ? <p className="mb-2 text-xs text-red-600">{speechError}</p> : null}

            <form className="flex items-end gap-2 sm:gap-3" onSubmit={handleSubmit}>
              <Textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage(inputValue);
                  }
                }}
                placeholder="Ví dụ: Tháng này tôi chi bao nhiêu?"
                className="max-h-28 min-h-12 resize-none rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-inner focus-visible:ring-emerald-500"
                disabled={chatMutation.isPending}
              />

              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className={`shrink-0 rounded-2xl bg-white shadow-sm ${
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
                className="shrink-0 rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-700"
                disabled={!inputValue.trim() || chatMutation.isPending}
                aria-label="Gửi câu hỏi"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}