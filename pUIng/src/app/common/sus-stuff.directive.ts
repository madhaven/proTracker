import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[susStuff]',
  standalone: true,
})
export class SusStuffDirective {

  @Output('onSus') sus = new EventEmitter<void>();
  @Output('onNonSus') notSus = new EventEmitter<void>();
  timer?: NodeJS.Timeout;
  minimumSusTime: number = 1500;

  constructor(private el?: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.timer) { clearTimeout(this.timer); }
    this.timer = setTimeout(() => {
      this.sus.emit();
    }, this.minimumSusTime);
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    if (this.timer) { clearTimeout(this.timer); }
    this.notSus.emit();
  }
}
