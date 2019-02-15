const path = require("path");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "src/build/contracts"),
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        }
    },
    compilers:{
        solc: {
            version: "0.4.25",
            settings:{
                optimizer: {
                    enabled: true,
                    runs: 500
                }
            }
        }
    }
};
