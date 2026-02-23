import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obfuscateEmail',
})
export class ObfuscateEmailPipe implements PipeTransform {
  transform(value: string): unknown {
    let valueSplitted = value.split('@');
    return `${valueSplitted[0]
      .split('')
      .map((char, index) => {
        if (index === 0) {
          return char;
        }
        return '*';
      })
      .join('')}@${valueSplitted[1]}`;
  }
}
