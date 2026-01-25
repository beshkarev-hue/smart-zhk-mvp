"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gis_zhkh_service_1 = require("./gis-zhkh.service");
describe('GisZhkhService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [gis_zhkh_service_1.GisZhkhService],
        }).compile();
        service = module.get(gis_zhkh_service_1.GisZhkhService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=gis-zhkh.service.spec.js.map