import { Component, OnInit } from '@angular/core';
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
  csvData : Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  testRun!: TestRunModel;
  
  dataLoaded = false;
  jMeterTestScriptLabels: string[] = [];
  constructor(private service: FileService, private reader: CsvreaderService) { }

  ngOnInit(): void {
    this.service.GetWithId(this.id).subscribe(res => {
      this.testRun = res;
      this.reader.GetCsvData(res);
      this.csvData = this.reader.CsvData();
      this.dataLoaded = true;
    });
  }

  




}
