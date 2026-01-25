import { Test, TestingModule } from '@nestjs/testing';
import { GisZhkhService } from './gis-zhkh.service';

describe('GisZhkhService', () => {
  let service: GisZhkhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GisZhkhService],
    }).compile();

    service = module.get<GisZhkhService>(GisZhkhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
