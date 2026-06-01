// tenant-signup-modal.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TenantService } from '../../services/tenant.service';
import { TenantModel, IndustryModel, TenantSignupModel } from '../../models/user-signup.model';
import { Spinner } from '../../shared/spinner/spinner';
@Component({
  selector: 'app-tenant-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,Spinner],
  templateUrl: './tenant-signup-modal.html',
  styleUrls:  ['./tenant-signup-modal.css']
})
export class TenantSignupModal implements OnInit {
  @Output() closed        = new EventEmitter<void>();
  @Output() signupSuccess = new EventEmitter<any>();

  form!: FormGroup;
  errorMessage = '';

  tenants:    TenantModel[]  = [];
  industries: IndustryModel[] = [];

  isNewTenant   = false;
  isNewIndustry = false;
  showIndustry  = false;   // only show after tenant is picked

  constructor(
    private fb:            FormBuilder,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadTenants();
  }

  // ── Form ──────────────────────────────────────────────────
  buildForm() {
    this.form = this.fb.group({
      tenantID:        [null],
      tenantName:      [''],
      industryID:      [null],
      industryName:    [''],
      userName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const pw  = form.get('password')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }
isLoadingTenants   = false;
isLoadingIndustries = false;
isSubmitting       = false;
  // ── Load Tenants ──────────────────────────────────────────
  loadTenants() {
     debugger;
     this.isLoadingTenants = true;
    this.tenantService.getAllTenants().subscribe({
      next: (res) => {this.tenants = res.data ?? [];
      this.isLoadingTenants = false;
    }
      ,
      error: ()   => {this.errorMessage = 'Failed to load tenants1'
      this.isLoadingTenants = false;
      }
    });
  }

  // ── Tenant Change ─────────────────────────────────────────
  onTenantChange(selected: any) {
    
    this.showIndustry  = true;
    this.industries    = [];
    this.isNewIndustry = false;
    this.form.patchValue({ industryID: null, industryName: '' });

    if (!selected) {
      this.showIndustry = false;
      this.isNewTenant  = false;
      this.form.patchValue({ tenantID: null, tenantName: '' });
      return;
    }

    if (selected.isNew || !selected.tenantID) {
      // typed new tenant
      this.isNewTenant   = true;
      this.isNewIndustry = true;
      this.form.patchValue({ tenantID: null, tenantName: selected.tenantName ?? selected });
    } else {
      // existing tenant selected
      this.isNewTenant = false;
      this.form.patchValue({ tenantID: selected.tenantID, tenantName: selected.tenantName });
      this.loadIndustries(selected.tenantID);
    }
  }

  // ── Load Industries ───────────────────────────────────────
  loadIndustries(tenantID: number) {
    this.isLoadingIndustries = true;
    this.tenantService.getIndustriesByTenant(tenantID).subscribe({
      next: (res) => {this.industries = res.data ?? []
      this.isLoadingIndustries = false;
      },
      error: ()   => {this.errorMessage = 'Failed to load industries';
        this.isLoadingIndustries = false;}
    });
  }

  // ── Industry Change ───────────────────────────────────────
  onIndustryChange(selected: any) {
    if (!selected) {
      this.form.patchValue({ industryID: null, industryName: '' });
      return;
    }

    if (selected.isNew || !selected.industryID) {
      // typed new industry
      this.isNewIndustry = true;
      this.form.patchValue({ industryID: null, industryName: selected.industryName ?? selected });
    } else {
      // existing industry selected
      this.isNewIndustry = false;
      this.form.patchValue({ industryID: selected.industryID, industryName: selected.industryName });
    }
  }

  // ── Submit ────────────────────────────────────────────────
  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const v = this.form.value;

    const payload = {
      tenantID:     v.tenantID     ?? null,
      industryID:   v.industryID   ?? null,
      tenantName:   v.tenantName,
      industryName: v.industryName?.trim() || v.tenantName, // blank → use tenantName
      userType:     'Tenant',                               // hardcoded
      userName:     v.userName,
      email:        v.email,
      passwordHash:     v.password,                             // no confirmPassword
    };

    this.tenantService.signupTenant(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success)
          this.signupSuccess.emit(res.data);
        
        else
          this.errorMessage = res.message ?? 'Signup failed';
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Unexpected error occurred';
      }
    });
  }

  dismiss() { this.closed.emit(); }

  // ── Helpers ───────────────────────────────────────────────
  get pwMismatch() {
    return this.form.hasError('passwordMismatch') &&
           this.form.get('confirmPassword')?.touched;
  }
}