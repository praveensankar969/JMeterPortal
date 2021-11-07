import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { AggregrateReportComponent } from './aggregrate-report/aggregrate-report.component';
import { FileReaderComponent } from './file-reader/file-reader.component';
import { ResultsTableComponent } from './results-table/results-table.component';

const routes: Routes = [
  {path : "", component : ResultsTableComponent},
  {path : "add-test-run-result", component : AddTestrunComponent},
  {path : "view-result/:id", component : FileReaderComponent},
  {path : "aggregratereport/:id", component : AggregrateReportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
