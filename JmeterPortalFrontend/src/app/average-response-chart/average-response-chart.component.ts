import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-average-response-chart',
  templateUrl: './average-response-chart.component.html',
  styleUrls: ['./average-response-chart.component.css']
})
export class AverageResponseChartComponent implements OnInit {

  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  datasets: ChartDatasets[] = [];
  chart: any;
  xAxisLabel: any[] = [];
  selectedValue = "";
  yAxisFilter = 0;
  constructor() { }

  ngOnInit(): void {
    this.SetupChartData(this.csvData);
  }

  SetupChartData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    for (let [key, value] of data) {
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let newV = value.sort((x, y) => { return x.timeStamp - y.timeStamp });
      let datapoint: any[] = []
      let d = newV.map(x => {
        return [x.timeStamp, x.elapsed]
      });
      let start = d[0][0];
      let end = d[d.length - 1][0];
      let totalExecTime = (end - start) / 60000;
      for (let index = 0; index < totalExecTime; index++) {
        let startTime = ((index * 60000) + start);
        let endTime = (((index + 1) * 60000) + start)
        let allAtTime = newV.filter(x => {
          return x.timeStamp >= startTime && x.timeStamp <= endTime
        })
        let elapsed = allAtTime.map(x => x.elapsed);
        if (elapsed.length > 1) {
          let avg = (elapsed.reduce((a, b) => a + b, 0)) / elapsed.length;
          datapoint.push([this.ParseDate(((index * 60000) + start)), avg]); 
          this.xAxisLabel.push(((index * 60000) + start));    
        }
        
      }

      let dataset: ChartDatasets = {
        label: key,
        data: datapoint,
        borderColor: color,
        pointBorderColor: color
      }
      
      this.datasets.push(dataset);
    }
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return this.ParseDate(x) });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    this.CreateChart();
  }

  ApplyYFilter(time: number) {
    let filterData: Map<string, CsvModel[]> = new Map(this.csvData);
    for (let [key, value] of filterData) {
      let newvalue;
      if (this.selectedValue == "Greater than") {
        newvalue = value.filter(x => x.elapsed > time);
      }
      else {
        newvalue = value.filter(x => x.elapsed < time);
      }
      if (newvalue.length == 0) {
        filterData.delete(key);
      }
      else {
        filterData.set(key, newvalue);
      }
    }
    

    this.chart.destroy();
    this.SetupChartData(filterData);
  }

  ClearFilter() {
    console.log(this.csvData)
    this.chart.destroy();
    this.SetupChartData(this.csvData);
  }

  CreateChart() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("average-response-over-time", {
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
            text: 'Average Response Time Over Time'
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
            title: {
              text: 'Time',
              display: true
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

  ParseDate(inputDate: number) {
    let date = new Date(inputDate);
    let day = date.getDate();
    let timeH = date.getHours();
    let timeM = date.getMinutes();
    let timeS = date.getSeconds();
    return `${day}, ${timeH}:${timeM}:${timeS}`;
  }

}
