import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { CsvReaderComponent } from './csv-reader/csv-reader.component';
import { ActualResponseChartComponent } from './actual-response-chart/actual-response-chart.component';
import { FormsModule } from '@angular/forms';
import { ActualThreadChartComponent } from './actual-thread-chart/actual-thread-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AddTestrunComponent,
    CsvReaderComponent,
    ActualResponseChartComponent,
    ActualThreadChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
