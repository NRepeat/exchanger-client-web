// RUN Cmd: npx babel-node --presets @babel/preset-env -- compare_locales.js

import ru from "./locales/ru";
import ua from "./locales/ua";
import fs from "fs";

function compareObject(obj, obj2, subkey) {
  for (let key in obj) {
    if (!obj2.hasOwnProperty(key)) {
      console.error("LocaleKey:", subkey + "." + key);
    } else if (typeof obj[key] === 'object') {
      compareObject(obj[key], obj2[key], subkey + "." + key);
    }
  }
}

// fs.writeFileSync("ru-client.json", JSON.stringify(ru, null, 2));

// compareObject(ua, ru, "ua-ru");
compareObject(ru, ua, "ru-ua");