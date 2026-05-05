export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export type CategoryListResponse = Category[];

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export interface CategoryCardViewModel {
  id: string;
  name: string;
  transactionCount: number;
}