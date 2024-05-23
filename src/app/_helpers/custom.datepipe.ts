import { Pipe, PipeTransform } from '@angular/core';
   import { DatePipe } from '@angular/common';
   
   @Pipe({
     name: 'customDate'
   })
   export class CustomDatePipe extends 
                DatePipe implements PipeTransform {
                  override transform(value: any, args?: any): any {
       return args=='yes'?super.transform(value, "dd-MM-y--hh-mm a"):super.transform(value, "dd-MM-y");
     }
   }