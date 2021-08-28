import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllTestRunModel } from '../all-testruns-model';
import { FileService } from '../file.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {

  testRuns! : AllTestRunModel[];
  viewRuns = this.testRuns;
  dataLoaded : boolean = false;
  sub! : Subscription;
  total : number = 0;
  startIndex = 0;
  perPage = 8;
  currentPage = 1;
  endIndex = 8;
  selectedValue="";
 
  constructor(private fileService : FileService) { }

  ngOnInit(): void {
    this.sub = this.fileService.GetAllResults().subscribe(res=> {
      this.testRuns = res;
      this.dataLoaded = true;
      this.total = res.length;
      this.endIndex = this.total;
      this.Paging();
    });
    
  }

  Paging(){
    this.viewRuns = this.testRuns.slice(this.startIndex, this.endIndex);
  }

  NextPage(){
    this.startIndex += this.perPage;
    this.endIndex +=this.perPage;
    this.Paging();
  }

  PreviousPage(){
    this.startIndex -=this.perPage;
    this.endIndex -=this.endIndex;
    this.Paging();
  }

  OnClick(id: string){
    console.log(id);
  }



  ngOnDestroy(): void {
    this.sub.unsubscribe();
    
  }


}
