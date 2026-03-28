import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  categoryApi,
  categoryQueryKeys,
  type UpdateCategoryInput,
} from "@/entities/category";

interface EditCategoryParams {
  categoryId: string;
  payload: UpdateCategoryInput;
}

export function useEditCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }: EditCategoryParams) =>
      categoryApi.updateCategory(categoryId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.list(),
      });
    },
  });
}