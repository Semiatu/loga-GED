import { Injectable } from '@angular/core';

@Injectable()
export class ModuleControllerService {

  show(item: string) {
    const rolesString = localStorage.getItem('r');
    if (!rolesString) {
      return false;
    }
    const roles = rolesString.split(',');
    return roles.includes(item);
  }

  showIfChild(items: any[]) {
    for (const item of items) {
      if (item.hasOwnProperty('role') && this.show(item.role)) {
        return true;
      }
    }
    return false;
  }

  showIfSubChild(items: any[]) {
    for (const item of items) {
      if (item.hasOwnProperty('role') && this.showIfChild(item.subMenuList)) {
        return true;
      }
    }
    return false;
  }
}
