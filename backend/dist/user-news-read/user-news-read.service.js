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
exports.UserNewsReadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_news_read_entity_1 = require("./user-news-read.entity");
let UserNewsReadService = class UserNewsReadService {
    constructor(userNewsReadRepository) {
        this.userNewsReadRepository = userNewsReadRepository;
    }
    async markAsRead(userId, newsId) {
        const existing = await this.userNewsReadRepository.findOne({
            where: { userId, newsId },
        });
        if (!existing) {
            const userNewsRead = this.userNewsReadRepository.create({ userId, newsId });
            await this.userNewsReadRepository.save(userNewsRead);
        }
    }
    async markAllAsRead(userId, newsIds) {
        for (const newsId of newsIds) {
            await this.markAsRead(userId, newsId);
        }
    }
    async getReadNewsIds(userId) {
        const reads = await this.userNewsReadRepository.find({
            where: { userId },
            select: ['newsId'],
        });
        return reads.map(r => r.newsId);
    }
    async getUnreadCount(userId, allNewsIds) {
        const readIds = await this.getReadNewsIds(userId);
        return allNewsIds.filter(id => !readIds.includes(id)).length;
    }
};
exports.UserNewsReadService = UserNewsReadService;
exports.UserNewsReadService = UserNewsReadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_news_read_entity_1.UserNewsRead)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserNewsReadService);
//# sourceMappingURL=user-news-read.service.js.map