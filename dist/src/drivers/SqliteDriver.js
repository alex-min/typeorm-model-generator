"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColumnInfo_1 = require("../models/ColumnInfo");
const EntityInfo_1 = require("../models/EntityInfo");
const TomgUtils = require("../Utils");
const AbstractDriver_1 = require("./AbstractDriver");
class SqliteDriver extends AbstractDriver_1.AbstractDriver {
    constructor() {
        super(...arguments);
        this.sqlite = require("sqlite3").verbose();
        this.tablesWithGeneratedPrimaryKey = new Array();
    }
    GetAllTables(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = [];
            const rows = yield this.ExecQuery(`SELECT tbl_name, sql FROM "sqlite_master" WHERE "type" = 'table'  AND name NOT LIKE 'sqlite_%'`);
            rows.forEach(val => {
                const ent = new EntityInfo_1.EntityInfo();
                ent.EntityName = val.tbl_name;
                ent.Columns = [];
                ent.Indexes = [];
                if (val.sql.includes("AUTOINCREMENT")) {
                    this.tablesWithGeneratedPrimaryKey.push(ent.EntityName);
                }
                ret.push(ent);
            });
            return ret;
        });
    }
    GetCoulmnsFromEntity(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ent of entities) {
                const response = yield this.ExecQuery(`PRAGMA table_info('${ent.EntityName}');`);
                response.forEach(resp => {
                    const colInfo = new ColumnInfo_1.ColumnInfo();
                    colInfo.tsName = resp.name;
                    colInfo.sqlName = resp.name;
                    colInfo.isNullable = resp.notnull === 0;
                    colInfo.isPrimary = resp.pk > 0;
                    colInfo.default = resp.dflt_value ? resp.dflt_value : null;
                    colInfo.sqlType = resp.type
                        .replace(/\([0-9 ,]+\)/g, "")
                        .toLowerCase()
                        .trim();
                    colInfo.isGenerated =
                        colInfo.isPrimary &&
                            this.tablesWithGeneratedPrimaryKey.includes(ent.EntityName);
                    switch (colInfo.sqlType) {
                        case "int":
                            colInfo.tsType = "number";
                            break;
                        case "integer":
                            colInfo.tsType = "number";
                            break;
                        case "int2":
                            colInfo.tsType = "number";
                            break;
                        case "int8":
                            colInfo.tsType = "number";
                            break;
                        case "tinyint":
                            colInfo.tsType = "number";
                            break;
                        case "smallint":
                            colInfo.tsType = "number";
                            break;
                        case "mediumint":
                            colInfo.tsType = "number";
                            break;
                        case "bigint":
                            colInfo.tsType = "string";
                            break;
                        case "unsigned big int":
                            colInfo.tsType = "string";
                            break;
                        case "character":
                            colInfo.tsType = "string";
                            break;
                        case "varchar":
                            colInfo.tsType = "string";
                            break;
                        case "varying character":
                            colInfo.tsType = "string";
                            break;
                        case "nchar":
                            colInfo.tsType = "string";
                            break;
                        case "native character":
                            colInfo.tsType = "string";
                            break;
                        case "nvarchar":
                            colInfo.tsType = "string";
                            break;
                        case "text":
                            colInfo.tsType = "string";
                            break;
                        case "blob":
                            colInfo.tsType = "Buffer";
                            break;
                        case "clob":
                            colInfo.tsType = "string";
                            break;
                        case "real":
                            colInfo.tsType = "number";
                            break;
                        case "double":
                            colInfo.tsType = "number";
                            break;
                        case "double precision":
                            colInfo.tsType = "number";
                            break;
                        case "float":
                            colInfo.tsType = "number";
                            break;
                        case "numeric":
                            colInfo.tsType = "number";
                            break;
                        case "decimal":
                            colInfo.tsType = "number";
                            break;
                        case "boolean":
                            colInfo.tsType = "boolean";
                            break;
                        case "date":
                            colInfo.tsType = "string";
                            break;
                        case "datetime":
                            colInfo.tsType = "Date";
                            break;
                        default:
                            TomgUtils.LogError(`Unknown column type: ${colInfo.sqlType}  table name: ${ent.EntityName} column name: ${resp.name}`);
                            break;
                    }
                    const options = resp.type.match(/\([0-9 ,]+\)/g);
                    if (this.ColumnTypesWithPrecision.some(v => v === colInfo.sqlType) &&
                        options) {
                        colInfo.numericPrecision = options[0]
                            .substring(1, options[0].length - 1)
                            .split(",")[0];
                        colInfo.numericScale = options[0]
                            .substring(1, options[0].length - 1)
                            .split(",")[1];
                    }
                    if (this.ColumnTypesWithLength.some(v => v === colInfo.sqlType) &&
                        options) {
                        colInfo.lenght = options[0].substring(1, options[0].length - 1);
                    }
                    if (this.ColumnTypesWithWidth.some(v => v === colInfo.sqlType &&
                        colInfo.tsType !== "boolean") &&
                        options) {
                        colInfo.width = options[0].substring(1, options[0].length - 1);
                    }
                    if (colInfo.sqlType) {
                        ent.Columns.push(colInfo);
                    }
                });
            }
            return entities;
        });
    }
    GetIndexesFromEntity(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ent of entities) {
                const response = yield this.ExecQuery(`PRAGMA index_list('${ent.EntityName}');`);
                for (const resp of response) {
                    const indexColumnsResponse = yield this.ExecQuery(`PRAGMA index_info('${resp.name}');`);
                    indexColumnsResponse.forEach(element => {
                        let indexInfo = {};
                        const indexColumnInfo = {};
                        if (ent.Indexes.filter(filterVal => {
                            return filterVal.name === resp.name;
                        }).length > 0) {
                            indexInfo = ent.Indexes.find(filterVal => filterVal.name === resp.name);
                        }
                        else {
                            indexInfo.columns = [];
                            indexInfo.name = resp.name;
                            indexInfo.isUnique = resp.unique === 1;
                            ent.Indexes.push(indexInfo);
                        }
                        indexColumnInfo.name = element.name;
                        if (indexColumnsResponse.length === 1 &&
                            indexInfo.isUnique) {
                            ent.Columns.filter(v => v.tsName === indexColumnInfo.name).map(v => (v.isUnique = true));
                        }
                        indexInfo.columns.push(indexColumnInfo);
                    });
                }
            }
            return entities;
        });
    }
    GetRelations(entities, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const entity of entities) {
                const response = yield this.ExecQuery(`PRAGMA foreign_key_list('${entity.EntityName}');`);
                const relationsTemp = [];
                response.forEach(resp => {
                    const rels = {};
                    rels.ownerColumnsNames = [];
                    rels.referencedColumnsNames = [];
                    rels.actionOnDelete =
                        resp.on_delete === "NO ACTION" ? null : resp.on_delete;
                    rels.actionOnUpdate =
                        resp.on_update === "NO ACTION" ? null : resp.on_update;
                    rels.ownerTable = entity.EntityName;
                    rels.referencedTable = resp.table;
                    relationsTemp.push(rels);
                    rels.ownerColumnsNames.push(resp.from);
                    rels.referencedColumnsNames.push(resp.to);
                });
                entities = this.GetRelationsFromRelationTempInfo(relationsTemp, entities);
            }
            return entities;
        });
    }
    DisconnectFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.close();
        });
    }
    ConnectToServer(database, server, port, user, password, ssl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UseDB(database);
        });
    }
    CreateDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            // not supported
        });
    }
    UseDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = new Promise((resolve, reject) => {
                this.db = new this.sqlite.Database(dbName, err => {
                    if (err) {
                        TomgUtils.LogError("Error connecting to SQLite database.", false, err.message);
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            return promise;
        });
    }
    DropDB(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            // not supported
        });
    }
    CheckIfDBExists(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    ExecQuery(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret;
            const promise = new Promise((resolve, reject) => {
                this.db.serialize(() => {
                    this.db.all(sql, [], (err, row) => {
                        if (!err) {
                            ret = row;
                            resolve(true);
                        }
                        else {
                            TomgUtils.LogError("Error executing query on SQLite.", false, err.message);
                            reject(err);
                        }
                    });
                });
            });
            yield promise;
            return ret;
        });
    }
}
exports.SqliteDriver = SqliteDriver;
//# sourceMappingURL=SqliteDriver.js.map