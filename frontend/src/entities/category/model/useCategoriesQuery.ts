import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { categoryQueryKeys } from './query-keys';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: categoryApi.getCategories
  });
}
