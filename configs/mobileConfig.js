module.exports = {
    extends: "lighthouse:default",
    settings: {
        throttlingMethod: "simulate",
        onlyCategories: ["performance"],
        maxWaitForFcp: 15 * 1000,
        maxWaitForLoad: 35 * 1000,
        emulatedFormFactor: 'mobile',
        output: ["json", "html"],
        throttling: {
            // Using a "broadband" connection type
            // Corresponds to "Dense 4G 25th percentile" in https://docs.google.com/document/d/1Ft1Bnq9-t4jK5egLSOc28IL4TvR-Tt0se_1faTA4KTY/edit#heading=h.bb7nfy2x9e5v
            rttMs: 80, //Broadband:40 ms 4G:80 ms 3G:300 ms 2.5G:1,000 ms 2G: 2, 200 ms
            throughputKbps: 4 * 1024, //Broadband:10 Mbps, 4G:4 Mbps, 3G:1.2 Mbps, 2.5G:600 kbps, 2G:120 kbps
            cpuSlowdownMultiplier: 4, //Fastest 1x Premium Mobile ~2x Average Mobile ~4x Low-End Mobile ~8x
        },
        skipAudits: ['uses-http2', 'screenshot-thumbnails', 'final-screenshot'] // 'screenshot-thumbnails', 'uses-text-compression', 'uses-long-cache-ttl'
    },
};