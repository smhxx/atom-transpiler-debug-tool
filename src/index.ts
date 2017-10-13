#!/usr/bin/env node
import chalk = require('chalk');
import Directory from './model/Directory';
import Transpiler from './model/Transpiler';
import { Package } from './model/Package';

function logAll(iterator: Readonly<Iterable<string>>, style?: chalk.ChalkChain) {
  for (const str of iterator as Iterable<string>) {
    console.log(style === undefined ? str : `${style(str)}`);
  }
}

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
  logAll(Array.from(unmatched.directories).map(d => `${d.path.replace('\\','/')}/`), chalk.gray);
  logAll(Array.from(unmatched.files).map(f => f.replace('\\','/')), chalk.gray);
  console.log('');
}

const knownKeys = Transpiler.getKnownCacheKeys().size;
const unknownKeys = Package.cachedFiles.size - knownKeys;
if (unknownKeys > 0) {
  console.log(`${unknownKeys} additional outdated entries were also found in the cache.`);
} else {
  console.log('No outdated entries were found in the cache.');
}
