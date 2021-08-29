import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { CsvReaderComponent } from './csv-reader/csv-reader.component';
import { ActualResponseChartComponent } from './actual-response-chart/actual-response-chart.component';
import { FormsModule} from '@angular/forms';
import { ActualThreadChartComponent } from './actual-thread-chart/actual-thread-chart.component';
import { RestimePercentileChartComponent } from './restime-percentile-chart/restime-percentile-chart.component';
import { AverageResponseChartComponent } from './average-response-chart/average-response-chart.component';
import { AverageThreadChartComponent } from './average-thread-chart/average-thread-chart.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    AddTestrunComponent,
    CsvReaderComponent,
    ActualResponseChartComponent,
    ActualThreadChartComponent,
    RestimePercentileChartComponent,
    AverageResponseChartComponent,
    AverageThreadChartComponent,
    HomeViewComponent,
    ResultsTableComponent
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
