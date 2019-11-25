import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSearchRouting } from './user-search.routing';
import { UserSearchComponent } from './user-search.component';
// import { AppHttp } from '../../app.service';
import { HttpModule }from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    UserSearchRouting,
    HttpModule
    ],
  declarations: [UserSearchComponent],
  providers: []
})
export class UserSearchModule { }
