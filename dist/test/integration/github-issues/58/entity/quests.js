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
let quests = class quests {
};
__decorate([
    typeorm_1.Column("int", {
        nullable: false,
        primary: true,
        name: "QuestId"
    }),
    __metadata("design:type", Number)
], quests.prototype, "QuestId", void 0);
__decorate([
    typeorm_1.OneToOne(type => feedextrainfo_1.feedextrainfo, feedextrainfo => feedextrainfo.questId),
    __metadata("design:type", feedextrainfo_1.feedextrainfo)
], quests.prototype, "feedextrainfo", void 0);
quests = __decorate([
    typeorm_1.Entity("quests")
], quests);
exports.quests = quests;
//# sourceMappingURL=quests.js.map