import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CsvModel } from './csv-model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private subject : BehaviorSubject<Map<string, CsvModel[]>>= new BehaviorSubject<Map<string, CsvModel[]>>( new Map<string, CsvModel[]>());
  obs = this.subject.asObservable();
 
  constructor() { }

  UpdateData(data : Map<string, CsvModel[]>){
    this.subject.next(data);
  }

  

}
