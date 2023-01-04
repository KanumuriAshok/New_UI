import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-connection-handeling',
  templateUrl: './connection-handeling.component.html',
  styleUrls: ['./connection-handeling.component.css'],
})
export class ConnectionHandelingComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}
  apiUrl = environment.api + '/api/shape_file_page';
  loadingLoader = false;

  uploadFilesStatus = 'none_status'; //success,fail
  uploadRefFilesStatus = 'none_status'; //success,fail
  uploadSwimsFilesStatus = 'none_status'; //success,fail
  extractExistingStatus = 'none_status'; //success,fail
  missingDemandStatus = 'none_status'; //success,fail
  preprocessCPStatus = 'none_status'; //success,fail
  preprocessDPStatus = 'none_status'; //success,fail
  secondaryPreprocessgpStatus = 'none_status'; //success,fail
  pnBoundaryCheckStatus = 'none'; //success,fail
  exportStatus = 'none_status'; //success,fail
  googleFetchStatus = 'none_status'; //success,fail
  uploadValidatedpolesStatus = 'none_status'; //success,fail
  userType: any;

  // sigdisplay = 'none';
  // opacity = 0;
  // sigdisplay1 = 'none';
  // sigdisplay2 = 'none';
  // sigdisplay3 = 'none';
  // sigdisplay4 = 'none';
  // sigdisplay5 = 'none';

  lastUpdateDates: any = {
    data_fetch: '',
    export: '',
    extract_existing_infrastructure: '',
    google_data_pre_process: '',
    id: 6,
    'message ': 'successfully.',
    missing_demand_infrastructure: '',
    pn_boundry: '',
    pn_boundry_check: '',
    status: 200,
    upload_ref_points: '',
    username: 'pn5',
    validated_poles: '',
    //shape_file_path - not returning
  };

  ngOnInit(): void {
    this.userType = localStorage.getItem('user_type');
    this.loadLastUpdateDates();
    console.log(this.userType);
  }

  // UploadRefPoint() {
  //   this.sigdisplay = 'block';
  // }
  // SwimsData() {
  //   this.sigdisplay1 = 'block';
  // }
  // ValidatedPoles() {
  //   this.sigdisplay2 = 'block';
  // }
  files = {};
  filesSwimsData = {};
  filesRef = {};
  filesGoogle = {};
  fileValidatedpoles = {};
  filesDropped(event, fileType) {
    this.files[fileType] = event.target.files;
  }

  filesSwimsDataDropped(event, fileType) {
    this.filesSwimsData[fileType] = event.target.files;
  }
  
  filesRefDropped(event, fileType) {
    this.filesRef[fileType] = event.target.files;
  }

  filesGoogleDropped(event, fileType) {
    this.filesGoogle[fileType] = event.target.files;
  }

  filesValidatedpoles(event, fileType) {
    this.fileValidatedpoles[fileType] = event.target.files;
  }

  uploadFiles() {
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    for (var k in this.files) {
      for (let j = 0; j < this.files[k].length; j++) {
        formData.append(k, this.files[k][j]);
      }
    }

    this.httpClient.post(environment.api + this.apiUrl, formData).subscribe(
      (res) => {
        alert('upload completed successfully');
        this.uploadFilesStatus = 'green_status';
      },
      (err) => {
        console.error(err);
        alert(' upload completed with error');
        this.uploadFilesStatus = 'red_status';
      },
      () => {
        this.loadLastUpdateDates();
      }
    );
  }
  extractExisting() {
    this.loadingLoader = true;
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + '/api/secondary_structures', formData)
      .subscribe(
        (res) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.extractExistingStatus = 'green_status';
          this.PreprocessCP();
          // this.missingDemand();
        },
        (err) => {
          console.error(err);
          alert('completed with error');
          this.extractExistingStatus = 'red_status';
          this.loadingLoader = false;
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }
  PreprocessCP() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + '/api/secondary_preprocp', formData)
      .subscribe(
        (res) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.preprocessCPStatus = 'green_status';
          this.PreprocessDP();
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.preprocessCPStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }
  PreprocessDP() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + '/api/secondary_preprodp', formData)
      .subscribe(
        (res) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.preprocessDPStatus = 'green_status';
          // this.export();
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.preprocessDPStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }
  // missingDemand() {
  //   this.loadingLoader = true;
  //   const formData = new FormData();
  //   formData.append('username', localStorage.getItem('username'));
  //   this.httpClient
  //     .post(environment.api + '/api/secondary_preprocessdp', formData)
  //     .subscribe(
  //       (res) => {
  //         alert('completed successfully');
  //         this.loadingLoader = false;
  //         this.missingDemandStatus = 'green_status';
  //         // this.export();
  //       },
  //       (err) => {
  //         console.error(err);
  //         alert(' completed with error');
  //         this.missingDemandStatus = 'red_status';
  //       },
  //       () => {
  //         this.loadingLoader = false;
  //         this.loadLastUpdateDates();
  //       }
  //     );
  // }
  secondaryPreprocessgp() {
    //
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + '/api/secondary_preprocessgp', formData)
      .subscribe(
        (res) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.secondaryPreprocessgpStatus = 'green_status';
          this.pnBoundaryCheck();
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.loadingLoader = false;
          this.secondaryPreprocessgpStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }
  pnBoundaryCheck() {
    this.loadingLoader = true;
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    // formData.append('schema', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
    // .post(environment.api + '/api/pnboundary_check', formData)
      .post(environment.api + '/api/secondary_pnb_fed_ug', formData)
      .subscribe(
        (res: any) => {
          console.log(res);
          alert('completed successfully');
          this.loadingLoader = false;
          this.pnBoundaryCheckStatus = res.fedtype;
          // this.pnBoundaryCheckStatus = res.table_name[0];
          this.PreprocessCP();
          // this.extractExisting();
        },
        (err) => {
          console.error(err);
          alert('completed with error');
          this.loadingLoader = false;
          this.pnBoundaryCheckStatus = 'error';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  export() {
    ///
    //

    this.loadingLoader = true;
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + '/api/export_output', formData)
      .subscribe(
        (res) => {
          this.httpClient
            .post(environment.api + '/api/download_qgis_files', formData, {
              responseType: 'arraybuffer',
            })
            .subscribe(
              (res2: any) => {
                let blob = new Blob([res2], { type: 'application/zip' });
                let url = window.URL.createObjectURL(blob);
                //let pwa = window.open(url);
                var a = document.createElement('a');
                document.body.appendChild(a);
                url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = localStorage.getItem('username') + '.zip';
                a.click();
                window.URL.revokeObjectURL(url);

                /*if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                  alert('Please disable your Pop-up blocker and try again.');
                }*/

                alert('completed successfully');
                this.loadingLoader = false;
                this.exportStatus = 'green_status';
                document.body.removeChild(a);
                // this.UploadRefPoint();
              },
              (err2) => {
                console.error(err2);
                alert(' completed with error');
                this.loadingLoader = false;
                this.exportStatus = 'red_status';
                // debugger;
                // this.UploadRefPoint();
              },
              () => {
                this.loadingLoader = false;
              }
            );
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.loadingLoader = false;
          this.exportStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  UploadRef() {
    const formData = new FormData();
    this.loadingLoader = true;
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    for (var k in this.filesRef) {
      for (let j = 0; j < this.filesRef[k].length; j++) {
        formData.append(k, this.filesRef[k][j]);
      }
    }

    this.httpClient
      .post(environment.api + '/api/ref_point_page', formData)
      .subscribe(
        (res) => {
          alert('upload completed successfully');
          this.uploadRefFilesStatus = 'green_status';
          // this.sigdisplay = 'none';
          // this.opacity = 0;
          // this.UploadGoogle();
          // this.UploadValidatedpoles();
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.uploadRefFilesStatus = 'red_status';
          // this.sigdisplay = 'none';
          // this.opacity = 0;
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  UploadRef1() {
    const formData = new FormData();
    this.loadingLoader = true;
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    for (var k in this.filesSwimsData) {
      for (let j = 0; j < this.filesSwimsData[k].length; j++) {
        formData.append(k, this.filesSwimsData[k][j]);
      }
    }

    this.httpClient
      .post(environment.api + '/api/swims_input_data', formData)
      .subscribe(
        (res) => {
          alert('upload completed successfully');
          this.uploadSwimsFilesStatus = 'green_status';
          // this.sigdisplay1 = 'none';
          this.secondaryPreprocessgp();
          // this.UploadGoogle();
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.uploadSwimsFilesStatus = 'red_status';
          // this.sigdisplay1 = 'none';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  UploadGoogle() {
    const formData = new FormData();
    this.loadingLoader = true;
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.loadingLoader = true;
    /*
    for (var k in this.filesGoogle) {
      for (let j = 0; j < this.filesGoogle[k].length; j++) {
        formData.append(k, this.filesGoogle[k][j]);
      }
    }
    */
    this.httpClient
      .post(environment.api + '/api/googleapifetch2', formData)
      .subscribe(
        (res) => {
          alert('upload completed successfully');
          this.googleFetchStatus = 'green_status';
          this.secondaryPreprocessgp();
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.googleFetchStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  UploadValidatedpoles() {
    ///upload_validatedpoles googlepoles_files
    this.loadingLoader = true;
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    for (var k in this.fileValidatedpoles) {
      for (let j = 0; j < this.fileValidatedpoles[k].length; j++) {
        formData.append(k, this.fileValidatedpoles[k][j]);
      }
    }

    this.httpClient
      .post(environment.api + '/api/upload_validatedpoles', formData)
      .subscribe(
        (res) => {
          alert('upload completed successfully');
          this.uploadValidatedpolesStatus = 'green_status';
          // this.sigdisplay2 = 'none';
          
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.uploadValidatedpolesStatus = 'red_status';
          // this.sigdisplay2 = 'none';
        },
        () => {
          this.loadingLoader = false;
          this.loadLastUpdateDates();
        }
      );
  }

  loadLastUpdateDates(): void {
    const formData = new FormData();
    // formData.append('username', localStorage.getItem('username'));
    formData.append('username', localStorage.getItem('usernamelogin'));
    formData.append('city_name', localStorage.getItem('city_name'));
    formData.append('pn_number', localStorage.getItem('pn_number'));
    this.httpClient
      .post(environment.api + `/api/get_model_history`, formData)
      .subscribe(
        (res) => {
          // console.log(res);
          this.lastUpdateDates = res;
        },
        (err) => {
          alert('something went wrong, on getting last execute dates!!');
          return;
        },
        () => {
          // this.loadLastUpdateDates();
        }
      );
  }
}
