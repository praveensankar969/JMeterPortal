import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestrunComponent } from './add-testrun/add-testrun.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { ResultsTableComponent } from './results-table/results-table.component';

const routes: Routes = [
  {path : "", component : HomeViewComponent},
  {path : "add-test-run-result", component : AddTestrunComponent},
  {path : "view-test-run-results", component : ResultsTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
