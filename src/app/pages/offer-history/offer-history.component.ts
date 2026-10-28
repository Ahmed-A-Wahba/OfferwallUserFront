import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { OfferService } from '../../core/services/offer.service';
import { OfferProgressDto } from '../../core/models/offer.model';

@Component({
  selector: 'app-offer-history',
  standalone: true,
  imports: [CommonModule, BottomNavComponent],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white p-5 pb-28 relative">

      <!-- Header -->
      <header class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <button
            (click)="goBack()"
            class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
          >
            ←
          </button>
          <h1 class="text-xl font-bold font-sora text-white">My Offers</h1>
        </div>
        <p class="text-sm text-gray-400 mt-2 mb-1 ml-12">Track your achievements in last 7 days</p>
      </header>

      <!-- Loading Spinner -->
      @if (isLoading()) {
        <div class="flex flex-col items-center justify-center py-16 gap-3">
          <div class="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p class="text-xs text-gray-400 animate-pulse">Loading your offers...</p>
        </div>
      } @else {

        <!-- Empty State -->
        @if (inProgressOffers().length === 0 && completedOffers().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-3xl">
              🎯
            </div>
            <h3 class="text-base font-bold text-gray-300">No offers in the last 7 days</h3>
            <p class="text-xs text-gray-500 max-w-xs">Start engaging with offers from the dashboard to track your progress here.</p>
            <button
              (click)="router.navigate(['/dashboard'])"
              class="mt-2 px-5 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl transition-all"
            >
              Browse Offers →
            </button>
          </div>
        } @else {

          <!-- ─── IN PROGRESS SECTION ─── -->
          @if (inProgressOffers().length > 0) {
            <section class="mb-6">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_theme(colors.purple.500)] shrink-0"></div>
                <h2 class="text-lg font-bold text-white">In Progress</h2>
                <span class="text-xs text-purple-300 font-mono ml-1">({{ inProgressOffers().length }})</span>
              </div>

              @for (offer of inProgressOffers(); track offer.clickId) {
                <div class="bg-[#12121E] border border-white/5 rounded-2xl p-4 my-4 hover:border-purple-500/20 transition-all shadow-md">
                  <!-- Top Row -->
                  <div class="flex justify-between items-start gap-3">
                    <!-- Left: Icon + Name -->
                    <div class="flex items-center gap-3 min-w-0">
                      @if (offer.logoUrl) {
                        <img [src]="offer.logoUrl" [alt]="offer.name || offer.title" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                      } @else {
                        <div class="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-xl shrink-0">
                          🎮
                        </div>
                      }
                      <h3 class="text-base font-semibold text-white truncate">{{ offer.name || offer.title }}</h3>
                    </div>

                    <!-- Right: Points + Badge -->
                    <div class="text-right shrink-0">
                      <div class="text-lg font-bold font-mono text-white">{{ offer.pointsReward }} pts</div>
                      <div class="bg-white/5 text-purple-300 text-[10px] px-2 py-1 rounded-full w-fit ml-auto mt-1 flex items-center gap-1 border border-purple-500/15">
                        <span class="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        <span>IN PROGRESS</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Row: Step Info + Percentage -->
                  @if (offer.completedSteps !== undefined && offer.totalSteps !== undefined) {
                    <div class="flex justify-between items-center mt-3">
                      <span class="text-xs text-gray-400">Step {{ offer.completedSteps }} of {{ offer.totalSteps }}</span>
                      <span class="text-xs text-gray-400 font-mono">{{ offer.progressPercentage | number:'1.0-0' }}%</span>
                    </div>
                  }

                  <!-- Progress Bar -->
                  <div class="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div
                      class="h-full bg-purple-500 rounded-full transition-all duration-500 shadow-[0_0_6px_theme(colors.purple.500)]"
                      [style.width.%]="offer.progressPercentage"
                    ></div>
                  </div>
                </div>
              }
            </section>
          }

          <!-- ─── COMPLETED SECTION ─── -->
          @if (completedOffers().length > 0) {
            <section>
              <div class="flex items-center gap-2 mb-1 mt-8">
                <div class="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs shrink-0">✓</div>
                <h2 class="text-lg font-bold text-white">Completed</h2>
                <span class="text-xs text-emerald-400 font-mono ml-1">({{ completedOffers().length }})</span>
              </div>

              @for (offer of completedOffers(); track offer.clickId) {
                <div class="bg-[#12121E] border border-white/5 rounded-2xl p-4 my-4 hover:border-emerald-500/20 transition-all shadow-md">
                  <!-- Top Row -->
                  <div class="flex justify-between items-start gap-3">
                    <!-- Left: Icon + Name -->
                    <div class="flex items-center gap-3 min-w-0">
                      @if (offer.logoUrl) {
                        <img [src]="offer.logoUrl" [alt]="offer.name || offer.title" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                      } @else {
                        <div class="w-12 h-12 rounded-xl bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                          🏆
                        </div>
                      }
                      <h3 class="text-base font-semibold text-white truncate">{{ offer.name || offer.title }}</h3>
                    </div>

                    <!-- Right: Points Earned + Badge -->
                    <div class="text-right shrink-0">
                      <div class="text-base font-bold font-mono text-emerald-400">+{{ offer.pointsReward }} PTS EARNED</div>
                      <div class="text-emerald-500 text-[10px] ml-auto mt-1 flex items-center justify-end gap-1 font-bold">
                        <span>✓ COMPLETED</span>
                      </div>
                    </div>
                  </div>

                  <!-- Full Green Progress Bar -->
                  <div class="w-full h-1.5 bg-emerald-500 rounded-full mt-4 shadow-[0_0_6px_theme(colors.emerald.500)]"></div>
                </div>
              }
            </section>
          }

        }
      }

      <!-- Bottom Sticky Navigation Footer -->
      <app-bottom-nav activeTab="offer-history"></app-bottom-nav>
    </div>
  `
})
export class OfferHistoryComponent implements OnInit {
  private location = inject(Location);
  public router = inject(Router);
  private offerService = inject(OfferService);

  public inProgressOffers = signal<OfferProgressDto[]>([]);
  public completedOffers = signal<OfferProgressDto[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.offerService.getMyOffers(7).subscribe((res) => {
      if (res) {
        this.inProgressOffers.set(res.inProgress || []);
        this.completedOffers.set(res.completed || []);
      } else {
        // Keep empty arrays on error
        this.inProgressOffers.set([]);
        this.completedOffers.set([]);
      }
      this.isLoading.set(false);
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
