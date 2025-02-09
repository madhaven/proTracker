import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[blur]',
  standalone: true
})
export class BlurDirective {
  @Input('strength') strength: number = 5;

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backdropFilter = `blur(${this.strength}px)`
  }

}
