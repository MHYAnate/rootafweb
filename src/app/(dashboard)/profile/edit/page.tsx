'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMyProfile, useUpdateProfile } from '@/hooks/use-members';
import { useCurrentUser } from '@/hooks/use-current-user';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ImageUpload } from '@/components/shared/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export default function EditProfilePage() {
  const { isMember } = useCurrentUser();
  const { data, isLoading } = useMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      reset({ bio: p.bio || '', tagline: p.tagline || '', yearsOfExperience: p.yearsOfExperience || '' });
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <BackButton href="/profile" />
      <PageHeader title="Edit Profile" />

      <form onSubmit={handleSubmit((formData) => updateProfile(formData))} className="space-y-6">
        {isMember && (
          <Card className="card-premium">
            <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload folder="profiles" currentImage={data?.data?.profilePhotoUrl}
                onUploadComplete={(result) => setValue('profilePhotoUrl', result.imageUrl)} />
            </CardContent>
          </Card>
        )}

        <Card className="card-premium">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input placeholder="Short description about you" className="h-11 rounded-lg" {...register('tagline')} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea placeholder="Tell people about yourself..." className="rounded-lg min-h-[120px]" {...register('bio')} />
            </div>
            {isMember && (
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" className="h-11 rounded-lg" {...register('yearsOfExperience', { valueAsNumber: true })} />
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}