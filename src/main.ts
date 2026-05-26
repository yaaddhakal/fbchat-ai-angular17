import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// ✅ Functional interceptor (modern Angular style)
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const apiKey = 'your_secure_api_key_here_change_in_production_12345';

  const headers = req.headers
    .set('X-API-Key', apiKey)
    .set('Authorization', token ? `Bearer ${token}` : '');

  const authReq = req.clone({ headers });
  return next(authReq);
};

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes)
  ]
});
