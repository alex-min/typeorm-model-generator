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
const users_1 = require("./users");
const quests_1 = require("./quests");
let feedextrainfo = class feedextrainfo {
};
__decorate([
    typeorm_1.OneToOne(type => users_1.users, FeedOwnerId => FeedOwnerId.feedextrainfo, { primary: true, nullable: false, }),
    typeorm_1.JoinColumn({ name: 'FeedOwnerId' }),
    __metadata("design:type", users_1.users)
], feedextrainfo.prototype, "feedOwnerId", void 0);
__decorate([
    typeorm_1.OneToOne(type => quests_1.quests, QuestId => QuestId.feedextrainfo, { primary: true, nullable: false, }),
    typeorm_1.JoinColumn({ name: 'QuestId' }),
    __metadata("design:type", quests_1.quests)
], feedextrainfo.prototype, "questId", void 0);
__decorate([
    typeorm_1.OneToOne(type => users_1.users, ReaderId => ReaderId.feedextrainfo2, { primary: true, nullable: false, }),
    typeorm_1.JoinColumn({ name: 'ReaderId' }),
    __metadata("design:type", users_1.users)
], feedextrainfo.prototype, "readerId", void 0);
__decorate([
    typeorm_1.Column("int", {
        nullable: false,
        name: "MostUpdatedFeedEntryIdUserRead"
    }),
    __metadata("design:type", Number)
], feedextrainfo.prototype, "MostUpdatedFeedEntryIdUserRead", void 0);
feedextrainfo = __decorate([
    typeorm_1.Entity("feedextrainfo"),
    typeorm_1.Index("feedExtraInfo_FeedOwnerId_idx", ["feedOwnerId",]),
    typeorm_1.Index("feedExtraInfo_ReaderId_idx", ["readerId",]),
    typeorm_1.Index("feedExtraInfo_QuestId_idx", ["questId",])
], feedextrainfo);
exports.feedextrainfo = feedextrainfo;
//# sourceMappingURL=feedextrainfo.js.map