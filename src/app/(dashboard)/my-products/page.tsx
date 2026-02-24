'use client';

import { useMyProducts, useDeleteProduct } from '@/hooks/use-products';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PriceDisplay } from '@/components/shared/price-display';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MyProductsPage() {
  const { data, isLoading } = useMyProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  return (
    <div className="space-y-6">
      <PageHeader title="My Products" description="Manage your product listings" action={
        <Link href="/my-products/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Add Product</Button></Link>
      } />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" description="Start listing your products"
          action={<Link href="/my-products/new"><Button className="btn-premium rounded-xl gap-2"><Plus className="h-4 w-4" />Add Product</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {data?.data?.map((product: any) => (
            <Card key={product.id} className="card-premium">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-muted/30 overflow-hidden flex-shrink-0">
                  {product.images?.[0]?.thumbnailUrl ? (
                    <img src={product.images[0].thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><Package className="h-8 w-8 text-muted-foreground/20" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                  <PriceDisplay pricingType={product.pricingType} amount={product.priceAmount ? Number(product.priceAmount) : null}
                    displayText={product.priceDisplayText} className="text-sm font-bold text-primary mt-1" />
                </div>
                <Badge variant="outline" className="rounded-lg">{product.availability}</Badge>
                <div className="flex gap-2">
                  <Link href={`/my-products/${product.id}/edit`}><Button variant="outline" size="icon" className="rounded-lg"><Edit className="h-4 w-4" /></Button></Link>
                  <ConfirmDialog trigger={<Button variant="outline" size="icon" className="rounded-lg text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                    title="Delete Product" description="Are you sure? This cannot be undone." onConfirm={() => deleteProduct(product.id)} confirmText="Delete" destructive />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}