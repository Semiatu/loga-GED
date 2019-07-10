import {Entity} from 'src/@externals/loga/_abstract';
import {Profile} from './profile';

export class User extends Entity<User> {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  profile: Profile;
}
