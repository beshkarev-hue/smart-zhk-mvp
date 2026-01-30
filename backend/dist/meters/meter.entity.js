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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meter = exports.MeterType = void 0;
const typeorm_1 = require("typeorm");
var MeterType;
(function (MeterType) {
    MeterType["COLD_WATER"] = "cold_water";
    MeterType["HOT_WATER"] = "hot_water";
    MeterType["GAS"] = "gas";
    MeterType["ELECTRICITY"] = "electricity";
})(MeterType || (exports.MeterType = MeterType = {}));
let Meter = class Meter {
};
exports.Meter = Meter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Meter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Meter.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Meter.prototype, "electricityAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "currentReadingT1", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "currentReadingT2", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "currentReadingT3", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "previousReadingT1", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "previousReadingT2", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "previousReadingT3", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Meter.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Meter.prototype, "apartmentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MeterType,
    }),
    __metadata("design:type", String)
], Meter.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Meter.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Meter.prototype, "verificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Meter.prototype, "nextVerificationDate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Meter.prototype, "currentReading", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Meter.prototype, "previousReading", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Meter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Meter.prototype, "updatedAt", void 0);
exports.Meter = Meter = __decorate([
    (0, typeorm_1.Entity)('meters')
], Meter);
//# sourceMappingURL=meter.entity.js.map