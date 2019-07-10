// import { Injectable } from '@angular/core';
// import { Effect, ofType, Actions } from '@ngrx/effects';
// import { Store, select } from '@ngrx/store';
// import { of } from 'rxjs';
// import { switchMap, map, withLatestFrom } from 'rxjs/operators';
// import {Add, Edit, UserActionTypes} from "../actions/user.actions";
//
//
// @Injectable()
// export class UserEffects {
//   @Effect()
//   add$ = this._actions$.pipe(
//     ofType<Add>(UserActionTypes.Add),
//     map(action => action.payload),
//     withLatestFrom(this._store.pipe(select(selectUserList))),
//     switchMap(([id, users]) => {
//       const selectedUser = users.filter(user => user.id === +id)[0];
//       return of(new GetUserSuccess(selectedUser));
//     })
//   );
//
//   @Effect()
//   getUsers$ = this._actions$.pipe(
//     ofType<Edit>(UserActionTypes.Edit),
//     switchMap(() => this._userService.getUsers()),
//     switchMap((userHttp: IUserHttp) => of(new GetUsersSuccess(userHttp.users)))
//   );
//
//   constructor(
//     private _userService: UserService,
//     private _actions$: Actions,
//     private _store: Store<IAppState>
//   ) {}
// }
