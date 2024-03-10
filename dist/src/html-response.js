"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlResponse = void 0;
class HtmlResponse {
    constructor(source) {
        this.__headers = [];
        this.__scriptTags = [];
        this.__componentToRender = source;
    }
    scriptTags(st) {
        this.__scriptTags = this.__scriptTags.concat(st);
        return this;
    }
    get _scriptTags() {
        return this.__scriptTags;
    }
    get _componentToRender() {
        return this.__componentToRender;
    }
    renderWhenHx(source) {
        this.__componentsToRenderWhenHx = source;
        return this;
    }
    get _componentsToRenderWhenHx() {
        return this.__componentsToRenderWhenHx;
    }
    documentTitle(title) {
        this.__documentTitle = title;
        return this;
    }
    get _documentTitle() {
        return this.__documentTitle;
    }
    addHeader(header) {
        this.__headers.push(header);
        return this;
    }
    get _headers() {
        return this.__headers;
    }
    hxReTargetId(id) {
        this.addHeader({
            "HX-Retarget": `#${id}`,
        });
        return this;
    }
    hxReTargetClass(className) {
        this.addHeader({
            "HX-Retarget": `.${className}`,
        });
        return this;
    }
    hxReSwap(option = "innerHTML") {
        this.addHeader({
            "HX-Reswap": option,
        });
        return this;
    }
    hxNoBrowserHistoryPush() {
        this.addHeader({ "HX-Push-Url": "false" });
        return this;
    }
    hxTrigger(eventObj) {
        this.addHeader({
            "HX-Trigger": JSON.stringify(eventObj),
        });
        return this;
    }
    hxReplaceUrl(url = "false") {
        this.addHeader({ "HX-Replace-Url": url });
        return this;
    }
}
exports.HtmlResponse = HtmlResponse;
//# sourceMappingURL=html-response.js.map