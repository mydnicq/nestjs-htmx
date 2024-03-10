type ReSwapOptions = "outerHTML" | "innerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend" | "delete" | "none";
interface ScriptTag {
    src: string;
    defer?: boolean;
}
export declare class HtmlResponse {
    private __documentTitle?;
    private __componentToRender;
    private __componentsToRenderWhenHx?;
    private __headers;
    private __scriptTags;
    constructor(source: JSX.Element);
    scriptTags(st: ScriptTag[]): this;
    get _scriptTags(): ScriptTag[];
    get _componentToRender(): JSX.Element;
    renderWhenHx(source: JSX.Element[]): this;
    get _componentsToRenderWhenHx(): JSX.Element[] | undefined;
    documentTitle(title: string): this;
    get _documentTitle(): string | undefined;
    addHeader(header: Record<string, any>): this;
    get _headers(): Record<string, any>[];
    hxReTargetId(id: string): this;
    hxReTargetClass(className: string): this;
    hxReSwap(option?: ReSwapOptions): this;
    hxNoBrowserHistoryPush(): this;
    hxTrigger(eventObj: Record<string, any>): this;
    hxReplaceUrl(url?: string): this;
}
export {};
