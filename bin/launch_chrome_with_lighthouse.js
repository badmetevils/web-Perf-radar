const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");

const launchChromeAndRunLighthouse = (url, options, config = null) => {
    return chromeLauncher.launch({
        ...options
    }).then(chrome => {
        let lightHousePort = chrome.port;
        return lighthouse(url, {
            port: lightHousePort
        }, config).then(results => {
            return chrome.kill().then(() => results.report);
        });
    });
};

module.exports = launchChromeAndRunLighthouse;