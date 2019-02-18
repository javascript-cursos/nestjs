"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var StringUtils_1 = require("../../util/StringUtils");
var OracleDriver_1 = require("../../driver/oracle/OracleDriver");
var RelationIdLoader = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RelationIdLoader(connection, queryRunner, relationIdAttributes) {
        this.connection = connection;
        this.queryRunner = queryRunner;
        this.relationIdAttributes = relationIdAttributes;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    RelationIdLoader.prototype.load = function (rawEntities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                promises = this.relationIdAttributes.map(function (relationIdAttr) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var results, relation, joinColumns_1, table, tableName, tableAlias_1, parameters_1, condition, qb_1, _a, relation, joinColumns_2, inverseJoinColumns, junctionAlias_1, inverseSideTableName, inverseSideTableAlias_1, junctionTableName, mappedColumns, parameters_2, joinColumnConditions, inverseJoinColumnCondition_1, condition, qb_2, _b;
                    var _this = this;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(relationIdAttr.relation.isManyToOne || relationIdAttr.relation.isOneToOneOwner)) return [3 /*break*/, 1];
                                // example: Post and Tag
                                // loadRelationIdAndMap("post.tagId", "post.tag")
                                // we expect it to load id of tag
                                if (relationIdAttr.queryBuilderFactory)
                                    throw new Error("Additional condition can not be used with ManyToOne or OneToOne owner relations.");
                                results = rawEntities.map(function (rawEntity) {
                                    var result = {};
                                    relationIdAttr.relation.joinColumns.forEach(function (joinColumn) {
                                        result[joinColumn.databaseName] = rawEntity[_this.buildColumnAlias(relationIdAttr.parentAlias, joinColumn.databaseName)];
                                    });
                                    relationIdAttr.relation.entityMetadata.primaryColumns.forEach(function (primaryColumn) {
                                        result[primaryColumn.databaseName] = rawEntity[_this.buildColumnAlias(relationIdAttr.parentAlias, primaryColumn.databaseName)];
                                    });
                                    return result;
                                });
                                return [2 /*return*/, {
                                        relationIdAttribute: relationIdAttr,
                                        results: results
                                    }];
                            case 1:
                                if (!(relationIdAttr.relation.isOneToMany || relationIdAttr.relation.isOneToOneNotOwner)) return [3 /*break*/, 3];
                                relation = relationIdAttr.relation;
                                joinColumns_1 = relation.isOwning ? relation.joinColumns : relation.inverseRelation.joinColumns;
                                table = relation.inverseEntityMetadata.target;
                                tableName = relation.inverseEntityMetadata.tableName;
                                tableAlias_1 = relationIdAttr.alias || tableName;
                                parameters_1 = {};
                                condition = rawEntities.map(function (rawEntity, index) {
                                    return joinColumns_1.map(function (joinColumn) {
                                        var parameterName = joinColumn.databaseName + index;
                                        parameters_1[parameterName] = rawEntity[_this.buildColumnAlias(relationIdAttr.parentAlias, joinColumn.referencedColumn.databaseName)];
                                        return tableAlias_1 + "." + joinColumn.propertyPath + " = :" + parameterName;
                                    }).join(" AND ");
                                }).map(function (condition) { return "(" + condition + ")"; })
                                    .join(" OR ");
                                // ensure we won't perform redundant queries for joined data which was not found in selection
                                // example: if post.category was not found in db then no need to execute query for category.imageIds
                                if (!condition)
                                    return [2 /*return*/, { relationIdAttribute: relationIdAttr, results: [] }];
                                qb_1 = this.connection.createQueryBuilder(this.queryRunner);
                                joinColumns_1.forEach(function (joinColumn) {
                                    qb_1.addSelect(tableAlias_1 + "." + joinColumn.propertyPath, joinColumn.databaseName);
                                });
                                relation.inverseRelation.entityMetadata.primaryColumns.forEach(function (primaryColumn) {
                                    qb_1.addSelect(tableAlias_1 + "." + primaryColumn.propertyPath, primaryColumn.databaseName);
                                });
                                qb_1.from(table, tableAlias_1)
                                    .where("(" + condition + ")") // need brackets because if we have additional condition and no brackets, it looks like (a = 1) OR (a = 2) AND b = 1, that is incorrect
                                    .setParameters(parameters_1);
                                // apply condition (custom query builder factory)
                                if (relationIdAttr.queryBuilderFactory)
                                    relationIdAttr.queryBuilderFactory(qb_1);
                                _a = {
                                    relationIdAttribute: relationIdAttr
                                };
                                return [4 /*yield*/, qb_1.getRawMany()];
                            case 2: return [2 /*return*/, (_a.results = _c.sent(),
                                    _a)];
                            case 3:
                                relation = relationIdAttr.relation;
                                joinColumns_2 = relation.isOwning ? relation.joinColumns : relation.inverseRelation.inverseJoinColumns;
                                inverseJoinColumns = relation.isOwning ? relation.inverseJoinColumns : relation.inverseRelation.joinColumns;
                                junctionAlias_1 = relationIdAttr.junctionAlias;
                                inverseSideTableName = relationIdAttr.joinInverseSideMetadata.tableName;
                                inverseSideTableAlias_1 = relationIdAttr.alias || inverseSideTableName;
                                junctionTableName = relation.isOwning ? relation.junctionEntityMetadata.tableName : relation.inverseRelation.junctionEntityMetadata.tableName;
                                mappedColumns = rawEntities.map(function (rawEntity) {
                                    return joinColumns_2.reduce(function (map, joinColumn) {
                                        map[joinColumn.propertyPath] = rawEntity[_this.buildColumnAlias(relationIdAttr.parentAlias, joinColumn.referencedColumn.databaseName)];
                                        return map;
                                    }, {});
                                });
                                // ensure we won't perform redundant queries for joined data which was not found in selection
                                // example: if post.category was not found in db then no need to execute query for category.imageIds
                                if (mappedColumns.length === 0)
                                    return [2 /*return*/, { relationIdAttribute: relationIdAttr, results: [] }];
                                parameters_2 = {};
                                joinColumnConditions = mappedColumns.map(function (mappedColumn, index) {
                                    return Object.keys(mappedColumn).map(function (key) {
                                        var parameterName = key + index;
                                        parameters_2[parameterName] = mappedColumn[key];
                                        return junctionAlias_1 + "." + key + " = :" + parameterName;
                                    }).join(" AND ");
                                });
                                inverseJoinColumnCondition_1 = inverseJoinColumns.map(function (joinColumn) {
                                    return junctionAlias_1 + "." + joinColumn.propertyPath + " = " + inverseSideTableAlias_1 + "." + joinColumn.referencedColumn.propertyPath;
                                }).join(" AND ");
                                condition = joinColumnConditions.map(function (condition) {
                                    return "(" + condition + " AND " + inverseJoinColumnCondition_1 + ")";
                                }).join(" OR ");
                                qb_2 = this.connection.createQueryBuilder(this.queryRunner);
                                inverseJoinColumns.forEach(function (joinColumn) {
                                    qb_2.addSelect(junctionAlias_1 + "." + joinColumn.propertyPath, joinColumn.databaseName)
                                        .addOrderBy(junctionAlias_1 + "." + joinColumn.propertyPath);
                                });
                                joinColumns_2.forEach(function (joinColumn) {
                                    qb_2.addSelect(junctionAlias_1 + "." + joinColumn.propertyPath, joinColumn.databaseName)
                                        .addOrderBy(junctionAlias_1 + "." + joinColumn.propertyPath);
                                });
                                qb_2.from(inverseSideTableName, inverseSideTableAlias_1)
                                    .innerJoin(junctionTableName, junctionAlias_1, condition)
                                    .setParameters(parameters_2);
                                // apply condition (custom query builder factory)
                                if (relationIdAttr.queryBuilderFactory)
                                    relationIdAttr.queryBuilderFactory(qb_2);
                                _b = {
                                    relationIdAttribute: relationIdAttr
                                };
                                return [4 /*yield*/, qb_2.getRawMany()];
                            case 4: return [2 /*return*/, (_b.results = _c.sent(),
                                    _b)];
                        }
                    });
                }); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Builds column alias from given alias name and column name,
     * If alias length is more than 29, abbreviates column name.
     */
    RelationIdLoader.prototype.buildColumnAlias = function (aliasName, columnName) {
        var columnAliasName = aliasName + "_" + columnName;
        if (columnAliasName.length > 29 && this.connection.driver instanceof OracleDriver_1.OracleDriver)
            return aliasName + "_" + StringUtils_1.abbreviate(columnName, 2);
        return columnAliasName;
    };
    return RelationIdLoader;
}());
exports.RelationIdLoader = RelationIdLoader;

//# sourceMappingURL=RelationIdLoader.js.map
