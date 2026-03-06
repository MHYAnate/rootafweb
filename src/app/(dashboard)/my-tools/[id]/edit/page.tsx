// // 'use client';

// // import { useParams, useRouter } from 'next/navigation';
// // import { useEffect, useState } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { useTool, useUpdateTool } from '@/hooks/use-tools';
// // import { toolSchema, ToolFormData } from '@/lib/validations';
// // import { BackButton } from '@/components/shared/back-button';
// // import { PageHeader } from '@/components/shared/page-header';
// // import { LoadingSpinner } from '@/components/shared/loading-spinner';
// // import { CategorySelect } from '@/components/shared/category-select';
// // import { MultiImageUpload } from '@/components/shared/multi-image-upload';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Button } from '@/components/ui/button';
// // import { Label } from '@/components/ui/label';
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from '@/components/ui/select';
// // import { Switch } from '@/components/ui/switch';
// // import { Loader2, Save } from 'lucide-react';

// // const CONDITION_OPTIONS = [
// //   { value: 'NEW', label: 'New' },
// //   { value: 'FAIRLY_USED', label: 'Fairly Used' },
// //   { value: 'USED', label: 'Used' },
// //   { value: 'REFURBISHED', label: 'Refurbished' },
// // ];

// // const PURPOSE_OPTIONS = [
// //   { value: 'SALE', label: 'For Sale' },
// //   { value: 'LEASE', label: 'For Lease' },
// //   { value: 'BOTH', label: 'Sale & Lease' },
// // ];

// // const PRICING_OPTIONS = [
// //   { value: 'FIXED', label: 'Fixed' },
// //   { value: 'NEGOTIABLE', label: 'Negotiable' },
// //   { value: 'BOTH', label: 'Both' },
// // ];

// // const LEASE_PERIOD_OPTIONS = [
// //   { value: 'HOURLY', label: 'Per Hour' },
// //   { value: 'DAILY', label: 'Per Day' },
// //   { value: 'WEEKLY', label: 'Per Week' },
// //   { value: 'MONTHLY', label: 'Per Month' },
// //   { value: 'SEASONAL', label: 'Per Season' },
// // ];

// // const DEPOSIT_OPTIONS = [
// //   { value: 'REQUIRED', label: 'Required' },
// //   { value: 'NOT_REQUIRED', label: 'Not Required' },
// //   { value: 'NEGOTIABLE', label: 'Negotiable' },
// // ];

// // export default function EditToolPage() {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const { data, isLoading } = useTool(id as string);
// //   const { mutate: updateTool, isPending } = useUpdateTool();
// //   const [images, setImages] = useState<any[]>([]);

// //   const {
// //     register,
// //     handleSubmit,
// //     setValue,
// //     watch,
// //     reset,
// //     formState: { errors },
// //   } = useForm<ToolFormData>({
// //     resolver: zodResolver(toolSchema),
// //   });

// //   useEffect(() => {
// //     if (data?.data) {
// //       const t = data.data;
// //       reset({
// //         name: t.name,
// //         description: t.description,
// //         shortDescription: t.shortDescription || '',
// //         categoryId: t.categoryId,
// //         condition: t.condition,
// //         brandName: t.brandName || '',
// //         modelNumber: t.modelNumber || '',
// //         quantityAvailable: t.quantityAvailable ?? 1,
// //         listingPurpose: t.listingPurpose,
// //         salePricingType: t.salePricingType || 'FIXED',
// //         salePrice: t.salePrice ? Number(t.salePrice) : undefined,
// //         leasePricingType: t.leasePricingType || 'FIXED',
// //         leaseRate: t.leaseRate ? Number(t.leaseRate) : undefined,
// //         leaseRatePeriod: t.leaseRatePeriod || 'DAILY',
// //         depositRequired: t.depositRequired || 'NOT_REQUIRED',
// //         depositAmount: t.depositAmount
// //           ? Number(t.depositAmount)
// //           : undefined,
// //         pickupLocation: t.pickupLocation || '',
// //         pickupLocationState: t.pickupLocationState || '',
// //         deliveryAvailable: t.deliveryAvailable || false,
// //         tags: t.tags || [],
// //       });
// //       setImages(t.images || []);
// //     }
// //   }, [data, reset]);

// //   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

// //   const listingPurpose = watch('listingPurpose');
// //   const depositRequired = watch('depositRequired');
// //   const showSale =
// //     listingPurpose === 'SALE' || listingPurpose === 'BOTH';
// //   const showLease =
// //     listingPurpose === 'LEASE' || listingPurpose === 'BOTH';

// //   const onSubmit = (formData: ToolFormData) => {
// //     const payload: any = { ...formData };
// //     if (!showSale) {
// //       delete payload.salePricingType;
// //       delete payload.salePrice;
// //     }
// //     if (!showLease) {
// //       delete payload.leasePricingType;
// //       delete payload.leaseRate;
// //       delete payload.leaseRatePeriod;
// //       delete payload.depositRequired;
// //       delete payload.depositAmount;
// //     }
// //     if (depositRequired !== 'REQUIRED') {
// //       delete payload.depositAmount;
// //     }

// //     updateTool(
// //       {
// //         id: id as string,
// //         data: {
// //           ...payload,
// //           images: images.map((img, idx) => ({
// //             ...img,
// //             isPrimary: idx === 0,
// //           })),
// //         },
// //       },
// //       { onSuccess: () => router.push('/my-tools') }
// //     );
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <BackButton href="/my-tools" />
// //       <PageHeader title="Edit Tool" />

// //       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //         {/* ── Tool Details ── */}
// //         <Card className="card-premium">
// //           <CardHeader>
// //             <CardTitle>Tool Details</CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="space-y-2">
// //               <Label>Tool Name *</Label>
// //               <Input className="h-11 rounded-lg" {...register('name')} />
// //               {errors.name && (
// //                 <p className="text-sm text-destructive">
// //                   {errors.name.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label>Description *</Label>
// //               <Textarea
// //                 className="rounded-lg min-h-[120px]"
// //                 {...register('description')}
// //               />
// //               {errors.description && (
// //                 <p className="text-sm text-destructive">
// //                   {errors.description.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div className="space-y-2">
// //               <Label>Short Description</Label>
// //               <Input
// //                 className="h-11 rounded-lg"
// //                 {...register('shortDescription')}
// //               />
// //             </div>

// //             <CategorySelect
// //               type="TOOL"
// //               value={watch('categoryId') || ''}
// //               onChange={(v) => setValue('categoryId', v)}
// //             />
// //             {errors.categoryId && (
// //               <p className="text-sm text-destructive">
// //                 {errors.categoryId.message}
// //               </p>
// //             )}

// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label>Condition *</Label>
// //                 <Select
// //                   value={watch('condition')}
// //                   onValueChange={(v) =>
// //                     setValue('condition', v as any)
// //                   }
// //                 >
// //                   <SelectTrigger className="h-11 rounded-lg">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {CONDITION_OPTIONS.map((o) => (
// //                       <SelectItem key={o.value} value={o.value}>
// //                         {o.label}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label>Listing Purpose *</Label>
// //                 <Select
// //                   value={watch('listingPurpose')}
// //                   onValueChange={(v) =>
// //                     setValue('listingPurpose', v as any)
// //                   }
// //                 >
// //                   <SelectTrigger className="h-11 rounded-lg">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {PURPOSE_OPTIONS.map((o) => (
// //                       <SelectItem key={o.value} value={o.value}>
// //                         {o.label}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               <div className="space-y-2">
// //                 <Label>Brand Name</Label>
// //                 <Input
// //                   className="h-11 rounded-lg"
// //                   {...register('brandName')}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>Model Number</Label>
// //                 <Input
// //                   className="h-11 rounded-lg"
// //                   {...register('modelNumber')}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>Quantity Available</Label>
// //                 <Input
// //                   type="number"
// //                   min={1}
// //                   className="h-11 rounded-lg"
// //                   {...register('quantityAvailable', {
// //                     valueAsNumber: true,
// //                   })}
// //                 />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* ── Sale Pricing ── */}
// //         {showSale && (
// //           <Card className="card-premium">
// //             <CardHeader>
// //               <CardTitle>Sale Pricing</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Pricing Type</Label>
// //                   <Select
// //                     value={watch('salePricingType') || 'FIXED'}
// //                     onValueChange={(v) =>
// //                       setValue('salePricingType', v as any)
// //                     }
// //                   >
// //                     <SelectTrigger className="h-11 rounded-lg">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {PRICING_OPTIONS.map((o) => (
// //                         <SelectItem key={o.value} value={o.value}>
// //                           {o.label}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label>Sale Price (₦)</Label>
// //                   <Input
// //                     type="number"
// //                     min={0}
// //                     className="h-11 rounded-lg"
// //                     {...register('salePrice', {
// //                       valueAsNumber: true,
// //                     })}
// //                   />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* ── Lease Pricing ── */}
// //         {showLease && (
// //           <Card className="card-premium">
// //             <CardHeader>
// //               <CardTitle>Lease Pricing</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Pricing Type</Label>
// //                   <Select
// //                     value={watch('leasePricingType') || 'FIXED'}
// //                     onValueChange={(v) =>
// //                       setValue('leasePricingType', v as any)
// //                     }
// //                   >
// //                     <SelectTrigger className="h-11 rounded-lg">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {PRICING_OPTIONS.map((o) => (
// //                         <SelectItem key={o.value} value={o.value}>
// //                           {o.label}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label>Lease Rate (₦)</Label>
// //                   <Input
// //                     type="number"
// //                     min={0}
// //                     className="h-11 rounded-lg"
// //                     {...register('leaseRate', {
// //                       valueAsNumber: true,
// //                     })}
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label>Rate Period</Label>
// //                   <Select
// //                     value={watch('leaseRatePeriod') || 'DAILY'}
// //                     onValueChange={(v) =>
// //                       setValue('leaseRatePeriod', v as any)
// //                     }
// //                   >
// //                     <SelectTrigger className="h-11 rounded-lg">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {LEASE_PERIOD_OPTIONS.map((o) => (
// //                         <SelectItem key={o.value} value={o.value}>
// //                           {o.label}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Deposit Requirement</Label>
// //                   <Select
// //                     value={watch('depositRequired') || 'NOT_REQUIRED'}
// //                     onValueChange={(v) =>
// //                       setValue('depositRequired', v as any)
// //                     }
// //                   >
// //                     <SelectTrigger className="h-11 rounded-lg">
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {DEPOSIT_OPTIONS.map((o) => (
// //                         <SelectItem key={o.value} value={o.value}>
// //                           {o.label}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {depositRequired === 'REQUIRED' && (
// //                   <div className="space-y-2">
// //                     <Label>Deposit Amount (₦)</Label>
// //                     <Input
// //                       type="number"
// //                       min={0}
// //                       className="h-11 rounded-lg"
// //                       {...register('depositAmount', {
// //                         valueAsNumber: true,
// //                       })}
// //                     />
// //                   </div>
// //                 )}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* ── Location & Delivery ── */}
// //         <Card className="card-premium">
// //           <CardHeader>
// //             <CardTitle>Location & Delivery</CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label>Pickup Location</Label>
// //                 <Input
// //                   className="h-11 rounded-lg"
// //                   {...register('pickupLocation')}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label>State</Label>
// //                 <Input
// //                   className="h-11 rounded-lg"
// //                   {...register('pickupLocationState')}
// //                 />
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <Switch
// //                 checked={watch('deliveryAvailable') || false}
// //                 onCheckedChange={(v) =>
// //                   setValue('deliveryAvailable', v)
// //                 }
// //               />
// //               <Label>Delivery Available</Label>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* ── Images ── */}
// //         <Card className="card-premium">
// //           <CardHeader>
// //             <CardTitle>Images</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <MultiImageUpload
// //               images={images}
// //               onImagesChange={setImages}
// //               folder="tools"
// //             />
// //           </CardContent>
// //         </Card>

// //         <Button
// //           type="submit"
// //           className="btn-premium rounded-xl gap-2"
// //           disabled={isPending}
// //         >
// //           {isPending ? (
// //             <Loader2 className="h-4 w-4 animate-spin" />
// //           ) : (
// //             <Save className="h-4 w-4" />
// //           )}
// //           Save Changes
// //         </Button>
// //       </form>
// //     </div>
// //   );
// // }

// // src/app/(dashboard)/tools/[id]/page.tsx
// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import { useTool, useTools } from '@/hooks/use-tools';
// import { ToolImageGallery } from '@/components/tools/tool-image-gallery';
// import { ToolContactCard } from '@/components/tools/tool-contact-card';
// import { ToolCard } from '@/components/tools/tool-card';
// import { BackButton } from '@/components/shared/back-button';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Wrench,
//   MapPin,
//   Calendar,
//   Eye,
//   Package,
//   Tag,
//   Truck,
//   ShieldCheck,
//   Info,
//   Star,
//   Layers,
//   Hash,
//   CheckCircle2,
// } from 'lucide-react';
// import { formatDistanceToNow, format } from 'date-fns';

// const conditionConfig: Record<string, { label: string; className: string; description: string }> = {
//   NEW: {
//     label: 'Brand New',
//     className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
//     description: 'Unused, in original packaging',
//   },
//   FAIRLY_USED: {
//     label: 'Fairly Used',
//     className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
//     description: 'Used but in good working condition',
//   },
//   USED: {
//     label: 'Used',
//     className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
//     description: 'Functional with visible wear',
//   },
//   REFURBISHED: {
//     label: 'Refurbished',
//     className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
//     description: 'Restored to working condition',
//   },
// };

// const purposeLabels: Record<string, string> = {
//   SALE: 'For Sale',
//   LEASE: 'For Lease',
//   BOTH: 'For Sale & Lease',
// };

// function formatPrice(amount: number | null | undefined) {
//   if (!amount) return null;
//   return `₦${Number(amount).toLocaleString()}`;
// }

// export default function ToolDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { data, isLoading, isError } = useTool(id as string);

//   // Related tools: same category
//   const tool = data?.data;
//   const { data: relatedData } = useTools({
//     categoryId: tool?.categoryId,
//     limit: 4,
//   });

//   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

//   if (isError || !tool) {
//     return (
//       <div className="text-center py-20">
//         <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
//         <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
//         <p className="text-muted-foreground mb-4">
//           This tool may have been removed or doesn&apos;t exist.
//         </p>
//         <BackButton href="/tools" label="Back to Marketplace" />
//       </div>
//     );
//   }

//   const condition = conditionConfig[tool.condition] || conditionConfig.USED;
//   const relatedTools = (relatedData?.data || []).filter((t: any) => t.id !== tool.id).slice(0, 3);

//   return (
//     <div className="space-y-6">
//       <BackButton href="/tools" label="Back to Marketplace" />

//       {/* Main Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left: Images + Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Image Gallery */}
//           <ToolImageGallery images={tool.images || []} toolName={tool.name} />

//           {/* Title & Badges */}
//           <div>
//             <div className="flex flex-wrap items-center gap-2 mb-2">
//               <Badge className={condition.className}>{condition.label}</Badge>
//               <Badge variant="outline">
//                 {purposeLabels[tool.listingPurpose] || tool.listingPurpose}
//               </Badge>
//               {tool.deliveryAvailable && (
//                 <Badge variant="secondary" className="gap-1">
//                   <Truck className="h-3 w-3" /> Delivery Available
//                 </Badge>
//               )}
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
//             {tool.category && (
//               <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
//                 <Layers className="h-3.5 w-3.5" />
//                 {tool.category.name}
//               </p>
//             )}
//           </div>

//           {/* Mobile Price Card */}
//           <div className="lg:hidden">
//             <ToolContactCard member={tool.member} tool={tool} />
//           </div>

//           {/* Quick Info Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             <Card className="card-premium">
//               <CardContent className="p-3 text-center">
//                 <Package className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
//                 <p className="text-sm font-semibold">{tool.quantityAvailable || 1}</p>
//                 <p className="text-[10px] text-muted-foreground uppercase">Available</p>
//               </CardContent>
//             </Card>
//             <Card className="card-premium">
//               <CardContent className="p-3 text-center">
//                 <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
//                 <p className="text-sm font-semibold">{tool.viewCount || 0}</p>
//                 <p className="text-[10px] text-muted-foreground uppercase">Views</p>
//               </CardContent>
//             </Card>
//             <Card className="card-premium">
//               <CardContent className="p-3 text-center">
//                 <ShieldCheck className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
//                 <p className="text-sm font-semibold">{condition.label}</p>
//                 <p className="text-[10px] text-muted-foreground uppercase">Condition</p>
//               </CardContent>
//             </Card>
//             <Card className="card-premium">
//               <CardContent className="p-3 text-center">
//                 <Calendar className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
//                 <p className="text-sm font-semibold">
//                   {tool.createdAt
//                     ? formatDistanceToNow(new Date(tool.createdAt), { addSuffix: false })
//                     : '—'}
//                 </p>
//                 <p className="text-[10px] text-muted-foreground uppercase">Listed</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Description */}
//           <Card className="card-premium">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Info className="h-4 w-4" /> Description
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                 {tool.description}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Specifications */}
//           {(tool.brandName || tool.modelNumber || tool.condition) && (
//             <Card className="card-premium">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Wrench className="h-4 w-4" /> Specifications
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
//                   {tool.brandName && (
//                     <div className="flex justify-between py-2 border-b border-dashed">
//                       <span className="text-sm text-muted-foreground">Brand</span>
//                       <span className="text-sm font-medium">{tool.brandName}</span>
//                     </div>
//                   )}
//                   {tool.modelNumber && (
//                     <div className="flex justify-between py-2 border-b border-dashed">
//                       <span className="text-sm text-muted-foreground">Model</span>
//                       <span className="text-sm font-medium">{tool.modelNumber}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between py-2 border-b border-dashed">
//                     <span className="text-sm text-muted-foreground">Condition</span>
//                     <span className="text-sm font-medium">{condition.label}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-dashed">
//                     <span className="text-sm text-muted-foreground">Quantity</span>
//                     <span className="text-sm font-medium">{tool.quantityAvailable || 1}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Pricing Details */}
//           <Card className="card-premium">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Hash className="h-4 w-4" /> Pricing Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {(tool.listingPurpose === 'SALE' || tool.listingPurpose === 'BOTH') &&
//                 tool.salePrice && (
//                   <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs text-green-600 font-medium uppercase">
//                           Sale Price
//                         </p>
//                         <p className="text-xl font-bold text-green-700 dark:text-green-400">
//                           {formatPrice(tool.salePrice)}
//                         </p>
//                       </div>
//                       <Badge
//                         variant="outline"
//                         className="border-green-300 text-green-700 dark:text-green-400"
//                       >
//                         {tool.salePricingType === 'NEGOTIABLE'
//                           ? 'Negotiable'
//                           : 'Fixed Price'}
//                       </Badge>
//                     </div>
//                   </div>
//                 )}

//               {(tool.listingPurpose === 'LEASE' || tool.listingPurpose === 'BOTH') &&
//                 tool.leaseRate && (
//                   <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-xs text-blue-600 font-medium uppercase">
//                           Lease Rate
//                         </p>
//                         <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
//                           {formatPrice(tool.leaseRate)}
//                           <span className="text-sm font-normal">
//                             /{tool.leaseRatePeriod?.toLowerCase() || 'day'}
//                           </span>
//                         </p>
//                       </div>
//                       <Badge
//                         variant="outline"
//                         className="border-blue-300 text-blue-700 dark:text-blue-400"
//                       >
//                         {tool.leasePricingType === 'NEGOTIABLE'
//                           ? 'Negotiable'
//                           : 'Fixed Rate'}
//                       </Badge>
//                     </div>
//                     {tool.depositRequired === 'REQUIRED' && tool.depositAmount && (
//                       <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/30">
//                         <div className="flex items-center gap-1 text-sm">
//                           <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
//                           <span className="text-blue-700 dark:text-blue-400">
//                             Deposit required: {formatPrice(tool.depositAmount)}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                     {tool.depositRequired === 'NEGOTIABLE' && (
//                       <p className="mt-2 text-xs text-blue-600">Deposit is negotiable</p>
//                     )}
//                   </div>
//                 )}
//             </CardContent>
//           </Card>

//           {/* Location */}
//           {(tool.pickupLocation || tool.pickupLocationState) && (
//             <Card className="card-premium">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <MapPin className="h-4 w-4" /> Location
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-start gap-3">
//                   <div className="p-2.5 rounded-lg bg-primary/10">
//                     <MapPin className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     {tool.pickupLocation && (
//                       <p className="font-medium text-sm">{tool.pickupLocation}</p>
//                     )}
//                     {tool.pickupLocationState && (
//                       <p className="text-sm text-muted-foreground">
//                         {tool.pickupLocationState}, Nigeria
//                       </p>
//                     )}
//                     {tool.deliveryAvailable && (
//                       <p className="text-xs text-primary mt-2 flex items-center gap-1">
//                         <Truck className="h-3 w-3" /> Delivery available
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Tags */}
//           {tool.tags && tool.tags.length > 0 && (
//             <Card className="card-premium">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Tag className="h-4 w-4" /> Tags
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-wrap gap-2">
//                   {tool.tags.map((tag: string) => (
//                     <Badge key={tag} variant="secondary" className="rounded-full">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Posted info */}
//           <div className="text-xs text-muted-foreground text-center py-4">
//             Listed{' '}
//             {tool.createdAt
//               ? format(new Date(tool.createdAt), 'MMMM d, yyyy')
//               : 'recently'}{' '}
//             · ID: {tool.id?.slice(0, 8)}
//           </div>
//         </div>

//         {/* Right: Contact Card (Desktop) */}
//         <div className="hidden lg:block">
//           <ToolContactCard member={tool.member} tool={tool} />
//         </div>
//       </div>

//       {/* Related Tools */}
//       {relatedTools.length > 0 && (
//         <div className="space-y-4 pt-6">
//           <Separator />
//           <h2 className="text-xl font-bold">Similar Tools</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {relatedTools.map((t: any) => (
//               <ToolCard key={t.id} tool={t} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/app/(dashboard)/my-tools/[id]/edit/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTool, useUpdateTool } from '@/hooks/use-tools';
import { toolSchema, ToolFormData } from '@/lib/validations';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { CategorySelect } from '@/components/shared/category-select';
import { MultiImageUpload } from '@/components/shared/multi-image-upload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Save,
  Wrench,
  DollarSign,
  MapPin,
  Camera,
  Tag,
  ShieldCheck,
  Package,
  X,
} from 'lucide-react';

const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
  'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'Brand New' },
  { value: 'FAIRLY_USED', label: 'Fairly Used' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
];

const PURPOSE_OPTIONS = [
  { value: 'SALE', label: '💰 For Sale' },
  { value: 'LEASE', label: '🔄 For Lease' },
  { value: 'BOTH', label: '✨ Sale & Lease' },
];

const PRICING_OPTIONS = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'NEGOTIABLE', label: 'Negotiable' },
];

const LEASE_PERIOD_OPTIONS = [
  { value: 'HOURLY', label: 'Per Hour' },
  { value: 'DAILY', label: 'Per Day' },
  { value: 'WEEKLY', label: 'Per Week' },
  { value: 'MONTHLY', label: 'Per Month' },
  { value: 'SEASONAL', label: 'Per Season' },
];

const DEPOSIT_OPTIONS = [
  { value: 'REQUIRED', label: 'Required' },
  { value: 'NOT_REQUIRED', label: 'Not Required' },
  { value: 'NEGOTIABLE', label: 'Negotiable' },
];

export default function EditToolPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useTool(id as string);
  const { mutate: updateTool, isPending } = useUpdateTool();
  const [images, setImages] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
  });

  useEffect(() => {
    if (data?.data) {
      const t = data.data;
      reset({
        name: t.name,
        description: t.description,
        shortDescription: t.shortDescription || '',
        categoryId: t.categoryId,
        condition: t.condition,
        brandName: t.brandName || '',
        modelNumber: t.modelNumber || '',
        quantityAvailable: t.quantityAvailable ?? 1,
        listingPurpose: t.listingPurpose,
        salePricingType: t.salePricingType || 'FIXED',
        salePrice: t.salePrice ? Number(t.salePrice) : undefined,
        leasePricingType: t.leasePricingType || 'FIXED',
        leaseRate: t.leaseRate ? Number(t.leaseRate) : undefined,
        leaseRatePeriod: t.leaseRatePeriod || 'DAILY',
        depositRequired: t.depositRequired || 'NOT_REQUIRED',
        depositAmount: t.depositAmount ? Number(t.depositAmount) : undefined,
        pickupLocation: t.pickupLocation || '',
        pickupLocationState: t.pickupLocationState || '',
        deliveryAvailable: t.deliveryAvailable || false,
        tags: t.tags || [],
      });
      setImages(t.images || []);
      setTags(t.tags || []);
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!data?.data) {
    return (
      <div className="text-center py-20">
        <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Tool not found</h2>
        <BackButton href="/my-tools" label="Back to My Tools" />
      </div>
    );
  }

  const listingPurpose = watch('listingPurpose');
  const depositRequired = watch('depositRequired');
  const showSale = listingPurpose === 'SALE' || listingPurpose === 'BOTH';
  const showLease = listingPurpose === 'LEASE' || listingPurpose === 'BOTH';

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      const updated = [...tags, trimmed];
      setTags(updated);
      setValue('tags', updated, { shouldDirty: true });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    setValue('tags', updated, { shouldDirty: true });
  };

  const onSubmit = (formData: ToolFormData) => {
    const payload: any = { ...formData, tags };

    if (!showSale) {
      delete payload.salePricingType;
      delete payload.salePrice;
    }
    if (!showLease) {
      delete payload.leasePricingType;
      delete payload.leaseRate;
      delete payload.leaseRatePeriod;
      delete payload.depositRequired;
      delete payload.depositAmount;
    }
    if (depositRequired !== 'REQUIRED') {
      delete payload.depositAmount;
    }
    if (!payload.shortDescription) delete payload.shortDescription;
    if (!payload.brandName) delete payload.brandName;
    if (!payload.modelNumber) delete payload.modelNumber;
    if (!payload.pickupLocation) delete payload.pickupLocation;
    if (!payload.pickupLocationState) delete payload.pickupLocationState;

    updateTool(
      {
        id: id as string,
        data: {
          ...payload,
          images: images.map((img, idx) => ({
            imageUrl: img.imageUrl || img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            isPrimary: idx === 0,
          })),
        },
      },
      { onSuccess: () => router.push('/my-tools') },
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BackButton href="/my-tools" />
      <PageHeader
        title="Edit Tool"
        description={`Editing: ${data.data.name}`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tool Information */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Tool Information</CardTitle>
                <CardDescription>Basic details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Tool Name *</Label>
              <Input className="h-11 rounded-lg" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea className="rounded-lg min-h-[140px]" {...register('description')} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input className="h-11 rounded-lg" {...register('shortDescription')} />
            </div>

            <Separator />

            <CategorySelect
              type="TOOL"
              value={watch('categoryId') || ''}
              onChange={(v) => setValue('categoryId', v, { shouldValidate: true, shouldDirty: true })}
              required
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select
                  value={watch('condition')}
                  onValueChange={(v) => setValue('condition', v as any, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Listing Purpose *</Label>
                <Select
                  value={listingPurpose}
                  onValueChange={(v) => setValue('listingPurpose', v as any, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input className="h-11 rounded-lg" {...register('brandName')} />
              </div>
              <div className="space-y-2">
                <Label>Model Number</Label>
                <Input className="h-11 rounded-lg" {...register('modelNumber')} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  className="h-11 rounded-lg"
                  {...register('quantityAvailable', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> Tags
              </Label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, i) => (
                    <Badge key={tag} variant="secondary" className="gap-1 px-2.5 py-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {tags.length < 10 && (
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  onBlur={() => tagInput && addTag()}
                  className="h-10 rounded-lg"
                  placeholder="Add tag and press Enter"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sale Pricing */}
        {showSale && (
          <Card className="card-premium border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Sale Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('salePricingType') || 'FIXED'}
                    onValueChange={(v) => setValue('salePricingType', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRICING_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sale Price (₦) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    {...register('salePrice', { valueAsNumber: true })}
                  />
                  {errors.salePrice && (
                    <p className="text-sm text-destructive">{errors.salePrice.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lease Pricing */}
        {showLease && (
          <Card className="card-premium border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Lease Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('leasePricingType') || 'FIXED'}
                    onValueChange={(v) => setValue('leasePricingType', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRICING_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lease Rate (₦) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    {...register('leaseRate', { valueAsNumber: true })}
                  />
                  {errors.leaseRate && (
                    <p className="text-sm text-destructive">{errors.leaseRate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Rate Period</Label>
                  <Select
                    value={watch('leaseRatePeriod') || 'DAILY'}
                    onValueChange={(v) => setValue('leaseRatePeriod', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEASE_PERIOD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Deposit
                  </Label>
                  <Select
                    value={watch('depositRequired') || 'NOT_REQUIRED'}
                    onValueChange={(v) => setValue('depositRequired', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEPOSIT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {depositRequired === 'REQUIRED' && (
                  <div className="space-y-2">
                    <Label>Deposit Amount (₦) *</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="h-11 rounded-lg"
                      {...register('depositAmount', { valueAsNumber: true })}
                    />
                    {errors.depositAmount && (
                      <p className="text-sm text-destructive">{errors.depositAmount.message}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle>Location & Delivery</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Input className="h-11 rounded-lg" {...register('pickupLocation')} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  value={watch('pickupLocationState') || ''}
                  onValueChange={(v) => setValue('pickupLocationState', v, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {NIGERIA_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <Label className="font-medium">Delivery Available</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Can you deliver this tool?
                </p>
              </div>
              <Switch
                checked={watch('deliveryAvailable') || false}
                onCheckedChange={(v) => setValue('deliveryAvailable', v, { shouldDirty: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Camera className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Photos</CardTitle>
                <CardDescription>First image is the cover photo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MultiImageUpload
              images={images}
              onImagesChange={setImages}
              folder="tools"
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            className="btn-premium rounded-xl gap-2 px-8"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}