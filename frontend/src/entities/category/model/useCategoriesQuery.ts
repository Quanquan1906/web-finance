import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { categoryQueryKeys } from './query-keys';
import type { CategoryKind } from './type';

export function useCategoriesQuery(kind?: CategoryKind) {
  return useQuery({
    queryKey: categoryQueryKeys.list(kind),
    queryFn: () => categoryApi.getCategories(kind),
  });
}
