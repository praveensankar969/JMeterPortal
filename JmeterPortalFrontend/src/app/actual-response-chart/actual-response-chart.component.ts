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

  @Input() data: CsvModel[] = [];
  @Input() jMeterTestScriptLabel: string[] = [];
  xAxisLabel: string[] = [];
  datasets: ChartDatasets[] = [];
  chart: any;
  xAxisFilter: number = 0;
  testRunStartDate : Date = new Date();
  constructor() { }

  ngOnInit(): void {
    this.testRunStartDate = new Date(this.data[0].timeStamp);
    this.SetupChartData(this.data, this.jMeterTestScriptLabel);  
  }

  SetupChartData(data : CsvModel[], label : string[]) {
    this.xAxisLabel = [];
    this.datasets = [];
    for (let index = 0; index < label.length; index++) {
      const r = Math.round(Math.random() * 255);
      const g = Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let dataset: ChartDatasets = {
        label: this.jMeterTestScriptLabel[index],
        data: [],
        borderColor: color,
        backgroundColor: color
      }
      this.datasets.push(dataset);
    }

    for (let index = 0; index < data.length; index++) {
      let formatedTime =this.ParseDate(data[index].timeStamp);
      this.xAxisLabel.push(formatedTime);
      let d: any[] = [];
      d.push(formatedTime);
      d.push(data[index].elapsed);
      this.datasets.find(x => x.label === data[index].label)?.data.push(d);
    }

    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    // console.log(this.jMeterTestScriptLabel);
    // console.log(this.xAxisLabel);
    //console.log(this.datasets);
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
              text: 'Time',
              display: true
            }
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: 'Response Time (ms)',
              display: true
            }
          },
          y: {
            display: false
          }
        }
      }
    });
  }
  ApplyXFilter() {
    let filterData : CsvModel[] = this.data;
    let time = new Date(this.xAxisFilter).getTime();
    filterData = filterData.filter(x=> {
      return x.timeStamp >= time
    });
    let label = [];
    for (let index = 0; index < filterData.length; index++) {
      label.push(filterData[index].label);    
    }
    label = [...new Set(label)];
    this.chart.destroy();
    this.SetupChartData(filterData, label);
  }

  ClearFilter(){
    this.chart.destroy();
    this.SetupChartData(this.data, this.jMeterTestScriptLabel);
  }

  ParseDate(inputDate: number) {
    let date = new Date(inputDate);
    let day = date.getDate();
    let timeH = date.getHours();
    let timeM = date.getMinutes();
    let timeS = date.getSeconds();
    return `${day}, ${timeH}:${timeM}:${timeS}`;
  }

  ResetZoom() {
    this.chart.resetZoom();
  }
}
