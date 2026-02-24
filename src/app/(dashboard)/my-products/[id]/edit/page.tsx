'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProduct, useUpdateProduct } from '@/hooks/use-products';
import { productSchema, ProductFormData } from '@/lib/validations';
import { BackButton } from '@/components/shared/back-button';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { CategorySelect } from '@/components/shared/category-select';
import { PricingInput } from '@/components/shared/pricing-input';
import { MultiImageUpload } from '@/components/shared/multi-image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useProduct(id as string);
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const [images, setImages] = useState<any[]>([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      reset({
        name: p.name, description: p.description, categoryId: p.categoryId, unitOfMeasure: p.unitOfMeasure,
        pricingType: p.pricingType, priceAmount: p.priceAmount ? Number(p.priceAmount) : undefined, availability: p.availability,
      });
      setImages(p.images || []);
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  const onSubmit = (formData: ProductFormData) => {
    updateProduct({ id: id as string, data: { ...formData, images } }, { onSuccess: () => router.push('/my-products') });
  };

  return (
    <div className="space-y-6">
      <BackButton href="/my-products" />
      <PageHeader title="Edit Product" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="card-premium"><CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Product Name *</Label><Input className="h-11 rounded-lg" {...register('name')} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
            <div className="space-y-2"><Label>Description *</Label><Textarea className="rounded-lg min-h-[120px]" {...register('description')} /></div>
            <CategorySelect type="PRODUCT_AGRICULTURAL" value={watch('categoryId') || ''} onChange={(v) => setValue('categoryId', v)} />
            <div className="space-y-2"><Label>Unit of Measure *</Label><Input className="h-11 rounded-lg" {...register('unitOfMeasure')} /></div>
          </CardContent>
        </Card>
        <Card className="card-premium"><CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
          <CardContent><PricingInput pricingType={watch('pricingType')} onPricingTypeChange={(v) => setValue('pricingType', v as any)} amount={watch('priceAmount')} onAmountChange={(v) => setValue('priceAmount', v)} /></CardContent>
        </Card>
        <Card className="card-premium"><CardHeader><CardTitle>Images</CardTitle></CardHeader>
          <CardContent><MultiImageUpload images={images} onImagesChange={setImages} folder="products" /></CardContent>
        </Card>
        <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes
        </Button>
      </form>
    </div>
  );
}