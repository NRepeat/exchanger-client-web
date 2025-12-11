var config = require("./index.js");
config.set(
  "example:name2",
  "valuE",
  "testField[true(no resave),false(resave)]",
  "keyConfig",
  "noSaveTofile[true(no Save file now),false( save to file now)]"
);
config.get("example:name", "keyConfig"); // return value
config.rereadConfig(); // reload config file
config.getAllToJsonConfig((err, conf) => {
  if (err) config.error(err);
  // eslint-disable-next-line no-console
  console.info(conf); // json config
}); // get config file to JSON

config.save(); // save to file now
