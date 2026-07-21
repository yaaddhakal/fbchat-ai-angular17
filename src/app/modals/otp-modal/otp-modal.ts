// otp-modal.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter,NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantService } from '../../services/tenant.service';
import {Spinner} from '../../shared/spinner/spinner';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './otp-modal.html',
  styleUrls:   ['./otp-modal.css']
})
export class OtpModalComponent implements OnInit, OnDestroy {
  @Input()  user: any;                           // receives user from parent
  @Output() closed        = new EventEmitter<void>();
  @Output() verifySuccess = new EventEmitter<any>();

  form!: FormGroup;
  errorMessage   = '';
  successMessage = '';
  isVerifying    = false;
  isResending    = false;

  // ── Countdown ─────────────────────────────────────────────
  timeLeft     = 600;    // 10 minutes in seconds
  timerExpired = false;
  private timerInterval: any;

  constructor(
    private fb:            FormBuilder,
    private tenantService: TenantService,
    private ngZone:        NgZone  // ✅ to run timer outside Angular zone
  ) {}

  ngOnInit() {
    this.buildForm();
    this.startCountdown();
  }

  ngOnDestroy() {
    this.clearTimer(); // ✅ prevent memory leak
  }

  // ── Form ──────────────────────────────────────────────────
  buildForm() {
    this.form = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  // ── Countdown ─────────────────────────────────────────────
  startCountdown() {
  this.timeLeft     = 600;
  this.timerExpired = false;
  this.clearTimer();

  this.ngZone.runOutsideAngular(() => {   // ✅ run outside Angular
    this.timerInterval = setInterval(() => {
      this.ngZone.run(() => {             // ✅ update UI inside Angular
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.timerExpired = true;
          this.clearTimer();
        }
      });
    }, 1000);
  });
}

  clearTimer() {
    if (this.timerInterval)
      clearInterval(this.timerInterval);
  }

  // ── Format time as MM:SS ─────────────────────────────────
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // ── Masked email ──────────────────────────────────────────
  get maskedEmail(): string {
    if (!this.user?.email) return '';
    const [local, domain] = this.user.email.split('@');
    const masked = local[0] + '***';
    return `${masked}@${domain}`;
  }

  // ── Verify ────────────────────────────────────────────────
  onVerify() {
    if (this.form.invalid) return;
    this.isVerifying = true;
    this.errorMessage = '';

    this.tenantService.verifyOtp({
      userID:  this.user.userID,
      otpCode: this.form.value.otpCode
    }).subscribe({
      next: (res) => {
        this.isVerifying = false;
        if (res.success) {
          this.clearTimer();
          this.verifySuccess.emit(res.data);  // pass user to parent
        } else {
          this.errorMessage = res.message ?? 'Invalid OTP';
        }
      },
      error: () => {
        this.isVerifying = false;
        this.errorMessage = 'Unexpected error occurred';
      }
    });
  }

  // ── Resend ────────────────────────────────────────────────
  onResend() {
    this.isResending  = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.tenantService.resendOtp({ userID: this.user.userID }).subscribe({
      next: (res) => {
        this.isResending = false;
        if (res.success) {
          this.successMessage = 'New OTP sent! Check your email.';
          this.startCountdown();   // ✅ restart timer
          this.form.reset();       // ✅ clear old OTP input
        } else {
          this.errorMessage = res.message ?? 'Failed to resend OTP';
        }
      },
      error: () => {
        this.isResending = false;
        this.errorMessage = 'Unexpected error occurred';
      }
    });
  }

  dismiss() { this.closed.emit(); }
}