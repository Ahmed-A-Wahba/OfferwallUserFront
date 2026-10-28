import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { BalanceCardComponent } from '../../shared/components/balance-card/balance-card.component';
import { OfferCardComponent } from '../../shared/components/offer-card/offer-card.component';
import { BottomNavComponent, NavTab } from '../../shared/components/bottom-nav/bottom-nav.component';
import { AuthService } from '../../core/services/auth.service';
import { OfferService } from '../../core/services/offer.service';
import { OfferDto } from '../../core/models/offer.model';

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BalanceCardComponent,
    OfferCardComponent,
    BottomNavComponent
  ],
  template: `
    @if (!authService.error() && authService.isInitialized()) {
      <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white relative pb-28 overflow-x-hidden border-x border-white/5 shadow-2xl">
        <!-- Atmospheric Background Glow Effects (Figma Node #6:1171 & #6:1172) -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[277px] bg-[#D2BBFF]/20 blur-[60px] pointer-events-none rounded-full"></div>
        <div class="absolute bottom-20 right-0 w-[250px] h-[250px] bg-[#0053DB]/20 blur-[50px] pointer-events-none rounded-full"></div>

        <!-- Top Header Navigation -->
        <app-header 
          [pointsBalance]="authService.pointsBalance()"
          [publisherName]="authService.publisherName()"
          [publisherLogoUrl]="authService.publisherLogoUrl()"
        ></app-header>

        <!-- Main Scrollable Body Container -->
        <main class="w-full px-5 pt-20 flex flex-col gap-6 relative z-10">
          
          <!-- Section 1: Balance Card -->
          <app-balance-card
            [pointsBalance]="authService.pointsBalance()"
            [userXp]="authService.userXp()"
            (onRedeem)="handleRedeem()"
          ></app-balance-card>

          <!-- Section 2: Handpicked For You Carousel -->
          @if (offerService.handpickedOffers().length > 0) {
            <section class="space-y-3">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-purple-300 text-lg">✨</span>
                  <h2 class="font-sora font-bold text-xl text-[#E3E0F2]">Handpicked For You</h2>
                </div>
                <p class="text-xs text-[#CCC3D8]/80 font-normal">Most enjoyable offers tailored for you</p>
              </div>

              <!-- Horizontal Carousel Container -->
              <div class="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-5 px-5 snap-x">
                @for (offer of offerService.handpickedOffers(); track offer.offerId) {
                  <div class="snap-start shrink-0">
                    <app-offer-card 
                      [offer]="offer" 
                      [variant]="'carousel'" 
                      (onAction)="handleOfferAction($event)"
                    ></app-offer-card>
                  </div>
                }
              </div>
            </section>
          }

          <!-- Section 3: ALL OFFERS Vertical List -->
          <section class="space-y-3">
            <div class="space-y-0.5">
              <h3 class="font-jetbrains font-bold text-xs tracking-[0.2em] uppercase text-[#CCC3D8]/80">ALL OFFERS</h3>
              <p class="text-xs text-orange-400 font-medium italic">🔥 Complete these to level up faster!</p>
            </div>

            <!-- Vertical Cards List -->
            <div class="flex flex-col gap-3">
              @for (offer of offerService.regularOffers(); track offer.offerId) {
                <app-offer-card 
                  [offer]="offer" 
                  [variant]="'list'" 
                  (onAction)="handleOfferAction($event)"
                ></app-offer-card>
              } @empty {
                @if (!offerService.isLoading()) {
                  <div class="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p class="text-sm text-zinc-400">No offers available at the moment.</p>
                  </div>
                }
              }
            </div>

            <!-- Infinite Scroll Loading Spinner -->
            @if (offerService.isLoadingMore()) {
              <div class="flex justify-center items-center py-6">
                <svg class="animate-spin h-7 w-7 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            }
          </section>
        </main>

        <!-- Bottom Sticky Navigation Footer -->
        <app-bottom-nav [activeTab]="activeTab"></app-bottom-nav>
      </div>
    } @else if (authService.error()) {
      <!-- Full-Page Blocking Error Screen -->
      <div class="min-h-screen w-full bg-[#080810] text-white flex items-center justify-center p-5 relative overflow-hidden">
        <!-- Ambient Red & Purple Background Glows -->
        <div class="absolute w-[350px] h-[350px] bg-red-600/15 blur-[90px] rounded-full pointer-events-none"></div>
        <div class="absolute w-[250px] h-[250px] bg-purple-600/10 blur-[80px] rounded-full pointer-events-none -top-10 -left-10"></div>

        <!-- Striking Error Card -->
        <div class="relative z-10 max-w-md w-full bg-[#130B14]/90 backdrop-blur-2xl border border-red-500/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center flex flex-col items-center gap-5">
          <!-- Warning Icon Badge -->
          <div class="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl shadow-inner shadow-red-500/20 animate-pulse">
            ⚠️
          </div>

          <div class="space-y-1.5">
            <h2 class="text-2xl font-bold font-sora text-red-400 tracking-tight">Access Denied</h2>
            <p class="text-xs text-zinc-400">Unable to authorize session for this offerwall</p>
          </div>

          <!-- Error Message Display -->
          <div class="w-full bg-red-950/40 border border-red-500/25 rounded-2xl p-4 text-xs text-red-200 font-mono break-words leading-relaxed">
            {{ authService.error() }}
          </div>

          <p class="text-[11px] text-zinc-500 max-w-xs">
            Please ensure you accessed this dashboard with valid publisher and user credentials.
          </p>
        </div>
      </div>
    } @else {
      <!-- Loading State Spinner -->
      <div class="min-h-screen w-full bg-[#080810] text-white flex flex-col items-center justify-center p-4 gap-4">
        <div class="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        <p class="text-xs text-purple-300/70 font-medium tracking-wide animate-pulse">Initializing Offerwall...</p>
      </div>
    }
  `
})
export class UsersDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  public offerService = inject(OfferService);

  public activeTab: NavTab = 'offers';
  private isFetchingNextPage = false;

  ngOnInit(): void {
    if (this.authService.isInitialized()) {
      if (this.offerService.regularOffers().length === 0) {
        this.offerService.getOffers(1).subscribe();
      }
      return;
    }

    // Extract query parameters for pub_id and user_id strictly
    this.route.queryParams.subscribe((params: Params) => {
      const pubId = params['pub_id'] || params['pubId'];
      const userId = params['user_id'] || params['userId'];

      if (!pubId || !userId) {
        this.authService.error.set('Missing Publisher ID or User ID');
        return;
      }

      this.authService.initDashboard(pubId, userId).subscribe((res) => {
        if (res) {
          this.offerService.getOffers(1).subscribe();
        }
      });
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = (window.innerHeight || document.documentElement.clientHeight) + (window.scrollY || document.documentElement.scrollTop);
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    const distanceToBottom = scrollHeight - scrollPosition;

    if (distanceToBottom <= 200) {
      if (!this.offerService.isLoadingMore() && !this.offerService.isLoading() && this.offerService.hasMore() && !this.isFetchingNextPage) {

        this.isFetchingNextPage = true;
        const nextPage = this.offerService.currentPage() + 1;

        this.offerService.getOffers(nextPage).subscribe({
          next: () => {
            this.isFetchingNextPage = false;
          },
          error: () => {
            this.isFetchingNextPage = false;
          }
        });
      }
    }
  }

  handleRedeem(): void {
    this.router.navigate(['/create-code']);
  }

  handleOfferAction(offer: OfferDto): void {
    this.offerService.selectedOffer.set(offer);
    this.router.navigate(['/offer', offer.offerId]);
  }

}
