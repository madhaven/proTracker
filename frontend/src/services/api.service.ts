import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService { // Orchestrates all communication with backend
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = 'http://localhost:5266/api';
  private readonly _isPlatformBrowser = isPlatformBrowser(this.platformId);

  getResource<T>(endpoint: string, options?: any) {
    return httpResource<T>(() => {
      if (!this._isPlatformBrowser) { return undefined; }
      return `${this.baseUrl}${endpoint}`;
    }, options);
  }

  post<T>(endpoint: string, body: any) {
    if (!this._isPlatformBrowser) { return of(null as any); }
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any) {
    if (!this._isPlatformBrowser) { return of(null as any); }
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string) {
    if (!this._isPlatformBrowser) { return of(null as any); }
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
