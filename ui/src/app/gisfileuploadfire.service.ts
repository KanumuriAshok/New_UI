import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GisfileuploadfireService {
  private data = new BehaviorSubject('');
  private toolid = new BehaviorSubject('');
  private nodeBoundary = new BehaviorSubject('');

  data$ = this.data.asObservable();
  toolid$ = this.toolid.asObservable();
  nodeBoundary$ = this.nodeBoundary.asObservable();
  constructor() { }

  changeData(data: any) {
    console.log(data)
    this.data.next(data)
  }

  passGIStoolid(toolid: any) {
    console.log(toolid)
    this.toolid.next(toolid)
  }

  sharenodeBoundary(nodeBoundary: any) {
    console.log(nodeBoundary)
    this.nodeBoundary.next(nodeBoundary)
  }
}
