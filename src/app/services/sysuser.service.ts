import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserView } from '../models/user-view.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SysUserService {
  private baseUrl = 'https://localhost:7257/api/user';

  constructor(private http: HttpClient) {}

  getUserByIdAsync(id: number): Observable<UserView> {
    return this.http.get<{ success: boolean; data: UserView }>(
    `${this.baseUrl}/GetUserByIdAsync?id=${id}`
  ).pipe(
    map(res => res.data) // ✅ extract the SysUser object
  );

  
  
}


}
