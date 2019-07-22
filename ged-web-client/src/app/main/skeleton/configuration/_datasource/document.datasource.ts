import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';
import {Document} from "../_model";

export class DocumentDatasource extends AbstractDatasource<Document> {
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
            case 'description':
                [propertyA, propertyB] = [a.description, b.description];
                break;
            case 'taille':
                [propertyA, propertyB] = [a.taille, b.taille];
                break;
            case 'auteur':
                [propertyA, propertyB] = [a.auteur, b.auteur];
                break;
            case 'format':
                [propertyA, propertyB] = [a.format, b.format];
                break;
            case 'version':
                [propertyA, propertyB] = [a.version, b.version];
                break;
            case 'url':
                [propertyA, propertyB] = [a.url, b.url];
                break;
            case 'createdBy':
                [propertyA, propertyB] = [a.createdBy, b.createdBy];
                break;
            case 'lastModifiedBy':
                [propertyA, propertyB] = [a.lastModifiedBy, b.lastModifiedBy];
                break;
        }
        return { propertyA: propertyA, propertyB: propertyB };
    }

}
