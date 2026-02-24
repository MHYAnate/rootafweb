'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products.api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { ArrowRight, Package, ShoppingBag } from 'lucide-react';

export function FeaturedProducts() {
  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getAll({ limit: 4 }),
  });

  const products = data?.data || [];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 mb-4">
              <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Fresh Listings
              </span>
            </div>
            <h2 className="section-title">Latest Products</h2>
            <p className="section-description">
              Fresh products from our members
            </p>
          </div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="outline" className="rounded-xl gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any, idx: number) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
            >
              <Card
                className="card-premium h-full overflow-hidden animate-fade-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center relative overflow-hidden">
                  {product.images?.[0]?.thumbnailUrl ? (
                    <img
                      src={product.images[0].thumbnailUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                      <Package className="h-12 w-12" />
                    </div>
                  )}

                  {/* Category Pill */}
                  {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-foreground border border-border/30">
                      {product.category.name}
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {product.member?.user?.fullName}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <PriceDisplay
                      pricingType={product.pricingType}
                      amount={
                        product.priceAmount
                          ? Number(product.priceAmount)
                          : null
                      }
                      displayText={product.priceDisplayText}
                      className="text-sm font-bold text-primary"
                      showBadge
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="rounded-xl gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}