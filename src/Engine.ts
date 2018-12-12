import changeCase = require("change-case");
import fs = require("fs");
import * as Handlebars from "handlebars";
import path = require("path");
import { AbstractNamingStrategy } from "./AbstractNamingStrategy";
import { AbstractDriver } from "./drivers/AbstractDriver";
import { DatabaseModel } from "./models/DatabaseModel";
import * as TomgUtils from "./Utils";

export class Engine {
    constructor(
        private driver: AbstractDriver,
        public Options: IEngineOptions
    ) {}

    public async createModelFromDatabase(): Promise<boolean> {
        const dbModel = await this.getEntitiesInfo(
            this.Options.databaseName,
            this.Options.host,
            this.Options.port,
            this.Options.user,
            this.Options.password,
            this.Options.schemaName,
            this.Options.ssl,
            this.Options.namingStrategy,
            this.Options.relationIds
        );
        if (dbModel.entities.length > 0) {
            this.createModelFromMetadata(dbModel);
        } else {
            TomgUtils.LogError(
                "Tables not found in selected database. Skipping creation of typeorm model.",
                false
            );
        }
        return true;
    }
    private async getEntitiesInfo(
        database: string,
        server: string,
        port: number,
        user: string,
        password: string,
        schemaName: string,
        ssl: boolean,
        namingStrategy: AbstractNamingStrategy,
        relationIds: boolean
    ): Promise<DatabaseModel> {
        return await this.driver.GetDataFromServer(
            database,
            server,
            port,
            user,
            password,
            schemaName,
            ssl,
            namingStrategy,
            relationIds
        );
    }
    private createModelFromMetadata(databaseModel: DatabaseModel) {
        this.createHandlebarsHelpers();
        const templatePath = path.resolve(__dirname, "../../src/entity.mst");
        const template = fs.readFileSync(templatePath, "UTF-8");
        const resultPath = this.Options.resultsPath;
        if (!fs.existsSync(resultPath)) {
            fs.mkdirSync(resultPath);
        }
        let entitesPath = resultPath;
        if (!this.Options.noConfigs) {
            this.createTsConfigFile(resultPath);
            this.createTypeOrmConfig(resultPath);
            entitesPath = path.resolve(resultPath, "./entities");
            if (!fs.existsSync(entitesPath)) {
                fs.mkdirSync(entitesPath);
            }
        }
        const compliedTemplate = Handlebars.compile(template, {
            noEscape: true
        });
        databaseModel.entities.forEach(element => {
            element.Imports = [];
            element.Columns.forEach(column => {
                column.relations.forEach(relation => {
                    if (element.EntityName !== relation.relatedTable) {
                        element.Imports.push(relation.relatedTable);
                    }
                });
            });
            element.GenerateConstructor = this.Options.constructor;
            element.Imports.filter((elem, index, self) => {
                return index === self.indexOf(elem);
            });
            let casedFileName = "";
            switch (this.Options.convertCaseFile) {
                case "camel":
                    casedFileName = changeCase.camelCase(element.EntityName);
                    break;
                case "param":
                    casedFileName = changeCase.paramCase(element.EntityName);
                    break;
                case "pascal":
                    casedFileName = changeCase.pascalCase(element.EntityName);
                    break;
                case "none":
                    casedFileName = element.EntityName;
                    break;
            }
            const resultFilePath = path.resolve(
                entitesPath,
                casedFileName + ".ts"
            );
            const rendered = compliedTemplate(element);
            fs.writeFileSync(resultFilePath, rendered, {
                encoding: "UTF-8",
                flag: "w"
            });
        });
    }
    private createHandlebarsHelpers() {
        Handlebars.registerHelper("curly", open => (open ? "{" : "}"));
        Handlebars.registerHelper("toEntityName", str => {
            let retStr = "";
            switch (this.Options.convertCaseEntity) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper("concat", (stra, strb) => {
            return stra + strb;
        });
        Handlebars.registerHelper("toFileName", str => {
            let retStr = "";
            switch (this.Options.convertCaseFile) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "param":
                    retStr = changeCase.paramCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper(
            "printPropertyVisibility",
            () =>
                this.Options.propertyVisibility !== "none"
                    ? this.Options.propertyVisibility + " "
                    : ""
        );
        Handlebars.registerHelper("toPropertyName", str => {
            let retStr = "";
            switch (this.Options.convertCaseProperty) {
                case "camel":
                    retStr = changeCase.camelCase(str);
                    break;
                case "pascal":
                    retStr = changeCase.pascalCase(str);
                    break;
                case "none":
                    retStr = str;
                    break;
            }
            return retStr;
        });
        Handlebars.registerHelper("toLowerCase", str => str.toLowerCase());
        Handlebars.registerHelper("toLazy", str => {
            if (this.Options.lazy) {
                return `Promise<${str}>`;
            } else {
                return str;
            }
        });

        Handlebars.registerHelper("ifeq", function(a, b, options) {
            if (a == b) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper({
            and: (v1, v2) => v1 && v2,
            eq: (v1, v2) => v1 === v2,
            gt: (v1, v2) => v1 > v2,
            gte: (v1, v2) => v1 >= v2,
            lt: (v1, v2) => v1 < v2,
            lte: (v1, v2) => v1 <= v2,
            ne: (v1, v2) => v1 !== v2,
            or: (v1, v2) => v1 || v2
        });
    }

    // TODO:Move to mustache template file
    private createTsConfigFile(resultPath) {
        fs.writeFileSync(
            path.resolve(resultPath, "tsconfig.json"),
            `{"compilerOptions": {
        "lib": ["es5", "es6"],
        "target": "es6",
        "module": "commonjs",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "sourceMap": true
    }}`,
            { encoding: "UTF-8", flag: "w" }
        );
    }
    private createTypeOrmConfig(resultPath) {
        if (this.Options.schemaName === "") {
            fs.writeFileSync(
                path.resolve(resultPath, "ormconfig.json"),
                `[
  {
    "name": "default",
    "type": "${this.Options.databaseType}",
    "host": "${this.Options.host}",
    "port": ${this.Options.port},
    "username": "${this.Options.user}",
    "password": "${this.Options.password}",
    "database": "${this.Options.databaseName}",
    "synchronize": false,
    "entities": [
      "entities/*.js"
    ]
  }
]`,
                { encoding: "UTF-8", flag: "w" }
            );
        } else {
            fs.writeFileSync(
                path.resolve(resultPath, "ormconfig.json"),
                `[
  {
    "name": "default",
    "type": "${this.Options.databaseType}",
    "host": "${this.Options.host}",
    "port": ${this.Options.port},
    "username": "${this.Options.user}",
    "password": "${this.Options.password}",
    "database": "${this.Options.databaseName}",
    "schema": "${this.Options.schemaName}",
    "synchronize": false,
    "entities": [
      "entities/*.js"
    ]
  }
]`,
                { encoding: "UTF-8", flag: "w" }
            );
        }
    }
}
export interface IEngineOptions {
    host: string;
    port: number;
    databaseName: string;
    user: string;
    password: string;
    resultsPath: string;
    databaseType: string;
    schemaName: string;
    ssl: boolean;
    noConfigs: boolean;
    convertCaseFile: "pascal" | "param" | "camel" | "none";
    convertCaseEntity: "pascal" | "camel" | "none";
    convertCaseProperty: "pascal" | "camel" | "none";
    propertyVisibility: "public" | "protected" | "private" | "none";
    lazy: boolean;
    constructor: boolean;
    namingStrategy: AbstractNamingStrategy;
    relationIds: boolean;
}
