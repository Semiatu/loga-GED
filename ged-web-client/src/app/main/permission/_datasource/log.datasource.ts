import {AbstractDatasource, Properties} from 'src/@externals/loga/_abstract';
import {Log} from 'src/app/main/permission/_model';


export class LogDatasource extends AbstractDatasource<Log> {
  protected _switch(active, a: any, b: any): Properties {
    let propertyA;
    let propertyB;
    switch (active) {
      case 'id':
        [propertyA, propertyB] = [a.id, b.id];
        break;
      case 'createdBy':
        [propertyA, propertyB] = [a.createdBy, b.createdBy];
        break;
      case 'action':
        [propertyA, propertyB] = [a.action, b.action];
        break;
      case 'description':
        [propertyA, propertyB] = [a.description, b.description];
        break;
    }
    return {propertyA: propertyA, propertyB: propertyB};
  }
}
