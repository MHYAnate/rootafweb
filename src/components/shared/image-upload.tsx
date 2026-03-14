// // 'use client';

// // import { useState, useCallback } from 'react';
// // import { useDropzone } from 'react-dropzone';
// // import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
// // import Image from 'next/image';
// // import { cn } from '@/lib/utils';
// // import { useUploadImage } from '@/hooks/use-upload';

// // interface Props {
// //   onUploadComplete: (result: any) => void;
// //   folder?: string;
// //   currentImage?: string;
// //   className?: string;
// //   label?: string;
// // }

// // export function ImageUpload({
// //   onUploadComplete,
// //   folder = 'general',
// //   currentImage,
// //   className,
// //   label = 'Upload Image',
// // }: Props) {
// //   const [preview, setPreview] = useState<string | null>(
// //     currentImage || null,
// //   );
// //   const { mutateAsync, uploading } = useUploadImage();

// //   const onDrop = useCallback(
// //     async (acceptedFiles: File[]) => {
// //       const file = acceptedFiles[0];
// //       if (!file) return;

// //       setPreview(URL.createObjectURL(file));

// //       try {
// //         const result = await mutateAsync({ file, folder });
// //         onUploadComplete(result.data);
// //       } catch {
// //         setPreview(currentImage || null);
// //       }
// //     },
// //     [mutateAsync, folder, onUploadComplete, currentImage],
// //   );

// //   const { getRootProps, getInputProps, isDragActive } = useDropzone({
// //     onDrop,
// //     accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
// //     maxSize: 5 * 1024 * 1024,
// //     multiple: false,
// //   });

// //   return (
// //     <div className={cn('space-y-2', className)}>
// //       <label className="text-sm font-medium">{label}</label>
// //       <div
// //         {...getRootProps()}
// //         className={cn(
// //           'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer',
// //           'transition-all duration-300',
// //           isDragActive
// //             ? 'border-primary bg-primary/5 scale-[1.01]'
// //             : 'border-border hover:border-primary/40 hover:bg-muted/30',
// //           uploading && 'pointer-events-none opacity-60',
// //         )}
// //       >
// //         <input {...getInputProps()} />
// //         {uploading ? (
// //           <div className="flex flex-col items-center gap-3">
// //             <div className="relative">
// //               <Loader2 className="h-10 w-10 animate-spin text-primary" />
// //               <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
// //             </div>
// //             <p className="text-sm text-muted-foreground font-medium">
// //               Uploading...
// //             </p>
// //           </div>
// //         ) : preview ? (
// //           <div className="relative w-full aspect-video rounded-lg overflow-hidden">
// //             <Image
// //               src={preview}
// //               alt="Preview"
// //               fill
// //               className="object-contain"
// //             />
// //           </div>
// //         ) : (
// //           <div className="flex flex-col items-center gap-3">
// //             <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
// //               <ImageIcon className="h-7 w-7 text-primary" />
// //             </div>
// //             <div>
// //               <p className="text-sm font-medium">
// //                 Drag & drop or{' '}
// //                 <span className="text-primary">click to upload</span>
// //               </p>
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 JPEG, PNG, WebP • Max 5MB
// //               </p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //       {preview && !uploading && (
// //         <button
// //           type="button"
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             setPreview(null);
// //           }}
// //           className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
// //         >
// //           <X className="h-3 w-3" />
// //           Remove image
// //         </button>
// //       )}
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { X, Loader2, Image as ImageIcon } from 'lucide-react';
// import Image from 'next/image';
// import { cn } from '@/lib/utils';
// import { useUploadImage } from '@/hooks/use-upload';

// interface ImageUploadProps {
//   onUploadComplete: (result: any) => void;
//   folder?: string;
//   currentImage?: string;
//   className?: string;
//   label?: string;
//   aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
// }

// const aspectClasses: Record<string, string> = {
//   square: 'aspect-square',
//   video: 'aspect-video',
//   portrait: 'aspect-[3/4]',
//   auto: '',
// };

// export function ImageUpload({
//   onUploadComplete,
//   folder = 'general',
//   currentImage,
//   className,
//   label = 'Upload Image',
//   aspectRatio = 'video',
// }: ImageUploadProps) {
//   const [preview, setPreview] = useState<string | null>(currentImage || null);
//   const { mutateAsync, uploading } = useUploadImage();

//   const onDrop = useCallback(
//     async (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0];
//       if (!file) return;

//       setPreview(URL.createObjectURL(file));

//       try {
//         const result = await mutateAsync({ file, folder });
//         onUploadComplete(result.data);
//       } catch {
//         setPreview(currentImage || null);
//       }
//     },
//     [mutateAsync, folder, onUploadComplete, currentImage],
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
//     maxSize: 5 * 1024 * 1024,
//     multiple: false,
//   });

//   return (
//     <div className={cn('space-y-2', className)}>
//       <label className="text-sm font-medium">{label}</label>
//       <div
//         {...getRootProps()}
//         className={cn(
//           'relative border-2 border-dashed rounded-xl text-center cursor-pointer',
//           'transition-all duration-300 overflow-hidden',
//           aspectClasses[aspectRatio] || '',
//           !aspectRatio || aspectRatio === 'auto' ? 'p-8' : '',
//           isDragActive
//             ? 'border-primary bg-primary/5 scale-[1.01]'
//             : 'border-border hover:border-primary/40 hover:bg-muted/30',
//           uploading && 'pointer-events-none opacity-60',
//         )}
//       >
//         <input {...getInputProps()} />

//         {uploading ? (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80">
//             <div className="relative">
//               <Loader2 className="h-10 w-10 animate-spin text-primary" />
//               <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
//             </div>
//             <p className="text-sm text-muted-foreground font-medium">Uploading...</p>
//           </div>
//         ) : preview ? (
//           <>
//             <div className={cn('relative w-full h-full', !aspectRatio || aspectRatio === 'auto' ? 'aspect-video' : '')}>
//               <Image src={preview} alt="Preview" fill className="object-contain rounded-lg" />
//             </div>
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setPreview(null);
//                 onUploadComplete(null);
//               }}
//               className="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </>
//         ) : (
//           <div className={cn('flex flex-col items-center justify-center gap-3', aspectRatio !== 'auto' ? 'absolute inset-0' : '')}>
//             <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
//               <ImageIcon className="h-7 w-7 text-primary" />
//             </div>
//             <div>
//               <p className="text-sm font-medium">
//                 Drag & drop or <span className="text-primary">click to upload</span>
//               </p>
//               <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP • Max 5MB</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/hooks/use-upload';

interface ImageUploadProps {
  onUploadComplete: (result: any) => void;
  folder?: string;
  currentImage?: string;
  className?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

const aspectClasses: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
};

export function ImageUpload({
  onUploadComplete,
  folder = 'general',
  currentImage,
  className,
  label = 'Upload Image',
  aspectRatio = 'auto',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { mutateAsync, uploading } = useUploadImage();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const result = await mutateAsync({ file, folder });
        // The upload API returns { data: { imageUrl, thumbnailUrl, ... } }
        onUploadComplete(result.data || result);
      } catch {
        setPreview(currentImage || null);
      }
    },
    [mutateAsync, folder, onUploadComplete, currentImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadComplete(null);
  };

  const isAspectAuto = !aspectRatio || aspectRatio === 'auto';

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium block">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl text-center cursor-pointer',
          'transition-all duration-300 overflow-hidden',
          isAspectAuto ? 'p-8' : aspectClasses[aspectRatio],
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.005]'
            : 'border-border hover:border-primary/40 hover:bg-muted/30',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className={cn(
            'flex flex-col items-center justify-center gap-3',
            !isAspectAuto && 'absolute inset-0 bg-background/80',
          )}>
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Uploading...</p>
          </div>
        ) : preview ? (
          <>
            <div className={cn(
              'relative w-full',
              isAspectAuto ? 'aspect-video' : 'h-full',
            )}>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className={cn(
            'flex flex-col items-center justify-center gap-3',
            !isAspectAuto && 'absolute inset-0',
          )}>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag & drop or <span className="text-primary">click to upload</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP • Max 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}