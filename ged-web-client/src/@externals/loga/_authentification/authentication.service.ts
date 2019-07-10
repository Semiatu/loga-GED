import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {User} from 'src/app/main/permission/_model';
import {UserService} from 'src/app/main/permission/_service';

@Injectable()
export class AuthenticationService {

  private _currentUser: User;
  private _username: string;

  constructor(private userService: UserService) {
  }

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(currentUser: User) {
    this._currentUser = currentUser;

  }

  get username() {
    return this._username;
  }

  set username(username) {
    this._username = username;
  }

  login(user) {
    return this.userService.login(user);
  }

  logout() {

  }
}
