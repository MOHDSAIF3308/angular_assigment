import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskStatusRequest } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(delay?: number): Observable<Task[]> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTaskStatus(taskId: string, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, { status });
  }

  updateTask(taskId: string, updates: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, updates);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}
