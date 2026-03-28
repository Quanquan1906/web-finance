import { apiClient } from '@/shared/api';
import type {
  Category,
  CategoryListResponse,
  CreateCategoryInput,
  UpdateCategoryInput
} from '../model/type';

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<CategoryListResponse>('api/v1/categories');
    return data.items;
  },

  async createCategory(payload: CreateCategoryInput): Promise<Category> {
    const { data } = await apiClient.post<Category>('api/v1/categories', payload);
    return data;
  },

  async updateCategory(categoryId: string, payload: UpdateCategoryInput): Promise<Category> {
    const { data } = await apiClient.patch<Category>(`api/v1/categories/${categoryId}`, payload);
    return data;
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`api/v1/categories/${categoryId}`);
    return data;
  }
};
