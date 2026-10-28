import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 h-16 px-5 flex justify-between items-center bg-[#080810]/90 backdrop-blur-md border-b border-white/10">
      <!-- Points Pill -->
      <div class="flex items-center gap-2 bg-[#12121E] px-4 py-2 rounded-full border border-white/10 text-sm font-semibold">
        <span class="text-amber-400 text-sm">🪙</span>
        <span class="font-jetbrains font-bold text-white tracking-wide">{{ formattedPoints }} pts</span>
      </div>

      <!-- Publisher Info -->
      <div class="flex items-center gap-3">
        <span class="font-jetbrains font-bold text-xs tracking-wider uppercase text-[#CCC3D8]">{{ publisherName }}</span>
        <div class="w-8 h-8 rounded-full bg-[#1F1E2B] border border-[#D2BBFF]/30 flex items-center justify-center overflow-hidden shrink-0">
          @if (publisherLogoUrl) {
            <img [src]="publisherLogoUrl" [alt]="publisherName" class="w-8 h-8 rounded-full object-cover" />
          } @else {
            <span class="text-xs font-bold text-[#D2BBFF]">{{ publisherInitials }}</span>
          }
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() pointsBalance: number = 1500;
  @Input() publisherName: string = 'NOON EGYPT';
  @Input() publisherLogoUrl: string | null = null;

  get formattedPoints(): string {
    return this.pointsBalance.toLocaleString();
  }

  get publisherInitials(): string {
    if (!this.publisherName) return 'NE';
    return this.publisherName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
