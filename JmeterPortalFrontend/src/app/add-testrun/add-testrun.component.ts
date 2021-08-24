import { Component, OnInit } from '@angular/core';
import { FileuploadService } from '../fileupload.service';

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
  constructor(private uploadService: FileuploadService) { }

  ngOnInit(): void {
  }

  OnUploadFile(event: Event) {
    if((event.target as HTMLInputElement).files){
      let files = (event.target as HTMLInputElement).files;
      if(files){
        this.file =files[0];
      }
    }  
  }

  Upload(){
    this.testName = "Sample Test";
    this.testRunID = "Test Run Id-1"
    this.environment = "Runway";
    this.fileName = this.file.name;
    this.fileUploadDate = new Date();
    let base64String = "";
    let reader = new FileReader();
    
    reader.onload = ()=>{
      base64String = reader.result!.toString();
      this.uploadService.UploadFile( {
        testName : this.testName,
        testRunID : this.testRunID,
        environment : this.environment,
        fileName : this.fileName,
        fileUploadDate : this.fileUploadDate,
        fileStreamDataBase64 : base64String
      }).subscribe(res=> console.log(res));
    }
    reader.readAsDataURL(this.file);
    
  }

}
