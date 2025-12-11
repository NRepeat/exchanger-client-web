import news from "~/locales/ru/news";

const FROM_LANG = "ru";
const TO_LANG = "en";

const API_KEY = "AIzaSyAKekOBgU1K8BOWw9L4mB74tNAnQ-T6s-g";
const googleTranslate = require("google-translate")(API_KEY);
const translate = t => {
  return new Promise((resolve, reject) => {
    return googleTranslate.translate(t, FROM_LANG, TO_LANG, function(err, translation) {
      if (err) {
        return reject(err);
      }
      return resolve(translation.translatedText);
    });
  });
};

const translateObject = async obj => {
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      obj[key] = await translateObject(obj[key]);
    } else {
      obj[key] = await translate(obj[key]).catch(console.error);
    }
  }
  return obj;
};

export default translateObject(news).then(console.warn);
