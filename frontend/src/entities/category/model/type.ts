export type CategoryKind = 'income' | 'expense';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  kind: CategoryKind;
  created_at: string;
  transaction_count: number;
}

export type CategoryListResponse = Category[];

export interface CreateCategoryInput {
  name: string;
  kind: CategoryKind;
}

export interface UpdateCategoryInput {
  name: string;
}

export interface CategoryCardViewModel {
  id: string;
  name: string;
  kind: CategoryKind;
  transaction_count: number;
}