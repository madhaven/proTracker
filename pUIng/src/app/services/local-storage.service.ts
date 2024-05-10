import { afterNextRender, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorage?: Storage;

  constructor() {
    afterNextRender(() => {
      this.localStorage = localStorage;
    });
  }

  // Set a value in local storage
  setItem(key: string, value: any): void {
    const stringValue = JSON.stringify(value);
    this.localStorage?.setItem(key, stringValue);
  }

  // Get a value from local storage
  getItem(key: string): any {
    const stringValue = this.localStorage?.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    this.localStorage?.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    this.localStorage?.clear();
  }
}