import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryApi, categoryQueryKeys } from "@/entities/category";

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => categoryApi.deleteCategory(categoryId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.list(),
      });
    },
  });
}