import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'articleDateFilter'
})

export class ArticleDateFilter implements PipeTransform {

    transform(value: any, args: string[]): any {

        if (!value || !args) {
            return value;
        }

        const filter = args[0];


        if (filter === '1') {
            return value.filter(item => (+item.date) < 40000);
        } else if (filter === '2') {
            return value.filter( item => ( ((+item.date) >= 40000) &&  ((+item.date) < 100000)  )  );
        } else if (filter === '3') {
            return value.filter(item => (+item.date) >= 100000);
        } else {
             return value;
        }

    }

}
