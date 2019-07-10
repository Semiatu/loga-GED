import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nameFilter'
})

export class NameFilter implements PipeTransform {

    transform(value: any, args: string): any {
        if (!value || !args) {
            return value;
        }
        const filter = args;
        return value.filter( item =>
            (item.firstName.toLowerCase().concat(' ').concat(item.lastName.toLowerCase())).indexOf(filter.toLowerCase()) !== -1  );
    }
}
