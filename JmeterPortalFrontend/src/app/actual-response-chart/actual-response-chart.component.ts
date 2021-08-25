import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';

@Component({
  selector: 'app-actual-response-chart',
  templateUrl: './actual-response-chart.component.html',
  styleUrls: ['./actual-response-chart.component.css']
})
export class ActualResponseChartComponent implements OnInit {

  @Input() data: CsvModel[] = [];
  @Input() jMeterTestScriptLabel: string[] = [];
  xAxisLabel: string[] = [];
  tempData: number[] = [];
  datasets: ChartDatasets[] = [];

  constructor() { }

  ngOnInit(): void {
    this.SetupChartData();
    this.CreateChart();
  }

  SetupChartData() {

    for (let index = 0; index < this.jMeterTestScriptLabel.length; index++) {
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


    for (let index = 0; index < this.data.length; index++) {
      let date = new Date(this.data[index].timeStamp);
      let day = date.getDate();
      let timeH = date.getHours();
      let timeM = date.getMinutes();
      let timeS = date.getSeconds();
      let formatedTime = `${day}, ${timeH}:${timeM}:${timeS}`;
      this.xAxisLabel.push(formatedTime);

      let d: any[] = [];
      d.push(formatedTime);
      d.push(this.data[index].elapsed);
      this.datasets.find(x => x.label === this.data[index].label)?.data.push(d);
    }
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    // console.log(this.jMeterTestScriptLabel);
    // console.log(this.xAxisLabel);
    // console.log(this.datasets);

  }


  CreateChart() {
    console.log("Start")
    Chart.register(...registerables);
    var myChart = new Chart("actual-response-overtime", {
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
          }
        },
        scales: {
          x:{
           title : {
             text : 'Time',
             display : true
           }
          },
          y0: {
            type: 'linear',
            position: 'left'
          },
          y: {
            display: false
          }
        }
      }
    });
  }

}
