import { useMutation } from '@tanstack/react-query';
import { aboutApi } from '@/lib/api/about.api';

export function useAiChat() {
  return useMutation({
    mutationFn: ({ question, context }: { question: string; context?: { userType?: string; state?: string; name?: string } }) =>
      aboutApi.askAi(question, context),
  });
}