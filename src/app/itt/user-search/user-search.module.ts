import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserSearchRouting } from './user-search.routing';
import { UserSearchComponent } from './user-search.component';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserSearchRouting,
    TableModule,
    FieldsetModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    PanelModule,
    ],
  declarations: [UserSearchComponent],
  providers: []
})
export class UserSearchModule { }
