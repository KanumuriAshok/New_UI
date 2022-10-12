import { Component, OnInit, AfterViewInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css'],
})
export class ManageProjectComponent implements OnInit {
  map: any;
  someHTML: any;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit(): void {}
}
