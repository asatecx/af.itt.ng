import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { AppHttp, Messages, Codes, SessionSetting, Resources } from '../../app.service';
// import { DataTableMate } from '../../pf.core/mate/datatablemate';
import * as _ from 'lodash';

// declare var $: any;
// declare var window: any;

@Component({
  selector: 'app-info',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  codes: any = {};
  domains: any[];
  action: string;
  selectedService: any = { movino: false, sample: false, serviceA: false };
  // dataTableMate: DataTableMate = new DataTableMate('', '/portal/v1/noitce/notices', this.http);

  constructor(
    // private http: AppHttp
    ) { }

  filterInfo = {
  };
  /**
   * 初期化
   */
  ngOnInit() {
    alert("here");
  }
}
