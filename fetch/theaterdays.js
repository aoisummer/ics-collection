const utils = require('../utils');

function parseData(html) {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(html);
    const events = [];
    
    dom.window.document.querySelectorAll('.container .table>tbody>tr').forEach((row) => {
        const summary = row.querySelector('td:nth-of-type(1) .d-lg-inline').textContent;
        const time1 = Number(row.querySelector('td:nth-of-type(2)>span').getAttribute('data-date'));
        const time2 = Number(row.querySelector('td:nth-of-type(3)>span').getAttribute('data-date'));
        const dtstart = new Date(time1 * 1000);
        const dtend = new Date(time2 * 1000);
        events.push({
            "SUMMARY": summary,
            "DTSTART": dtstart,
            "DTEND": dtend
        });
    });
    events.reverse();
    return events;
}

module.exports = async function () {
    const url = 'https://mltd.matsurihi.me/events/';
    console.log('Fetch:', url);
    try {
        const html = await utils.pRequest({ url });
        return parseData(html);
    } catch (err) {
        return Promise.reject(err);
    }
};
