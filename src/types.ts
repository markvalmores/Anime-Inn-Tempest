export interface AnimeWallpaper {
  id: string;
  title: string;
  character: string;
  tags: string[];
  imageUrl: string;
  aspectRatio: 'portrait' | 'landscape';
  author: string;
  downloads: number;
  saves: number;
  category: string;
}

export interface RedemptionCode {
  id: string;
  code: string;
  amountGcash?: number;
  amountPaypay?: number;
  pointsUsed: number;
  redeemedAt: string;
  status: 'active' | 'claimed';
  rewardType?: 'gcash' | 'paypay';
}

export interface UserStats {
  points: number;
  pinnedCount: number;
  redeemedCount: number;
  claimedCodes: RedemptionCode[];
  pinnedIds: string[];
}

export interface LikedHistoryItem {
  id: string;
  title: string;
  imageUrl: string;
  likedAt: number; // timestamp in milliseconds
  category: string;
  character: string;
}

