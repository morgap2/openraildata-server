import moment from 'moment';

import {
    ICorpus,
    IStanoxMap,
} from './ICorpus';

export interface ITrainMvtToc {
    eventType: string;
    plannedEventType: string;
    actualTime: moment.Moment;
    plannedTime: moment.Moment;
    platform: string;
    status: string; //  variation_status
    tocId: string;
    stanox: string;
    nextStanox: string;
    terminated: boolean;
}

export const getTrainMvtToc = (body: any): ITrainMvtToc => {
    const result: ITrainMvtToc = {
        eventType: body.event_type,
        plannedEventType: body.planned_event_type,
        actualTime: moment(Number(body.actual_timestamp)),
        plannedTime: moment(parseInt(body.planned_timestamp, 10)),
        platform: body.platform,
        status: body.variation_status,
        tocId: body.toc_id,
        stanox: body.loc_stanox,
        nextStanox: body.next_report_stanox,
        terminated: Boolean(body.train_terminated),
    };

    return result;
};

export const getMvtReport = (mvt: ITrainMvtToc, stanox: IStanoxMap): string => {
    if (mvt) {
        const position: ICorpus = stanox[mvt.stanox];
        const startStation: string = position ? position.NLCDESC : '';
        const nextPosition: ICorpus = stanox[mvt.nextStanox];
        const nextStation: string = nextPosition ? nextPosition.NLCDESC : '';
        // tslint:disable-next-line: max-line-length
        const report: string = `Event ${mvt.eventType} Position ${startStation} Expected ${mvt.plannedTime.format(`h:mm:ss a`)} Actual ${mvt.actualTime.format(`h:mm:ss a`)} Next Position ${nextStation}`;
        return report;
    }
    return `mvt: null`;
};
