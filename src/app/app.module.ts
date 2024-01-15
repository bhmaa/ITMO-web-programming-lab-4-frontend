import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ResultsComponent} from "./components/results/results.component";
import {RegisterComponent} from "./components/register/register.component";
import {TableComponent} from "./components/table/table.component";
import {HitsService} from "./services/hits.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MenuComponent} from "./components/menu/menu.component";
import {CoordinatesFormComponent} from "./components/coordinates-form/coordinates-form.component";
import {CanvasComponent} from "./components/canvas/canvas.component";
import {FooterComponent} from "./components/footer/footer.component";

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    RegisterComponent,
    TableComponent,
    MenuComponent,
    CoordinatesFormComponent,
    CanvasComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HitsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
