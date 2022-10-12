import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-connection',
  templateUrl: './add-edit-connection.component.html',
  styleUrls: ['./add-edit-connection.component.css']
})
export class AddEditConnectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
selectedType: number = 0;

}
