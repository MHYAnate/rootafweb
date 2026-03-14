// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { aboutApi } from '@/lib/api/about.api';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { formatDate } from '@/lib/format';
// import { FileText, ExternalLink, Calendar, Building } from 'lucide-react';

// export default function AdminDocumentsPage() {
//   const { data, isLoading } = useQuery({
//     queryKey: ['foundation-documents'],
//     queryFn: aboutApi.getDocuments,
//   });

//   const documents = data?.data || [];

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Foundation Documents"
//         description="CAC certificates, constitution, and official documents"
//         badge="Content Management"
//       />

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-20" />
//       ) : documents.length === 0 ? (
//         <EmptyState
//           icon={FileText}
//           title="No documents uploaded"
//           description="Foundation documents will appear here"
//         />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {documents.map((doc: any) => (
//             <Card key={doc.id} className="rounded-2xl border-border/50 overflow-hidden">
//               <div className="h-1 bg-gradient-to-r from-royal-400 to-royal-600" />
//               <CardContent className="p-5">
//                 <div className="flex items-start gap-3 mb-3">
//                   <div className="h-10 w-10 rounded-xl bg-royal-50 flex items-center justify-center flex-shrink-0">
//                     <FileText className="h-5 w-5 text-royal-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold truncate">{doc.documentName}</h3>
//                     <Badge variant="outline" className="text-[10px] mt-0.5">
//                       {doc.documentType?.replace(/_/g, ' ')}
//                     </Badge>
//                   </div>
//                 </div>

//                 {doc.description && (
//                   <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{doc.description}</p>
//                 )}

//                 <div className="space-y-1.5 text-xs text-muted-foreground">
//                   {doc.issuingAuthority && (
//                     <p className="flex items-center gap-1.5">
//                       <Building className="h-3 w-3" />{doc.issuingAuthority}
//                     </p>
//                   )}
//                   {doc.issueDate && (
//                     <p className="flex items-center gap-1.5">
//                       <Calendar className="h-3 w-3" />Issued: {formatDate(doc.issueDate)}
//                     </p>
//                   )}
//                   {doc.documentNumber && (
//                     <p className="font-mono text-[10px]">#{doc.documentNumber}</p>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2 mt-3">
//                   {doc.photoUrl && (
//                     <a href={doc.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
//                       <ExternalLink className="h-3 w-3" />View Document
//                     </a>
//                   )}
//                   {doc.externalLink && (
//                     <a href={doc.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs text-royal-600 flex items-center gap-1 hover:underline">
//                       <ExternalLink className="h-3 w-3" />External Link
//                     </a>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { FileText, ExternalLink, Calendar, Building } from 'lucide-react';

export default function AdminDocumentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['foundation-documents'],
    queryFn: aboutApi.getDocuments,
  });

  // Handle both array and nested response shapes
  const documents: any[] = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Foundation Documents"
        description="CAC certificates, constitution, and official documents"
        badge="Content Management"
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents uploaded"
          description="Foundation documents will appear here"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <Card key={doc.id} className="rounded-2xl border-border/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{doc.documentName}</h3>
                    <Badge variant="outline" className="text-[10px] mt-0.5">
                      {(doc.documentType || '').replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                {doc.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {doc.description}
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {doc.issuingAuthority && (
                    <p className="flex items-center gap-1.5">
                      <Building className="h-3 w-3" />
                      {doc.issuingAuthority}
                    </p>
                  )}
                  {doc.issueDate && (
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Issued: {formatDate(doc.issueDate)}
                    </p>
                  )}
                  {doc.documentNumber && (
                    <p className="font-mono text-[10px]">#{doc.documentNumber}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {doc.photoUrl && (
                    <a
                      href={doc.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Document
                    </a>
                  )}
                  {doc.externalLink && (
                    <a
                      href={doc.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      External Link
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}