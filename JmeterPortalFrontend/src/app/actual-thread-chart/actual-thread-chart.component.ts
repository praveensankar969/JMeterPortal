import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-actual-thread-chart',
  templateUrl: './actual-thread-chart.component.html',
  styleUrls: ['./actual-thread-chart.component.css']
})
export class ActualThreadChartComponent implements OnInit {

  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  datasets: ChartDatasets[] = [];
  chart: any;
  xAxisLabel: number[] = [];
  yAxisFilter: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.SetupChartData(this.csvData);
  }

  SetupChartData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];


    for (let [key, value] of data) {

      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let newV = value.sort((x, y) => { return x.allThreads - y.allThreads });
      let dataset: ChartDatasets = {
        label: key,
        data: [],
        borderColor: color,
        pointBorderColor: color
      }

      for (let i = 0; i < newV.length; i++) {
        let thread = newV[i].allThreads;
        let elapsed = newV[i].elapsed;
        dataset.data.push([thread, elapsed]);
      }

      this.datasets.push(dataset);
      this.xAxisLabel.push(...value.map(x => { return x.allThreads }));


    }
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return x });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
    this.CreateChart();
  }

  CreateChart() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("actual-response-over-thread", {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets
      },
      options: {
        animation: false,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Actual Response Time Over Thread Count'
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            },
            pan: {
              enabled: true,
              mode: 'x',
              threshold: 10
            }
          }

        },
        scales: {
          x: {
            type: 'linear',
            title: {
              text: 'Thread Count',
              display: true
            }
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: 'Actual Response Time (ms)',
              display: true
            },
            ticks: {
              stepSize: 400
            }
          },
          y: {
            display: false
          }
        }
      }
    });
  }

  ResetZoom() {
    this.chart.resetZoom();
  }

  ApplyYFilter(time: number) {
    let filterData: Map<string, CsvModel[]> = new Map(this.csvData);
    for (let [key, value] of filterData) {
      let newvalue = value.filter(x => x.elapsed < time);
      if (newvalue.length == 0) {
        filterData.delete(key);
      }
      else {
        filterData.set(key, newvalue);
      }
    }
    console.log(filterData);

    this.chart.destroy();
    this.SetupChartData(filterData);
  }

  ClearFilter() {
    console.log(this.csvData)
    this.chart.destroy();
    this.SetupChartData(this.csvData);
  }

}
