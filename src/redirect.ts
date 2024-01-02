type ReSwapOptions =
  | "outerHTML"
  | "innerHTML"
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend"
  | "delete"
  | "none";

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

export class Redirect {
  private __redirectOpts: RedirectOptions;

  private __headers: Record<string, any>[] = [];

  get _redirectOpts() {
    return this.__redirectOpts;
  }

  constructor(path: string) {
    this.__redirectOpts = {
      path,
      status: 302,
      hxRedirect: false,
    };
  }

  status(status: number) {
    this.__redirectOpts.status = status;
    return this;
  }

  addHeader(header: Record<string, any>) {
    this.__headers.push(header);
    return this;
  }

  get _headers() {
    return this.__headers;
  }

  addCookie(cookieOpts: CookieOptions) {
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

    this.__headers.push({ "Set-Cookie": cookie });
    return this;
  }

  hxRedirect() {
    this.__redirectOpts.hxRedirect = true;
    return this;
  }

  hxTarget(selector: string) {
    this.__redirectOpts.hxTarget = selector;
    return this;
  }

  hxSwap(option: ReSwapOptions = "innerHTML") {
    this.__redirectOpts.hxSwap = option;
    return this;
  }
}
