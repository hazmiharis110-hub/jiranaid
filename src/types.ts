export type ToolCategory =
  | 'All'
  | 'Gardening & Yard'
  | 'Power Tools'
  | 'Home Improvement'
  | 'Cleaning & Steam'
  | 'Kitchen Appliances'
  | 'Automotive'
  | 'Ladders & Access'
  | 'Woodworking';

export type ToolCondition = 'Like New' | 'Good Condition' | 'Fair / Workhorse';

export type ToolStatus = 'available' | 'borrowed' | 'maintenance';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'returned'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  neighborhoodId: string;
  neighborhoodName: string;
  postcode: string;
  isVerified: boolean;
  verificationMethod: 'gps' | 'postcode' | 'utility_bill';
  trustScore: number;
  totalBorrows: number;
  totalLends: number;
  onTimeReturnRate: number;
  badges: string[];
  joinedDate: string;
}

export interface ToolItem {
  id: string;
  title: string;
  brand: string;
  model?: string;
  category: Exclude<ToolCategory, 'All'>;
  description: string;
  condition: ToolCondition;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerBorrowsCount: number;
  neighborhoodId: string;
  distanceKm: number;
  locationSnippet: string;
  status: ToolStatus;
  maintenanceFeePerDay: number;
  depositAmount: number;
  maxDays: number;
  instructions?: string;
  pickupNote?: string;
  unavailableDates?: string[];
  createdAt: string;
}

export interface BorrowRequest {
  id: string;
  toolId: string;
  toolTitle: string;
  toolImage: string;
  toolCategory: string;
  ownerId: string;
  ownerName: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar: string;
  borrowerTrust: number;
  startDate: string;
  endDate: string;
  daysCount: number;
  maintenanceFee: number;
  depositFee: number;
  totalPaid: number;
  depositRefunded: boolean;
  status: RequestStatus;
  purposeNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  requestId?: string;
  toolId?: string;
  toolTitle?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  postcode: string;
  city: string;
  activeMembers: number;
  activeTools: number;
  estimatedMoneySaved: number;
}

export interface Review {
  id: string;
  toolId?: string;
  toolTitle: string;
  toolCategory?: string;
  toolImage?: string;
  targetUserId?: string;
  targetUserName?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  careRating: number;
  punctualityRating: number;
  feedbackType?: 'item' | 'service' | 'general';
  comment: string;
  wouldRecommend?: boolean;
  date: string;
  helpfulCount?: number;
}
