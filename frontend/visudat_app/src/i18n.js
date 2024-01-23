import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./translations/VisudatEN.json";
import translationDE from "./translations/VisudatDE.json";
// const translationNavbarAdmin = import(
//   "./translations/NavbarAdmin_translation.json"
// );
const resources = {
  en: translationEN,
  de: translationDE,
};
console.log(resources);

i18n
  .use(initReactI18next)
  .init({
    resources,
    debug: true,
    lng: "de",
  })
  .then(() => {
    console.log("Initialized i18next with detected language:", resources);
  });

export default i18n;
