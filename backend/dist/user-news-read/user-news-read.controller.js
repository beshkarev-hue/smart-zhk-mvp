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
exports.UserNewsReadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_news_read_service_1 = require("./user-news-read.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserNewsReadController = class UserNewsReadController {
    constructor(userNewsReadService) {
        this.userNewsReadService = userNewsReadService;
    }
    async markAsRead(req, body) {
        await this.userNewsReadService.markAsRead(req.user.userId, body.newsId);
    }
    async markAllAsRead(req, body) {
        await this.userNewsReadService.markAllAsRead(req.user.userId, body.newsIds);
    }
    async getReadNewsIds(req) {
        return this.userNewsReadService.getReadNewsIds(req.user.userId);
    }
    async getUnreadCount(req, body) {
        return this.userNewsReadService.getUnreadCount(req.user.userId, body.newsIds);
    }
};
exports.UserNewsReadController = UserNewsReadController;
__decorate([
    (0, common_1.Post)('mark-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Отметить новость как прочитанную' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserNewsReadController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Отметить все новости как прочитанные' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserNewsReadController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)('read-ids'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить ID прочитанных новостей' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserNewsReadController.prototype, "getReadNewsIds", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить количество непрочитанных' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserNewsReadController.prototype, "getUnreadCount", null);
exports.UserNewsReadController = UserNewsReadController = __decorate([
    (0, swagger_1.ApiTags)('user-news-read'),
    (0, common_1.Controller)('user-news-read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_news_read_service_1.UserNewsReadService])
], UserNewsReadController);
//# sourceMappingURL=user-news-read.controller.js.map