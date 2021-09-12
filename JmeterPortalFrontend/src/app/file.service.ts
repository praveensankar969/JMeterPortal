import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestRun } from './test-run';
import { catchError, first, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TestRunModel } from './testrun-model';
import { AllTestRunModel } from './all-testruns-model';
import { CsvModel } from './csv-model';
import { ActualThreadvResponseData } from './ActualThreadVResponse';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  API_URL="https://localhost:5001/portal/";
  constructor(private http: HttpClient) { }

  UploadFile(data : TestRun){
    console.log(data)
    return this.http.post<number>(this.API_URL+"add-testrun", data).
        pipe(catchError(err=> {return throwError(err)}), first());
  }

  GetWithId(id: string){
    return this.http.get<ActualThreadvResponseData>(this.API_URL+"average-response-over-time-chart/"+id).
        pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }

  GetWithIdOld(id: string){
    return this.http.get<TestRunModel>(this.API_URL+"old/"+id).
        pipe(catchError(err=> {return throwError(err)}), tap(res=> console.log(res)));    
  }

  GetMap(id: string){
    return this.http.get<Map<string, CsvModel[]>>(this.API_URL+"get-map/"+id).
        pipe(catchError(err=> {return throwError(err)})); 
  }

  GetAllResults(){
    return this.http.get<AllTestRunModel[]>(this.API_URL+"all-results").
        pipe(catchError(err=> {return throwError(err)}), first());
  }
}
