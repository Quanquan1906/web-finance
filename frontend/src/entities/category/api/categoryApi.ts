import { apiClient } from '@/shared/api';
import type {
  Category,
  CategoryKind,
  CreateCategoryInput,
  UpdateCategoryInput
} from '../model/type';

export const categoryApi = {
  async getCategories(kind?: CategoryKind): Promise<Category[]> {
    const params = kind ? { kind } : {};
    const { data } = await apiClient.get<Category[]>('/categories', { params });
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

  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(`/categories/${categoryId}`);
  }
};
