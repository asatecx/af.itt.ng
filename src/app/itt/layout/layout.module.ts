import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {layoutRoutes} from './layout.routes';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule, AccordionModule, GrowlModule, TooltipModule} from 'primeng/primeng';
// import {MyGoTopModule} from '../itt/components/my-gotop/my-gotop';
import {LayoutService} from './layout.service';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(layoutRoutes),
    SharedModule,        //  peimrNG 手风琴
    AccordionModule,     //  peimrNG 手风琴
    GrowlModule,         //  peimrNG msg提示
    TooltipModule,       //  Tooltip 提示
    // MyGoTopModule,       //  回到顶部组件
  ],
  exports: [],
  declarations: [
    LayoutComponent,
  ],
  providers: [
    LayoutService,

  ],
})
export class LayoutModule {
}
