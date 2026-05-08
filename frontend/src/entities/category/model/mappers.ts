import { Category, CategoryCardViewModel } from './type';

export function toCategoryCardViewModel(category: Category): CategoryCardViewModel {
  return {
    id: category.id,
    name: category.name,
    kind: category.kind,
    transaction_count: category.transaction_count,
  };
}
