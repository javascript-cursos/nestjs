"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
/**
 * Marks a column to generate a value on entity insertion.
 * There are two types of generation strategy - increment and uuid.
 * Increment uses a number which increases by one on each insertion.
 * Uuid generates a special UUID token.
 *
 * Note, some databases do not support non-primary generation columns.
 */
function Generated(strategy) {
    if (strategy === void 0) { strategy = "increment"; }
    return function (object, propertyName) {
        __1.getMetadataArgsStorage().generations.push({
            target: object.constructor,
            propertyName: propertyName,
            strategy: strategy
        });
    };
}
exports.Generated = Generated;

//# sourceMappingURL=Generated.js.map
