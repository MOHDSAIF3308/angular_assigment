import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Record } from '../../shared/models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private http: HttpClient) {}

  getRecords(delay?: number): Observable<Record[]> {
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<Record[]>(`${environment.apiUrl}/records`, { params });
  }
}
