export interface TokenResponseModel {
  token: string;
  refreshToken: string;
  userId: number;
  username: string;
  userType: string;
  roleName: string;
  expiresIn: number;
  tokenType: string;
  issuedAt: string; // DateTime comes as ISO string
}

export interface ApiResponseModel<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
