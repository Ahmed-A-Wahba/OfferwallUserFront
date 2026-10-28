import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { GetOffersResponse, OfferDto, OfferFilter, MyOffersResponse } from '../models/offer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  public readonly handpickedOffers = signal<OfferDto[]>([]);
  public readonly regularOffers = signal<OfferDto[]>([]);
  public readonly selectedOffer = signal<OfferDto | null>(null);
  public readonly totalOffers = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly isLoading = signal<boolean>(false);
  public readonly isLoadingMore = signal<boolean>(false);
  public readonly hasMore = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  public getOffers(page: number = 1, limit: number = 20, filter?: OfferFilter, baseUrl: string = environment.apiUrl): Observable<GetOffersResponse> {
    if (page === 1) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', (filter?.limit || limit).toString());

    if (filter?.platform) params = params.set('platform', filter.platform);
    if (filter?.deviceName) params = params.set('deviceName', filter.deviceName);
    if (filter?.category) params = params.set('category', filter.category);

    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/offers`;

    return this.http.get<GetOffersResponse>(fullUrl, { params }).pipe(
      tap((res: GetOffersResponse) => {
        const fetchedOffers = res?.offers || [];
        const currentLimit = filter?.limit || limit;

        if (page === 1) {
          this.handpickedOffers.set(fetchedOffers.slice(0, 5));
          this.regularOffers.set(fetchedOffers.slice(5));
          this.currentPage.set(1);
        } else {
          this.regularOffers.update(existing => [...existing, ...fetchedOffers]);
          this.currentPage.set(page);
        }

        this.hasMore.set(fetchedOffers.length >= currentLimit && fetchedOffers.length > 0);

        if (res?.total !== undefined) {
          this.totalOffers.set(res.total);
        }

        this.isLoading.set(false);
        this.isLoadingMore.set(false);
        this.error.set(null);
      }),
      catchError((err: any) => {
        console.error('Failed to load offers from backend:', err);
        this.error.set('Failed to connect to offers server.');
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
        return of({
          offers: [],
          total: 0,
          currentPage: page
        });
      })
    );
  }

  public getMyOffers(days: number = 7, baseUrl: string = environment.apiUrl): Observable<MyOffersResponse | null> {
    const params = new HttpParams().set('days', days.toString());
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/offers/my`;

    return this.http.get<MyOffersResponse>(fullUrl, { params }).pipe(
      catchError((err: any) => {
        console.error('Failed to load my offers:', err);
        return of(null);
      })
    );
  }

  public startOffer(
    offerId: string,
    payload: { name: string; logoUrl: string; totalReward: number; totalTasks: number },
    baseUrl: string = environment.apiUrl
  ): Observable<{ redirectUrl: string } | null> {
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/offers/${offerId}/start`;
    return this.http.post<{ redirectUrl: string }>(fullUrl, payload).pipe(
      catchError((err: any) => {
        console.error('Failed to start offer:', err);
        return of(null);
      })
    );
  }
}
