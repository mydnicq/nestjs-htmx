import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
export declare class NestHtmxInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
    private handleRedirect;
    private setDocumentTitle;
    private setScriptTags;
}
