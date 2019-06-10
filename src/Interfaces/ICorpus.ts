export interface ICorpus {
    NLCDESC: string,
    NLC: string,
    TIPLOC: string,
    _3ALPHA: string,
    STANOX: string,
    NLCDESC16: string,
    UIC: string,
}

export interface IStanoxMap {
    [key: string]: ICorpus;
}