import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  categoryApi,
  categoryQueryKeys,
  type CreateCategoryInput,
} from "@/entities/category";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryInput) =>
      categoryApi.createCategory(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.list(),
      });
    },
  });
}