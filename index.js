/*!
 * Fetch and convert to iCalendar format files
 */

const fs = require('node:fs/promises');
const path = require('node:path');

const utils = require('./utils');

(async function () {
  const name = process.argv[2];

  if (name == null || !name.match(/^[\w-]+$/)) {
    throw new Error('Invalid module name.');
  }

  const modFile = path.join(__dirname, 'fetch', name + '.js');
  const file1 = path.join(__dirname, 'dist', name + '.json');
  const file2 = path.join(__dirname, 'dist', name + '.ics');
  let data;

  const exist1 = await utils.exists(modFile);
  const exist2 = await utils.exists(file1);
  if (exist1) {
    const fn = require(modFile);
    if (['Function', 'AsyncFunction'].indexOf(utils.getType(fn)) === -1) {
      throw new Error('Invalid function.');
    }
    data = await fn();
    if (data == null) {
      throw new Error('No data.');
    }
    await fs.writeFile(file1, JSON.stringify(data, null, 4));
  } else if (exist2) {
    const content = await fs.readFile(file1);
    data = JSON.parse(content);
  }
  if (!data) {
    throw new Error('Data source not found.');
  }

  await fs.writeFile(file2, utils.convertToICS(data, name));
  console.log(name + ' saved.');
})();
