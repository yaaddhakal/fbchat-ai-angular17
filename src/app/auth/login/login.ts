import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule,Location  } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  loading = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private location: Location
  ) {
    // ✅ initialize form inside constructor
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

   ngOnInit() {
    // ✅ Modern way — works reliably in Angular 17+
    const state = this.location.getState() as any;

    if (state?.message) {
      this.infoMessage = state.message;
    }
    if (state?.email) {
      this.form.patchValue({ username: state.email });
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    // clear old session
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('tenantName');
    localStorage.removeItem('tenantIndustryId');
    localStorage.removeItem('userId');

    const { username, password } = this.form.value;

    this.auth.login(username!, password!).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.statusCode === 200) {
          const data = res.data;

          // ✅ Save fresh values
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userType', data.userType);
          localStorage.setItem('userId', data.userId.toString());

          this.toast.success('Login successful');

          const userType = data.userType?.toLowerCase();
          if (userType === 'sysuser' || userType === 'both') {
            this.router.navigate(['/sys-dashboard']);
          } else if (userType === 'tenantuser') {
            this.router.navigate(['/tenant-dashboard']);
          }
        } else {
          this.errorMessage = res.message || 'Login failed';
          this.toast.error(this.errorMessage);
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Network or server error:', err);

        if (err.status === 404) {
          this.errorMessage = err.error?.message || 'Invalid username or password';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'Unable to connect to server';
        }

        this.loading = false;
        this.toast.error(this.errorMessage || 'Login failed');
        this.cdr.markForCheck();
      },
    });
  }
}
