

export const AuthActionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SESSION_EXPIRED: 'LOGIN_SESSION_EXPIRED',
  LOGOUT: 'LOGOUT',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

export const authInitialState = {
  isLoggedIn: false,
  message: '',
  needAuthen: false,
  needFlash: true
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, isLoggedIn: true, message: '', needAuthen: false, needFlash: false };

    case AuthActionTypes.LOGIN_SESSION_EXPIRED:
      return { ...state, isLoggedIn: false, message: action.payload, needAuthen: true, needFlash: false };

    case AuthActionTypes.LOGOUT:
      return { ...state, isLoggedIn: false, message: '', needAuthen: true, needFlash: false };

    case AuthActionTypes.CLEAR_MESSAGE:
      return { ...state, message: '' };

    default:
      return state;
  }
}

