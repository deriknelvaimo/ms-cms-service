import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsApi, type CmsPage, type CreateCmsPage, type UpdateCmsPage } from "@/lib/api";

export function useCmsPages(params?: {
  page?: number;
  perPage?: number;
  storeId?: number;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ["/api/cms-pages", params],
    queryFn: () => cmsApi.getCmsPages(params),
  });
}

export function useCmsPage(id: number) {
  return useQuery({
    queryKey: ["/api/cms-pages", id],
    queryFn: () => cmsApi.getCmsPage(id),
    enabled: !!id,
  });
}

export function useCreateCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCmsPage) => cmsApi.createCmsPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages/stats"] });
    },
  });
}

export function useUpdateCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCmsPage }) =>
      cmsApi.updateCmsPage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages/stats"] });
    },
  });
}

export function useDeleteCmsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cmsApi.deleteCmsPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms-pages/stats"] });
    },
  });
}

export function useCmsStats() {
  return useQuery({
    queryKey: ["/api/cms-pages/stats"],
    queryFn: () => cmsApi.getStats(),
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ["/api/health"],
    queryFn: () => cmsApi.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
