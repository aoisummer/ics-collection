const fs = require('node:fs/promises');
const icalendar = require('icalendar');
const { v3: uuidv3 } = require('uuid');

exports.convertToICS = function convertToICS(data, name) {
  const ical = new icalendar.iCalendar();

  data.forEach((e, i) => {
    const uid = uuidv3(
      ['http://icalendar.example.com', name, i].join('/'),
      uuidv3.URL
    );
    const event = new icalendar.VEvent(uid);

    event.setProperty('SUMMARY', e.title);
    if (e.allDay) {
      event.setProperty('DTSTART', e.start, { VALUE: 'DATE' });
      event.setProperty('DTEND', e.end, { VALUE: 'DATE' });
    } else {
      event.setProperty('DTSTART', e.start);
      event.setProperty('DTEND', e.end);
    }
    ical.addComponent(event);
  });
  return ical.toString();
};

exports.getType = function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
};

exports.webRequest = async function webRequest(url, options = {}) {
  const http = require('http');
  const https = require('https');
  const module = new URL(url).protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const chunks = [];
    const req = module.request(
      url,
      { timeout: 60 * 1000, ...options },
      (res) => {
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(res.statusMessage));
            return;
          }
          const body = Buffer.concat(chunks);
          resolve({
            data: options.raw ? body : body.toString(),
            status: res.statusCode,
            headers: res.headers,
          });
        });
      }
    );
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
};

exports.exists = async function exists(file) {
  let result = false;
  try {
    await fs.access(file);
    result = true;
  } catch (e) {}
  return result;
};
