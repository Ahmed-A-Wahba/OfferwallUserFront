import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { InitDashboardResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive state signals initialized without mock data
  public readonly pointsBalance = signal<number>(0);
  public readonly publisherName = signal<string>('');
  public readonly publisherLogoUrl = signal<string | null>(null);
  public readonly userXp = signal<number>(0);
  public readonly isInitialized = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  // Computed signals
  public readonly userLevel = computed(() => {
    const xp = this.userXp();
    if (xp >= 5000) return 5;
    if (xp >= 3000) return 4;
    if (xp >= 2000) return 3;
    if (xp >= 1000) return 2;
    return 1;
  });

  public readonly pointsToNextLevel = computed(() => {
    const xp = this.userXp();
    if (xp >= 5000) return 0;
    if (xp >= 3000) return 5000 - xp;
    if (xp >= 2000) return 3000 - xp;
    if (xp >= 1000) return 2000 - xp;
    return 1000 - xp;
  });

  private accessTokenKey = 'ow_access_token';
  private refreshTokenKey = 'ow_refresh_token';

  constructor(private http: HttpClient) {}

  public initDashboard(pubId: string, userId: string, baseUrl: string = environment.apiUrl): Observable<InitDashboardResponse | null> {
    const params = new HttpParams()
      .set('pub_id', pubId)
      .set('user_id', userId);

    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/wall/init`;

    return this.http.get<InitDashboardResponse>(fullUrl, { params }).pipe(
      tap((res: InitDashboardResponse | null) => {
        if (res) {
          const points = res.pointsBalance ?? (res as any).PointsBalance ?? 0;
          const pubName = res.publisherName ?? (res as any).PublisherName ?? '';
          const pubLogo = res.publisherLogoUrl ?? (res as any).PublisherLogoUrl ?? null;
          const xp = res.userXp ?? (res as any).UserXp ?? 0;
          const token = res.accessToken ?? (res as any).AccessToken;
          const refreshToken = res.refreshToken ?? (res as any).RefreshToken;

          this.pointsBalance.set(points);
          this.publisherName.set(pubName);
          this.publisherLogoUrl.set(pubLogo);
          this.userXp.set(xp);

          if (token) {
            // Save accessToken regardless of whether refreshToken exists
            localStorage.setItem(this.accessTokenKey, token);
            if (refreshToken) {
              localStorage.setItem(this.refreshTokenKey, refreshToken);
            }
          }

          this.isInitialized.set(true);
          this.error.set(null);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.isInitialized.set(false);
        const errorMessage = this.extractErrorMessage(err);
        this.error.set(errorMessage);
        return of(null);
      })
    );
  }

  private extractErrorMessage(err: any): string {
    if (!err) return 'An unexpected error occurred during initialization.';
    if (typeof err === 'string') return err;
    if (typeof err.error === 'string') return err.error;

    if (err.error) {
      if (typeof err.error.description === 'string') return err.error.description;
      if (typeof err.error.Description === 'string') return err.error.Description;
      if (typeof err.error.message === 'string') return err.error.message;
      if (typeof err.error.Message === 'string') return err.error.Message;
      if (typeof err.error.detail === 'string') return err.error.detail;
      if (typeof err.error.Detail === 'string') return err.error.Detail;

      if (err.error.error) {
        if (typeof err.error.error === 'string') return err.error.error;
        if (typeof err.error.error.description === 'string') return err.error.error.description;
        if (typeof err.error.error.message === 'string') return err.error.error.message;
      }
      if (typeof err.error.title === 'string') return err.error.title;
    }

    if (typeof err.message === 'string') return err.message;
    return 'Invalid partner credentials or unauthorized origin.';
  }

  public saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
