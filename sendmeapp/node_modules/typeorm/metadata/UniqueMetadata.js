"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Unique metadata contains all information about table's unique constraints.
 */
var UniqueMetadata = /** @class */ (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function UniqueMetadata(options) {
        /**
         * Unique columns.
         */
        this.columns = [];
        this.entityMetadata = options.entityMetadata;
        if (options.columns)
            this.columns = options.columns;
        if (options.args) {
            this.target = options.args.target;
            this.givenName = options.args.name;
            this.givenColumnNames = options.args.columns;
        }
    }
    // ---------------------------------------------------------------------
    // Public Build Methods
    // ---------------------------------------------------------------------
    /**
     * Builds some depend unique constraint properties.
     * Must be called after all entity metadata's properties map, columns and relations are built.
     */
    UniqueMetadata.prototype.build = function (namingStrategy) {
        var _this = this;
        var map = {};
        // if columns already an array of string then simply return it
        if (this.givenColumnNames) {
            var columnPropertyNames = [];
            if (this.givenColumnNames instanceof Array) {
                columnPropertyNames = this.givenColumnNames;
                columnPropertyNames.forEach(function (name) { return map[name] = 1; });
            }
            else {
                // if columns is a function that returns array of field names then execute it and get columns names from it
                var columnsFnResult_1 = this.givenColumnNames(this.entityMetadata.propertiesMap);
                if (columnsFnResult_1 instanceof Array) {
                    columnPropertyNames = columnsFnResult_1.map(function (i) { return String(i); });
                    columnPropertyNames.forEach(function (name) { return map[name] = 1; });
                }
                else {
                    columnPropertyNames = Object.keys(columnsFnResult_1).map(function (i) { return String(i); });
                    Object.keys(columnsFnResult_1).forEach(function (columnName) { return map[columnName] = columnsFnResult_1[columnName]; });
                }
            }
            this.columns = columnPropertyNames.map(function (propertyName) {
                var columnWithSameName = _this.entityMetadata.columns.find(function (column) { return column.propertyPath === propertyName; });
                if (columnWithSameName) {
                    return [columnWithSameName];
                }
                var relationWithSameName = _this.entityMetadata.relations.find(function (relation) { return relation.isWithJoinColumn && relation.propertyName === propertyName; });
                if (relationWithSameName) {
                    return relationWithSameName.joinColumns;
                }
                throw new Error("Unique constraint " + (_this.givenName ? "\"" + _this.givenName + "\" " : "") + "contains column that is missing in the entity: " + propertyName);
            })
                .reduce(function (a, b) { return a.concat(b); });
        }
        this.name = this.givenName ? this.givenName : namingStrategy.uniqueConstraintName(this.entityMetadata.tablePath, this.columns.map(function (column) { return column.databaseName; }));
        return this;
    };
    return UniqueMetadata;
}());
exports.UniqueMetadata = UniqueMetadata;

//# sourceMappingURL=UniqueMetadata.js.map
