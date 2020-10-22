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

module.exports = async function () {
    const url = 'https://mltd.matsurihi.me/events/';
    console.log('Fetch:', url);
    const res = await axios(url);
    return parseData(res.data);
};
