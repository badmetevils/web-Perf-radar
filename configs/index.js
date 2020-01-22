const getLightHouseConfigPerDevice = (device = "desktop") => {
    switch (device) {
        case "desktop":
            return require('./desktopConfig');
        case "mobile":
            return require('./mobileConfig');
        default:
            return require('./desktopConfig');
            break;
    }
}
module.exports = getLightHouseConfigPerDevice;