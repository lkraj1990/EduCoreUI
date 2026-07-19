export interface ErrorRegisterSchoolForm {
  schoolName?: string;
  adminName?: string;
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