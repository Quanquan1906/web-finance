import { cn } from "@/shared/lib/utils";

interface TransactionCategoryBadgeProps {
  name?: string;
  color?: string;
  icon?: string;
}

export function TransactionCategoryBadge({
  name,
  color,
  icon,
}: TransactionCategoryBadgeProps) {
  const isTailwindClass = Boolean(color?.startsWith("bg-"));

  if (isTailwindClass) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium leading-none text-white",
          color || "bg-slate-400"
        )}
      >
        <span className="text-[10px]">{icon || "•"}</span>
        <span>{name || "Không rõ"}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium leading-none text-white"
      style={{ backgroundColor: color || "#94a3b8" }}
    >
      <span className="text-[10px]">{icon || "•"}</span>
      <span>{name || "Không rõ"}</span>
    </span>
  );
}