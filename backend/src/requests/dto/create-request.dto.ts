import { RequestType } from '../request.entity';

export class CreateRequestDto {
  userId: string;
  type: RequestType;
  title: string;
  description: string;
  apartmentNumber?: string;
  buildingAddress?: string;
}
