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
      hint => { this.showHint(hint); }
    );
    this.hideHintListener = this.hintingService.hideHintRequested$.subscribe(
      () => { this.hideHint(); }
    );
  }

  showHint(text: string) {
    this.clearTimers();
    this.hint = text;

    // set timers to hide hint
    this.timer1 = setTimeout(() => { this.isVisible = true; }, 100);
    this.timer2 = setTimeout(() => { this.isVisible = false; }, 2000);
    this.timer3 = setTimeout(() => { this.hint = ""; }, 4000);
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
