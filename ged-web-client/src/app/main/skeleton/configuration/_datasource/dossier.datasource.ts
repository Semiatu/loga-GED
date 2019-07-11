import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import {Dossier} from "../_model";

export class DossierDatasource extends AbstractDatasource<Dossier> {
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
            case 'createdDate':
                [propertyA, propertyB] = [a.createdDate, b.createdDate];
                break;
            case 'lastModifiedBy':
                [propertyA, propertyB] = [a.lastModifiedBy, b.lastModifiedBy];
                break;
            case 'lastModifiedDate':
                [propertyA, propertyB] = [a.lastModifiedDate, b.lastModifiedDate];
                break;
            case 'nom':
                [propertyA, propertyB] = [a.nom, b.nom];
                break;
            case 'taille':
                [propertyA, propertyB] = [a.taille, b.taille];
                break;
            case 'sousDossier':
                [propertyA, propertyB] = [a.sousDossier, b.sousDossier];
                break;
        }
        return { propertyA: propertyA, propertyB: propertyB };
    }

}
