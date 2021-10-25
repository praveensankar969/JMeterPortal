import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestRunModel } from '../Models/testrun-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartDatasets } from '../Models/chart-datasets';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { HttpService } from '../Services/http.service';
import { APIURL } from '../Models/api_url';
import { ChartType } from '../Models/chart-type';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.css'],
})
export class FileReaderComponent implements OnInit {
  averageResVThreadData!: ChartDataSetModel;
  avgThreaddataLoaded = false;

  actualResVThreadData!: ChartDataSetModel;
  actualThreaddataLoaded = false;

  averageResVTimeData!: ChartDataSetModel;
  avgResdataLoaded = false;

  actualResVTimeData!: ChartDataSetModel;
  actResdataLoaded = false;

  percentileData!: ChartDataSetModel;
  percentiledataLoaded = false;

  chartType: typeof APIURL = APIURL;
  chartTitle: typeof ChartType = ChartType;

  id: string = '';
  testRun!: TestRunModel;
  subscription!: Subscription;
  xAxisLabel: any[] = [];
  labelsView: string[] = [];
  selectedValue = '';
  labels: string[] = [];
  datasets: ChartDatasets[] = [];
  maxValue: number[] = [];
  totalThreads = 0;
  allTimeStamp: number[] = [];
  execStartTime : string = "";
  execEndTime : string = "";
  range: any[] = [];
  totalPages = 0;
  currentPage = 0;
  dataloading = true;
  timeRangeMin: string = "";
  timeRangeMax: string = "";
  filtered = false;

  constructor(
    private service: HttpService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe((res) => {
      this.id = res['id'];
    });
  }

  ngOnInit(): void {   
    this.service.GetTimeInterval(this.id).subscribe(res=> {
      let params = new HttpParams();
      params = params.append('start', res[0]);
      params = params.append('end', res[1]);
      let date = new Date(res[0]);
      this.timeRangeMin = date.getFullYear() + "-" + this.formatDate(date.getMonth()+1) + "-" + this.formatDate(date.getDate())
             + "T" + this.formatDate(date.getHours()) +":" + this.formatDate(date.getMinutes());
      date = new Date(res[1]);
      this.timeRangeMax =  date.getFullYear() + "-" + this.formatDate(date.getMonth()+1) + "-" + this.formatDate(date.getDate())
      + "T" + this.formatDate(date.getHours()) +":" + this.formatDate(date.getMinutes());
      this.Fetch(params);
    });
  }

  private formatDate(nmbr: number): string {
    var date = nmbr + "";
    date = (date.length < 2) ? "0" + date : date;
    return date;
  }

  Fetch(params?: HttpParams){
    this.AverageResvThread(params);
    this.ActualThreadvResponseData(params);
    this.PercentileData(params);
    this.AverageResvTimeData(params);
    this.ActualResvTime(params);
  }

  AverageResvThread(params?: HttpParams) {
    this.service.GetAverageResponseVsThread(this.id, params).subscribe((res) => {
      this.averageResVThreadData = res;
      this.avgThreaddataLoaded = true;
    });
  }

  ActualThreadvResponseData(params?: HttpParams) {
    this.service.GetActualThreadVsResponse(this.id, params).subscribe((res) => {
      this.actualResVThreadData = res;
      this.actualThreaddataLoaded = true;
    });
  }

  PercentileData(params?: HttpParams) {
    this.service.GetPercentile(this.id, params).subscribe((res) => {
      this.percentileData = res;
      this.percentiledataLoaded = true;
    });
  }

  AverageResvTimeData(params?: HttpParams) {
    this.service.GetAverageResponseVsTime(this.id, params).subscribe((res) => {
      this.averageResVTimeData = res;
      this.avgResdataLoaded = true;
    });
  }

  ActualResvTime(params?: HttpParams) {
    this.spinner.show();
    this.service.GetActualResponseVsTime(this.id, params).subscribe(
      (res) => {
        this.actualResVTimeData = res;
        this.actResdataLoaded = true;
        this.spinner.hide();
        this.dataloading = false;
      },
      (err) => {
        this.spinner.hide();
        this.dataloading = false;
      }
    );
  }

  TimeFilter(){
    this.spinner.show();
    let start = new Date(this.execStartTime).getTime();
    let end = new Date(this.execEndTime).getTime();
    console.log(this.execEndTime)
    let params = new HttpParams();
    if(!isNaN(start)){
      params = params.append('start', start);
    }
    if(!isNaN(end)){
      params = params.append('end', end);
    }
    this.Fetch(params);
    this.filtered = true;
    this.spinner.hide();
  }

  ClearFilter(){
    this.spinner.show();
    this.filtered = false;
    this.Fetch();
    this.execStartTime  = "";
    this.execEndTime  = "";
    this.spinner.hide();
  }

  ngOnDestroy(): void {}
}
