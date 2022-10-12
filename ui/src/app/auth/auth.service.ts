import { Injectable } from '@angular/core';
//import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {
  //constructor(public jwtHelper: JwtHelperService) {}
  constructor() {}
  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    return (
      localStorage.getItem('isUserLoggedId') != null &&
      localStorage.getItem('isUserLoggedId') == '1'
    ); //!this.jwtHelper.isTokenExpired(token);
  }
}
