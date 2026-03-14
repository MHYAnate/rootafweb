// 'use client';

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { adminApi } from '@/lib/api/admin.api';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Settings, Save, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// export default function AdminSettingsPage() {
//   const { data, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.getSettings });
//   const qc = useQueryClient();
//   const [settings, setSettings] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (data?.data) {
//       const map: Record<string, string> = {};
//       data.data.forEach((s: any) => { map[s.settingKey] = s.settingValue; });
//       setSettings(map);
//     }
//   }, [data]);

//   const { mutate, isPending } = useMutation({
//     mutationFn: ({ key, value }: { key: string; value: string }) => adminApi.updateSetting(key, value),
//     onSuccess: () => { toast.success('Setting updated'); qc.invalidateQueries({ queryKey: ['admin-settings'] }); },
//     onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
//   });

//   if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

//   return (
//     <div className="space-y-6">
//       <PageHeader title="System Settings" />
//       <Card className="card-premium">
//         <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />Settings</CardTitle></CardHeader>
//         <CardContent className="space-y-4">
//           {data?.data?.map((setting: any) => (
//             <div key={setting.id} className="flex items-end gap-4">
//               <div className="flex-1 space-y-1">
//                 <Label className="text-xs">{setting.displayName || setting.settingKey}</Label>
//                 <Input className="h-10 rounded-lg" value={settings[setting.settingKey] || ''} onChange={(e) => setSettings({ ...settings, [setting.settingKey]: e.target.value })} disabled={!setting.isEditable} />
//               </div>
//               {setting.isEditable && (
//                 <Button variant="outline" size="sm" className="rounded-lg" onClick={() => mutate({ key: setting.settingKey, value: settings[setting.settingKey] })} disabled={isPending}>
//                   <Save className="h-3.5 w-3.5" />
//                 </Button>
//               )}
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
'use client';

import { useAdminSettings, useUpdateSetting, useAdminChangePassword } from '@/hooks/use-admin';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Lock, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations';

export default function AdminSettingsPage() {
  const { data, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const changePassword = useAdminChangePassword();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleSaveSetting = (key: string) => {
    updateSetting.mutate(
      { key, value: editValue },
      { onSuccess: () => setEditingKey(null) },
    );
  };

  const handleChangePassword = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Manage platform configuration and your account"
        badge="Settings"
      />

      {/* Change Password */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password *</Label>
              <Input type="password" className="rounded-xl h-11" {...register('currentPassword')} />
              {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>New Password *</Label>
              <Input type="password" className="rounded-xl h-11" {...register('newPassword')} />
              {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password *</Label>
              <Input type="password" className="rounded-xl h-11" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner className="py-8" />
          ) : (
            <div className="divide-y divide-border/30">
              {(data?.data || []).map((setting: any) => (
                <div key={setting.id} className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{setting.displayName || setting.settingKey}</p>
                    {setting.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Group: <span className="font-medium">{setting.settingGroup}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {editingKey === setting.settingKey ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-48 rounded-xl h-9 text-sm"
                        />
                        <Button
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleSaveSetting(setting.settingKey)}
                          disabled={updateSetting.isPending}
                        >
                          {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setEditingKey(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                          {setting.settingValue}
                        </code>
                        {setting.isEditable && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                              setEditingKey(setting.settingKey);
                              setEditValue(setting.settingValue);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}