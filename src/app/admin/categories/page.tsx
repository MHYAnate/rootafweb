'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/use-categories';
import { useAdminCreateCategory, useAdminUpdateCategory, useAdminToggleCategory } from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, FolderTree, Loader2 } from 'lucide-react';

const CATEGORY_TYPES = [
  { value: 'FARMER_SPECIALIZATION', label: 'Farmer Specializations' },
  { value: 'ARTISAN_SPECIALIZATION', label: 'Artisan Specializations' },
  { value: 'PRODUCT_AGRICULTURAL', label: 'Agricultural Products' },
  { value: 'PRODUCT_ARTISAN', label: 'Artisan Products' },
  { value: 'SERVICE_FARMING', label: 'Farming Services' },
  { value: 'SERVICE_ARTISAN', label: 'Artisan Services' },
  { value: 'TOOL_FARMING', label: 'Farming Tools' },
  { value: 'TOOL_ARTISAN', label: 'Artisan Tools' },
];

export default function AdminCategoriesPage() {
  const [selectedType, setSelectedType] = useState(CATEGORY_TYPES[0].value);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', categoryCode: '', categoryType: '' });

  const { data, isLoading } = useCategories(selectedType);
  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const toggleCategory = useAdminToggleCategory();

  const handleCreate = () => {
    createCategory.mutate(
      { ...formData, categoryType: selectedType },
      {
        onSuccess: () => {
          setShowCreateDialog(false);
          setFormData({ name: '', description: '', categoryCode: '', categoryType: '' });
        },
      },
    );
  };

  const handleUpdate = () => {
    if (!editingCategory) return;
    updateCategory.mutate(
      { id: editingCategory.id, data: formData },
      {
        onSuccess: () => {
          setEditingCategory(null);
          setFormData({ name: '', description: '', categoryCode: '', categoryType: '' });
        },
      },
    );
  };

  const openEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      categoryCode: category.categoryCode,
      categoryType: category.categoryType,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        description="Manage product, service, and tool categories"
        badge="Content"
        action={
          <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        }
      />

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TYPES.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Categories List */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {(data?.data || []).map((category: any) => (
                <div key={category.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FolderTree className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{category.name}</p>
                        <Badge variant="outline" className="text-[10px]">{category.categoryCode}</Badge>
                      </div>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Used: {category.usageCount || 0} times</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={() => toggleCategory.mutate(category.id)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => openEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <div className="py-12 text-center text-muted-foreground">
                  No categories found for this type
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category Code *</Label>
              <Input
                value={formData.categoryCode}
                onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                placeholder="e.g., FRM-01"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !formData.categoryCode || createCategory.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleUpdate}
              disabled={!formData.name || updateCategory.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {updateCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}