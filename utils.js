
function convertToICS(data, name) {
    const icalendar = require('icalendar');
    const uuid = require('uuid/v3');
    const ical = new icalendar.iCalendar();

    data.forEach((e, i) => {
        const uid = uuid(['http://icalendar.example.com', name, i].join('/'), uuid.URL);
        const event = new icalendar.VEvent(uid);

        for (let k in e) {
            if (!k.match(/^[A-Z-]+$/)) {
                continue;
            }
            event.setProperty(k, e[k]);
        }
        ical.addComponent(event);
    });
    return ical.toString();
}

function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

function pRequest(options) {
    const request = require('request');

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject(error || new Error('Network error.'));
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    convertToICS,
    getType,
    pRequest
};
