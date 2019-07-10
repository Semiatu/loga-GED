import {Entity} from 'src/@externals/loga/_abstract';

export class Dummy extends Entity<Dummy> {

  public wording: string;
  public description: string;
  public status: Boolean = true;

  constructor() {
    super();
  }
}
