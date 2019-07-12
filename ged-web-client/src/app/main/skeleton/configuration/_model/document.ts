import {Entity} from 'src/@externals/loga/_abstract';
import {Dossier} from "./dossier";

export class Document extends Entity<Document> {

    public nom: string;
    public description: string;
    public taille: number;
    public auteur: string;
    public format: string;
    public version: string;
    public url: string;
    public dossier: Dossier;

    constructor() {
        super();
    }
}
