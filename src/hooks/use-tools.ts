// 'use client';

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { toolsApi } from '@/lib/api/tools.api';

// export function useTools(params?: any) {
//   return useQuery({
//     queryKey: ['tools', params],
//     queryFn: () => toolsApi.getAll(params),
//   });
// }

// export function useTool(id: string) {
//   return useQuery({
//     queryKey: ['tool', id],
//     queryFn: () => toolsApi.getById(id),
//     enabled: !!id,
//   });
// }

// export function useMyTools(params?: any) {
//   return useQuery({
//     queryKey: ['my-tools', params],
//     queryFn: () => toolsApi.getMyTools(params),
//   });
// }

// export function useCreateTool() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       images,
//       ...toolData
//     }: any & { images?: any[] }) => {
//       // Step 1: Create tool WITHOUT images
//       const result = await toolsApi.create(toolData);
//       const toolId = result.data.id;

//       // Step 2: Attach images via separate endpoint
//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           const img = images[i];
//           try {
//             await toolsApi.addImage(toolId, {
//               imageUrl: img.imageUrl,
//               thumbnailUrl: img.thumbnailUrl || img.imageUrl,
//               mediumUrl: img.mediumUrl || img.imageUrl,
//               isPrimary: img.isPrimary || i === 0,
//             });
//           } catch (imgErr) {
//             console.error(`Failed to attach image ${i}:`, imgErr);
//           }
//         }
//       }

//       return result;
//     },
//     onSuccess: () => {
//       toast.success('Tool listed successfully');
//       qc.invalidateQueries({ queryKey: ['my-tools'] });
//       qc.invalidateQueries({ queryKey: ['tools'] });
//     },
//     onError: (e: any) => {
//       const msg =
//         e.response?.data?.message ||
//         e.response?.data?.errors?.join(', ') ||
//         'Failed to create tool';
//       toast.error(msg);
//       console.error('Create tool error:', e.response?.data || e);
//     },
//   });
// }

// export function useUpdateTool() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({
//       id,
//       data,
//     }: {
//       id: string;
//       data: any & { images?: any[] };
//     }) => {
//       const { images, ...toolData } = data;

//       // Step 1: Update tool fields WITHOUT images
//       const result = await toolsApi.update(id, toolData);

//       // Step 2: Attach new images only (ones without an id)
//       if (images && images.length > 0) {
//         const newImages = images.filter((img: any) => !img.id);
//         for (let i = 0; i < newImages.length; i++) {
//           const img = newImages[i];
//           try {
//             await toolsApi.addImage(id, {
//               imageUrl: img.imageUrl,
//               thumbnailUrl: img.thumbnailUrl || img.imageUrl,
//               mediumUrl: img.mediumUrl || img.imageUrl,
//               isPrimary: img.isPrimary || false,
//             });
//           } catch (imgErr) {
//             console.error(`Failed to attach image ${i}:`, imgErr);
//           }
//         }
//       }

//       return result;
//     },
//     onSuccess: () => {
//       toast.success('Tool updated successfully');
//       qc.invalidateQueries({ queryKey: ['my-tools'] });
//       qc.invalidateQueries({ queryKey: ['tools'] });
//       qc.invalidateQueries({ queryKey: ['tool'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to update tool'),
//   });
// }

// export function useDeleteTool() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: toolsApi.delete,
//     onSuccess: () => {
//       toast.success('Tool deleted');
//       qc.invalidateQueries({ queryKey: ['my-tools'] });
//       qc.invalidateQueries({ queryKey: ['tools'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to delete tool'),
//   });
// }

// export function useAddToolImage() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ toolId, data }: { toolId: string; data: any }) =>
//       toolsApi.addImage(toolId, data),
//     onSuccess: () => {
//       toast.success('Image added');
//       qc.invalidateQueries({ queryKey: ['my-tools'] });
//       qc.invalidateQueries({ queryKey: ['tool'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to add image'),
//   });
// }

// export function useRemoveToolImage() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       toolId,
//       imageId,
//     }: {
//       toolId: string;
//       imageId: string;
//     }) => toolsApi.removeImage(toolId, imageId),
//     onSuccess: () => {
//       toast.success('Image removed');
//       qc.invalidateQueries({ queryKey: ['my-tools'] });
//       qc.invalidateQueries({ queryKey: ['tool'] });
//     },
//     onError: (e: any) =>
//       toast.error(e.response?.data?.message || 'Failed to remove image'),
//   });
// }
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toolsApi } from '@/lib/api/tools.api';

/**
 * ──────────────────────────────────────────────────────────
 * IMPORTANT: API shape after axios unwrap
 * ──────────────────────────────────────────────────────────
 *
 * toolsApi.getAll()    → { data: Tool[], meta: { total, page, limit, totalPages } }
 * toolsApi.getById()   → { data: Tool }
 * toolsApi.getMyTools() → { data: Tool[], meta: { ... } }
 * toolsApi.create()    → { data: Tool }
 * toolsApi.update()    → { data: Tool }
 * toolsApi.delete()    → { message: string }
 *
 * The hooks below expose the FULL API response to pages.
 * Pages should access: result.data (the array/object) and result.meta (pagination).
 * ──────────────────────────────────────────────────────────
 */

// ── Queries ──────────────────────────────────────────────

export function useTools(params?: any) {
  return useQuery({
    queryKey: ['tools', params],
    queryFn: () => toolsApi.getAll(params),
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => toolsApi.getById(id),
    enabled: !!id,
  });
}

export function useMyTools(params?: any) {
  return useQuery({
    queryKey: ['my-tools', params],
    queryFn: () => toolsApi.getMyTools(params),
  });
}

// ── Mutations ────────────────────────────────────────────

export function useCreateTool() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      images,
      ...toolData
    }: any & { images?: any[] }) => {
      // Step 1: Create tool WITHOUT images
      const result = await toolsApi.create(toolData);

      // result = { data: Tool } — extract the id
      const toolId = result.data?.id || result.id;

      if (!toolId) {
        console.error('Create tool response missing id:', result);
        throw new Error('Tool created but no ID returned');
      }

      // Step 2: Attach images via separate endpoint
      if (images && images.length > 0) {
        const imageResults = await Promise.allSettled(
          images.map((img: any, i: number) =>
            toolsApi.addImage(toolId, {
              imageUrl: img.imageUrl,
              thumbnailUrl: img.thumbnailUrl || img.imageUrl,
              mediumUrl: img.mediumUrl || img.imageUrl,
              isPrimary: img.isPrimary ?? i === 0,
            }),
          ),
        );

        const failed = imageResults.filter((r) => r.status === 'rejected');
        if (failed.length > 0) {
          console.warn(`${failed.length}/${images.length} images failed to attach`);
          failed.forEach((f, i) => {
            if (f.status === 'rejected') {
              console.error(`Image ${i} error:`, f.reason);
            }
          });
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Tool listed successfully');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
      qc.invalidateQueries({ queryKey: ['tools'] });
    },
    onError: (e: any) => {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.errors?.join(', ') ||
        e.message ||
        'Failed to create tool';
      toast.error(msg);
      console.error('Create tool error:', e.response?.data || e);
    },
  });
}

export function useUpdateTool() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: any & { images?: any[] };
    }) => {
      const { images, ...toolData } = data;

      // Step 1: Update tool fields WITHOUT images
      const result = await toolsApi.update(id, toolData);

      // Step 2: Attach NEW images only (ones without an existing id)
      if (images && images.length > 0) {
        const newImages = images.filter((img: any) => !img.id);

        if (newImages.length > 0) {
          const imageResults = await Promise.allSettled(
            newImages.map((img: any) =>
              toolsApi.addImage(id, {
                imageUrl: img.imageUrl,
                thumbnailUrl: img.thumbnailUrl || img.imageUrl,
                mediumUrl: img.mediumUrl || img.imageUrl,
                isPrimary: img.isPrimary || false,
              }),
            ),
          );

          const failed = imageResults.filter((r) => r.status === 'rejected');
          if (failed.length > 0) {
            console.warn(`${failed.length}/${newImages.length} new images failed to attach`);
          }
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Tool updated successfully');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
      qc.invalidateQueries({ queryKey: ['tools'] });
      qc.invalidateQueries({ queryKey: ['tool'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update tool'),
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toolsApi.delete(id),
    onSuccess: () => {
      toast.success('Tool deleted');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
      qc.invalidateQueries({ queryKey: ['tools'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete tool'),
  });
}

export function useAddToolImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ toolId, data }: { toolId: string; data: any }) =>
      toolsApi.addImage(toolId, data),
    onSuccess: () => {
      toast.success('Image added');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
      qc.invalidateQueries({ queryKey: ['tool'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to add image'),
  });
}

export function useRemoveToolImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolId,
      imageId,
    }: {
      toolId: string;
      imageId: string;
    }) => toolsApi.removeImage(toolId, imageId),
    onSuccess: () => {
      toast.success('Image removed');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
      qc.invalidateQueries({ queryKey: ['tool'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove image'),
  });
}