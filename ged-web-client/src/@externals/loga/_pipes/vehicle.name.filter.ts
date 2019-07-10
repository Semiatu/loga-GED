import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'vehicleNameFilter'
})

export class VehicleNameFilter implements PipeTransform {

    transform(value: any, args: string): any {
        if (!value || !args) {
            return value;
        }
        const filter = args;
        return value.filter( item => (
            item.frame.toLowerCase()
            .concat(' ')
            .concat(item.registration.toLowerCase())
            .concat(' ')
            .concat(item.serialNumber.toLowerCase())
            .concat(' ')
            .concat(item.vehicleModel.wording.toLowerCase())
            .concat(' ')
            .concat(item.vehicleModel.vehicleMark.wording.toLowerCase())
            ).indexOf(filter.toLowerCase()) !== -1  );
    }
}
