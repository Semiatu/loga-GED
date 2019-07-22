import {Entity} from 'src/@externals/loga/_abstract';
import {Dossier} from "./dossier";
import {TypeDocument} from "./typeDocument";

export class Document extends Entity<Document> {

    public nom: string;
    public description: string;
    public taille: string;
    public auteur: string;
    public format: string;
    public version: string;
    public dossier: Dossier;
    public typeDocument : TypeDocument;

    // FireBase
    $key: string;
    file: File;
    url: string;
    progress: number;

    constructor() {
        super();
    }
}
