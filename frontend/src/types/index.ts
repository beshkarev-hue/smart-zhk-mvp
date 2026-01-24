export enum UserRole {
  RESIDENT = 'resident',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role: UserRole;
  apartmentNumber?: string;
  buildingAddress?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

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
  apartmentNumber?: string;
  buildingAddress?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export enum PaymentType {
  UTILITIES = 'utilities',
  MAINTENANCE = 'maintenance',
  HEATING = 'heating',
  WATER = 'water',
  ELECTRICITY = 'electricity',
  GAS = 'gas',
  OTHER = 'other',
}

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  period: string;
  description?: string;
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum RequestType {
  REPAIR = 'repair',
  PLUMBING = 'plumbing',
  ELECTRICITY = 'electricity',
  HEATING = 'heating',
  CLEANING = 'cleaning',
  GARBAGE = 'garbage',
  ELEVATOR = 'elevator',
  INTERCOM = 'intercom',
  OTHER = 'other',
}

export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  apartmentNumber?: string;
  buildingAddress?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export enum NewsType {
  ANNOUNCEMENT = 'announcement',
  NEWS = 'news',
  EVENT = 'event',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
}

export interface News {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  authorId: string;
  isPublished: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
