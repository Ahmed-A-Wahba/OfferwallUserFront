import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportService } from '../../core/services/support.service';
import { TICKET_CATEGORIES } from '../../core/models/support.model';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto min-h-screen bg-[#080810] text-white p-5 pb-10">

      <!-- ── Header ── -->
      <header class="mb-1">
        <div class="flex items-center gap-3">
          <button
            (click)="goBack()"
            type="button"
            class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 font-bold"
          >
            ←
          </button>
          <h1 class="text-xl font-bold font-sora text-white">Support</h1>
        </div>
        <p class="text-sm text-gray-400 mt-2 mb-6 ml-12">We're here to help</p>
      </header>

      <!-- ── Success Banner ── -->
      @if (toastMessage()) {
        <div class="mb-5 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3 animate-fade-in">
          <span class="text-lg leading-none mt-0.5">✓</span>
          <div>
            <p class="font-bold text-emerald-300 text-sm">Ticket Submitted!</p>
            <p class="text-xs text-emerald-200/80 mt-0.5">{{ toastMessage() }}</p>
          </div>
          <button (click)="toastMessage.set(null)" class="ml-auto text-emerald-400 font-bold text-lg leading-none">✕</button>
        </div>
      }

      <!-- ── Error Banner ── -->
      @if (errorMessage()) {
        <div class="mb-5 p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {{ errorMessage() }}</span>
          <button (click)="errorMessage.set(null)" class="text-red-400 font-bold ml-2 text-base leading-none">✕</button>
        </div>
      }

      <!-- ── Form Card ── -->
      <form
        class="bg-[#12121E] border border-white/5 rounded-3xl p-5 shadow-xl"
        [formGroup]="supportForm"
        (ngSubmit)="onSubmit()"
      >

        <!-- Email -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Email Address *</label>
          <input
            type="email"
            formControlName="email"
            placeholder="your@email.com"
            class="w-full bg-transparent border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-zinc-600"
            [class.border-red-500/50]="isInvalid('email')"
          />
          @if (isInvalid('email')) {
            <p class="text-xs text-red-400 mt-1">Please enter a valid email address.</p>
          }
        </div>

        <!-- Category -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Category *</label>
          <div class="relative">
            <select
              formControlName="category"
              class="w-full bg-[#0D0C1A] border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors appearance-none cursor-pointer text-white"
              [class.border-red-500/50]="isInvalid('category')"
            >
              <option value="" disabled selected class="text-gray-500">Select a category...</option>
              @for (cat of categories; track cat.value) {
                <option [value]="cat.value" class="bg-[#12121E] text-white">{{ cat.label }}</option>
              }
            </select>
            <!-- Custom Chevron Arrow -->
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          @if (isInvalid('category')) {
            <p class="text-xs text-red-400 mt-1">Please select a category.</p>
          }
        </div>

        <!-- Subject -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Subject *</label>
          <input
            type="text"
            formControlName="subject"
            placeholder="Brief summary of your issue..."
            class="w-full bg-transparent border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-zinc-600"
            [class.border-red-500/50]="isInvalid('subject')"
          />
          @if (isInvalid('subject')) {
            <p class="text-xs text-red-400 mt-1">Subject is required.</p>
          }
        </div>

        <!-- Description -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Description *</label>
          <textarea
            formControlName="description"
            placeholder="Tell us what happened..."
            rows="5"
            class="w-full bg-transparent border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-zinc-600 min-h-[120px] resize-none"
            [class.border-red-500/50]="isInvalid('description')"
          ></textarea>
          @if (isInvalid('description')) {
            <p class="text-xs text-red-400 mt-1">Description is required.</p>
          }
        </div>

        <!-- Attach Screenshot -->
        <div class="mb-6">
          <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Attach Screenshot</label>
          <div class="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 transition-colors relative">
            <!-- Upload Icon -->
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
              @if (selectedFile()) {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              } @else {
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400">
                  <polyline points="16 16 12 12 8 16"></polyline>
                  <line x1="12" y1="12" x2="12" y2="21"></line>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                </svg>
              }
            </div>

            @if (selectedFile()) {
              <p class="text-xs text-emerald-300 font-mono mt-3 break-all px-2 font-semibold">📎 {{ selectedFile()?.name }}</p>
              <p class="text-[10px] text-gray-500 mt-1">Tap to change file</p>
            } @else {
              <p class="text-xs text-gray-400 mt-3">Tap to attach a screenshot <span class="text-gray-500">(optional)</span></p>
              <p class="text-[10px] text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
            }

            <!-- Hidden File Input -->
            <input
              type="file"
              class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              (change)="onFileSelected($event)"
              accept="image/*"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="supportForm.invalid || isSubmitting()"
          class="w-full bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 active:scale-98 rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          @if (isSubmitting()) {
            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>SUBMITTING...</span>
          } @else {
            <span>SUBMIT TICKET</span>
          }
        </button>

        <!-- Footer Note -->
        <p class="text-center text-[10px] text-gray-500 mt-4">Our team typically responds within 24 hours</p>

      </form>

    </div>
  `
})
export class SupportComponent {
  private location = inject(Location);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private supportService = inject(SupportService);

  public readonly categories = TICKET_CATEGORIES;
  public isSubmitting = signal<boolean>(false);
  public selectedFile = signal<File | null>(null);
  public toastMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  public supportForm = this.fb.group({
    email:        ['', [Validators.required, Validators.email]],
    category:     ['', Validators.required],
    subject:      ['', Validators.required],
    description:  ['', Validators.required]
  });

  isInvalid(field: string): boolean {
    const ctrl = this.supportForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    } else {
      this.selectedFile.set(null);
    }
  }

  onSubmit(): void {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.toastMessage.set(null);

    const { email, category, subject, description } = this.supportForm.value;

    this.supportService.createTicket(
      email!,
      Number(category),
      subject!,
      description!,
      this.selectedFile() || undefined
    ).subscribe({
      next: (res) => {
        const ticketId = res?.ticketId || res?.id;
        this.toastMessage.set(
          ticketId
            ? `Your ticket #${ticketId} has been submitted. We'll get back to you shortly.`
            : `Your ticket has been submitted successfully. We'll get back to you shortly.`
        );
        this.supportForm.reset();
        this.selectedFile.set(null);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Failed to submit ticket:', err);
        const msg = err?.error?.message || err?.error || 'Failed to submit ticket. Please try again.';
        this.errorMessage.set(msg);
        this.isSubmitting.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
