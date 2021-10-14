import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { AllTestRunModel } from '../Models/all-testruns-model';
import { HttpService } from '../Services/http.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-testrun',
  templateUrl: './testrun.component.html',
  styleUrls: ['./testrun.component.css']
})
export class TestrunComponent implements OnInit {

  @Input() testRunData!: AllTestRunModel;

  constructor(public router: Router, private fileService: HttpService, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
  }

  Flip(event: Event) {
    var btn = event.target as HTMLButtonElement;
    var cardParent = btn.parentElement?.parentElement?.parentElement?.firstElementChild;
    cardParent?.classList.toggle("flipped");
    btn.classList.toggle("s_arrow_rotate");
  }

  DownloadFile() {
    this.fileService.GetFile(this.testRunData.id).pipe(first()).subscribe(res => {
      saveAs(new Blob([atob(res.fileStreamData)], { type: 'text/csv' }), res.fileName + ".csv")
    });
  }

}
