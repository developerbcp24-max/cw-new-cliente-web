import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class JwtFieldEncryptionService {
  private readonly SECRET_KEY = 'TU_CLAVE_SECRETA_FUERTE_2024!@#';
  private readonly SENSITIVE_FIELDS = [
    'user_document_number',
    'user_name',
  ];

  constructor( private config: AppConfig) {
    this.SECRET_KEY= this.config.getConfig('ThumbPrintKey');
  }
  encryptSensitiveFields(token: string): string {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }
      const [header, payload, signature] = parts;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      this.SENSITIVE_FIELDS.forEach(field => {
        if (decodedPayload[field] && typeof decodedPayload[field] === 'string') {
          decodedPayload[field] = this.encryptField(decodedPayload[field]);
        }
      });
      const newPayloadStr = JSON.stringify(decodedPayload);
      const newPayloadBase64 = window.btoa(newPayloadStr)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      return `${header}.${newPayloadBase64}.${signature}`;

    } catch (error) {
      //console.error('Error al encriptar campos del JWT:', error);
      return token;
    }
  }
  decryptSensitiveFields(encryptedToken: string): string {
    try {
      const parts = encryptedToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }
      const [header, payload, signature] = parts;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      this.SENSITIVE_FIELDS.forEach(field => {
        if (decodedPayload[field] && typeof decodedPayload[field] === 'string') {
          const decrypted = this.decryptField(decodedPayload[field]);
          if (decrypted) {
            decodedPayload[field] = decrypted;
          }
        }
      });
      const newPayloadStr = JSON.stringify(decodedPayload);
      const newPayloadBase64 = window.btoa(newPayloadStr)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      return `${header}.${newPayloadBase64}.${signature}`;

    } catch (error) {
      //console.error('Error al desencriptar campos del JWT:', error);
      return encryptedToken;
    }
  }
  getDecryptedPayload(encryptedToken: string): any {
    try {
      const parts = encryptedToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));
      this.SENSITIVE_FIELDS.forEach(field => {
        if (decodedPayload[field] && typeof decodedPayload[field] === 'string') {
          const decrypted = this.decryptField(decodedPayload[field]);
          if (decrypted) {
            decodedPayload[field] = decrypted;
          }
        }
      });
      return decodedPayload;
    } catch (error) {
      //console.error('Error al obtener payload desencriptado:', error);
      return null;
    }
  }
  isFieldEncrypted(value: string): boolean {
    try {
      return value.startsWith('U2FsdGVk') || value.length > 50;
    } catch {
      return false;
    }
  }
  private encryptField(value: string): string {
    try {
      return CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString();
    } catch (error) {
      //console.error('Error al encriptar campo:', error);
      return value;
    }
  }
  public decryptField(encryptedValue: string): string | null {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, this.SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      return result || null;
    } catch (error) {
      //console.error('Error al desencriptar campo:', error);
      return null;
    }
  }
  addSensitiveField(fieldName: string): void {
    if (!this.SENSITIVE_FIELDS.includes(fieldName)) {
      this.SENSITIVE_FIELDS.push(fieldName);
    }
  }
  removeSensitiveField(fieldName: string): void {
    const index = this.SENSITIVE_FIELDS.indexOf(fieldName);
    if (index > -1) {
      this.SENSITIVE_FIELDS.splice(index, 1);
    }
  }
}
