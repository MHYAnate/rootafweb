// src/app/admin/admins/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminCreateSchema, AdminCreateFormData } from '@/lib/validations';
import { formatDate } from '@/lib/format';
import { PlusCircle, Power, PowerOff } from 'lucide-react';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [adminToToggle, setAdminToToggle] = useState<{ id: string; isActive: boolean; fullName: string } | null>(null);

  // Fetch all admin users
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getAllAdmins,
  });

  // Create admin mutation
  const createMutation = useMutation({
    mutationFn: (data: AdminCreateFormData) => adminApi.createAdmin(data),
    onSuccess: () => {
      toast.success('Admin user created successfully');
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleAdminStatus(id),
    onSuccess: () => {
      toast.success('Admin status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setAdminToToggle(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const admins = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Admin Users"
        description="Manage system administrators and their permissions"
        action={
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                  Add a new administrator. They will receive login credentials.
                </DialogDescription>
              </DialogHeader>
              <AdminCreateForm
                onSubmit={(data) => createMutation.mutate(data)}
                isPending={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No admin users found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin: any) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.username}</TableCell>
                    <TableCell>{admin.fullName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{admin.role.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      {admin.phoneNumber && <div>{admin.phoneNumber}</div>}
                      {admin.email && <div className="text-xs text-muted-foreground">{admin.email}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.lastLoginAt ? formatDate(admin.lastLoginAt) : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setAdminToToggle({
                            id: admin.id,
                            isActive: admin.isActive,
                            fullName: admin.fullName,
                          })
                        }
                        title={admin.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {admin.isActive ? (
                          <PowerOff className="h-4 w-4 text-destructive" />
                        ) : (
                          <Power className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirm Toggle Dialog */}
      <AlertDialog open={!!adminToToggle} onOpenChange={() => setAdminToToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminToToggle?.isActive ? 'Deactivate Admin' : 'Activate Admin'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {adminToToggle?.isActive ? 'deactivate' : 'activate'}{' '}
              <strong>{adminToToggle?.fullName}</strong>?
              {adminToToggle?.isActive
                ? ' They will no longer be able to log in.'
                : ' They will regain access to the admin panel.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (adminToToggle) {
                  toggleMutation.mutate(adminToToggle.id);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Form component for creating admin (inline to keep page self-contained)
function AdminCreateForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: AdminCreateFormData) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminCreateFormData>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: {
      role: 'VERIFICATION_ADMIN',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input id="username" {...register('username')} />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password *</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input id="fullName" {...register('fullName')} />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" {...register('phoneNumber')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
          defaultValue="VERIFICATION_ADMIN"
          onValueChange={(value) => setValue('role', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="VERIFICATION_ADMIN">Verification Admin</SelectItem>
            <SelectItem value="CONTENT_ADMIN">Content Admin</SelectItem>
            <SelectItem value="REPORT_ADMIN">Report Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Admin'}
        </Button>
      </DialogFooter>
    </form>
  );
}