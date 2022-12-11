import { combineReducers } from "redux";
import languageReducer from "./LanguageReducer";
import userReducer from "./UserReducer";

const mainReducer = combineReducers({
  user: userReducer,
  languages: languageReducer,
});

export default mainReducer;
