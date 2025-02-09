import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { HintingService } from '../../services/hinting.service';

@Component({
  selector: 'pui-hint-line',
  standalone: true,
  templateUrl: './hint-line.component.html',
  styleUrl: './hint-line.component.css'
})
export class HintLineComponent {

  isVisible: boolean = false;
  hint: string = "";
  timer1?: NodeJS.Timeout;
  timer2?: NodeJS.Timeout;
  timer3?: NodeJS.Timeout;
  hintListener: Subscription;
  hideHintListener: Subscription;

  constructor (private hintingService: HintingService) {
    this.hintListener = this.hintingService.hintRequested$.subscribe(
      ([hint, duration, delay]) => { this.showHint(hint, duration, delay); }
    );
    this.hideHintListener = this.hintingService.hideHintRequested$.subscribe(
      () => { this.hideHint(); }
    );
  }

  showHint(text: string, durationInSeconds: number = 2, delayInSeconds: number = 0.1) {
    this.clearTimers();
    this.hint = text;
    var duration = durationInSeconds * 2000 + 100;
    var delay = delayInSeconds * 1000;

    // set timers to hide hint
    this.timer1 = setTimeout(() => { this.isVisible = true; }, delay);
    this.timer2 = setTimeout(() => { this.isVisible = false; }, duration);
    this.timer3 = setTimeout(() => { this.hint = ""; }, duration + 2000);
  }

  hideHint(): void {
    this.clearTimers();
    this.isVisible = false;
    this.timer1 = setTimeout(() => { this.hint = ""; }, 2000);
  }

  clearTimers(): void {
    if (this.timer1) { clearTimeout(this.timer1); }
    if (this.timer2) { clearTimeout(this.timer2); }
    if (this.timer3) { clearTimeout(this.timer3); }
  }
}
