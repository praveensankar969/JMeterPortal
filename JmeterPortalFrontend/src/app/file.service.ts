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

  constructor(private http: HttpClient) { }

  UploadFile(data : TestRun){
    console.log(data)
    return this.http.post<number>("https://localhost:5001/Portal/add-testrun", data).
        pipe(catchError(err=> {return throwError(err)}), first());
  }

  GetWithId(id: string){
    return this.http.get<TestRunModel>("https://localhost:5001/portal/"+id).
        pipe(catchError(err=> {return throwError(err)}), first());    
  }

  GetAllResults(){
    return this.http.get<AllTestRunModel[]>("https://localhost:5001/portal/all-results").
        pipe(catchError(err=> {return throwError(err)}), first());
  }
}
