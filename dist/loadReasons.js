"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.loadReasons = (reasonsFile) => {
    const dataAsStr = fs_1.default.readFileSync(reasonsFile, 'utf8');
    const dataObj = JSON.parse(dataAsStr);
    const reasons = dataObj.reasons;
    const reasonMap = {};
    reasons.forEach((r) => {
        reasonMap[r.code] = {
            canc: r.canc,
            code: r.code,
            reasontext: r.reasontext,
        };
    });
    return reasonMap;
};
//# sourceMappingURL=loadReasons.js.map