'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate } from '@/lib/format';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { usePagination } from '@/hooks/use-pagination';

const announcementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  shortContent: z.string().optional(),
  type: z.enum(['info', 'warning', 'success', 'error', 'promotion']),
  targetAudience: z.array(z.string()).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isPinned: z.boolean().optional(),
  actionUrl: z.string().url().optional().or(z.literal('')),
  actionLabel: z.string().optional(),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const { page, setPage } = usePagination();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-announcements', page],
    queryFn: () => adminApi.getAnnouncements({ page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createAnnouncement(data),
    onSuccess: () => {
      toast.success('Announcement created');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      setOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateAnnouncement(id, data),
    onSuccess: () => {
      toast.success('Announcement updated');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      setOpen(false);
      setEditingAnnouncement(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteAnnouncement(id),
    onSuccess: () => {
      toast.success('Announcement deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      setDeleteId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Create and manage system announcements"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAnnouncement(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingAnnouncement ? 'Edit' : 'Create'} Announcement</DialogTitle>
                <DialogDescription>
                  Fill in the details below. Announcements will be shown to users based on targeting.
                </DialogDescription>
              </DialogHeader>
              <AnnouncementForm
                defaultValues={editingAnnouncement}
                onSubmit={(data) => {
                  if (editingAnnouncement) {
                    updateMutation.mutate({ id: editingAnnouncement.id, data });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
                isPending={createMutation.isPending || updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <>
          <div className="space-y-4">
            {data?.data?.map((ann: any) => (
              <Card key={ann.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{ann.title}</h3>
                        {ann.isPinned && <Badge variant="outline">Pinned</Badge>}
                        <Badge variant={ann.type}>{ann.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ann.shortContent || ann.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Start: {formatDate(ann.startDate)}</span>
                        {ann.endDate && <span>End: {formatDate(ann.endDate)}</span>}
                        <span>•</span>
                        <span>Views: {ann.viewCount}</span>
                        <span>Clicks: {ann.clickCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingAnnouncement(ann);
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title="Delete Announcement"
                        description={`Are you sure you want to delete "${ann.title}"? This action cannot be undone.`}
                        onConfirm={() => deleteMutation.mutate(ann.id)}
                        destructive
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}

function AnnouncementForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: any;
  onSubmit: (data: AnnouncementForm) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: defaultValues || {
      type: 'info',
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select
          defaultValue={defaultValues?.type || 'info'}
          onValueChange={(v) => setValue('type', v as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="promotion">Promotion</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortContent">Short Content (optional)</Label>
        <Input id="shortContent" {...register('shortContent')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Full Content *</Label>
        <Textarea id="content" rows={4} {...register('content')} />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input type="date" id="startDate" {...register('startDate')} />
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (optional)</Label>
          <Input type="date" id="endDate" {...register('endDate')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="actionLabel">Action Label (optional)</Label>
        <Input id="actionLabel" {...register('actionLabel')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="actionUrl">Action URL (optional)</Label>
        <Input id="actionUrl" {...register('actionUrl')} />
        {errors.actionUrl && <p className="text-sm text-destructive">{errors.actionUrl.message}</p>}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}