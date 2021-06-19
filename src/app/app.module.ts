import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  DxAutocompleteModule} from 'devextreme-angular';
import { Configuration } from './app.constant';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxAutocompleteModule,
    DxTemplateModule,
  ],
  providers: [Configuration],
  bootstrap: [AppComponent]
})
export class AppModule { }
