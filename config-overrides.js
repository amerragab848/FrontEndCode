let CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (config, env) => {
    config.plugins.push(
        new CopyWebpackPlugin([
            {
                from: "src/IP_Configrations.json",
                to: "assets/IP_Configrations.json"
            }
        ])
    );
    return config;
};
