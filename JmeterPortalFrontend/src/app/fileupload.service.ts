import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestRun } from './test-run';
import { catchError, first} from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private http: HttpClient) { }

  UploadFile(data : TestRun){
    console.log(data)
    return this.http.post<number>("https://localhost:5001/Portal/add-testrun", data).
        pipe(catchError(err=> {return throwError(err)}), first());;
  }
}
