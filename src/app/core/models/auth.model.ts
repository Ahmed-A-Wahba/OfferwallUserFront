export interface InitDashboardQuery {
  pubId: string;
  userId: string;
}

export interface InitDashboardResponse {
  pointsBalance: number;
  publisherName: string;
  publisherLogoUrl: string | null;
  userXp: number;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
