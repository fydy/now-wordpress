import { shouldServe, BuildOptions, PrepareCacheOptions } from '@now/build-utils';
export declare const version = 3;
export declare function build({ files, entrypoint, workPath, config, meta, }: BuildOptions): Promise<{
    output: import("@now/build-utils/dist").Lambda;
}>;
export declare function prepareCache({ workPath }: PrepareCacheOptions): Promise<Files>;
export { shouldServe };
