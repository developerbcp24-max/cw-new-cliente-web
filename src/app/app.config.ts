import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  private config = environment;

  constructor() {}

  /**
   * Obtener un valor directo del environment por su clave
   * @param key clave del environment
   */
  public getServiceUrl<T extends keyof typeof environment>(key: T): typeof environment[T] {
    return this.config[key];
  }

  /**
   * Obtener una propiedad anidada usando punto, ejemplo: 'Banquero.name' o 'apiBaseUrls.accounts'
   * @param key ruta de la propiedad
   */
  public getEnv(key: string): any {
    let res: any = this.config;
    key.split('.').forEach((k) => (res = res?.[k]));
    return res;
  }

  /**
   * Obtener la clave pública de reCAPTCHA
   */
  public getRecaptchaSiteKey(): string {
    const isRecaptcha = this.getEnv('publicKeyRecaptcha');

    //console.log('isRecaptcha', isRecaptcha);
    return this.getEnv('publicKeyRecaptcha');
  }

  /**
   * Obtener URL de servicios (ejemplo: 'accounts', 'approvals', etc.)
   */
  public getConfig (serviceName: keyof typeof environment['apiBaseUrls']): any {
    return this.config.apiBaseUrls[serviceName];
  }
  public load(): Promise<void> {
    // Aquí podrías cargar config remota si quisieras
    return Promise.resolve();
  }
}
