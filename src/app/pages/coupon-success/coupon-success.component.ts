import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

export interface CouponSuccessState {
  code: string;
  pointsValue: number;
  usdValue?: number;
  couponId?: string;
}

@Component({
  selector: 'app-coupon-success',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, CurrencyPipe],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white relative pb-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-[#080810] to-[#080810]">
      
      <!-- Header Bar -->
      <div class="p-5 flex items-center gap-3 border-b border-white/5">
        <button 
          (click)="goBack()"
          class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
        >
          ←
        </button>
        <h1 class="text-xl font-bold font-sora text-white">Redemption Success</h1>
      </div>

      @if (coupon) {
        <!-- Glowing Success Icon -->
        <div class="flex justify-center my-6 relative">
          <div class="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500 flex items-center justify-center text-4xl text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse font-bold">
            ✓
          </div>
        </div>

        <!-- Points Card -->
        <div class="mx-5 bg-[#12121E] border border-white/5 rounded-3xl p-6 text-center shadow-lg mt-6">
          <h2 class="text-lg font-bold text-white">Points Redeemed Successfully!</h2>
          <div class="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
            +{{ coupon.pointsValue.toLocaleString() }} pts
          </div>
          <div class="text-sm text-emerald-400/80 mt-1 font-medium">
            = {{ (coupon.usdValue || (coupon.pointsValue / 100)) | currency:'USD':'symbol':'1.2-2' }} USD
          </div>
        </div>

        <!-- Code Section -->
        <div class="text-[10px] text-gray-400 uppercase tracking-widest ml-5 mb-2 mt-8 font-mono font-medium">
          YOUR COUPON CODE
        </div>
        <div class="mx-5 bg-[#12121E] border border-white/5 rounded-xl p-4 flex justify-between items-center shadow-md">
          <span class="font-mono text-lg font-bold tracking-widest text-white select-all">
            {{ coupon.code }}
          </span>
          <button 
            (click)="copyCode()" 
            class="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            {{ copied() ? 'Copied ✓' : 'Copy' }}
          </button>
        </div>

        <!-- Warning Message Box -->
        <div class="mx-5 mt-3 text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-lg p-2.5 text-center flex justify-center items-center gap-2">
          <span>⚠️</span>
          <span>This coupon is single-use and non-transferable</span>
        </div>

        <!-- Location Section -->
        <div class="mt-6 ml-5 mb-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono font-medium">
          REDEEMABLE AT
        </div>
        <div class="mx-5 bg-[#12121E] border border-white/5 rounded-xl p-4 flex items-center gap-4 shadow-md">
          <div class="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-300 text-lg shrink-0">
            📍
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Egypt, Cairo</h4>
            <p class="text-xs text-gray-400 mt-0.5">Your coupon is restricted to this detected location</p>
          </div>
        </div>

        <!-- Primary Action Button -->
        <button 
          (click)="goBack()" 
          class="w-[calc(100%-40px)] mx-5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 active:scale-98 rounded-2xl py-4 text-lg font-bold mt-8 shadow-lg shadow-purple-500/25 transition-all text-center block cursor-pointer"
        >
          Back to Offers →
        </button>

      } @else {
        <!-- Redirecting State -->
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 gap-3">
          <div class="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p class="text-xs text-gray-400">Loading redemption details...</p>
        </div>
      }

      <!-- Bottom Sticky Navigation Footer -->
      <app-bottom-nav activeTab="create-code"></app-bottom-nav>
    </div>
  `
})
export class CouponSuccessComponent implements OnInit {
  private router = inject(Router);
  public coupon: CouponSuccessState | null = null;
  public copied = signal<boolean>(false);

  ngOnInit(): void {
    const navState = this.router.getCurrentNavigation()?.extras?.state as { coupon?: CouponSuccessState } | undefined;
    const historyState = history.state as { coupon?: CouponSuccessState } | undefined;

    const couponData = navState?.coupon || historyState?.coupon;

    if (couponData && couponData.code) {
      this.coupon = couponData;
    } else {
      // Fallback demo coupon if accessed directly without router state history
      this.coupon = {
        code: 'WXYZ-1234-ABCD-5678',
        pointsValue: 500,
        usdValue: 5.00
      };
    }
  }

  copyCode(): void {
    if (this.coupon?.code) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.coupon.code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = this.coupon.code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
