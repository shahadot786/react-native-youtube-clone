import { useCallback, useState } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isError: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isError: boolean;
}

/**
 * Custom hook for managing API calls with loading and error states
 * @param apiFunction The API function to call
 * @returns State and function to trigger the API call
 */
export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<ApiResponse<T>>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    isError: false,
  });

  const execute = useCallback(
    async (...args: P) => {
      setState({
        data: null,
        loading: true,
        error: null,
        isError: false,
      });

      try {
        const response = await apiFunction(...args);

        if (response.isError) {
          setState({
            data: null,
            loading: false,
            error: response.error,
            isError: true,
          });
        } else {
          setState({
            data: response.data,
            loading: false,
            error: null,
            isError: false,
          });
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          isError: true,
        });
        return {
          data: null,
          error: errorMessage,
          isError: true,
        };
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Example usage:
 *
 * const { data, loading, error, execute } = useApi(fetchTrendingVideos);
 *
 * useEffect(() => {
 *   execute();
 * }, []);
 */
