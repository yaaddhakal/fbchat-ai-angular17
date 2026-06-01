import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { UserSignupModel } from '../models/user-signup.model';
import { ApiResponseModel,TokenResponseModel } from '../models/authResponse.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
private apiKey = API_CONFIG.apiKey;
private apiUrl = API_CONFIG.baseUrlAuth;
private headers=new HttpHeaders({
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    });
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<ApiResponseModel<TokenResponseModel>> {
  const payload = { username, password };
  return this.http.post<ApiResponseModel<TokenResponseModel>>(`${this.apiUrl}/login`, payload, { headers: this.headers });
}

// signup(payload: UserSignupModel): Observable<ApiResponseModel<null>> {
//   return this.http.post<ApiResponseModel<null>>(`${this.apiUrl}/signup`, payload, { headers: this.headers });
// }

}