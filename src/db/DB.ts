const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
import * as fs from 'fs';

const dir = 'bin';
!fs.existsSync(dir) && fs.mkdirSync(dir);

const DB = fileName => low(new FileSync(`${dir}/${fileName}.json`));

export {DB};
