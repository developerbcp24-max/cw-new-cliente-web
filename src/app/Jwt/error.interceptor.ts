import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../Services/users/authentication.service';
import { GlobalService } from '../Services/shared/global.service';

/**
 * Interceptor para manejo centralizado de errores HTTP
 * Procesa respuestas y errores de todas las peticiones POST
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  private readonly ERROR_MESSAGES = {
    UNAUTHORIZED: 'Su sesión ha expirado. Por favor, ingrese nuevamente.',
    CONNECTION_ERROR: 'No se puede conectar al servicio. Verifique su conexión.',
    SERVER_ERROR: 'Error en el servidor. Intente nuevamente más tarde.',
    BAD_REQUEST: 'Error en la solicitud. Verifique los datos ingresados.',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
  };

  constructor(
    private globalService: GlobalService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Solo interceptar peticiones POST sin flag de exclusión
    if (
      request.method === 'POST' &&
      !request.headers.has('X-Skip-Interceptor')
    ) {
      return next.handle(request).pipe(
        map((event) => this.handleResponse(event, request)),
        catchError((error) => this.handleError(error))
      );
    }

    return next.handle(request);
  }

  /**
   * Procesa las respuestas HTTP exitosas
   */
  private handleResponse(
    event: HttpEvent<any>,
    request: HttpRequest<any>
  ): HttpEvent<any> {
    if (!(event instanceof HttpResponse)) {
      return event;
    }

    this.globalService.showLoader(false);

    // Si no hay body, retornar el evento original
    if (!event.body) {
      return event;
    }

    // Si se solicita el body completo, retornarlo sin procesamiento
    if (request.headers.has('Return-Complete-Body')) {
      return event;
    }

    // Si existe body.body, extraerlo
    if (event.body.body !== undefined) {
      return event.clone({
        body: event.body.body,
      });
    }

    // Si existe un mensaje de error en una respuesta 200, tratarlo como error
    if (event.body.message) {
      throw new HttpErrorResponse({
        error: {
          message: event.body.message,
          code: event.body.code || 'BUSINESS_ERROR',
          timestamp: new Date().toISOString(),
        },
        status: event.body.status || 400,
        statusText: 'Business Logic Error',
        url: request.url,
        headers: event.headers,
      });
    }

    return event;
  }

  /**
   * Maneja los errores HTTP de forma centralizada
   */
  private handleError(error: any): Observable<never> {
    this.globalService.showLoader(false);

    let errorResponse: HttpErrorResponse;

    // Si ya es un HttpErrorResponse, procesarlo
    if (error instanceof HttpErrorResponse) {
      errorResponse = this.processHttpError(error);
    } else {
      // Error desconocido (no HTTP)
      errorResponse = new HttpErrorResponse({
        error: {
          message: error?.message || this.ERROR_MESSAGES.UNKNOWN_ERROR,
          code: 'UNKNOWN_ERROR',
          timestamp: new Date().toISOString(),
        },
        status: 0,
        statusText: 'Unknown Error',
      });
    }

    // Log para auditoría (en producción debería ir a un servicio de logging)
    this.logError(errorResponse);

    return throwError(() => errorResponse);
  }

  /**
   * Procesa errores HTTP según su código de estado
   */
  private processHttpError(error: HttpErrorResponse): HttpErrorResponse {
    let errorMessage: string;
    let errorCode: string;

    switch (error.status) {
      case 0:
        // Error de red o CORS
        errorMessage = this.ERROR_MESSAGES.CONNECTION_ERROR;
        errorCode = 'NETWORK_ERROR';
        break;

      case 401:
        // No autorizado - cerrar sesión
        this.authenticationService.logout();
        errorMessage = this.ERROR_MESSAGES.UNAUTHORIZED;
        errorCode = 'UNAUTHORIZED';
        break;

      case 400:
        // Bad Request
        errorMessage =
          error.error?.message || this.ERROR_MESSAGES.BAD_REQUEST;
        errorCode = error.error?.code || 'BAD_REQUEST';
        break;

      case 403:
        // Forbidden
        errorMessage = 'No tiene permisos para realizar esta operación.';
        errorCode = 'FORBIDDEN';
        break;

      case 404:
        // Not Found
        errorMessage = 'El recurso solicitado no fue encontrado.';
        errorCode = 'NOT_FOUND';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Errores del servidor
        errorMessage = this.ERROR_MESSAGES.SERVER_ERROR;
        errorCode = 'SERVER_ERROR';
        break;

      default:
        errorMessage =
          error.error?.message || this.ERROR_MESSAGES.UNKNOWN_ERROR;
        errorCode = error.error?.code || 'UNKNOWN_ERROR';
    }

    return new HttpErrorResponse({
      error: {
        message: errorMessage,
        code: errorCode,
        originalError: error.error,
        timestamp: new Date().toISOString(),
        status: error.status,
      },
      status: error.status,
      statusText: error.statusText,
      url: error.url || undefined,
      headers: error.headers,
    });
  }

  /**
   * Registra el error para auditoría
   * En producción, esto debería enviar a un servicio de logging centralizado
   */
  private logError(error: HttpErrorResponse): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      status: error.status,
      message: error.error?.message,
      code: error.error?.code,
      url: error.url,
      userAgent: navigator.userAgent,
    };

    // TODO: Enviar a servicio de logging en producción
    ////console.error('[ErrorInterceptor]', errorLog);
  }
}
