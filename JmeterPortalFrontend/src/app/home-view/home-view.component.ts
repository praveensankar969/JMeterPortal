import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

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
    var xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart("chart", {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
          borderColor: "red",
          fill: false,
          label : 'Trend1'
        }, {
          data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
          borderColor: "green",
          fill: false,
          label : 'Trend1'
        }, {
          data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
          borderColor: "blue",
          fill: false,
          label : 'Trend1'
        }]
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
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            display : false
          }
        }
      }
    });
  }

}
