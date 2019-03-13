/*!
 * Fetch and convert to iCalendar format files
 */

const fs = require('fs');
const path = require('path');

const utils = require('./utils');

(async function () {
    const name = process.argv[2];

    if (name == null || !name.match(/^[\w-]+$/)) {
        console.log('Error: Invalid module name.');
        process.exit();
    }

    const modFile = path.join(__dirname, 'fetch', name + '.js');
    const file1 = path.join(__dirname, 'dist', name + '.json');
    const file2 = path.join(__dirname, 'dist', name + '.ics');
    let data;

    if (fs.existsSync(modFile)) {
        const fn = require(modFile);
        if (['Function', 'AsyncFunction'].indexOf(utils.getType(fn)) === -1) {
            console.log('Error: Invalid function.');
            process.exit();
        }
        data = await fn();
        utils.pWriteFile(file1, JSON.stringify(data, null, 4));
    } else if (fs.existsSync(file1)) {
        const content = await utils.pReadFile(file1);
        data = JSON.parse(content);
    }
    if (!data) {
        console.log('Error: Data source not found.');
        process.exit();
    }
    
    await utils.pWriteFile(file2, utils.convertToICS(data, name));
    console.log(name + ' saved.');
})();
