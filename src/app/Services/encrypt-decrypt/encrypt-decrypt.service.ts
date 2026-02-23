import { Injectable } from '@angular/core';
import { AppConfig } from '../../../../src/app/app.config';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService {
  private thumbPrint: string = '';
  private keyEncrypted: string = '';

  private keydecrypted: string = '';

  constructor(private config: AppConfig) {}

  encryptAES1(origin: string): string {
    ;
    let keys = this.decryptAES(this.keydecrypted!);
    let key = CryptoJS.enc.Utf8.parse(keys!);
    let iv = CryptoJS.enc.Utf8.parse(keys!);
    //cambios en env

    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(origin), key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }
    encryptAES(origin: string): string {
      let _key = this.decryptAES(this.keydecrypted!)
      const key = CryptoJS.enc.Utf8.parse(_key); // Clave
      const iv = CryptoJS.lib.WordArray.random(16); // IV aleatorio de 16 bytes

      // Cifrado
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(origin),
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Devolver el IV y el texto cifrado en formato Base64
      let result = iv.toString(CryptoJS.enc.Base64) + encrypted.toString();
      return result;
    }
  decryptAES(origin: string): string {
    this.keyEncrypted = this.config.getConfig('EncryptKey');
    this.thumbPrint = this.config.getConfig('ThumbPrintKey');
    let key = CryptoJS.enc.Utf8.parse(this.thumbPrint!);
    let iv = CryptoJS.enc.Utf8.parse(this.thumbPrint!);

    let decrypt = CryptoJS.AES.decrypt(this.keyEncrypted.trim(), key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.keydecrypted = decrypt.toString(CryptoJS.enc.Utf8);
    return this.keydecrypted;
  }


}
