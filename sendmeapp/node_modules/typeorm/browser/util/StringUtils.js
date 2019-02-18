/**
 * Converts string into camelCase.
 *
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export function camelCase(str, firstCapital) {
    if (firstCapital === void 0) { firstCapital = false; }
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (firstCapital === true && offset === 0)
            return p1;
        if (p2)
            return p2.toUpperCase();
        return p1.toLowerCase();
    });
}
/**
 * Converts string into snake-case.
 *
 * @see https://regex101.com/r/QeSm2I/1
 */
export function snakeCase(str) {
    return str.replace(/(?:([a-z])([A-Z]))|(?:((?!^)[A-Z])([a-z]))/g, "$1_$3$2$4").toLowerCase();
}
/**
 * Converts string into title-case.
 *
 * @see http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
export function titleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
/**
 * Builds abbreviated string from given string;
 */
export function abbreviate(str, abbrLettersCount) {
    if (abbrLettersCount === void 0) { abbrLettersCount = 1; }
    var words = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2").split(" ");
    return words.reduce(function (res, word) {
        res += word.substr(0, abbrLettersCount);
        return res;
    }, "");
}

//# sourceMappingURL=StringUtils.js.map
