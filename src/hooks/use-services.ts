// 'use client';

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { servicesApi } from '@/lib/api/services.api';

// export function useServices(params?: any) {
//   return useQuery({
//     queryKey: ['services', params],
//     queryFn: () => servicesApi.getAll(params),
//   });
// }

// export function useService(id: string) {
//   return useQuery({
//     queryKey: ['service', id],
//     queryFn: () => servicesApi.getById(id),
//     enabled: !!id,
//   });
// }

// export function useMyServices(params?: any) {
//   return useQuery({
//     queryKey: ['my-services', params],
//     queryFn: () => servicesApi.getMyServices(params),
//   });
// }

// export function useCreateService() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: servicesApi.create,
//     onSuccess: () => {
//       toast.success('Service created successfully');
//       qc.invalidateQueries({ queryKey: ['my-services'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to create service'),
//   });
// }

// export function useUpdateService() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: any }) =>
//       servicesApi.update(id, data),
//     onSuccess: () => {
//       toast.success('Service updated successfully');
//       qc.invalidateQueries({ queryKey: ['my-services'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to update service'),
//   });
// }

// export function useDeleteService() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: servicesApi.delete,
//     onSuccess: () => {
//       toast.success('Service deleted');
//       qc.invalidateQueries({ queryKey: ['my-services'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to delete service'),
//   });
// }

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi } from '@/lib/api/services.api';

export function useServices(params?: any) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getAll(params),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(id),
    enabled: !!id,
  });
}

export function useMyServices(params?: any) {
  return useQuery({
    queryKey: ['my-services', params],
    queryFn: () => servicesApi.getMyServices(params),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      images,
      ...serviceData
    }: any & { images?: any[] }) => {
      // Step 1: Create the service WITHOUT images
      const result = await servicesApi.create(serviceData);
      const serviceId = result.data.id;

      // Step 2: Upload each image to the service via separate endpoint
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          await servicesApi.addImage(serviceId, {
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            isPrimary: img.isPrimary || i === 0,
          });
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Service created successfully');
      qc.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to create service'),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: any & { images?: any[] };
    }) => {
      // Separate images from service data
      const { images, ...serviceData } = data;

      // Step 1: Update the service fields WITHOUT images
      const result = await servicesApi.update(id, serviceData);

      // Step 2: If new images were provided, attach them
      if (images && images.length > 0) {
        const newImages = images.filter((img: any) => !img.id);
        for (let i = 0; i < newImages.length; i++) {
          const img = newImages[i];
          await servicesApi.addImage(id, {
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl || img.imageUrl,
            isPrimary: img.isPrimary || false,
          });
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Service updated successfully');
      qc.invalidateQueries({ queryKey: ['my-services'] });
      qc.invalidateQueries({ queryKey: ['service'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update service'),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => {
      toast.success('Service deleted');
      qc.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete service'),
  });
}