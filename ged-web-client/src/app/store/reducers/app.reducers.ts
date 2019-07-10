import {ActionReducerMap} from '@ngrx/store';

import {routerReducer} from '@ngrx/router-store';
import {AppState} from '../state/app.state';
import {userReducers} from "./user.reducer";
import {InjectionToken} from "@angular/core";

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  userState: userReducers,
};

export function getReducers() {
  return appReducers;
}


export const APP_REDUCER_TOKEN = new InjectionToken('App Reducer Token');
