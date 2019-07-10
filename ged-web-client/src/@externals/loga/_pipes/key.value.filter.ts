import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValueFilter'
})

export class KeyValueFilter implements PipeTransform {

  transform(value: any, args: string): any {
    if (!value || !args) {
      return value;
    }
    const filter = args;
    return value.filter(item => item.label.toLowerCase().indexOf(filter.toLowerCase()) > -1);
  }
}
