import { getMetadataArgsStorage } from "../";
/**
 * Marks a column to generate a value on entity insertion.
 * There are two types of generation strategy - increment and uuid.
 * Increment uses a number which increases by one on each insertion.
 * Uuid generates a special UUID token.
 *
 * Note, some databases do not support non-primary generation columns.
 */
export function Generated(strategy) {
    if (strategy === void 0) { strategy = "increment"; }
    return function (object, propertyName) {
        getMetadataArgsStorage().generations.push({
            target: object.constructor,
            propertyName: propertyName,
            strategy: strategy
        });
    };
}

//# sourceMappingURL=Generated.js.map
