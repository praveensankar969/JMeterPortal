import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private service : HttpService){ 
  }

  AverageResponseVsThread(id : string){
    return this.service.GetAverageResponseVsThread(id);
  }

}
