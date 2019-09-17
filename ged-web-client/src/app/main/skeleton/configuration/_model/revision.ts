import {Entity} from 'src/@externals/loga/_abstract';

export class Revision extends Entity<Revision> {

    public versionPrecedente: number;
    public document: Document;
    constructor() {
        super();
    }
}
