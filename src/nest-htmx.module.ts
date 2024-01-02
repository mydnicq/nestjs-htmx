import { Module, DynamicModule } from "@nestjs/common";
import { NestHtmxInterceptor } from "./nest-htmx.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({})
export class NestJSHtmxModule {
  public static forRoot(): DynamicModule {
    return this.getDynamicModule();
  }

  private static getDynamicModule() {
    return {
      module: NestJSHtmxModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: NestHtmxInterceptor,
        },
      ],
    };
  }
}
