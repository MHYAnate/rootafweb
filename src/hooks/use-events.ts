'use client';

import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';

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