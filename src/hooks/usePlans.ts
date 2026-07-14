import useApiRequest from './useApiRequest';
import { normalizePlanSummary, planService } from '../services';

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  maxStudents: number;
  maxStaff: number;
  isActive: boolean;
}

const usePlans = () => {
  const result = useApiRequest({
    request: planService.listPlans,
    transform: (response: Plan[]) =>
      Array.isArray(response) ? response.map(normalizePlanSummary) : [],
  });

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data : [],
  };
};

export default usePlans;
