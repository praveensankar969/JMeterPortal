import { Injectable } from '@angular/core';
import { CsvModel } from './csv-model';
import { TestRunModel } from './testrun-model';

@Injectable({
  providedIn: 'root'
})
export class CsvreaderService {

  map : Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  constructor() {
  }

  GetCsvData(testRun : TestRunModel) {
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
  }

  CsvData(){
    return this.map;
  }
}
