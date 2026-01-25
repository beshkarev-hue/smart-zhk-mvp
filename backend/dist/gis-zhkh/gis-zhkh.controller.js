"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GisZhkhController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const gis_zhkh_service_1 = require("./gis-zhkh.service");
let GisZhkhController = class GisZhkhController {
    constructor(gisZhkhService) {
        this.gisZhkhService = gisZhkhService;
    }
    async getAccountInfo(accountNumber) {
        return this.gisZhkhService.getAccountInfo(accountNumber);
    }
    async getCharges(accountNumber, period) {
        const currentPeriod = period || new Date().toISOString().slice(0, 7);
        return this.gisZhkhService.getCharges(accountNumber, currentPeriod);
    }
    async getMeters(accountNumber) {
        return this.gisZhkhService.getMeters(accountNumber);
    }
    async getMeterReadings(accountNumber, period) {
        return this.gisZhkhService.getMeterReadings(accountNumber, period);
    }
    async submitMeterReading(body) {
        return this.gisZhkhService.submitMeterReading(body);
    }
    async getPaymentHistory(accountNumber, startDate, endDate) {
        return this.gisZhkhService.getPaymentHistory(accountNumber, startDate, endDate);
    }
    async syncCharges(body) {
        return this.gisZhkhService.syncCharges(body.accountNumber, body.userId);
    }
};
exports.GisZhkhController = GisZhkhController;
__decorate([
    (0, common_1.Get)('account/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить информацию о лицевом счёте из ГИС ЖКХ' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "getAccountInfo", null);
__decorate([
    (0, common_1.Get)('charges/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить начисления за период из ГИС ЖКХ' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "getCharges", null);
__decorate([
    (0, common_1.Get)('meters/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список приборов учёта из ГИС ЖКХ' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "getMeters", null);
__decorate([
    (0, common_1.Get)('meter-readings/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить показания приборов учёта из ГИС ЖКХ' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "getMeterReadings", null);
__decorate([
    (0, common_1.Post)('meter-readings/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Передать показания счётчика в ГИС ЖКХ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "submitMeterReading", null);
__decorate([
    (0, common_1.Get)('payments/:accountNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить историю платежей из ГИС ЖКХ' }),
    __param(0, (0, common_1.Param)('accountNumber')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.Post)('sync/charges'),
    (0, swagger_1.ApiOperation)({ summary: 'Синхронизировать начисления из ГИС ЖКХ в локальную БД' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GisZhkhController.prototype, "syncCharges", null);
exports.GisZhkhController = GisZhkhController = __decorate([
    (0, swagger_1.ApiTags)('gis-zhkh'),
    (0, common_1.Controller)('gis-zhkh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [gis_zhkh_service_1.GisZhkhService])
], GisZhkhController);
//# sourceMappingURL=gis-zhkh.controller.js.map