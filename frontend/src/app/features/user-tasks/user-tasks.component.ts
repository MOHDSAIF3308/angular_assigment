import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task, UpdateTaskStatusRequest } from '../../shared/models/task.model';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss']
})
export class UserTasksComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  selectedTask: Task | null = null;
  showStatusModal = false;
  newStatus: string = '';
  delayMs = 0;

  statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
  displayedColumns = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Actions'];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
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

  openStatusModal(task: Task): void {
    this.selectedTask = task;
    this.newStatus = task.status;
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedTask = null;
    this.newStatus = '';
  }

  updateStatus(): void {
    if (!this.selectedTask) return;

    this.taskService.updateTaskStatus(this.selectedTask.taskId, this.newStatus).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.taskId === this.selectedTask!.taskId);
        if (index > -1) {
          this.tasks[index] = updated;
        }
        this.closeStatusModal();
      },
      error: () => {
        this.error = 'Failed to update task status';
      }
    });
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
