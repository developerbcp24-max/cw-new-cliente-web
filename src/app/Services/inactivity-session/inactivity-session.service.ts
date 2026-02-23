import { Injectable, Injector, NgZone } from '@angular/core';
import { AuthenticationService } from '../users/authentication.service';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class InactivitySessionService {
  private inactivityLimit!: number; // El operador ! asegura que se asignará antes de usarse
  private userActivityTimeout: any; // Evita usar NodeJS.Timeout si no tienes las typings correctas
  private eventListeners: {
    [key: string]: EventListenerOrEventListenerObject;
  } = {};

  constructor(
    private ngZone: NgZone,
    private config: AppConfig,
    private injector: Injector
  ) {}

  startUserActivityInSessionDetection() {
    this.ngZone.runOutsideAngular(() => {
      ['click', 'mousemove', 'keydown'].forEach((event) => {
        const handler = this.resetUserActivityTimeout.bind(this);
        window.addEventListener(event, handler);
        this.eventListeners[event] = handler;
      });
    });
    this.resetUserActivityTimeout();
  }

  stopUserActivityInSessionDetection() {
    clearTimeout(this.userActivityTimeout);
    this.ngZone.runOutsideAngular(() => {
      Object.keys(this.eventListeners).forEach((event) => {
        const handler = this.eventListeners[event];
        window.removeEventListener(event, handler);
      });
      this.eventListeners = {};
    });
  }

  private resetUserActivityTimeout() {
    if (!this.inactivityLimit) {
      this.inactivityLimit = this.config.getConfig('redirectionMinutes') ?? 7;
    }

    const authenticationService = this.injector.get(AuthenticationService);
    clearTimeout(this.userActivityTimeout);
    this.userActivityTimeout = setTimeout(() => {
      this.ngZone.run(() => authenticationService.logout());
    }, this.inactivityLimit * 60 * 1000);
  }
}
