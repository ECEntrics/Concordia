let Forum;

try {
    // eslint-disable-next-line global-require
    Forum = require('./build/Forum.json');
} catch (e) {
    // eslint-disable-next-line no-console
    console.error("Could not require contract artifacts. Haven't you run compile yet?");
}

module.exports = {
    contracts: [Forum],
};
