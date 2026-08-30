import fs from 'node:fs/promises';
import path from 'node:path';

import { JSDOM } from 'jsdom';

import config from '../config.js';

function parseData(str) {
  const dom = new JSDOM(str);
  const events = [];
  const now = new Date();

  dom.window.document.querySelectorAll('.box.history_ev.he_event').forEach((row) => {
    const summary = row.querySelector('.header .item strong').textContent;
    const times = row.querySelectorAll('.contents .time_localize');
    const dtstart = new Date(Number(times[0].getAttribute('data-ts')) * 1000);
    const dtend = new Date(Number(times[1].getAttribute('data-ts')) * 1000);

    if (dtstart > now) {
      return;
    }
    events.push({
      title: summary,
      start: dtstart.toISOString(),
      end: dtend.toISOString(),
    });
  });
  events.reverse();

  return events;
}

export default async function fetcher() {
  const url = 'https://starlight.kirara.ca/history';
  const cache = [];

  try {
    const content = await fs.readFile(path.resolve(config.distDir, 'slstage.json'));
    cache.push(...JSON.parse(content.toString()));
  } catch (e) {}

  const cacheKey = cache.map((item) => item.start);

  console.log('Fetch:', url);
  const res = await fetch(url);
  const text = await res.text();
  const newData = parseData(text);

  newData.forEach((item) => {
    const key = item.start;
    if (!cacheKey.includes(key)) {
      cache.push(item);
    }
  });

  return cache;
}
