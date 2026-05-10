import { AssistantChatWidget } from '@/widgets/assistant-chat';

export function AssistantPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-6.5rem)] w-full max-w-full flex-col overflow-hidden px-4 py-5 lg:px-6">
      <div className="mb-5 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">AI Trợ lý tài chính</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hỏi nhanh về thu chi, danh mục và giao dịch từ dữ liệu của bạn.
        </p>
      </div>

      <AssistantChatWidget />
    </div>
  );
}