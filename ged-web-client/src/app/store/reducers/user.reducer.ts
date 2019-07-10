import {UserActions, UserActionTypes} from "../actions/user.actions";
import {initialUserState, UserState} from "../state/user.state";

export const userReducers = (
  state = initialUserState,
  action: UserActions
): UserState => {
  switch (action.type) {
    case UserActionTypes.ADD: {
      return {
        ...state,
        profiles: action.state.profiles,
        visibility: action.state.visibility
      };
    }
    case UserActionTypes.EDIT: {
      return {
        ...state,
        currentUser: action.state.currentUser,
        profiles: state.profiles,
        visibility: state.visibility
      };
    }
    case UserActionTypes.LIST: {
      return {
        ...state,
        users: action.state.users,
        profilesIn: action.state.profilesIn,
        visibility: action.state.visibility
      };
    }
    case UserActionTypes.SEARCH: {
      return {
        ...state,
        profilesIn: action.state.profilesIn,
        visibility: action.state.visibility
      };
    }

    default:
      return state;
  }
};
