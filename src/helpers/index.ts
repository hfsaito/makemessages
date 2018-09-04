import * as path from 'path';

export * from './RegExpAll';
export * from './format';
export * from './RegexNamedGroups';

export function absolutePath(file) { return path.resolve(process.cwd(), file); };