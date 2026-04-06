'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventsApi } from '@/lib/api/events.api';

// ═══════════════════════════════════════════════════════════
// PUBLIC
// ═══════════════════════════════════════════════════════════

export function useEvents(params?: any) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.getAll(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpcomingEvents(params?: any) {
  return useQuery({
    queryKey: ['upcoming-events', params],
    queryFn: () => eventsApi.getUpcoming(params),
  });
}

export function usePastEvents(params?: any) {
  return useQuery({
    queryKey: ['past-events', params],
    queryFn: () => eventsApi.getPast(params),
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: ['featured-events'],
    queryFn: eventsApi.getFeatured,
  });
}

// ═══════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════

export function useAdminEvents(params?: any) {
  return useQuery({
    queryKey: ['admin-events', params],
    queryFn: () => eventsApi.adminGetAll(params),
  });
}

export function useAdminEvent(id: string) {
  return useQuery({
    queryKey: ['admin-event', id],
    queryFn: () => eventsApi.adminGetById(id),
    enabled: !!id,
  });
}

export function useAdminCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.adminCreate,
    onSuccess: () => {
      toast.success('Event created');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to create event'),
  });
}

export function useAdminUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      eventsApi.adminUpdate(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Event updated');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      qc.invalidateQueries({ queryKey: ['admin-event', id] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update event'),
  });
}

export function useAdminPublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.adminPublish,
    onSuccess: () => {
      toast.success('Event published');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to publish'),
  });
}

export function useAdminUnpublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.adminUnpublish,
    onSuccess: () => {
      toast.success('Event unpublished');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to unpublish'),
  });
}

export function useAdminUpdateEventStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      eventsApi.adminUpdateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update status'),
  });
}

export function useAdminDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.adminDelete,
    onSuccess: () => {
      toast.success('Event deleted');
      qc.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete'),
  });
}

export function useAdminAddGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: any }) =>
      eventsApi.adminAddGalleryImage(eventId, data),
    onSuccess: (_, { eventId }) => {
      toast.success('Image added');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to add image'),
  });
}

export function useAdminUpdateGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      imageId,
      data,
    }: {
      eventId: string;
      imageId: string;
      data: any;
    }) => eventsApi.adminUpdateGalleryImage(eventId, imageId, data),
    onSuccess: (_, { eventId }) => {
      toast.success('Image updated');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update image'),
  });
}

export function useAdminRemoveGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, imageId }: { eventId: string; imageId: string }) =>
      eventsApi.adminRemoveGalleryImage(eventId, imageId),
    onSuccess: (_, { eventId }) => {
      toast.success('Image removed');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove image'),
  });
}

export function useAdminAddAgendaItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: any }) =>
      eventsApi.adminAddAgendaItem(eventId, data),
    onSuccess: (_, { eventId }) => {
      toast.success('Agenda item added');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to add agenda item'),
  });
}

export function useAdminUpdateAgendaItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      itemId,
      data,
    }: {
      eventId: string;
      itemId: string;
      data: any;
    }) => eventsApi.adminUpdateAgendaItem(eventId, itemId, data),
    onSuccess: (_, { eventId }) => {
      toast.success('Agenda item updated');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update agenda item'),
  });
}

export function useAdminRemoveAgendaItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, itemId }: { eventId: string; itemId: string }) =>
      eventsApi.adminRemoveAgendaItem(eventId, itemId),
    onSuccess: (_, { eventId }) => {
      toast.success('Agenda item removed');
      qc.invalidateQueries({ queryKey: ['admin-event', eventId] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove agenda item'),
  });
}