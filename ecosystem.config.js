const config_creator = require("./plugins/config-creator");
const projectName = config_creator.get('projectName');


module.exports = {
  apps: [
    // {
    //   name: projectName + "-client-generator",
    //   script: "./client-generator.js",
    //   instances: 1,
    //   restart_delay: 6000,
    //   autorestart: true,
    //   exec_mode: "fork",
    //   max_restarts: 20
    // }
  ],
};
