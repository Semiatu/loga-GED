import {Entity} from 'src/@externals/loga/_abstract';

export class Role extends Entity<Role> {

  public name: string;
  public description: string;

  constructor() {
    super();
  }
}
