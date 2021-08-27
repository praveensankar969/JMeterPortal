import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CsvModel } from '../csv-model';
import { CsvreaderService } from '../csvreader.service';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartDatasets } from '../chart-datasets';

@Component({
  selector: 'app-restime-percentile-chart',
  templateUrl: './restime-percentile-chart.component.html',
  styleUrls: ['./restime-percentile-chart.component.css']
})
export class RestimePercentileChartComponent implements OnInit {

  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  elapsedData: Map<string, number[][]> = new Map<string, number[][]>();
  chart: any;
  xAxisLabel: number[] = [];
  datasets: ChartDatasets[] = [];
  maxValue: number[] = [];
  constructor(private service: CsvreaderService) { }

  ngOnInit(): void {
    for (let index = 0; index < 100; index = (index + .1)) {
      this.xAxisLabel.push(Math.round(index * 10) / 10);
    }
    console.log(this.xAxisLabel);
    this.GetPercentileData();

  }

  GetPercentileData() {
    for (let [key, value] of this.csvData) {
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let dataset: ChartDatasets = {
        label: key,
        data: [],
        borderColor: color,
        pointBorderColor: color
      }
      let newvalue = value.map(x => x.elapsed);
      newvalue.sort((x, y) => x - y);
      this.maxValue.push(newvalue[newvalue.length - 1]);
      for (let index = 0; index < newvalue.length; index++) {
        let p = Number(((index / newvalue.length) * 100).toFixed(1));
        let q = newvalue[index];
        dataset.data.push([p, q])
      }
      this.datasets.push(dataset);

    }
    this.maxValue.sort((a, b) => a - b)
    console.log(this.datasets);
    this.CreateChart();
  }

  CreateChart() {
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("responsetime-percentile", {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets,

      },

      options: {
        //parsing : true,
        animation: false,
        responsive: true,
        elements: {
          point: {
            radius: 0
          }
        },
        interaction: {
          mode: 'point',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Response Time Percentile'
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
              text: 'Percentile',
              display: true
            },
            ticks: {
              stepSize: 5
            }
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: 'Percentile value in ms',
              display: true
            },
            min: 0,
            max: this.maxValue[this.maxValue.length - 1]
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

}
