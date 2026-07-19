export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  maxStudents: number;
  maxStaff: number;
  isActive: boolean;
}
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  maxStudents?: number;
  maxStaff?: number;
  isActive?: boolean;
}
