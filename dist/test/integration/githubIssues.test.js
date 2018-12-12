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
require('dotenv').config();
const chai_1 = require("chai");
const fs = require("fs-extra");
const path = require("path");
require("reflect-metadata");
const EntityFileToJson_1 = require("../utils/EntityFileToJson");
const chai = require('chai');
const chaiSubset = require('chai-subset');
const ts = require("typescript");
const GTU = require("../utils/GeneralTestUtils");
chai.use(chaiSubset);
describe("GitHub issues", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(30000);
        this.slow(5000); // compiling created models takes time
        const dbDrivers = [];
        if (process.env.SQLITE_Skip == '0') {
            dbDrivers.push('sqlite');
        }
        if (process.env.POSTGRES_Skip == '0') {
            dbDrivers.push('postgres');
        }
        if (process.env.MYSQL_Skip == '0') {
            dbDrivers.push('mysql');
        }
        if (process.env.MARIADB_Skip == '0') {
            dbDrivers.push('mariadb');
        }
        if (process.env.MSSQL_Skip == '0') {
            dbDrivers.push('mssql');
        }
        if (process.env.ORACLE_Skip == '0') {
            dbDrivers.push('oracle');
        }
        const examplesPathJS = path.resolve(process.cwd(), 'dist/test/integration/github-issues');
        const examplesPathTS = path.resolve(process.cwd(), 'test/integration/github-issues');
        const files = fs.readdirSync(examplesPathTS);
        for (const folder of files) {
            describe(`#${folder}`, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const dbDriver of dbDrivers) {
                        switch (folder) {
                            case '39':
                                if (dbDriver == 'mysql' || dbDriver == 'mariadb' || dbDriver == 'oracle' || dbDriver == 'sqlite') {
                                    continue;
                                }
                                break;
                            default:
                                break;
                        }
                        it(dbDriver, function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                const filesOrgPathJS = path.resolve(examplesPathJS, folder, 'entity');
                                const filesOrgPathTS = path.resolve(examplesPathTS, folder, 'entity');
                                const resultsPath = path.resolve(process.cwd(), `output`);
                                fs.removeSync(resultsPath);
                                let engine;
                                switch (dbDriver) {
                                    case 'sqlite':
                                        engine = yield GTU.createSQLiteModels(filesOrgPathJS, resultsPath);
                                        break;
                                    case 'postgres':
                                        engine = yield GTU.createPostgresModels(filesOrgPathJS, resultsPath);
                                        break;
                                    case 'mysql':
                                        engine = yield GTU.createMysqlModels(filesOrgPathJS, resultsPath);
                                        break;
                                    case 'mariadb':
                                        engine = yield GTU.createMariaDBModels(filesOrgPathJS, resultsPath);
                                        break;
                                    case 'mssql':
                                        engine = yield GTU.createMSSQLModels(filesOrgPathJS, resultsPath);
                                        break;
                                    case 'oracle':
                                        engine = yield GTU.createOracleDBModels(filesOrgPathJS, resultsPath);
                                        break;
                                    default:
                                        console.log(`Unknown engine type`);
                                        engine = {};
                                        break;
                                }
                                switch (folder) {
                                    case '65':
                                        engine.Options.relationIds = true;
                                        break;
                                    default:
                                        break;
                                }
                                yield engine.createModelFromDatabase();
                                const filesGenPath = path.resolve(resultsPath, 'entities');
                                const filesOrg = fs.readdirSync(filesOrgPathTS).filter((val) => val.toString().endsWith('.ts'));
                                const filesGen = fs.readdirSync(filesGenPath).filter((val) => val.toString().endsWith('.ts'));
                                chai_1.expect(filesOrg, 'Errors detected in model comparision').to.be.deep.equal(filesGen);
                                for (const file of filesOrg) {
                                    const entftj = new EntityFileToJson_1.EntityFileToJson();
                                    const jsonEntityOrg = entftj.convert(fs.readFileSync(path.resolve(filesOrgPathTS, file)));
                                    const jsonEntityGen = entftj.convert(fs.readFileSync(path.resolve(filesGenPath, file)));
                                    chai_1.expect(jsonEntityGen, `Error in file ${file}`).to.containSubset(jsonEntityOrg);
                                }
                                const currentDirectoryFiles = fs.readdirSync(filesGenPath).
                                    filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts").map(v => path.resolve(filesGenPath, v));
                                const compileErrors = GTU.compileTsFiles(currentDirectoryFiles, {
                                    experimentalDecorators: true,
                                    sourceMap: false,
                                    emitDecoratorMetadata: true,
                                    target: ts.ScriptTarget.ES2016,
                                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                                    module: ts.ModuleKind.CommonJS
                                });
                                chai_1.expect(compileErrors, 'Errors detected while compiling generated model').to.be.false;
                            });
                        });
                    }
                });
            });
        }
    });
});
//# sourceMappingURL=githubIssues.test.js.map