'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionsApi } from '@/lib/api/transactions.api';

export function useMyTransactions(params?: any) {
  return useQuery({
    queryKey: ['my-transactions', params],
    queryFn: () => transactionsApi.getMyTransactions(params),
  });
}

export function useTransactionStats(params?: any) {
  return useQuery({
    queryKey: ['transaction-stats', params],
    queryFn: () => transactionsApi.getStats(params),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      toast.success('Transaction recorded');
      qc.invalidateQueries({ queryKey: ['my-transactions'] });
      qc.invalidateQueries({ queryKey: ['transaction-stats'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to record transaction'),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      toast.success('Transaction removed');
      qc.invalidateQueries({ queryKey: ['my-transactions'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove transaction'),
  });
}