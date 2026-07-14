import { useCallback, useEffect, useState } from 'react';
import { normalizeSchoolRecord, schoolService, type SchoolRecord } from '../services/schoolService';

let schoolsCache: SchoolRecord[] | null = null;
let pendingSchoolsRequest: Promise<SchoolRecord[]> | null = null;

const fetchSchools = async (): Promise<SchoolRecord[]> => {
  if (schoolsCache) {
    return schoolsCache;
  }

  if (!pendingSchoolsRequest) {
    pendingSchoolsRequest = schoolService
      .listSchools()
      .then((response: unknown) => {
        if (!Array.isArray(response)) {
          schoolsCache = [];
          return schoolsCache;
        }

        schoolsCache = response
          .map(normalizeSchoolRecord)
          .filter((school) => school.name);

        return schoolsCache;
      })
      .catch(() => {
        schoolsCache = [];
        return schoolsCache;
      })
      .finally(() => {
        pendingSchoolsRequest = null;
      });
  }

  return pendingSchoolsRequest;
};

export const clearSchoolsCache = () => {
  schoolsCache = null;
};

const useSchools = () => {
  const [data, setData] = useState<SchoolRecord[]>(schoolsCache || []);
  const [loading, setLoading] = useState(!schoolsCache);
  const [error, setError] = useState<unknown>(null);

  const loadSchools = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      clearSchoolsCache();
    }

    setLoading(true);
    setError(null);

    try {
      const schools = await fetchSchools();
      setData(Array.isArray(schools) ? schools : []);
      return Array.isArray(schools) ? schools : [];
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (schoolsCache) {
      setData(schoolsCache);
      setLoading(false);
      return;
    }

    loadSchools().catch(() => null);
  }, [loadSchools]);

  return {
    data,
    loading,
    error,
    refresh: () => loadSchools(true),
  };
};

export default useSchools;
