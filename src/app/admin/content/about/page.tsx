'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';
import {
  useUpdateAboutContent,
  useAdminCreateObjective,
  useAdminUpdateObjective,
  useAdminDeleteObjective,
  useAdminUpdateContact,
  useAdminUpdateSocial,
} from '@/hooks/use-admin';

import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Target,
  Phone,
  Share2,
  Loader2,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';

const PUBLIC_SECTIONS = [
  { key: 'MISSION_STATEMENT', title: 'Mission Statement', description: 'Displayed in the mission section of the public About page' },
  { key: 'VISION_STATEMENT', title: 'Vision Statement', description: 'Displayed in the vision section of the public About page' },
  { key: 'OVERVIEW', title: 'About ROOTAF Foundation', description: 'Main overview text on the public About page' },
  { key: 'CORE_VALUES', title: 'Core Values', description: 'List of core values displayed publicly' },
];

export default function AdminAboutContentPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: aboutApi.getAll,
  });

  const d = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
            <LoadingSpinner size="lg" className="relative" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/40 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <PageHeader
            title="About Page Content"
            description="Manage all content displayed on the public About page"
            badge="Content Management"
          />
        </div>
      </div>

      {/* Premium Tabs */}
      <Tabs defaultValue="content" className="space-y-6 sm:space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl sm:rounded-3xl blur-xl" />
          <TabsList className="relative grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 rounded-xl sm:rounded-2xl bg-muted/50 backdrop-blur-sm p-1.5 sm:p-2 h-auto border border-border/30 shadow-sm">
            <TabsTrigger 
              value="content" 
              className="rounded-lg sm:rounded-xl py-2.5 sm:py-3 lg:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 data-[state=active]:border data-[state=active]:border-border/50 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger 
              value="objectives" 
              className="rounded-lg sm:rounded-xl py-2.5 sm:py-3 lg:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 data-[state=active]:border data-[state=active]:border-border/50 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Objectives</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="rounded-lg sm:rounded-xl py-2.5 sm:py-3 lg:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 data-[state=active]:border data-[state=active]:border-border/50 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="rounded-lg sm:rounded-xl py-2.5 sm:py-3 lg:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 data-[state=active]:border data-[state=active]:border-border/50 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="mt-0">
          <ContentTab content={d?.content || []} />
        </TabsContent>
        <TabsContent value="objectives" className="mt-0">
          <ObjectivesTab objectives={d?.objectives || []} />
        </TabsContent>
        <TabsContent value="contact" className="mt-0">
          <ContactTab contact={d?.contact || []} />
        </TabsContent>
        <TabsContent value="social" className="mt-0">
          <SocialTab social={d?.social || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONTENT TAB — Mission, Vision, Overview, Core Values
// ─────────────────────────────────────────────────────────────────────────────
function ContentTab({ content }: { content: any[] }) {
  const updateContent = useUpdateAboutContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const contentMap = content.reduce((acc: any, item: any) => {
    acc[item.sectionKey] = item;
    return acc;
  }, {});

  const startEdit = (key: string) => {
    const existing = contentMap[key] || {};
    setEditingKey(key);
    setForm({
      title: existing.title || '',
      subtitle: existing.subtitle || '',
      content: existing.content || '',
      imageUrl: existing.imageUrl || '',
      videoUrl: existing.videoUrl || '',
      displayOrder: existing.displayOrder ?? PUBLIC_SECTIONS.findIndex((s) => s.key === key) + 1,
      isVisible: existing.isVisible !== undefined ? existing.isVisible : true,
    });
  };

  const handleSave = () => {
    if (!editingKey) return;
    updateContent.mutate(
      { key: editingKey, data: form },
      { onSuccess: () => setEditingKey(null) },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Content Sections</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              These 4 sections are rendered on the public About page. Edit each one to control what visitors see.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border/30 self-start sm:self-auto">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{content.filter((c: any) => c.isVisible).length} Active</span>
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid gap-4 sm:gap-5 lg:gap-6">
        {PUBLIC_SECTIONS.map((section, index) => {
          const existing = contentMap[section.key];
          const isEditing = editingKey === section.key;

          return (
            <Card 
              key={section.key} 
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 transition-colors duration-300 ${
                existing?.isVisible ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' : 
                existing ? 'bg-gradient-to-b from-amber-400 to-amber-500' : 
                'bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10'
              }`} />

              <CardHeader className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 pl-4 sm:pl-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                        {index + 1}
                      </span>
                      <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold tracking-tight">
                        {section.title}
                      </CardTitle>
                    </div>
                    {existing && existing.isVisible ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200/80 shadow-sm">
                        <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span className="hidden sm:inline">Live</span>
                      </span>
                    ) : existing && !existing.isVisible ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-amber-700 bg-amber-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-200/80 shadow-sm">
                        <EyeOff className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span className="hidden sm:inline">Hidden</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-border/50">
                        <span className="hidden sm:inline">Empty</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 leading-relaxed">{section.description}</p>
                </div>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg sm:rounded-xl shrink-0 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200 self-start sm:self-auto" 
                    onClick={() => startEdit(section.key)}
                  >
                    <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                    {existing ? 'Edit' : 'Add Content'}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="relative pl-4 sm:pl-6">
                {isEditing ? (
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-foreground">Title</Label>
                        <Input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className="rounded-lg sm:rounded-xl h-10 sm:h-11 lg:h-12 text-sm bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="Section title shown publicly"
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-foreground">Subtitle</Label>
                        <Input
                          value={form.subtitle}
                          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                          className="rounded-lg sm:rounded-xl h-10 sm:h-11 lg:h-12 text-sm bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="Optional subtitle"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-foreground">
                        Content <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="rounded-lg sm:rounded-xl min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] text-sm font-mono bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-y"
                        placeholder="Section content — this is what appears on the public page..."
                      />
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                        Supports plain text. Use • for bullet points. Markdown bold (**text**) works if the public page renders it.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-foreground">Image URL</Label>
                        <Input
                          value={form.imageUrl}
                          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                          className="rounded-lg sm:rounded-xl h-10 sm:h-11 lg:h-12 text-sm bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="https://res.cloudinary.com/..."
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-foreground">Video URL</Label>
                        <Input
                          value={form.videoUrl}
                          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                          className="rounded-lg sm:rounded-xl h-10 sm:h-11 lg:h-12 text-sm bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-5 border-t border-border/50">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <Label className="text-xs sm:text-sm font-medium">Order</Label>
                          <Input
                            type="number"
                            value={form.displayOrder}
                            onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                            className="rounded-lg sm:rounded-xl h-8 sm:h-9 w-16 sm:w-20 text-center text-sm bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <Switch
                            checked={form.isVisible}
                            onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                          <Label className="text-xs sm:text-sm font-medium">
                            {form.isVisible ? 'Visible on public page' : 'Hidden from public'}
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none rounded-lg sm:rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-border/50 hover:bg-muted/50"
                          onClick={() => setEditingKey(null)}
                        >
                          <X className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={!form.content || updateContent.isPending}
                          className="flex-1 sm:flex-none rounded-lg sm:rounded-xl h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                          size="sm"
                        >
                          {updateContent.isPending ? (
                            <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Save className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {existing?.title && (
                      <h4 className="font-semibold text-sm sm:text-base text-foreground">{existing.title}</h4>
                    )}
                    {existing?.subtitle && (
                      <p className="text-xs sm:text-sm text-muted-foreground italic">{existing.subtitle}</p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line line-clamp-4 leading-relaxed">
                      {existing?.content || (
                        <span className="italic text-amber-600/80">No content yet — click Edit to add.</span>
                      )}
                    </p>
                    {(existing?.imageUrl || existing?.videoUrl) && (
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                        {existing.imageUrl && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium bg-blue-50 text-blue-700 px-2 sm:px-2.5 py-1 rounded-full border border-blue-200/80">
                            <span>Has Image</span>
                          </span>
                        )}
                        {existing.videoUrl && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium bg-purple-50 text-purple-700 px-2 sm:px-2.5 py-1 rounded-full border border-purple-200/80">
                            <span>Has Video</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. OBJECTIVES TAB
// ─────────────────────────────────────────────────────────────────────────────
function ObjectivesTab({ objectives }: { objectives: any[] }) {
  const createMut = useAdminCreateObjective();
  const updateMut = useAdminUpdateObjective();
  const deleteMut = useAdminDeleteObjective();
  const [editing, setEditing] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openNew = () => {
    setEditing({
      objectiveNumber: objectives.length + 1,
      title: '',
      description: '',
      shortDescription: '',
      iconName: '',
      iconUrl: '',
      displayOrder: objectives.length + 1,
      isDisplayed: true,
    });
    setIsOpen(true);
  };

  const openEdit = (o: any) => {
    setEditing({ ...o });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!editing) return;
    const action = editing.id
      ? updateMut.mutateAsync({ id: editing.id, data: editing })
      : createMut.mutateAsync(editing);

    action.then(() => {
      setIsOpen(false);
      setEditing(null);
    });
  };

  const sorted = [...objectives].sort((a, b) => a.objectiveNumber - b.objectiveNumber);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Organization Objectives</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              {sorted.length} objectives displayed on the public About page
            </p>
          </div>
        </div>
        <Button 
          onClick={openNew} 
          className="rounded-lg sm:rounded-xl h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 self-start sm:self-auto" 
          size="sm"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> 
          Add Objective
        </Button>
      </div>

      {/* Objectives Grid */}
      <div className="grid gap-3 sm:gap-4">
        {sorted.map((o: any, index: number) => (
          <Card 
            key={o.id} 
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="relative p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 blur-lg bg-primary/20 rounded-xl sm:rounded-2xl" />
                  <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary font-bold text-sm sm:text-base lg:text-lg">
                    {o.objectiveNumber}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-sm sm:text-base text-foreground leading-tight">{o.title}</h4>
                    {o.isDisplayed ? (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/80">
                        <Eye className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        <span className="hidden sm:inline">Visible</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-200/80">
                        <EyeOff className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        <span className="hidden sm:inline">Hidden</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{o.description}</p>
                  {o.shortDescription && (
                    <p className="text-[10px] sm:text-xs text-primary/70 italic mt-1">Short: {o.shortDescription}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200" 
                    onClick={() => openEdit(o)}
                  >
                    <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 border-border/50 text-destructive/70 hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-200"
                    onClick={() => deleteMut.mutate(o.id)}
                  >
                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sorted.length === 0 && (
          <Card className="rounded-xl sm:rounded-2xl border-border/40 border-dashed">
            <CardContent className="py-10 sm:py-16 text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
                <Target className="relative h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">No objectives yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">Click the button above to add your first objective</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border-border/50 bg-gradient-to-br from-background to-muted/20 p-4 sm:p-6">
          <DialogHeader className="pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              {editing?.id ? 'Edit' : 'Add'} Objective
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Objective Number <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    value={editing.objectiveNumber}
                    onChange={(e) => setEditing({ ...editing, objectiveNumber: parseInt(e.target.value) || 0 })}
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Display Order</Label>
                  <Input
                    type="number"
                    value={editing.displayOrder}
                    onChange={(e) => setEditing({ ...editing, displayOrder: parseInt(e.target.value) || 0 })}
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Title <span className="text-destructive">*</span></Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                  placeholder="e.g. To mobilize and unify farmers and artisans..."
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Description <span className="text-destructive">*</span></Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="rounded-lg sm:rounded-xl min-h-[80px] sm:min-h-[100px] text-sm bg-background/50 border-border/50 resize-y"
                  placeholder="Full description shown on the public page..."
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Short Description</Label>
                <Input
                  value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                  placeholder="Brief version for cards/summaries"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Icon Name</Label>
                  <Input
                    value={editing.iconName || ''}
                    onChange={(e) => setEditing({ ...editing, iconName: e.target.value })}
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                    placeholder="e.g. users, heart"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Icon URL</Label>
                  <Input
                    value={editing.iconUrl || ''}
                    onChange={(e) => setEditing({ ...editing, iconUrl: e.target.value })}
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-lg sm:rounded-xl bg-muted/30 border border-border/30">
                <Switch
                  checked={editing.isDisplayed}
                  onCheckedChange={(v) => setEditing({ ...editing, isDisplayed: v })}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <Label className="text-xs sm:text-sm font-medium">Visible on public page</Label>
              </div>

              <Button
                onClick={handleSave}
                disabled={!editing.title || !editing.description || createMut.isPending || updateMut.isPending}
                className="w-full rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm font-medium bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              >
                {createMut.isPending || updateMut.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editing.id ? 'Update Objective' : 'Create Objective'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONTACT TAB
// ─────────────────────────────────────────────────────────────────────────────
function ContactTab({ contact }: { contact: any[] }) {
  const updateMut = useAdminUpdateContact();
  const [editing, setEditing] = useState<any | null>(null);

  const primaryContact = contact.find((c: any) => c.isPrimary) || contact[0];

  if (!primaryContact) {
    return (
      <Card className="rounded-xl sm:rounded-2xl border-border/40 border-dashed">
        <CardContent className="py-10 sm:py-16 text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
            <Phone className="relative h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">No contact information found</p>
          <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">Contact details will appear here once configured</p>
        </CardContent>
      </Card>
    );
  }

  const startEdit = () => {
    setEditing({
      label: primaryContact.label || '',
      address: primaryContact.address || '',
      landmark: primaryContact.landmark || '',
      city: primaryContact.city || '',
      localGovernmentArea: primaryContact.localGovernmentArea || '',
      state: primaryContact.state || '',
      country: primaryContact.country || 'Nigeria',
      postalCode: primaryContact.postalCode || '',
      phoneNumber1: primaryContact.phoneNumber1 || '',
      phoneNumber2: primaryContact.phoneNumber2 || '',
      phoneNumber3: primaryContact.phoneNumber3 || '',
      whatsappNumber: primaryContact.whatsappNumber || '',
      email: primaryContact.email || '',
      alternateEmail: primaryContact.alternateEmail || '',
      website: primaryContact.website || '',
      officeHours: primaryContact.officeHours || '',
      isPrimary: primaryContact.isPrimary ?? true,
      isActive: primaryContact.isActive ?? true,
    });
  };

  const handleSave = () => {
    if (!editing) return;
    updateMut.mutate(
      { id: primaryContact.id, data: editing },
      { onSuccess: () => setEditing(null) },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Contact Information</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              Primary contact details displayed on the public About page
            </p>
          </div>
        </div>
      </div>

      <Card className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-emerald-500 to-emerald-600" />
        
        <CardHeader className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 pl-4 sm:pl-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold">
              {primaryContact.label || 'Headquarters Contact'}
            </CardTitle>
            {primaryContact.isPrimary && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200/80 shadow-sm">
                Primary
              </span>
            )}
          </div>
          {!editing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg sm:rounded-xl h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200 self-start sm:self-auto" 
              onClick={startEdit}
            >
              <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" /> Edit
            </Button>
          )}
        </CardHeader>

        <CardContent className="relative pl-4 sm:pl-6">
          {editing ? (
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Label</Label>
                <Input 
                  value={editing.label} 
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })} 
                  className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Address</Label>
                <Textarea 
                  value={editing.address} 
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })} 
                  className="rounded-lg sm:rounded-xl min-h-[60px] sm:min-h-[70px] text-sm bg-background/50 border-border/50 resize-y" 
                  rows={2} 
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Landmark</Label>
                <Input 
                  value={editing.landmark} 
                  onChange={(e) => setEditing({ ...editing, landmark: e.target.value })} 
                  className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">City</Label>
                  <Input 
                    value={editing.city} 
                    onChange={(e) => setEditing({ ...editing, city: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">LGA</Label>
                  <Input 
                    value={editing.localGovernmentArea} 
                    onChange={(e) => setEditing({ ...editing, localGovernmentArea: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">State</Label>
                  <Input 
                    value={editing.state} 
                    onChange={(e) => setEditing({ ...editing, state: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Country</Label>
                  <Input 
                    value={editing.country} 
                    onChange={(e) => setEditing({ ...editing, country: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Postal Code</Label>
                  <Input 
                    value={editing.postalCode} 
                    onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/20 border border-border/30">
                <Label className="text-xs sm:text-sm font-medium text-foreground">Phone Numbers</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label className="text-[10px] sm:text-xs text-muted-foreground">Primary</Label>
                    <Input 
                      value={editing.phoneNumber1} 
                      onChange={(e) => setEditing({ ...editing, phoneNumber1: e.target.value })} 
                      className="rounded-lg sm:rounded-xl h-9 sm:h-10 text-sm bg-background/50 border-border/50" 
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label className="text-[10px] sm:text-xs text-muted-foreground">Secondary</Label>
                    <Input 
                      value={editing.phoneNumber2} 
                      onChange={(e) => setEditing({ ...editing, phoneNumber2: e.target.value })} 
                      className="rounded-lg sm:rounded-xl h-9 sm:h-10 text-sm bg-background/50 border-border/50" 
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label className="text-[10px] sm:text-xs text-muted-foreground">Tertiary</Label>
                    <Input 
                      value={editing.phoneNumber3} 
                      onChange={(e) => setEditing({ ...editing, phoneNumber3: e.target.value })} 
                      className="rounded-lg sm:rounded-xl h-9 sm:h-10 text-sm bg-background/50 border-border/50" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-medium">WhatsApp Number</Label>
                <Input 
                  value={editing.whatsappNumber} 
                  onChange={(e) => setEditing({ ...editing, whatsappNumber: e.target.value })} 
                  className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Email</Label>
                  <Input 
                    value={editing.email} 
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Alternate Email</Label>
                  <Input 
                    value={editing.alternateEmail} 
                    onChange={(e) => setEditing({ ...editing, alternateEmail: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Website</Label>
                  <Input 
                    value={editing.website} 
                    onChange={(e) => setEditing({ ...editing, website: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Office Hours</Label>
                  <Input 
                    value={editing.officeHours} 
                    onChange={(e) => setEditing({ ...editing, officeHours: e.target.value })} 
                    className="rounded-lg sm:rounded-xl h-10 sm:h-11 text-sm bg-background/50 border-border/50" 
                    placeholder="Mon-Fri: 8am - 5pm" 
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Switch 
                    checked={editing.isPrimary} 
                    onCheckedChange={(v) => setEditing({ ...editing, isPrimary: v })}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Label className="text-xs sm:text-sm font-medium">Primary contact</Label>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Switch 
                    checked={editing.isActive} 
                    onCheckedChange={(v) => setEditing({ ...editing, isActive: v })}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Label className="text-xs sm:text-sm font-medium">Active</Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none rounded-lg sm:rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-border/50 hover:bg-muted/50 order-2 sm:order-1"
                  onClick={() => setEditing(null)}
                >
                  <X className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMut.isPending}
                  className="flex-1 sm:flex-none rounded-lg sm:rounded-xl h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 order-1 sm:order-2"
                  size="sm"
                >
                  {updateMut.isPending ? <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-3">
              {[
                { label: 'Address', value: primaryContact.address },
                { label: 'City', value: primaryContact.city },
                { label: 'LGA', value: primaryContact.localGovernmentArea },
                { label: 'State', value: primaryContact.state },
                { label: 'Phone', value: primaryContact.phoneNumber1 },
                { label: 'Email', value: primaryContact.email },
                ...(primaryContact.alternateEmail ? [{ label: 'Alt Email', value: primaryContact.alternateEmail }] : []),
                ...(primaryContact.whatsappNumber ? [{ label: 'WhatsApp', value: primaryContact.whatsappNumber }] : []),
                ...(primaryContact.website ? [{ label: 'Website', value: primaryContact.website }] : []),
                ...(primaryContact.officeHours ? [{ label: 'Hours', value: primaryContact.officeHours }] : []),
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 py-1.5 sm:py-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0 min-w-[70px] sm:min-w-[80px]">{item.label}:</span>
                  <span className="text-xs sm:text-sm text-foreground break-all">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SOCIAL TAB
// ─────────────────────────────────────────────────────────────────────────────
function SocialTab({ social }: { social: any[] }) {
  const updateMut = useAdminUpdateSocial();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setUrl(s.url);
  };

  const handleSave = (id: string) => {
    updateMut.mutate(
      { id, data: { url } },
      { onSuccess: () => setEditingId(null) },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Social Media Links</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
              Social media links displayed on the public About page footer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-border/30 self-start sm:self-auto">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
          <span>{social.length} Platforms</span>
        </div>
      </div>

      {/* Social Cards Grid */}
      <div className="grid gap-3 sm:gap-4">
        {social.map((s: any) => (
          <Card 
            key={s.id} 
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border-border/40 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="relative p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Platform Icon */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 blur-lg bg-primary/15 rounded-xl" />
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">{s.platformName}</h4>
                  {editingId === s.id ? (
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="rounded-lg sm:rounded-xl h-8 sm:h-9 text-xs sm:text-sm bg-background/50 border-border/50 mt-1.5 sm:mt-2"
                      placeholder={`https://${s.platform}.com/...`}
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{s.url}</p>
                  )}
                </div>

                {/* Actions */}
                {editingId === s.id ? (
                  <div className="flex gap-1.5 sm:gap-2 shrink-0">
                    <Button
                      size="icon"
                      className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                      onClick={() => handleSave(s.id)}
                      disabled={updateMut.isPending}
                    >
                      {updateMut.isPending ? (
                        <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 border-border/50"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 shrink-0 border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
                    onClick={() => startEdit(s)}
                  >
                    <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {social.length === 0 && (
          <Card className="rounded-xl sm:rounded-2xl border-border/40 border-dashed">
            <CardContent className="py-10 sm:py-16 text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 blur-xl bg-primary/10 rounded-full" />
                <Share2 className="relative h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">No social links yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">Social media links will appear here once configured</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
