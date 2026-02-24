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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';

const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'FAIRLY_USED', label: 'Fairly Used' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
];

const PURPOSE_OPTIONS = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'LEASE', label: 'For Lease' },
  { value: 'BOTH', label: 'Sale & Lease' },
];

const PRICING_OPTIONS = [
  { value: 'FIXED', label: 'Fixed' },
  { value: 'NEGOTIABLE', label: 'Negotiable' },
  { value: 'BOTH', label: 'Both' },
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
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
        depositAmount: t.depositAmount
          ? Number(t.depositAmount)
          : undefined,
        pickupLocation: t.pickupLocation || '',
        pickupLocationState: t.pickupLocationState || '',
        deliveryAvailable: t.deliveryAvailable || false,
        tags: t.tags || [],
      });
      setImages(t.images || []);
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const listingPurpose = watch('listingPurpose');
  const depositRequired = watch('depositRequired');
  const showSale =
    listingPurpose === 'SALE' || listingPurpose === 'BOTH';
  const showLease =
    listingPurpose === 'LEASE' || listingPurpose === 'BOTH';

  const onSubmit = (formData: ToolFormData) => {
    const payload: any = { ...formData };
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

    updateTool(
      {
        id: id as string,
        data: {
          ...payload,
          images: images.map((img, idx) => ({
            ...img,
            isPrimary: idx === 0,
          })),
        },
      },
      { onSuccess: () => router.push('/my-tools') }
    );
  };

  return (
    <div className="space-y-6">
      <BackButton href="/my-tools" />
      <PageHeader title="Edit Tool" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Tool Details ── */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Tool Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tool Name *</Label>
              <Input className="h-11 rounded-lg" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                className="rounded-lg min-h-[120px]"
                {...register('description')}
              />
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
                {...register('shortDescription')}
              />
            </div>

            <CategorySelect
              type="TOOL"
              value={watch('categoryId') || ''}
              onChange={(v) => setValue('categoryId', v)}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select
                  value={watch('condition')}
                  onValueChange={(v) =>
                    setValue('condition', v as any)
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Listing Purpose *</Label>
                <Select
                  value={watch('listingPurpose')}
                  onValueChange={(v) =>
                    setValue('listingPurpose', v as any)
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  className="h-11 rounded-lg"
                  {...register('brandName')}
                />
              </div>
              <div className="space-y-2">
                <Label>Model Number</Label>
                <Input
                  className="h-11 rounded-lg"
                  {...register('modelNumber')}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity Available</Label>
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
          </CardContent>
        </Card>

        {/* ── Sale Pricing ── */}
        {showSale && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Sale Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('salePricingType') || 'FIXED'}
                    onValueChange={(v) =>
                      setValue('salePricingType', v as any)
                    }
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
                  <Label>Sale Price (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="h-11 rounded-lg"
                    {...register('salePrice', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Lease Pricing ── */}
        {showLease && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Lease Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={watch('leasePricingType') || 'FIXED'}
                    onValueChange={(v) =>
                      setValue('leasePricingType', v as any)
                    }
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
                  <Label>Lease Rate (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="h-11 rounded-lg"
                    {...register('leaseRate', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rate Period</Label>
                  <Select
                    value={watch('leaseRatePeriod') || 'DAILY'}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deposit Requirement</Label>
                  <Select
                    value={watch('depositRequired') || 'NOT_REQUIRED'}
                    onValueChange={(v) =>
                      setValue('depositRequired', v as any)
                    }
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
                    <Label>Deposit Amount (₦)</Label>
                    <Input
                      type="number"
                      min={0}
                      className="h-11 rounded-lg"
                      {...register('depositAmount', {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Location & Delivery ── */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Location & Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <Input
                  className="h-11 rounded-lg"
                  {...register('pickupLocation')}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  className="h-11 rounded-lg"
                  {...register('pickupLocationState')}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={watch('deliveryAvailable') || false}
                onCheckedChange={(v) =>
                  setValue('deliveryAvailable', v)
                }
              />
              <Label>Delivery Available</Label>
            </div>
          </CardContent>
        </Card>

        {/* ── Images ── */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiImageUpload
              images={images}
              onImagesChange={setImages}
              folder="tools"
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="btn-premium rounded-xl gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
}