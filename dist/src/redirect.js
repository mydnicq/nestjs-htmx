"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redirect = void 0;
class Redirect {
    get _redirectOpts() {
        return this.__redirectOpts;
    }
    constructor(path) {
        this.__headers = [];
        this.__redirectOpts = {
            path,
            status: 302,
            hxRedirect: false,
        };
    }
    status(status) {
        this.__redirectOpts.status = status;
        return this;
    }
    addHeader(header) {
        this.__headers.push(header);
        return this;
    }
    get _headers() {
        return this.__headers;
    }
    addCookie(cookieOpts) {
        let cookie = `${cookieOpts.name}=${cookieOpts.value};`;
        if (cookieOpts.domain) {
            cookie = cookie + ` Domain=${cookieOpts.domain};`;
        }
        if (cookieOpts.path) {
            cookie = cookie + ` Path=${cookieOpts.path};`;
        }
        if (cookieOpts.maxAge) {
            cookie = cookie + ` Max-Age=${cookieOpts.maxAge};`;
        }
        if (cookieOpts.httpOnly) {
            cookie = cookie + ` HttpOnly;`;
        }
        if (cookieOpts.secure) {
            cookie = cookie + ` Secure;`;
        }
        if (cookieOpts.sameSite) {
            cookie = cookie + ` SameSite=${cookieOpts.sameSite};`;
        }
        if (cookieOpts.expires) {
            cookie = cookie + ` Expires=${cookieOpts.expires.toUTCString()};`;
        }
        this.__headers.push({ "Set-Cookie": cookie });
        return this;
    }
    hxRedirect() {
        this.__redirectOpts.hxRedirect = true;
        return this;
    }
    hxTarget(selector) {
        this.__redirectOpts.hxTarget = selector;
        return this;
    }
    hxSwap(option = "innerHTML") {
        this.__redirectOpts.hxSwap = option;
        return this;
    }
}
exports.Redirect = Redirect;
//# sourceMappingURL=redirect.js.map