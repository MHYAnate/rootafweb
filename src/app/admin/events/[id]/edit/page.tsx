'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useAdminEvent,
  useAdminUpdateEvent,
  useAdminPublishEvent,
  useAdminUnpublishEvent,
  useAdminUpdateEventStatus,
  useAdminDeleteEvent,
  useAdminAddGalleryImage,
  useAdminUpdateGalleryImage,
  useAdminRemoveGalleryImage,
  useAdminAddAgendaItem,
  useAdminUpdateAgendaItem,
  useAdminRemoveAgendaItem,
} from '@/hooks/use-events';
import { cleanPayload } from '@/lib/clean-payload';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ImageUpload } from '@/components/shared/image-upload';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  EVENT_TYPE_MAP,
  EVENT_STATUS_MAP,
  NIGERIAN_STATES,
  TIMEZONES,
  VIRTUAL_PLATFORMS,
} from '@/lib/constants';
import { formatDate } from '@/lib/format';
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Globe,
  Send,
  EyeOff,
  Trash2,
  ImagePlus,
  X,
  Plus,
  ListOrdered,
  Image as ImageIcon,
  Settings,
  FileText,
  AlertTriangle,
  Link as LinkIcon,
  ClipboardList,
  Coffee,
  Star,
  User,
  Video,
  ExternalLink,
  Users,
  BarChart3,
  BookOpen,
  Newspaper,
  Edit,
} from 'lucide-react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════
// TYPES — aligned with Prisma schema exactly
// ═══════════════════════════════════════════════════════════

interface EventFormData {
  // Basic information
  title: string;
  eventType: string;
  description: string;
  shortDescription: string;
  // Date and time
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  // Venue
  venueName: string;
  venueAddress: string;
  cityLga: string;
  state: string;
  // Virtual
  isVirtualEvent: boolean;
  virtualEventLink: string;
  virtualEventPlatform: string;
  // Images
  featuredImageUrl: string;
  bannerImageUrl: string;
  // External links
  registrationLink: string;
  videoLink: string;
  newsLink: string;
  reportDocumentLink: string;
  // Display
  isFeatured: boolean;
  showOnHomePage: boolean;
  tags: string[];
  // Post-event (EventStatus.COMPLETED or CANCELLED)
  attendanceCount: string;
  eventSummary: string;
  keyOutcomes: string;
  notableAttendees: string;
  lessonsLearned: string;
}

// Matches EventAgendaItem schema
interface AgendaFormData {
  startTime: string;
  endTime: string;
  duration: string;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  speakerPhoto: string;
  location: string;
  displayOrder: number;
  isBreak: boolean;
}

// Matches EventGalleryImage schema
interface GalleryFormData {
  imageUrl: string;
  caption: string;
  altText: string;
  photographer: string;
  takenAt: string;
  displayOrder: number;
  isFeatured: boolean;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function toDateInput(val?: string | null): string {
  if (!val) return '';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function formFromEvent(e: any): EventFormData {
  return {
    title: e.title || '',
    eventType: e.eventType || 'TRAINING_WORKSHOP',
    description: e.description || '',
    shortDescription: e.shortDescription || '',
    startDate: toDateInput(e.startDate),
    startTime: e.startTime || '',
    endDate: toDateInput(e.endDate),
    endTime: e.endTime || '',
    timezone: e.timezone || 'Africa/Lagos',
    venueName: e.venueName || '',
    venueAddress: e.venueAddress || '',
    cityLga: e.cityLga || '',
    state: e.state || '',
    isVirtualEvent: e.isVirtualEvent ?? false,
    virtualEventLink: e.virtualEventLink || '',
    virtualEventPlatform: e.virtualEventPlatform || '',
    featuredImageUrl: e.featuredImageUrl || '',
    bannerImageUrl: e.bannerImageUrl || '',
    registrationLink: e.registrationLink || '',
    videoLink: e.videoLink || '',
    newsLink: e.newsLink || '',
    reportDocumentLink: e.reportDocumentLink || '',
    isFeatured: e.isFeatured ?? false,
    showOnHomePage: e.showOnHomePage ?? false,
    tags: e.tags || [],
    attendanceCount: e.attendanceCount?.toString() || '',
    eventSummary: e.eventSummary || '',
    keyOutcomes: e.keyOutcomes || '',
    notableAttendees: e.notableAttendees || '',
    lessonsLearned: e.lessonsLearned || '',
  };
}

const emptyAgenda: AgendaFormData = {
  startTime: '',
  endTime: '',
  duration: '',
  title: '',
  description: '',
  speakerName: '',
  speakerTitle: '',
  speakerPhoto: '',
  location: '',
  displayOrder: 0,
  isBreak: false,
};

const emptyGallery: GalleryFormData = {
  imageUrl: '',
  caption: '',
  altText: '',
  photographer: '',
  takenAt: '',
  displayOrder: 0,
  isFeatured: false,
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function AdminEventEditPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Queries & mutations
  const { data, isLoading, error } = useAdminEvent(eventId);
  const updateEvent = useAdminUpdateEvent();
  const publishEvent = useAdminPublishEvent();
  const unpublishEvent = useAdminUnpublishEvent();
  const updateStatus = useAdminUpdateEventStatus();
  const deleteEvent = useAdminDeleteEvent();
  const addGalleryImage = useAdminAddGalleryImage();
  const updateGalleryImage = useAdminUpdateGalleryImage();
  const removeGalleryImage = useAdminRemoveGalleryImage();
  const addAgendaItem = useAdminAddAgendaItem();
  const updateAgendaItem = useAdminUpdateAgendaItem();
  const removeAgendaItem = useAdminRemoveAgendaItem();

  // Form
  const [form, setForm] = useState<EventFormData | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [hasChanges, setHasChanges] = useState(false);

  // Delete
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Gallery dialog
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [galleryForm, setGalleryForm] = useState<GalleryFormData>(emptyGallery);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Agenda dialog
  const [showAgendaDialog, setShowAgendaDialog] = useState(false);
  const [agendaForm, setAgendaForm] = useState<AgendaFormData>(emptyAgenda);
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);

  const event = data?.data;

  useEffect(() => {
    if (event && !form) {
      setForm(formFromEvent(event));
      setTagsInput((event.tags || []).join(', '));
    }
  }, [event, form]);

  const patch = useCallback((u: Partial<EventFormData>) => {
    setForm((p) => (p ? { ...p, ...u } : p));
    setHasChanges(true);
  }, []);

  // ─── Build & Send Payloads ────────────────────────────

  const handleSave = () => {
    if (!form) return;
    const raw: Record<string, any> = {
      title: form.title,
      eventType: form.eventType,
      description: form.description,
      startDate: form.startDate,
      venueName: form.venueName,
      isVirtualEvent: form.isVirtualEvent,
      isFeatured: form.isFeatured,
      showOnHomePage: form.showOnHomePage,
      shortDescription: form.shortDescription,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
      timezone: form.timezone,
      venueAddress: form.venueAddress,
      cityLga: form.cityLga,
      state: form.state,
      virtualEventLink: form.virtualEventLink,
      virtualEventPlatform: form.virtualEventPlatform,
      featuredImageUrl: form.featuredImageUrl,
      bannerImageUrl: form.bannerImageUrl,
      registrationLink: form.registrationLink,
      videoLink: form.videoLink,
      newsLink: form.newsLink,
      reportDocumentLink: form.reportDocumentLink,
      eventSummary: form.eventSummary,
      keyOutcomes: form.keyOutcomes,
      notableAttendees: form.notableAttendees,
      lessonsLearned: form.lessonsLearned,
      tags: tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (form.attendanceCount && !isNaN(Number(form.attendanceCount))) {
      raw.attendanceCount = Number(form.attendanceCount);
    }
    updateEvent.mutate(
      { id: eventId, data: cleanPayload(raw) },
      { onSuccess: () => setHasChanges(false) }
    );
  };

  /** Build agenda payload — only non-empty fields */
  const handleSaveAgenda = () => {
    if (!agendaForm.title) return;
    const payload = cleanPayload({
      title: agendaForm.title,
      startTime: agendaForm.startTime,
      endTime: agendaForm.endTime,
      duration: agendaForm.duration,
      description: agendaForm.description,
      speakerName: agendaForm.speakerName,
      speakerTitle: agendaForm.speakerTitle,
      speakerPhoto: agendaForm.speakerPhoto,
      location: agendaForm.location,
      displayOrder: agendaForm.displayOrder,
      isBreak: agendaForm.isBreak,
    });

    console.log('📤 Agenda payload:', JSON.stringify(payload));

    const onDone = () => {
      setShowAgendaDialog(false);
      setAgendaForm(emptyAgenda);
      setEditingAgendaId(null);
    };

    if (editingAgendaId) {
      updateAgendaItem.mutate(
        { eventId, itemId: editingAgendaId, data: payload },
        { onSuccess: onDone }
      );
    } else {
      addAgendaItem.mutate({ eventId, data: payload }, { onSuccess: onDone });
    }
  };

  /** Build gallery payload — only non-empty fields */
  const handleSaveGallery = () => {
    if (!galleryForm.imageUrl) return;
    const payload = cleanPayload({
      imageUrl: galleryForm.imageUrl,
      caption: galleryForm.caption,
      altText: galleryForm.altText,
      photographer: galleryForm.photographer,
      takenAt: galleryForm.takenAt,
      displayOrder: galleryForm.displayOrder,
      isFeatured: galleryForm.isFeatured,
    });

    const onDone = () => {
      setShowGalleryDialog(false);
      setGalleryForm(emptyGallery);
      setEditingGalleryId(null);
    };

    if (editingGalleryId) {
      updateGalleryImage.mutate(
        { eventId, imageId: editingGalleryId, data: payload },
        { onSuccess: onDone }
      );
    } else {
      addGalleryImage.mutate({ eventId, data: payload }, { onSuccess: onDone });
    }
  };

  // ─── Open dialogs ─────────────────────────────────────

  const openAddAgenda = () => {
    setEditingAgendaId(null);
    setAgendaForm({
      ...emptyAgenda,
      displayOrder: (event?.agenda?.length || 0) + 1,
    });
    setShowAgendaDialog(true);
  };

  const openEditAgenda = (item: any) => {
    setEditingAgendaId(item.id);
    setAgendaForm({
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      duration: item.duration || '',
      title: item.title || '',
      description: item.description || '',
      speakerName: item.speakerName || '',
      speakerTitle: item.speakerTitle || '',
      speakerPhoto: item.speakerPhoto || '',
      location: item.location || '',
      displayOrder: item.displayOrder ?? 0,
      isBreak: item.isBreak ?? false,
    });
    setShowAgendaDialog(true);
  };

  const openAddGallery = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      ...emptyGallery,
      displayOrder: (event?.gallery?.length || 0) + 1,
    });
    setShowGalleryDialog(true);
  };

  const openEditGallery = (img: any) => {
    setEditingGalleryId(img.id);
    setGalleryForm({
      imageUrl: img.imageUrl || '',
      caption: img.caption || '',
      altText: img.altText || '',
      photographer: img.photographer || '',
      takenAt: toDateInput(img.takenAt),
      displayOrder: img.displayOrder ?? 0,
      isFeatured: img.isFeatured ?? false,
    });
    setShowGalleryDialog(true);
  };

  // ─── Other handlers ───────────────────────────────────

  const handlePublish = () => publishEvent.mutate(eventId);
  const handleUnpublish = () => unpublishEvent.mutate(eventId);
  const handleStatusChange = (s: string) =>
    updateStatus.mutate({ id: eventId, status: s });
  const handleDelete = () => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.push('/admin/events');
      },
    });
  };

  // ─── Status badge ──────────────────────────────────────

  const statusBadge = (status: string, published: boolean) => {
    if (!published)
      return (
        <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Draft
        </span>
      );
    const c = EVENT_STATUS_MAP[status];
    return c ? (
      <span className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${c.color}`}>
        {c.label}
      </span>
    ) : (
      <Badge variant="outline">{status}</Badge>
    );
  };

  const isPostEvent =
    event?.status === 'COMPLETED' || event?.status === 'CANCELLED';

  // ─── Loading / Error ───────────────────────────────────

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (error || !event)
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <Link href="/admin/events">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    );

  if (!form) return null;

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold">Edit Event</h1>
              {statusBadge(event.status, event.isPublished)}
              <Badge variant="outline" className="text-[10px]">
                {EVENT_TYPE_MAP[event.eventType] || event.eventType}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Created {formatDate(event.createdAt)}
              {event.createdByAdmin && ` by ${event.createdByAdmin.fullName}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {event.isPublished && (
            <Select value={event.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 w-[160px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {Object.entries(EVENT_STATUS_MAP).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!event.isPublished ? (
            <Button
              size="sm"
              onClick={handlePublish}
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
              onClick={handleUnpublish}
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

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || updateEvent.isPending}
            className="rounded-xl bg-gradient-to-r from-primary to-emerald-600"
          >
            {updateEvent.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            Save
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-xl"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Unsaved changes — click <strong>Save</strong> to persist.
          </p>
        </div>
      )}

      {/* ═══ TABS ═══ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl p-1">
          <TabsTrigger value="details" className="rounded-lg">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Details
          </TabsTrigger>
          <TabsTrigger value="venue" className="rounded-lg">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            Venue
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg">
            <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
            Gallery
            {event.gallery?.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">
                {event.gallery.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agenda" className="rounded-lg">
            <ListOrdered className="mr-1.5 h-3.5 w-3.5" />
            Agenda
            {event.agenda?.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px]">
                {event.agenda.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="links" className="rounded-lg">
            <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
            Links
          </TabsTrigger>
          {isPostEvent && (
            <TabsTrigger value="post-event" className="rounded-lg">
              <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
              Post-Event
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" className="rounded-lg">
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* ═══════ DETAILS ═══════ */}
        <TabsContent value="details" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onUploadComplete={(r) => patch({ featuredImageUrl: r?.imageUrl || '' })}
                  folder="events"
                  currentImage={form.featuredImageUrl}
                  label="Featured Image"
                  useAdminEndpoint
                />
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Banner Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onUploadComplete={(r) => patch({ bannerImageUrl: r?.imageUrl || '' })}
                  folder="events/banners"
                  currentImage={form.bannerImageUrl}
                  label="Banner Image"
                  useAdminEndpoint
                />
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Select value={form.eventType} onValueChange={(v) => patch({ eventType: v })}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-xl">
                    {Object.entries(EVENT_TYPE_MAP).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  className="rounded-xl"
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  value={form.shortDescription}
                  onChange={(e) => patch({ shortDescription: e.target.value })}
                  className="rounded-xl"
                  rows={2}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">{form.shortDescription.length}/300</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => patch({ startDate: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input value={form.startTime} onChange={(e) => patch({ startTime: e.target.value })} className="h-11 rounded-xl" placeholder="10:00 AM" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={form.timezone} onValueChange={(v) => patch({ timezone: v })}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {TIMEZONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input value={form.endTime} onChange={(e) => patch({ endTime: e.target.value })} className="h-11 rounded-xl" placeholder="4:00 PM" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={tagsInput}
                onChange={(e) => { setTagsInput(e.target.value); setHasChanges(true); }}
                className="h-11 rounded-xl"
                placeholder="training, agriculture, workshop"
              />
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5">
                  {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="rounded-lg text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ VENUE ═══════ */}
        <TabsContent value="venue" className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-lg">Venue</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Venue Name *</Label>
                  <Input value={form.venueName} onChange={(e) => patch({ venueName: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>City / LGA</Label>
                  <Input value={form.cityLga} onChange={(e) => patch({ cityLga: e.target.value })} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={form.state || '_none'} onValueChange={(v) => patch({ state: v === '_none' ? '' : v })}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent className="max-h-[250px] rounded-xl">
                    <SelectItem value="_none">— Select —</SelectItem>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={form.venueAddress} onChange={(e) => patch({ venueAddress: e.target.value })} className="rounded-xl" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Virtual Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={form.isVirtualEvent} onCheckedChange={(v) => patch({ isVirtualEvent: v })} />
                <span className="text-sm font-medium">This is a virtual event</span>
              </label>
              {form.isVirtualEvent && (
                <>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={form.virtualEventPlatform || '_none'} onValueChange={(v) => patch({ virtualEventPlatform: v === '_none' ? '' : v })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="_none">— Select —</SelectItem>
                        {VIRTUAL_PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Virtual Event Link</Label>
                    <Input value={form.virtualEventLink} onChange={(e) => patch({ virtualEventLink: e.target.value })} className="h-11 rounded-xl" placeholder="https://..." />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ GALLERY ═══════ */}
        <TabsContent value="gallery" className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Gallery</CardTitle>
                <CardDescription>{event.gallery?.length || 0} images</CardDescription>
              </div>
              <Button size="sm" onClick={openAddGallery} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" />Add Image
              </Button>
            </CardHeader>
            <CardContent>
              {!event.gallery?.length ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm">No images yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {[...event.gallery]
                    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                    .map((img: any) => (
                      <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border/50">
                        <img src={img.thumbnailUrl || img.imageUrl} alt={img.altText || img.caption || ''} className="aspect-square w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 transition-colors group-hover:bg-black/40">
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100" onClick={() => openEditGallery(img)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100" onClick={() => removeGalleryImage.mutate({ eventId, imageId: img.id })} disabled={removeGalleryImage.isPending}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {img.isFeatured && (
                          <div className="absolute left-2 top-2">
                            <Badge className="bg-amber-500 text-[10px]"><Star className="mr-0.5 h-2.5 w-2.5" />Featured</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1.5">
                          <p className="truncate text-[10px] text-white">{img.caption || 'No caption'}</p>
                          {img.photographer && <p className="truncate text-[9px] text-white/70">📷 {img.photographer}</p>}
                        </div>
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded bg-black/50 text-[9px] font-bold text-white">{img.displayOrder}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ AGENDA ═══════ */}
        <TabsContent value="agenda" className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Agenda</CardTitle>
                <CardDescription>{event.agenda?.length || 0} items</CardDescription>
              </div>
              <Button size="sm" onClick={openAddAgenda} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
                <Plus className="mr-1.5 h-3.5 w-3.5" />Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {!event.agenda?.length ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ListOrdered className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm">No agenda items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...event.agenda]
                    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                    .map((item: any) => (
                      <div key={item.id} className={`flex items-start gap-4 rounded-xl border p-4 ${item.isBreak ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20' : 'border-border/50 bg-muted/30'}`}>
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[9px] font-bold">{item.displayOrder}</span>
                          <div className={`rounded-lg px-3 py-2 text-center ${item.isBreak ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'}`}>
                            {item.isBreak ? <Coffee className="mx-auto mb-0.5 h-3.5 w-3.5 text-amber-600" /> : <Clock className="mx-auto mb-0.5 h-3.5 w-3.5 text-primary" />}
                            {item.startTime && <p className={`text-xs font-semibold ${item.isBreak ? 'text-amber-700' : 'text-primary'}`}>{item.startTime}</p>}
                            {item.endTime && <p className="text-[10px] text-muted-foreground">– {item.endTime}</p>}
                            {item.duration && <p className="text-[10px] text-muted-foreground">{item.duration}</p>}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-medium">{item.title}</h4>
                            {item.isBreak && <Badge variant="outline" className="border-amber-300 text-[10px] text-amber-600">Break</Badge>}
                          </div>
                          {(item.speakerName || item.speakerTitle) && (
                            <div className="mt-1 flex items-center gap-2">
                              {item.speakerPhoto ? (
                                <img src={item.speakerPhoto} alt="" className="h-6 w-6 rounded-full object-cover" />
                              ) : item.speakerName ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-3 w-3 text-primary" />
                                </div>
                              ) : null}
                              <div>
                                {item.speakerName && <p className="text-xs font-medium">{item.speakerName}</p>}
                                {item.speakerTitle && <p className="text-[10px] text-muted-foreground">{item.speakerTitle}</p>}
                              </div>
                            </div>
                          )}
                          {item.description && <p className="mt-1.5 text-xs text-muted-foreground">{item.description}</p>}
                          {item.location && <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground"><MapPin className="h-2.5 w-2.5" />{item.location}</p>}
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEditAgenda(item)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => removeAgendaItem.mutate({ eventId, itemId: item.id })} disabled={removeAgendaItem.isPending}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ LINKS ═══════ */}
        <TabsContent value="links" className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-lg">External Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" />Registration Link</Label>
                <Input value={form.registrationLink} onChange={(e) => patch({ registrationLink: e.target.value })} className="h-11 rounded-xl" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" />Video Link</Label>
                <Input value={form.videoLink} onChange={(e) => patch({ videoLink: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Newspaper className="h-3.5 w-3.5" />News Link</Label>
                <Input value={form.newsLink} onChange={(e) => patch({ newsLink: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />Report Document Link</Label>
                <Input value={form.reportDocumentLink} onChange={(e) => patch({ reportDocumentLink: e.target.value })} className="h-11 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ POST-EVENT ═══════ */}
        {isPostEvent && (
          <TabsContent value="post-event" className="mt-6 space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="text-lg">Post-Event Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Attendance Count</Label>
                  <Input type="number" value={form.attendanceCount} onChange={(e) => patch({ attendanceCount: e.target.value })} className="h-11 w-48 rounded-xl" min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Event Summary</Label>
                  <Textarea value={form.eventSummary} onChange={(e) => patch({ eventSummary: e.target.value })} className="rounded-xl" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Key Outcomes</Label>
                  <Textarea value={form.keyOutcomes} onChange={(e) => patch({ keyOutcomes: e.target.value })} className="rounded-xl" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Notable Attendees</Label>
                  <Textarea value={form.notableAttendees} onChange={(e) => patch({ notableAttendees: e.target.value })} className="rounded-xl" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Lessons Learned</Label>
                  <Textarea value={form.lessonsLearned} onChange={(e) => patch({ lessonsLearned: e.target.value })} className="rounded-xl" rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ═══════ SETTINGS ═══════ */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-lg">Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <label className="flex cursor-pointer items-center justify-between">
                <div><p className="text-sm font-medium">Featured Event</p><p className="text-xs text-muted-foreground">Highlight across the site</p></div>
                <Switch checked={form.isFeatured} onCheckedChange={(v) => patch({ isFeatured: v })} />
              </label>
              <Separator />
              <label className="flex cursor-pointer items-center justify-between">
                <div><p className="text-sm font-medium">Show on Homepage</p><p className="text-xs text-muted-foreground">Display on homepage section</p></div>
                <Switch checked={form.showOnHomePage} onCheckedChange={(v) => patch({ showOnHomePage: v })} />
              </label>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-lg">Metadata</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">ID</p><p className="mt-0.5 break-all font-mono text-xs">{event.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Views</p><p className="mt-0.5 font-semibold">{event.viewCount ?? 0}</p></div>
                <div><p className="text-xs text-muted-foreground">Created</p><p className="mt-0.5">{formatDate(event.createdAt)}</p></div>
                <div><p className="text-xs text-muted-foreground">Updated</p><p className="mt-0.5">{formatDate(event.updatedAt)}</p></div>
                {event.publishedAt && <div><p className="text-xs text-muted-foreground">Published</p><p className="mt-0.5">{formatDate(event.publishedAt)}</p></div>}
                {event.createdByAdmin && <div><p className="text-xs text-muted-foreground">Created By</p><p className="mt-0.5">{event.createdByAdmin.fullName}</p></div>}
                {event.lastUpdatedByAdmin && <div><p className="text-xs text-muted-foreground">Updated By</p><p className="mt-0.5">{event.lastUpdatedByAdmin.fullName}</p></div>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-destructive/30">
            <CardHeader><CardTitle className="text-lg text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Delete this event</p><p className="text-xs text-muted-foreground">Permanently remove event, {event.gallery?.length || 0} gallery images, {event.agenda?.length || 0} agenda items</p></div>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="rounded-xl">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══ GALLERY DIALOG ═══ */}
      <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              {editingGalleryId ? 'Edit Image' : 'Add Image'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              onUploadComplete={(r) => setGalleryForm((p) => ({ ...p, imageUrl: r?.imageUrl || '' }))}
              folder="events/gallery"
              currentImage={galleryForm.imageUrl}
              label="Image"
              useAdminEndpoint
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Caption</Label>
                <Input value={galleryForm.caption} onChange={(e) => setGalleryForm((p) => ({ ...p, caption: e.target.value }))} className="h-11 rounded-xl" maxLength={300} />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input value={galleryForm.altText} onChange={(e) => setGalleryForm((p) => ({ ...p, altText: e.target.value }))} className="h-11 rounded-xl" maxLength={200} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Photographer</Label>
                <Input value={galleryForm.photographer} onChange={(e) => setGalleryForm((p) => ({ ...p, photographer: e.target.value }))} className="h-11 rounded-xl" maxLength={150} />
              </div>
              <div className="space-y-2">
                <Label>Date Taken</Label>
                <Input type="date" value={galleryForm.takenAt} onChange={(e) => setGalleryForm((p) => ({ ...p, takenAt: e.target.value }))} className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={galleryForm.displayOrder} onChange={(e) => setGalleryForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="h-11 rounded-xl" min="0" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Switch checked={galleryForm.isFeatured} onCheckedChange={(v) => setGalleryForm((p) => ({ ...p, isFeatured: v }))} />Featured
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowGalleryDialog(false); setEditingGalleryId(null); setGalleryForm(emptyGallery); }} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSaveGallery} disabled={!galleryForm.imageUrl || addGalleryImage.isPending || updateGalleryImage.isPending} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
              {(addGalleryImage.isPending || updateGalleryImage.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingGalleryId ? 'Update' : 'Add Image'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ AGENDA DIALOG ═══ */}
      <Dialog open={showAgendaDialog} onOpenChange={setShowAgendaDialog}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-primary" />
              {editingAgendaId ? 'Edit Agenda Item' : 'Add Agenda Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Switch checked={agendaForm.isBreak} onCheckedChange={(v) => setAgendaForm((p) => ({ ...p, isBreak: v }))} />
              <Coffee className="h-3.5 w-3.5 text-amber-500" /> Break (tea, lunch, etc.)
            </label>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input value={agendaForm.startTime} onChange={(e) => setAgendaForm((p) => ({ ...p, startTime: e.target.value }))} className="h-11 rounded-xl" placeholder="10:00 AM" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input value={agendaForm.endTime} onChange={(e) => setAgendaForm((p) => ({ ...p, endTime: e.target.value }))} className="h-11 rounded-xl" placeholder="11:00 AM" />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={agendaForm.duration} onChange={(e) => setAgendaForm((p) => ({ ...p, duration: e.target.value }))} className="h-11 rounded-xl" placeholder="1 hour" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={agendaForm.title} onChange={(e) => setAgendaForm((p) => ({ ...p, title: e.target.value }))} className="h-11 rounded-xl" placeholder={agendaForm.isBreak ? 'e.g. Lunch Break' : 'Session title'} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={agendaForm.description} onChange={(e) => setAgendaForm((p) => ({ ...p, description: e.target.value }))} className="rounded-xl" rows={3} />
            </div>

            {!agendaForm.isBreak && (
              <>
                <Separator />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Speaker</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={agendaForm.speakerName} onChange={(e) => setAgendaForm((p) => ({ ...p, speakerName: e.target.value }))} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title / Role</Label>
                    <Input value={agendaForm.speakerTitle} onChange={(e) => setAgendaForm((p) => ({ ...p, speakerTitle: e.target.value }))} className="h-11 rounded-xl" />
                  </div>
                </div>
                <ImageUpload
                  onUploadComplete={(r) => setAgendaForm((p) => ({ ...p, speakerPhoto: r?.imageUrl || '' }))}
                  folder="events/speakers"
                  currentImage={agendaForm.speakerPhoto}
                  label="Speaker Photo"
                  useAdminEndpoint
                />
              </>
            )}

            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location (if different)</Label>
                <Input value={agendaForm.location} onChange={(e) => setAgendaForm((p) => ({ ...p, location: e.target.value }))} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={agendaForm.displayOrder} onChange={(e) => setAgendaForm((p) => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="h-11 rounded-xl" min="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAgendaDialog(false); setEditingAgendaId(null); setAgendaForm(emptyAgenda); }} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSaveAgenda} disabled={!agendaForm.title || addAgendaItem.isPending || updateAgendaItem.isPending} className="rounded-xl bg-gradient-to-r from-primary to-emerald-600">
              {(addAgendaItem.isPending || updateAgendaItem.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingAgendaId ? 'Update' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ DELETE DIALOG ═══ */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Permanently delete <strong>&quot;{event.title}&quot;</strong> including:</p>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>{event.gallery?.length || 0} gallery images</li>
                  <li>{event.agenda?.length || 0} agenda items</li>
                  <li>All view count and metadata</li>
                </ul>
                <div className="space-y-2">
                  <Label className="text-xs">Type <strong>DELETE</strong> to confirm</Label>
                  <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className="h-10 rounded-xl" placeholder="DELETE" />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" onClick={() => setDeleteConfirm('')}>Cancel</AlertDialogCancel>
            <Button variant="destructive" className="rounded-xl" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE' || deleteEvent.isPending}>
              {deleteEvent.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Event
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}