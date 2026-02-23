import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obfuscateAccountNumber',
})
export class ObfuscateAccountNumberPipe implements PipeTransform {
  transform(value: string): string {
    return `${value.substring(0, 6)}${value
      .substring(6, value.length - 4)
      .replace(/\d/gm, 'X')}${value.substring(value.length - 4, value.length)}`;
  }
}
