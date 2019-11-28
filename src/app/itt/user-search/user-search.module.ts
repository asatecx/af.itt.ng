import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSearchRouting } from './user-search.routing';
import { UserSearchComponent } from './user-search.component';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    UserSearchRouting,
    TableModule,
    // AppModule,
    ],
  declarations: [UserSearchComponent],
  providers: []
})
export class UserSearchModule { }
