import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    const apiKey = 'YOUR_FIXED_API_KEY';

    let headers = req.headers;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    headers = headers.set('X-API-Key', apiKey);

    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If token expired (401 Unauthorized)
        if (error.status === 401 && localStorage.getItem('refreshToken')) {
          const refreshToken = localStorage.getItem('refreshToken');
          // Call refresh endpoint
          return this.http.post<any>('/api/auth/refresh', { refreshToken }, { headers: { 'X-API-Key': apiKey } })
            .pipe(
              switchMap((res) => {
                // Save new token
                localStorage.setItem('authToken', res.token);
                // Retry original request with new token
                const newHeaders = authReq.headers.set('Authorization', `Bearer ${res.token}`);
                const newReq = authReq.clone({ headers: newHeaders });
                return next.handle(newReq);
              })
            );
        }
        return throwError(() => error);
      })
    );
  }
}
