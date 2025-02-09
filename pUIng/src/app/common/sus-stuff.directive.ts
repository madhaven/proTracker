import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[susStuff]',
  standalone: true,
})
export class SusStuffDirective {

  // Directive that tracks mouse hovers on objects
  // When mouse hovers for more than a minimumSusTime, the directive emits an "onSus" event
  // When mouse leaves, it emits an "onNonSus" event. 

  @Input('susTime') minimumSusTime: number = 1500;
  @Output('onSus') sus = new EventEmitter<void>();
  @Output('onNonSus') notSus = new EventEmitter<void>();
  isSus: boolean = false;
  timer?: NodeJS.Timeout;
  emitter = () => {
    this.isSus = true;
    this.sus.emit();
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.emitter, this.minimumSusTime);
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    if (this.timer) clearTimeout(this.timer);
    if (this.isSus) {
      this.isSus = false;
      this.notSus.emit();
    }
  }
}
