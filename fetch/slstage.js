const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const axios = require('axios');
// const { httpsOverHttp, httpOverHttp } = require('tunnel-agent');

function parseData(str) {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(str);
    const events = [];
    
    dom.window.document.querySelectorAll('.box.history_ev.he_event').forEach((row) => {
        const summary = row.querySelector('.header .item strong').textContent;
        const times = row.querySelectorAll('.contents .time_localize');
        const dtstart = new Date(Number(times[0].getAttribute('data-ts')) * 1000);
        const dtend = new Date(Number(times[1].getAttribute('data-ts')) * 1000);
        
        events.push({
            title: summary,
            start: dtstart.toISOString(),
            end: dtend.toISOString(),
        });
    });
    events.reverse();
    return events;
}

module.exports = async () => {
    const url = 'https://starlight.kirara.ca/history';
    let cache = [];

    try {
        const content = await fsp.readFile(path.resolve(__dirname, '../dist/' + path.parse(__filename).name + '.json'));
        cache = JSON.parse(content.toString());
    } catch (err) {}

    const cacheKey = cache.map((item) => { return item.start; });

    console.log('Fetch:', url);
    const res = await axios(url);
    // const tunnelOptions = { proxy: { port: 1082 } };
    // const res = await axios(url, { httpAgent: httpOverHttp(tunnelOptions), httpsAgent: httpsOverHttp(tunnelOptions) });
    const newData = parseData(res.data);

    newData.forEach((item) => {
        const key = item.start;
        if (cacheKey.indexOf(key) === -1) {
            cache.push(item);
        }
    });
    return cache;
};
