import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesData {
  years: YearData[];
}

export interface YearData {
  year: number;
  months: MonthData[];
}

export interface MonthData {
  month: string;
  days: DayData[];
}

export interface DayData {
  day: number;
  sales: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesDataService {
  private dataUrl = 'assets/data/sales-data.json';

  constructor(private http: HttpClient) {}

  loadSalesData(): Observable<SalesData> {
    return this.http.get<SalesData>(this.dataUrl);
  }
}
