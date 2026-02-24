'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Lock, User } from 'lucide-react';
import { adminLoginSchema, AdminLoginFormData } from '@/lib/validations';
import { adminApi } from '@/lib/api/admin.api';
import { useAdminAuthStore } from '@/store/admin-auth-store';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAdminAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: adminApi.login,
    onSuccess: (response) => {
      const { accessToken, admin } = response.data;
      setAuth(admin, accessToken);
      toast.success('Welcome to Admin Portal');
      if (admin.mustChangePassword) {
        toast.info('Please change your default password');
      }
      router.push('/admin/dashboard');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Login failed'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <Card className="w-full max-w-md card-premium border-0 shadow-xl relative z-10 animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div
            className="mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--gradient-premium)' }}
          >
            <Shield className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Admin Portal
          </CardTitle>
          <CardDescription className="mt-1">
            Sign in to manage the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit((data) => mutate(data))}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                Username
              </Label>
              <Input
                placeholder="admin"
                className="h-11 rounded-lg"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Password
              </Label>
              <Input
                type="password"
                className="h-11 rounded-lg"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-lg btn-premium"
              disabled={isPending}
            >
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}