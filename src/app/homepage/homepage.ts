import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantSignupModal } from '../modals/tenant-signup-modal/tenant-signup-modal';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, TenantSignupModal],  // ✅ correct class name
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class Homepage {
  showSignup = false;

  constructor(private router: Router) {}

  goToLogin()  { this.router.navigate(['/login']); }
  openSignup() { this.showSignup = true; }
  closeSignup(){ this.showSignup = false; }

  onSignupSuccess(user: any) {
    this.showSignup = false;

    // check isEmailVerified and redirect
    if (user.isEmailVerified)
      this.router.navigate(['/dashboard']);
    else
      this.router.navigate(['/verify-otp'], { state: { userID: user.userID } });
  }
}