import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { AiVideoTemplateRequest, ProblemDetails } from '@/api';
import { postApiVideosAiTemplate } from '@/api/videos/videos';

const OPERATION_ID_HEADER = 'OperationId';

export type AiTemplateOperationMutationInput = {
  data: AiVideoTemplateRequest;
  operationId: string;
};

export function useAiTemplateOperationMutation() {
  return useMutation<void, AxiosError<ProblemDetails>, AiTemplateOperationMutationInput>({
    mutationFn: async ({ data, operationId }) => {
      await postApiVideosAiTemplate(data, {
        headers: {
          [OPERATION_ID_HEADER]: operationId,
        },
      });
    },
  });
}