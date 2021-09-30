import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../Services/http.service';

@Component({
  selector: 'app-add-testrun',
  templateUrl: './add-testrun.component.html',
  styleUrls: ['./add-testrun.component.css']
})
export class AddTestrunComponent implements OnInit {

  testName: string = "";
  testRunID: string = "";
  environment: string = "";
  fileName: string = "";
  fileUploadDate: Date = new Date();
  fileBase64: string = "";
  file: any;
  fileAdded = false;
  showMsg =  false;
  successStatus = true;
  uploadSub! : Subscription;
  @ViewChild('fileInput' , {static :false}) fileInput! :  ElementRef;

  constructor(private uploadService: HttpService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  OnUploadFile(event: Event) {
    this.fileAdded = true;
    if((event.target as HTMLInputElement).files){
      let files = (event.target as HTMLInputElement).files;
      if(files){
        this.file =files[0];
      }
    }  
  }
  Reset(form : NgForm){
    form.resetForm();
    this.fileInput.nativeElement.value = "";
  }

  Upload(form : NgForm){
    this.fileName = this.file.name;
    this.fileUploadDate = new Date();
    let base64String = "";
    let reader = new FileReader();
    this.spinner.show();
    reader.onload = ()=>{
      base64String = reader.result!.toString();
      console.log(base64String)
      this.uploadSub = this.uploadService.UploadFile( {
        testName : this.testName,
        testRunID : this.testRunID,
        environment : this.environment,
        fileName : this.fileName,
        fileUploadDate : this.fileUploadDate,
        fileStreamDataBase64 : base64String
      }).pipe(catchError(err=> { 
        this.successStatus = !this.successStatus; return throwError(err)
      })).subscribe(res=> {this.Reset(form);this.spinner.hide();}, err=> {this.spinner.hide();});
      
    }
    reader.readAsDataURL(this.file);
    this.spinner.hide();
    this.showMsg = true;  
    setTimeout(()=> {this.showMsg = false},3500);  
    
  }

}
