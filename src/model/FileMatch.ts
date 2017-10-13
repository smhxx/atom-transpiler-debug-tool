import chalk = require('chalk');
import { readFileSync } from 'fs';
import { Package } from './Package';

function pad(str: string, len: number): string {
  // tslint:disable-next-line prefer-array-literal
  const pad = new Array<string>(len - str.length).fill(' ').join('');
  return `${str}${pad}`;
}

export default class FileMatch {
  readonly path: string;
  readonly source: string;
  readonly cacheKey: string;
  readonly isCached: boolean;
  readonly listing: (pad: number) => string;

  constructor(path: string, getHash: (match: FileMatch) => string) {
    this.path = path;
    this.source = readFileSync(path, 'utf8').toString();
    this.cacheKey = getHash(this);
    this.isCached = Package.cachedFiles.has(this.cacheKey);
    this.listing = this.createListing(this.cacheKey);
  }

  private createListing(cacheKey: string): (pad: number) => string {
    return this.isCached ?
      (len: number) =>
        `${chalk.yellow('C')} ${pad(this.path, len)} ${chalk.green(cacheKey)}` :
      (len: number) =>
        `${chalk.gray(`  ${pad(this.path, len)}`)} ${chalk.red(cacheKey)}`;
  }
}
