import { Injectable } from '@angular/core';
import { ChartService } from './chart.service';
import { CsvModel } from './csv-model';

@Injectable({
  providedIn: 'root'
})
export class FilereaderService {

  map : Map<string, CsvModel[]> = new Map<string, CsvModel[]>();
  constructor(private chartService : ChartService) {
  }


  GetDataCSV(data : CsvModel[]){ 
    // for (let index = 0; index < data.length; index++) {
      
    //   if(!this.map.has(data[index].label)){
    //     this.map.set(data[index].label, );
    //   }
    //   else{
    //     this.map.get(records[2].trim())?.push(data);
    //   }
    
    // }
    // console.log(this.map);
    // this.chartService.UpdateData(this.map);
  }

}
