import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CATEGORY_ICON_OPTIONS } from "../model/categoryIconptions";


interface CategoryIconSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CategoryIconSelect({
  value,
  onChange,
  placeholder = "Chọn icon",
}: CategoryIconSelectProps) {
  const selectedOption = CATEGORY_ICON_OPTIONS.find(
    (option) => option.value === value,
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedOption.value}</span>
              <span>{selectedOption.label}</span>
            </div>
          ) : null}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {CATEGORY_ICON_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span className="text-base">{option.value}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}