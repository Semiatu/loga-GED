import {Entity} from 'src/@externals/loga/_abstract';
import {Document} from "./document";
import {Dossier} from "./dossier";
import {Profile, User} from "../../../permission/_model";
import {Privilege} from "./privilege";
import {Raccourci} from "./raccourci";

export class Authorisation extends Entity<Authorisation> {

    public document: Document;
    public dossier: Dossier;
    public raccourci: Raccourci;
    public user: User;
    public privilege: Privilege;
    public profile: Profile;

    constructor() {
        super();
    }
}
