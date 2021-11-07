import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { FormsModule} from '@angular/forms';
import { ResultsTableComponent } from './results-table/results-table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent } from './chart/chart.component';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { TestrunComponent } from './testrun/testrun.component';
import { AggregrateReportComponent } from './aggregrate-report/aggregrate-report.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTestrunComponent,
    ResultsTableComponent,
    ChartComponent,
    FileReaderComponent,
    TestrunComponent,
    AggregrateReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
