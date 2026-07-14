import { useCallback, useEffect, useState } from 'react';
import { normalizePlanSummary, planService } from '../services';
import { SubscriptionPlan } from './common/Plans';

const normalizeSubscriptionPlan = (record: any): SubscriptionPlan => {
  const nestedPlan = record?.plan || {};

  return {
    id: record?.planId || nestedPlan?.id || record?.id || '',
    name: record?.planName || nestedPlan?.name || record?.name || 'Unnamed Plan',
    price: Number(record?.price ?? nestedPlan?.price ?? 0),
    billingCycle: record?.billingCycle || nestedPlan?.billingCycle || 'monthly',
    maxStudents: Number(record?.maxStudents ?? nestedPlan?.maxStudents ?? 0),
    maxStaff: Number(record?.maxStaff ?? nestedPlan?.maxStaff ?? 0),
    isActive: record?.isActive ?? nestedPlan?.isActive ?? true,
  };
};

let plansCache: SubscriptionPlan[] | null = null;
let pendingPlansRequest: Promise<SubscriptionPlan[]> | null = null;

const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  if (plansCache) {
    return plansCache;
  }

  if (!pendingPlansRequest) {
    pendingPlansRequest = planService
      .listPlans()
      .then((response: unknown) => {
        if (!Array.isArray(response)) {
          plansCache = [];
          return plansCache;
        }

        const uniquePlans = new Map<string, SubscriptionPlan>();

        response.forEach((record: any) => {
          const normalizedPlan = normalizeSubscriptionPlan(record);
          const key = normalizedPlan.id || normalizedPlan.name;

          if (key && !uniquePlans.has(key)) {
            uniquePlans.set(key, normalizedPlan);
          }
        });

        plansCache = Array.from(uniquePlans.values()).map(normalizePlanSummary);
        return plansCache;
      })
      .finally(() => {
        pendingPlansRequest = null;
      });
  }

  return pendingPlansRequest;
};

export const clearSubscriptionPlansCache = () => {
  plansCache = null;
};

const useSubscriptionPlans = () => {
  const [data, setData] = useState<SubscriptionPlan[]>(plansCache || []);
  const [loading, setLoading] = useState(!plansCache);
  const [error, setError] = useState<unknown>(null);

  const loadPlans = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      clearSubscriptionPlansCache();
    }

    setLoading(true);
    setError(null);

    try {
      const plans = await fetchSubscriptionPlans();
      setData(Array.isArray(plans) ? plans : []);
      return Array.isArray(plans) ? plans : [];
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plansCache) {
      setData(plansCache);
      setLoading(false);
      return;
    }

    loadPlans().catch(() => null);
  }, [loadPlans]);

  return {
    data: Array.isArray(data) ? data : [],
    loading,
    error,
    refresh: () => loadPlans(true),
    execute: () => loadPlans(),
  };
};

export default useSubscriptionPlans;
