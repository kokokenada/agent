import React from 'react';

import { ClientLogger } from '../client-logger';
type Me = any; // todo

export interface UserState {
  me: Me;
  isLoggedIn: boolean;
  ready: boolean;
}

export interface UserContextType {
  userState: UserState;
  setUserState: (v: UserState) => void | Promise<void>;
  $: UserContextUtils;
}
export class UserContextUtils {
  constructor(private me: Me | undefined) {}
}

export const blankUserState: UserState = {
  me: {},
  isLoggedIn: false,
  ready: false,
};

export const UserContext = React.createContext({
  userState: blankUserState,
  setUserState: (v: UserState) => {
    ClientLogger.error('UserContext.setUserState', 'ignored', v);
  },
  $: new UserContextUtils(undefined),
});
