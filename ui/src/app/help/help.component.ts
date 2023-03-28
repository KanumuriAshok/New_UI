import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  helpContent:string;
  constructor() { }

  ngOnInit(): void {
    this.helpContent = sessionStorage.getItem('helpClick');
    console.log("session", sessionStorage.getItem('helpClick'));
  }

}
