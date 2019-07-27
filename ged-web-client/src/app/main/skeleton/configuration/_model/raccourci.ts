import {Entity} from 'src/@externals/loga/_abstract';
import {Dossier} from "./dossier";
import {RaccourciType} from "./RaccourciType";
import {Document} from "./document";

export class Raccourci extends Entity<Raccourci> {

    public nom: string;
    public  emplacement: Dossier;
    public dossier: Dossier;
    public document: Document;
    public type: RaccourciType;

    constructor() {
        super();
    }
}
