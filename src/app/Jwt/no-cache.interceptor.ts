import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NoCacheInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Verificar si la solicitud ya tiene headers de no-cache
    if (req.headers.has('Cache-Control')) {
      return next.handle(req);
    }

    // Clonar la solicitud y añadir headers de no-cache
    const httpRequest = req.clone({
      setHeaders: {
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
        'If-Modified-Since': '0',
        'If-None-Match': '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Añadir un parámetro de consulta único para evitar el cacheo
      setParams: {
        noCache: new Date().getTime().toString(),
      },
    });

    return next.handle(httpRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Modificar la respuesta para desactivar el cacheo
          event = event.clone({
            headers: event.headers.set(
              'Cache-Control',
              'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
            ),
          });
        }
      })
    );
  }
}
