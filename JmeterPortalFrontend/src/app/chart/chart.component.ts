import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../Models/chart-datasets';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartDataSetModel } from '../Models/chart-dataset-model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() data! : ChartDataSetModel;
  @Input() id : string = "";
  @Input() title: string ="";
  @Input() xAxisType : any = "";
  @Input() xLabel : string = "";
  @Input() yLabel : string = "";
  @Input() pointRadius : number = 2;
  
  datasets: ChartDatasets[] = [];
  labels: string[] = [];
  chart!: Chart;
  xAxisLabel: any[] = [];
  
  yAxisFilter: number = 0;
  selectedItem: string[] = [];
  labelsView: string[] = [];
  dropdown: boolean = false;
  filtered = false;
  labelSearch = "";
  yFilter = false;
  selectedValue = "";

  constructor() {
   }

  ngOnInit(): void {
    this.Fetch();
    this.CreateChart();
  }
  
  Fetch(){
    this.xAxisLabel = this.data.xAxisLabel;
    this.datasets = JSON.parse(JSON.stringify(this.data.datasets));
    this.labels = this.data.labels;
    this.labelsView = this.labels;
    console.log(this.datasets)
  }

  FilterLabel() {
    this.dropdown = !this.dropdown;
    let selected = this.selectedItem;
    this.chart.data.datasets.forEach(function (ds: any) {
      if (selected.find(x => x == ds.label) != undefined) {
        ds.hidden = false;
      }
      else {
        ds.hidden = true;
      }
    });
    this.chart.update();
    this.filtered = true;
  }

  SelectMultiple(event: Event) {
    let val = (event.target as HTMLInputElement);
    if (val.checked) {
      this.selectedItem.push(val.id);
    }
    else {
      this.selectedItem = this.selectedItem.filter(x => x != val.id);
    }
  }

  ClearLabelFilter() {
    this.labelSearch = "";
    this.filtered = false;
    this.selectedItem = [];
    this.chart.data.datasets.forEach(function (ds: any) {
      if (ds.hidden) {
        ds.hidden = false;
      }
    });
    this.chart.update();
  }

  SearchLabel() {
    if (this.labelSearch.length == 0) {
      this.labelsView = this.labels;
    }
    else {
      let filtered = this.labelsView.filter(x => x.toLowerCase().indexOf(this.labelSearch) > -1);
      this.labelsView = filtered;
    }
  }

  CreateChart() {
    console.log("Creating chart..." + this.title);
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart(this.id, {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets
      },
      options: {
        animation: false,
        responsive: true,
        elements: {
          point: {
            radius: this.pointRadius
          }
        },
        plugins: {
          title: {
            display: true,
            text: this.title
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
            type: this.xAxisType,
            title: {
              text: this.xLabel,
              display: true
            }
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: this.yLabel,
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

  ResetZoom() {
    this.chart.resetZoom();
  }

  ApplyYFilter(time: number) {
    this.yFilter = true;
    
    this.chart.update();
  }

  ClearYFilter() {
    this.datasets = JSON.parse(JSON.stringify(this.data.datasets));
    this.chart.destroy();
    this.CreateChart();
  }

  XFilter(){
    this.chart.data.datasets.forEach(function (ds:  any) {
      ds.data = ds.data.filter((d: any)=> d.x > "13, 01:16");
    });
    this.xAxisLabel = this.xAxisLabel.filter(x=> x > "13, 01:16");
    console.log(this.chart.data.datasets)
    this.chart.update();
  }

}