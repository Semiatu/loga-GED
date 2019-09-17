import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import {Revision} from "../_model/revision";

export class RevisionDatasource extends AbstractDatasource<Revision> {
    protected _switch(active, a: any, b: any): Properties {
        let propertyA;
        let propertyB;
        switch (active) {
            case 'id':
                [propertyA, propertyB] = [a.id, b.id];
                break;
                 case 'versionPrecedente':
                [propertyA, propertyB] = [a.revision, b.revision];
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
