import Languages from "assets/languages/Languages";
const initState = {
  language: Languages.VNI,
};

const languageReducer = (state = initState, action) => {
  switch (action.payload) {
    case "VNI":
      return {
        language: Languages.VNI,
      };
    case "ENG":
      return {
        language: Languages.ENG,
      };
    default:
      return state;
  }
};

export default languageReducer;
