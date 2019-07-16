const utils = require('../utils');

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
            "SUMMARY": summary,
            "DTSTART": dtstart,
            "DTEND": dtend
        });
    });
    events.reverse();
    return events;
}

module.exports = async function () {
    const url = 'https://starlight.kirara.ca/history';
    console.log('Fetch:', url);
    try {
        const html = await utils.pRequest({ url });
        return parseData(html);
    } catch (err) {
        return Promise.reject(err);
    }
};
