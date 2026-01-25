"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gis_zhkh_controller_1 = require("./gis-zhkh.controller");
describe('GisZhkhController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [gis_zhkh_controller_1.GisZhkhController],
        }).compile();
        controller = module.get(gis_zhkh_controller_1.GisZhkhController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=gis-zhkh.controller.spec.js.map