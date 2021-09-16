import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartDatasets } from '../Models/chart-datasets';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartService } from '../Services/chart.service';
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
  @Input() pointRadius : number = 3;
  
  datasets: ChartDatasets[] = [];
  labels: string[] = [];
  chart: any;
  xAxisLabel: any[] = [];
  
  yAxisFilter: number = 0;
  selectedItem: string[] = [];
  labelsView: string[] = [];
  dropdown: boolean = false;
  filtered = false;
  labelSearch = "";
  yFilter = false;
  selectedValue = "";

  constructor(public chartService: ChartService) {
   }

  ngOnInit(): void {
    this.Fetch();
    this.CreateChart();
  }
  
  Fetch(){
    this.xAxisLabel = this.data.xAxisLabel;
    this.datasets = this.data.datasets;
    this.labels = this.data.labels;
    this.labelsView = this.labels;
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
    console.log("Creating chart...");
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
  //   this.currentPage--;
  //   this.chart.destroy();
  //   this.function(this.csvData);
  //   this.CreateChart();
  }
  NextPage() {
  //   this.currentPage++;
  //   this.chart.destroy();
  //   this.function(this.csvData);
  //   this.CreateChart();
  }

  ApplyYFilter(time: number) {
    this.yFilter = true;
    this.UpdateChart(this.chart, time);
  }

  UpdateChart(chart: Chart, time: number){
    if(this.selectedValue=="Greater than"){
      chart.data.datasets.forEach(function (ds:  any) {
        ds.data = ds.data.filter((x : number[])=> x[1] >= time);
      });
    }
    else{
      chart.data.datasets.forEach(function (ds: any) {
        ds.data = ds.data.filter((x : number[])=> x[1] <= time);
      });
    }
    chart.update();
    console.log(this.data)
  }

  ClearYFilter() {
    this.chart.destroy();
    this.ngOnInit();
  }

  // ParseDate(inputDate: number) {
  //   let date = new Date(inputDate);
  //   let day = date.getDate();
  //   let timeH = date.getHours();
  //   let timeM = date.getMinutes();
  //   let timeS = date.getSeconds();
  //   return `${day}, ${timeH}:${timeM}:${timeS}`;
  // }


}