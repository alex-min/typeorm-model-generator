"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const feedextrainfo_1 = require("./feedextrainfo");
let users = class users {
};
__decorate([
    typeorm_1.Column("int", {
        nullable: false,
        primary: true,
        name: "UserId"
    }),
    __metadata("design:type", Number)
], users.prototype, "UserId", void 0);
__decorate([
    typeorm_1.OneToOne(type => feedextrainfo_1.feedextrainfo, feedextrainfo => feedextrainfo.feedOwnerId),
    __metadata("design:type", feedextrainfo_1.feedextrainfo)
], users.prototype, "feedextrainfo", void 0);
__decorate([
    typeorm_1.OneToOne(type => feedextrainfo_1.feedextrainfo, feedextrainfo2 => feedextrainfo2.readerId),
    __metadata("design:type", feedextrainfo_1.feedextrainfo)
], users.prototype, "feedextrainfo2", void 0);
users = __decorate([
    typeorm_1.Entity("users")
], users);
exports.users = users;
//# sourceMappingURL=users.js.map