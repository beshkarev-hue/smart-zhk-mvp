import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
  ) {}

  async findByAddress(address: string): Promise<Building | null> {
    return this.buildingsRepository.findOne({ where: { address } });
  }

  async findAll(): Promise<Building[]> {
    return this.buildingsRepository.find();
  }

  async create(buildingData: Partial<Building>): Promise<Building> {
    const building = this.buildingsRepository.create(buildingData);
    return this.buildingsRepository.save(building);
  }

  async update(id: string, buildingData: Partial<Building>): Promise<Building> {
    await this.buildingsRepository.update(id, buildingData);
    return this.buildingsRepository.findOne({ where: { id } });
  }
}
