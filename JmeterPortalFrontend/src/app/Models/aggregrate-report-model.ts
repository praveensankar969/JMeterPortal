export interface AggregrateReport{
    label: string,
    samples : number,
    average: number,
    median:number,
    min:number,
    max:number,
    error:number,
    percentile:Percentile
}

export interface Percentile{
    sixty:number,
    seventy:number,
    eighty:number,
    eightyFive:number,
    ninety:number,
    ninetySeven:number
}