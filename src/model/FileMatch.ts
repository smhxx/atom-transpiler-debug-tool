import chalk = require('chalk');
import { readFileSync } from 'fs';
import { Package } from './Package';

function pad(str: string, len: number): string {
  // tslint:disable-next-line prefer-array-literal
  const pad = new Array<string>(len - str.length).fill(' ').join('');
  return `${str}${pad}`;
}

type HashProvider = (match: FileMatch) => string;

export default class FileMatch {
  readonly path: string;
  readonly displayPath: string;
  readonly source: string;
  readonly cacheKey: string;
  readonly isCached: boolean;
  readonly listing: (pad: number) => string;

  constructor(path: string, getHash: HashProvider) {
    this.path = path;
    this.displayPath = path.replace(/\\/g,'/');
    this.source = readFileSync(path, 'utf8').toString();
    this.cacheKey = getHash(this);
    this.isCached = Package.cachedFiles.has(this.cacheKey);
    this.listing = this.isCached ?
      (len: number) =>
        `${chalk.yellow('C')} ${pad(this.displayPath, len)} ${chalk.green(this.cacheKey)}` :
      (len: number) =>
        `${chalk.gray(`- ${pad(this.displayPath, len)}`)} ${chalk.red(this.cacheKey)}`;
  }
}
