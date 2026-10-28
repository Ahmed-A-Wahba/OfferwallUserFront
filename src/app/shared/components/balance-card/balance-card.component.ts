import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-[2rem] p-6 relative overflow-hidden shadow-lg shadow-purple-500/20 mt-4">
      <!-- Watermark Background Sparkle Icon (Constrained) -->
      <div class="absolute -top-4 -right-4 opacity-15 pointer-events-none">
        <svg width="128" height="128" class="w-32 h-32 max-w-[128px] max-h-[128px] text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      <!-- Top Section: Total Balance -->
      <div class="relative z-10 flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="font-jetbrains font-bold text-xs tracking-[0.2em] uppercase text-white/70">TOTAL BALANCE</span>
          <svg width="24" height="24" class="w-6 h-6 max-w-[24px] max-h-[24px] text-amber-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="font-sora font-bold text-5xl text-white drop-shadow-md">
            {{ formattedPoints }}
          </span>
          <span class="font-sora font-semibold text-2xl text-white/80">pts</span>
          <span class="text-2xl">✨</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="relative z-10 my-4 h-[1px] w-full bg-white/20"></div>

      <!-- Bottom Section: Progress Bar & Redeem Button -->
      <div class="relative z-10 flex items-end justify-between gap-4">
        <!-- Level & Progress Info -->
        <div class="flex-1 flex flex-col gap-2">
          <p class="text-xs text-white/90 font-medium">Ready to redeem your points</p>
          
          <!-- Level Badge -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-bold text-[10px] tracking-tight uppercase shadow-sm w-fit">
            <svg width="12" height="12" class="w-3 h-3 max-w-[12px] max-h-[12px] text-slate-950" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.57l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.57l7-10a1 1 0 011.12-.384z" clip-rule="evenodd" />
            </svg>
            <span>LEVEL {{ userLevel }} EARNER</span>
          </div>

          <!-- XP Progress Bar -->
          <div class="flex flex-col gap-1">
            <div class="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-300 to-amber-300 rounded-full transition-all duration-500" [style.width.%]="progressPercentage"></div>
            </div>
            <div class="flex items-center justify-between text-[9px] font-bold uppercase text-white/70">
              <span>{{ currentLevelProgress }}</span>
              <span class="text-[#D2BBFF]">{{ pointsToNextLevel }} PTS TO LEVEL {{ userLevel + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Redeem Button -->
        <button 
          (click)="onRedeem.emit()" 
          class="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-100 transition-transform active:scale-95 shadow-md shrink-0 flex items-center gap-1"
        >
          <span>Redeem</span>
          <svg width="16" height="16" class="w-4 h-4 max-w-[16px] max-h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class BalanceCardComponent {
  @Input() pointsBalance: number = 0;
  @Input() userXp: number = 0;
  @Output() onRedeem = new EventEmitter<void>();

  get formattedPoints(): string {
    return (this.pointsBalance || 0).toLocaleString();
  }

  get userLevel(): number {
    return Math.floor((this.userXp || 0) / 1000) + 1;
  }

  get currentLevelProgress(): number {
    return (this.userXp || 0) % 1000;
  }

  get pointsToNextLevel(): number {
    return 1000 - ((this.userXp || 0) % 1000);
  }

  get progressPercentage(): number {
    return (((this.userXp || 0) % 1000) / 1000) * 100;
  }
}
