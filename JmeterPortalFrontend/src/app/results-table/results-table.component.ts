import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AllTestRunModel } from '../Models/all-testruns-model';
import { HttpService } from '../Services/http.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {

  testRuns!: AllTestRunModel[];
  testRunsView = this.testRuns;
  viewRuns = this.testRuns;
  dataLoaded: boolean = false;
  total: number = 0;
  startIndex = 0;
  perPage = 8;
  currentPage = 1;
  endIndex = 8;
  selectedField: string = "";
  filterFields = false;
  selectedValue = "";
  filtered = false;

  constructor(private fileService: HttpService, public router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fileService.GetAllResults().pipe(map(res=> {
      return res.sort((x,y)=> new Date(y.fileUploadDate).getTime() - new Date(x.fileUploadDate).getTime())
    })).subscribe(res => {
      this.testRuns = res;
      this.dataLoaded = true;
      this.total = res.length;
      this.Paging(this.testRuns);
      this.spinner.hide();
    });

  }

  SearchInput() {
    let prop = this.selectedField;
    let res: AllTestRunModel[];
    if (prop != "fileUploadDate") {
      res = this.testRuns.filter((x: any) => x[prop].toLowerCase().includes(this.selectedValue.toLowerCase()));
    }
    else {
      res = this.testRuns.filter(x => new Date(x.fileUploadDate) >= new Date(this.selectedValue));
    }
    if (res.length > 0) {
      this.filtered = true;
      this.testRunsView = res;
      this.startIndex = 0;
      this.endIndex = this.perPage;
      this.total = this.testRunsView.length;
      this.Paging(this.testRunsView);
    }

  }

  ClearFilter() {
    this.selectedField = "";
    this.selectedValue = "";
    this.filtered = false;
    this.total = this.testRuns.length;
    this.Paging(this.testRuns);
  }

  Paging(testRuns : AllTestRunModel[]) {
    this.viewRuns = testRuns.slice(this.startIndex, this.endIndex);
  }

  NextPage() {
    this.currentPage++;
    this.startIndex = this.endIndex;
    this.endIndex = this.currentPage * this.perPage;
    if(!this.filtered){
      this.Paging(this.testRuns);
    }
    else{
      this.Paging(this.testRunsView);
    }
  }

  PreviousPage() {
    this.currentPage--;
    this.startIndex -= this.perPage;
    this.endIndex = this.currentPage * this.perPage;
    if(!this.filtered){
      this.Paging(this.testRuns);
    }
    else{
      this.Paging(this.testRunsView);
    }
  }

}
