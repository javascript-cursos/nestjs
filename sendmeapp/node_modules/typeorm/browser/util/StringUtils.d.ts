/**
 * Converts string into camelCase.
 *
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export declare function camelCase(str: string, firstCapital?: boolean): string;
/**
 * Converts string into snake-case.
 *
 * @see https://regex101.com/r/QeSm2I/1
 */
export declare function snakeCase(str: string): string;
/**
 * Converts string into title-case.
 *
 * @see http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
export declare function titleCase(str: string): string;
/**
 * Builds abbreviated string from given string;
 */
export declare function abbreviate(str: string, abbrLettersCount?: number): string;
