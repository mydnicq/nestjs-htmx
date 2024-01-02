"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestHtmxInterceptor = void 0;
const common_1 = require("@nestjs/common");
const cheerio = __importStar(require("cheerio"));
const operators_1 = require("rxjs/operators");
const ts_pattern_1 = require("ts-pattern");
const redirect_1 = require("./redirect");
const html_response_1 = require("./html-response");
let NestHtmxInterceptor = class NestHtmxInterceptor {
    intercept(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = context.switchToHttp().getResponse();
            const req = context.switchToHttp().getRequest();
            const isHxRequest = req.headers["hx-request"] === "true";
            return next.handle().pipe((0, operators_1.switchMap)((data) => __awaiter(this, void 0, void 0, function* () {
                if (!(data instanceof html_response_1.HtmlResponse) && !(data instanceof redirect_1.Redirect)) {
                    return data;
                }
                return (0, ts_pattern_1.match)(data)
                    .with(ts_pattern_1.P.instanceOf(redirect_1.Redirect), (redirectData) => {
                    this.handleRedirect({
                        res,
                        isHxRequest,
                        redirectData,
                    });
                    return;
                })
                    .with(ts_pattern_1.P.instanceOf(html_response_1.HtmlResponse), (htmlResponseData) => __awaiter(this, void 0, void 0, function* () {
                    // This fixes this browser related issue - https://github.com/bigskysoftware/htmx/issues/497
                    if (isHxRequest) {
                        htmlResponseData.addHeader({
                            "Cache-Control": "no-store, max-age=0",
                        });
                    }
                    let html = yield htmlResponseData._componentToRender;
                    // TODO handle multiple components to render when hx
                    // if (
                    //   isHxRequest &&
                    //   htmlResponseData._componentsToRenderWhenHx &&
                    //   htmlResponseData._componentsToRenderWhenHx.length > 0
                    // ) {
                    //   html = htmlResponseData._componentsToRenderWhenHx
                    //     .map((c, index) => {
                    //       return index === 0 ? c.render() : c.hxSwapOob().render();
                    //     })
                    //     .join("\n");
                    // }
                    html = this.setDocumentTitle(html, isHxRequest, htmlResponseData._documentTitle);
                    html = this.setScriptTags(html, isHxRequest, htmlResponseData._scriptTags);
                    htmlResponseData._headers.forEach((header) => {
                        const [key, value] = Object.entries(header)[0];
                        res.set(key, value);
                    });
                    return html;
                }))
                    .exhaustive();
            })));
        });
    }
    handleRedirect({ redirectData, res, isHxRequest, }) {
        if (redirectData._headers.length > 0) {
            redirectData._headers.forEach((header) => {
                const [key, value] = Object.entries(header)[0];
                res.set(key, value);
            });
        }
        return (0, ts_pattern_1.match)(isHxRequest)
            .with(false, () => {
            return res.redirect(redirectData._redirectOpts.status, redirectData._redirectOpts.path);
        })
            .with(true, () => {
            return (0, ts_pattern_1.match)(redirectData._redirectOpts.hxRedirect)
                .with(false, () => {
                const payload = {
                    path: redirectData._redirectOpts.path,
                    target: redirectData._redirectOpts.hxTarget,
                    swap: redirectData._redirectOpts.hxSwap,
                };
                return res.set("HX-Location", JSON.stringify(payload));
            })
                .with(true, () => {
                return res.set("HX-Redirect", redirectData._redirectOpts.path);
            })
                .exhaustive();
        })
            .exhaustive();
    }
    setDocumentTitle(html, isHxRequest, title) {
        if (!title) {
            return html;
        }
        const $ = cheerio.load(html);
        const titleTag = $("head title");
        if (titleTag.length === 0 && isHxRequest) {
            const head = `<head hx-head="append"><title>${title}</title></head>`;
            return head + html;
        }
        $("head title").text(title);
        return $.html();
    }
    setScriptTags(html, isHxRequest, scriptTags) {
        if (scriptTags.length === 0) {
            return html;
        }
        const renderedScriptTags = scriptTags
            .map((tag) => `\n<script src="${tag.src}"></script>`)
            .join("\n");
        const $ = cheerio.load(html);
        if (isHxRequest) {
            const head = `<head hx-head="append">${renderedScriptTags}</head>`;
            return head + html;
        }
        $("head").append(renderedScriptTags);
        return $.html();
    }
};
exports.NestHtmxInterceptor = NestHtmxInterceptor;
exports.NestHtmxInterceptor = NestHtmxInterceptor = __decorate([
    (0, common_1.Injectable)()
], NestHtmxInterceptor);
//# sourceMappingURL=nest-htmx.interceptor.js.map