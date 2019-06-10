"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.loadStanox = (corpusFile) => {
    const dataAsStr = fs_1.default.readFileSync(corpusFile, 'utf8');
    const dataObj = JSON.parse(dataAsStr);
    const corpi = dataObj.TIPLOCDATA;
    const stanoxMap = {};
    const threeAlpha = '3ALPHA';
    corpi.forEach((c) => {
        if (c.STANOX !== ' ') {
            stanoxMap[c.STANOX] = {
                NLCDESC: c.NLCDESC,
                NLC: c.NLC,
                TIPLOC: c.TIPLOC,
                _3ALPHA: c[threeAlpha],
                STANOX: c.STANOX,
                NLCDESC16: c.NLCDESC16,
                UIC: c.UIC,
            };
        }
    });
    return stanoxMap;
};
//# sourceMappingURL=loadStanox.js.map