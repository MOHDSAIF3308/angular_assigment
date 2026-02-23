import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  loading = false;
  delayMs = 0;
  showModal = false;
  editMode = false;
  currentUser: any = {};

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers(this.delayMs || undefined)
      .subscribe({
        next: (data: any) => {
          this.users = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyDelay(): void {
    this.loadUsers();
  }

  openCreateModal(): void {
    this.editMode = false;
    this.currentUser = { role: 'General User' };
    this.showModal = true;
  }

  openEditModal(user: any): void {
    this.editMode = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentUser = {};
  }

  saveUser(): void {
    if (this.editMode) {
      this.userService.updateUser(this.currentUser._id, this.currentUser)
        .subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
    } else {
      this.userService.createUser(this.currentUser)
        .subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id)
        .subscribe(() => {
          this.loadUsers();
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
