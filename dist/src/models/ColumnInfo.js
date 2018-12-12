"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColumnInfo {
    constructor() {
        this.tsName = "";
        this.sqlName = "";
        this.default = null;
        this.isNullable = false;
        this.isUnique = false;
        this.lenght = null;
        this.width = null;
        this.isPrimary = false;
        this.isGenerated = false;
        this.isArray = false;
        this.numericPrecision = null;
        this.numericScale = null;
        this.enumOptions = null;
        this.relations = [];
    }
}
exports.ColumnInfo = ColumnInfo;
//# sourceMappingURL=ColumnInfo.js.map