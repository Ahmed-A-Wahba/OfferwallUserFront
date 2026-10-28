import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { AuthService } from '../../core/services/auth.service';
import { CouponService } from '../../core/services/coupon.service';
import { CouponDto } from '../../core/models/coupon.model';

@Component({
  selector: 'app-create-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BottomNavComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe
  ],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white relative pb-28 px-5 pt-6">
      
      <!-- Top Header Navigation -->
      <header class="flex items-center gap-4 mb-6">
        <button 
          (click)="goBack()"
          class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
        >
          ←
        </button>
        <h1 class="font-sora font-bold text-xl text-white">Redeem Points</h1>
      </header>

      <!-- Feedback Banner Messages -->
      @if (toastMessage()) {
        <div class="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-fade-in">
          <span>✓ {{ toastMessage() }}</span>
          <button (click)="toastMessage.set(null)" class="text-emerald-400 font-bold ml-2">✕</button>
        </div>
      }

      @if (errorMessage()) {
        <div class="mb-4 p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between animate-fade-in">
          <span>⚠️ {{ errorMessage() }}</span>
          <button (click)="errorMessage.set(null)" class="text-red-400 font-bold ml-2">✕</button>
        </div>
      }

      <!-- Redeem Form Card -->
      <div class="bg-[#12121E] rounded-3xl p-5 border border-white/5 mb-8 shadow-xl relative overflow-hidden">
        <!-- Top Right Available Balance Badge -->
        <div class="bg-purple-900/40 text-purple-300 text-xs px-3 py-1 rounded-full w-fit ml-auto border border-purple-500/20 font-mono font-medium">
          Available: {{ authService.pointsBalance().toLocaleString() }} pts
        </div>

        <div class="mt-2 mb-4">
          <h2 class="font-sora font-bold text-lg text-white">Convert Points to Cash</h2>
          <p class="text-xs text-gray-400 mt-0.5">Enter the amount of points you want to redeem</p>
        </div>

        <!-- Large Points Input Field -->
        <div class="my-4 relative">
          <input 
            type="number" 
            [(ngModel)]="pointsInputValue" 
            (ngModelChange)="onPointsInputChange($event)"
            placeholder="0" 
            min="1"
            class="w-full bg-[#090814] border border-white/10 rounded-2xl py-4 px-5 text-center text-3xl font-bold font-mono text-purple-300 placeholder-zinc-700 focus:outline-none focus:border-purple-500 transition-colors" 
          />
        </div>

        <!-- Estimated USD Conversion -->
        <p class="text-center text-xs text-zinc-400 font-medium">
          ≈ {{ estimatedUsd | currency:'USD':'symbol':'1.2-2' }} USD
        </p>

        <!-- Submit Action Button -->
        <button 
          (click)="handleRedeem()" 
          [disabled]="isRedeeming() || !pointsInput() || (pointsInput() || 0) <= 0"
          class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 active:scale-98 rounded-2xl py-4 text-lg font-bold mt-4 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          @if (isRedeeming()) {
            <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Processing...</span>
          } @else {
            <span>Redeem →</span>
          }
        </button>
      </div>

      <!-- Redemption History Section -->
      <section class="space-y-4">
        <h2 class="font-jetbrains font-bold text-xs tracking-[0.2em] uppercase text-[#CCC3D8]/80">
          REDEMPTION HISTORY
        </h2>

        <!-- Summary Card -->
        <div class="bg-gradient-to-r from-[#241747] to-[#132647] rounded-2xl p-5 flex justify-between items-center mb-4 border border-white/5 shadow-lg">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-purple-300/70 tracking-wider uppercase font-jetbrains">TOTAL REDEEMED</span>
            <p class="text-2xl font-bold font-sora text-white">
              {{ (couponService.summary()?.totalRedeemedPoints || 0).toLocaleString() }} <span class="text-xs text-purple-300 font-normal">pts</span>
            </p>
          </div>

          <div class="space-y-1 text-right">
            <span class="text-[10px] font-bold text-purple-300/70 tracking-wider uppercase font-jetbrains">TOTAL REDEMPTIONS</span>
            <p class="text-2xl font-bold font-sora text-white">
              {{ couponService.summary()?.totalRedemptions || 0 }}
            </p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 mb-4">
          @for (tab of tabs; track tab) {
            <button 
              (click)="handleTabSwitch(tab)"
              [class.bg-purple-600]="activeTab() === tab"
              [class.text-white]="activeTab() === tab"
              [class.font-bold]="activeTab() === tab"
              [class.bg-white\/5]="activeTab() !== tab"
              [class.text-gray-400]="activeTab() !== tab"
              class="px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              {{ tab }}
            </button>
          }
        </div>

        <!-- Coupons List -->
        <div class="space-y-3">
          @for (coupon of couponService.coupons(); track (coupon.couponId || coupon.id || $index)) {
            <div 
              (click)="openCouponDetails(coupon)"
              class="bg-[#12121E] rounded-2xl p-4 border border-white/5 flex gap-4 mb-3 items-center justify-between shadow-md hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <!-- Icon & Details -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold group-hover:scale-105 transition-transform">
                  ✓
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                    {{ coupon.pointsValue.toLocaleString() }} pts → \${{ (coupon.usdValue || (coupon.pointsValue / 100)) | number:'1.2-2' }} USD
                  </p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    {{ coupon.createdAt | date:'mediumDate' }} · {{ coupon.countryCode || 'Global' }}
                  </p>
                </div>
              </div>

              <!-- Status Badge -->
              <div class="shrink-0">
                @if (coupon.status.toLowerCase() === 'fulfilled') {
                  <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Fulfilled
                  </span>
                } @else if (coupon.status.toLowerCase() === 'redeemed') {
                  <span class="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Redeemed
                  </span>
                } @else {
                  <span class="bg-zinc-500/20 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {{ coupon.status }}
                  </span>
                }
              </div>
            </div>
          } @empty {
            @if (!couponService.isLoading()) {
              <div class="p-8 text-center bg-[#12121E] border border-white/5 rounded-2xl">
                <p class="text-xs text-zinc-400">No redemption history found.</p>
              </div>
            } @else {
              <div class="flex justify-center items-center py-8">
                <div class="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            }
          }
        </div>
      </section>

      <!-- Bottom Sticky Navigation Footer -->
      <app-bottom-nav activeTab="create-code"></app-bottom-nav>
    </div>
  `
})
export class CreateCodeComponent implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  public authService = inject(AuthService);
  public couponService = inject(CouponService);

  public pointsInput = signal<number | null>(null);
  public pointsInputValue: number | null = null;
  public activeTab = signal<'All' | 'Fulfilled' | 'Redeemed'>('All');
  public isRedeeming = signal<boolean>(false);
  public toastMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  public readonly tabs: Array<'All' | 'Fulfilled' | 'Redeemed'> = ['All', 'Fulfilled', 'Redeemed'];

  get estimatedUsd(): number {
    return ((this.pointsInput() || 0) / 100);
  }

  ngOnInit(): void {
    this.couponService.getUserCoupons().subscribe();
  }

  onPointsInputChange(val: any): void {
    const num = Number(val);
    this.pointsInput.set(isNaN(num) || num <= 0 ? null : num);
  }

  handleRedeem(): void {
    const points = this.pointsInput();
    if (!points || points <= 0) {
      this.errorMessage.set('Please enter a valid points amount.');
      return;
    }

    if (points > this.authService.pointsBalance()) {
      this.errorMessage.set('Insufficient points balance.');
      return;
    }

    this.isRedeeming.set(true);
    this.errorMessage.set(null);
    this.toastMessage.set(null);

    this.couponService.redeemPoints(points).subscribe({
      next: (res) => {
        const newBal = res?.newBalance ?? Math.max(0, this.authService.pointsBalance() - points);
        this.authService.pointsBalance.set(newBal);

        this.pointsInput.set(null);
        this.pointsInputValue = null;
        this.isRedeeming.set(false);

        const couponData = {
          code: res?.code || 'WXYZ-1234-ABCD-5678',
          pointsValue: points,
          usdValue: res?.usdValue || (points / 100),
          couponId: res?.couponId || res?.id
        };

        this.router.navigate(['/coupon-success'], { state: { coupon: couponData } });
      },
      error: (err) => {
        console.error('Redeem failed:', err);
        const msg = err?.error?.message || err?.error || 'Failed to redeem points. Please try again.';
        this.errorMessage.set(msg);
        this.isRedeeming.set(false);
      }
    });
  }

  handleTabSwitch(tab: 'All' | 'Fulfilled' | 'Redeemed'): void {
    this.activeTab.set(tab);
    const statusParam = tab === 'All' ? undefined : tab;
    this.couponService.getUserCoupons(statusParam).subscribe();
  }

  goBack(): void {
    this.location.back();
  }

  openCouponDetails(coupon: CouponDto): void {
    const id = coupon.couponId || coupon.id || '';
    this.router.navigate(['/code-details', id], { state: { coupon } });
  }
}
