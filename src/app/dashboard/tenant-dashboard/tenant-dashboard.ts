import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SysUserService } from '../../services/sysuser.service';
import { UserView } from '../../models/user-view.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-dashboard.html',
  styleUrls: ['./tenant-dashboard.scss']
})
export class TenantDashboard implements OnInit {
  userView: UserView | null = null;

  constructor(
    private sysUserService: SysUserService,
    private cdr: ChangeDetectorRef, private router: Router
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.sysUserService.getUserByIdAsync(userId).subscribe({
      next: (data) => {
        console.log('UserView:', data);
        this.userView = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load user view', err)
    });
  }

   logout() {
    localStorage.clear();
    this.router.navigate(['/login']);  // ✅ Angular way
  }
  switchToTenant() {
  this.router.navigate(['/tenant-dashboard']);
}

}
