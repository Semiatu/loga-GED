import { Action } from "@ngrx/store";
import { UserState } from "../state/user.state";

export enum UserActionTypes {
  ADD = '[User Component] Add',
  EDIT = '[User Component] Edit',
  LIST = '[User Component] List',
  SEARCH = '[User Component] Search',
}

export class Add implements Action {
  readonly type = UserActionTypes.ADD;

  constructor(public state: UserState) {
  }
}

export class Edit implements Action {
  readonly type = UserActionTypes.EDIT;

  constructor(public state: UserState) {
  }
}

export class List implements Action {
  readonly type = UserActionTypes.LIST;

  constructor(public state: UserState) {
  }
}

export class Search implements Action {
  readonly type = UserActionTypes.SEARCH;

  constructor(public state: UserState) {
  }
}

export type UserActions = Add | Edit | List | Search;
