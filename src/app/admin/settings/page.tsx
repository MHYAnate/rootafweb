'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.getSettings });
  const qc = useQueryClient();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.data) {
      const map: Record<string, string> = {};
      data.data.forEach((s: any) => { map[s.settingKey] = s.settingValue; });
      setSettings(map);
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => adminApi.updateSetting(key, value),
    onSuccess: () => { toast.success('Setting updated'); qc.invalidateQueries({ queryKey: ['admin-settings'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" />
      <Card className="card-premium">
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data?.data?.map((setting: any) => (
            <div key={setting.id} className="flex items-end gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">{setting.displayName || setting.settingKey}</Label>
                <Input className="h-10 rounded-lg" value={settings[setting.settingKey] || ''} onChange={(e) => setSettings({ ...settings, [setting.settingKey]: e.target.value })} disabled={!setting.isEditable} />
              </div>
              {setting.isEditable && (
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => mutate({ key: setting.settingKey, value: settings[setting.settingKey] })} disabled={isPending}>
                  <Save className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}