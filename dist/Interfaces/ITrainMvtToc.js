"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
exports.getTrainMvtToc = (body) => {
    const result = {
        eventType: body.event_type,
        plannedEventType: body.planned_event_type,
        actualTime: moment_1.default(Number(body.actual_timestamp)),
        plannedTime: moment_1.default(parseInt(body.planned_timestamp, 10)),
        platform: body.platform,
        status: body.variation_status,
        tocId: body.toc_id,
        stanox: body.loc_stanox,
        nextStanox: body.next_report_stanox,
        terminated: Boolean(body.train_terminated),
    };
    return result;
};
exports.getMvtReport = (mvt, stanox) => {
    if (mvt) {
        const position = stanox[mvt.stanox];
        const startStation = position ? position.NLCDESC : '';
        const nextPosition = stanox[mvt.nextStanox];
        const nextStation = nextPosition ? nextPosition.NLCDESC : '';
        // tslint:disable-next-line: max-line-length
        const report = `Event ${mvt.eventType} Position ${startStation} Expected ${mvt.plannedTime.format(`h:mm:ss a`)} Actual ${mvt.actualTime.format(`h:mm:ss a`)} Next Position ${nextStation}`;
        return report;
    }
    return `mvt: null`;
};
//# sourceMappingURL=ITrainMvtToc.js.map