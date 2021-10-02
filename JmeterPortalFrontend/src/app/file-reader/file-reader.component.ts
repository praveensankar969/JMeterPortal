import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestRunModel } from '../Models/testrun-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartDatasets } from '../Models/chart-datasets';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { HttpService } from '../Services/http.service';
import { CsvModel } from '../Models/csv-model';

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
  {
    this.route.params.subscribe(res => { this.id = res['id'];})  
  }

  ngOnInit(): void {
    this.AverageResvThread();
    this.ActualThreadvResponseData();
    this.PercentileData();
    this.AverageResvTimeData();
    this.ActualResvTime();
  }
  
  AverageResvThread() {
    this.service.GetAverageResponseVsThread(this.id)
      .subscribe(res=>{
        this.averageResVThreadData = res;
        this.avgThreaddataLoaded = true;
      });
  }

  ActualThreadvResponseData() {
    this.service.GetActualThreadVsResponse(this.id)
      .subscribe(res=>{
        this.actualResVThreadData = res;
        this.actualThreaddataLoaded = true;
      });
  }

  PercentileData() {
    this.service.GetPercentile(this.id)
      .subscribe(res=>{
        this.percentileData = res;
        this.percentiledataLoaded = true;
      });
  }

  AverageResvTimeData() {
    this.service.GetAverageResponseVsTime(this.id)
      .subscribe(res=>{
        this.averageResVTimeData = res;
        this.avgResdataLoaded = true;
      });
  }

  ActualResvTime() {
    this.spinner.show();
    this.service.GetActualResponseVsTime(this.id)
      .subscribe(res=>{
        this.actualResVTimeData = res;
        this.actResdataLoaded = true;
        this.spinner.hide();
      }, (err)=> {
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
  }

}