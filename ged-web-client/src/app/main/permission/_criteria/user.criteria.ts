import { Profile } from 'src/app/main/permission/_model';

export class UserCriteria {
  profile: Profile;
  firstName: string;
  lastName: string;
  beginDate: Date;
  endDate: Date;
}
