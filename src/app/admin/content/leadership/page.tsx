// 'use client';

// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { aboutApi } from '@/lib/api/about.api';
// import {
//   useAdminCreateLeadership,
//   useAdminUpdateLeadership,
//   useAdminDeleteLeadership,
// } from '@/hooks/use-admin';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { PremiumAvatar } from '@/components/shared/premium-avatar';
// import { ConfirmDialog } from '@/components/shared/confirm-dialog';
// import { ImageUpload } from '@/components/shared/image-upload';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { formatDate } from '@/lib/format';
// import { Plus, Edit, Trash2, Loader2, Users, Crown, Phone, Mail } from 'lucide-react';

// interface LeadershipFormData {
//   fullName: string;
//   position: string;
//   title: string;
//   phoneNumber: string;
//   email: string;
//   bio: string;
//   shortBio: string;
//   photoUrl: string;
//   isTrustee: boolean;
//   isFounder: boolean;
//   isChairman: boolean;
//   isSecretary: boolean;
//   isTreasurer: boolean;
//   showOnAboutPage: boolean;
//   displayOrder: number;
// }

// const defaultForm: LeadershipFormData = {
//   fullName: '',
//   position: '',
//   title: '',
//   phoneNumber: '',
//   email: '',
//   bio: '',
//   shortBio: '',
//   photoUrl: '',
//   isTrustee: false,
//   isFounder: false,
//   isChairman: false,
//   isSecretary: false,
//   isTreasurer: false,
//   showOnAboutPage: true,
//   displayOrder: 0,
// };

// export default function AdminLeadershipPage() {
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['about-leadership'],
//     queryFn: aboutApi.getLeadership,
//   });
//   const createLeadership = useAdminCreateLeadership();
//   const updateLeadership = useAdminUpdateLeadership();
//   const deleteLeadership = useAdminDeleteLeadership();

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState<LeadershipFormData>(defaultForm);

//   const leaders = data?.data || [];

//   const openCreate = () => {
//     setEditingId(null);
//     setForm(defaultForm);
//     setShowForm(true);
//   };

//   const openEdit = (leader: any) => {
//     setEditingId(leader.id);
//     setForm({
//       fullName: leader.fullName || '',
//       position: leader.position || '',
//       title: leader.title || '',
//       phoneNumber: leader.phoneNumber || '',
//       email: leader.email || '',
//       bio: leader.bio || '',
//       shortBio: leader.shortBio || '',
//       photoUrl: leader.photoUrl || '',
//       isTrustee: leader.isTrustee || false,
//       isFounder: leader.isFounder || false,
//       isChairman: leader.isChairman || false,
//       isSecretary: leader.isSecretary || false,
//       isTreasurer: leader.isTreasurer || false,
//       showOnAboutPage: leader.showOnAboutPage ?? true,
//       displayOrder: leader.displayOrder || 0,
//     });
//     setShowForm(true);
//   };

//   const handleSubmit = () => {
//     if (editingId) {
//       updateLeadership.mutate(
//         { id: editingId, data: form },
//         { onSuccess: () => { setShowForm(false); refetch(); } },
//       );
//     } else {
//       createLeadership.mutate(form, {
//         onSuccess: () => { setShowForm(false); refetch(); },
//       });
//     }
//   };

//   const handleDelete = (id: string) => {
//     deleteLeadership.mutate(id, { onSuccess: () => refetch() });
//   };

//   const updateForm = (updates: Partial<LeadershipFormData>) => {
//     setForm((prev) => ({ ...prev, ...updates }));
//   };

//   const getRoleBadges = (leader: any) => {
//     const badges: string[] = [];
//     if (leader.isFounder) badges.push('Founder');
//     if (leader.isChairman) badges.push('Chairman');
//     if (leader.isTrustee) badges.push('Trustee');
//     if (leader.isSecretary) badges.push('Secretary');
//     if (leader.isTreasurer) badges.push('Treasurer');
//     return badges;
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Leadership Profiles"
//         description="Manage foundation leadership and board of trustees"
//         badge="Content Management"
//         action={
//           <Button
//             onClick={openCreate}
//             className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add Profile
//           </Button>
//         }
//       />

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : leaders.length === 0 ? (
//         <EmptyState
//           icon={Users}
//           title="No leadership profiles"
//           description="Add your first leadership profile"
//           action={
//             <Button onClick={openCreate} className="rounded-xl">
//               <Plus className="mr-2 h-4 w-4" />
//               Add Profile
//             </Button>
//           }
//         />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {leaders.map((leader: any) => (
//             <Card
//               key={leader.id}
//               className="rounded-2xl border-border/50 overflow-hidden"
//             >
//               <div className="h-1 bg-gradient-to-r from-royal-400 to-royal-600" />
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <PremiumAvatar
//                     name={leader.fullName}
//                     imageUrl={leader.photoUrl}
//                     size="lg"
//                   />
//                   <div className="flex gap-1">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-lg"
//                       onClick={() => openEdit(leader)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <ConfirmDialog
//                       trigger={
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 rounded-lg text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       }
//                       title="Delete Leadership Profile"
//                       description={`Are you sure you want to delete ${leader.fullName}'s profile?`}
//                       onConfirm={() => handleDelete(leader.id)}
//                       confirmText="Delete"
//                       destructive
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-heading font-semibold text-lg">
//                     {leader.title && `${leader.title} `}
//                     {leader.fullName}
//                   </h3>
//                   <p className="text-sm text-gold-600 font-medium">
//                     {leader.position}
//                   </p>
//                 </div>

//                 {/* Role Badges */}
//                 <div className="flex flex-wrap gap-1.5 mt-3">
//                   {getRoleBadges(leader).map((badge) => (
//                     <Badge
//                       key={badge}
//                       variant="outline"
//                       className="text-[10px] border-royal-200 text-royal-700 bg-royal-50"
//                     >
//                       {badge}
//                     </Badge>
//                   ))}
//                   {!leader.showOnAboutPage && (
//                     <Badge variant="outline" className="text-[10px] text-muted-foreground">
//                       Hidden
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Contact */}
//                 <div className="mt-3 space-y-1 text-xs text-muted-foreground">
//                   {leader.phoneNumber && (
//                     <p className="flex items-center gap-1.5">
//                       <Phone className="h-3 w-3" />
//                       {leader.phoneNumber}
//                     </p>
//                   )}
//                   {leader.email && (
//                     <p className="flex items-center gap-1.5">
//                       <Mail className="h-3 w-3" />
//                       {leader.email}
//                     </p>
//                   )}
//                 </div>

//                 {leader.shortBio && (
//                   <p className="text-xs text-muted-foreground mt-3 line-clamp-3">
//                     {leader.shortBio}
//                   </p>
//                 )}

//                 <p className="text-[10px] text-muted-foreground mt-3">
//                   Order: {leader.displayOrder}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Create/Edit Dialog */}
//       <Dialog open={showForm} onOpenChange={setShowForm}>
//         <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="font-heading flex items-center gap-2">
//               <Crown className="h-5 w-5 text-gold-500" />
//               {editingId ? 'Edit' : 'Add'} Leadership Profile
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             {/* Photo */}
//             <ImageUpload
//               onUploadComplete={(result) =>
//                 updateForm({ photoUrl: result?.imageUrl || '' })
//               }
//               folder="leadership"
//               currentImage={form.photoUrl}
//               label="Profile Photo"
//               aspectRatio="square"
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Title (Mr., Mrs., Dr., etc.)</Label>
//                 <Input
//                   value={form.title}
//                   onChange={(e) => updateForm({ title: e.target.value })}
//                   placeholder="e.g., Dr."
//                   className="rounded-xl h-11"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Full Name *</Label>
//                 <Input
//                   value={form.fullName}
//                   onChange={(e) => updateForm({ fullName: e.target.value })}
//                   placeholder="Full name"
//                   className="rounded-xl h-11"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Position *</Label>
//               <Input
//                 value={form.position}
//                 onChange={(e) => updateForm({ position: e.target.value })}
//                 placeholder="e.g., Chairman, Board of Trustees"
//                 className="rounded-xl h-11"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Phone Number</Label>
//                 <Input
//                   value={form.phoneNumber}
//                   onChange={(e) => updateForm({ phoneNumber: e.target.value })}
//                   placeholder="08012345678"
//                   className="rounded-xl h-11"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => updateForm({ email: e.target.value })}
//                   placeholder="email@example.com"
//                   className="rounded-xl h-11"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Short Bio (max 300 chars)</Label>
//               <Textarea
//                 value={form.shortBio}
//                 onChange={(e) => updateForm({ shortBio: e.target.value })}
//                 placeholder="Brief description..."
//                 className="rounded-xl"
//                 rows={2}
//                 maxLength={300}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Full Bio</Label>
//               <Textarea
//                 value={form.bio}
//                 onChange={(e) => updateForm({ bio: e.target.value })}
//                 placeholder="Detailed biography..."
//                 className="rounded-xl"
//                 rows={4}
//               />
//             </div>

//             {/* Role Flags */}
//             <div>
//               <Label className="mb-3 block">Roles</Label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {[
//                   { key: 'isFounder', label: 'Founder' },
//                   { key: 'isChairman', label: 'Chairman' },
//                   { key: 'isTrustee', label: 'Trustee' },
//                   { key: 'isSecretary', label: 'Secretary' },
//                   { key: 'isTreasurer', label: 'Treasurer' },
//                 ].map((role) => (
//                   <label
//                     key={role.key}
//                     className="flex items-center gap-2 text-sm cursor-pointer"
//                   >
//                     <Switch
//                       checked={form[role.key as keyof LeadershipFormData] as boolean}
//                       onCheckedChange={(checked) =>
//                         updateForm({ [role.key]: checked })
//                       }
//                     />
//                     {role.label}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Display Order</Label>
//                 <Input
//                   type="number"
//                   value={form.displayOrder}
//                   onChange={(e) =>
//                     updateForm({ displayOrder: parseInt(e.target.value) || 0 })
//                   }
//                   className="rounded-xl h-11"
//                 />
//               </div>
//               <div className="flex items-center gap-3 pt-7">
//                 <Switch
//                   checked={form.showOnAboutPage}
//                   onCheckedChange={(checked) =>
//                     updateForm({ showOnAboutPage: checked })
//                   }
//                 />
//                 <Label>Show on About Page</Label>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowForm(false)}
//               className="rounded-xl"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={
//                 !form.fullName ||
//                 !form.position ||
//                 createLeadership.isPending ||
//                 updateLeadership.isPending
//               }
//               className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
//             >
//               {(createLeadership.isPending || updateLeadership.isPending) && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               {editingId ? 'Save Changes' : 'Create Profile'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import {
  useAdminCreateLeadership,
  useAdminUpdateLeadership,
  useAdminDeleteLeadership,
} from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, Users, Crown, Phone, Mail } from 'lucide-react';

interface LeadershipFormData {
  fullName: string;
  position: string;
  title: string;
  phoneNumber: string;
  email: string;
  bio: string;
  shortBio: string;
  photoUrl: string;
  isTrustee: boolean;
  isFounder: boolean;
  isChairman: boolean;
  isSecretary: boolean;
  isTreasurer: boolean;
  showOnAboutPage: boolean;
  displayOrder: number;
}

const defaultForm: LeadershipFormData = {
  fullName: '', position: '', title: '', phoneNumber: '', email: '',
  bio: '', shortBio: '', photoUrl: '',
  isTrustee: false, isFounder: false, isChairman: false,
  isSecretary: false, isTreasurer: false,
  showOnAboutPage: true, displayOrder: 0,
};

export default function AdminLeadershipPage() {
  // Fetch from /about endpoint which includes leadership array
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['about-admin-leadership'],
    queryFn: aboutApi.getAll,
  });

  const createLeadership = useAdminCreateLeadership();
  const updateLeadership = useAdminUpdateLeadership();
  const deleteLeadership = useAdminDeleteLeadership();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadershipFormData>(defaultForm);

  // Extract leadership from the about response
  const leaders: any[] = data?.data?.leadership || [];

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (leader: any) => {
    setEditingId(leader.id);
    setForm({
      fullName: leader.fullName || '',
      position: leader.position || '',
      title: leader.title || '',
      phoneNumber: leader.phoneNumber || '',
      email: leader.email || '',
      bio: leader.bio || '',
      shortBio: leader.shortBio || '',
      photoUrl: leader.photoUrl || '',
      isTrustee: leader.isTrustee || false,
      isFounder: leader.isFounder || false,
      isChairman: leader.isChairman || false,
      isSecretary: leader.isSecretary || false,
      isTreasurer: leader.isTreasurer || false,
      showOnAboutPage: leader.showOnAboutPage ?? true,
      displayOrder: leader.displayOrder || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateLeadership.mutate(
        { id: editingId, data: form },
        { onSuccess: () => { setShowForm(false); refetch(); } },
      );
    } else {
      createLeadership.mutate(form, {
        onSuccess: () => { setShowForm(false); refetch(); },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteLeadership.mutate(id, { onSuccess: () => refetch() });
  };

  const updateForm = (updates: Partial<LeadershipFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const getRoleBadges = (leader: any): string[] => {
    const badges: string[] = [];
    if (leader.isFounder) badges.push('Founder');
    if (leader.isChairman) badges.push('Chairman');
    if (leader.isTrustee) badges.push('Trustee');
    if (leader.isSecretary) badges.push('Secretary');
    if (leader.isTreasurer) badges.push('Treasurer');
    return badges;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leadership Profiles"
        description="Manage foundation leadership and board of trustees"
        badge="Content Management"
        action={
          <Button onClick={openCreate} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : leaders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leadership profiles"
          description="Add your first leadership profile"
          action={
            <Button onClick={openCreate} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />Add Profile
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader: any) => (
            <Card key={leader.id} className="rounded-2xl border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <PremiumAvatar
                    name={leader.fullName}
                    imageUrl={leader.photoUrl || leader.photoThumbnailUrl}
                    size="lg"
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(leader)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                      title="Delete Leadership Profile"
                      description={`Are you sure you want to delete ${leader.fullName}'s profile?`}
                      onConfirm={() => handleDelete(leader.id)}
                      confirmText="Delete"
                      destructive
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-lg">
                    {leader.title && `${leader.title} `}{leader.fullName}
                  </h3>
                  <p className="text-sm text-amber-600 font-medium">{leader.position}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {getRoleBadges(leader).map((badge) => (
                    <Badge key={badge} variant="royal" className="text-[10px]">
                      {badge}
                    </Badge>
                  ))}
                  {!leader.showOnAboutPage && (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">Hidden</Badge>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {leader.phoneNumber && (
                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{leader.phoneNumber}</p>
                  )}
                  {leader.email && (
                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{leader.email}</p>
                  )}
                </div>

                {leader.shortBio && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{leader.shortBio}</p>
                )}

                <p className="text-[10px] text-muted-foreground mt-3">Order: {leader.displayOrder}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              {editingId ? 'Edit' : 'Add'} Leadership Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(result: any) =>
                updateForm({ photoUrl: result?.imageUrl || '' })
              }
              folder="leadership"
              currentImage={form.photoUrl}
              label="Profile Photo"
              aspectRatio="square"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (Mr., Mrs., Dr., etc.)</Label>
                <Input value={form.title} onChange={(e) => updateForm({ title: e.target.value })} placeholder="e.g., Dr." className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.fullName} onChange={(e) => updateForm({ fullName: e.target.value })} placeholder="Full name" className="rounded-xl h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Position *</Label>
              <Input value={form.position} onChange={(e) => updateForm({ position: e.target.value })} placeholder="e.g., Chairman, Board of Trustees" className="rounded-xl h-11" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={form.phoneNumber} onChange={(e) => updateForm({ phoneNumber: e.target.value })} placeholder="08012345678" className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} placeholder="email@example.com" className="rounded-xl h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Bio (max 300 chars)</Label>
              <Textarea value={form.shortBio} onChange={(e) => updateForm({ shortBio: e.target.value })} placeholder="Brief description..." className="rounded-xl" rows={2} maxLength={300} />
            </div>

            <div className="space-y-2">
              <Label>Full Bio</Label>
              <Textarea value={form.bio} onChange={(e) => updateForm({ bio: e.target.value })} placeholder="Detailed biography..." className="rounded-xl" rows={4} />
            </div>

            <div>
              <Label className="mb-3 block">Roles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  { key: 'isFounder' as const, label: 'Founder' },
                  { key: 'isChairman' as const, label: 'Chairman' },
                  { key: 'isTrustee' as const, label: 'Trustee' },
                  { key: 'isSecretary' as const, label: 'Secretary' },
                  { key: 'isTreasurer' as const, label: 'Treasurer' },
                ]).map((role) => (
                  <label key={role.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Switch
                      checked={form[role.key]}
                      onCheckedChange={(checked) => updateForm({ [role.key]: checked })}
                    />
                    {role.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.displayOrder} onChange={(e) => updateForm({ displayOrder: parseInt(e.target.value) || 0 })} className="rounded-xl h-11" />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch checked={form.showOnAboutPage} onCheckedChange={(checked) => updateForm({ showOnAboutPage: checked })} />
                <Label>Show on About Page</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.fullName || !form.position || createLeadership.isPending || updateLeadership.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {(createLeadership.isPending || updateLeadership.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingId ? 'Save Changes' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}