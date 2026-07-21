import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantSignupModal } from '../modals/tenant-signup-modal/tenant-signup-modal';
import { OtpModalComponent } from '../modals/otp-modal/otp-modal';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, TenantSignupModal, OtpModalComponent],  // ✅ correct class name
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class Homepage {
  showSignup = false;
showOtp    = false;
currentUser: any = null;   // holds user between modals
  constructor(private router: Router) {}

  goToLogin()  { this.router.navigate(['/login']); }
  openSignup() { this.showSignup = true; }
  closeSignup(){ this.showSignup = false; }

 onSignupSuccess(res: any) {
  this.showSignup = false;

  switch (res.message) {
    case 'RedirectToTenantDashboard':
      // ✅ already verified — go login
      this.router.navigate(['/login'], {
        state: { message: 'Already registered. Please login.' }
      });
      break;

    case 'RedirectToOTP':
      // ✅ exists but unverified — go login
      this.router.navigate(['/login'], {
        state: { message: 'Account exists. Please login to verify your email.' }
      });
      break;

    case 'Success':
      // ✅ new user — open OTP modal
      this.currentUser = res;
      this.showOtp = true;
      break;
  }
}

onVerifySuccess(user: any) {
  this.showOtp = false;
  // ✅ verified — go login for fresh entry
  this.router.navigate(['/login'], {
    state: { message: 'Email verified! Please login.' }
  });
}
}