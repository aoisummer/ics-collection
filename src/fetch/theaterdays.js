import fs from 'node:fs/promises';
import path from 'node:path';

function parseData(str) {
  const data = JSON.parse(str);
  const events = data.map((item) => {
    return {
      title: item.name,
      start: new Date(item.schedule.beginAt).toISOString(),
      end: new Date(item.schedule.endAt).toISOString(),
    };
  });

  return events;
}

export default async function fetcher() {
  const url = 'https://api.matsurihi.me/api/mltd/v2/ja/events';
  const cache = [];

  try {
    const content = await fs.readFile(path.resolve(config.distDir, 'theaterdays.json'));
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
