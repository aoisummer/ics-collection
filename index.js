/*!
 * Fetch and convert to iCalendar format files
 */

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const utils = require('./utils');

(async function () {
    const name = process.argv[2];

    if (name == null || !name.match(/^[\w-]+$/)) {
        return Promise.reject(new Error('Invalid module name.'));
    }

    const modFile = path.join(__dirname, 'fetch', name + '.js');
    const file1 = path.join(__dirname, 'dist', name + '.json');
    const file2 = path.join(__dirname, 'dist', name + '.ics');
    let data;

    if (fs.existsSync(modFile)) {
        const fn = require(modFile);
        if (['Function', 'AsyncFunction'].indexOf(utils.getType(fn)) === -1) {
            return Promise.reject(new Error('Invalid function.'));
        }
        data = await fn();
        await fsp.writeFile(file1, JSON.stringify(data, null, 4));
    } else if (fs.existsSync(file1)) {
        const content = await fsp.readFile(file1);
        data = JSON.parse(content);
    }
    if (!data) {
        return Promise.reject(new Error('Data source not found.'));
    }

    await fsp.writeFile(file2, utils.convertToICS(data, name));
    console.log(name + ' saved.');
})().catch(console.error);
