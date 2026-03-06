import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SvgIcon, SvgMap } from '@constants';

@Component({
  selector: 'pt-svg',
  standalone: true,
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent {
  private sanitizer = inject(DomSanitizer);

  icon = input.required<SvgIcon>();
  size = input<number>(24);

  safeSvg = computed<SafeHtml>(() => {
    const iconName = this.icon();
    const iconSize = this.size();
    const rawSvg = SvgMap[iconName];
    
    if (!rawSvg) return '';

    const sizedSvg = rawSvg.replace('<svg ', `<svg width="${iconSize}" height="${iconSize}" `);
    return this.sanitizer.bypassSecurityTrustHtml(sizedSvg); // i trust my svgs to not have evil scripts
  });
}
