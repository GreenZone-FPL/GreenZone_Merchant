

export const AuthActionTypes = {
  LOGIN: 'LOGIN',
  LOGIN_SESSION_EXPIRED: 'LOGIN_SESSION_EXPIRED',
  LOGOUT: 'LOGOUT',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

export const authInitialState = {
  message: '',
  needAuthen: false,
};


export const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, message: '', needAuthen: false };

    case AuthActionTypes.LOGIN_SESSION_EXPIRED:
      return { ...state, message: action.payload, needAuthen: true };

    case AuthActionTypes.LOGOUT:
      return { ...state, message: '', needAuthen: true };

    case AuthActionTypes.CLEAR_MESSAGE:
      return { ...state, message: '' };

    default:
      return state;
  }
}

