import * as tslib_1 from "tslib";
import { DriverPackageNotInstalledError } from "../../error/DriverPackageNotInstalledError";
import { SqliteQueryRunner } from "./SqliteQueryRunner";
import { DriverOptionNotSetError } from "../../error/DriverOptionNotSetError";
import { PlatformTools } from "../../platform/PlatformTools";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
/**
 * Organizes communication with sqlite DBMS.
 */
var SqliteDriver = /** @class */ (function (_super) {
    tslib_1.__extends(SqliteDriver, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function SqliteDriver(connection) {
        var _this = _super.call(this, connection) || this;
        _this.connection = connection;
        _this.options = connection.options;
        _this.database = _this.options.database;
        // validate options to make sure everything is set
        if (!_this.options.database)
            throw new DriverOptionNotSetError("database");
        // load sqlite package
        _this.loadDependencies();
        return _this;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Closes connection with database.
     */
    SqliteDriver.prototype.disconnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        _this.queryRunner = undefined;
                        _this.databaseConnection.close(function (err) { return err ? fail(err) : ok(); });
                    })];
            });
        });
    };
    /**
     * Creates a query runner used to execute database queries.
     */
    SqliteDriver.prototype.createQueryRunner = function (mode) {
        if (mode === void 0) { mode = "master"; }
        if (!this.queryRunner)
            this.queryRunner = new SqliteQueryRunner(this);
        return this.queryRunner;
    };
    SqliteDriver.prototype.normalizeType = function (column) {
        if (column.type === Buffer) {
            return "blob";
        }
        return _super.prototype.normalizeType.call(this, column);
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates connection with the database.
     */
    SqliteDriver.prototype.createDatabaseConnection = function () {
        var _this = this;
        return new Promise(function (ok, fail) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var databaseConnection;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createDatabaseDirectory(this.options.database)];
                    case 1:
                        _a.sent();
                        databaseConnection = new this.sqlite.Database(this.options.database, function (err) {
                            if (err)
                                return fail(err);
                            // we need to enable foreign keys in sqlite to make sure all foreign key related features
                            // working properly. this also makes onDelete to work with sqlite.
                            databaseConnection.run("PRAGMA foreign_keys = ON;", function (err, result) {
                                if (err)
                                    return fail(err);
                                ok(databaseConnection);
                            });
                            // in the options, if encryption key for for SQLCipher is setted.
                            if (_this.options.key) {
                                databaseConnection.run("PRAGMA key = " + _this.options.key + ";", function (err, result) {
                                    if (err)
                                        return fail(err);
                                    ok(databaseConnection);
                                });
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    SqliteDriver.prototype.loadDependencies = function () {
        try {
            this.sqlite = PlatformTools.load("sqlite3").verbose();
        }
        catch (e) {
            throw new DriverPackageNotInstalledError("SQLite", "sqlite3");
        }
    };
    /**
     * Auto creates database directory if it does not exist.
     */
    SqliteDriver.prototype.createDatabaseDirectory = function (fullPath) {
        return new Promise(function (resolve, reject) {
            var mkdirp = PlatformTools.load("mkdirp");
            var path = PlatformTools.load("path");
            mkdirp(path.dirname(fullPath), function (err) { return err ? reject(err) : resolve(); });
        });
    };
    return SqliteDriver;
}(AbstractSqliteDriver));
export { SqliteDriver };

//# sourceMappingURL=SqliteDriver.js.map
