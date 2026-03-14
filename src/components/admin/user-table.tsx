'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatPhoneNumber } from '@/lib/format';
import { PROVIDER_TYPE_MAP } from '@/lib/constants';
import {
  Search,
  Eye,
  Star,
  Shield,
  Ban,
  RotateCcw,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: any[];
  title?: string;
  showActions?: boolean;
  onSuspend?: (userId: string, reason: string) => void;
  onReactivate?: (userId: string) => void;
  onFeature?: (memberId: string) => void;
  onResetPassword?: (userId: string) => void;
}

export function UserTable({
  users,
  title = 'Users',
  showActions = true,
  onSuspend,
  onReactivate,
  onFeature,
  onResetPassword,
}: UserTableProps) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneNumber?.includes(search) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-heading">{title}</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-3">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-3">Joined</th>
                {showActions && (
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-50 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {user.fullName?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{formatPhoneNumber(user.phoneNumber)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div>
                      <span className="text-sm font-medium">{user.userType}</span>
                      {user.memberProfile?.providerType && (
                        <span className="block text-xs text-muted-foreground">
                          {PROVIDER_TYPE_MAP[user.memberProfile.providerType] as any}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={user.verificationStatus} />
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
                  </td>
                  {showActions && (
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user.id}`} className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            {user.userType === 'MEMBER' && onFeature && (
                              <DropdownMenuItem onClick={() => onFeature(user.memberProfile?.id)} className="cursor-pointer">
                                <Star className="h-4 w-4 mr-2" /> Toggle Featured
                              </DropdownMenuItem>
                            )}
                            {onResetPassword && (
                              <DropdownMenuItem onClick={() => onResetPassword(user.id)} className="cursor-pointer">
                                <Shield className="h-4 w-4 mr-2" /> Reset Password
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.verificationStatus === 'SUSPENDED' ? (
                              onReactivate && (
                                <DropdownMenuItem
                                  onClick={() => onReactivate(user.id)}
                                  className="cursor-pointer text-emerald-600"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" /> Reactivate
                                </DropdownMenuItem>
                              )
                            ) : (
                              onSuspend && (
                                <DropdownMenuItem
                                  onClick={() => onSuspend(user.id, 'Admin action')}
                                  className="cursor-pointer text-destructive"
                                >
                                  <Ban className="h-4 w-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}