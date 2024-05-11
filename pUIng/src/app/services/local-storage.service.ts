import { afterRender, Injectable } from '@angular/core';
import { Keys } from '../common/keys';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  localStorage?: Storage;

  constructor() {
    afterRender(() => {
      this.localStorage = localStorage;
    });
  }

  // Set a value in local storage
  setItem(key: Keys, value: any): void {
    const stringValue = JSON.stringify(value);
    this.localStorage?.setItem(key, stringValue);
  }

  // Get a value from local storage
  getItem(key: Keys): any {
    const stringValue = this.localStorage?.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  }

  // Remove a value from local storage
  removeItem(key: Keys): void {
    this.localStorage?.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    this.localStorage?.clear();
  }
}