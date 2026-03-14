// 'use client';

// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { aboutApi } from '@/lib/api/about.api';
// import { useUpdateAboutContent } from '@/hooks/use-admin';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { FileText, Save, Loader2, Edit, X, Check } from 'lucide-react';

// const ABOUT_SECTIONS = [
//   { key: 'MISSION_STATEMENT', title: 'Mission Statement' },
//   { key: 'VISION_STATEMENT', title: 'Vision Statement' },
//   { key: 'OVERVIEW', title: 'Overview' },
//   { key: 'HISTORY', title: 'History' },
//   { key: 'CORE_VALUES', title: 'Core Values' },
//   { key: 'WHO_WE_ARE', title: 'Who We Are' },
//   { key: 'WHAT_WE_DO', title: 'What We Do' },
//   { key: 'OUR_IMPACT', title: 'Our Impact' },
// ];

// export default function AdminAboutContentPage() {
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['about-admin'],
//     queryFn: aboutApi.getAll,
//   });
//   const updateContent = useUpdateAboutContent();
//   const [editingKey, setEditingKey] = useState<string | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editContent, setEditContent] = useState('');

//   const contentMap: Record<string, any> = {};
//   if (data?.data) {
//     if (Array.isArray(data.data)) {
//       data.data.forEach((item: any) => {
//         contentMap[item.sectionKey] = item;
//       });
//     } else if (data.data.content) {
//       Object.entries(data.data.content).forEach(([key, value]: [string, any]) => {
//         contentMap[key.toUpperCase()] = value;
//       });
//     }
//   }

//   const startEdit = (key: string) => {
//     const existing = contentMap[key];
//     setEditingKey(key);
//     setEditTitle(existing?.title || '');
//     setEditContent(existing?.content || '');
//   };

//   const handleSave = () => {
//     if (!editingKey) return;
//     updateContent.mutate(
//       { key: editingKey, data: { title: editTitle, content: editContent } },
//       {
//         onSuccess: () => {
//           setEditingKey(null);
//           refetch();
//         },
//       },
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="About Page Content"
//         description="Manage the foundation's about page sections"
//         badge="Content Management"
//       />

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : (
//         <div className="space-y-4">
//           {ABOUT_SECTIONS.map((section) => {
//             const existing = contentMap[section.key];
//             const isEditing = editingKey === section.key;

//             return (
//               <Card key={section.key} className="rounded-2xl border-border/50">
//                 <CardHeader className="flex flex-row items-center justify-between pb-3">
//                   <CardTitle className="text-base font-heading flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-primary" />
//                     {section.title}
//                   </CardTitle>
//                   {!isEditing && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="rounded-xl"
//                       onClick={() => startEdit(section.key)}
//                     >
//                       <Edit className="h-3.5 w-3.5 mr-1.5" />
//                       Edit
//                     </Button>
//                   )}
//                 </CardHeader>
//                 <CardContent>
//                   {isEditing ? (
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label>Title</Label>
//                         <Input
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                           className="rounded-xl h-11"
//                           placeholder="Section title"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Content *</Label>
//                         <Textarea
//                           value={editContent}
//                           onChange={(e) => setEditContent(e.target.value)}
//                           className="rounded-xl min-h-[150px]"
//                           placeholder="Section content..."
//                         />
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           onClick={handleSave}
//                           disabled={!editContent || updateContent.isPending}
//                           className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
//                           size="sm"
//                         >
//                           {updateContent.isPending ? (
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           ) : (
//                             <Check className="mr-2 h-4 w-4" />
//                           )}
//                           Save
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="rounded-xl"
//                           onClick={() => setEditingKey(null)}
//                         >
//                           <X className="mr-2 h-4 w-4" />
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div>
//                       {existing?.title && (
//                         <p className="font-semibold text-sm mb-1">{existing.title}</p>
//                       )}
//                       <p className="text-sm text-muted-foreground whitespace-pre-line">
//                         {existing?.content || (
//                           <span className="italic">No content yet. Click Edit to add.</span>
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import { useUpdateAboutContent } from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Edit, X, Check } from 'lucide-react';

const ABOUT_SECTIONS = [
  { key: 'MISSION_STATEMENT', title: 'Mission Statement' },
  { key: 'VISION_STATEMENT', title: 'Vision Statement' },
  { key: 'OVERVIEW', title: 'Overview' },
  { key: 'HISTORY', title: 'History' },
  { key: 'CORE_VALUES', title: 'Core Values' },
  { key: 'WHO_WE_ARE', title: 'Who We Are' },
  { key: 'WHAT_WE_DO', title: 'What We Do' },
  { key: 'OUR_IMPACT', title: 'Our Impact' },
];

export default function AdminAboutContentPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['about-admin'],
    queryFn: aboutApi.getAll,
  });
  const updateContent = useUpdateAboutContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Build content map from the actual API response shape
  // data.data.content is an array of { sectionKey, title, content, ... }
  const contentArray: any[] = data?.data?.content || [];
  const contentMap: Record<string, any> = {};
  contentArray.forEach((item: any) => {
    contentMap[item.sectionKey] = item;
  });

  const startEdit = (key: string) => {
    const existing = contentMap[key];
    setEditingKey(key);
    setEditTitle(existing?.title || '');
    setEditContent(existing?.content || '');
  };

  const handleSave = () => {
    if (!editingKey) return;
    updateContent.mutate(
      { key: editingKey, data: { title: editTitle, content: editContent } },
      {
        onSuccess: () => {
          setEditingKey(null);
          refetch();
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Page Content"
        description="Manage the foundation's about page sections"
        badge="Content Management"
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="space-y-4">
          {ABOUT_SECTIONS.map((section) => {
            const existing = contentMap[section.key];
            const isEditing = editingKey === section.key;

            return (
              <Card key={section.key} className="rounded-2xl border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-heading flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {section.title}
                    {existing && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-normal">
                        Has Content
                      </span>
                    )}
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => startEdit(section.key)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      {existing ? 'Edit' : 'Add Content'}
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="rounded-xl h-11"
                          placeholder="Section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content *</Label>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="rounded-xl min-h-[150px]"
                          placeholder="Section content..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={!editContent || updateContent.isPending}
                          className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
                          size="sm"
                        >
                          {updateContent.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setEditingKey(null)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {existing?.title && (
                        <p className="font-semibold text-sm mb-1">{existing.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {existing?.content || (
                          <span className="italic">No content yet. Click Edit to add.</span>
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}