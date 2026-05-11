import { MessageBubble } from '@/entities/assistant';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Bot, Loader2, RotateCcw, Send, Sparkles } from 'lucide-react';
import { type FormEvent, useEffect } from 'react';
import { useAssistantChat } from '../model/use-assistant-chat';

export function AssistantChatWidget() {
  const {
    inputValue,
    setInputValue,
    messages,
    suggestions,
    bottomRef,
    chatMutation,
    submitMessage,
    handleReset,
  } = useAssistantChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, chatMutation.isPending, bottomRef]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(inputValue);
  };

  return (
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

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-950">Cuộc trò chuyện</h2>
            <p className="truncate text-xs text-muted-foreground">
              Dữ liệu được lấy từ giao dịch trong tài khoản hiện tại.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="shrink-0 rounded-xl bg-white shadow-sm"
          >
            <RotateCcw className="size-4" />
            Làm mới
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

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
  );
}
