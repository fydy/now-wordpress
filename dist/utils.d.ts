import { FileBlob, BuildOptions } from '@now/build-utils';
export declare function getIncludedFiles({ files, entrypoint, workPath, config, meta }: BuildOptions): Promise<Files>;
export declare function getPhpFiles({ meta }: MetaOptions): Promise<Files>;
export declare function getPhpLibFiles(): Promise<Files>;
export declare function modifyPhpIni(phpini: FileBlob, directives: PhpIni): FileBlob;
export declare function getLauncherFiles({ meta }: MetaOptions): Files;
export declare function getComposerFiles(workPath: string): Promise<Files>;
export declare function ensureLocalPhp(): Promise<boolean>;
