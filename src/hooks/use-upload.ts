'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadApi } from '@/lib/api/upload.api';

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ file, folder }: { file: File; folder: string }) => {
      setUploading(true);
      return uploadApi.uploadImage(file, folder);
    },
    onSuccess: () => setUploading(false),
    onError: (e: any) => {
      setUploading(false);
      toast.error(e.response?.data?.message || 'Upload failed');
    },
  });

  return { ...mutation, uploading };
}