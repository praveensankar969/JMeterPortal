export interface CsvModel {
    timeStamp : number;
    elapsed : number;
    label : string;
    responseCode : number;
    threadName : string;
    dataType : string;
    success : string;
    failureMessage : string;
    bytes : number;
    sentBytes : number;
    grpThreads: number;
    allThreads: number;
    url : string;
    latency : number;
    sampleCount : number;
    errorCount : number;
    hostName: string;
    idleTime : number;
    connect : number;
}
