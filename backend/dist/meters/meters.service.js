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
exports.MetersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meter_entity_1 = require("./meter.entity");
let MetersService = class MetersService {
    constructor(metersRepository) {
        this.metersRepository = metersRepository;
    }
    async findByUser(userId) {
        return this.metersRepository.find({ where: { userId } });
    }
    async findByApartment(apartmentNumber) {
        return this.metersRepository.find({ where: { apartmentNumber } });
    }
    async create(meterData) {
        const meter = this.metersRepository.create(meterData);
        return this.metersRepository.save(meter);
    }
    async update(id, meterData) {
        await this.metersRepository.update(id, meterData);
        return this.metersRepository.findOne({ where: { id } });
    }
    async submitReading(id, readingData) {
        const meter = await this.metersRepository.findOne({ where: { id } });
        if (!meter)
            return null;
        if (readingData.readingT1 !== undefined) {
            meter.previousReadingT1 = meter.currentReadingT1;
            meter.previousReadingT2 = meter.currentReadingT2;
            meter.previousReadingT3 = meter.currentReadingT3;
            meter.currentReadingT1 = readingData.readingT1;
            meter.currentReadingT2 = readingData.readingT2;
            meter.currentReadingT3 = readingData.readingT3;
        }
        else {
            meter.previousReading = meter.currentReading;
            meter.currentReading = readingData;
        }
        return this.metersRepository.save(meter);
    }
};
exports.MetersService = MetersService;
exports.MetersService = MetersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meter_entity_1.Meter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MetersService);
//# sourceMappingURL=meters.service.js.map