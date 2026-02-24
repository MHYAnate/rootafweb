'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateService } from '@/hooks/use-services';
import { serviceSchema, ServiceFormData } from '@/lib/validations';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { CategorySelect } from '@/components/shared/category-select';
import { PricingInput } from '@/components/shared/pricing-input';
import { MultiImageUpload } from '@/components/shared/multi-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();
  const { mutate: createService, isPending } = useCreateService();
  const [images, setImages] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { pricingType: 'FIXED' },
  });

  const pricingType = watch('pricingType');

  const onSubmit = (data: ServiceFormData) => {
    createService(
      {
        ...data,
        images: images.map((img, idx) => ({
          ...img,
          isPrimary: idx === 0,
        })),
      },
      {
        onSuccess: () => router.push('/my-services'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <BackButton href="/my-services" />
      <PageHeader title="Add New Service" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Service Details ── */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service Name *</Label>
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

            <CategorySelect
              type="SERVICE"
              value={watch('categoryId') || ''}
              onChange={(v) => setValue('categoryId', v)}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}

            <div className="space-y-2">
              <Label>Price Basis</Label>
              <Input
                placeholder="e.g. per acre, per day, per session..."
                className="h-11 rounded-lg"
                {...register('priceBasis')}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Pricing ── */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <PricingInput
              pricingType={pricingType}
              onPricingTypeChange={(v) =>
                setValue('pricingType', v as any)
              }
              amount={watch('startingPrice')}
              onAmountChange={(v) => setValue('startingPrice', v)}
              
            />
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
              folder="services"
              maxImages={5}
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
          Create Service
        </Button>
      </form>
    </div>
  );
}