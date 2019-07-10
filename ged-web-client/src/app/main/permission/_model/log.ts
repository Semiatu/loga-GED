import {Entity} from 'src/@externals/loga/_abstract';
import {User} from './user';

export class Log extends Entity<Log> {
  public action: string;
  public description: string;
  public user: User;
}
