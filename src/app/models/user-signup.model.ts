export interface UserSignupModel {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string; // optional, only used in signup
}
export interface TenantModel {
  tenantID: number;
  tenantName: string;
}

export interface IndustryModel {
  industryID: number;
  industryName: string;
}

export interface TenantSignupModel  {
  tenantID?: number;
  industryID?: number;
  tenantName: string;
  industryName?: string;
  userType: string;
  userName: string;
  email: string;
  passwordHash: string;
}
