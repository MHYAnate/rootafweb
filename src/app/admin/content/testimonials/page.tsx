'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '@/lib/api/testimonials.api';
import { useAdminCreateTestimonial, useAdminApproveTestimonial } from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { ImageUpload } from '@/components/shared/image-upload';
import { RatingStars } from '@/components/shared/rating-stars';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TESTIMONIAL_CATEGORY_MAP } from '@/lib/constants';
import { Plus, Loader2, MessageSquare, CheckCircle, Quote } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => testimonialsApi.getAll(),
  });
  const createTestimonial = useAdminCreateTestimonial();
  const approveTestimonial = useAdminApproveTestimonial();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    personName: '',
    titleRole: '',
    organization: '',
    location: '',
    testimonialText: '',
    shortQuote: '',
    category: 'MEMBER_SUCCESS_STORY',
    rating: 5,
    photoUrl: '',
    videoUrl: '',
    isFeatured: false,
    showOnHomePage: false,
    showOnAboutPage: true,
  });

  const testimonials = data?.data || [];

  // Build typed entries to avoid SelectItem children type issue
  const categoryEntries = (Object.entries(TESTIMONIAL_CATEGORY_MAP) as [string, string][]);

  const handleCreate = () => {
    createTestimonial.mutate(
      { ...form, isApproved: true },
      { onSuccess: () => { setShowForm(false); refetch(); } },
    );
  };

  const handleApprove = (id: string) => {
    approveTestimonial.mutate(id, { onSuccess: () => refetch() });
  };

  const updateForm = (updates: any) => setForm((prev) => ({ ...prev, ...updates }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage testimonials and success stories"
        badge="Content Management"
        action={
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : testimonials.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No testimonials yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t: any) => (
            <Card key={t.id} className="rounded-2xl border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <PremiumAvatar name={t.personName} src={t.photoUrl} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{t.personName}</h3>
                        <p className="text-xs text-muted-foreground">{t.titleRole}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!t.isApproved && (
                          <Button
                            size="sm"
                            className="rounded-xl text-xs"
                            onClick={() => handleApprove(t.id)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                        )}
                        <Badge variant={t.isApproved ? 'success' : 'warning'} className="text-[10px]">
                          {t.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {TESTIMONIAL_CATEGORY_MAP[t.category] || t.category}
                    </Badge>
                    {t.rating && (
                      <div className="mt-2">
                        <RatingStars rating={t.rating} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 relative pl-4 border-l-2 border-primary/20">
                  <Quote className="absolute -left-2.5 -top-1 h-5 w-5 text-primary/30 bg-card" />
                  <p className="text-sm text-muted-foreground italic line-clamp-4">
                    {t.testimonialText}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {t.isFeatured && <Badge variant="gold" className="text-[10px]">Featured</Badge>}
                  {t.showOnHomePage && <Badge variant="outline" className="text-[10px]">Homepage</Badge>}
                  {t.showOnAboutPage && <Badge variant="outline" className="text-[10px]">About</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Add Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(r: any) => updateForm({ photoUrl: r?.imageUrl || '' })}
              folder="testimonials"
              currentImage={form.photoUrl}
              label="Photo"
              aspectRatio="square"
              useAdminEndpoint
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Person Name *</Label>
                <Input
                  value={form.personName}
                  onChange={(e) => updateForm({ personName: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Title/Role *</Label>
                <Input
                  value={form.titleRole}
                  onChange={(e) => updateForm({ titleRole: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="e.g., Tomato Farmer, Igabi LGA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input
                  value={form.organization}
                  onChange={(e) => updateForm({ organization: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => updateForm({ location: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="e.g., Kaduna"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => updateForm({ category: v })}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categoryEntries.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Testimonial Text * (max 1000 chars)</Label>
              <Textarea
                value={form.testimonialText}
                onChange={(e) => updateForm({ testimonialText: e.target.value })}
                className="rounded-xl"
                rows={4}
                maxLength={1000}
              />
            </div>

            <div className="space-y-2">
              <Label>Short Quote (max 200 chars)</Label>
              <Input
                value={form.shortQuote}
                onChange={(e) => updateForm({ shortQuote: e.target.value })}
                className="rounded-xl h-11"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <RatingStars
                rating={form.rating}
                interactive
                onRate={(r) => updateForm({ rating: r })}
                size="lg"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => updateForm({ isFeatured: v })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.showOnHomePage} onCheckedChange={(v) => updateForm({ showOnHomePage: v })} />
                Homepage
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.showOnAboutPage} onCheckedChange={(v) => updateForm({ showOnAboutPage: v })} />
                About Page
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.personName || !form.testimonialText || createTestimonial.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {createTestimonial.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}