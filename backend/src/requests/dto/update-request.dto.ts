export class UpdateRequestDto {
  status?: string;
  response?: string;
  assignedTo?: string;
  assignedPosition?: string;
  deadline?: Date;
  estimatedCost?: number;
  isFree?: boolean;
  estimateDetails?: string;
  residentApproval?: boolean;
  executorComment?: string;
  residentComment?: string;
  isPaid?: boolean;
  completedAt?: Date;
}
