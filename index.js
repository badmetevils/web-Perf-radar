const config = require(`./configs`);
const launchChromeAndRunLighthouse = require("./bin/launch_chrome_with_lighthouse");

const {
    generateCSV,
    makeDirIfNotExist,
    getCliArgs
} = require("./utils");

const fs = require("fs");

const providedURLS = require("./path.json");

const OUTPUT_DIR = __dirname + "/reports";


const defaultConfigs = {
    host: "http://localhost:4000",
    device: 'desktop'
};

let args = getCliArgs();

if (Object.keys(args).length > 0) {
    for (key in args) {
        if (key in defaultConfigs) {
            defaultConfigs[key] = args[key];
        }
    }
}


(async function() {
    for (let i = 0; i < providedURLS.length; i++) {
        const {
            path,
            label
        } = providedURLS[i];

        const url = `${defaultConfigs.host}${path}`;
        const generatedConfig = config(defaultConfigs.device);

        try {
            console.log(`[${i + 1}]:(${label}) Measuring performance for ${url} on [${defaultConfigs.device}] device`);
            await launchChromeAndRunLighthouse(
                url, {
                    chromeFlags: ["--headless", "--disable-gpu", "--quite"]
                },
                generatedConfig
            ).then(res => {
                let {
                    file,
                    csv
                } = generateCSV(res[0]);

                const DIR = `${OUTPUT_DIR}/${file.host}/${label}`;
                const htmlFileName = `${label}__(${file.created_on}).html`;
                const HTML_DIR = `${DIR}/html_reports/${file.device}`;

                const csvFileName = label + "__" + file.device + '.csv';
                const CSV_DIR = `${DIR}/${csvFileName}`;

                makeDirIfNotExist(DIR);
                makeDirIfNotExist(HTML_DIR);

                fs.writeFileSync(CSV_DIR, csv + "\n", {
                    'flag': 'a'
                }, err => {
                    if (err) throw err;
                });

                fs.writeFileSync(`${HTML_DIR}/${htmlFileName}`, res[1], err => {
                    if (err) throw err;
                });

            });
            console.log(`Done.`);
        } catch (error) {
            console.error(error);
        }

    }
})();