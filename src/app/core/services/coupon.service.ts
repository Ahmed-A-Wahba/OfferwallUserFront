import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { CouponDto, CouponHistorySummaryDto, GetUserCouponsResponse, RedeemPointsResponse, RefundCouponResponse } from '../models/coupon.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  public readonly summary = signal<CouponHistorySummaryDto | null>(null);
  public readonly coupons = signal<CouponDto[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  public getUserCoupons(status?: string, baseUrl: string = environment.apiUrl): Observable<GetUserCouponsResponse | null> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }

    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/coupons`;

    return this.http.get<GetUserCouponsResponse>(fullUrl, { params }).pipe(
      tap((res: GetUserCouponsResponse) => {
        if (res) {
          const summaryObj: CouponHistorySummaryDto = res.summary ?? {
            totalRedeemedPoints: res.totalRedeemedPoints ?? 0,
            totalRedemptions: res.totalRedemptions ?? (res.coupons ? res.coupons.length : 0)
          };
          this.summary.set(summaryObj);
          if (res.coupons) {
            this.coupons.set(res.coupons);
          } else if (Array.isArray(res as any)) {
            this.coupons.set(res as any);
          }
        }
        this.isLoading.set(false);
        this.error.set(null);
      }),
      catchError((err: any) => {
        console.error('Failed to fetch coupons:', err);
        this.error.set(err?.error?.message || err?.error || 'Failed to fetch coupons history.');
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  public redeemPoints(points: number, baseUrl: string = environment.apiUrl): Observable<RedeemPointsResponse | null> {
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/coupons/redeem`;
    return this.http.post<RedeemPointsResponse>(fullUrl, { points });
  }

  public refundCoupon(couponId: string, baseUrl: string = environment.apiUrl): Observable<RefundCouponResponse | null> {
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/coupons/${couponId}/refund`;
    return this.http.post<RefundCouponResponse>(fullUrl, {});
  }
}
