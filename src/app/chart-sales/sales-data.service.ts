import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesDataService {
  private dataUrl = 'assets/data/sales-data.json';

  constructor(private http: HttpClient) {}

  loadSalesData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}
