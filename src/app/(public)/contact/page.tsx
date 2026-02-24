'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/api/settings.api';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const { data: contactData } = useQuery({
    queryKey: ['contact-info'],
    queryFn: settingsApi.getContactInfo,
  });

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const { mutate, isPending } = useMutation({
    mutationFn: settingsApi.submitContactForm,
    onSuccess: () => {
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send message'),
  });

  const contact = contactData?.data;

  return (
    <div className="container-custom py-10">
      <PageHeader title="Contact Us" description="Get in touch with us" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="card-premium">
            <CardHeader><CardTitle>Send us a Message</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); mutate(form); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input className="h-11 rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" className="h-11 rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input className="h-11 rounded-lg" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Input className="h-11 rounded-lg" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea className="rounded-lg min-h-[150px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" className="btn-premium rounded-xl gap-2" disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="card-gold">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><MapPin className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium">Address</p><p className="text-muted-foreground">{contact?.address || 'Kaduna, Nigeria'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Phone className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium">Phone</p><p className="text-muted-foreground">{contact?.phoneNumber1 || '+234 800 000 0000'}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Mail className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium">Email</p><p className="text-muted-foreground">{contact?.email || 'info@upliftingroot.org'}</p></div>
                </div>
                {contact?.officeHours && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-primary" /></div>
                    <div><p className="font-medium">Office Hours</p><p className="text-muted-foreground">{contact.officeHours}</p></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}