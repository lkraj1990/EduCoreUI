import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface UseApiRequestOptions<TResponse, TData = TResponse, TArgs extends unknown[] = unknown[]> {
  request: (...args: TArgs) => Promise<TResponse>;
  immediate?: boolean;
  immediateArgs?: TArgs;
  initialData?: TData | null;
  transform?: (response: TResponse) => TData;
}

interface UseApiRequestResult<TData, TArgs extends unknown[]> {
  data: TData | null;
  loading: boolean;
  error: unknown;
  execute: (...args: TArgs) => Promise<TData>;
  refresh: (...args: TArgs) => Promise<TData>;
  setData: Dispatch<SetStateAction<TData | null>>;
}

const useApiRequest = <TResponse, TData = TResponse, TArgs extends unknown[] = unknown[]>(
  {
    request,
    immediate = true,
    immediateArgs,
    initialData = null,
    transform,
  }: UseApiRequestOptions<TResponse, TData, TArgs>,
): UseApiRequestResult<TData, TArgs> => {
  const [data, setData] = useState<TData | null>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<unknown>(null);

  const execute = async (...args: TArgs): Promise<TData> => {
    setLoading(true);
    setError(null);

    try {
      const response = await request(...args);
      const nextData = transform ? transform(response) : (response as unknown as TData);
      setData(nextData);
      return nextData;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute(...(immediateArgs ?? ([] as unknown as TArgs))).catch(() => null);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refresh: execute,
    setData,
  };
};

export default useApiRequest;
