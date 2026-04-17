import { Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface CategoryOption {
  id: string;
  name: string;
}

interface TransactionsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: CategoryOption[];
}

export function TransactionsToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm xl:flex-row xl:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo ghi chú..."
          className="h-10 rounded-xl border-border bg-background pl-10 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="h-10 min-w-45 rounded-xl border-border text-sm shadow-none focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Tất cả danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
