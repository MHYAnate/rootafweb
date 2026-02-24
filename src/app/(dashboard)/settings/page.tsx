'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '@/hooks/use-auth';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }, { onSuccess: () => reset() });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />

      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" />Current Password</Label>
              <Input type="password" className="h-11 rounded-lg" {...register('currentPassword')} />
              {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" />New Password</Label>
              <Input type="password" className="h-11 rounded-lg" {...register('newPassword')} />
              {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" className="h-11 rounded-lg" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}