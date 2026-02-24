'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api/products.api';

export function useProducts(params?: any) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useMyProducts(params?: any) {
  return useQuery({
    queryKey: ['my-products', params],
    queryFn: () => productsApi.getMyProducts(params),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success('Product created successfully');
      qc.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to create product'),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully');
      qc.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update product'),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success('Product deleted');
      qc.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete product'),
  });
}