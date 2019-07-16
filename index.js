/*!
 * Fetch and convert to iCalendar format files
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const utils = require('./utils');

(async function () {
    try {
        const name = process.argv[2];

        if (name == null || !name.match(/^[\w-]+$/)) {
            throw new Error('Invalid module name.');
        }

        const modFile = path.join(__dirname, 'fetch', name + '.js');
        const file1 = path.join(__dirname, 'dist', name + '.json');
        const file2 = path.join(__dirname, 'dist', name + '.ics');
        let data;

        if (fs.existsSync(modFile)) {
            const fn = require(modFile);
            if (['Function', 'AsyncFunction'].indexOf(utils.getType(fn)) === -1) {
                throw new Error('Invalid function.');
            }
            data = await fn();
            util.promisify(fs.writeFile)(file1, JSON.stringify(data, null, 4));
        } else if (fs.existsSync(file1)) {
            const content = await utils.pReadFile(file1);
            data = JSON.parse(content);
        }
        if (!data) {
            throw new Error('Data source not found.')
        }

        await util.promisify(fs.writeFile)(file2, utils.convertToICS(data, name));
        console.log(name + ' saved.');
    } catch (err) {
        console.error(err);
    }
})();
