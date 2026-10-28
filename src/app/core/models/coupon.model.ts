export interface CouponDto {
  couponId?: string;
  id?: string;
  code?: string;
  pointsValue: number;
  usdValue?: number;
  status: 'Fulfilled' | 'Redeemed' | 'Refunded' | string;
  createdAt: string | Date;
  countryCode?: string;
  cityCode?: string;
}

export interface CouponHistorySummaryDto {
  totalRedeemedPoints: number;
  totalRedemptions: number;
  totalUsdValue?: number;
}

export interface GetUserCouponsResponse {
  summary?: CouponHistorySummaryDto;
  coupons?: CouponDto[];
  totalRedeemedPoints?: number;
  totalRedemptions?: number;
}

export interface RedeemPointsRequest {
  points: number;
}

export interface RedeemPointsResponse {
  couponId?: string;
  id?: string;
  code?: string;
  pointsValue?: number;
  usdValue?: number;
  status?: string;
  message?: string;
  newBalance?: number;
}

export interface RefundCouponResponse {
  couponId?: string;
  pointsRefunded?: number;
  newBalance?: number;
  message?: string;
  status?: string;
}
