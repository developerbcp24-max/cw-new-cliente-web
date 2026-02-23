import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAccount',
})
export class FormatAccountPipe implements PipeTransform {
  transform(value: string): string {
    return `${value.substring(0, 3)}-${value.substring(
      3,
      value.length - 3
    )}-${value.substring(value.length - 3, value.length - 2)}-${value.substring(
      value.length - 2,
      value.length
    )}`;
  }
}
