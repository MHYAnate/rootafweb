// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useCreateTool } from '@/hooks/use-tools';
// import { toolSchema, ToolFormData } from '@/lib/validations';
// import { BackButton } from '@/components/shared/back-button';
// import { PageHeader } from '@/components/shared/page-header';
// import { CategorySelect } from '@/components/shared/category-select';
// import { MultiImageUpload } from '@/components/shared/multi-image-upload';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Loader2, Save } from 'lucide-react';

// const CONDITION_OPTIONS = [
//   { value: 'NEW', label: 'New' },
//   { value: 'FAIRLY_USED', label: 'Fairly Used' },
//   { value: 'USED', label: 'Used' },
//   { value: 'REFURBISHED', label: 'Refurbished' },
// ];

// const PURPOSE_OPTIONS = [
//   { value: 'SALE', label: 'For Sale' },
//   { value: 'LEASE', label: 'For Lease' },
//   { value: 'BOTH', label: 'Sale & Lease' },
// ];

// const PRICING_OPTIONS = [
//   { value: 'FIXED', label: 'Fixed' },
//   { value: 'NEGOTIABLE', label: 'Negotiable' },
//   { value: 'BOTH', label: 'Both' },
// ];

// const LEASE_PERIOD_OPTIONS = [
//   { value: 'HOURLY', label: 'Per Hour' },
//   { value: 'DAILY', label: 'Per Day' },
//   { value: 'WEEKLY', label: 'Per Week' },
//   { value: 'MONTHLY', label: 'Per Month' },
//   { value: 'SEASONAL', label: 'Per Season' },
// ];

// const DEPOSIT_OPTIONS = [
//   { value: 'REQUIRED', label: 'Required' },
//   { value: 'NOT_REQUIRED', label: 'Not Required' },
//   { value: 'NEGOTIABLE', label: 'Negotiable' },
// ];

// export default function NewToolPage() {
//   const router = useRouter();
//   const { mutate: createTool, isPending } = useCreateTool();
//   const [images, setImages] = useState<any[]>([]);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<ToolFormData>({
//     resolver: zodResolver(toolSchema),
//     defaultValues: {
//       condition: 'NEW',
//       listingPurpose: 'SALE',
//       salePricingType: 'FIXED',
//       leasePricingType: 'FIXED',
//       depositRequired: 'NOT_REQUIRED',
//       deliveryAvailable: false,
//       quantityAvailable: 1,
//     },
//   });

//   const listingPurpose = watch('listingPurpose');
//   const depositRequired = watch('depositRequired');
//   const showSale = listingPurpose === 'SALE' || listingPurpose === 'BOTH';
//   const showLease = listingPurpose === 'LEASE' || listingPurpose === 'BOTH';

//   const onSubmit = (data: ToolFormData) => {
//     // Strip irrelevant pricing fields based on purpose
//     const payload: any = { ...data };
//     if (!showSale) {
//       delete payload.salePricingType;
//       delete payload.salePrice;
//     }
//     if (!showLease) {
//       delete payload.leasePricingType;
//       delete payload.leaseRate;
//       delete payload.leaseRatePeriod;
//       delete payload.depositRequired;
//       delete payload.depositAmount;
//     }
//     if (depositRequired !== 'REQUIRED') {
//       delete payload.depositAmount;
//     }

//     createTool(
//       {
//         ...payload,
//         images: images.map((img, idx) => ({
//           ...img,
//           isPrimary: idx === 0,
//         })),
//       },
//       { onSuccess: () => router.push('/my-tools') }
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <BackButton href="/my-tools" />
//       <PageHeader title="List New Tool" />

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* ── Basic Details ── */}
//         <Card className="card-premium">
//           <CardHeader>
//             <CardTitle>Tool Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label>Tool Name *</Label>
//               <Input className="h-11 rounded-lg" {...register('name')} />
//               {errors.name && (
//                 <p className="text-sm text-destructive">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Description *</Label>
//               <Textarea
//                 className="rounded-lg min-h-[120px]"
//                 placeholder="Describe the tool, its capabilities, and any relevant details..."
//                 {...register('description')}
//               />
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
//                 placeholder="Brief summary (optional)"
//                 {...register('shortDescription')}
//               />
//             </div>

//             <CategorySelect
//               type="TOOL"
//               value={watch('categoryId') || ''}
//               onChange={(v) => setValue('categoryId', v)}
//             />
//             {errors.categoryId && (
//               <p className="text-sm text-destructive">
//                 {errors.categoryId.message}
//               </p>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Condition *</Label>
//                 <Select
//                   value={watch('condition')}
//                   onValueChange={(v) => setValue('condition', v as any)}
//                 >
//                   <SelectTrigger className="h-11 rounded-lg">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {CONDITION_OPTIONS.map((o) => (
//                       <SelectItem key={o.value} value={o.value}>
//                         {o.label}
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
//                   value={watch('listingPurpose')}
//                   onValueChange={(v) =>
//                     setValue('listingPurpose', v as any)
//                   }
//                 >
//                   <SelectTrigger className="h-11 rounded-lg">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PURPOSE_OPTIONS.map((o) => (
//                       <SelectItem key={o.value} value={o.value}>
//                         {o.label}
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
//                 <Label>Quantity Available</Label>
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
//           </CardContent>
//         </Card>

//         {/* ── Sale Pricing ── */}
//         {showSale && (
//           <Card className="card-premium">
//             <CardHeader>
//               <CardTitle>Sale Pricing</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Pricing Type</Label>
//                   <Select
//                     value={watch('salePricingType') || 'FIXED'}
//                     onValueChange={(v) =>
//                       setValue('salePricingType', v as any)
//                     }
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
//                   <Label>Sale Price (₦)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     className="h-11 rounded-lg"
//                     placeholder="0.00"
//                     {...register('salePrice', { valueAsNumber: true })}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Lease Pricing ── */}
//         {showLease && (
//           <Card className="card-premium">
//             <CardHeader>
//               <CardTitle>Lease Pricing</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Pricing Type</Label>
//                   <Select
//                     value={watch('leasePricingType') || 'FIXED'}
//                     onValueChange={(v) =>
//                       setValue('leasePricingType', v as any)
//                     }
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
//                   <Label>Lease Rate (₦)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     className="h-11 rounded-lg"
//                     placeholder="0.00"
//                     {...register('leaseRate', { valueAsNumber: true })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Rate Period</Label>
//                   <Select
//                     value={watch('leaseRatePeriod') || 'DAILY'}
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

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Deposit Requirement</Label>
//                   <Select
//                     value={watch('depositRequired') || 'NOT_REQUIRED'}
//                     onValueChange={(v) =>
//                       setValue('depositRequired', v as any)
//                     }
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
//                     <Label>Deposit Amount (₦)</Label>
//                     <Input
//                       type="number"
//                       min={0}
//                       className="h-11 rounded-lg"
//                       placeholder="0.00"
//                       {...register('depositAmount', {
//                         valueAsNumber: true,
//                       })}
//                     />
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Location & Delivery ── */}
//         <Card className="card-premium">
//           <CardHeader>
//             <CardTitle>Location & Delivery</CardTitle>
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
//                 <Input
//                   className="h-11 rounded-lg"
//                   placeholder="e.g. Lagos"
//                   {...register('pickupLocationState')}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Switch
//                 checked={watch('deliveryAvailable') || false}
//                 onCheckedChange={(v) =>
//                   setValue('deliveryAvailable', v)
//                 }
//               />
//               <Label>Delivery Available</Label>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ── Images ── */}
//         <Card className="card-premium">
//           <CardHeader>
//             <CardTitle>Images</CardTitle>
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

//         <Button
//           type="submit"
//           className="btn-premium rounded-xl gap-2"
//           disabled={isPending}
//         >
//           {isPending ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Save className="h-4 w-4" />
//           )}
//           List Tool
//         </Button>
//       </form>
//     </div>
//   );
// }

// src/app/(dashboard)/my-tools/new/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateTool } from '@/hooks/use-tools';
import { toolSchema, ToolFormData } from '@/lib/validations';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
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
  Info,
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
  { value: 'NEW', label: 'Brand New', desc: 'Unused, in original packaging' },
  { value: 'FAIRLY_USED', label: 'Fairly Used', desc: 'Good working condition' },
  { value: 'USED', label: 'Used', desc: 'Functional with wear' },
  { value: 'REFURBISHED', label: 'Refurbished', desc: 'Restored to working condition' },
];

const PURPOSE_OPTIONS = [
  { value: 'SALE', label: 'For Sale', icon: '💰' },
  { value: 'LEASE', label: 'For Lease / Rent', icon: '🔄' },
  { value: 'BOTH', label: 'Sale & Lease', icon: '✨' },
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
    formState: { errors },
  } = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      condition: 'NEW',
      listingPurpose: 'SALE',
      salePricingType: 'FIXED',
      leasePricingType: 'FIXED',
      depositRequired: 'NOT_REQUIRED',
      deliveryAvailable: false,
      quantityAvailable: 1,
      tags: [],
    },
  });

  const listingPurpose = watch('listingPurpose');
  const depositRequired = watch('depositRequired');
  const showSale = listingPurpose === 'SALE' || listingPurpose === 'BOTH';
  const showLease = listingPurpose === 'LEASE' || listingPurpose === 'BOTH';

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
    const payload: any = { ...data, tags };

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

    // Clean empty strings
    if (!payload.shortDescription) delete payload.shortDescription;
    if (!payload.brandName) delete payload.brandName;
    if (!payload.modelNumber) delete payload.modelNumber;
    if (!payload.pickupLocation) delete payload.pickupLocation;
    if (!payload.pickupLocationState) delete payload.pickupLocationState;

    createTool(
      {
        ...payload,
        images: images.map((img, idx) => ({
          imageUrl: img.imageUrl || img.url,
          thumbnailUrl: img.thumbnailUrl || img.url,
          isPrimary: idx === 0,
        })),
      },
      { onSuccess: () => router.push('/my-tools') },
    );
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ══════════════════════════════════════ */}
        {/* SECTION 1: Tool Information             */}
        {/* ══════════════════════════════════════ */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Tool Information</CardTitle>
                <CardDescription>Basic details about your tool</CardDescription>
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
                <p className="text-sm text-destructive">{errors.name.message}</p>
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
              <p className="text-xs text-muted-foreground">Min 20 characters</p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
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

            {/* Category — uses composite type "TOOL" */}
            <CategorySelect
              type="TOOL"
              value={watch('categoryId') || ''}
              onChange={(v) => setValue('categoryId', v, { shouldValidate: true })}
              label="Category"
              placeholder="Select tool category"
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
                  onValueChange={(v) =>
                    setValue('condition', v as any, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive">{errors.condition.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Listing Purpose *</Label>
                <Select
                  value={listingPurpose}
                  onValueChange={(v) =>
                    setValue('listingPurpose', v as any, { shouldValidate: true })
                  }
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
                  <p className="text-sm text-destructive">{errors.listingPurpose.message}</p>
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
                  placeholder="Type tag and press Enter"
                />
              )}
              <p className="text-xs text-muted-foreground">{tags.length}/10 tags</p>
            </div>
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════ */}
        {/* SECTION 2: Sale Pricing                 */}
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
                  <CardDescription>Set your selling price</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('salePricingType') || 'FIXED'}
                    onValueChange={(v) => setValue('salePricingType', v as any)}
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
                  <Label>Sale Price (₦) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    placeholder="0.00"
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

        {/* ══════════════════════════════════════ */}
        {/* SECTION 3: Lease Pricing                */}
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
                  <CardDescription>Set your lease rate and terms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('leasePricingType') || 'FIXED'}
                    onValueChange={(v) => setValue('leasePricingType', v as any)}
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
                  <Label>Lease Rate (₦) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-lg"
                    placeholder="0.00"
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
                    onValueChange={(v) => setValue('leaseRatePeriod', v as any)}
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
                    value={watch('depositRequired') || 'NOT_REQUIRED'}
                    onValueChange={(v) => setValue('depositRequired', v as any)}
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

        {/* ══════════════════════════════════════ */}
        {/* SECTION 4: Location & Delivery          */}
        {/* ══════════════════════════════════════ */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Location & Delivery</CardTitle>
                <CardDescription>Where can this tool be picked up?</CardDescription>
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
                  onValueChange={(v) => setValue('pickupLocationState', v)}
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
                <Label className="font-medium">Delivery Available</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Can you deliver this tool to the buyer/renter?
                </p>
              </div>
              <Switch
                checked={watch('deliveryAvailable') || false}
                onCheckedChange={(v) => setValue('deliveryAvailable', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════ */}
        {/* SECTION 5: Images                       */}
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