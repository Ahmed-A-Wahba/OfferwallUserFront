import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomNavComponent, NavTab } from '../../shared/components/bottom-nav/bottom-nav.component';
import { OfferService } from '../../core/services/offer.service';
import { OfferDto } from '../../core/models/offer.model';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white relative pb-28 px-4 pt-4">
      @if (offer) {
        <!-- Header Bar -->
        <header class="flex items-center justify-between gap-3 py-3 border-b border-white/5 mb-2">
          <button 
            (click)="goBack()"
            class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
          >
            ←
          </button>
          
          <h1 class="font-sora font-bold text-base text-white truncate max-w-[200px]">
            {{ offer.title }}
          </h1>

          <span class="bg-[#1D1B2E] text-[10px] px-3 py-1 rounded-full text-purple-300 tracking-wider font-mono uppercase shrink-0">
            {{ offer.platform || offer.deviceName || 'WEB' }}
          </span>
        </header>

        <!-- Hero Card -->
        <div class="bg-gradient-to-b from-[#241747] via-[#130E26] to-[#080810] rounded-3xl p-8 flex flex-col items-center justify-center relative my-3 shadow-inner text-center">
          <div class="mb-4">
            @if (offer.logoUrl) {
              <img [src]="offer.logoUrl" [alt]="offer.title" class="w-28 h-28 rounded-2xl object-cover shadow-2xl border border-white/10" />
            } @else {
              <div class="w-28 h-28 rounded-2xl bg-purple-900/40 border border-purple-500/20 flex items-center justify-center text-4xl text-purple-300 shadow-2xl">
                🎮
              </div>
            }
          </div>

          <h2 class="font-sora font-bold text-2xl text-white mb-1">
            {{ offer.title }}
          </h2>
          
          <p class="text-xs text-gray-400 max-w-xs mb-4 leading-relaxed">
            {{ offer.description }}
          </p>

          <div class="text-3xl font-bold text-[#D2BBFF] font-mono tracking-tight">
            +{{ offer.pointsReward }} pts
          </div>
        </div>

        <!-- Tasks List Section (activities) -->
        <section class="mt-6 space-y-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-jetbrains font-bold text-xs tracking-[0.2em] uppercase text-[#CCC3D8]/80">
              OFFER ACTIVITIES
            </h3>
            @if (offer.activities && offer.activities.length > 0) {
              <span class="text-xs text-purple-400 font-medium">
                {{ offer.activities.length }} Steps
              </span>
            }
          </div>

          <div class="space-y-3">
            @for (activity of offer.activities; track activity.eventId; let i = $index) {
              <div class="bg-[#121121] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 mb-3 hover:border-purple-500/30 transition-all">
                <!-- Step Number Badge -->
                <div class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-purple-300 border border-white/10 shrink-0">
                  {{ (i + 1) < 10 ? '0' + (i + 1) : (i + 1) }}
                </div>

                <!-- Activity Title -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-semibold text-gray-200 truncate">
                    {{ activity.name }}
                  </h4>
                </div>

                <!-- Points Badge -->
                <div class="text-xs font-bold text-purple-300 font-mono shrink-0">
                  +{{ activity.pointsReward }} pts
                </div>
              </div>
            } @empty {
              <div class="p-6 text-center bg-[#121121] border border-white/5 rounded-2xl">
                <p class="text-xs text-gray-400">No specific activities listed for this offer.</p>
              </div>
            }
          </div>
        </section>

        <!-- Error Toast -->
        @if (errorMessage()) {
          <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4 bg-red-900/90 backdrop-blur-md border border-red-500/40 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl animate-fade-in">
            <span class="text-red-300 text-lg shrink-0">⚠️</span>
            <p class="text-sm text-red-200 flex-1">{{ errorMessage() }}</p>
            <button (click)="errorMessage.set(null)" class="text-red-400 hover:text-red-200 text-lg font-bold shrink-0">×</button>
          </div>
        }

        <!-- Sticky Start Offer CTA Button -->
        <div class="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
          <button
            id="start-offer-btn"
            (click)="startOffer()"
            [disabled]="isStarting()"
            class="w-full py-4 rounded-2xl font-sora font-bold text-base text-white flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.4)] relative overflow-hidden
              bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700
              hover:from-purple-500 hover:via-violet-500 hover:to-purple-600
              hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]
              hover:scale-[1.02]
              active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            @if (isStarting()) {
              <!-- Spinner -->
              <svg class="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Starting Offer...</span>
            } @else {
              <!-- Rocket icon -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Start Offer & Earn Points</span>
            }
            <!-- Shimmer effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
          </button>
        </div>

      } @else {
        <!-- Fallback Loading State -->
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-3">
          <div class="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p class="text-xs text-gray-400">Loading offer details...</p>
        </div>
      }

      <!-- Bottom Sticky Navigation Footer -->
      <app-bottom-nav activeTab="offers"></app-bottom-nav>
    </div>
  `
})
export class OfferDetailsComponent implements OnInit {
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public offerService = inject(OfferService);

  public offer: OfferDto | null = null;
  public isStarting = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // 1. Check selectedOffer signal in OfferService
    const selected = this.offerService.selectedOffer();
    if (selected && (selected.offerId === id || !id)) {
      this.offer = selected;
      return;
    }

    // 2. Search in current loaded offer lists
    const found = [...this.offerService.handpickedOffers(), ...this.offerService.regularOffers()]
      .find(o => o.offerId === id);

    if (found) {
      this.offer = found;
      this.offerService.selectedOffer.set(found);
    } else if (selected) {
      this.offer = selected;
    }
  }

  startOffer(): void {
    if (!this.offer || this.isStarting()) return;

    this.isStarting.set(true);
    this.errorMessage.set(null);

    const payload = {
      name: this.offer.title,
      logoUrl: this.offer.logoUrl || '',
      totalReward: this.offer.pointsReward,
      totalTasks: this.offer.activities?.length ?? 0
    };

    this.offerService.startOffer(this.offer.offerId, payload).subscribe({
      next: (res) => {
        if (res?.redirectUrl) {
          window.location.href = res.redirectUrl;
        } else {
          this.isStarting.set(false);
          this.errorMessage.set('Unable to start this offer. Please try again.');
        }
      },
      error: () => {
        this.isStarting.set(false);
        this.errorMessage.set('Something went wrong. Please try again later.');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
