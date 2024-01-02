import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import * as cheerio from "cheerio";
import { switchMap } from "rxjs/operators";
import { P, match } from "ts-pattern";
import { Response } from "express";
import { Redirect } from "./redirect";
import { HtmlResponse } from "./html-response";

interface HandleRedirectParams {
  isHxRequest: boolean;
  redirectData: Redirect;
  res: Response;
}

@Injectable()
export class NestHtmxInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const isHxRequest = req.headers["hx-request"] === "true";

    return next.handle().pipe(
      switchMap(async (data) => {
        if (!(data instanceof HtmlResponse) && !(data instanceof Redirect)) {
          return data;
        }

        return match(data)
          .with(P.instanceOf(Redirect), (redirectData) => {
            this.handleRedirect({
              res,
              isHxRequest,
              redirectData,
            });

            return;
          })
          .with(P.instanceOf(HtmlResponse), async (htmlResponseData) => {
            // This fixes this browser related issue - https://github.com/bigskysoftware/htmx/issues/497
            if (isHxRequest) {
              htmlResponseData.addHeader({
                "Cache-Control": "no-store, max-age=0",
              });
            }

            let html = await htmlResponseData._componentToRender;

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

            html = this.setDocumentTitle(
              html,
              isHxRequest,
              htmlResponseData._documentTitle
            );

            html = this.setScriptTags(
              html,
              isHxRequest,
              htmlResponseData._scriptTags
            );

            htmlResponseData._headers.forEach((header) => {
              const [key, value] = Object.entries(header)[0];
              res.set(key, value);
            });

            return html;
          })
          .exhaustive();
      })
    );
  }

  private handleRedirect({
    redirectData,
    res,
    isHxRequest,
  }: HandleRedirectParams) {
    if (redirectData._headers.length > 0) {
      redirectData._headers.forEach((header) => {
        const [key, value] = Object.entries(header)[0];
        res.set(key, value);
      });
    }

    return match(isHxRequest)
      .with(false, () => {
        return res.redirect(
          redirectData._redirectOpts.status,
          redirectData._redirectOpts.path
        );
      })
      .with(true, () => {
        return match(redirectData._redirectOpts.hxRedirect)
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

  private setDocumentTitle(html: string, isHxRequest: boolean, title?: string) {
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

  private setScriptTags(html: string, isHxRequest: boolean, scriptTags: any[]) {
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
}
