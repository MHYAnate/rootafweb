'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/use-events';
import { usePagination } from '@/hooks/use-pagination';
import { useAdminCreateEvent, useAdminPublishEvent } from '@/hooks/use-admin';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { EVENT_TYPE_MAP, EVENT_STATUS_MAP } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { Plus, Edit, Loader2, Calendar, MapPin, Clock, Globe, Eye, Send } from 'lucide-react';
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
  title: '', eventType: 'TRAINING_WORKSHOP', description: '', shortDescription: '',
  startDate: '', startTime: '', endDate: '', endTime: '',
  venueName: '', venueAddress: '', cityLga: '', state: '',
  isVirtualEvent: false, virtualEventLink: '', featuredImageUrl: '',
  registrationLink: '', isFeatured: false, showOnHomePage: false, tags: [],
};

export default function AdminEventsPage() {
  const { page, setPage } = usePagination();
  const { data, isLoading, refetch } = useEvents({ page, limit: 12 });
  const createEvent = useAdminCreateEvent();
  const publishEvent = useAdminPublishEvent();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventFormData>(defaultForm);
  const [tagsInput, setTagsInput] = useState('');

  const events = data?.data || [];

  // Build typed entries
  const eventTypeEntries = (Object.entries(EVENT_TYPE_MAP) as [string, string][]);

  const handleCreate = () => {
    const submitData = {
      ...form,
      tags: tagsInput.split(',').map((s) => s.trim()).filter(Boolean),
    };
    createEvent.mutate(submitData, {
      onSuccess: () => { setShowForm(false); setForm(defaultForm); setTagsInput(''); refetch(); },
    });
  };

  const handlePublish = (id: string) => {
    publishEvent.mutate(id, { onSuccess: () => refetch() });
  };

  const updateForm = (updates: Partial<EventFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const getStatusBadge = (status: string) => {
    const config = EVENT_STATUS_MAP[status];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>
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

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          action={
            <Button onClick={() => setShowForm(true)} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {events.map((event: any) => (
              <Card key={event.id} className="rounded-2xl border-border/50 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {event.featuredImageThumbnail || event.featuredImageUrl ? (
                        <img
                          src={event.featuredImageThumbnail || event.featuredImageUrl}
                          alt=""
                          className="h-20 w-28 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-28 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(event.status)}
                          <Badge variant="outline" className="text-[10px]">
                            {EVENT_TYPE_MAP[event.eventType] || event.eventType}
                          </Badge>
                          {event.isFeatured && <Badge variant="gold" className="text-[10px]">Featured</Badge>}
                        </div>
                        <h3 className="font-heading font-semibold text-lg">{event.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(event.startDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.venueName}
                          </span>
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {event.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(event.id)}
                          disabled={publishEvent.isPending}
                          className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
                        >
                          <Send className="mr-1.5 h-3.5 w-3.5" />
                          Publish
                        </Button>
                      )}
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}

      {/* Create Event Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Create Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(r: any) => updateForm({ featuredImageUrl: r?.imageUrl || '' })}
              folder="events"
              currentImage={form.featuredImageUrl}
              label="Featured Image"
              useAdminEndpoint
            />

            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className="rounded-xl h-11"
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Select value={form.eventType} onValueChange={(v) => updateForm({ eventType: v })}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[250px]">
                    {eventTypeEntries.map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateForm({ startDate: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  value={form.startTime}
                  onChange={(e) => updateForm({ startTime: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="10:00 AM"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateForm({ endDate: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  value={form.endTime}
                  onChange={(e) => updateForm({ endTime: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="4:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="rounded-xl"
                rows={4}
                placeholder="Full event description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue Name *</Label>
                <Input
                  value={form.venueName}
                  onChange={(e) => updateForm({ venueName: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => updateForm({ state: e.target.value })}
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue Address</Label>
              <Textarea
                value={form.venueAddress}
                onChange={(e) => updateForm({ venueAddress: e.target.value })}
                className="rounded-xl"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch
                  checked={form.isVirtualEvent}
                  onCheckedChange={(v) => updateForm({ isVirtualEvent: v })}
                />
                Virtual Event
              </label>
            </div>

            {form.isVirtualEvent && (
              <div className="space-y-2">
                <Label>Virtual Event Link</Label>
                <Input
                  value={form.virtualEventLink}
                  onChange={(e) => updateForm({ virtualEventLink: e.target.value })}
                  className="rounded-xl h-11"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Registration Link</Label>
              <Input
                value={form.registrationLink}
                onChange={(e) => updateForm({ registrationLink: e.target.value })}
                className="rounded-xl h-11"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="rounded-xl h-11"
                placeholder="training, agriculture, workshop"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => updateForm({ isFeatured: v })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch checked={form.showOnHomePage} onCheckedChange={(v) => updateForm({ showOnHomePage: v })} />
                Show on Homepage
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !form.title || !form.startDate || !form.venueName || !form.description || createEvent.isPending
              }
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
            >
              {createEvent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event (Draft)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}