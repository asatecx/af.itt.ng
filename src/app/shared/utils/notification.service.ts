import {Injectable} from '@angular/core';

declare var $: any;

@Injectable()
export class NotificationService {

  constructor() {
  }

  smallBox(data, cb?) {
    if (data.timeout == undefined) {
      data.timeout = 3000;
    }
    $.smallBox(data, cb)
  }

  bigBox(data, cb?) {
    $.bigBox(data, cb)
  }

  smartMessageBox(data, cb?) {
    $.SmartMessageBox(data, cb)
  }

}
