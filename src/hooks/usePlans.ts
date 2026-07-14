import useApiRequest from './useApiRequest';
import { normalizePlanSummary, planService } from '../services';
import { Plan } from './common/Plans';



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
