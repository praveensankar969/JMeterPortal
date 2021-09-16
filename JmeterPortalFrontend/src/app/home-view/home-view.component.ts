import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

  chart: any;
  constructor() { }

  ngOnInit(): void {
    this.ViewChart();
  }

  ViewChart() {
    var xValues = ['12, 11:57:07' , '12, 11:58:07', '12, 11:59:07', '12:01:07', '12:02:07', '12:03:07', '12:04:07']
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("chart", {
      type: 'line',
      data: {
        datasets: [{
          data: [{ x: '2021-08-12, 11:57:07 PM', y: 124 },
          { x: '2021-08-12, 11:58:07 PM', y: 133 },
          { x: '2021-08-12, 11:59:07 PM', y: 114 },
          { x: '2021-08-13, 12:01:07 AM', y: 91 },
          { x: '2021-08-13, 12:02:07 AM', y: 103 },
          { x: '2021-08-13, 12:03:07 AM', y: 102 },
          { x: '2021-08-13, 12:04:07 AM', y: 80 }],
          borderColor: "red",
          fill: false,
          label: 'Trend1',
          showLine: true
        }]
        // }, {
        //   data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
        //   borderColor: "green",
        //   fill: false,
        //   label : 'Trend1',
        //   showLine : false
        // }, {
        //   data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
        //   borderColor: "blue",
        //   fill: false,
        //   label : 'Trend1',
        //   showLine : false
        // }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Line Chart - Multi Axis'
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
          x : {
            type : 'time'
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            display: false
          }
        }
      }
    });
  }

}
