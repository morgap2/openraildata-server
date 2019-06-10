import fs from 'fs';

import {
    IStanoxMap,
} from './Interfaces/ICorpus';

export const loadStanox = (corpusFile: string): IStanoxMap => {
    const dataAsStr: string = fs.readFileSync(corpusFile, 'utf8');
    const dataObj = JSON.parse(dataAsStr);
    const corpi: any[] = dataObj.TIPLOCDATA;
    const stanoxMap: IStanoxMap = {};
    const threeAlpha: string = '3ALPHA';
    corpi.forEach ( (c) => {
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