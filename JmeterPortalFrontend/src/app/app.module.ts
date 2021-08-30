import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { CsvReaderComponent } from './csv-reader/csv-reader.component';
import { FormsModule} from '@angular/forms';
import { HomeViewComponent } from './home-view/home-view.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTestrunComponent,
    CsvReaderComponent,
    HomeViewComponent,
    ResultsTableComponent,
    ChartComponent,
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
