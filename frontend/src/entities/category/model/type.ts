export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  items: Category[];
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
}

export interface CategoryCardViewModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  transactionCount: number;
}