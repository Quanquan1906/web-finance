import { apiClient } from '@/shared/api';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput
} from '../model/type';

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  async createCategory(payload: CreateCategoryInput): Promise<Category> {
    const { data } = await apiClient.post<Category>('/categories', payload);
    return data;
  },

  async updateCategory(categoryId: string, payload: UpdateCategoryInput): Promise<Category> {
    const { data } = await apiClient.patch<Category>(`/categories/${categoryId}`, payload);
    return data;
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/categories/${categoryId}`);
    return data;
  }
};
