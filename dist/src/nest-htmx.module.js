"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NestJSHtmxModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestJSHtmxModule = void 0;
const common_1 = require("@nestjs/common");
const nest_htmx_interceptor_1 = require("./nest-htmx.interceptor");
const core_1 = require("@nestjs/core");
let NestJSHtmxModule = NestJSHtmxModule_1 = class NestJSHtmxModule {
    static forRoot() {
        return this.getDynamicModule();
    }
    static getDynamicModule() {
        return {
            module: NestJSHtmxModule_1,
            providers: [
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: nest_htmx_interceptor_1.NestHtmxInterceptor,
                },
            ],
        };
    }
};
exports.NestJSHtmxModule = NestJSHtmxModule;
exports.NestJSHtmxModule = NestJSHtmxModule = NestJSHtmxModule_1 = __decorate([
    (0, common_1.Module)({})
], NestJSHtmxModule);
//# sourceMappingURL=nest-htmx.module.js.map