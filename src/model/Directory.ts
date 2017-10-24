import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

interface Descendants {
  readonly files: Readonly<Set<string>>;
  readonly directories: Readonly<Set<Directory>>;
}

interface MutableDescendants {
  readonly files: Set<string>;
  readonly directories: Set<Directory>;
}

export default class Directory {
  readonly path: string;
  readonly children: Descendants;

  constructor(relPath: string = '') {
    this.path = relPath;
    const absPath = path.resolve(relPath);
    assert(fs.statSync(absPath).isDirectory());

    const files = new Set<string>();
    const directories = new Set<Directory>();
    for (const child of fs.readdirSync(absPath)) {
      const childRelPath = path.join(relPath, child);
      const childAbsPath = path.join(absPath, child);
      const stat = fs.statSync(childAbsPath);
      if (stat.isDirectory()) {
        directories.add(new Directory(childRelPath));
      } else if (stat.isFile()) {
        files.add(childRelPath);
      }
    }
    this.children = { files, directories };
  }

  getUnmatchedDescendants(matchedPaths: Readonly<Set<string>>): MutableDescendants {
    const files = new Set<string>();
    const directories = new Set<Directory>();
    for (const childDir of this.children.directories as Set<Directory>) {
      if (childDir.hasMatch(matchedPaths)) {
        const unmatched = childDir.getUnmatchedDescendants(matchedPaths);
        unmatched.files.forEach(f => files.add(f));
        unmatched.directories.forEach(d => directories.add(d));
      } else {
        directories.add(childDir);
      }
    }
    for (const childFile of this.children.files as Set<string>) {
      if (!matchedPaths.has(childFile)) {
        files.add(childFile);
      }
    }
    return { files, directories };
  }

  private hasMatch(matchedPaths: Readonly<Set<string>>): boolean {
    for (const matchedPath of matchedPaths as Set<string>) {
      if (matchedPath.startsWith(this.path)) {
        return true;
      }
    }
    return false;
  }
}
