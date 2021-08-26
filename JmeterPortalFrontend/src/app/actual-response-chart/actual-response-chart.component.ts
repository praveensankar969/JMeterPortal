import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-actual-response-chart',
  templateUrl: './actual-response-chart.component.html',
  styleUrls: ['./actual-response-chart.component.css']
})
export class ActualResponseChartComponent implements OnInit {

  @Input() csvData : Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  xAxisLabel: any[] = [];
  datasets: ChartDatasets[] = [];
  chart: any;
  yAxisFilter!: number;
  constructor() { }

  ngOnInit(): void {
    this.SetupChartData(this.csvData);
  }

  SetupChartData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    
    
    for (let [key, value] of data) {
      const r = Math.round(Math.random() * 255);
      const g = Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let d = value.sort((x,y)=> {return x.timeStamp-y.timeStamp}).map(x=> {
        return [this.ParseDate(x.timeStamp),x.elapsed]
      });
      let dataset: ChartDatasets = {
        label: key,
        data: d,
        borderColor: color,
        pointBorderColor : color
      }
      this.datasets.push(dataset);
      this.xAxisLabel.push(...value.map(x=> {return x.timeStamp}));
    }
    this.xAxisLabel = this.xAxisLabel.sort((x,y)=> x-y).map(x=> {return this.ParseDate(x)});
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
    this.CreateChart();
  }


  CreateChart() {

    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("actual-response-overtime", {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'point',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Actual Response Time Over Time'
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
              text: 'Elapsed Time (granularity: 1 min)',
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
            ticks : {
              stepSize :300
            }
          },
          y: {
            display: false
          }
        }
      }
    });
  }

  ApplyXFilter(time : number) {
    let filterData:Map<string, CsvModel[]> = new Map(this.csvData);
    for (let [key, value] of filterData) {
      let newvalue = value.filter(x=> x.elapsed < time);
      if(newvalue.length == 0){
        filterData.delete(key);
      }
      else{
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

  ParseDate(inputDate: number) {
    let date = new Date(inputDate);
    let day = date.getDate();
    let timeH = date.getHours();
    let timeM = date.getMinutes();
    let timeS = date.getSeconds();
    let timeMM = date.getMilliseconds();
    return `${day}, ${timeH}:${timeM}:${timeS}:${timeMM}`;
  }

  ResetZoom() {
    this.chart.resetZoom();
  }
}
