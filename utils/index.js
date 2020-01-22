const url = require('url');
const fs = require("fs");

const generateCSV = (response) => {
    let {
        file,
        audits
    } = filterDataToJson(response);

    // let header = Object.keys(audits[0]);
    let body = audits.map(d => Object.values(d).join(","));
    let csv = body.join("\n");
    return {
        file,
        csv
    };
}

const filterDataToJson = (response) => {
    let data = JSON.parse(response);
    let urlParse = url.parse(data.finalUrl)
    let date = new Date(data.fetchTime);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    let file = {
        host: urlParse.hostname,
        created_on: `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}, ${formatAMPM(date)}`,
        // created_on: date.toString(),
        device: data.configSettings.emulatedFormFactor
    }

    let category = Object.keys(data.categories)[0];
    let categoryScore = data.categories[category].score * 100;
    // let rawAudits = data.audits;
    // let audits = Object.keys(rawAudits).map(key => {
    //     let {
    //         title,
    //         // description,
    //         score,
    //         scoreDisplayMode,
    //         displayValue,
    //     } = rawAudits[key];
    //     return ({
    //         category,
    //         [category + 'score']: categoryScore,
    //         title,
    //         // description,
    //         score,
    //         scoreDisplayMode,
    //         displayValue,
    //     })
    // })
    return ({
        file,
        audits: [{
            time: `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}, ${formatAMPM(date)}`,
            url: urlParse.href,
            category,
            score: categoryScore,
        }]
    });
}

const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
}

const makeDirIfNotExist = (DIR) => {
    if (!fs.existsSync(`${DIR}`)) {
        fs.mkdirSync(DIR, {
            recursive: true
        }, err => {
            console.error(`[ERROR]: Unable to make Directory ${DIR}`, err);
        });
    }
}

function getCliArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}

module.exports = {
    generateCSV,
    makeDirIfNotExist,
    getCliArgs
};