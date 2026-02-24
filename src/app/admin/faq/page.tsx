'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

const faqSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
  category: z.string().optional(),
  targetAudience: z.string().optional(),
  displayOrder: z.number().int(),
  isVisible: z.boolean(),
  isFeatured: z.boolean(),
});

type FaqForm = z.infer<typeof faqSchema>;

export default function FAQsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: adminApi.getFaqs,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createFaq(data),
    onSuccess: () => {
      toast.success('FAQ created');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      setOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateFaq(id, data),
    onSuccess: () => {
      toast.success('FAQ updated');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      setOpen(false);
      setEditingFaq(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteFaq(id),
    onSuccess: () => {
      toast.success('FAQ deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      setDeleteId(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed'),
  });

  const faqs = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingFaq(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingFaq ? 'Edit' : 'Create'} FAQ</DialogTitle>
                <DialogDescription>
                  Add or update a frequently asked question.
                </DialogDescription>
              </DialogHeader>
              <FaqForm
                defaultValues={editingFaq}
                onSubmit={(data) => {
                  if (editingFaq) {
                    updateMutation.mutate({ id: editingFaq.id, data });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
                isPending={createMutation.isPending || updateMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : (
        <div className="space-y-4">
          {faqs.map((faq: any) => (
            <Card key={faq.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{faq.question}</h3>
                      {faq.isFeatured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {faq.category && <span>Category: {faq.category}</span>}
                      {faq.targetAudience && <span>• Audience: {faq.targetAudience}</span>}
                      <span>• Order: {faq.displayOrder}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingFaq(faq);
                        setOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title="Delete FAQ"
                      description={`Are you sure you want to delete "${faq.question}"?`}
                      onConfirm={() => deleteMutation.mutate(faq.id)}
                      destructive
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqForm({
  defaultValues,
  onSubmit,
  isPending,
}: {
  defaultValues?: any;
  onSubmit: (data: FaqForm) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: defaultValues || {
      displayOrder: 0,
      isVisible: true,
      isFeatured: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Input id="question" {...register('question')} />
        {errors.question && <p className="text-sm text-destructive">{errors.question.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer *</Label>
        <Textarea id="answer" rows={4} {...register('answer')} />
        {errors.answer && <p className="text-sm text-destructive">{errors.answer.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Input id="category" {...register('category')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience (optional)</Label>
        <Select onValueChange={(v) => setValue('targetAudience', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="members">Members only</SelectItem>
            <SelectItem value="clients">Clients only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            type="number"
            id="displayOrder"
            {...register('displayOrder', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" {...register('isVisible')} value="true" defaultChecked /> Visible
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" {...register('isVisible')} value="false" /> Hidden
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('isFeatured')} id="isFeatured" />
        <Label htmlFor="isFeatured">Feature this FAQ</Label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
}