// services/tenant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { TenantModel, IndustryModel } from '../models/user-signup.model';
import { TenantSignupModel } from '../models/user-signup.model';
import { ApiResponseModel } from '../models/authResponse.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private apiKey = API_CONFIG.apiKey;
  private apiUrl = API_CONFIG.baseUrlUser;

  private headers = new HttpHeaders({
    'X-API-Key': this.apiKey,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getAllTenants(): Observable<ApiResponseModel<TenantModel[]>> {
    return this.http.get<ApiResponseModel<TenantModel[]>>(
      `${this.apiUrl}/GetAllTenantsListAsync`,
      { headers: this.headers }
      
    );
  }

  getIndustriesByTenant(tenantID: number): Observable<ApiResponseModel<IndustryModel[]>> {
    return this.http.get<ApiResponseModel<IndustryModel[]>>(
      `${this.apiUrl}/industries/${tenantID}`,
      { headers: this.headers }
    );
  }

  signupTenant(payload: TenantSignupModel): Observable<ApiResponseModel<any>> {
    return this.http.post<ApiResponseModel<any>>(
      `${this.apiUrl}/signup`,
      payload,
      { headers: this.headers }
    );
  }
}