'use client';

import { useState } from 'react';
import {
  useAdminEvents,
  useAdminCreateEvent,
  useAdminPublishEvent,
  useAdminUnpublishEvent,
  useAdminDeleteEvent,
} from '@/hooks/use-events';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ImageUpload } from '@/components/shared/image-upload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { EVENT_TYPE_MAP, EVENT_STATUS_MAP } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import {
  Plus,
  Edit,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Globe,
  Eye,
  Send,
  EyeOff,
  FileText,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface EventFormData {
  title: string;
  eventType: string;
  description: string;
  shortDescription: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  cityLga: string;
  state: string;
  isVirtualEvent: boolean;
  virtualEventLink: string;
  featuredImageUrl: string;
  registrationLink: string;
  isFeatured: boolean;
  showOnHomePage: boolean;
  tags: string[];
}

const defaultForm: EventFormData = {
  title: '',
  eventType: 'TRAINING_WORKSHOP',
  description: '',
  shortDescription: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  venueName: '',
  venueAddress: '',
  cityLga: '',
  state: '',
  isVirtualEvent: false,
  virtualEventLink: '',
  featuredImageUrl: '',
  registrationLink: '',
  isFeatured: false,
  showOnHomePage: false,
  tags: [],
};

type FilterType = 'all' | 'drafts' | 'published';

export default function AdminEventsPage() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const queryParams: any = { page, limit: 12 };
  if (filter === 'drafts') queryParams.isPublished = 'false';
  else if (filter === 'published') queryParams.isPublished = 'true';
  if (statusFilter) queryParams.status = statusFilter;

  const { data, isLoading, refetch } = useAdminEvents(queryParams);
  const createEvent = useAdminCreateEvent();
  const publishEvent = useAdminPublishEvent();
  const unpublishEvent = useAdminUnpublishEvent();
  const deleteEvent = useAdminDeleteEvent();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventFormData>(defaultForm);
  const [tagsInput, setTagsInput] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const events = data?.data || [];
  const stats = data?.stats;

  const handleCreate = () => {
    const submitData = {
      ...form,
      tags: tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    createEvent.mutate(submitData, {
      onSuccess: () => {
        setShowForm(false);
        setForm(defaultForm);
        setTagsInput('');
        refetch();
      },
    });
  };

  const handlePublish = (id: string) => {
    publishEvent.mutate(id, { onSuccess: () => refetch() });
  };

  const handleUnpublish = (id: string) => {
    unpublishEvent.mutate(id, { onSuccess: () => refetch() });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEvent.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setDeleteConfirmText('');
        refetch();
      },
    });
  };

  const updateForm = (updates: Partial<EventFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const getStatusBadge = (status: string, isPublished: boolean) => {
    if (!isPublished) {
      return (
        <span className="badge-status rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Draft
        </span>
      );
    }
    const config = EVENT_STATUS_MAP[status];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    return (
      <span className={`badge-status rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        description="Create and manage foundation events"
        badge="Events"
        action={
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">
                {stats.drafts}
              </p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {stats.published}
              </p>
              <p className="text-xs text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">
                {stats.upcoming}
              </p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">
                {stats.ongoing}
              </p>
              <p className="text-xs text-muted-foreground">Ongoing</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-500">
                {stats.completed}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs
          value={filter}
          onValueChange={(v) => {
            setFilter(v as FilterType);
            setPage(1);
          }}
        >
          <TabsList className="rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">
              All Events
            </TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-lg">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Drafts
            </TabsTrigger>
            <TabsTrigger value="published" className="rounded-lg">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Published
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v === 'ALL' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.entries(EVENT_STATUS_MAP).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            filter === 'drafts'
              ? 'No draft events'
              : filter === 'published'
                ? 'No published events'
                : 'No events yet'
          }
          description={
            filter === 'drafts'
              ? 'All events have been published'
              : 'Create your first event to get started'
          }
          action={
            <Button
              onClick={() => setShowForm(true)}
              className="rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {events.map((event: any) => (
              <Card
                key={event.id}
                className="overflow-hidden rounded-2xl border-border/50"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-4">
                      {event.featuredImageThumbnail ||
                      event.featuredImageUrl ? (
                        <img
                          src={
                            event.featuredImageThumbnail ||
                            event.featuredImageUrl
                          }
                          alt=""
                          className="h-20 w-28 flex-shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-primary/5">
                          <Calendar className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          {getStatusBadge(
                            event.status,
                            event.isPublished
                          )}
                          <Badge
                            variant="outline"
                            className="text-[10px]"
                          >
                            {EVENT_TYPE_MAP[event.eventType] ||
                              event.eventType}
                          </Badge>
                          {event.isFeatured && (
                            <Badge
                              variant="default"
                              className="bg-amber-500 text-[10px]"
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-heading text-lg font-semibold">
                          {event.title}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(event.startDate)}
                          </span>
                          {event.venueName && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.venueName}
                            </span>
                          )}
                          {event.isVirtualEvent && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Virtual
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {event.viewCount} views
                          </span>
                        </div>
                        {event.createdByAdmin && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Created by:{' '}
                            {event.createdByAdmin.fullName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                      {!event.isPublished ? (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(event.id)}
                          disabled={publishEvent.isPending}
                          className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
                        >
                          {publishEvent.isPending ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUnpublish(event.id)
                          }
                          disabled={unpublishEvent.isPending}
                          className="rounded-xl"
                        >
                          {unpublishEvent.isPending ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Unpublish
                        </Button>
                      )}
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({
                            id: event.id,
                            title: event.title,
                          })
                        }
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data?.meta && (
            <PaginationControls
              meta={data.meta}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* ═══ Create Event Dialog ═══ */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Calendar className="h-5 w-5 text-primary" />
              Create Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(r) =>
                updateForm({ featuredImageUrl: r?.imageUrl || '' })
              }
              folder="events"
              currentImage={form.featuredImageUrl}
              label="Featured Image"
              useAdminEndpoint
            />

            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  updateForm({ title: e.target.value })
                }
                className="h-11 rounded-xl"
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Select
                  value={form.eventType}
                  onValueChange={(v) =>
                    updateForm({ eventType: v })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] rounded-xl">
                    {Object.entries(EVENT_TYPE_MAP).map(
                      ([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    updateForm({ startDate: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  value={form.startTime}
                  onChange={(e) =>
                    updateForm({ startTime: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  placeholder="10:00 AM"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    updateForm({ endDate: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  value={form.endTime}
                  onChange={(e) =>
                    updateForm({ endTime: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  placeholder="4:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  updateForm({ description: e.target.value })
                }
                className="rounded-xl"
                rows={4}
                placeholder="Full event description..."
              />
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input
                value={form.shortDescription}
                onChange={(e) =>
                  updateForm({
                    shortDescription: e.target.value,
                  })
                }
                className="h-11 rounded-xl"
                maxLength={300}
                placeholder="Brief summary (max 300 chars)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue Name *</Label>
                <Input
                  value={form.venueName}
                  onChange={(e) =>
                    updateForm({ venueName: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) =>
                    updateForm({ state: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue Address</Label>
              <Textarea
                value={form.venueAddress}
                onChange={(e) =>
                  updateForm({ venueAddress: e.target.value })
                }
                className="rounded-xl"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.isVirtualEvent}
                  onCheckedChange={(v) =>
                    updateForm({ isVirtualEvent: v })
                  }
                />
                Virtual Event
              </label>
            </div>

            {form.isVirtualEvent && (
              <div className="space-y-2">
                <Label>Virtual Event Link</Label>
                <Input
                  value={form.virtualEventLink}
                  onChange={(e) =>
                    updateForm({
                      virtualEventLink: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Registration Link</Label>
              <Input
                value={form.registrationLink}
                onChange={(e) =>
                  updateForm({
                    registrationLink: e.target.value,
                  })
                }
                className="h-11 rounded-xl"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="training, agriculture, workshop"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    updateForm({ isFeatured: v })
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.showOnHomePage}
                  onCheckedChange={(v) =>
                    updateForm({ showOnHomePage: v })
                  }
                />
                Show on Homepage
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !form.title ||
                !form.startDate ||
                !form.venueName ||
                !form.description ||
                createEvent.isPending
              }
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {createEvent.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Event (Draft)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete Confirmation ═══ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteConfirmText('');
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  This action <strong>cannot be undone</strong>. This
                  will permanently delete the event{' '}
                  <strong>
                    &quot;{deleteTarget?.title}&quot;
                  </strong>{' '}
                  along with all its gallery images, agenda items, and
                  associated data.
                </p>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Type <strong>DELETE</strong> to confirm
                  </Label>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) =>
                      setDeleteConfirmText(e.target.value)
                    }
                    className="h-10 rounded-xl"
                    placeholder="Type DELETE"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl"
              onClick={() => {
                setDeleteTarget(null);
                setDeleteConfirmText('');
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={
                deleteConfirmText !== 'DELETE' ||
                deleteEvent.isPending
              }
            >
              {deleteEvent.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Event
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}