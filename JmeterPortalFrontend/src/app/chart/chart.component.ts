import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, Decimation, registerables } from 'chart.js';
import { ChartDatasets } from '../Models/chart-datasets';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartDataSetModel } from '../Models/chart-dataset-model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APIURL } from '../Models/api_url';
import { catchError, first } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from '../Services/http.service';
import { ChartType } from '../Models/chart-type';

enum Operator {
  greater = 'Greater than',
  lesser = 'Less than',
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() data!: ChartDataSetModel;
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() xAxisType: any = '';
  @Input() xLabel: string = '';
  @Input() yLabel: string = '';
  @Input() pointRadius: number = 1;
  @Input() type: string = '';
  @Input() startTime: string = '';
  @Input() endTime: string = '';

  operatorType: typeof Operator = Operator;
  datasets: ChartDatasets[] = [];
  labels: string[] = [];
  chart!: Chart;
  xAxisLabel: any[] = [];
  FromTimeDD: string = '';
  FromTimeHH: string = '';
  FromTimeMM: string = '';
  FromTimeSS: string = '';
  ToTimeDD: string = '';
  ToTimeHH: string = '';
  ToTimeMM: string = '';
  ToTimeSS: string = '';
  yAxisFilter: number = 0;
  selectedItem: string[] = [];
  labelsView: string[] = [];
  dropdown: boolean = false;
  filtered = false;
  labelSearch = '';
  selectedYAxisOperatorValue = Operator.greater;
  chartType: typeof ChartType = ChartType;

  yFilter = false;
  xFilter = false;
  responseFilterSelected = false;
  timeFilterSelected = false;
  dateTimeStart: string = '';
  dateTimeEnd: string = '';
  resposeTimeCharts = false;

  constructor(
    private router: ActivatedRoute,
    private httpService: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.Fetch();
    if (this.title.includes('Response Time Over Time')) {
      this.resposeTimeCharts = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.data.isFirstChange()){
      this.spinner.show();
      this.yFilter = false;
      this.selectedYAxisOperatorValue = Operator.greater;
      this.yAxisFilter = 0;
      this.xFilter = false;
      this.FromTimeDD = '';
      this.FromTimeHH = '';
      this.FromTimeMM = '';
      this.FromTimeSS = '';
      this.ToTimeDD = '';
      this.ToTimeHH = '';
      this.ToTimeMM = '';
      this.ToTimeSS = '';
      this.labelSearch = '';
      this.filtered = false;
      this.selectedItem = [];
      this.chart.destroy();
      this.Fetch();
      this.spinner.hide();
    }
  }

  Fetch() {
    this.xAxisLabel = this.data.xAxisLabel;
    this.datasets = JSON.parse(JSON.stringify(this.data.datasets));
    this.labels = this.data.labels;
    this.labelsView = this.labels;
    this.CreateChart();
  }

  FilterLabel() {
    this.dropdown = !this.dropdown;
    let selected = this.selectedItem;
    this.chart.data.datasets.forEach(function (ds: any) {
      if (selected.find((x) => x == ds.label) != undefined) {
        ds.hidden = false;
      } else {
        ds.hidden = true;
      }
    });
    this.chart.update();
    this.filtered = true;
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
    this.chart.data.datasets.forEach(function (ds: any) {
      if (ds.hidden) {
        ds.hidden = false;
      }
    });
    this.chart.update();
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

  CreateChart() {
    console.log('Creating chart...' + this.title);
    Chart.register(...registerables);
    Chart.register(zoomPlugin);
    this.chart = new Chart(this.id, {
      type: 'line',
      data: {
        labels: this.xAxisLabel,
        datasets: this.datasets,
      },
      options: {
        animation: false,
        responsive: true,
        datasets: {
          line: {
            pointRadius: this.pointRadius,
          },
        },
        plugins: {
          title: {
            display: true,
            text: this.title,
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
              threshold: 10,
            },
          },
        },
        scales: {
          x: {
            type: this.xAxisType,
            title: {
              text: this.xLabel,
              display: true,
            },
          },
          y0: {
            type: 'linear',
            position: 'left',
            title: {
              text: this.yLabel,
              display: true,
            },
          },
          y: {
            display: false,
          },
        },
      },
    });
  }

  ResetZoom() {
    this.chart.resetZoom();
  }

  ApplyYFilter(clear: boolean = false) {
    this.spinner.show();
    this.labelSearch = '';
    this.filtered = false;
    this.selectedItem = [];
    this.yFilter = true;
    if (clear) {
      this.yFilter = false;
      this.selectedYAxisOperatorValue = Operator.greater;
      this.yAxisFilter = 0;
    }
    this.ConstructRequest();
  }

  ApplyXFilter(clear: boolean = false) {
    this.spinner.show();
    this.labelSearch = '';
    this.filtered = false;
    this.selectedItem = [];
    this.xFilter = true;
    if (clear) {
      this.xFilter = false;
      this.FromTimeDD = '';
      this.FromTimeHH = '';
      this.FromTimeMM = '';
      this.FromTimeSS = '';
      this.ToTimeDD = '';
      this.ToTimeHH = '';
      this.ToTimeMM = '';
      this.ToTimeSS = '';
    }
    this.ConstructRequest();
  }

  ConstructRequest() {
    var regex;
    var fromTime;
    var toTime;
    var fromTimeValid;
    var toTimeValid;
    let start = new Date(this.startTime).getTime();
    let end = new Date(this.endTime).getTime();

    if (this.title == this.chartType.ActualResponseTimeOverTime) {
      regex = new RegExp('^\\d{2}, \\d{2}:\\d{2}:\\d{2}$');
      fromTime =
        this.FromTimeDD +
        ', ' +
        this.FromTimeHH +
        ':' +
        this.FromTimeMM +
        ':' +
        this.FromTimeSS;
      toTime =
        this.ToTimeDD +
        ', ' +
        this.ToTimeHH +
        ':' +
        this.ToTimeMM +
        ':' +
        this.ToTimeSS;
      fromTimeValid = regex.test(fromTime);
      toTimeValid = regex.test(toTime);
    } else if (this.title == this.chartType.AverageResponseTimeOverTime) {
      regex = new RegExp('^\\d{2}, \\d{2}:\\d{2}$');
      fromTime =
        this.FromTimeDD + ', ' + this.FromTimeHH + ':' + this.FromTimeMM;
      toTime = this.ToTimeDD + ', ' + this.ToTimeHH + ':' + this.ToTimeMM;
      fromTimeValid = regex.test(fromTime);
      toTimeValid = regex.test(toTime);
    }

    var id;
    this.router.params.subscribe((res) => (id = res.id));
    let params = new HttpParams();
    if(!isNaN(start)){
      params = params.append('start', start);
    }
    if(!isNaN(end)){
      params = params.append('end', end);
    }
    let op = Object.keys(Operator).filter((x) => !(parseInt(x) >= 0));
    params = params.append(
      'op',
      this.selectedYAxisOperatorValue == Operator.greater ? op[0] : op[1]
    );
    params = params.append('responseTime', this.yAxisFilter);
    if (toTimeValid || fromTimeValid) {
      params = params.append(
        'timeFrom',
        fromTimeValid ? fromTime : this.xAxisLabel[0]
      );
      params = params.append(
        'timeTo',
        toTimeValid ? toTime : this.xAxisLabel[this.xAxisLabel.length - 1]
      );
    }
    let url = APIURL.URL + this.type + id;
    this.httpService
      .get<ChartDataSetModel>(url, { params: params })
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          return throwError(err);
        }),
        first()
      )
      .subscribe((res) => {
        this.chart.destroy();
        this.data = res;
        this.spinner.hide();
        this.Fetch();
      });
  }

  ResponseTimeFilter() {
    this.responseFilterSelected = !this.responseFilterSelected;
    this.timeFilterSelected = false;
  }

  ElapsedTimeFilter() {
    this.timeFilterSelected = !this.timeFilterSelected;
    this.responseFilterSelected = false;
  }

  ClearAllFilter() {
    this.timeFilterSelected = false;
    this.responseFilterSelected = false;
    this.labelSearch = '';
    this.filtered = false;
    this.selectedItem = [];
    var id;
    this.router.params.subscribe((res) => (id = res.id));
    let url = APIURL.URL + this.type + id;
    this.spinner.show();
    this.httpService
      .get<ChartDataSetModel>(url)
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          return throwError(err);
        }),
        first()
      )
      .subscribe((res) => {
        this.chart.destroy();
        this.data = res;
        this.spinner.hide();
        this.Fetch();
      });
  }
}
