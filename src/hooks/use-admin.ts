'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api/admin.api';
import { useAdminAuthStore } from '@/store/admin-auth-store';

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// ═══════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════

export function useAdminActivityLog(params?: any) {
  return useQuery({
    queryKey: ['admin-activity-log', params],
    queryFn: () => adminApi.getActivityLog(params),
  });
}

// ═══════════════════════════════════════════════════════════
// VERIFICATIONS
// ═══════════════════════════════════════════════════════════

export function usePendingVerifications(params?: any) {
  return useQuery({
    queryKey: ['admin-pending-verifications', params],
    queryFn: () => adminApi.getPendingVerifications(params),
  });
}

export function useVerificationDetail(userId: string) {
  return useQuery({
    queryKey: ['admin-verification-detail', userId],
    queryFn: () => adminApi.getVerificationDetail(userId),
    enabled: !!userId,
  });
}

export function useVerificationStats() {
  return useQuery({
    queryKey: ['admin-verification-stats'],
    queryFn: adminApi.getVerificationStats,
  });
}

export function useStartReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.startReview(userId),
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ['admin-verification-detail', userId] });
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to start review'),
  });
}

export function useApproveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes?: string }) =>
      adminApi.approveUser(userId, notes),
    onSuccess: () => {
      toast.success('User approved successfully');
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      qc.invalidateQueries({ queryKey: ['admin-verification-stats'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to approve'),
  });
}

export function useRejectUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason, details }: { userId: string; reason: string; details: string }) =>
      adminApi.rejectUser(userId, { reason, details }),
    onSuccess: () => {
      toast.success('User rejected');
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to reject'),
  });
}

export function useRequestResubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason, documentIds }: { userId: string; reason: string; documentIds?: string[] }) =>
      adminApi.requestResubmission(userId, { reason, documentIds }),
    onSuccess: () => {
      toast.success('Resubmission requested');
      qc.invalidateQueries({ queryKey: ['admin-pending-verifications'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminApi.suspendUser(userId, reason),
    onSuccess: () => {
      toast.success('User suspended');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useReactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.reactivateUser(userId),
    onSuccess: () => {
      toast.success('User reactivated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      adminApi.resetUserPassword(userId, newPassword),
    onSuccess: () => toast.success('Password reset successfully'),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════

export function useAdminUsers(params?: any) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getUsers(params),
  });
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  });
}

// ═══════════════════════════════════════════════════════════
// PASSWORD RESETS
// ═══════════════════════════════════════════════════════════

export function usePendingPasswordResets(params?: any) {
  return useQuery({
    queryKey: ['admin-password-resets', params],
    queryFn: () => adminApi.getPendingResets(params),
  });
}

export function useProcessPasswordReset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, temporaryPassword, notes }: { id: string; temporaryPassword: string; notes?: string }) =>
      adminApi.processReset(id, { temporaryPassword, notes }),
    onSuccess: () => {
      toast.success('Password reset processed');
      qc.invalidateQueries({ queryKey: ['admin-password-resets'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// LISTINGS MANAGEMENT
// ═══════════════════════════════════════════════════════════

export function useToggleListingFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) =>
      adminApi.toggleListingFeatured(type, id),
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useDeactivateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id, reason }: { type: string; id: string; reason: string }) =>
      adminApi.deactivateListing(type, id, reason),
    onSuccess: () => {
      toast.success('Listing deactivated');
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useToggleMemberFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.toggleMemberFeatured(id),
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// RATINGS MODERATION
// ═══════════════════════════════════════════════════════════

export function useReportedRatings(params?: any) {
  return useQuery({
    queryKey: ['admin-reported-ratings', params],
    queryFn: () => adminApi.getReportedRatings(params),
  });
}

export function useModerateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      adminApi.moderateRating(id, { action, notes }),
    onSuccess: () => {
      toast.success('Rating moderated');
      qc.invalidateQueries({ queryKey: ['admin-reported-ratings'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// CONTENT REPORTS
// ═══════════════════════════════════════════════════════════

export function useContentReports(params?: any) {
  return useQuery({
    queryKey: ['admin-content-reports', params],
    queryFn: () => adminApi.getContentReports(params),
  });
}

export function useResolveContentReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution, notes, actionTaken }: {
      id: string; resolution: string; notes: string; actionTaken: string;
    }) => adminApi.resolveContentReport(id, { resolution, notes, actionTaken }),
    onSuccess: () => {
      toast.success('Report resolved');
      qc.invalidateQueries({ queryKey: ['admin-content-reports'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════

export function useAdminCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      toast.success('Category created');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminToggleCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.toggleCategory(id),
    onSuccess: () => {
      toast.success('Category status toggled');
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// CONTENT MANAGEMENT
// ═══════════════════════════════════════════════════════════

export function useUpdateAboutContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: any }) =>
      adminApi.updateAboutContent(key, data),
    onSuccess: () => {
      toast.success('Content updated');
      qc.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// Leadership
export function useAdminCreateLeadership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createLeadership,
    onSuccess: () => {
      toast.success('Leadership profile created');
      qc.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateLeadership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateLeadership(id, data),
    onSuccess: () => {
      toast.success('Leadership profile updated');
      qc.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminDeleteLeadership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteLeadership,
    onSuccess: () => {
      toast.success('Leadership profile deleted');
      qc.invalidateQueries({ queryKey: ['about'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// Sponsors
export function useAdminCreateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createSponsor,
    onSuccess: () => {
      toast.success('Sponsor created');
      qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateSponsor(id, data),
    onSuccess: () => {
      toast.success('Sponsor updated');
      qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminDeleteSponsor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteSponsor,
    onSuccess: () => {
      toast.success('Sponsor deleted');
      qc.invalidateQueries({ queryKey: ['sponsors'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// Testimonials
export function useAdminCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createTestimonial,
    onSuccess: () => {
      toast.success('Testimonial created');
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminApproveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.approveTestimonial,
    onSuccess: () => {
      toast.success('Testimonial approved');
      qc.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// Events
export function useAdminCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createEvent,
    onSuccess: () => {
      toast.success('Event created');
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateEvent(id, data),
    onSuccess: () => {
      toast.success('Event updated');
      qc.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminPublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.publishEvent,
    onSuccess: () => {
      toast.success('Event published');
      qc.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════

export function useAdminAnnouncements(params?: any) {
  return useQuery({
    queryKey: ['admin-announcements', params],
    queryFn: () => adminApi.getAnnouncements(params),
  });
}

export function useAdminCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createAnnouncement,
    onSuccess: () => {
      toast.success('Announcement created');
      qc.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateAnnouncement(id, data),
    onSuccess: () => {
      toast.success('Announcement updated');
      qc.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteAnnouncement,
    onSuccess: () => {
      toast.success('Announcement deleted');
      qc.invalidateQueries({ queryKey: ['admin-announcements'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// FAQs
// ═══════════════════════════════════════════════════════════

export function useAdminFaqs() {
  return useQuery({
    queryKey: ['admin-faqs'],
    queryFn: adminApi.getFaqs,
  });
}

export function useAdminCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createFaq,
    onSuccess: () => {
      toast.success('FAQ created');
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateFaq(id, data),
    onSuccess: () => {
      toast.success('FAQ updated');
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteFaq,
    onSuccess: () => {
      toast.success('FAQ deleted');
      qc.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// ADMIN USER MANAGEMENT
// ═══════════════════════════════════════════════════════════

export function useAllAdmins() {
  return useQuery({
    queryKey: ['admin-all-admins'],
    queryFn: adminApi.getAllAdmins,
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: adminApi.getProfile,
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createAdmin,
    onSuccess: () => {
      toast.success('Admin created successfully');
      qc.invalidateQueries({ queryKey: ['admin-all-admins'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create admin'),
  });
}

export function useToggleAdminStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.toggleAdminStatus,
    onSuccess: (data) => {
      toast.success(data.message);
      qc.invalidateQueries({ queryKey: ['admin-all-admins'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

export function useAdminChangePassword() {
  return useMutation({
    mutationFn: adminApi.changePassword,
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to change password'),
  });
}

// ═══════════════════════════════════════════════════════════
// DATA EXPORT
// ═══════════════════════════════════════════════════════════

export function useExportUsers() {
  return useMutation({
    mutationFn: (params?: any) => adminApi.exportUsers(params),
    onSuccess: (data) => {
      toast.success(`Exported ${data.data?.length || 0} users`);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Export failed'),
  });
}

export function useExportTransactions() {
  return useMutation({
    mutationFn: (params?: any) => adminApi.exportTransactions(params),
    onSuccess: (data) => {
      toast.success(`Exported ${data.data?.length || 0} transactions`);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Export failed'),
  });
}

// ═══════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminApi.updateSetting(key, value),
    onSuccess: () => {
      toast.success('Setting updated');
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}