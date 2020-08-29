const icalendar = require('icalendar');
const { v3: uuidv3 } = require('uuid');

function convertToICS(data, name) {
    const ical = new icalendar.iCalendar();

    data.forEach((e, i) => {
        const uid = uuidv3(['http://icalendar.example.com', name, i].join('/'), uuidv3.URL);
        const event = new icalendar.VEvent(uid);

        // for (let k in e) {
            // if (!k.match(/^[A-Z-]+$/)) {
                // continue;
            // }
            // event.setProperty(k, e[k]);
        // }
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

module.exports = { convertToICS, getType };
