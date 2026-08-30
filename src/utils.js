import fs from 'node:fs/promises';

import ical from 'ical-generator';
import { v3 as uuidv3 } from 'uuid';

export function convertToICS(data, name) {
  const calendar = ical();

  data.forEach((e, i) => {
    calendar.createEvent({
      id: uuidv3(`http://icalendar.example.com/${name}/${i}`, uuidv3.URL),
      start: new Date(e.start),
      end: new Date(e.end),
      summary: e.title,
      allDay: e.allDay,
    });
  });

  return calendar.toString();
}

export async function exists(file) {
  let result = false;
  try {
    await fs.access(file);
    result = true;
  } catch (e) {}
  return result;
}

export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
