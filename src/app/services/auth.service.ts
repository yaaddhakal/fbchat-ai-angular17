import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:57466/api/auth';
  private apiKey = 'your_secure_api_key_here_change_in_production_12345';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `${this.baseUrl}/login`,
      { username, password },
      { headers: headers } // ✅ explicitly pass the instance
    );
  }
}
