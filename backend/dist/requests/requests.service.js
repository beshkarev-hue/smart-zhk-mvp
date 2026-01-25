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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./request.entity");
let RequestsService = class RequestsService {
    constructor(requestsRepository) {
        this.requestsRepository = requestsRepository;
    }
    async findAll() {
        return this.requestsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findByUserId(userId) {
        return this.requestsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.requestsRepository.findOne({ where: { id } });
    }
    async create(data) {
        const request = this.requestsRepository.create(data);
        const saved = await this.requestsRepository.save(request);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async update(id, updateRequestDto) {
        await this.requestsRepository.update(id, updateRequestDto);
        return this.requestsRepository.findOne({ where: { id } });
    }
    async updateStatus(id, status, response) {
        await this.requestsRepository.update(id, {
            status: status,
            response
        });
        return this.requestsRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.requestsRepository.delete(id);
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestsService);
//# sourceMappingURL=requests.service.js.map