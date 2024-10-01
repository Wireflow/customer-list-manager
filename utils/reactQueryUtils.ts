import React from "react";
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

type MutationFunction<TParams, TResult> = (params: TParams) => Promise<TResult>;

interface HookOptions<TResult, TError, TParams> {
  mutationKey: QueryKey;
  mutationFn: MutationFunction<TParams, TResult>;
  invalidateQueries?: QueryKey[];

  onSuccess?: (
    data: TResult,
    variables: TParams,
    context: unknown
  ) => void | Promise<unknown>;
}

export function useCreateMutation<TResult, TError, TParams>(
  hookOptions: HookOptions<TResult, TError, TParams>
) {
  return (
    options?: Omit<UseMutationOptions<TResult, TError, TParams>, "mutationFn">
  ) => {
    const queryClient = useQueryClient();

    const {
      mutationKey,
      mutationFn,
      invalidateQueries,

      onSuccess: hookOnSuccess,
    } = hookOptions;

    return useMutation({
      mutationKey,
      mutationFn,
      onSuccess: async (data, variables, context) => {
        // Call the hook-level onSuccess if provided
        await hookOnSuccess?.(data, variables, context);
        // Call the component-level onSuccess if provided
        await options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        options?.onError?.(error, variables, context);
      },
      onSettled: () => {
        if (invalidateQueries) {
          invalidateQueries.forEach((queryKey) =>
            queryClient.invalidateQueries({ queryKey })
          );
        }
      },
      ...options,
    });
  };
}
