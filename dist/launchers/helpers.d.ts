export declare const getUserDir: () => string;
export declare const getPhpDir: () => string;
export declare const isDev: () => boolean;
export declare function normalizeEvent(event: Event): AwsRequest;
export declare function transformFromAwsRequest({ method, path, host, headers, body, }: AwsRequest): Promise<PhpInput>;
export declare function transformToAwsResponse({ statusCode, headers, body }: PhpOutput): AwsResponse;
