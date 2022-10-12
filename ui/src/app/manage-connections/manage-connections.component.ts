import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-manage-connections',
  templateUrl: './manage-connections.component.html',
  styleUrls: ['./manage-connections.component.css'],
})
export class ManageConnectionsComponent implements OnInit {
  map: any;
  someHTML: any;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

}
