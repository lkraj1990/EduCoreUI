export interface ErrorRegisterSchoolForm {
  schoolName?: string;
  mobileNumber?: string;
  adminEmail?: string;
  tenantId?: string;
  schoolAddress?: string;
  customDomain?: string;
  plan?: string;
}

export interface SchoolRecord {
  id: string;
  name: string;
  domain: string;
}