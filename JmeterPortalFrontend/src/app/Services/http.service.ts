import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestRun } from '../Models/test-run';
import { catchError, first, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AllTestRunModel } from '../Models/all-testruns-model';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { TestRunModel } from '../Models/testrun-model';
import { APIURL } from '../Models/api_url';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private http: HttpClient) { }

  UploadFile(data : TestRun){
    console.log(data)
    return this.http.post<number>(APIURL.URL+"add-testrun", data).
        pipe(catchError(err=> {return throwError(err)}), first());
  }

  GetActualThreadVsResponse(id: string){
    return this.http.get<any>(APIURL.URL + APIURL.ActualResponseTimeOverThread + id).
        pipe(catchError(err=> {return throwError(err)}),first());    
  }
  GetAverageResponseVsThread(id: string){
    return this.http.get<ChartDataSetModel>(APIURL.URL + APIURL.AverageResponseTimeOverThread + id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }
  
  GetPercentile(id: string){
    return this.http.get<ChartDataSetModel>(APIURL.URL+ APIURL.Percentile + id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }

  GetAverageResponseVsTime(id: string){
    return this.http.get<ChartDataSetModel>(APIURL.URL+ APIURL.AverageResponseOverTime + id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }
  
  GetActualResponseVsTime(id: string){
    return this.http.get<ChartDataSetModel>(APIURL.URL+ APIURL.ActualResponseTimeOverTime + id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }

  GetAllResults(){
    return this.http.get<AllTestRunModel[]>(APIURL.URL+"all-results").
        pipe(catchError(err=> {return throwError(err)}), first());
  }

  GetFile(id : string){
    return this.http.get<TestRunModel>(APIURL.URL+"testrun/"+id).
        pipe(catchError(err=> {return throwError(err)}), first());
  }
}
