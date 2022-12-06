import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm: FormGroup;
  registerFormGoogle: FormGroup;
  registerFormHld: FormGroup;
  changePasswordForm: FormGroup;
  registerUserType = 'google_manager'; //hld_designer,google_manager
  projects = [];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private httpClient: HttpClient
  ) {}
  //apiUrl = '/api/dashboard';
  users = [
    { username: 'user1', password: '123' },
    { username: 'user2', password: '123' },
    { username: 'user3', password: '123' },
  ];
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      userType: ['google_manager'],
      rememberMe: [false],
    });
    this.registerFormGoogle = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      cityName: ['', [Validators.required]],
    });

    this.changePasswordForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      old_pass: ['', [Validators.required, Validators.minLength(3)]],
      new_pass: ['', [Validators.required, Validators.minLength(3)]],
      c_pass: ['', [Validators.required, Validators.minLength(3)]],
      submitted: false,
      success: false,
      error_text: '',
    });

    this.registerFormHld = this.formBuilder.group({
      projectName: [null, [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      scheme: ['', [Validators.required]],
    });
  }
  onSignUpTypeChange() {
    if (this.registerUserType == 'hld_designer') {
      if (!this.projects || this.projects.length == 0) {
        this.getProjects();
      }
    }
  }

  get f() {
    return this.loginForm.controls;
  }
  login() {
    if (this.loginForm.value.userType == 'google_manager') {
      this.loginGoogle();
    } else {
      this.loginHld();
    }
  }
  loginGoogle() {
    this.submitted = true;
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    const formData = new FormData();
    formData.append('city_name', username);
    formData.append('password', password);
    this.httpClient
      .post(environment.api + `/api/city_register_login`, formData)
      .subscribe(
        (res) => {
          if (res['success'] == true) {
            localStorage.setItem('isUserLoggedId', '1');
            localStorage.setItem('username', username);
            this.router.navigate(['dashboard/workflow/google']);
          } else {
            alert(res['message']);
            return;
          }
        },
        (err) => {
          alert('something went wrong, try later!!');
          return;
        },
        () => {}
      );
  }
  loginHld() {
    this.submitted = true;
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    this.httpClient
      .post(environment.api + '/api/login', {
        username: username, //---todo: check how to pass for city_register_login
        password: password,
      })
      .subscribe(
        (res) => {
          console.log(res);
          if (res['success'] == true) {
            localStorage.setItem('isUserLoggedId', '1');
            localStorage.setItem('username', username);
            var user_type = 'hld_designer';
            let usertype = localStorage.setItem('usertype', user_type);
            console.log(usertype);
            this.router.navigate(['dashboard']);
          } else {
            alert(res['message']);
            return;
          }
        },
        (err) => {
          alert('something went wrong, try later!!');
          return;
        },
        () => {}
      );
  }

  getProjects() {
    this.httpClient.get('/api/directory_list').subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.projects = res.data;
        }
      },
      (err) => {
        alert(
          'something went wrong on getting city names (endpoint: directory_list), try later!!'
        );
        return;
      },
      () => {}
    );
  }

  register() {
    if (this.registerUserType == 'google_manager') {
      this.registerGoogle();
    } else {
      this.registerHld();
    }
  }
  registerGoogle() {
    this.submitted = true;

    let username = this.registerFormGoogle.value.username;
    let cityName = this.registerFormGoogle.value.cityName;
    let password = this.registerFormGoogle.value.password;
    // let scheme = this.registerFormGoogle.value.scheme;
    const formData = new FormData();
    formData.append('city_name', cityName);
    formData.append('username', username);
    formData.append('password', password);
    this.httpClient
      .post(environment.api + '/api/city_register', formData)
      .subscribe(
        (res) => {
          alert(res['message']);
        },
        (err) => {
          alert('something went wrong, try later!!');
          return;
        },
        () => {}
      );
  }

  registerHld() {
    this.submitted = true;

    let projectName = this.registerFormHld.value.projectName;
    let username = this.registerFormHld.value.username;
    let password = this.registerFormHld.value.password;
    let scheme = this.registerFormHld.value.scheme;
    this.httpClient
      .post('/api/register', {
        username: username,
        password: password,
        schemaname: scheme,
      })
      .subscribe(
        (res) => {
          if (res['success'] == true) {
            const formData = new FormData();
            formData.append('comp_select', projectName);
            formData.append('username', username);
            this.httpClient
              .post('/api/directory_list_submit', formData, {
                headers: {
                  Accept: 'text/xml,text/html, application/xhtml+xml, */*',
                  'Response-Type': 'text/xml', //<- b/c Angular understands text,
                },
              })
              .subscribe(
                (res2) => {
                  this.httpClient
                    .post(
                      '/api/dashboard',
                      {
                        username: username,
                      },
                      {
                        headers: new HttpHeaders({
                          'Content-Type': 'text/xml', //<- To SEND XML
                          Accept:
                            'text/xml,text/html, application/xhtml+xml, */*',
                          'Response-Type': 'text/xml', //<- b/c Angular understands text
                        }),
                        responseType: 'text',
                      }
                    )
                    .subscribe(
                      (res3) => {
                        alert(res['message']);
                      },
                      (err3) => {
                        alert(
                          'something went wrong, Could not create folder!!'
                        );
                        return;
                      },
                      () => {}
                    );

                  alert('user created successfully');
                },
                (err) => {
                  alert('something went wrong, Could not submit directory!!');
                  return;
                },
                () => {}
              );
          } else {
            alert(res['message']);
          }
        },
        (err) => {
          alert('something went wrong, try later!!');
          return;
        },
        () => {}
      );
  }

  changePassword() {
    //change_password
    /*
     username = request.form.get('username')
            old_pass = request.form.get('old_pass')
            usernameold_passnew_pass = request.form.get('new_pass')
            c_pass = request.form.get('c_pass')
    */

    let username = this.changePasswordForm.value.username;
    let old_pass = this.changePasswordForm.value.old_pass;
    let new_pass = this.changePasswordForm.value.new_pass;
    let c_pass = this.changePasswordForm.value.c_pass;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('old_pass', old_pass);
    formData.append('new_pass', new_pass);
    formData.append('c_pass', c_pass);
    this.httpClient
      .post(environment.api + '/api/change_password', formData)
      .subscribe(
        (res) => {
          this.changePasswordForm.value.success = true;
          this.changePasswordForm.value.error_text = res['message'];
        },
        (err) => {
          this.changePasswordForm.value.error_text = 'Error occured';
          this.changePasswordForm.value.success = false;
          return;
        },
        () => {
          this.changePasswordForm.value.submitted = true;
        }
      );
  }
  onSelectLoginUserType(e) {
    debugger;
  }
}
