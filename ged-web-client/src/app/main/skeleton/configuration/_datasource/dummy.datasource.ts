import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import { Dummy } from 'src/app/main/skeleton/configuration/_model';

export class DummyDatasource extends AbstractDatasource<Dummy> {
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
      case 'wording':
        [propertyA, propertyB] = [a.wording, b.wording];
        break;
      case 'description':
        [propertyA, propertyB] = [a.description, b.description];
        break;
      // case 'status':
      //   [propertyA, propertyB] = [a.status, b.status];
      //   break;
    }
    return { propertyA: propertyA, propertyB: propertyB };
  }

}
