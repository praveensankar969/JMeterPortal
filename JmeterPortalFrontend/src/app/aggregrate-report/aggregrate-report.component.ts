import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AggregrateReport } from '../Models/aggregrate-report-model';
import { HttpService } from '../Services/http.service';

@Component({
  selector: 'app-aggregrate-report',
  templateUrl: './aggregrate-report.component.html',
  styleUrls: ['./aggregrate-report.component.css'],
})
export class AggregrateReportComponent implements OnInit {
  id: string = '';
  timeRangeMin: string = '';
  timeMin: number = 0;
  timeRangeMax: string = '';
  timeMax: number = 0;
  execStartTime: string = '';
  execEndTime: string = '';
  filtered: boolean = false;
  dataloading: boolean = false;
  data: AggregrateReport[] = [];
  labelSearch: string = '';
  selectedItem: string[] = [];
  labelsView: string[] = [];
  labels: string[] = [];
  reportGenerated = false;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private service: HttpService
  ) {
    this.route.params.subscribe((res) => {
      this.id = res['id'];
    });
  }

  ngOnInit(): void {
    this.dataloading = true;
    this.service.GetPercentile(this.id).subscribe(
      (res) => {
        this.labels = res.labels;
        this.labelsView = this.labels;
        this.dataloading = false;
      },
      (err) => {
        this.dataloading = false;
      }
    );
    this.service.GetTimeInterval(this.id).subscribe((res) => {
      this.timeMin = res[0];
      this.timeMax = res[1];
      let params = new HttpParams();
      params = params.append('start', res[0]);
      params = params.append('end', res[1]);
      let date = new Date(res[0]);
      this.timeRangeMin =
        date.getFullYear() +
        '-' +
        this.formatDate(date.getMonth() + 1) +
        '-' +
        this.formatDate(date.getDate()) +
        'T' +
        this.formatDate(date.getHours()) +
        ':' +
        this.formatDate(date.getMinutes());
      date = new Date(res[1]);
      this.timeRangeMax =
        date.getFullYear() +
        '-' +
        this.formatDate(date.getMonth() + 1) +
        '-' +
        this.formatDate(date.getDate()) +
        'T' +
        this.formatDate(date.getHours()) +
        ':' +
        this.formatDate(date.getMinutes());
    });
  }

  GenerateReport() {
    let params = new HttpParams();
    let start = new Date(this.execStartTime).getTime();
    let end = new Date(this.execEndTime).getTime();
    if (!isNaN(start)) {
      if (start >= this.timeMin && start <= this.timeMax) {
        params = params.append('start', start);
      }
    }
    if (!isNaN(end)) {
      if (end <= this.timeMax && end >= this.timeMin) {
        params = params.append('end', end);
      }
    }
    this.filtered = true;
    this.service
      .GetReport(this.id, this.selectedItem, params)
      .subscribe((res) => {
        this.data = res;
        console.log(res)
        this.reportGenerated = true;
      });
  }

  private formatDate(nmbr: number): string {
    var date = nmbr + '';
    date = date.length < 2 ? '0' + date : date;
    return date;
  }

  ClearFilter() {
    this.spinner.show();
    this.filtered = false;
    this.execStartTime = '';
    this.execEndTime = '';
    this.spinner.hide();
  }

  SelectMultiple(event: Event) {
    let val = event.target as HTMLInputElement;
    if (val.checked) {
      this.selectedItem.push(val.id);
    } else {
      this.selectedItem = this.selectedItem.filter((x) => x != val.id);
    }
  }

  ClearLabelFilter() {
    this.labelSearch = '';
    this.filtered = false;
    this.selectedItem = [];
  }

  SelectAll(event: Event) {
    let val = event.target as HTMLInputElement;
    if (val.checked) {
      this.filtered = true;
      this.selectedItem = this.labels;
      for (let i = 0; i < this.labels.length; i++) {
        let inputEl = document.getElementById(
          this.labels[i]
        ) as HTMLInputElement;
        inputEl.checked = true;
      }
    } else {
      this.filtered = false;
      this.selectedItem = [];
      for (let i = 0; i < this.labels.length; i++) {
        let inputEl = document.getElementById(
          this.labels[i]
        ) as HTMLInputElement;
        inputEl.checked = false;
      }
    }
  }

  SearchLabel() {
    if (this.labelSearch.length == 0) {
      this.labelsView = this.labels;
    } else {
      let filtered = this.labelsView.filter(
        (x) => x.toLowerCase().indexOf(this.labelSearch) > -1
      );
      this.labelsView = filtered;
    }
  }

  FilterLabel() {
    let selected = this.selectedItem;
    this.filtered = true;
  }
}
