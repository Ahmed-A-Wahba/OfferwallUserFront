import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDto } from '../../../core/models/offer.model';

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (variant === 'carousel') {
      <!-- Carousel Variant (Handpicked For You) -->
      <div 
        [class.opacity-60]="offer.status === 'CLAIMED'"
        class="bg-[#1A1A2E] rounded-2xl p-4 flex flex-col justify-between border border-white/5 relative w-64 h-[220px] shrink-0 shadow-lg hover:-translate-y-1 transition-transform overflow-hidden"
      >
        <!-- Top Banner Header -->
        <div class="h-[110px] w-full rounded-xl relative flex items-center justify-center p-3 bg-gradient-to-br" [ngClass]="getGradientBg(offer)">
          <!-- Icon / Thumbnail Graphic (Constrained) -->
          @if (offer.logoUrl) {
            <img [src]="offer.logoUrl" [alt]="offer.title" class="w-12 h-12 max-w-[48px] max-h-[48px] rounded-xl object-contain shadow-md" />
          } @else {
            <div class="w-12 h-12 max-w-[48px] max-h-[48px] rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner">
              🎮
            </div>
          }

          <!-- Status Badge (Top-Left) -->
          @if (offer.status === 'IN_PROGRESS') {
            <div class="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 border border-white/20 text-white font-bold text-[10px] shadow-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>IN PROGRESS</span>
            </div>
          }

          <!-- Points Badge (Top-Right) -->
          <div class="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-950 font-bold text-xs shadow-sm">
            <span>🪙</span>
            <span>+{{ offer.pointsReward }} pts</span>
          </div>

          <!-- Claimed Overlay -->
          @if (offer.status === 'CLAIMED') {
            <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
              <span class="px-3 py-1 rounded-full bg-emerald-500/90 text-white font-bold text-xs uppercase tracking-wider">Claimed ✓</span>
            </div>
          }
        </div>

        <!-- Bottom Details Panel -->
        <div class="flex-1 flex flex-col justify-between pt-2">
          <div>
            <h3 
              [class.line-through]="offer.status === 'CLAIMED'"
              class="font-jetbrains font-bold text-sm text-[#E3E0F2] truncate"
            >
              {{ offer.title }}
            </h3>
            <p class="text-xs text-[#CCC3D8]/80 line-clamp-1 mt-0.5">{{ offer.description }}</p>
          </div>

          <!-- Action Button -->
          @if (offer.status === 'CLAIMED') {
            <div class="w-full py-1.5 bg-[#343341] rounded-lg text-center font-bold text-xs text-[#CCC3D8] uppercase tracking-wider">
              CLAIMED
            </div>
          } @else {
            <button 
              (click)="onAction.emit(offer)"
              class="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#D2BBFF] hover:from-[#6D28D9] hover:to-[#C084FC] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-opacity"
            >
              <span>Quick Start</span>
              <svg width="14" height="14" class="w-3.5 h-3.5 max-w-[14px] max-h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          }
        </div>
      </div>
    } @else {
      <!-- List Variant (ALL OFFERS) -->
      <div class="bg-[#1A1A2E] rounded-2xl p-3 flex items-center justify-between gap-3 border border-white/5 relative w-full h-24 shadow-md hover:border-white/15 transition-all">
        <!-- Thumbnail / Graphic Box (Constrained) -->
        <div class="w-16 h-full rounded-xl bg-gradient-to-br flex flex-col items-center justify-center relative overflow-hidden shrink-0" [ngClass]="getGradientBg(offer)">
          @if (offer.logoUrl) {
            <img [src]="offer.logoUrl" [alt]="offer.title" class="w-8 h-8 max-w-[32px] max-h-[32px] rounded-lg object-contain" />
          } @else {
            <span class="text-lg">🏆</span>
          }
          <div class="mt-0.5 px-1.5 py-0.5 rounded-full bg-black/40 text-amber-300 font-bold text-[9px]">
            +{{ offer.pointsReward }} pts
          </div>
        </div>

        <!-- Middle Info -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
          <h4 class="font-jetbrains font-bold text-sm text-white truncate">{{ offer.title }}</h4>
          <p class="text-xs text-gray-400 line-clamp-1 mt-0.5">{{ offer.description }}</p>
          <span class="text-xs text-purple-300 font-medium mt-1">+{{ offer.pointsReward }} pts</span>
        </div>

        <!-- Action / Status Right Column -->
        <div class="flex flex-col items-end justify-between h-full py-0.5 shrink-0">
          @if (offer.status === 'IN_PROGRESS') {
            <span class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[9px] uppercase">In Progress</span>
          } @else if (offer.status === 'CLAIMED') {
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase">Done ✓</span>
          } @else {
            <span></span>
          }

          <button 
            (click)="onAction.emit(offer)"
            class="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-white font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <span>Details</span>
            <svg width="12" height="12" class="w-3 h-3 max-w-[12px] max-h-[12px] text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class OfferCardComponent {
  @Input() offer!: OfferDto;
  @Input() variant: 'carousel' | 'list' = 'carousel';
  @Output() onAction = new EventEmitter<OfferDto>();

  getGradientBg(offer: OfferDto): string {
    const title = offer.title.toLowerCase();
    if (title.includes('galactic')) return 'from-purple-600 to-pink-600';
    if (title.includes('neon')) return 'from-teal-500 to-emerald-600';
    if (title.includes('royal') || title.includes('shop')) return 'from-orange-500 to-red-600';
    if (title.includes('goal')) return 'from-purple-500 to-pink-600';
    if (title.includes('trivia')) return 'from-blue-500 to-indigo-600';
    return 'from-indigo-600 to-purple-600';
  }
}
