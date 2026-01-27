import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meter } from './meter.entity';

@Injectable()
export class MetersService {
  constructor(
    @InjectRepository(Meter)
    private metersRepository: Repository<Meter>,
  ) {}

  async findByUser(userId: string): Promise<Meter[]> {
    return this.metersRepository.find({ where: { userId } });
  }

  async findByApartment(apartmentNumber: string): Promise<Meter[]> {
    return this.metersRepository.find({ where: { apartmentNumber } });
  }

  async create(meterData: Partial<Meter>): Promise<Meter> {
    const meter = this.metersRepository.create(meterData);
    return this.metersRepository.save(meter);
  }

  async update(id: string, meterData: Partial<Meter>): Promise<Meter> {
    await this.metersRepository.update(id, meterData);
    return this.metersRepository.findOne({ where: { id } });
  }

  async submitReading(id: string, readingData: any): Promise<Meter> {
    const meter = await this.metersRepository.findOne({ where: { id } });
    if (!meter) return null;

    // Если это электросчётчик с тарифами T1/T2/T3
    if (readingData.readingT1 !== undefined) {
      meter.previousReadingT1 = meter.currentReadingT1;
      meter.previousReadingT2 = meter.currentReadingT2;
      meter.previousReadingT3 = meter.currentReadingT3;
      meter.currentReadingT1 = readingData.readingT1;
      meter.currentReadingT2 = readingData.readingT2;
      meter.currentReadingT3 = readingData.readingT3;
    } else {
      // Обычный счётчик (вода, газ)
      meter.previousReading = meter.currentReading;
      meter.currentReading = readingData;
    }

    return this.metersRepository.save(meter);
  }
}
