import {Entity} from 'src/@externals/loga/_abstract';

export class Dossier extends Entity<Dossier> {

    public nom: string;
    public taille: number;
    public  sousDossier: Dossier;



    constructor() {
        super();
    }
}
