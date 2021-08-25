import { Component, OnInit } from '@angular/core';
import { CsvModel } from '../csv-model';
import { FileService } from '../file.service';
import { TestRunModel } from '../testrun-model';

@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.css']
})
export class CsvReaderComponent implements OnInit {
  id: string = "95733BF4-9F94-48B8-BD55-78ABE2C28114";
  csvData: CsvModel[] = [];
  decodedString = "";
  testRun!: TestRunModel;
  dataLoaded = false;
  jMeterTestScriptLabels: string[] = [];
  constructor(private service: FileService) { }

  ngOnInit(): void {
    this.service.GetWithId(this.id).subscribe(res => {
      this.testRun = res;
      this.GetCsvData();
      this.dataLoaded = true;
    });
  }

  GetCsvData() {
    let allRecords = atob(this.testRun.fileStreamData).split(/\r\n|\n/);   
    for (let index = 1; index < allRecords.length/100-1; index++) {
      let records = allRecords[index].split(",");
      let data: CsvModel = {
        timeStamp: Number(records[0].trim()),
        elapsed: Number(records[1].trim()),
        label: records[2].trim(),
        responseCode: Number(records[3].trim()),
        threadName: records[4].trim(),
        dataType: records[5].trim(),
        success: records[6].trim(),
        failureMessage: records[7].trim(),
        bytes: Number(records[8].trim()),
        sentBytes: Number(records[9].trim()),
        grpThreads: Number(records[10].trim()),
        allThreads: Number(records[11].trim()),
        url: records[12].trim(),
        latency: Number(records[13].trim()),
        sampleCount: Number(records[14].trim()),
        errorCount: Number(records[15].trim()),
        hostName: records[16].trim(),
        idleTime: Number(records[17].trim()),
        connect: Number(records[18].trim()),
      }
      this.csvData.push(data);
      this.jMeterTestScriptLabels.push(records[2].trim());
    }
    // console.log(this.csvData);
    this.jMeterTestScriptLabels = [...new Set(this.jMeterTestScriptLabels)];
  }




}
