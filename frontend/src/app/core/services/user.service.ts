import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(delay?: number): Observable<User[]> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<User[]>(`${environment.apiUrl}/users`, { params });
  }

  getUsers(): Observable<User[]> {
    return this.getAllUsers();
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
