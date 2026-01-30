"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNewsReadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_news_read_service_1 = require("./user-news-read.service");
const user_news_read_controller_1 = require("./user-news-read.controller");
const user_news_read_entity_1 = require("./user-news-read.entity");
let UserNewsReadModule = class UserNewsReadModule {
};
exports.UserNewsReadModule = UserNewsReadModule;
exports.UserNewsReadModule = UserNewsReadModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_news_read_entity_1.UserNewsRead])],
        controllers: [user_news_read_controller_1.UserNewsReadController],
        providers: [user_news_read_service_1.UserNewsReadService],
        exports: [user_news_read_service_1.UserNewsReadService],
    })
], UserNewsReadModule);
//# sourceMappingURL=user-news-read.module.js.map