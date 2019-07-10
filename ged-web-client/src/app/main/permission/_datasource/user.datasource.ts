import {AbstractDatasource, Properties} from 'src/@externals/loga/_abstract';
import {User} from 'src/app/main/permission/_model';

export class UserDatasource extends AbstractDatasource<User> {
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
      case 'profile':
        [propertyA, propertyB] = [a.profile, b.profile];
        break;
      case 'username':
        [propertyA, propertyB] = [a.username, b.username];
        break;
      case 'firstName':
        [propertyA, propertyB] = [a.firstName, b.firstName];
        break;
      case 'lastName':
        [propertyA, propertyB] = [a.lastName, b.lastName];
        break;
      case 'phone':
        [propertyA, propertyB] = [a.phone, b.phone];
        break;
      case 'email':
        [propertyA, propertyB] = [a.email, b.email];
        break;
      case 'address':
        [propertyA, propertyB] = [a.address, b.address];
        break;
    }
    return {propertyA: propertyA, propertyB: propertyB};
  }
}
