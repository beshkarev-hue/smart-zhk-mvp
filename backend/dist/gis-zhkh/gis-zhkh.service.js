"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GisZhkhService = void 0;
const common_1 = require("@nestjs/common");
let GisZhkhService = class GisZhkhService {
    async getAccountInfo(accountNumber) {
        return {
            success: true,
            data: {
                accountNumber,
                address: 'г. Москва, ул. Ленина, д. 10',
                apartmentNumber: '42',
                totalArea: 65.5,
                livingArea: 42.3,
                residentsCount: 2,
                isActive: true,
            },
        };
    }
    async getCharges(accountNumber, period) {
        const currentDate = new Date();
        const charges = [
            {
                id: '1',
                accountNumber,
                period,
                serviceType: 'cold_water',
                serviceName: 'Холодное водоснабжение',
                amount: 245.80,
                volume: 5.2,
                tariff: 47.27,
                unit: 'м³',
            },
            {
                id: '2',
                accountNumber,
                period,
                serviceType: 'hot_water',
                serviceName: 'Горячее водоснабжение',
                amount: 687.45,
                volume: 3.8,
                tariff: 180.91,
                unit: 'м³',
            },
            {
                id: '3',
                accountNumber,
                period,
                serviceType: 'heating',
                serviceName: 'Отопление',
                amount: 3200.00,
                volume: 65.5,
                tariff: 48.85,
                unit: 'м²',
            },
            {
                id: '4',
                accountNumber,
                period,
                serviceType: 'electricity',
                serviceName: 'Электроэнергия',
                amount: 842.50,
                volume: 156,
                tariff: 5.40,
                unit: 'кВт⋅ч',
            },
            {
                id: '5',
                accountNumber,
                period,
                serviceType: 'maintenance',
                serviceName: 'Содержание и ремонт',
                amount: 1450.75,
                volume: 65.5,
                tariff: 22.15,
                unit: 'м²',
            },
        ];
        const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0);
        return {
            success: true,
            accountNumber,
            period,
            charges,
            totalAmount,
        };
    }
    async getMeters(accountNumber) {
        return {
            success: true,
            meters: [
                {
                    id: 'meter-1',
                    accountNumber,
                    meterType: 'water_cold',
                    meterNumber: 'ХВС-123456',
                    installDate: '2020-03-15',
                    lastCheckDate: '2023-03-15',
                    nextCheckDate: '2029-03-15',
                    currentValue: 1247.5,
                    isActive: true,
                },
                {
                    id: 'meter-2',
                    accountNumber,
                    meterType: 'water_hot',
                    meterNumber: 'ГВС-789012',
                    installDate: '2020-03-15',
                    lastCheckDate: '2023-03-15',
                    nextCheckDate: '2029-03-15',
                    currentValue: 865.3,
                    isActive: true,
                },
                {
                    id: 'meter-3',
                    accountNumber,
                    meterType: 'electricity',
                    meterNumber: 'ЭЭ-345678',
                    installDate: '2019-11-20',
                    lastCheckDate: '2023-11-20',
                    nextCheckDate: '2039-11-20',
                    currentValue: 24567,
                    isActive: true,
                },
            ],
        };
    }
    async getMeterReadings(accountNumber, period) {
        return {
            success: true,
            readings: [
                {
                    meterId: 'meter-1',
                    accountNumber,
                    meterType: 'water_cold',
                    readingDate: '2026-01-20',
                    value: 1247.5,
                    previousValue: 1242.3,
                    consumption: 5.2,
                    tariff: 47.27,
                    amount: 245.80,
                },
                {
                    meterId: 'meter-2',
                    accountNumber,
                    meterType: 'water_hot',
                    readingDate: '2026-01-20',
                    value: 865.3,
                    previousValue: 861.5,
                    consumption: 3.8,
                    tariff: 180.91,
                    amount: 687.45,
                },
                {
                    meterId: 'meter-3',
                    accountNumber,
                    meterType: 'electricity',
                    readingDate: '2026-01-20',
                    value: 24567,
                    previousValue: 24411,
                    consumption: 156,
                    tariff: 5.40,
                    amount: 842.50,
                },
            ],
        };
    }
    async submitMeterReading(dto) {
        console.log('Передача показаний в ГИС ЖКХ:', dto);
        return {
            success: true,
            message: 'Показания успешно переданы в ГИС ЖКХ',
        };
    }
    async getPaymentHistory(accountNumber, startDate, endDate) {
        return {
            success: true,
            payments: [
                {
                    id: 'pay-1',
                    accountNumber,
                    paymentDate: '2026-01-08',
                    amount: 6426.50,
                    period: '2025-12',
                    paymentType: 'online',
                    documentNumber: 'ОПЛ-2026-001',
                },
                {
                    id: 'pay-2',
                    accountNumber,
                    paymentDate: '2025-12-10',
                    amount: 6158.30,
                    period: '2025-11',
                    paymentType: 'bank',
                    documentNumber: 'ОПЛ-2025-345',
                },
            ],
        };
    }
    async syncCharges(accountNumber, userId) {
        const currentPeriod = new Date().toISOString().slice(0, 7);
        const charges = await this.getCharges(accountNumber, currentPeriod);
        return {
            success: true,
            imported: charges.charges.length,
        };
    }
};
exports.GisZhkhService = GisZhkhService;
exports.GisZhkhService = GisZhkhService = __decorate([
    (0, common_1.Injectable)()
], GisZhkhService);
//# sourceMappingURL=gis-zhkh.service.js.map