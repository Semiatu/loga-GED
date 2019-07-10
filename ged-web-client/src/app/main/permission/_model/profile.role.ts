
/*
 * @author Sidibe
 */
import {Entity} from 'src/@externals/loga/_abstract';
import {Role} from './role';
import {Profile} from './profile';

export class ProfileRole extends Entity<ProfileRole> {
  public id: number;
  public role: Role;
  public profile: Profile;

  constructor() {
    super();
  }
}
