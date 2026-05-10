import type { AssistantMessage } from '../model/types';

function renderContent(content: string) {
  return content.split('\n').map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

interface MessageBubbleProps {
  message: AssistantMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] break-words rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[72%] ${
          isUser
            ? 'rounded-br-lg bg-emerald-600 text-white shadow-emerald-900/10'
            : 'rounded-bl-lg border border-slate-200 bg-white text-slate-800'
        }`}
      >
        {renderContent(message.content)}
      </div>
    </div>
  );
}
