import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { convertToICS, exists } from './utils.js';
import config from './config.js';

(async function main() {
  const name = process.argv[2];

  if (name == null || !name.match(/^[\w-]+$/)) {
    throw new Error('Invalid module name.');
  }

  const modFile = path.resolve(config.modDir, `${name}.js`);
  const dataFile = path.resolve(config.distDir, `${name}.json`);
  const calFile = path.resolve(config.distDir, `${name}.ics`);
  let data;

  const exist1 = await exists(modFile);
  const exist2 = await exists(dataFile);

  if (exist1) {
    const mod = await import(url.pathToFileURL(modFile));
    data = await mod.default();

    if (data == null) {
      throw new Error('No data.');
    }

    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
  } else if (exist2) {
    const content = await fs.readFile(dataFile);
    data = JSON.parse(content.toString());
  }

  if (data == null) {
    throw new Error('Data source not found.');
  }

  await fs.writeFile(calFile, convertToICS(data, name));
  console.log(`${name} saved.`);
})();
