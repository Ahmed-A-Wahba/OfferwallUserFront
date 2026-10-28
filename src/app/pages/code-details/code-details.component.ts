import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, Location, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CouponService } from '../../core/services/coupon.service';
import { CouponDto } from '../../core/models/coupon.model';

@Component({
  selector: 'app-code-details',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white p-5 pb-20 relative">
      @if (coupon()) {
        <!-- Top Header Bar -->
        <header class="flex items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <button 
              (click)="goBack()"
              class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
            >
              ←
            </button>
            <h1 class="text-xl font-bold font-sora text-white">Code Details</h1>
          </div>

          <!-- Dynamic Status Badge -->
          <div class="bg-purple-900/40 text-purple-300 text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-purple-500/20 font-mono uppercase">
            <span class="w-2 h-2 rounded-full" [ngClass]="getBadgeColor(coupon()?.status)"></span>
            <span>{{ coupon()?.status }}</span>
          </div>
        </header>

        <!-- Feedback Banners -->
        @if (toastMessage()) {
          <div class="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
            <span>✓ {{ toastMessage() }}</span>
            <button (click)="toastMessage.set(null)" class="text-emerald-400 font-bold ml-2">✕</button>
          </div>
        }

        @if (errorMessage()) {
          <div class="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <span>⚠️ {{ errorMessage() }}</span>
            <button (click)="errorMessage.set(null)" class="text-red-400 font-bold ml-2">✕</button>
          </div>
        }

        <!-- Coupon Code Card -->
        <div class="bg-[#12121E] border border-white/5 rounded-2xl p-5 mb-5 mt-4 shadow-xl">
          <div class="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono font-medium">
            YOUR COUPON CODE
          </div>
          <div class="bg-[#090814] border border-white/10 rounded-xl p-4 text-center mb-4">
            <span class="font-mono text-xl font-bold tracking-[0.2em] text-white select-all">
              {{ coupon()?.code || 'WXYZ-1234-ABCD-5678' }}
            </span>
          </div>
          <button 
            (click)="copyCode()" 
            class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 active:scale-98 rounded-xl py-3 text-base font-bold flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <span>📋</span>
            <span>{{ copied() ? 'Code Copied ✓' : 'Copy Code' }}</span>
          </button>
        </div>

        <!-- Transaction Details Card -->
        <div class="bg-[#12121E] border border-white/5 rounded-2xl p-5 mb-5 shadow-lg space-y-3">
          <div class="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-mono font-medium border-b border-white/5 pb-2">
            TRANSACTION DETAILS
          </div>

          <!-- Row 1: Points Redeemed -->
          <div class="flex justify-between items-center text-xs py-1 border-b border-white/5">
            <span class="text-gray-400">Points Redeemed</span>
            <span class="text-white font-bold font-mono">⭐ {{ coupon()?.pointsValue?.toLocaleString() }} pts</span>
          </div>

          <!-- Row 2: Cash Value -->
          <div class="flex justify-between items-center text-xs py-1 border-b border-white/5">
            <span class="text-gray-400">Cash Value</span>
            <span class="text-emerald-400 font-bold font-mono">
              \${{ (coupon()?.usdValue || ((coupon()?.pointsValue || 0) / 100)) | number:'1.2-2' }} USD
            </span>
          </div>

          <!-- Row 3: Created -->
          <div class="flex justify-between items-center text-xs py-1 border-b border-white/5">
            <span class="text-gray-400">Created</span>
            <span class="text-gray-300 font-mono">{{ coupon()?.createdAt | date:'medium' }}</span>
          </div>

          <!-- Row 4: Restricted to -->
          <div class="flex justify-between items-center text-xs py-1">
            <span class="text-gray-400">Restricted to</span>
            <span class="text-purple-300 font-medium flex items-center gap-1">
              📍 {{ coupon()?.countryCode || 'Egypt, Cairo' }}
            </span>
          </div>
        </div>

        <!-- Refund Warning Card (Conditional Render) -->
        @if (timeRemaining() && coupon()?.status !== 'Redeemed' && coupon()?.status !== 'Refunded' && coupon()?.status !== 'Cancelled') {
          <div class="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 mb-8 shadow-xl">
            <div class="flex items-center gap-2 text-xs text-gray-300 font-medium">
              <span>⏱️</span>
              <span>Refund available for:</span>
            </div>

            <div class="text-xl font-bold font-mono text-orange-400 mt-1">
              {{ timeRemaining() }}
            </div>

            <button 
              (click)="cancelAndRefund()" 
              [disabled]="isRefunding()"
              class="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-black rounded-xl py-3 text-sm font-bold mt-4 mb-2 flex justify-center items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              @if (isRefunding()) {
                <span class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                <span>Processing Refund...</span>
              } @else {
                <span>⚠️ CANCEL CODE & REFUND POINTS</span>
              }
            </button>

            <p class="text-[11px] text-orange-400/80 text-center font-normal">
              This action is irreversible. Points will be returned to your wallet within minutes.
            </p>
          </div>
        }

        <!-- Footer Back Link -->
        <div class="flex justify-center mt-6">
          <button 
            (click)="goBack()" 
            class="text-gray-400 text-xs tracking-widest uppercase hover:text-white transition-colors cursor-pointer font-mono"
          >
            ← Back to Codes
          </button>
        </div>

      } @else {
        <!-- Loading State -->
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 gap-3">
          <div class="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p class="text-xs text-gray-400">Loading code details...</p>
        </div>
      }
    </div>
  `
})
export class CodeDetailsComponent implements OnInit, OnDestroy {
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public couponService = inject(CouponService);

  public coupon = signal<CouponDto | null>(null);
  public timeRemaining = signal<string | null>(null);
  public isRefunding = signal<boolean>(false);
  public copied = signal<boolean>(false);
  public toastMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  private timerRef: any = null;

  ngOnInit(): void {
    const navState = this.router.getCurrentNavigation()?.extras?.state as { coupon?: CouponDto } | undefined;
    const historyState = history.state as { coupon?: CouponDto } | undefined;
    const foundState = navState?.coupon || historyState?.coupon;

    const id = this.route.snapshot.paramMap.get('id');

    if (foundState) {
      this.coupon.set(foundState);
      this.initCountdown(foundState);
    } else if (id) {
      // Find in CouponService memory or fetch list
      const matched = this.couponService.coupons().find(c => (c.couponId || c.id) === id);
      if (matched) {
        this.coupon.set(matched);
        this.initCountdown(matched);
      } else {
        this.couponService.getUserCoupons().subscribe((res) => {
          const loaded = this.couponService.coupons().find(c => (c.couponId || c.id) === id);
          if (loaded) {
            this.coupon.set(loaded);
            this.initCountdown(loaded);
          } else {
            // Fallback demo object if accessed directly
            const fallback: CouponDto = {
              couponId: id,
              code: 'WXYZ-1234-ABCD-5678',
              pointsValue: 500,
              usdValue: 5.00,
              status: 'Fulfilled',
              createdAt: new Date().toISOString(),
              countryCode: 'Egypt, Cairo'
            };
            this.coupon.set(fallback);
            this.initCountdown(fallback);
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  private initCountdown(c: CouponDto): void {
    if (!c.createdAt) return;
    if (c.status === 'Redeemed' || c.status === 'Refunded' || c.status === 'Cancelled') {
      this.timeRemaining.set(null);
      return;
    }

    const createdMs = new Date(c.createdAt).getTime();
    const deadlineMs = createdMs + (2 * 60 * 60 * 1000); // 2 hours window

    const updateTimer = () => {
      const diff = deadlineMs - Date.now();
      if (diff <= 0) {
        this.timeRemaining.set(null);
        if (this.timerRef) clearInterval(this.timerRef);
      } else {
        const totalSecs = Math.floor(diff / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        this.timeRemaining.set(`${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    updateTimer();
    this.timerRef = setInterval(updateTimer, 1000);
  }

  cancelAndRefund(): void {
    const c = this.coupon();
    if (!c) return;
    const id = c.couponId || c.id || '';

    this.isRefunding.set(true);
    this.errorMessage.set(null);
    this.toastMessage.set(null);

    this.couponService.refundCoupon(id).subscribe({
      next: (res) => {
        const refundedPts = res?.pointsRefunded || c.pointsValue;
        this.authService.pointsBalance.update(b => b + refundedPts);

        // Update local status to Refunded/Cancelled
        this.coupon.update(existing => existing ? { ...existing, status: 'Refunded' } : null);
        this.timeRemaining.set(null);
        if (this.timerRef) clearInterval(this.timerRef);

        this.toastMessage.set(`Coupon cancelled successfully! ${refundedPts.toLocaleString()} points returned to your balance.`);
        this.isRefunding.set(false);
      },
      error: (err) => {
        console.error('Refund error:', err);
        const msg = err?.error?.message || err?.error || 'Failed to refund coupon. Please try again.';
        this.errorMessage.set(msg);
        this.isRefunding.set(false);
      }
    });
  }

  copyCode(): void {
    const c = this.coupon();
    if (c?.code) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(c.code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = c.code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
  }

  getBadgeColor(status?: string): string {
    const s = status?.toLowerCase();
    if (s === 'fulfilled') return 'bg-emerald-400';
    if (s === 'redeemed') return 'bg-purple-400';
    if (s === 'refunded' || s === 'cancelled') return 'bg-orange-400';
    return 'bg-blue-400';
  }

  goBack(): void {
    this.router.navigate(['/create-code']);
  }
}
