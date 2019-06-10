export interface IReason {
    code: number;
    reasontext: string;
    canc: boolean;
}

export interface IReasonMap {
    [key: number]: IReason;
}
