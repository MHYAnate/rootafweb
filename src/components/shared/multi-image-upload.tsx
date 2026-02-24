'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { uploadApi } from '@/lib/api/upload.api';
import { toast } from 'sonner';

interface UploadedImage {
  id?: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

interface Props {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  images,
  onImagesChange,
  folder = 'general',
  maxImages = 5,
  className,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxImages - images.length;
      const filesToUpload = acceptedFiles.slice(0, remaining);
      if (filesToUpload.length === 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      try {
        const result = await uploadApi.uploadImages(filesToUpload, folder);
        const newImages = result.data.map((img: any) => ({
          imageUrl: img.imageUrl,
          thumbnailUrl: img.thumbnailUrl,
        }));
        onImagesChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded`);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [images, onImagesChange, folder, maxImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group">
              <Image
                src={img.thumbnailUrl || img.imageUrl}
                alt={`Image ${idx + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-primary text-white font-medium">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop images here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images • Max 5MB each
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}