import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FileService } from '../file.service';

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

  constructor(private uploadService: FileService) { }

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
    this.Clear();
    form.resetForm();
  }

  Clear(){
    this.fileAdded = false;
    this.fileInput.nativeElement.value = "";
  }

  Upload(form : NgForm){
    this.fileName = this.file.name;
    this.fileUploadDate = new Date();
    let base64String = "";
    let reader = new FileReader();
    
    reader.onload = ()=>{
      base64String = reader.result!.toString();
      this.uploadSub = this.uploadService.UploadFile( {
        testName : this.testName,
        testRunID : this.testRunID,
        environment : this.environment,
        fileName : this.fileName,
        fileUploadDate : this.fileUploadDate,
        fileStreamDataBase64 : base64String
      }).pipe(catchError(err=> { 
        this.successStatus = !this.successStatus; return throwError(err)
      })).subscribe(res=> {console.log(res); });
    }
    reader.readAsDataURL(this.file);
    this.showMsg = true;
    this.Reset(form);
    setTimeout(()=> {this.showMsg = false},1500);  
  }

}
