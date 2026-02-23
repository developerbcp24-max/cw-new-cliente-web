import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpResponse,
  HttpEventType, HttpProgressEvent
} from '@angular/common/http';
import { DirectoryJOB } from '../Services/shared/enums/directory-job';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class UploadInterceptor implements HttpInterceptor {
  private directory: DirectoryJOB = new DirectoryJOB();
  private filesTypesList = [
    { value: 'application/pdf' },
    { value: 'application/vnd.ms-excel' },
    { value: 'application/txt' },
    { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { value: 'application/file' },
    { value: 'application/zip' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf(this.directory.DIRECTORYJOB) === -1) {
      return next.handle(req);
    }
    const delay = 300;
    return createUploadEvents(delay);
  }
}

function createUploadEvents(delay: number) {
  const chunks = 5;
  const total = 12345678;
  const chunkSize = Math.ceil(total / chunks);

  return new Observable<HttpEvent<any>>(observer => {
    observer.next({ type: HttpEventType.Sent });

    uploadLoop(0);

    function uploadLoop(loaded: number) {
      setTimeout(() => {
        loaded += chunkSize;

        if (loaded >= total) {
          const doneResponse = new HttpResponse({
            status: 201,
          });
          observer.next(doneResponse);
          observer.complete();
          return;
        }

        const progressEvent: HttpProgressEvent = {
          type: HttpEventType.UploadProgress,
          loaded,
          total
        };
        observer.next(progressEvent);
        uploadLoop(loaded);
      }, delay);
    }
  });
}
