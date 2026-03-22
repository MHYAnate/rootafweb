'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import { Eye, FileText, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationCardProps {
  user: any;
  className?: string;
}

export function VerificationCard({ user, className }: VerificationCardProps) {
  const isResubmitted = user.verificationStatus === 'RESUBMITTED';
  const docCount = user.verificationDocuments?.length || 0;

  return (
    <Card className={cn('rounded-2xl border-border/50 overflow-hidden group hover:shadow-md transition-all', className)}>
      <div className={cn(
        'h-1',
        isResubmitted
          ? 'bg-gradient-to-r from-orange-400 to-orange-500'
          : 'bg-gradient-to-r from-gold-400 to-gold-500'
      )} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-heading font-bold text-primary">
                {user.fullName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{user.fullName}</p>
                {isResubmitted && (
                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <span>{formatPhoneNumber(user.phoneNumber)}</span>
                <span>•</span>
                <span className="font-medium text-foreground">{user.userType}</span>
                {user.memberProfile?.providerType && (
                  <>
                    <span>•</span>
                    <span className="text-primary text-xs font-medium">
                 {(PROVIDER_TYPE_MAP[user.memberProfile.providerType] as any)?.label ?? user.memberProfile.providerType}

                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(user.verificationSubmittedAt || user.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {docCount} doc{docCount !== 1 && 's'}
                </span>
                {user.resubmissionCount > 0 && (
                  <span className="text-orange-600 font-medium">
                    Resubmitted {user.resubmissionCount}x
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge status={user.verificationStatus} />
            <Link href={`/admin/verifications/${user.id}`}>
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 shadow-md shadow-primary/20">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Review
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}