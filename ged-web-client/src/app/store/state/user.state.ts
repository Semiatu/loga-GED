import { Profile, User } from 'src/app/main/permission/_model';

export interface UserState {
  users?: User[];
  currentUser?: User;
  profiles?: Profile[];
  profilesIn?: Profile[];
  visibility?: boolean;
}

export const initialUserState: UserState = {
  users: null,
  currentUser: null,
  profiles: null,
  profilesIn: null,
  visibility: false,
};
