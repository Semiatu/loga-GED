import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import { TypeDocument } from 'src/app/main/skeleton/configuration/_model';

export class TypeDocumentDatasource extends AbstractDatasource<TypeDocument> {
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
            // case 'status':
            //   [propertyA, propertyB] = [a.status, b.status];
            //   break;
        }
        return { propertyA: propertyA, propertyB: propertyB };
    }

}
