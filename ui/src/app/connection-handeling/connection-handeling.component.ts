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
  extractExistingStatus = 'none_status'; //success,fail
  missingDemandStatus = 'none_status'; //success,fail
  secondaryPreprocessgpStatus = 'none_status'; //success,fail
  pnBoundaryCheckStatus = 'none'; //success,fail
  exportStatus = 'none_status'; //success,fail
  googleFetchStatus = 'none_status'; //success,fail
  uploadValidatedpolesStatus = 'none_status'; //success,fail
  userType: any;

  sigdisplay = 'none';
  ngOnInit(): void {
    this.userType = localStorage.getItem('usertype');
    console.log(this.userType);
  }

  UploadRefPoint() {
    this.sigdisplay = 'block';
  }
  files = {};
  filesRef = {};
  filesGoogle = {};
  fileValidatedpoles = {};
  filesDropped(event, fileType) {
    this.files[fileType] = event.target.files;
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
    formData.append('username', localStorage.getItem('username'));
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
      () => {}
    );
  }
  extractExisting() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    this.httpClient
      .post(environment.api + '/api/secondary_structures', formData)
      .subscribe(
        (res) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.extractExistingStatus = 'green_status';
          this.missingDemand();
        },
        (err) => {
          console.error(err);
          alert('completed with error');
          this.extractExistingStatus = 'red_status';
          this.loadingLoader = false;
        },
        () => {
          this.loadingLoader = false;
        }
      );
  }
  missingDemand() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    this.httpClient.post(environment.api+'/api/secondary_preprocessdp', formData).subscribe(
      (res) => {
        alert('completed successfully');
        this.loadingLoader = false;
        this.missingDemandStatus = 'green_status';
        // this.export();
      },
      (err) => {
        console.error(err);
        alert(' completed with error');
        this.missingDemandStatus = 'red_status';
      },
      () => {
        this.loadingLoader = false;
      }
    );
  }
  secondaryPreprocessgp() {
    //
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
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
        }
      );
  }
  pnBoundaryCheck() {
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    formData.append('schema', localStorage.getItem('username'));
    this.httpClient
      .post(environment.api + '/api/pnboundary_check', formData)
      .subscribe(
        (res: any) => {
          alert('completed successfully');
          this.loadingLoader = false;
          this.pnBoundaryCheckStatus = res.fedtype;
          this.extractExisting();
        },
        (err) => {
          console.error(err);
          alert(' completed with error');
          this.loadingLoader = false;
          this.pnBoundaryCheckStatus = 'error';
        },
        () => {
          this.loadingLoader = false;
        }
      );
  }

  export() {
    ///
    //

    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
    this.httpClient
      .post(environment.api + '/api/export_output', formData)
      .subscribe(
        (res) => {
          this.httpClient
            .post('/api/download_qgis_files', formData, {
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
        () => {}
      );
  }

  UploadRef() {
    const formData = new FormData();
    this.loadingLoader = true;
    formData.append('username', localStorage.getItem('username'));
    for (var k in this.filesRef) {
      for (let j = 0; j < this.filesRef[k].length; j++) {
        debugger;
        formData.append(k, this.filesRef[k][j]);
      }
    }

    this.httpClient
      .post(environment.api + '/api/ref_point_page', formData)
      .subscribe(
        (res) => {
          alert('upload completed successfully');
          this.uploadRefFilesStatus = 'green_status';
          this.UploadGoogle();
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.uploadRefFilesStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
        }
      );
  }

  UploadGoogle() {
    const formData = new FormData();
    this.loadingLoader = true;
    formData.append('username', localStorage.getItem('username'));
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
        }
      );
  }

  UploadValidatedpoles() {
    ///upload_validatedpoles googlepoles_files
    this.loadingLoader = true;
    const formData = new FormData();
    formData.append('username', localStorage.getItem('username'));
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
        },
        (err) => {
          console.error(err);
          alert(' upload completed with error');
          this.uploadValidatedpolesStatus = 'red_status';
        },
        () => {
          this.loadingLoader = false;
        }
      );
  }
}
