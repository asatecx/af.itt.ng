import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSearchRouting } from './user-search.routing';
import { UserSearchComponent } from './user-search.component';
import { AppHttp } from '../../app.service';
import { AppModule } from '../../app.module';
// import { HttpModule }from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    UserSearchRouting,
    // HttpModule
    // AppModule,
    ],
  declarations: [UserSearchComponent],
  providers: []
})
export class UserSearchModule { }
