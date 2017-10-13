/*
 *  Definitions for package.json
 */
export namespace PackageConfig {
  type ModulesRecord = { readonly [moduleName: string]: string };

  interface Person {
    readonly name: string;
    readonly url?: string;
    readonly email?: string;
  }

  interface TypeAndUrl {
    readonly type?: string;
    readonly url?: string;
  }

  interface BugsInfo {
    readonly url?: string;
    readonly email?: string;
  }

  interface Directories {
    readonly bin?: string;
    readonly doc?: string;
    readonly example?: string;
    readonly lib?: string;
    readonly man?: string;
    readonly test?: string;
  }

  interface CoreProperties {
    readonly name: string;
    readonly version: string;
    readonly description?: string;
    readonly keywords?: ReadonlyArray<string>;
    readonly homepage?: string;
    readonly bugs?: BugsInfo | string;
    readonly license?: string;
    readonly licenses?: ReadonlyArray<TypeAndUrl>;
    readonly author?: Person;
    readonly contributors?: ReadonlyArray<Person>;
    readonly maintainers?: ReadonlyArray<Person>;
    readonly files?: ReadonlyArray<string>;
    readonly main?: string;
    readonly bin?: ModulesRecord | string;
    readonly man?: ReadonlyArray<string> | string;
    readonly directories?: Directories;
    readonly repository?: TypeAndUrl | string;
    readonly scripts?: Readonly<Record<string, string>>;
    readonly config?: Readonly<Record<string, any>>;
    readonly dependencies?: ModulesRecord;
    readonly devDependencies?: ModulesRecord;
    readonly optionalDependencies?: ModulesRecord;
    readonly peerDependencies?: ModulesRecord;
    readonly engines?: Readonly<Record<string, string>>;
    readonly engineStrict?: boolean;
    readonly os?: ReadonlyArray<string>;
    readonly cpu?: ReadonlyArray<string>;
    readonly preferGlobal?: boolean;
    readonly private?: boolean;
    readonly publishConfig?: Readonly<Record<string, any>>;
    readonly dist?: { readonly shasum: string, readonly tarball: string };
    readonly readme?: string;
  }
}

export interface PackageConfig extends PackageConfig.CoreProperties {
  readonly jpsm?: PackageConfig.CoreProperties;
}

/*
 *  Definitions for Atom-specific package.json
 */
export namespace AtomPackageConfig {
  interface TranspilerListing {
    readonly glob: string;
    readonly transpiler: string;
    readonly options?: object;
  }
}

export interface AtomPackageConfig extends PackageConfig {
  readonly atomTranspilers?: ReadonlyArray<AtomPackageConfig.TranspilerListing>;
}

export interface PackageMeta {
  name: string;
  path: string;
  meta: AtomPackageConfig;
}
