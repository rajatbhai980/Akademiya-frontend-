import { useCallback, useState } from 'react';

/**
 * Wraps an async API function with loading/error/data state.
 * Usage: const { run, isLoading, error, data } = useApi(gameApi.startGame);
 *        await run(payload);
 */
export function useApi(apiFn) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFn(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn]
  );

  return { run, isLoading, error, data };
}
