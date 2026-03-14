// 'use client';

// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { adminApi } from '@/lib/api/admin.api';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { formatDate } from '@/lib/format';
// import { PlusCircle, Edit, Trash2 } from 'lucide-react';
// import { ConfirmDialog } from '@/components/shared/confirm-dialog';
// import { usePagination } from '@/hooks/use-pagination';

// const announcementSchema = z.object({
//   title: z.string().min(3, 'Title is required'),
//   content: z.string().min(10, 'Content is required'),
//   shortContent: z.string().optional(),
//   type: z.enum(['info', 'warning', 'success', 'error', 'promotion']),
//   targetAudience: z.array(z.string()).optional(),
//   startDate: z.string().min(1, 'Start date is required'),
//   endDate: z.string().optional(),
//   isPinned: z.boolean().optional(),
//   actionUrl: z.string().url().optional().or(z.literal('')),
//   actionLabel: z.string().optional(),
// });

// type AnnouncementForm = z.infer<typeof announcementSchema>;

// export default function AnnouncementsPage() {
//   const { page, setPage } = usePagination();
//   const queryClient = useQueryClient();
//   const [open, setOpen] = useState(false);
//   const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-announcements', page],
//     queryFn: () => adminApi.getAnnouncements({ page, limit: 10 }),
//   });

//   const createMutation = useMutation({
//     mutationFn: (data: any) => adminApi.createAnnouncement(data),
//     onSuccess: () => {
//       toast.success('Announcement created');
//       queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
//       setOpen(false);
//     },
//     onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateAnnouncement(id, data),
//     onSuccess: () => {
//       toast.success('Announcement updated');
//       queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
//       setOpen(false);
//       setEditingAnnouncement(null);
//     },
//     onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => adminApi.deleteAnnouncement(id),
//     onSuccess: () => {
//       toast.success('Announcement deleted');
//       queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
//       setDeleteId(null);
//     },
//     onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
//   });

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Announcements"
//         description="Create and manage system announcements"
//         action={
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button onClick={() => setEditingAnnouncement(null)}>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 New Announcement
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px]">
//               <DialogHeader>
//                 <DialogTitle>{editingAnnouncement ? 'Edit' : 'Create'} Announcement</DialogTitle>
//                 <DialogDescription>
//                   Fill in the details below. Announcements will be shown to users based on targeting.
//                 </DialogDescription>
//               </DialogHeader>
//               <AnnouncementForm
//                 defaultValues={editingAnnouncement}
//                 onSubmit={(data) => {
//                   if (editingAnnouncement) {
//                     updateMutation.mutate({ id: editingAnnouncement.id, data });
//                   } else {
//                     createMutation.mutate(data);
//                   }
//                 }}
//                 isPending={createMutation.isPending || updateMutation.isPending}
//               />
//             </DialogContent>
//           </Dialog>
//         }
//       />

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : (
//         <>
//           <div className="space-y-4">
//             {data?.data?.map((ann: any) => (
//               <Card key={ann.id}>
//                 <CardContent className="p-4">
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-semibold">{ann.title}</h3>
//                         {ann.isPinned && <Badge variant="outline">Pinned</Badge>}
//                         <Badge variant={ann.type}>{ann.type}</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground line-clamp-2">
//                         {ann.shortContent || ann.content}
//                       </p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <span>Start: {formatDate(ann.startDate)}</span>
//                         {ann.endDate && <span>End: {formatDate(ann.endDate)}</span>}
//                         <span>•</span>
//                         <span>Views: {ann.viewCount}</span>
//                         <span>Clicks: {ann.clickCount}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => {
//                           setEditingAnnouncement(ann);
//                           setOpen(true);
//                         }}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <ConfirmDialog
//                         trigger={
//                           <Button variant="ghost" size="icon">
//                             <Trash2 className="h-4 w-4 text-destructive" />
//                           </Button>
//                         }
//                         title="Delete Announcement"
//                         description={`Are you sure you want to delete "${ann.title}"? This action cannot be undone.`}
//                         onConfirm={() => deleteMutation.mutate(ann.id)}
//                         destructive
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
//         </>
//       )}
//     </div>
//   );
// }

// function AnnouncementForm({
//   defaultValues,
//   onSubmit,
//   isPending,
// }: {
//   defaultValues?: any;
//   onSubmit: (data: AnnouncementForm) => void;
//   isPending: boolean;
// }) {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<AnnouncementForm>({
//     resolver: zodResolver(announcementSchema),
//     defaultValues: defaultValues || {
//       type: 'info',
//       startDate: new Date().toISOString().split('T')[0],
//     },
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="title">Title *</Label>
//         <Input id="title" {...register('title')} />
//         {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="type">Type *</Label>
//         <Select
//           defaultValue={defaultValues?.type || 'info'}
//           onValueChange={(v) => setValue('type', v as any)}
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="info">Info</SelectItem>
//             <SelectItem value="warning">Warning</SelectItem>
//             <SelectItem value="success">Success</SelectItem>
//             <SelectItem value="error">Error</SelectItem>
//             <SelectItem value="promotion">Promotion</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="shortContent">Short Content (optional)</Label>
//         <Input id="shortContent" {...register('shortContent')} />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="content">Full Content *</Label>
//         <Textarea id="content" rows={4} {...register('content')} />
//         {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="startDate">Start Date *</Label>
//           <Input type="date" id="startDate" {...register('startDate')} />
//           {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="endDate">End Date (optional)</Label>
//           <Input type="date" id="endDate" {...register('endDate')} />
//         </div>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="actionLabel">Action Label (optional)</Label>
//         <Input id="actionLabel" {...register('actionLabel')} />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="actionUrl">Action URL (optional)</Label>
//         <Input id="actionUrl" {...register('actionUrl')} />
//         {errors.actionUrl && <p className="text-sm text-destructive">{errors.actionUrl.message}</p>}
//       </div>
//       <DialogFooter>
//         <Button type="submit" disabled={isPending}>
//           {isPending ? 'Saving...' : 'Save'}
//         </Button>
//       </DialogFooter>
//     </form>
//   );
// }
'use client';

import { useState } from 'react';
import { useAdminAnnouncements, useAdminCreateAnnouncement, useAdminUpdateAnnouncement, useAdminDeleteAnnouncement } from '@/hooks/use-admin';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDate } from '@/lib/format';
import { Megaphone, Plus, Edit, Trash2, Loader2, Eye } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const { page, setPage } = usePagination();
  const { data, isLoading } = useAdminAnnouncements({ page, limit: 20 });
  const createAnnouncement = useAdminCreateAnnouncement();
  const updateAnnouncement = useAdminUpdateAnnouncement();
  const deleteAnnouncement = useAdminDeleteAnnouncement();

  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    shortContent: '',
    type: 'info',
    targetAudience: ['all'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    showOnHomePage: true,
    showOnDashboard: true,
    isDismissible: true,
    isPinned: false,
  });

  const handleCreate = () => {
    createAnnouncement.mutate(formData, {
      onSuccess: () => {
        setShowCreate(false);
        setFormData({ ...formData, title: '', content: '', shortContent: '' });
      },
    });
  };

  const typeColors: Record<string, string> = {
    info: 'bg-royal-50 text-royal-700 border-royal-200',
    warning: 'bg-gold-50 text-gold-700 border-gold-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    promotion: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Manage system announcements and banners"
        badge="Content"
        action={
          <Button onClick={() => setShowCreate(true)} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : !data?.data?.length ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Create your first announcement" />
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((ann: any) => (
              <Card key={ann.id} className="rounded-2xl border-border/50 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{ann.title}</h3>
                        <Badge className={`text-[10px] border ${typeColors[ann.type] || typeColors.info}`}>
                          {ann.type}
                        </Badge>
                        {ann.isPinned && <Badge variant="secondary" className="text-[10px]">Pinned</Badge>}
                        {!ann.isActive && <Badge variant="outline" className="text-[10px] text-destructive">Inactive</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Start: {formatDate(ann.startDate)}</span>
                        {ann.endDate && <span>End: {formatDate(ann.endDate)}</span>}
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ann.viewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon" className="rounded-xl text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete Announcement"
                        description="Are you sure? This action cannot be undone."
                        onConfirm={() => deleteAnnouncement.mutate(ann.id)}
                        confirmText="Delete"
                        destructive
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl h-11"
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="rounded-xl"
                rows={4}
                placeholder="Full announcement content"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={formData.isPinned} onCheckedChange={(v) => setFormData({ ...formData, isPinned: v })} />
                Pin to top
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={formData.showOnHomePage} onCheckedChange={(v) => setFormData({ ...formData, showOnHomePage: v })} />
                Show on homepage
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.title || !formData.content || createAnnouncement.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {createAnnouncement.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}