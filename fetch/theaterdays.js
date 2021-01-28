const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const axios = require('axios');

function parseData(str) {
    const m = str.match(/fantasia\["events"\]=(\[.+?\]);/);
    const data = Function('"use strict";return (' + m[1] + ');')();
    const events = data.map((item) => {
        return {
            title: item.name,
            start: item.beginDate.toISOString(),
            end: item.endDate.toISOString(),
        };
    });
    events.reverse();
    return events;
}

module.exports = async () => {
    const url = 'https://mltd.matsurihi.me/events/';
    let cache = [];

    try {
        const content = await fsp.readFile(path.resolve(__dirname, '../dist/' + path.parse(__filename).name + '.json'));
        cache = JSON.parse(content.toString());
    } catch (err) {}

    const cacheKey = cache.map((item) => { return item.start; });

    console.log('Fetch:', url);
    const res = await axios(url);
    const newData = parseData(res.data);

    newData.forEach((item) => {
        const key = item.start;
        if (cacheKey.indexOf(key) === -1) {
            cache.push(item);
        }
    });
    return cache;
};
