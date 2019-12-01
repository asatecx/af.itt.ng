import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppHttp } from '../../app.service';
import { DataTableMate } from '../../shared/utils/datatablemate';

import * as _ from 'lodash';

// declare var $: any;
// declare var window: any;
interface Authority {
  code: string;
  name: string;
}
@Component({
  selector: 'user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {

  authority: Authority[];
  selectedCity2: Authority;
  domains: any[];
  dataTableMate: DataTableMate = new DataTableMate('http://localhost:8080', '/UserSearch', this.http);
  filterInfo: any = {};

  constructor(
    private http: AppHttp
    ) {
      this.authority = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
    ];
    }

    /**
   * 初期化
   */
  ngOnInit() {
    
  }

  search(){
  this.dataTableMate.first = 0;
    this.dataTableMate.filterInfo = Object.assign({}, this.filterInfo);
    this.dataTableMate.loadData();
  }
}
