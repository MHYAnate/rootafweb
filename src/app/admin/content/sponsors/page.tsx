'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sponsorsApi } from '@/lib/api/sponsors.api';
import {
  useAdminCreateSponsor,
  useAdminUpdateSponsor,
  useAdminDeleteSponsor,
} from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ImageUpload } from '@/components/shared/image-upload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { SPONSOR_CATEGORY_MAP, SPONSOR_TYPE_MAP } from '@/lib/constants';
import { Plus, Edit, Trash2, Loader2, Heart, Globe } from 'lucide-react';

interface SponsorFormData {
  organizationName: string;
  type: string;
  category: string;
  description: string;
  shortDescription: string;
  logoUrl: string;
  website: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  sponsorshipLevel: string;
  areasOfSupport: string[];
  isActive: boolean;
  isFeatured: boolean;
  showOnAboutPage: boolean;
  displayOrder: number;
}

const defaultForm: SponsorFormData = {
  organizationName: '', type: 'SPONSOR', category: 'CORPORATE_PRIVATE_SECTOR',
  description: '', shortDescription: '', logoUrl: '', website: '',
  contactPersonName: '', contactEmail: '', contactPhone: '',
  sponsorshipLevel: '', areasOfSupport: [],
  isActive: true, isFeatured: false, showOnAboutPage: true, displayOrder: 0,
};

export default function AdminSponsorsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-sponsors'],
    queryFn: () => sponsorsApi.getAll(),
  });
  const createSponsor = useAdminCreateSponsor();
  const updateSponsor = useAdminUpdateSponsor();
  const deleteSponsor = useAdminDeleteSponsor();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SponsorFormData>(defaultForm);
  const [areasInput, setAreasInput] = useState('');

  const sponsors = data?.data || [];

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setAreasInput('');
    setShowForm(true);
  };

  const openEdit = (sponsor: any) => {
    setEditingId(sponsor.id);
    setForm({
      organizationName: sponsor.organizationName || '',
      type: sponsor.type || 'SPONSOR',
      category: sponsor.category || 'CORPORATE_PRIVATE_SECTOR',
      description: sponsor.description || '',
      shortDescription: sponsor.shortDescription || '',
      logoUrl: sponsor.logoUrl || '',
      website: sponsor.website || '',
      contactPersonName: sponsor.contactPersonName || '',
      contactEmail: sponsor.contactEmail || '',
      contactPhone: sponsor.contactPhone || '',
      sponsorshipLevel: sponsor.sponsorshipLevel || '',
      areasOfSupport: sponsor.areasOfSupport || [],
      isActive: sponsor.isActive ?? true,
      isFeatured: sponsor.isFeatured || false,
      showOnAboutPage: sponsor.showOnAboutPage ?? true,
      displayOrder: sponsor.displayOrder || 0,
    });
    setAreasInput((sponsor.areasOfSupport || []).join(', '));
    setShowForm(true);
  };

  const handleSubmit = () => {
    const submitData = {
      ...form,
      areasOfSupport: areasInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateSponsor.mutate(
        { id: editingId, data: submitData },
        { onSuccess: () => { setShowForm(false); refetch(); } },
      );
    } else {
      createSponsor.mutate(submitData, {
        onSuccess: () => { setShowForm(false); refetch(); },
      });
    }
  };

  const updateForm = (updates: Partial<SponsorFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  // Build typed arrays from maps to avoid SelectItem children type issues
  const sponsorTypeEntries = (Object.entries(SPONSOR_TYPE_MAP) as [string, string][]);
  const sponsorCategoryEntries = (Object.entries(SPONSOR_CATEGORY_MAP) as [string, string][]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sponsors & Partners"
        description="Manage foundation sponsors and partners"
        badge="Content Management"
        action={
          <Button onClick={openCreate} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Sponsor
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : sponsors.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No sponsors yet"
          action={
            <Button onClick={openCreate} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Sponsor
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor: any) => (
            <Card key={sponsor.id} className="rounded-2xl border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {sponsor.logoUrl ? (
                      <img src={sponsor.logoUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-amber-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{sponsor.organizationName}</h3>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="gold" className="text-[10px]">
                          {SPONSOR_TYPE_MAP[sponsor.type] || sponsor.type}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {SPONSOR_CATEGORY_MAP[sponsor.category] || sponsor.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => openEdit(sponsor)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      }
                      title="Delete Sponsor"
                      description={`Delete ${sponsor.organizationName}?`}
                      onConfirm={() => deleteSponsor.mutate(sponsor.id, { onSuccess: () => refetch() })}
                      confirmText="Delete"
                      destructive
                    />
                  </div>
                </div>
                {sponsor.shortDescription && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{sponsor.shortDescription}</p>
                )}
                {sponsor.website && (
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-2">
                    <Globe className="h-3 w-3" />Visit website
                  </a>
                )}
                <div className="flex items-center gap-2 mt-3">
                  {!sponsor.isActive && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                  {sponsor.isFeatured && <Badge variant="gold" className="text-[10px]">Featured</Badge>}
                  {sponsor.sponsorshipLevel && <Badge variant="outline" className="text-[10px]">{sponsor.sponsorshipLevel}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingId ? 'Edit' : 'Add'} Sponsor/Partner
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(r: any) => updateForm({ logoUrl: r?.imageUrl || '' })}
              folder="sponsors"
              currentImage={form.logoUrl}
              label="Logo"
              aspectRatio="square"
              useAdminEndpoint
            />

            <div className="space-y-2">
              <Label>Organization Name *</Label>
              <Input
                value={form.organizationName}
                onChange={(e) => updateForm({ organizationName: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={(v) => updateForm({ type: v })}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sponsorTypeEntries.map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => updateForm({ category: v })}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sponsorCategoryEntries.map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) => updateForm({ website: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <Label>Sponsorship Level</Label>
                <Select
                  value={form.sponsorshipLevel}
                  onValueChange={(v) => updateForm({ sponsorshipLevel: v })}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input
                  value={form.contactPersonName}
                  onChange={(e) => updateForm({ contactPersonName: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateForm({ contactEmail: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => updateForm({ contactPhone: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Areas of Support (comma-separated)</Label>
              <Input
                value={areasInput}
                onChange={(e) => setAreasInput(e.target.value)}
                className="rounded-xl h-11"
                placeholder="Financial, Training, Equipment"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.isActive} onCheckedChange={(v) => updateForm({ isActive: v })} />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => updateForm({ isFeatured: v })} />
                Featured
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
              onClick={handleSubmit}
              disabled={!form.organizationName || createSponsor.isPending || updateSponsor.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {(createSponsor.isPending || updateSponsor.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingId ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}