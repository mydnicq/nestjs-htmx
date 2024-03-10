type ReSwapOptions =
  | "outerHTML"
  | "innerHTML"
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend"
  | "delete"
  | "none";

interface ScriptTag {
  src: string;
  defer?: boolean;
}

export class HtmlResponse {
  private __documentTitle?: string;

  private __componentToRender: JSX.Element;
  private __componentsToRenderWhenHx?: JSX.Element[];

  private __headers: Record<string, any>[] = [];

  private __scriptTags: ScriptTag[] = [];

  constructor(source: JSX.Element) {
    this.__componentToRender = source;
  }

  scriptTags(st: ScriptTag[]) {
    this.__scriptTags = this.__scriptTags.concat(st);
    return this;
  }

  get _scriptTags() {
    return this.__scriptTags;
  }

  get _componentToRender() {
    return this.__componentToRender;
  }

  renderWhenHx(source: JSX.Element[]) {
    this.__componentsToRenderWhenHx = source;
    return this;
  }

  get _componentsToRenderWhenHx() {
    return this.__componentsToRenderWhenHx;
  }

  documentTitle(title: string) {
    this.__documentTitle = title;
    return this;
  }

  get _documentTitle() {
    return this.__documentTitle;
  }

  addHeader(header: Record<string, any>) {
    this.__headers.push(header);
    return this;
  }

  get _headers() {
    return this.__headers;
  }

  hxReTargetId(id: string) {
    this.addHeader({
      "HX-Retarget": `#${id}`,
    });
    return this;
  }

  hxReTargetClass(className: string) {
    this.addHeader({
      "HX-Retarget": `.${className}`,
    });
    return this;
  }

  hxReSwap(option: ReSwapOptions = "innerHTML") {
    this.addHeader({
      "HX-Reswap": option,
    });
    return this;
  }

  hxNoBrowserHistoryPush() {
    this.addHeader({ "HX-Push-Url": "false" });
    return this;
  }

  hxTrigger(eventObj: Record<string, any>) {
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
