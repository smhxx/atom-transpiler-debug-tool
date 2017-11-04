import glob = require('glob');
import chalk from 'chalk';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as resolve from 'resolve';
import { AtomPackageConfig, PackageMeta } from '../defs';
import { Package } from './Package';
import FileMatch from './FileMatch';

interface CacheKeyProvider {
  getCacheKeyData: (source: string, filePath: string, opts: any, meta: PackageMeta) => string;
}

interface GlobMatchInfo {
  matches: Set<string>;
  conflicts: Set<string>;
}

function compileMatchInfo(accumulator: GlobMatchInfo, matches: string[]): GlobMatchInfo {
  for (const match of matches) {
    const normPath = path.normalize(match);
    if (accumulator.matches.has(normPath)) {
      accumulator.conflicts.add(normPath);
    } else {
      accumulator.matches.add(normPath);
    }
  }
  return accumulator;
}

export default class Transpiler {
  readonly glob: string;
  readonly name: string;
  readonly path: string;
  readonly source: string;
  readonly options: object = {};
  readonly module: CacheKeyProvider;
  readonly matches: ReadonlyArray<FileMatch>;
  readonly header: (index: number, max: number) => string;

  private static instances: ReadonlyArray<Transpiler>;

  constructor(listing: AtomPackageConfig.TranspilerListing) {
    this.name = listing.transpiler;
    this.glob = listing.glob;
    this.path = resolve.sync(this.name, {
      basedir: Package.path,
      extensions: Object.keys(require.extensions),
    });
    this.source = fs.readFileSync(this.path).toString();
    this.module = require(this.path);
    if (listing.options !== undefined) {
      this.options = listing.options;
    }

    const matches = [] as FileMatch[];
    const matchPaths = glob.sync(this.glob, { nodir: true });
    for (const matchPath of matchPaths) {
      const normPath = path.normalize(matchPath);
      matches.push(new FileMatch(normPath, this.provideHash));
    }
    this.matches = Object.freeze(matches);
  }

  static getAll(): ReadonlyArray<Transpiler> {
    if (Transpiler.instances === undefined) {
      let transpilers = [] as Transpiler[];
      if (typeof Package.config.atomTranspilers === 'object') {
        transpilers = Package.config.atomTranspilers.map(t => new Transpiler(t));
      }
      if (transpilers.length === 0) {
        throw new Error(`Current package ${Package.name} does not have any transpilers enabled.`);
      }
      Transpiler.instances = Object.freeze(transpilers);
    }
    return Transpiler.instances;
  }

  static getGlobMatchInfo(): GlobMatchInfo {
    const matchArrays = Transpiler.getAll().map(t => glob.sync(t.glob));
    return matchArrays.reduce(
      compileMatchInfo,
      {
        matches: new Set<string>(),
        conflicts: new Set<string>(),
      },
    );
  }

  static getKnownCacheKeys(): Set<string> {
    const knownKeys = new Set<string>();
    for (const transpiler of Transpiler.getAll()) {
      for (const match of transpiler.matches) {
        if (match.isCached) {
          knownKeys.add(match.cacheKey);
        }
      }
    }
    return knownKeys;
  }

  static logAll(): void {
    for (const transpiler of Transpiler.getAll()) {
      transpiler.log();
    }
  }

  private log(): void {
    const pad = Math.max(this.matches.reduce((a, v) => Math.max(a, v.path.length), 0), 8);
    const index = `${Transpiler.instances.indexOf(this) + 1} of ${Transpiler.instances.length}`;
    console.log(`${chalk.cyan(`Transpiler ${index}:`)} ${this.name}
${chalk.cyan('Glob:')} ${this.glob} ${chalk.gray(`(matches ${this.matches.length} files)`)}\n`);
    // tslint:disable-next-line prefer-array-literal
    const headerPad = new Array<string>(pad - 8).fill(' ').join('');
    const header =
      `  ${chalk.underline('Filename')}${headerPad} ${chalk.underline('Current Version Hash')}`;
    console.log(header);
    for (const match of this.matches) {
      console.log(match.listing(pad));
    }
    console.log(`
${chalk.gray('--------------------------------------------------------------------------------')}
`);
  }

  private getCacheKeyDataForMatch = (file: FileMatch) =>
    this.module.getCacheKeyData(file.source, path.resolve(file.path), this.options, Package.meta)

  provideHash = (match: FileMatch) =>
    crypto.createHash('sha1')
    .update(JSON.stringify(this.options))
    .update(this.source, 'utf8')
    .update(match.source, 'utf8')
    .update(this.getCacheKeyDataForMatch(match), 'utf8')
    .digest('hex')
}
