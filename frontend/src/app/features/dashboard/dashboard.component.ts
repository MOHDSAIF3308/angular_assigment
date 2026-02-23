import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecordService } from '../../core/services/record.service';
import { User } from '../../shared/models/user.model';
import { Record } from '../../shared/models/record.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  records: Record[] = [];
  loading = false;
  delayMs = 0;

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.recordService.getRecords(this.delayMs || undefined)
      .subscribe({
        next: (data: any) => {
          this.records = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyDelay(): void {
    this.loadRecords();
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  navigateToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  navigateToAdminTasks(): void {
    this.router.navigate(['/admin/tasks']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
