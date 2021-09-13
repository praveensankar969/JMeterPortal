import { ChartDatasets } from "./chart-datasets";

export interface ChartDataSetModel {
    labels : string[];
    xAxisLabel: any[];
    datasets : ChartDatasets[];
}
