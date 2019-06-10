import log4js from 'log4js';
import moment from 'moment';
import path from 'path';

import Stomp from 'stomp-client';

// tslint:disable-next-line:no-import-side-effect
import 'moment/locale/en-gb';

import { loadReasons } from './loadReasons';
import { loadStanox } from './loadStanox';

import {
    IReasonMap,
} from './Interfaces/IReason';

import {
    IStanoxMap,
} from './Interfaces/ICorpus';

import {
    getMvtReport,
    getTrainMvtToc,
    ITrainMvtToc,
} from './Interfaces/ITrainMvtToc';

moment.locale('en-gb');

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'openraildata-server.log', maxLogSize: 10485760, backups: 3, compress: true },
    },
    categories: {
        default: { appenders: ['everything'], level: 'all' },
    },
});

const StompClient = Stomp.StompClient;

export const logger: log4js.Logger = log4js.getLogger();
logger.debug(`Starting OpenRailData Server`);

logger.debug(`Loading Stanox Mapping`);
const pathCorpusCodes: string = path.resolve(__dirname, 'Corpus/corpus.json');
const stanoxCodes: IStanoxMap = loadStanox(pathCorpusCodes);

logger.debug(`Loading Late Codes`);
const pathLateCodes: string = path.resolve(__dirname, 'Reasons/lateCodes.json');
const lateCodes: IReasonMap = loadReasons(pathLateCodes);

logger.debug(`Loading Cancellation Codes`);
const pathCancCodes: string = path.resolve(__dirname, 'Reasons/cancellationCodes.json');
const cancellationCodes: IReasonMap = loadReasons(pathCancCodes);

const processMvtMsg = (msg: any[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            msg.forEach((m: any) => {
                if (m.body) {
                    const mvt: ITrainMvtToc = getTrainMvtToc(m.body);
                    logger.debug(getMvtReport(mvt, stanoxCodes));
                    resolve();
                } else {
                    resolve();
                }

            });
        } catch (error) {
            logger.error(error);
            reject(error);
        }
    });
};

// const destination: string = '/topic/TRAIN_MVT_EF_TOC';
// const destination: string = '/topic/VSTP_ALL';
// const destination: string = '/topic/RTPPM_ALL';
const destination: string = '/topic/TRAIN_MVT_EF_TOC';	//	GWR Data

const client = new StompClient('datafeeds.networkrail.co.uk', 61618, 'LoginEmail', 'LoginPassword', '1.0');
const MAX_MESSAGES: number = 25;
logger.debug(`Trying to connect...`);

const connectCallBack = (sessionId: any): void => {
    logger.debug(`Connected with session ID: ${sessionId}`);
    let count: number = 0;
    logger.debug(`Subscribing to: ${destination}`);
    client.subscribe(destination, (body: any, headers: any) => {
        processMvtMsg(JSON.parse(body));
        count++;
        if (count === MAX_MESSAGES) {
            logger.debug(`Stopping subscriptions`);
            client.unsubscribe(destination);
            logger.debug(`Disconnecting`);
            client.disconnect();
        }
    });
};

const connectErrorCallBack = (error: any): void => {
    logger.error(error);
};

try {
    client.connect(connectCallBack, connectErrorCallBack);
} catch (error) {
    logger.error(error);
}
/*
http://www.railwaycodes.org.uk/crs/CRSh.shtm

// tslint:disable-next-line: max-line-length
A page just like this as the first thing I did when I started working on https://traksy.uk . It's quite a satisfying little app, and the Movement feed is definitely the easiest one to start working with. In the end once I'd progressed to the schedule and TD feed I couldn't see a use for the map that justified keeping it running, which was a pity.

If you want to cover more stations the NAPTAN stations file (https://data.gov.uk/dataset/naptan)
has eastings and northings for almost all of them.
It doesn't have STANOX codes, but does have TIPLOC codes.
You can map eastings/northings to lat/long using a few common libraries,
and you can map STANOX to TIPLOC using the CORPUS data from http://nrodwiki.rockshore.net/index.php/ReferenceData
- a STANOX can represent a number of TIPLOCs, but it's easy enough to fudge.

// tslint:disable-next-line: max-line-length
If you're going further there's another data source (can't find a link just now) which has eastings and northings data for a large number of locations including junctions as well as stations. I'd be wary about using it though since it is riddled with errors. I did waste a week at one point looking at maps to build a cleaned up version which I may be able to resurrect (I've taken the location information out of my database because I wasn't using it). You may also be able to get a better option by asking at https://groups.google.com/forum/#!forum/openraildata-talk
*/
