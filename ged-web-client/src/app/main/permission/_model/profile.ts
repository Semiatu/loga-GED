import {Entity} from 'src/@externals/loga/_abstract';

export class Profile extends Entity<Profile> {

  public name: string;
  public description: string;

  constructor() {
    super();
  }
}
