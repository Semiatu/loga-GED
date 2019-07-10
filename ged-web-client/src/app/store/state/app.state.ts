import {RouterReducerState} from '@ngrx/router-store';
import {initialUserState, UserState} from "./user.state";

export interface AppState {
  router?: RouterReducerState;
  userState: UserState;
}

export const initialAppState: AppState = {
  userState: initialUserState,
};

export function getInitialState(): AppState {
  return initialAppState;
}
