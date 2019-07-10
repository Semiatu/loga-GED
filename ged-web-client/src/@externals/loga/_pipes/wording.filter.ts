import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'wordingFilter'
})

export class WordingFilter implements PipeTransform {

  transform(value: any, args: string): any {
    if (!value || !args) {
      return value;
    }
    const filter = args;
    return value.filter(item => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}
