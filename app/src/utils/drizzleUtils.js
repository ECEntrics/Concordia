const Web3 = require("web3");

const resolveWeb3 = (resolve, options, isBrowser) => {
    let provider;

    if (options.customProvider) {
        // use custom provider from options object
        provider = options.customProvider;
    } else if (isBrowser && window.ethereum) {
        // use `ethereum` object injected by MetaMask
        provider = window.ethereum;
    } else if (isBrowser && typeof window.web3 !== "undefined") {
        // use injected web3 object by legacy dapp browsers
        provider = window.web3.currentProvider;
    } else if (options.fallbackProvider) {
        // use fallback provider from options object
        provider = options.fallbackProvider;
    } else {
        // connect to development blockchain from `truffle develop`
        provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    }

    const web3 = new Web3(provider);
    resolve(web3);
};

const getWeb3 = (options = {}) =>
    new Promise(resolve => {
        // handle server-side and React Native environments
        const isReactNative =
            typeof navigator !== "undefined" && navigator.product === "ReactNative";
        const isNode = typeof window === "undefined";
        if (isNode || isReactNative) {
            return resolveWeb3(resolve, options, false);
        }

        // if page is ready, resolve for web3 immediately
        if (document.readyState === `complete`) {
            return resolveWeb3(resolve, options, true);
        }

        // otherwise, resolve for web3 when page is done loading
        return window.addEventListener("load", () =>
            resolveWeb3(resolve, options, true),
        );
    });

const getContractInstance = (options = {}) =>
    new Promise(async (resolve, reject) => {
        if (!options.web3) {
            return reject(new Error("The options object with web3 is required."));
        }

        const { web3 } = options;

        let instance;
        try {
            if (options.artifact) {
                // if artifact exists, attempt to get network ID and the deployed address
                const { artifact } = options;
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = artifact.networks[networkId];

                // if no deployed address is found, instantiate without the address
                const address = deployedNetwork && deployedNetwork.address;

                instance = new web3.eth.Contract(artifact.abi, address);
            } else if (options.abi) {
                // otherwise, use passed-in ABI and deployed address (optional)
                const { abi, address } = options;

                instance = new web3.eth.Contract(abi, address);
            } else {
                return reject(
                    new Error(
                        "You must pass in a contract artifact or the ABI of a deployed contract.",
                    ),
                );
            }

            return resolve(instance);
        } catch (err) {
            return reject(err);
        }
    });

export { getWeb3, getContractInstance };