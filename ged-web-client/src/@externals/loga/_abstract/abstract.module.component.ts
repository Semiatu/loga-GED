import { UserService } from 'src/app/main/permission/_service';
import { User } from 'src/app/main/permission/_model';

export abstract class AbstractModuleComponent {

  currentUser: User;

  constructor(protected userService: UserService) {
  }

  getUserFullName() {
    return this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName} (${this.currentUser.username})` : '';
  }

}
