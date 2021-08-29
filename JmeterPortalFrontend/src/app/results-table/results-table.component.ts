import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selectedField : string="";
  filterFields = false;
  selectedValue = "";
  filtered = false;
 
  constructor(private fileService : FileService, public router : Router) { }

  ngOnInit(): void {
    this.sub = this.fileService.GetAllResults().subscribe(res=> {
      this.testRuns = res;
      this.dataLoaded = true;
      this.total = res.length;
      this.Paging();
    });
    
  }

  SearchInput(){
    let prop =this.selectedField;
    let res : AllTestRunModel[];
    if(prop !="fileUploadDate"){
      res = this.testRuns.filter((x : any)=> x[prop].includes(this.selectedValue));
    }
    else{
      res = this.testRuns.filter(x => new Date(x.fileUploadDate) >= new Date(this.selectedValue));
    }
    if(res.length>1){
      this.filtered = true;
      this.viewRuns = res;
    }  
    else{

    }
  }

  ClearFilter(){
    this.selectedField = "";
    this.selectedValue = "";
    this.filtered = false;
    this.Paging();
  }

  Paging(){
    console.log(this.startIndex);
    console.log(this.endIndex)
    this.viewRuns = this.testRuns.slice(this.startIndex, this.endIndex);
  }

  NextPage(){
    this.currentPage++;
    this.startIndex = this.endIndex;
    this.endIndex =this.currentPage * this.perPage;
    this.Paging();
  }

  PreviousPage(){
    this.currentPage--;
    this.startIndex -= this.perPage;
    this.endIndex =this.currentPage * this.perPage;
    this.Paging();
  }

  OnClick(id: string){
    console.log(id);
    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    
  }


}
