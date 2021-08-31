import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestRun } from './test-run';
import { catchError, first} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TestRunModel } from './testrun-model';
import { AllTestRunModel } from './all-testruns-model';

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
    return this.http.get<TestRunModel>(this.API_URL+id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }

  GetAllResults(){
    return this.http.get<AllTestRunModel[]>(this.API_URL+"all-results").
        pipe(catchError(err=> {return throwError(err)}), first());
  }
}
