import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { Task, CreateTaskRequest } from '../../shared/models/task.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.scss']
})
export class AdminTasksComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  loading = false;
  error = '';
  delayMs = 0;

  // Form states
  showCreateModal = false;
  showEditModal = false;
  selectedTask: Task | null = null;

  // Form data
  formData = {
    taskId: '',
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium' as const,
    dueDate: ''
  };

  priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  displayedColumns = ['Task ID', 'Title', 'Assigned To', 'Priority', 'Status', 'Due Date', 'Actions'];

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    this.taskService.getTasks(this.delayMs).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: () => {
        this.error = 'Failed to load users';
      }
    });
  }

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  openEditModal(task: Task): void {
    this.selectedTask = task;
    this.formData = {
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority as any,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedTask = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      taskId: '',
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      dueDate: ''
    };
  }

  createTask(): void {
    if (!this.validateForm()) {
      this.error = 'Please fill all required fields';
      return;
    }

    this.taskService.createTask(this.formData).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.closeCreateModal();
      },
      error: () => {
        this.error = 'Failed to create task';
      }
    });
  }

  updateTask(): void {
    if (!this.selectedTask) return;

    const updates = {
      title: this.formData.title,
      description: this.formData.description,
      assignedTo: this.formData.assignedTo,
      priority: this.formData.priority,
      dueDate: new Date(this.formData.dueDate)
    };

    this.taskService.updateTask(this.selectedTask.taskId, updates).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.taskId === this.selectedTask!.taskId);
        if (index > -1) {
          this.tasks[index] = updated;
        }
        this.closeEditModal();
      },
      error: () => {
        this.error = 'Failed to update task';
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
        },
        error: () => {
          this.error = 'Failed to delete task';
        }
      });
    }
  }

  validateForm(): boolean {
    return !!(
      this.formData.taskId &&
      this.formData.title &&
      this.formData.description &&
      this.formData.assignedTo &&
      this.formData.dueDate
    );
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.name : userId;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'On Hold':
        return 'status-on-hold';
      default:
        return 'status-not-started';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Critical':
        return 'priority-critical';
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
