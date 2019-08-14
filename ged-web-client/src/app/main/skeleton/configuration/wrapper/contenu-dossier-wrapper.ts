import {Dossier, Raccourci} from "../_model";
import {Document} from "../_model";

export class ContenuDossierWrapper  {

    public documents: Document[] = [];
    public dossiers: Dossier[]= [];
    public raccourcis: Raccourci[] = [];
    public dossier: Dossier = new  Dossier();
}
