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
const path = require("path");
const typeorm_1 = require("typeorm");
const ts = require("typescript");
const yn = require("yn");
const MariaDbDriver_1 = require("../../src/drivers/MariaDbDriver");
const MssqlDriver_1 = require("../../src/drivers/MssqlDriver");
const MysqlDriver_1 = require("../../src/drivers/MysqlDriver");
const OracleDriver_1 = require("../../src/drivers/OracleDriver");
const PostgresDriver_1 = require("../../src/drivers/PostgresDriver");
const SqliteDriver_1 = require("../../src/drivers/SqliteDriver");
const Engine_1 = require("../../src/Engine");
const NamingStrategy_1 = require("../../src/NamingStrategy");
function createMSSQLModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MssqlDriver_1.MssqlDriver();
        yield driver.ConnectToServer(`master`, String(process.env.MSSQL_Host), Number(process.env.MSSQL_Port), String(process.env.MSSQL_Username), String(process.env.MSSQL_Password), yn(process.env.MSSQL_SSL));
        if (yield driver.CheckIfDBExists(String(process.env.MSSQL_Database))) {
            yield driver.DropDB(String(process.env.MSSQL_Database));
        }
        yield driver.CreateDB(String(process.env.MSSQL_Database));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.MSSQL_Database),
            host: String(process.env.MSSQL_Host),
            password: String(process.env.MSSQL_Password),
            type: 'mssql',
            username: String(process.env.MSSQL_Username),
            port: Number(process.env.MSSQL_Port),
            dropSchema: true,
            synchronize: false,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        const schemas = 'dbo,sch1,sch2';
        let conn = yield typeorm_1.createConnection(connOpt);
        let queryRunner = conn.createQueryRunner();
        for (const sch of schemas.split(',')) {
            yield queryRunner.createSchema(sch, true);
        }
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new MssqlDriver_1.MssqlDriver();
        const engine = new Engine_1.Engine(driver, {
            host: String(process.env.MSSQL_Host),
            port: Number(process.env.MSSQL_Port),
            databaseName: String(process.env.MSSQL_Database),
            user: String(process.env.MSSQL_Username),
            password: String(process.env.MSSQL_Password),
            databaseType: 'mssql',
            resultsPath,
            schemaName: 'dbo,sch1,sch2',
            ssl: yn(process.env.MSSQL_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        conn = yield typeorm_1.createConnection(connOpt);
        queryRunner = conn.createQueryRunner();
        for (const sch of schemas.split(',')) {
            yield queryRunner.createSchema(sch, true);
        }
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        return engine;
    });
}
exports.createMSSQLModels = createMSSQLModels;
function createPostgresModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new PostgresDriver_1.PostgresDriver();
        yield driver.ConnectToServer(`postgres`, String(process.env.POSTGRES_Host), Number(process.env.POSTGRES_Port), String(process.env.POSTGRES_Username), String(process.env.POSTGRES_Password), yn(process.env.POSTGRES_SSL));
        if (yield driver.CheckIfDBExists(String(process.env.POSTGRES_Database))) {
            yield driver.DropDB(String(process.env.POSTGRES_Database));
        }
        yield driver.CreateDB(String(process.env.POSTGRES_Database));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.POSTGRES_Database),
            host: String(process.env.POSTGRES_Host),
            password: String(process.env.POSTGRES_Password),
            type: 'postgres',
            username: String(process.env.POSTGRES_Username),
            port: Number(process.env.POSTGRES_Port),
            dropSchema: true,
            synchronize: false,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        const schemas = 'public,sch1,sch2';
        let conn = yield typeorm_1.createConnection(connOpt);
        let queryRunner = conn.createQueryRunner();
        for (const sch of schemas.split(',')) {
            yield queryRunner.createSchema(sch, true);
        }
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new PostgresDriver_1.PostgresDriver();
        const engine = new Engine_1.Engine(driver, {
            host: String(process.env.POSTGRES_Host),
            port: Number(process.env.POSTGRES_Port),
            databaseName: String(process.env.POSTGRES_Database),
            user: String(process.env.POSTGRES_Username),
            password: String(process.env.POSTGRES_Password),
            databaseType: 'postgres',
            resultsPath,
            schemaName: 'public,sch1,sch2',
            ssl: yn(process.env.POSTGRES_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        conn = yield typeorm_1.createConnection(connOpt);
        queryRunner = conn.createQueryRunner();
        for (const sch of schemas.split(',')) {
            yield queryRunner.createSchema(sch, true);
        }
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        return engine;
    });
}
exports.createPostgresModels = createPostgresModels;
function createSQLiteModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new SqliteDriver_1.SqliteDriver();
        yield driver.ConnectToServer(String(process.env.SQLITE_Database), '', 0, '', '', false);
        if (yield driver.CheckIfDBExists(String(process.env.SQLITE_Database))) {
            yield driver.DropDB(String(process.env.SQLITE_Database));
        }
        yield driver.CreateDB(String(process.env.SQLITE_Database));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.SQLITE_Database),
            type: 'sqlite',
            dropSchema: true,
            synchronize: false,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        let conn = yield typeorm_1.createConnection(connOpt);
        let queryRunner = conn.createQueryRunner();
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new SqliteDriver_1.SqliteDriver();
        const engine = new Engine_1.Engine(driver, {
            host: '',
            port: 0,
            databaseName: String(process.env.SQLITE_Database),
            user: '',
            password: '',
            databaseType: 'sqlite',
            resultsPath,
            schemaName: '',
            ssl: false,
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        conn = yield typeorm_1.createConnection(connOpt);
        queryRunner = conn.createQueryRunner();
        yield conn.synchronize();
        if (conn.isConnected) {
            yield conn.close();
        }
        return engine;
    });
}
exports.createSQLiteModels = createSQLiteModels;
function createMysqlModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MysqlDriver_1.MysqlDriver();
        yield driver.ConnectToServer(`mysql`, String(process.env.MYSQL_Host), Number(process.env.MYSQL_Port), String(process.env.MYSQL_Username), String(process.env.MYSQL_Password), yn(process.env.MYSQL_SSL));
        if (yield driver.CheckIfDBExists(String(process.env.MYSQL_Database))) {
            yield driver.DropDB(String(process.env.MYSQL_Database));
        }
        yield driver.CreateDB(String(process.env.MYSQL_Database));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.MYSQL_Database),
            host: String(process.env.MYSQL_Host),
            password: String(process.env.MYSQL_Password),
            type: 'mysql',
            username: String(process.env.MYSQL_Username),
            port: Number(process.env.MYSQL_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        const conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new MysqlDriver_1.MysqlDriver();
        const engine = new Engine_1.Engine(driver, {
            host: String(process.env.MYSQL_Host),
            port: Number(process.env.MYSQL_Port),
            databaseName: String(process.env.MYSQL_Database),
            user: String(process.env.MYSQL_Username),
            password: String(process.env.MYSQL_Password),
            databaseType: 'mysql',
            resultsPath,
            schemaName: 'ignored',
            ssl: yn(process.env.MYSQL_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        return engine;
    });
}
exports.createMysqlModels = createMysqlModels;
function createMariaDBModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new MariaDbDriver_1.MariaDbDriver();
        yield driver.ConnectToServer(`mysql`, String(process.env.MARIADB_Host), Number(process.env.MARIADB_Port), String(process.env.MARIADB_Username), String(process.env.MARIADB_Password), yn(process.env.MARIADB_SSL));
        if (yield driver.CheckIfDBExists(String(process.env.MARIADB_Database))) {
            yield driver.DropDB(String(process.env.MARIADB_Database));
        }
        yield driver.CreateDB(String(process.env.MARIADB_Database));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.MARIADB_Database),
            host: String(process.env.MARIADB_Host),
            password: String(process.env.MARIADB_Password),
            type: 'mariadb',
            username: String(process.env.MARIADB_Username),
            port: Number(process.env.MARIADB_Port),
            dropSchema: true,
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        const conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new MariaDbDriver_1.MariaDbDriver();
        const engine = new Engine_1.Engine(driver, {
            host: String(process.env.MARIADB_Host),
            port: Number(process.env.MARIADB_Port),
            databaseName: String(process.env.MARIADB_Database),
            user: String(process.env.MARIADB_Username),
            password: String(process.env.MARIADB_Password),
            databaseType: 'mariadb',
            resultsPath,
            schemaName: 'ignored',
            ssl: yn(process.env.MARIADB_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        return engine;
    });
}
exports.createMariaDBModels = createMariaDBModels;
function createOracleDBModels(filesOrgPath, resultsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let driver;
        driver = new OracleDriver_1.OracleDriver();
        yield driver.ConnectToServer(String(process.env.ORACLE_Database), String(process.env.ORACLE_Host), Number(process.env.ORACLE_Port), String(process.env.ORACLE_UsernameSys), String(process.env.ORACLE_PasswordSys), yn(process.env.ORACLE_SSL));
        if (yield driver.CheckIfDBExists(String(process.env.ORACLE_Username))) {
            yield driver.DropDB(String(process.env.ORACLE_Username));
        }
        yield driver.CreateDB(String(process.env.ORACLE_Username));
        yield driver.DisconnectFromServer();
        const connOpt = {
            database: String(process.env.ORACLE_Database),
            sid: String(process.env.ORACLE_Database),
            host: String(process.env.ORACLE_Host),
            password: String(process.env.ORACLE_Password),
            type: 'oracle',
            username: String(process.env.ORACLE_Username),
            port: Number(process.env.ORACLE_Port),
            synchronize: true,
            entities: [path.resolve(filesOrgPath, '*.js')],
        };
        const conn = yield typeorm_1.createConnection(connOpt);
        if (conn.isConnected) {
            yield conn.close();
        }
        const namingStrategy = new NamingStrategy_1.NamingStrategy();
        driver = new OracleDriver_1.OracleDriver();
        const engine = new Engine_1.Engine(driver, {
            host: String(process.env.ORACLE_Host),
            port: Number(process.env.ORACLE_Port),
            databaseName: String(process.env.ORACLE_Database),
            user: String(process.env.ORACLE_Username),
            password: String(process.env.ORACLE_Password),
            databaseType: 'oracle',
            resultsPath,
            schemaName: String(process.env.ORACLE_Username),
            ssl: yn(process.env.ORACLE_SSL),
            noConfigs: false,
            convertCaseEntity: 'none',
            convertCaseFile: 'none',
            convertCaseProperty: 'none',
            propertyVisibility: 'none',
            lazy: false,
            constructor: false,
            namingStrategy,
            relationIds: false
        });
        return engine;
    });
}
exports.createOracleDBModels = createOracleDBModels;
function compileTsFiles(fileNames, options) {
    const program = ts.createProgram(fileNames, options);
    const emitResult = program.emit();
    let compileErrors = false;
    const preDiagnostics = ts.getPreEmitDiagnostics(program);
    const allDiagnostics = [...preDiagnostics, ...emitResult.diagnostics];
    allDiagnostics.forEach(diagnostic => {
        const lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${lineAndCharacter.line + 1},${lineAndCharacter.character + 1}): ${message}`);
        compileErrors = true;
    });
    return compileErrors;
}
exports.compileTsFiles = compileTsFiles;
//# sourceMappingURL=GeneralTestUtils.js.map