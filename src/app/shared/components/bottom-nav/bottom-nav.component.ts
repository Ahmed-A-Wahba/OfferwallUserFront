import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type NavTab = 'offers' | 'create-code' | 'offer-history';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#13121F]/90 backdrop-blur-xl rounded-t-3xl flex items-center justify-around py-2.5 px-4 z-50 border-t border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.7)]">
      <!-- Offers Tab -->
      <button
        id="nav-tab-offers"
        (click)="navigate('offers')"
        class="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 px-3 py-1 relative group"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          [class.bg-[#D2BBFF]/15]="activeTab === 'offers'"
          [class.text-[#D2BBFF]]="activeTab === 'offers'"
          [class.drop-shadow-[0_0_10px_rgba(210,187,255,0.5)]]="activeTab === 'offers'"
          [class.text-[#CCC3D8]/60]="activeTab !== 'offers'"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <span
          class="text-[11px] font-medium tracking-tight transition-colors duration-200"
          [class.text-[#D2BBFF]]="activeTab === 'offers'"
          [class.font-bold]="activeTab === 'offers'"
          [class.text-[#CCC3D8]/60]="activeTab !== 'offers'"
        >Offers</span>
        @if (activeTab === 'offers') {
          <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#D2BBFF] shadow-[0_0_6px_#D2BBFF]"></span>
        }
      </button>

      <!-- Create Code Tab (Elevated Prominent Center Button) -->
      <button
        id="nav-tab-create-code"
        (click)="navigate('create-code')"
        class="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 px-3 py-1 relative -mt-5 group"
      >
        <div
          class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#D2BBFF] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.6)] transition-all duration-300 border-2 border-[#13121F]"
          [class.ring-2]="activeTab === 'create-code'"
          [class.ring-[#D2BBFF]]="activeTab === 'create-code'"
          [class.scale-105]="activeTab === 'create-code'"
          [class.shadow-[0_0_25px_rgba(210,187,255,0.8)]]="activeTab === 'create-code'"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span
          class="text-[11px] font-medium tracking-tight transition-colors duration-200"
          [class.text-[#D2BBFF]]="activeTab === 'create-code'"
          [class.font-bold]="activeTab === 'create-code'"
          [class.text-[#CCC3D8]/60]="activeTab !== 'create-code'"
        >Create Code</span>
        @if (activeTab === 'create-code') {
          <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#D2BBFF] shadow-[0_0_6px_#D2BBFF]"></span>
        }
      </button>

      <!-- Offer History Tab -->
      <button
        id="nav-tab-offer-history"
        (click)="navigate('offer-history')"
        class="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 px-3 py-1 relative group"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          [class.bg-[#D2BBFF]/15]="activeTab === 'offer-history'"
          [class.text-[#D2BBFF]]="activeTab === 'offer-history'"
          [class.drop-shadow-[0_0_10px_rgba(210,187,255,0.5)]]="activeTab === 'offer-history'"
          [class.text-[#CCC3D8]/60]="activeTab !== 'offer-history'"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <span
          class="text-[11px] font-medium tracking-tight transition-colors duration-200"
          [class.text-[#D2BBFF]]="activeTab === 'offer-history'"
          [class.font-bold]="activeTab === 'offer-history'"
          [class.text-[#CCC3D8]/60]="activeTab !== 'offer-history'"
        >Offer History</span>
        @if (activeTab === 'offer-history') {
          <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#D2BBFF] shadow-[0_0_6px_#D2BBFF]"></span>
        }
      </button>
    </nav>
  `
})
export class BottomNavComponent {
  @Input() activeTab: NavTab = 'offers';

  private router = inject(Router);

  navigate(tab: NavTab): void {
    if (tab === 'offers') {
      this.router.navigate(['/dashboard']);
    } else if (tab === 'create-code') {
      this.router.navigate(['/create-code']);
    } else if (tab === 'offer-history') {
      this.router.navigate(['/offer-history']);
    }
  }
}
