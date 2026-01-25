"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GisZhkhModule = void 0;
const common_1 = require("@nestjs/common");
const gis_zhkh_service_1 = require("./gis-zhkh.service");
const gis_zhkh_controller_1 = require("./gis-zhkh.controller");
let GisZhkhModule = class GisZhkhModule {
};
exports.GisZhkhModule = GisZhkhModule;
exports.GisZhkhModule = GisZhkhModule = __decorate([
    (0, common_1.Module)({
        controllers: [gis_zhkh_controller_1.GisZhkhController],
        providers: [gis_zhkh_service_1.GisZhkhService],
        exports: [gis_zhkh_service_1.GisZhkhService],
    })
], GisZhkhModule);
//# sourceMappingURL=gis-zhkh.module.js.map