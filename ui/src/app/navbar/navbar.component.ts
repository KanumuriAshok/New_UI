import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) {}
  username = '';
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }

  logout() {
    this.username = null;
    localStorage.setItem('isUserLoggedId', '0');
    localStorage.setItem('username', '');
    localStorage.removeItem('isUserLoggedId');
    localStorage.removeItem('username');
    localStorage.removeItem('usernamelogin');
    localStorage.removeItem('city_name');
    localStorage.removeItem('pn_number');
    this.router.navigate(['login']);
  }
}
