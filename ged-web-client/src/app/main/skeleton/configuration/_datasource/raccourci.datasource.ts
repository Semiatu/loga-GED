import { AbstractDatasource, Properties } from 'src/@externals/loga/_abstract';

export class RaccourciDatasource extends AbstractDatasource<RaccourciDatasource> {
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
                case 'taille':
                [propertyA, propertyB] = [a.taille, b.taille];
                break;
                case 'emplacement':
                [propertyA, propertyB] = [a.emplacement, b.emplacement];
                break;
                 case 'cible':
                [propertyA, propertyB] = [a.cible, b.cible];
                break;
                case 'dossier':
                [propertyA, propertyB] = [a.dossier, b.dossier];
                break;
        }
        return { propertyA: propertyA, propertyB: propertyB };
    }

}
