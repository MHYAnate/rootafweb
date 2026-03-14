'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, ZoomIn, FileText, Check, X } from 'lucide-react';
import Image from 'next/image';

interface Document {
  id: string;
  documentType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  originalFileName?: string;
  verificationStatus: string;
  description?: string;
  uploadedAt: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

export function VerificationDocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (!documents || documents.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No verification documents uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Verification Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedDoc(doc)}
              >
                {/* Thumbnail */}
                <div className="aspect-video rounded-lg bg-muted overflow-hidden mb-3 relative">
                  {doc.thumbnailUrl || doc.fileUrl ? (
                    <img
                      src={doc.thumbnailUrl || doc.fileUrl}
                      alt={doc.documentType}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileText className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold capitalize">
                    {doc.documentType.replace(/_/g, ' ').toLowerCase()}
                  </p>
                  {doc.originalFileName && (
                    <p className="text-xs text-muted-foreground truncate">{doc.originalFileName}</p>
                  )}
                  <StatusBadge status={doc.verificationStatus} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full-size viewer dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedDoc?.documentType.replace(/_/g, ' ').toLowerCase()}
            </DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden">
                <img
                  src={selectedDoc.fileUrl}
                  alt={selectedDoc.documentType}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedDoc.verificationStatus} />
                <a
                  href={selectedDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Open Full Size
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}