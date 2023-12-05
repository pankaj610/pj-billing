import {
  API_FAILED,
  API_STARTED,
  API_SUCCESS,
  RESTORE_TOKEN,
  SAVE_TOKEN,
  SIGN_OUT,
} from "../constants";
import { Snackbar } from "react-native-paper";
const initialState = {
  token: "",
  isSignedIn: false,
  loading: false,
  error: "",
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        token: action.payload,
        isSignedIn: action.token != null ? true : false,
        loading: false,
      };
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.payload,
        isSignedIn: true,
        loading: false,
        error: "",
      };
    case API_STARTED:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case API_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
      };
    case API_FAILED:
      alert(action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        token: null,
        isSignedIn: false,
      };
    default:
      return state;
  }
};

export default appReducer;
