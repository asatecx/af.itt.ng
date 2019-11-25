import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleRouting } from './sample.routing';
import { SampleComponent } from './sample.component';

@NgModule({
  imports: [
    CommonModule,
    SampleRouting,
    ],
  declarations: [SampleComponent],
  providers: []
})
export class SampleModule { }
