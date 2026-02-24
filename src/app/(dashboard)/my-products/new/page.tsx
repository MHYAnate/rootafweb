'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateProduct } from '@/hooks/use-products';
import { productSchema, ProductFormData } from '@/lib/validations';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [images, setImages] = useState<any[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { pricingType: 'FIXED', availability: 'AVAILABLE' },
  });

  const pricingType = watch('pricingType');

  const onSubmit = (data: ProductFormData) => {
    createProduct({ ...data, images: images.map((img, idx) => ({ ...img, isPrimary: idx === 0 })) }, {
      onSuccess: () => router.push('/my-products'),
    });
  };

  return (
    <div className="space-y-6">
      <BackButton href="/my-products" />
      <PageHeader title="Add New Product" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="card-premium">
          <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input className="h-11 rounded-lg" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea className="rounded-lg min-h-[120px]" {...register('description')} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <CategorySelect type="PRODUCT_AGRICULTURAL" value={watch('categoryId') || ''} onChange={(v) => setValue('categoryId', v)} />
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit of Measure *</Label>
                <Input placeholder="kg, bags, pieces..." className="h-11 rounded-lg" {...register('unitOfMeasure')} />
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={watch('availability')} onValueChange={(v) => setValue('availability', v as any)}>
                  <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    <SelectItem value="SEASONAL">Seasonal</SelectItem>
                    <SelectItem value="LIMITED_STOCK">Limited Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
          <CardContent>
            <PricingInput pricingType={pricingType} onPricingTypeChange={(v) => setValue('pricingType', v as any)}
              amount={watch('priceAmount')} onAmountChange={(v) => setValue('priceAmount', v)} />
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader><CardTitle>Images</CardTitle></CardHeader>
          <CardContent>
            <MultiImageUpload images={images} onImagesChange={setImages} folder="products" maxImages={5} />
          </CardContent>
        </Card>

        <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create Product
        </Button>
      </form>
    </div>
  );
}