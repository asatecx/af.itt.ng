import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { AppHttp } from './app.service';
import {LoginComponent} from './itt/login/login.component';
import {LoginService} from './itt/login/login.service';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AppHttp,
              LoginService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
