import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartService } from '../chart.service';
import { FileService } from '../file.service';
import { TestRunModel } from '../testrun-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CsvModel } from '../csv-model';
import { ChartDatasets } from '../chart-datasets';
import { FilereaderService } from '../filereader.service';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css']
})
export class FileReaderComponent implements OnInit {

  id: string = "";
  testRun!: TestRunModel;
  dataLoaded = false;
  subscription!: Subscription;
  xAxisLabel: any[] = [];
  labelsView: string[] = [];
  selectedValue = "";
  labels: string[] = [];
  datasets: ChartDatasets[] = [];
  maxValue: number[] = [];
  totalThreads = 0;
  allTimeStamp: number[] = [];
  execStartTime = 0;
  execEndTime = 0;
  range: any[] = [];
  totalPages = 0;
  currentPage = 0;

  constructor(private service: FileService, private reader: FilereaderService,
    public chartService: ChartService, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    this.route.params.subscribe(res => { this.id = res['id']; this.Fetch() })
  }

  ngOnInit(): void {
  }

  Fetch() {
    this.spinner.show();
    this.subscription = this.service.GetWithId(this.id).subscribe(res => {
      this.testRun = res;
      this.reader.GetData(res);
      this.dataLoaded = true;
      this.spinner.hide();
    }, err => {
      this.dataLoaded = true;
      this.spinner.hide();
    });
  }

  ActualThreadvResponseData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];

    for (let [key, value] of data) {
      this.labels.push(key);
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let newV = value.sort((x, y) => { return x.allThreads - y.allThreads });
      let dataset: ChartDatasets = {
        label: key,
        data: [],
        borderColor: color,
        pointBorderColor: color
      }
      for (let i = 0; i < newV.length; i++) {
        let thread = newV[i].allThreads;
        let elapsed = newV[i].elapsed;
        dataset.data.push([thread, elapsed]);
      }
      this.datasets.push(dataset);
      this.xAxisLabel.push(...value.map(x => { return x.allThreads }));

    }
    this.labelsView = this.labels;
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return x });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);

  }

  PercentileData(data: Map<string, CsvModel[]>) {
    for (let [key, value] of data) {
      this.labels.push(key);
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
    this.labelsView = this.labels;
    this.maxValue.sort((a, b) => a - b)
    console.log(this.datasets);
  }

  AverageResvTimeData(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    for (let [key, value] of data) {
      this.labels.push(key);
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let newV = value.sort((x, y) => { return x.timeStamp - y.timeStamp });
      let datapoint: any[] = []
      let d = newV.map(x => {
        return [x.timeStamp, x.elapsed]
      });
      let start = d[0][0];
      let end = d[d.length - 1][0];
      let totalExecTime = (end - start) / 60000;
      for (let index = 0; index < totalExecTime; index++) {
        let startTime = ((index * 60000) + start);
        let endTime = (((index + 1) * 60000) + start)
        let allAtTime = newV.filter(x => {
          return x.timeStamp >= startTime && x.timeStamp <= endTime
        })
        let elapsed = allAtTime.map(x => x.elapsed);
        if (elapsed.length > 1) {
          let avg = (elapsed.reduce((a, b) => a + b, 0)) / elapsed.length;
          datapoint.push([this.ParseDate(((index * 60000) + start)), avg]);
          this.xAxisLabel.push(((index * 60000) + start));
        }
      }
      let dataset: ChartDatasets = {
        label: key,
        data: datapoint,
        borderColor: color,
        pointBorderColor: color
      }
      this.datasets.push(dataset);
    }
    this.labelsView = this.labels;
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return this.ParseDate(x) });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
  }

  AverageResvThread(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    for (let [key, value] of data) {
      this.labels.push(key);
      let color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      let newV = value.sort((x, y) => { return x.allThreads - y.allThreads });
      this.xAxisLabel.push(...newV.map(x => x.allThreads));
      let avgPoints: any[] = [];
      this.totalThreads = newV[newV.length - 1].allThreads;

      for (let index = 1; index <= this.totalThreads; index++) {
        let allThreads = newV.filter(x => x.allThreads == index);
        let allElapsed = allThreads.map(x => x.elapsed);
        if (allElapsed.length > 1) {
          let avg = (allElapsed.reduce((a, b) => a + b, 0)) / allElapsed.length;
          avgPoints.push([index, avg]);
        }
      }

      let dataset: ChartDatasets = {
        label: key,
        data: avgPoints,
        borderColor: color,
        pointBorderColor: color
      }
      this.datasets.push(dataset);

    }
    this.labelsView = this.labels;
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
  }

  ActualResvTime(data: Map<string, CsvModel[]>) {
    this.xAxisLabel = [];
    this.datasets = [];
    let currentPageStartTime = this.range[this.currentPage][0] * 60000;
    let currentPageEndTime = this.range[this.currentPage][1] * 60000;
    for (let [key, value] of data) {
      this.labels.push(key);
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
    this.labelsView = this.labels;
    this.xAxisLabel = this.xAxisLabel.sort((x, y) => x - y).map(x => { return this.ParseDate(x) });
    this.xAxisLabel = [...new Set(this.xAxisLabel)];
    console.log(this.datasets);
  }

  Paging(data: Map<string, CsvModel[]>) {   
    for (let [key, value] of data) {
      this.labels.push(key);
      let time = value.map(x => x.timeStamp);
      this.allTimeStamp.push(...time);
    }
    this.labelsView  = this.labels;
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

  PagingFunctionTemplate(data: Map<string, CsvModel[]>){
    //not implementing paging for chart
  }

  ParseDate(inputDate: number) {
    let date = new Date(inputDate);
    let day = date.getDate();
    let timeH = date.getHours();
    let timeM = date.getMinutes();
    let timeS = date.getSeconds();
    return `${day}, ${timeH}:${timeM}:${timeS}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
