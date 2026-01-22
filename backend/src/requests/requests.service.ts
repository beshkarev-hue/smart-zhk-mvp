import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
  ) {}

  async create(requestData: Partial<Request>): Promise<Request> {
    const request = this.requestsRepository.create(requestData);
    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Request[]> {
    return this.requestsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    return request;
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
    response?: string,
  ): Promise<Request> {
    const request = await this.findOne(id);
    request.status = status;
    if (response) {
      request.response = response;
    }
    return this.requestsRepository.save(request);
  }

  async update(id: string, requestData: Partial<Request>): Promise<Request> {
    const request = await this.findOne(id);
    Object.assign(request, requestData);
    return this.requestsRepository.save(request);
  }

  async remove(id: string): Promise<void> {
    const request = await this.findOne(id);
    await this.requestsRepository.remove(request);
  }
}
