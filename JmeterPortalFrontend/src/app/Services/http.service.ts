import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestRun } from '../Models/test-run';
import { catchError, first, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AllTestRunModel } from '../Models/all-testruns-model';
import { ChartDataSetModel } from '../Models/chart-dataset-model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  API_URL="https://localhost:5001/portal/";
  constructor(private http: HttpClient) { }

  UploadFile(data : TestRun){
    console.log(data)
    return this.http.post<number>(this.API_URL+"add-testrun", data).
        pipe(catchError(err=> {return throwError(err)}), first());
  }

  GetActualThreadVsResponse(id: string){
    return this.http.get<any>(this.API_URL+"actual-thread-vs-response-chart/"+id).
        pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }
  
  GetPercentile(id: string){
    // return this.http.get<ChartDataSetModel>(this.API_URL+"percentile-chart/"+id).
    //     pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }

  GetAverageResponseVsTime(id: string){
    return this.http.get<ChartDataSetModel>(this.API_URL+"average-response-over-time-chart/"+id).
        pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }
  
  GetAverageResponseVsThread(id: string){
    return this.http.get<ChartDataSetModel>(this.API_URL+"average-response-over-thread-chart/"+id).
        pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }

  GetAllResults(){
    return this.http.get<AllTestRunModel[]>(this.API_URL+"all-results").
        pipe(catchError(err=> {return throwError(err)}), first());
  }
}