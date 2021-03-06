import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import {Categorie} from "../_model/categorie";

export class CategorieDatasource extends AbstractDatasource<Categorie> {
    protected _switch(active, a: any, b: any): Properties {
        let propertyA;
        let propertyB;
        switch (active) {
            case 'id':
                [propertyA, propertyB] = [a.id, b.id];
                break;
            case 'nom':
                [propertyA, propertyB] = [a.nom, b.nom];
                break;
            case 'createdBy':
                [propertyA, propertyB] = [a.createdBy, b.createdBy];
                break;
                case 'lastModifiedDate':
                [propertyA, propertyB] = [a.lastModifiedDate, b.lastModifiedDate];
                break;
        }
        return { propertyA: propertyA, propertyB: propertyB };
    }
}
