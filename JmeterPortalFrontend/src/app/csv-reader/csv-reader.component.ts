import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartService } from '../chart.service';
import { CsvreaderService } from '../csvreader.service';
import { FileService } from '../file.service';
import { TestRunModel } from '../testrun-model';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.css']
})
export class CsvReaderComponent implements OnInit {
  id: string = "";
  testRun!: TestRunModel;
  dataLoaded = false;
  subscription! : Subscription;
  
  constructor(private service: FileService, private reader: CsvreaderService, 
    public chartService: ChartService, private route : ActivatedRoute, private spinner : NgxSpinnerService) {
      this.route.params.subscribe(res=> {this.id = res['id']; this.Fetch()})
    }

  ngOnInit(): void {   
  }

  Fetch(){
    this.spinner.show();
    this.subscription = this.service.GetWithId(this.id).subscribe(res => {
      this.testRun = res;
      this.reader.GetCsvData(res);
      this.dataLoaded = true;
      this.spinner.hide();
    }, err=>{
      this.dataLoaded = true;
      this.spinner.hide();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  




}
