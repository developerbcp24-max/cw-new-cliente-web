import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize, delay } from "rxjs/operators";
import { GlobalService } from "../Services/shared/global.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes("userActual")) {
      return next.handle(req);
    }
    //console.warn("LoaderInterceptor");

    const loaderService = this.injector.get(GlobalService);

    loaderService.showLoader(true);

    return next.handle(req).pipe(
      delay(3000),
      finalize(() => loaderService.showLoader(false))
    );
  }
}
