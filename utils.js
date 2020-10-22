const icalendar = require('icalendar');
const { v3: uuidv3 } = require('uuid');

function convertToICS(data, name) {
    const ical = new icalendar.iCalendar();

    data.forEach((e, i) => {
        const uid = uuidv3(['http://icalendar.example.com', name, i].join('/'), uuidv3.URL);
        const event = new icalendar.VEvent(uid);

        event.setProperty('SUMMARY', e.title);
        event.setProperty('DTSTART', e.start);
        event.setProperty('DTEND', e.end);
        ical.addComponent(event);
    });
    return ical.toString();
}

function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

async function webRequest(url, options = {}) {
    const http = require('http');
    const https = require('https');
    const module = new URL(url).protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
        const chunks = [];
        const req = module.request(url, { timeout: 60 * 1000, ...options }, (res) => {
            // console.log('statusCode:', res.statusCode);
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        req.end();
    });
}

module.exports = { convertToICS, getType, webRequest };
