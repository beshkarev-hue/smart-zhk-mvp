// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role?: string;
  apartmentNumber?: string;
  buildingAddress?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role: string;
  apartmentNumber?: string;
  buildingAddress?: string;
  position?: string;
  photoUrl?: string;
  rating?: number;
  ratingsCount?: number;
  isActive: boolean;
  createdAt: string;
}

// Request types
export enum RequestStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum RequestType {
  PLUMBING = 'plumbing',
  ELECTRICITY = 'electricity',
  HEATING = 'heating',
  CLEANING = 'cleaning',
  REPAIR = 'repair',
  OTHER = 'other',
}

export interface Request {
  id: string;
  userId: string;
  type: RequestType | string;
  title: string;
  description: string;
  status: RequestStatus | string;
  apartmentNumber?: string;
  buildingAddress?: string;
  response?: string;
  executorId?: string;
  assignedTo?: string;
  assignedPosition?: string;
  executorAccepted?: boolean;
  executorRejected?: boolean;
  executorRejectionReason?: string;
  deadline?: string;
  estimatedCost?: number;
  finalCost?: number;
  isFree?: boolean;
  estimateDetails?: string;
  residentApproval?: boolean;
  residentRejectionReason?: string;
  executorComment?: string;
  residentComment?: string;
  executorRating?: number;
  photosBefore?: string[];
  photosAfter?: string[];
  isPaid?: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  period: string;
  status: string;
  type?: string;
  dueDate: string;
  paidAt?: string;
  description: string;
  createdAt: string;
}

// News types
export interface News {
  id: string;
  title: string;
  content: string;
  type?: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}
