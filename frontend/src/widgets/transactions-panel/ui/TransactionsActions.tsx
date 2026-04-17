import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface TransactionsActionsProps {
  onOpenCreate: () => void;
  onOpenNlp: () => void;
}

export function TransactionsActions({
  onOpenCreate,
  onOpenNlp,
}: TransactionsActionsProps) {
  return (
    <div className="flex w-full justify-end">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenNlp}
          className="h-10 rounded-xl border-violet-200 bg-violet-50 px-4 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100 hover:text-violet-700"
        >
          <Sparkles className="mr-2 size-4" />
          Nhập nhanh (AI)
        </Button>

        <Button
          type="button"
          onClick={onOpenCreate}
          className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Thêm giao dịch
        </Button>
      </div>
    </div>
  );
}