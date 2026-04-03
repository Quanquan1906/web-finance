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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="h-11 px-4 text-xs font-medium text-slate-500">
              Ghi chú
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium text-slate-500">
              Danh mục
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium text-slate-500">
              Ngày
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-medium text-slate-500">
              Số tiền
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-medium text-slate-500">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-sm text-slate-500"
              >
                Chưa có giao dịch nào
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => {
              const category = categoryMap.get(transaction.category_id);

              return (
                <TableRow key={transaction.id} className="hover:bg-slate-50/60">
                  <TableCell className="px-4 py-4 text-sm font-medium text-slate-800">
                    {transaction.note || "-"}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <TransactionCategoryBadge
                      name={category?.name}
                      icon={category?.icon}
                      color={category?.color}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-4 text-sm text-slate-500">
                    {formatDate(transaction.date)}
                  </TableCell>

                  <TableCell className="px-4 py-4 text-right">
                    <TransactionAmount
                      amount={transaction.amount}
                      type={transaction.type}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => onEdit?.(transaction)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                        onClick={() => onDelete?.(transaction)}
                      >
                        <Trash2 className="size-4" />
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