import { Category, CategoryCardViewModel } from './type';

export function toCategoryCardViewModel(
  category: Category,
  transactionCount = 0
): CategoryCardViewModel {
  return {
    id: category.id,
    name: category.name,
    transactionCount
  };
}
