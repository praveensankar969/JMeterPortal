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

  @Input() csvData: Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  xAxisLabel: any[] = [];
  datasets: ChartDatasets[] = [];
  chart: any;
  yAxisFilter!: number;
  selectedValue = "";
  allTimeStamp: number[] = [];
  labels : string[] = [];
  range: any[] = [];
  totalPages = 0;
  currentPage = 0;
  execStartTime = 0;
  execEndTime = 0;
  selectedItem : string[]= [];
  showAll = true;
  dropdown : boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.Paging();
    this.SetupChartData(this.csvData);
  }

  Paging() {
    
    for (let [key, value] of this.csvData) {
      this.labels.push(key);
      let time = value.map(x => x.timeStamp);
      this.allTimeStamp.push(...time);
    }
    this.allTimeStamp.sort((a, b) => a - b);
    let total = this.allTimeStamp.length - 1;
    this.execStartTime = this.allTimeStamp[0];
    this.execEndTime = this.allTimeStamp[total];
    let totaltime = Math.floor((this.execEndTime - this.execStartTime) / 1000) / 60;

    let noOfSections = (totaltime / 10);
    for (let index = 0; index < noOfSections; index++) {
      let start = index * 10;
      let end = index * 10 + 10;
      this.range.push([start, end]);

    }
    this.totalPages = this.range.length;
  }

  SetupChartData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    let currentPageStartTime = this.range[this.currentPage][0] * 60000;
    let currentPageEndTime = this.range[this.currentPage][1] * 60000;
    for (let [key, value] of data) {
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let sortData = value.sort((x, y) => { return x.timeStamp - y.timeStamp });

      sortData = sortData.filter(x => {
        return x.timeStamp >= (this.execStartTime + currentPageStartTime) &&
          x.timeStamp <= (this.execStartTime + currentPageEndTime)
      });

      let d = sortData.map(x => {
        return [this.ParseDate(x.timeStamp), x.elapsed]
      });
      let dataset: ChartDatasets = {
        label: key,
        data: d,
        borderColor: color,
        pointBorderColor: color
      }
      this.datasets.push(dataset);
      this.xAxisLabel.push(...sortData.map(x => { return x.timeStamp }));
    }
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return this.ParseDate(x) });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
    this.CreateChart();
  }

  PreviousPage() {
    this.currentPage--;
    this.chart.destroy();
    this.SetupChartData(this.csvData);
  }
  NextPage() {
    this.currentPage++;
    this.chart.destroy();
    this.SetupChartData(this.csvData);
  }

  FilterLabel(){
    this.dropdown = !this.dropdown;
    let selected = this.selectedItem;
    this.chart.data.datasets.forEach(function(ds: any) {
      if(selected.find(x=> x==ds.label)!=undefined){
        ds.hidden = !ds.hidden;
      }
    });
    this.chart.update();
  }

  SelectMultiple(event : Event){
    let val =(event.target as HTMLInputElement);
    if(val.checked){
      this.selectedItem.push(val.id);
    }
    else{
      this.selectedItem = this.selectedItem.filter(x=> x != val.id);
    }
  }

  LabelToggle(){
    this.showAll =!this.showAll;
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
          legend : {
            display : this.showAll
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
            // type : 'linear',
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
            ticks: {
              stepSize: 300
            }
          },
          y: {
            display: false
          }
        }
      }
    });
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
    console.log(filterData);

    this.chart.destroy();
    this.SetupChartData(filterData);
  }

  ClearFilter() {
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
