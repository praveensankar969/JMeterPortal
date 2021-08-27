import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';

@Component({
  selector: 'app-average-thread-chart',
  templateUrl: './average-thread-chart.component.html',
  styleUrls: ['./average-thread-chart.component.css']
})
export class AverageThreadChartComponent implements OnInit {

  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  datasets: ChartDatasets[] = [];
  chart: any;
  xAxisLabel: number[] = [];
  yAxisFilter: number = 0;
  totalThreads = 0;
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
      this.xAxisLabel.push(...newV.map(x=> x.allThreads));
      let avgPoints: any[] = [];
      this.totalThreads = newV[newV.length - 1].allThreads;

      for (let index = 1; index <= this.totalThreads; index++) {
        let allThreads = newV.filter(x => x.allThreads == index);
        let allElapsed = allThreads.map(x => x.elapsed);
        if(allElapsed.length>1){
          let avg = (allElapsed.reduce((a, b) => a + b, 0))/allElapsed.length;
          avgPoints.push([index, avg]);
        }   
      }

      let dataset: ChartDatasets = {
        label: key,
        data: avgPoints,
        borderColor: color,
        pointBorderColor: color
      }
      this.datasets.push(dataset);
      
    }
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.xAxisLabel);
    console.log(this.datasets);
    this.CreateChart();
  }

  CreateChart() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("average-response-over-thread", {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Average Response Time Over Thread Count'
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
            },
            ticks :{
              maxTicksLimit : this.totalThreads ,
              stepSize : 5
            }
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: 'Average Response Time (ms)',
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
