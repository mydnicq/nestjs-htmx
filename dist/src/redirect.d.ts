type ReSwapOptions = "outerHTML" | "innerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend" | "delete" | "none";
interface RedirectOptions {
    path: string;
    status: number;
    hxRedirect: boolean;
    hxTarget?: string;
    hxSwap?: ReSwapOptions;
}
interface CookieOptions {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
}
export declare class Redirect {
    private __redirectOpts;
    private __headers;
    get _redirectOpts(): RedirectOptions;
    constructor(path: string);
    status(status: number): this;
    addHeader(header: Record<string, any>): this;
    get _headers(): Record<string, any>[];
    addCookie(cookieOpts: CookieOptions): this;
    hxRedirect(): this;
    hxTarget(selector: string): this;
    hxSwap(option?: ReSwapOptions): this;
}
export {};
