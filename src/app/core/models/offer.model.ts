export interface ActivityDto {
  name: string;
  eventId: string;
  pointsReward: number;
}

export interface OfferDto {
  offerId: string;
  title: string;
  description: string;
  logoUrl: string;
  platform: string;
  deviceName: string;
  pointsReward: number;
  activities: ActivityDto[];
  status?: 'AVAILABLE' | 'IN_PROGRESS' | 'CLAIMED';
}

export interface GetOffersResponse {
  offers: OfferDto[];
  total: number;
  currentPage: number;
}

export interface OfferFilter {
  platform?: string;
  deviceName?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface OfferProgressDto {
  clickId?: string;
  offerId?: string;
  name?: string;
  title?: string;
  logoUrl?: string;
  pointsReward: number;
  completedSteps?: number;
  totalSteps?: number;
  progressPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED' | string;
  isCompleted?: boolean;
  completedAt?: string | Date;
}

export interface MyOffersResponse {
  inProgress: OfferProgressDto[];
  completed: OfferProgressDto[];
}
