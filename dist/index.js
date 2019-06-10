"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const stomp_client_1 = __importDefault(require("stomp-client"));
// tslint:disable-next-line:no-import-side-effect
require("moment/locale/en-gb");
const loadReasons_1 = require("./loadReasons");
const loadStanox_1 = require("./loadStanox");
const ITrainMvtToc_1 = require("./Interfaces/ITrainMvtToc");
moment_1.default.locale('en-gb');
log4js_1.default.configure({
    appenders: {
        everything: { type: 'file', filename: 'one-rail-server.log', maxLogSize: 10485760, backups: 3, compress: true },
    },
    categories: {
        default: { appenders: ['everything'], level: 'all' },
    },
});
const StompClient = stomp_client_1.default.StompClient;
exports.logger = log4js_1.default.getLogger();
exports.logger.debug(`Starting One-Rail Server`);
exports.logger.debug(`Loading Stanox Mapping`);
const pathCorpusCodes = path_1.default.resolve(__dirname, 'Corpus/corpus.json');
const stanoxCodes = loadStanox_1.loadStanox(pathCorpusCodes);
// logger.debug(`${JSON.stringify(stanoxCodes)}`);
exports.logger.debug(`Loading Late Codes`);
const pathLateCodes = path_1.default.resolve(__dirname, 'Reasons/lateCodes.json');
const lateCodes = loadReasons_1.loadReasons(pathLateCodes);
// logger.debug(`${JSON.stringify(lateCodes)}`);
exports.logger.debug(`Loading Cancellation Codes`);
const pathCancCodes = path_1.default.resolve(__dirname, 'Reasons/cancellationCodes.json');
const cancellationCodes = loadReasons_1.loadReasons(pathCancCodes);
// logger.debug(`${JSON.stringify(cancellationCodes)}`);
const processMvtMsg = (msg) => {
    return new Promise((resolve, reject) => {
        try {
            msg.forEach((m) => {
                if (m.body) {
                    const mvt = ITrainMvtToc_1.getTrainMvtToc(m.body);
                    exports.logger.debug(ITrainMvtToc_1.getMvtReport(mvt, stanoxCodes));
                    resolve();
                }
                else {
                    resolve();
                }
            });
        }
        catch (error) {
            exports.logger.error(error);
            reject(error);
        }
    });
};
// const destination: string = '/topic/TRAIN_MVT_EF_TOC';
// const destination: string = '/topic/VSTP_ALL';
// const destination: string = '/topic/RTPPM_ALL';
//  VSTP_ALL - Schedule All, VSTP_EF - First Great Western
const destination = '/topic/TRAIN_MVT_EF_TOC';
const client = new StompClient('datafeeds.networkrail.co.uk', 61618, 'p.lfc.morgan@gmail.com', 'NorD34_33', '1.0');
const MAX_MESSAGES = 25;
exports.logger.debug(`Trying to connect...`);
const connectCallBack = (sessionId) => {
    exports.logger.debug(`Connected with session ID: ${sessionId}`);
    let count = 0;
    exports.logger.debug(`Subscribing to: ${destination}`);
    client.subscribe(destination, (body, headers) => {
        processMvtMsg(JSON.parse(body));
        // logger.debug(JSON.stringify(JSON.parse(body)));
        count++;
        if (count === MAX_MESSAGES) {
            exports.logger.debug(`Stopping subscriptions`);
            client.unsubscribe(destination);
            exports.logger.debug(`Disconnecting`);
            client.disconnect();
        }
    });
};
const connectErrorCallBack = (error) => {
    exports.logger.error(error);
};
try {
    client.connect(connectCallBack, connectErrorCallBack);
}
catch (error) {
    exports.logger.error(error);
}
// try {
//     client.connect((sessionId: any) => {
//         logger.debug(`Connected with session ID: ${sessionId}`);
//         let count: number = 0;
//         logger.debug(`Subscribing to: ${destination}`);
//         client.subscribe(destination, (body: any, headers: any) => {
//             processMvtMsg(JSON.parse(body));
//             logger.debug(JSON.stringify(JSON.parse(body)));
//             count++;
//             if (count === MAX_MESSAGES) {
//                 logger.debug(`Stopping subscriptions`);
//                 client.unsubscribe(destination);
//                 logger.debug(`Disconnecting`);
//                 client.disconnect();
//             }
//         });
//     });
// } catch (error) {
//     logger.error(error);
// }
// logger.debug(`Ending One-Rail Server`);
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
//# sourceMappingURL=index.js.map