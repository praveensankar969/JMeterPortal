import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllTestRunModel } from '../Models/all-testruns-model';

@Component({
  selector: 'app-testrun',
  templateUrl: './testrun.component.html',
  styleUrls: ['./testrun.component.css']
})
export class TestrunComponent implements OnInit {

  @Input() testRunData!: AllTestRunModel;
  
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  Flip(event: Event){
    var btn = event.target as HTMLButtonElement;
    var cardParent = btn.parentElement?.parentElement?.parentElement?.firstElementChild;
    cardParent?.classList.toggle("flipped");
    btn.classList.toggle("s_arrow_rotate");
  }

}
