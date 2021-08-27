import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChartService } from '../chart.service';
import { CsvModel } from '../csv-model';
import { CsvreaderService } from '../csvreader.service';
import { FileService } from '../file.service';
import { TestRunModel } from '../testrun-model';

@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.css']
})
export class CsvReaderComponent implements OnInit {
  id: string = "95733BF4-9F94-48B8-BD55-78ABE2C28114";
  testRun!: TestRunModel;
  dataLoaded = false;
  subscription! : Subscription;
  
  constructor(private service: FileService, private reader: CsvreaderService, public chartService: ChartService) { }

  ngOnInit(): void {
    this.subscription = this.service.GetWithId(this.id).subscribe(res => {
      this.testRun = res;
      this.reader.GetCsvData(res);
      this.dataLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  




}
