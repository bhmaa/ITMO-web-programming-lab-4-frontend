import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {ResultsComponent} from "../components/results/results.component";
import {RegisterComponent} from "../components/register/register.component";
import {AuthGuard} from "../guard/auth.guard";

const routes: Routes = [
  {path: 'results', component: ResultsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: RegisterComponent},
  {path: '**', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
