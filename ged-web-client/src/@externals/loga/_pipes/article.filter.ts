import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'articleFilter'
})

export class ArticleFilter implements PipeTransform {

    transform(value: any, args: string): any {
        if (!value || !args) {
            return value;
        }
        const filter = args;
        return value.filter(item => item.barcode.toLowerCase().indexOf(filter.toLowerCase()) !== -1
            || item.product.designation.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
}
