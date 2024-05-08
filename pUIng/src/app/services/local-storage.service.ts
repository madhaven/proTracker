import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Set a value in local storage
  setItem(key: string, value: any): void {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }

  // Get a value from local storage
  getItem(key: string): any {
    const stringValue = localStorage.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}