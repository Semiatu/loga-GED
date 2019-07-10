import {createSelector} from '@ngrx/store';

import {AppState} from '../state/app.state';
import {UserState} from '../state/user.state';

const selectUsers = (state: AppState) => state.userState;

export const selectUserLists = createSelector(selectUsers, (state: UserState) => state.users);

export const selectCurrentUser = createSelector(selectUsers, (userState: UserState) => userState.currentUser);
export const selectVisibility = createSelector(selectUsers, (userState: UserState) => userState.visibility);
