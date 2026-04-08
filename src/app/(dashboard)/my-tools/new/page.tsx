// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { useCreateTool } from '@/hooks/use-tools';
// import { toolSchema, ToolFormData } from '@/lib/validations';
// import { BackButton } from '@/components/shared/back-button';
// import { PageHeader } from '@/components/shared/page-header';
// import { CategorySelect } from '@/components/shared/category-select';
// import { MultiImageUpload } from '@/components/shared/multi-image-upload';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Separator } from '@/components/ui/separator';
// import {
//   Loader2,
//   Save,
//   Wrench,
//   DollarSign,
//   MapPin,
//   Camera,
//   Tag,
//   Info,
//   ShieldCheck,
//   Package,
//   X,
//   AlertCircle,
// } from 'lucide-react';

// const NIGERIA_STATES = [
//   'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
//   'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
//   'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
//   'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
//   'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
// ];

// // ── Must match Prisma ToolCondition enum ──
// const CONDITION_OPTIONS = [
//   { value: 'NEW', label: 'Brand New', desc: 'Unused, in original packaging' },
//   { value: 'LIKE_NEW', label: 'Like New', desc: 'Used but in excellent condition' },
//   { value: 'GOOD', label: 'Good', desc: 'Normal wear, fully functional' },
//   { value: 'FAIR', label: 'Fair', desc: 'Visible wear but functional' },
//   { value: 'FOR_PARTS', label: 'For Parts', desc: 'Not fully functional' },
// ];

// // ── Must match Prisma ToolListingPurpose enum ──
// const PURPOSE_OPTIONS = [
//   { value: 'FOR_SALE', label: 'For Sale', icon: '💰' },
//   { value: 'FOR_LEASE', label: 'For Lease / Rent', icon: '🔄' },
//   { value: 'BOTH', label: 'Sale & Lease', icon: '✨' },
// ];

// // ── Must match Prisma PricingType enum ──
// const PRICING_OPTIONS = [
//   { value: 'FIXED', label: 'Fixed Price' },
//   { value: 'NEGOTIABLE', label: 'Negotiable' },
//   { value: 'BOTH', label: 'Fixed but Negotiable' },
// ];

// // ── Must match Prisma LeaseRatePeriod enum ──
// const LEASE_PERIOD_OPTIONS = [
//   { value: 'PER_HOUR', label: 'Per Hour' },
//   { value: 'PER_DAY', label: 'Per Day' },
//   { value: 'PER_WEEK', label: 'Per Week' },
//   { value: 'PER_MONTH', label: 'Per Month' },
// ];

// // ── Must match Prisma DepositRequirement enum ──
// const DEPOSIT_OPTIONS = [
//   { value: 'REQUIRED', label: 'Required' },
//   { value: 'NOT_REQUIRED', label: 'Not Required' },
//   { value: 'NEGOTIABLE', label: 'Negotiable' },
// ];

// export default function NewToolPage() {
//   const router = useRouter();
//   const { mutate: createTool, isPending } = useCreateTool();
//   const [images, setImages] = useState<any[]>([]);
//   const [tagInput, setTagInput] = useState('');
//   const [tags, setTags] = useState<string[]>([]);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     trigger,
//     formState: { errors },
//   } = useForm<ToolFormData>({
//     resolver: zodResolver(toolSchema) as any,
//     mode: 'onChange',
//     defaultValues: {
//       condition: 'NEW',
//       listingPurpose: 'FOR_SALE',
//       salePricingType: 'FIXED',
//       leasePricingType: 'FIXED',
//       leaseRatePeriod: 'PER_DAY',
//       depositRequired: 'NOT_REQUIRED',
//       deliveryAvailable: false,
//       quantityAvailable: 1,
//       tags: [],
//     },
//   });

//   const listingPurpose = watch('listingPurpose');
//   const depositRequired = watch('depositRequired');
//   const salePricingType = watch('salePricingType');
//   const leasePricingType = watch('leasePricingType');
//   const showSale = listingPurpose === 'FOR_SALE' || listingPurpose === 'BOTH';
//   const showLease = listingPurpose === 'FOR_LEASE' || listingPurpose === 'BOTH';

//   const addTag = () => {
//     const trimmed = tagInput.trim().toLowerCase();
//     if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
//       const updated = [...tags, trimmed];
//       setTags(updated);
//       setValue('tags', updated);
//       setTagInput('');
//     }
//   };

//   const removeTag = (index: number) => {
//     const updated = tags.filter((_, i) => i !== index);
//     setTags(updated);
//     setValue('tags', updated);
//   };

//   const onSubmit = (data: ToolFormData) => {
//     const isSale =
//       data.listingPurpose === 'FOR_SALE' || data.listingPurpose === 'BOTH';
//     const isLease =
//       data.listingPurpose === 'FOR_LEASE' || data.listingPurpose === 'BOTH';

//     // Manual conditional validation
//     if (isSale && data.salePricingType === 'FIXED') {
//       if (!data.salePrice || data.salePrice <= 0) {
//         toast.error('Sale price is required for fixed pricing');
//         return;
//       }
//     }

//     if (isLease && data.leasePricingType === 'FIXED') {
//       if (!data.leaseRate || data.leaseRate <= 0) {
//         toast.error('Lease rate is required for fixed pricing');
//         return;
//       }
//     }

//     if (
//       isLease &&
//       data.depositRequired === 'REQUIRED' &&
//       (!data.depositAmount || data.depositAmount <= 0)
//     ) {
//       toast.error('Deposit amount is required when deposit is required');
//       return;
//     }

//     // Build clean payload — NO images property
//     const payload: Record<string, any> = {
//       name: data.name,
//       description: data.description,
//       categoryId: data.categoryId,
//       condition: data.condition,
//       listingPurpose: data.listingPurpose,
//       quantityAvailable: data.quantityAvailable || 1,
//       tags,
//       deliveryAvailable: data.deliveryAvailable || false,
//     };

//     // Optional strings — only include if non-empty
//     if (data.shortDescription) payload.shortDescription = data.shortDescription;
//     if (data.brandName) payload.brandName = data.brandName;
//     if (data.modelNumber) payload.modelNumber = data.modelNumber;
//     if (data.pickupLocation) payload.pickupLocation = data.pickupLocation;
//     if (data.pickupLocationState)
//       payload.pickupLocationState = data.pickupLocationState;
//     if (data.pickupLocationLga)
//       payload.pickupLocationLga = data.pickupLocationLga;

//     // Sale pricing — only when selling
//     if (isSale) {
//       payload.salePricingType = data.salePricingType || 'FIXED';
//       if (data.salePrice && data.salePrice > 0) {
//         payload.salePrice = data.salePrice;
//       }
//     }

//     // Lease pricing — only when leasing
//     if (isLease) {
//       payload.leasePricingType = data.leasePricingType || 'FIXED';
//       payload.leaseRatePeriod = data.leaseRatePeriod || 'PER_DAY';
//       if (data.leaseRate && data.leaseRate > 0) {
//         payload.leaseRate = data.leaseRate;
//       }
//       payload.depositRequired = data.depositRequired || 'NOT_REQUIRED';
//       if (
//         data.depositRequired === 'REQUIRED' &&
//         data.depositAmount &&
//         data.depositAmount > 0
//       ) {
//         payload.depositAmount = data.depositAmount;
//       }
//     }

//     // Delivery
//     if (data.deliveryAvailable) {
//       if (data.deliveryFee && data.deliveryFee > 0) {
//         payload.deliveryFee = data.deliveryFee;
//       }
//       if (data.deliveryNotes) {
//         payload.deliveryNotes = data.deliveryNotes;
//       }
//     }

//     // Images passed separately — the hook handles the 2-step flow:
//     // 1. Create tool (payload without images)
//     // 2. POST /tools/:id/images for each image
//     createTool(
//       {
//         ...payload,
//         images: images.map((img, idx) => ({
//           imageUrl: img.imageUrl || img.url,
//           thumbnailUrl: img.thumbnailUrl || img.url || img.imageUrl,
//           mediumUrl: img.mediumUrl || img.url || img.imageUrl,
//           isPrimary: idx === 0,
//         })),
//       },
//       { onSuccess: () => router.push('/my-tools') },
//     );
//   };

//   const onError = (formErrors: any) => {
//     console.error('Form validation errors:', formErrors);
//   };

//   const errorCount = Object.keys(errors).length;

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       <BackButton href="/my-tools" />
//       <PageHeader
//         title="List New Tool"
//         description="Share your tool with the community for sale or lease"
//       />

//       <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
//         <Info className="h-4 w-4 shrink-0" />
//         <span>Fields marked with * are required.</span>
//       </div>

//       {/* Error Summary */}
//       {errorCount > 0 && (
//         <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive">
//           <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
//           <div className="space-y-1">
//             <p className="text-sm font-semibold">
//               Please fix {errorCount}{' '}
//               {errorCount === 1 ? 'error' : 'errors'} before submitting
//             </p>
//             <ul className="text-xs space-y-0.5 list-disc list-inside text-destructive/80">
//               {Object.entries(errors).map(([key, error]) => (
//                 <li key={key}>
//                   <span className="font-medium capitalize">
//                     {key.replace(/([A-Z])/g, ' $1').trim()}
//                   </span>
//                   : {(error as any)?.message || 'Invalid value'}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit(
//           onSubmit as (data: Record<string, any>) => void,
//           onError,
//         )}
//         className="space-y-6"
//       >
//         {/* ══════════════════════════════════════ */}
//         {/* SECTION 1: Tool Information            */}
//         {/* ══════════════════════════════════════ */}
//         <Card className="card-premium">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <div className="p-2 rounded-lg bg-primary/10">
//                 <Wrench className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <CardTitle>Tool Information</CardTitle>
//                 <CardDescription>
//                   Basic details about your tool
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="name">Tool Name *</Label>
//               <Input
//                 id="name"
//                 className="h-11 rounded-lg"
//                 placeholder="e.g. John Deere 5075E Tractor"
//                 {...register('name')}
//               />
//               {errors.name && (
//                 <p className="text-sm text-destructive">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 className="rounded-lg min-h-[140px]"
//                 placeholder="Describe the tool in detail — features, capabilities, condition details, included accessories..."
//                 {...register('description')}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Min 20 characters
//               </p>
//               {errors.description && (
//                 <p className="text-sm text-destructive">
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Short Description</Label>
//               <Input
//                 className="h-11 rounded-lg"
//                 placeholder="Brief one-line summary (optional)"
//                 {...register('shortDescription')}
//               />
//             </div>

//             <Separator />

//             <CategorySelect
//               type="TOOL_FARMING"
//               value={watch('categoryId') || ''}
//               onChange={(v) =>
//                 setValue('categoryId', v, { shouldValidate: true })
//               }
//               label="Category *"
//               placeholder="Select tool category"
//               required
//             />
//             {errors.categoryId && (
//               <p className="text-sm text-destructive">
//                 {errors.categoryId.message}
//               </p>
//             )}

//             <Separator />

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div className="space-y-2">
//                 <Label>Condition *</Label>
//                 <Select
//                   value={watch('condition')}
//                   onValueChange={(v) =>
//                     setValue('condition', v as any, {
//                       shouldValidate: true,
//                     })
//                   }
//                 >
//                   <SelectTrigger className="h-11 rounded-lg">
//                     <SelectValue placeholder="Select condition" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {CONDITION_OPTIONS.map((o) => (
//                       <SelectItem key={o.value} value={o.value}>
//                         <div>
//                           <span>{o.label}</span>
//                           <span className="text-xs text-muted-foreground ml-2">
//                             — {o.desc}
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.condition && (
//                   <p className="text-sm text-destructive">
//                     {errors.condition.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label>Listing Purpose *</Label>
//                 <Select
//                   value={listingPurpose}
//                   onValueChange={(v) => {
//                     setValue('listingPurpose', v as any, {
//                       shouldValidate: true,
//                     });
//                     setTimeout(() => {
//                       trigger([
//                         'salePrice',
//                         'leaseRate',
//                         'depositAmount',
//                       ]);
//                     }, 100);
//                   }}
//                 >
//                   <SelectTrigger className="h-11 rounded-lg">
//                     <SelectValue placeholder="Select purpose" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PURPOSE_OPTIONS.map((o) => (
//                       <SelectItem key={o.value} value={o.value}>
//                         {o.icon} {o.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.listingPurpose && (
//                   <p className="text-sm text-destructive">
//                     {errors.listingPurpose.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label>Brand Name</Label>
//                 <Input
//                   className="h-11 rounded-lg"
//                   placeholder="e.g. John Deere"
//                   {...register('brandName')}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Model Number</Label>
//                 <Input
//                   className="h-11 rounded-lg"
//                   placeholder="e.g. 5075E"
//                   {...register('modelNumber')}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Quantity</Label>
//                 <Input
//                   type="number"
//                   min={1}
//                   className="h-11 rounded-lg"
//                   {...register('quantityAvailable', {
//                     valueAsNumber: true,
//                   })}
//                 />
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="space-y-2">
//               <Label className="flex items-center gap-1">
//                 <Tag className="h-3.5 w-3.5" /> Tags
//               </Label>
//               {tags.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5">
//                   {tags.map((tag, i) => (
//                     <Badge
//                       key={tag}
//                       variant="secondary"
//                       className="gap-1 px-2.5 py-1"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(i)}
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//               {tags.length < 10 && (
//                 <Input
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' || e.key === ',') {
//                       e.preventDefault();
//                       addTag();
//                     }
//                   }}
//                   onBlur={() => tagInput && addTag()}
//                   className="h-10 rounded-lg"
//                   placeholder="Type tag and press Enter"
//                 />
//               )}
//               <p className="text-xs text-muted-foreground">
//                 {tags.length}/10 tags
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ══════════════════════════════════════ */}
//         {/* SECTION 2: Sale Pricing                */}
//         {/* ══════════════════════════════════════ */}
//         {showSale && (
//           <Card className="card-premium border-l-4 border-l-green-500">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-lg bg-green-500/10">
//                   <DollarSign className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <CardTitle>Sale Pricing</CardTitle>
//                   <CardDescription>
//                     Set your selling price
//                   </CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Pricing Type</Label>
//                   <Select
//                     value={watch('salePricingType') || 'FIXED'}
//                     onValueChange={(v) => {
//                       setValue('salePricingType', v as any);
//                       trigger('salePrice');
//                     }}
//                   >
//                     <SelectTrigger className="h-11 rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {PRICING_OPTIONS.map((o) => (
//                         <SelectItem key={o.value} value={o.value}>
//                           {o.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>
//                     Sale Price (₦)
//                     {salePricingType === 'FIXED' && ' *'}
//                   </Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     step="0.01"
//                     className="h-11 rounded-lg"
//                     placeholder="0.00"
//                     {...register('salePrice', {
//                       valueAsNumber: true,
//                     })}
//                   />
//                   {errors.salePrice && (
//                     <p className="text-sm text-destructive">
//                       {errors.salePrice.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ══════════════════════════════════════ */}
//         {/* SECTION 3: Lease Pricing               */}
//         {/* ══════════════════════════════════════ */}
//         {showLease && (
//           <Card className="card-premium border-l-4 border-l-blue-500">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-lg bg-blue-500/10">
//                   <Package className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <CardTitle>Lease / Rental Pricing</CardTitle>
//                   <CardDescription>
//                     Set your lease rate and terms
//                   </CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Pricing Type</Label>
//                   <Select
//                     value={watch('leasePricingType') || 'FIXED'}
//                     onValueChange={(v) => {
//                       setValue('leasePricingType', v as any);
//                       trigger('leaseRate');
//                     }}
//                   >
//                     <SelectTrigger className="h-11 rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {PRICING_OPTIONS.map((o) => (
//                         <SelectItem key={o.value} value={o.value}>
//                           {o.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>
//                     Lease Rate (₦)
//                     {leasePricingType === 'FIXED' && ' *'}
//                   </Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     step="0.01"
//                     className="h-11 rounded-lg"
//                     placeholder="0.00"
//                     {...register('leaseRate', {
//                       valueAsNumber: true,
//                     })}
//                   />
//                   {errors.leaseRate && (
//                     <p className="text-sm text-destructive">
//                       {errors.leaseRate.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Rate Period</Label>
//                   <Select
//                     value={watch('leaseRatePeriod') || 'PER_DAY'}
//                     onValueChange={(v) =>
//                       setValue('leaseRatePeriod', v as any)
//                     }
//                   >
//                     <SelectTrigger className="h-11 rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {LEASE_PERIOD_OPTIONS.map((o) => (
//                         <SelectItem key={o.value} value={o.value}>
//                           {o.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-1">
//                     <ShieldCheck className="h-3.5 w-3.5" /> Deposit
//                   </Label>
//                   <Select
//                     value={
//                       watch('depositRequired') || 'NOT_REQUIRED'
//                     }
//                     onValueChange={(v) => {
//                       setValue('depositRequired', v as any);
//                       trigger('depositAmount');
//                     }}
//                   >
//                     <SelectTrigger className="h-11 rounded-lg">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {DEPOSIT_OPTIONS.map((o) => (
//                         <SelectItem key={o.value} value={o.value}>
//                           {o.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {depositRequired === 'REQUIRED' && (
//                   <div className="space-y-2">
//                     <Label>Deposit Amount (₦) *</Label>
//                     <Input
//                       type="number"
//                       min={0}
//                       step="0.01"
//                       className="h-11 rounded-lg"
//                       placeholder="0.00"
//                       {...register('depositAmount', {
//                         valueAsNumber: true,
//                       })}
//                     />
//                     {errors.depositAmount && (
//                       <p className="text-sm text-destructive">
//                         {errors.depositAmount.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ══════════════════════════════════════ */}
//         {/* SECTION 4: Location & Delivery         */}
//         {/* ══════════════════════════════════════ */}
//         <Card className="card-premium">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <div className="p-2 rounded-lg bg-orange-500/10">
//                 <MapPin className="h-5 w-5 text-orange-600" />
//               </div>
//               <div>
//                 <CardTitle>Location & Delivery</CardTitle>
//                 <CardDescription>
//                   Where can this tool be picked up?
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Pickup Location</Label>
//                 <Input
//                   className="h-11 rounded-lg"
//                   placeholder="Address or landmark"
//                   {...register('pickupLocation')}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>State</Label>
//                 <Select
//                   value={watch('pickupLocationState') || ''}
//                   onValueChange={(v) =>
//                     setValue('pickupLocationState', v)
//                   }
//                 >
//                   <SelectTrigger className="h-11 rounded-lg">
//                     <SelectValue placeholder="Select state" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-[250px]">
//                     {NIGERIA_STATES.map((s) => (
//                       <SelectItem key={s} value={s}>
//                         {s}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <Separator />

//             <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
//               <div>
//                 <Label className="font-medium">
//                   Delivery Available
//                 </Label>
//                 <p className="text-xs text-muted-foreground mt-0.5">
//                   Can you deliver this tool to the buyer/renter?
//                 </p>
//               </div>
//               <Switch
//                 checked={watch('deliveryAvailable') || false}
//                 onCheckedChange={(v) =>
//                   setValue('deliveryAvailable', v)
//                 }
//               />
//             </div>

//             {watch('deliveryAvailable') && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
//                 <div className="space-y-2">
//                   <Label>Delivery Fee (₦)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     step="0.01"
//                     className="h-11 rounded-lg"
//                     placeholder="0.00 (leave empty if free)"
//                     {...register('deliveryFee', {
//                       valueAsNumber: true,
//                     })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Delivery Notes</Label>
//                   <Input
//                     className="h-11 rounded-lg"
//                     placeholder="e.g. Within Kaduna only"
//                     {...register('deliveryNotes')}
//                   />
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* ══════════════════════════════════════ */}
//         {/* SECTION 5: Images                      */}
//         {/* ══════════════════════════════════════ */}
//         <Card className="card-premium">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <div className="p-2 rounded-lg bg-purple-500/10">
//                 <Camera className="h-5 w-5 text-purple-600" />
//               </div>
//               <div>
//                 <CardTitle>Photos</CardTitle>
//                 <CardDescription>
//                   Add up to 5 photos. First image is the cover.
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <MultiImageUpload
//               images={images}
//               onImagesChange={setImages}
//               folder="tools"
//               maxImages={5}
//             />
//           </CardContent>
//         </Card>

//         {/* ══════════════════════════════════════ */}
//         {/* SUBMIT                                 */}
//         {/* ══════════════════════════════════════ */}
//         <div className="flex items-center gap-4 pt-2">
//           <Button
//             type="submit"
//             className="btn-premium rounded-xl gap-2 px-8"
//             disabled={isPending}
//           >
//             {isPending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Save className="h-4 w-4" />
//             )}
//             List Tool
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             className="rounded-xl"
//             onClick={() => router.back()}
//           >
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateTool } from '@/hooks/use-tools';
import { toolSchema, ToolFormData } from '@/lib/validations';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { CategorySelect } from '@/components/shared/category-select';
import { MultiImageUpload } from '@/components/shared/multi-image-upload';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
  Info,
  ShieldCheck,
  Package,
  X,
  AlertCircle,
} from 'lucide-react';

const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// ── Must match Prisma ToolCondition enum ──
const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'Brand New', desc: 'Unused, in original packaging' },
  { value: 'LIKE_NEW', label: 'Like New', desc: 'Used but in excellent condition' },
  { value: 'GOOD', label: 'Good', desc: 'Normal wear, fully functional' },
  { value: 'FAIR', label: 'Fair', desc: 'Visible wear but functional' },
  { value: 'FOR_PARTS', label: 'For Parts', desc: 'Not fully functional' },
];

// ── Must match Prisma ToolListingPurpose enum ──
const PURPOSE_OPTIONS = [
  { value: 'FOR_SALE', label: 'For Sale', icon: '💰' },
  { value: 'FOR_LEASE', label: 'For Lease / Rent', icon: '🔄' },
  { value: 'BOTH', label: 'Sale & Lease', icon: '✨' },
];

// ── Must match Prisma PricingType enum ──
const PRICING_OPTIONS = [
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'NEGOTIABLE', label: 'Negotiable' },
  { value: 'BOTH', label: 'Fixed but Negotiable' },
];

// ── Must match Prisma LeaseRatePeriod enum ──
const LEASE_PERIOD_OPTIONS = [
  { value: 'PER_HOUR', label: 'Per Hour' },
  { value: 'PER_DAY', label: 'Per Day' },
  { value: 'PER_WEEK', label: 'Per Week' },
  { value: 'PER_MONTH', label: 'Per Month' },
];

// ── Must match Prisma DepositRequirement enum ──
const DEPOSIT_OPTIONS = [
  { value: 'REQUIRED', label: 'Required' },
  { value: 'NOT_REQUIRED', label: 'Not Required' },
  { value: 'NEGOTIABLE', label: 'Negotiable' },
];

export default function NewToolPage() {
  const router = useRouter();
  const { mutate: createTool, isPending } = useCreateTool();
  const [images, setImages] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema) as any,
    mode: 'onChange',
    defaultValues: {
      condition: 'NEW',
      listingPurpose: 'FOR_SALE',
      salePricingType: 'FIXED',
      leasePricingType: 'FIXED',
      leaseRatePeriod: 'PER_DAY',
      depositRequired: 'NOT_REQUIRED',
      deliveryAvailable: false,
      quantityAvailable: 1,
      tags: [],
    },
  });

  const listingPurpose = watch('listingPurpose');
  const depositRequired = watch('depositRequired');
  const salePricingType = watch('salePricingType');
  const leasePricingType = watch('leasePricingType');
  const showSale = listingPurpose === 'FOR_SALE' || listingPurpose === 'BOTH';
  const showLease = listingPurpose === 'FOR_LEASE' || listingPurpose === 'BOTH';

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      const updated = [...tags, trimmed];
      setTags(updated);
      setValue('tags', updated);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    setValue('tags', updated);
  };

  const onSubmit = (data: ToolFormData) => {
    const isSale =
      data.listingPurpose === 'FOR_SALE' || data.listingPurpose === 'BOTH';
    const isLease =
      data.listingPurpose === 'FOR_LEASE' || data.listingPurpose === 'BOTH';

    // Manual conditional validation
    if (isSale && data.salePricingType === 'FIXED') {
      if (!data.salePrice || data.salePrice <= 0) {
        toast.error('Sale price is required for fixed pricing');
        return;
      }
    }

    if (isLease && data.leasePricingType === 'FIXED') {
      if (!data.leaseRate || data.leaseRate <= 0) {
        toast.error('Lease rate is required for fixed pricing');
        return;
      }
    }

    if (
      isLease &&
      data.depositRequired === 'REQUIRED' &&
      (!data.depositAmount || data.depositAmount <= 0)
    ) {
      toast.error('Deposit amount is required when deposit is required');
      return;
    }

    // Build clean payload — NO images property
    const payload: Record<string, any> = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      condition: data.condition,
      listingPurpose: data.listingPurpose,
      quantityAvailable: data.quantityAvailable || 1,
      tags,
      deliveryAvailable: data.deliveryAvailable || false,
    };

    // Optional strings — only include if non-empty
    if (data.shortDescription) payload.shortDescription = data.shortDescription;
    if (data.brandName) payload.brandName = data.brandName;
    if (data.modelNumber) payload.modelNumber = data.modelNumber;
    if (data.pickupLocation) payload.pickupLocation = data.pickupLocation;
    if (data.pickupLocationState)
      payload.pickupLocationState = data.pickupLocationState;
    if (data.pickupLocationLga)
      payload.pickupLocationLga = data.pickupLocationLga;

    // Sale pricing — only when selling
    if (isSale) {
      payload.salePricingType = data.salePricingType || 'FIXED';
      if (data.salePrice && data.salePrice > 0) {
        payload.salePrice = data.salePrice;
      }
    }

    // Lease pricing — only when leasing
    if (isLease) {
      payload.leasePricingType = data.leasePricingType || 'FIXED';
      payload.leaseRatePeriod = data.leaseRatePeriod || 'PER_DAY';
      if (data.leaseRate && data.leaseRate > 0) {
        payload.leaseRate = data.leaseRate;
      }
      payload.depositRequired = data.depositRequired || 'NOT_REQUIRED';
      if (
        data.depositRequired === 'REQUIRED' &&
        data.depositAmount &&
        data.depositAmount > 0
      ) {
        payload.depositAmount = data.depositAmount;
      }
    }

    // Delivery
    if (data.deliveryAvailable) {
      if (data.deliveryFee && data.deliveryFee > 0) {
        payload.deliveryFee = data.deliveryFee;
      }
      if (data.deliveryNotes) {
        payload.deliveryNotes = data.deliveryNotes;
      }
    }

    // Images passed separately — the hook handles the 2-step flow:
    // 1. Create tool (payload without images)
    // 2. POST /tools/:id/images for each image
    createTool(
      {
        ...payload,
        images: images.map((img, idx) => ({
          imageUrl: img.imageUrl || img.url,
          thumbnailUrl: img.thumbnailUrl || img.url || img.imageUrl,
          mediumUrl: img.mediumUrl || img.url || img.imageUrl,
          isPrimary: idx === 0,
        })),
      },
      { onSuccess: () => router.push('/my-tools') },
    );
  };

  const onError = (formErrors: any) => {
    console.error('Form validation errors:', formErrors);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BackButton href="/my-tools" />
      <PageHeader
        title="List New Tool"
        description="Share your tool with the community for sale or lease"
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <Info className="h-4 w-4 shrink-0" />
        <span>Fields marked with * are required.</span>
      </div>

      {/* Error Summary */}
      {errorCount > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Please fix {errorCount}{' '}
              {errorCount === 1 ? 'error' : 'errors'} before submitting
            </p>
            <ul className="text-xs space-y-0.5 list-disc list-inside text-destructive/80">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  : {(error as any)?.message || 'Invalid value'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(
          onSubmit as (data: Record<string, any>) => void,
          onError,
        )}
        className="space-y-6"
      >
        {/* ══════════════════════════════════════ */}
        {/* SECTION 1: Tool Information            */}
        {/* ══════════════════════════════════════ */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Tool Information</CardTitle>
                <CardDescription>
                  Basic details about your tool
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                className="h-11 rounded-lg"
                placeholder="e.g. John Deere 5075E Tractor"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                className="rounded-lg min-h-[140px]"
                placeholder="Describe the tool in detail — features, capabilities, condition details, included accessories..."
                {...register('description')}
              />
              <p className="text-xs text-muted-foreground">
                Min 20 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                className="h-11 rounded-lg"
                placeholder="Brief one-line summary (optional)"
                {...register('shortDescription')}
              />
            </div>

            <Separator />

            <CategorySelect
              type="TOOL_FARMING"
              value={watch('categoryId') || ''}
              onChange={(v) =>
                setValue('categoryId', v, { shouldValidate: true })
              }
              label="Category *"
              placeholder="Select tool category"
              required
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select
                  value={watch('condition')}
                  onValueChange={(v) =>
                    setValue('condition', v as any, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <div>
                          <span>{o.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            — {o.desc}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Listing Purpose *</Label>
                <Select
                  value={listingPurpose}
                  onValueChange={(v) => {
                    setValue('listingPurpose', v as any, {
                      shouldValidate: true,
                    });
                    setTimeout(() => {
                      trigger([
                        'salePrice',
                        'leaseRate',
                        'depositAmount',
                      ]);
                    }, 100);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.icon} {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.listingPurpose && (
                  <p className="text-sm text-destructive">
                    {errors.listingPurpose.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  className="h-11 rounded-lg"
                  placeholder="e.g. John Deere"
                  {...register('brandName')}
                />
              </div>
              <div className="space-y-2">
                <Label>Model Number</Label>
                <Input
                  className="h-11 rounded-lg"
                  placeholder="e.g. 5075E"
                  {...register('modelNumber')}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  className="h-11 rounded-lg"
                  {...register('quantityAvailable', {
                    valueAsNumber: true,
                  })}
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
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 px-2.5 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                      >
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
                  placeholder="Type tag and press Enter"
                />
              )}
              <p className="text-xs text-muted-foreground">
                {tags.length}/10 tags
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════ */}
        {/* SECTION 2: Sale Pricing                */}
        {/* ══════════════════════════════════════ */}
        {showSale && (
          <Card className="card-premium border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Sale Pricing</CardTitle>
                  <CardDescription>
                    Set your selling price
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('salePricingType') || 'FIXED'}
                    onValueChange={(v) => {
                      setValue('salePricingType', v as any);
                      trigger('salePrice');
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Sale Price (₦)
                    {salePricingType === 'FIXED' && ' *'}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    placeholder="0.00"
                    {...register('salePrice', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.salePrice && (
                    <p className="text-sm text-destructive">
                      {errors.salePrice.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════ */}
        {/* SECTION 3: Lease Pricing               */}
        {/* ══════════════════════════════════════ */}
        {showLease && (
          <Card className="card-premium border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Lease / Rental Pricing</CardTitle>
                  <CardDescription>
                    Set your lease rate and terms
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('leasePricingType') || 'FIXED'}
                    onValueChange={(v) => {
                      setValue('leasePricingType', v as any);
                      trigger('leaseRate');
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Lease Rate (₦)
                    {leasePricingType === 'FIXED' && ' *'}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    placeholder="0.00"
                    {...register('leaseRate', {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.leaseRate && (
                    <p className="text-sm text-destructive">
                      {errors.leaseRate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Rate Period</Label>
                  <Select
                    value={watch('leaseRatePeriod') || 'PER_DAY'}
                    onValueChange={(v) =>
                      setValue('leaseRatePeriod', v as any)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEASE_PERIOD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
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
                    value={
                      watch('depositRequired') || 'NOT_REQUIRED'
                    }
                    onValueChange={(v) => {
                      setValue('depositRequired', v as any);
                      trigger('depositAmount');
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPOSIT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
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
                      placeholder="0.00"
                      {...register('depositAmount', {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.depositAmount && (
                      <p className="text-sm text-destructive">
                        {errors.depositAmount.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════ */}
        {/* SECTION 4: Location & Delivery         */}
        {/* ══════════════════════════════════════ */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Location & Delivery</CardTitle>
                <CardDescription>
                  Where can this tool be picked up?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Input
                  className="h-11 rounded-lg"
                  placeholder="Address or landmark"
                  {...register('pickupLocation')}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  value={watch('pickupLocationState') || ''}
                  onValueChange={(v) =>
                    setValue('pickupLocationState', v)
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {NIGERIA_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <Label className="font-medium">
                  Delivery Available
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Can you deliver this tool to the buyer/renter?
                </p>
              </div>
              <Switch
                checked={watch('deliveryAvailable') || false}
                onCheckedChange={(v) =>
                  setValue('deliveryAvailable', v)
                }
              />
            </div>

            {watch('deliveryAvailable') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                <div className="space-y-2">
                  <Label>Delivery Fee (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    placeholder="0.00 (leave empty if free)"
                    {...register('deliveryFee', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Notes</Label>
                  <Input
                    className="h-11 rounded-lg"
                    placeholder="e.g. Within Kaduna only"
                    {...register('deliveryNotes')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════ */}
        {/* SECTION 5: Images                      */}
        {/* ══════════════════════════════════════ */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Camera className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Photos</CardTitle>
                <CardDescription>
                  Add up to 5 photos. First image is the cover.
                </CardDescription>
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

        {/* ══════════════════════════════════════ */}
        {/* SUBMIT                                 */}
        {/* ══════════════════════════════════════ */}
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
            List Tool
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