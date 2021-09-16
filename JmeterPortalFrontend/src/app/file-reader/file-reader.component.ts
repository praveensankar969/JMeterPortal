import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartService } from '../Services/chart.service';
import { TestRunModel } from '../Models/testrun-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CsvModel } from '../Models/csv-model';
import { ChartDatasets } from '../Models/chart-datasets';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { HttpService } from '../Services/http.service';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css']
})
export class FileReaderComponent implements OnInit {

  averageResVThreadData! : ChartDataSetModel;
  avgThreaddataLoaded = false;
  
  actualResVThreadData! : ChartDataSetModel;
  actualThreaddataLoaded = false;
  
  averageResVTimeData! : ChartDataSetModel;
  avgResdataLoaded = false;
  
  actualResVTimeData! : ChartDataSetModel;
  actResdataLoaded = false;
  
  percentileData! : ChartDataSetModel;
  percentiledataLoaded = false;
  
  id: string = "";
  testRun!: TestRunModel;
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

  constructor(private service: HttpService, 
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) 
  {this.route.params.subscribe(res => { this.id = res['id'];})  }

  ngOnInit(): void {
    this.AverageResvTimeData();
  }
  
  AverageResvThread() {
    this.subscription = this.service.GetAverageResponseVsThread(this.id)
      .subscribe(res=>{
        this.averageResVThreadData = res;
        this.avgThreaddataLoaded = true;
      });
  }

  ActualThreadvResponseData() {
    this.subscription = this.service.GetActualThreadVsResponse(this.id)
      .subscribe(res=>{
        this.actualResVThreadData = res;
        this.actualThreaddataLoaded = true;
      });
  }

  PercentileData() {
    // this.subscription = this.service.GetPercentile(this.id)
    //   .subscribe(res=>{
    //     this.percentileData = res;
    //     this.percentiledataLoaded = true;
    //   });
  }

  AverageResvTimeData() {
    this.subscription = this.service.GetAverageResponseVsTime(this.id)
      .subscribe(res=>{
        this.averageResVTimeData = res;
        this.avgResdataLoaded = true;
      });
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
        pointBorderColor: color,showLine : true
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