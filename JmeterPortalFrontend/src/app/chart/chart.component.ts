import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../chart-datasets';
import { CsvModel } from '../csv-model';
import zoomPlugin from 'chartjs-plugin-zoom';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() id : string = "";
  @Input() title: string ="";
  @Input() xAxisType : any = "";
  @Input() xLabel : string = "";
  @Input() yLabel : string = "";
  @Input() pointRadius : number = 3;
  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  @Input() function! : (data : Map<string, CsvModel[]>) => void;
  @Input() pageFunction! : (data : Map<string, CsvModel[]>) => void;
  datasets: ChartDatasets[] = [];
  chart: any;
  xAxisLabel: any[] = [];
  yAxisFilter: number = 0;
  selectedItem: string[] = [];
  dropdown: boolean = false;
  filtered = false;
  labelSearch = "";
  yFilter = false;
  labelsView: string[] = [];
  selectedValue = "";
  labels: string[] = [];
  maxValue: number[] = [];
  totalThreads = 0;
  currentPage = 0;
  allTimeStamp: number[] = [];
  execStartTime = 0;
  execEndTime = 0;
  range: any[] = [];
  totalPages = 0;

  constructor() {
   }

  ngOnInit(): void {
    this.pageFunction(this.csvData);
    this.function(this.csvData);
    this.CreateChart();
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

  PreviousPage() {
    this.currentPage--;
    this.chart.destroy();
    this.function(this.csvData);
    this.CreateChart();
  }
  NextPage() {
    this.currentPage++;
    this.chart.destroy();
    this.function(this.csvData);
    this.CreateChart();
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
    this.yFilter = true;
    this.chart.destroy();
    this.function(filterData);
  }

  ClearYFilter() {
    this.yFilter = false;
    this.chart.destroy();
    this.function(this.csvData);
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