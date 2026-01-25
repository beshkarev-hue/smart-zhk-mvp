import { Test, TestingModule } from '@nestjs/testing';
import { GisZhkhController } from './gis-zhkh.controller';

describe('GisZhkhController', () => {
  let controller: GisZhkhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GisZhkhController],
    }).compile();

    controller = module.get<GisZhkhController>(GisZhkhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
