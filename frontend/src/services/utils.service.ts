import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  getTodayStart() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
}