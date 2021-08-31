import { Injectable } from '@angular/core';
import { ChartService } from './chart.service';
import { CsvModel } from './csv-model';
import { TestRunModel } from './testrun-model';

@Injectable({
  providedIn: 'root'
})
export class FilereaderService {

  map : Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  constructor(private chartService : ChartService) {
  }

  GetData(testRun : TestRunModel) {
    //this.DataXML(testRun);
    this.DataCSV(testRun);
  }

  // DataXML(testRun : TestRunModel){
  //   let xmlString = atob(testRun.fileStreamData);
  //   const parser = new DOMParser();
  //   let xmlDoc = parser.parseFromString(xmlString, "text/xml");
  //   let testResults = xmlDoc.getElementsByTagName("testResults")[0];
  //   let samples = testResults.getElementsByTagName("sample");
  //   console.log(samples)
  // }

  DataCSV(testRun : TestRunModel){
    let allRecords = atob(testRun.fileStreamData).split(/\r\n|\n/);  
    for (let index = 1; index < allRecords.length-1; index++) {
      let records = allRecords[index].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let data: CsvModel = {
        timeStamp: Number(records[0].trim()),
        elapsed: Number(records[1].trim()),
        label: records[2].trim(),
        grpThreads: Number(records[11].trim()),
        allThreads: Number(records[12].trim()),
      }
      
      if(!this.map.has(records[2].trim())){
        this.map.set(records[2].trim(), [data]);
      }
      else{
        this.map.get(records[2].trim())?.push(data);
      }
    
    }
    console.log(this.map);
    this.chartService.UpdateData(this.map);
  }

}
