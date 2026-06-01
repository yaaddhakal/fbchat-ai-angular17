import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel,IndustryModel,SignupTenantRequestDto, UserSignupModel } from '../models/user-signup.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })

export class UserService {
private apiKey = API_CONFIG.apiKey;
private apiUrl = API_CONFIG.baseUrlUser;

private headers=new HttpHeaders({
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    });
  constructor(private http: HttpClient) {}
getAllTenants(): Observable<TenantModel[]> {
    return this.http.get<TenantModel[]>(`${this.apiUrl}/GetAllTenantsListAsync`);
  }

  getIndustriesByTenant(tenantID: number): Observable<IndustryModel[]> {
    return this.http.get<IndustryModel[]>(`${this.apiUrl}/industries/${tenantID}`);
  }

  signupTenant(request: SignupTenantRequestDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, request, { headers: this.headers });
  }
  // Signup (create new user)
  // signup(user: UserSignupModel): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/signup`, user);
  // }

  // // Other user operations
  // getUsers(): Observable<any> {
  //   return this.http.get(this.apiUrl);
  // }

  // getUserById(id: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`);
  // }

  // updateUser(id: number, user: Partial<UserSignupModel>): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, user);
  // }

  // deleteUser(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
