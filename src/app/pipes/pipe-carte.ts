import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatecard'
})
export class TruncatecardPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.substring(0,1)+'***************'+value.substring(14,16)
    } else {
      return "";
    }
  }
}