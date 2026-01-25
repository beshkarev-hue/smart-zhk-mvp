import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Request> {
    return this.requestsRepository.findOne({ where: { id } });
  }

  async create(data: any): Promise<Request> {
    const request = this.requestsRepository.create(data);
    const saved = await this.requestsRepository.save(request);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request> {
    await this.requestsRepository.update(id, updateRequestDto as any);
    return this.requestsRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string, response?: string): Promise<Request> {
    await this.requestsRepository.update(id, { 
      status: status as RequestStatus, 
      response 
    });
    return this.requestsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.requestsRepository.delete(id);
  }
}
