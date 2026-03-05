// 'use client';

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { productsApi } from '@/lib/api/products.api';

// export function useProducts(params?: any) {
//   return useQuery({
//     queryKey: ['products', params],
//     queryFn: () => productsApi.getAll(params),
//   });
// }

// export function useProduct(id: string) {
//   return useQuery({
//     queryKey: ['product', id],
//     queryFn: () => productsApi.getById(id),
//     enabled: !!id,
//   });
// }

// export function useMyProducts(params?: any) {
//   return useQuery({
//     queryKey: ['my-products', params],
//     queryFn: () => productsApi.getMyProducts(params),
//   });
// }

// export function useCreateProduct() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: productsApi.create,
//     onSuccess: () => {
//       toast.success('Product created successfully');
//       qc.invalidateQueries({ queryKey: ['my-products'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to create product'),
//   });
// }

// export function useUpdateProduct() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: any }) =>
//       productsApi.update(id, data),
//     onSuccess: () => {
//       toast.success('Product updated successfully');
//       qc.invalidateQueries({ queryKey: ['my-products'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to update product'),
//   });
// }

// export function useDeleteProduct() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: productsApi.delete,
//     onSuccess: () => {
//       toast.success('Product deleted');
//       qc.invalidateQueries({ queryKey: ['my-products'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to delete product'),
//   });
// }

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
    mutationFn: async ({
      images,
      ...productData
    }: any & { images?: any[] }) => {
      // Step 1: Create the product WITHOUT images
      const result = await productsApi.create(productData);
      const productId = result.data.id;

      // Step 2: Upload each image to the product via separate endpoint
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await productsApi.addImage(productId, {
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            mediumUrl: img.mediumUrl || img.imageUrl,
            isPrimary: img.isPrimary || i === 0,
          });
        }
      }

      return result;
    },
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: any & { images?: any[] };
    }) => {
      // Separate images from product data
      const { images, ...productData } = data;

      // Step 1: Update the product fields WITHOUT images
      const result = await productsApi.update(id, productData);

      // Step 2: If new images were provided, sync them
      // New images are ones that don't have an existing `id` from the database
      if (images && images.length > 0) {
        const newImages = images.filter((img: any) => !img.id);
        for (let i = 0; i < newImages.length; i++) {
          const img = newImages[i];
          await productsApi.addImage(id, {
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            mediumUrl: img.mediumUrl || img.imageUrl,
            isPrimary: img.isPrimary || false,
          });
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      qc.invalidateQueries({ queryKey: ['my-products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
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

export function useAddProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: {
        imageUrl: string;
        thumbnailUrl: string;
        mediumUrl: string;
        isPrimary?: boolean;
      };
    }) => productsApi.addImage(productId, data),
    onSuccess: () => {
      toast.success('Image added');
      qc.invalidateQueries({ queryKey: ['my-products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to add image'),
  });
}

export function useRemoveProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => productsApi.removeImage(productId, imageId),
    onSuccess: () => {
      toast.success('Image removed');
      qc.invalidateQueries({ queryKey: ['my-products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove image'),
  });
}