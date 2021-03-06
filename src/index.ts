#!/usr/bin/env node
import { default as chalk, Chalk } from 'chalk';
import Directory from './model/Directory';
import Transpiler from './model/Transpiler';
import { Package } from './model/Package';

function logAll(iterator: Readonly<Iterable<string>>, style?: Chalk) {
  for (const str of iterator as Iterable<string>) {
    console.log(style === undefined ? str : `${style(str)}`);
  }
}

const denormalize = (path: string) => path.replace(/\\/g, '/');

const projectDir = new Directory();
const matchInfo = Transpiler.getGlobMatchInfo();
const unmatched = projectDir.getUnmatchedDescendants(matchInfo.matches);

Transpiler.logAll();

if (matchInfo.conflicts.size > 0) {
  console.log(`${chalk.red('The following files matched the glob for multiple transpilers:')}`);
  logAll(matchInfo.conflicts, chalk.yellow);
  console.log('');
}

if (unmatched.directories.size > 0 || unmatched.files.size > 0) {
  console.log('The following directories and files were not matched by any glob:');
  logAll(Array.from(unmatched.directories).map(d => `${denormalize(d.path)}/`), chalk.gray);
  logAll(Array.from(unmatched.files).map(denormalize), chalk.gray);
  console.log('');
}

const knownKeys = Transpiler.getKnownCacheKeys().size;
const unknownKeys = Package.cachedFiles.size - knownKeys;
if (unknownKeys > 0) {
  const plural = unknownKeys > 1;
  // tslint:disable-next-line max-line-length
  console.log(`${unknownKeys} additional outdated entr${plural ? 'ies were' : 'y was'} also found in the cache.`);
} else {
  console.log('No outdated entries were found in the cache.');
}
