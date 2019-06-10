import fs from 'fs';

import {
    IReason,
    IReasonMap,
} from './Interfaces/IReason';

export const loadReasons = (reasonsFile: string): IReasonMap => {
    const dataAsStr: string = fs.readFileSync(reasonsFile, 'utf8');
    const dataObj = JSON.parse(dataAsStr);
    const reasons: IReason[] = dataObj.reasons;
    const reasonMap: IReasonMap = {};
    reasons.forEach ( (r) => {
        reasonMap[r.code] = {
            canc: r.canc,
            code: r.code,
            reasontext: r.reasontext,
        };
    });
    return reasonMap;
};
