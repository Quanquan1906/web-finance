import { Pencil, Trash2 } from "lucide-react";

import type { Transaction } from "@/entities/transaction";
import { TransactionAmount } from "@/entities/transaction/ui/TransactionAmount";
import { TransactionCategoryBadge } from "@/entities/transaction/ui/TransactionCategoryBadge";
import { formatDate } from "@/shared/lib/formatDate";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

interface CategoryLite {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  categoryMap: Map<string, CategoryLite>;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  categoryMap,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-10 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ghi chú
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Danh mục
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ngày
            </TableHead>
            <TableHead className="h-10 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Số tiền
            </TableHead>
            <TableHead className="h-10 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                Chưa có giao dịch nào
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const category = categoryMap.get(transaction.category_id);

              return (
                <TableRow
                  key={transaction.id}
                  className="border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3.5 text-sm font-medium text-foreground">
                    {transaction.note || "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <TransactionCategoryBadge
                      name={category?.name}
                      icon={category?.icon}
                      color={category?.color}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 text-right">
                    <TransactionAmount
                      amount={transaction.amount}
                      type={transaction.type}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => onEdit?.(transaction)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete?.(transaction)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}