import * as assert from 'assert';
import { readdirSync, readFileSync, statSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { AtomPackageConfig, PackageMeta } from '../defs';

export namespace Package {
  export const base: string = resolve();
  export const path: string = resolve('package.json');
  export const config: Readonly<AtomPackageConfig> = resolveConfig();
  export const name: string = Package.config.name;
  export const cachedFiles: Readonly<Set<string>> = getCachedFiles();
  export const meta: Readonly<PackageMeta> = {
    name,
    path,
    meta: config,
  };
}

function resolveConfig(): Readonly<AtomPackageConfig> {
  assert(statSync(Package.path).isFile());
  return Object.freeze(JSON.parse(readFileSync(Package.path).toString()));
}

function getCachedFiles(): Set<string> {
  const base = resolve(homedir(), `.atom/compile-cache/package-transpile`);
  const cacheDir = join(base, Package.name);
  assert(statSync(cacheDir).isDirectory());
  const cachedFiles = new Set<string>();
  for (const file of readdirSync(cacheDir)) {
    if (statSync(join(cacheDir, file)).isFile()) {
      cachedFiles.add(file);
    }
  }
  return cachedFiles;
}
