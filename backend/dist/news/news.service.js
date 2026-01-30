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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("./news.entity");
let NewsService = class NewsService {
    constructor(newsRepository, dataSource) {
        this.newsRepository = newsRepository;
        this.dataSource = dataSource;
    }
    async create(newsData) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const news = this.newsRepository.create(newsData);
            const savedNews = await queryRunner.manager.save(news);
            if (newsData.buildingIds && newsData.buildingIds.length > 0) {
                for (const buildingId of newsData.buildingIds) {
                    await queryRunner.manager.query('INSERT INTO news_buildings ("newsId", "buildingId") VALUES ($1, $2)', [savedNews.id, buildingId]);
                }
            }
            await queryRunner.commitTransaction();
            return savedNews;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.newsRepository.find({
            order: {
                isPinned: 'DESC',
                createdAt: 'DESC'
            },
        });
    }
    async findPublished(userId) {
        const now = new Date();
        const userResult = await this.dataSource.query('SELECT "buildingAddress" FROM users WHERE id = $1', [userId]);
        if (!userResult || userResult.length === 0) {
            return [];
        }
        const userAddress = userResult[0].buildingAddress;
        const buildingResult = await this.dataSource.query('SELECT id FROM buildings WHERE address = $1', [userAddress]);
        const buildingId = buildingResult.length > 0 ? buildingResult[0].id : null;
        const query = `
      SELECT DISTINCT n.* 
      FROM news n
      LEFT JOIN news_buildings nb ON n.id = nb."newsId"
      WHERE n."isPublished" = true
        AND n."publishedAt" <= $1
        AND (n."expiresAt" IS NULL OR n."expiresAt" >= $1)
        AND (
          nb."buildingId" IS NULL 
          OR nb."buildingId" = $2
        )
      ORDER BY n."isPinned" DESC, n."publishedAt" DESC
    `;
        return this.dataSource.query(query, [now, buildingId]);
    }
    async findByCategory(userId, category) {
        const now = new Date();
        const userResult = await this.dataSource.query('SELECT "buildingAddress" FROM users WHERE id = $1', [userId]);
        if (!userResult || userResult.length === 0) {
            return [];
        }
        const userAddress = userResult[0].buildingAddress;
        const buildingResult = await this.dataSource.query('SELECT id FROM buildings WHERE address = $1', [userAddress]);
        const buildingId = buildingResult.length > 0 ? buildingResult[0].id : null;
        const query = `
      SELECT DISTINCT n.* 
      FROM news n
      LEFT JOIN news_buildings nb ON n.id = nb."newsId"
      WHERE n."isPublished" = true
        AND n."publishedAt" <= $1
        AND (n."expiresAt" IS NULL OR n."expiresAt" >= $1)
        AND n.category = $2
        AND (
          nb."buildingId" IS NULL 
          OR nb."buildingId" = $3
        )
      ORDER BY n."isPinned" DESC, n."publishedAt" DESC
    `;
        return this.dataSource.query(query, [now, category, buildingId]);
    }
    async findOne(id) {
        return this.newsRepository.findOne({ where: { id } });
    }
    async update(id, newsData) {
        await this.newsRepository.update(id, newsData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.newsRepository.delete(id);
    }
    async publish(id) {
        const now = new Date();
        await this.newsRepository.update(id, {
            isPublished: true,
            publishedAt: now
        });
        return this.findOne(id);
    }
    async unpublish(id) {
        await this.newsRepository.update(id, { isPublished: false });
        return this.findOne(id);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], NewsService);
//# sourceMappingURL=news.service.js.map