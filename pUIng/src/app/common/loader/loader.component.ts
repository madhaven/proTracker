import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'pui-loader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnChanges {

  @Input() percent: number = 0;
  @ViewChild('content') content?: ElementRef;
  visible: boolean = true;
  
  ngOnChanges() {
    if (this.percent == 100) setTimeout(() => {
      this.visible = false;
    }, 2000); 
  }
}
