import { Component, AfterViewInit, Input } from '@angular/core';

import WMSCapabilities from 'wms-capabilities';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-geoserver-layers-delete',
  templateUrl: './geoserver.layers.delete.component.html',
  styleUrls: ['./geoserver.layers.delete.component.css'],
})
export class GeoserverLayersDeleteComponent implements AfterViewInit {
  showModal = false;
  running = false;
  logs = [];
  map = null;
  @Input() configs: any;
  capabilites = null;
  username = null;
  password = null;
  currentDeleteIndex = 0;
  currentLayerDeleteStatus = 'none';
  layers_ = [];
  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit(): void {
    this.getCapabilities();
  }
  setMap(map) {
    this.map = map;
  }
  tryToStart() {
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }
    this.layers_ = this.capabilites?.filter((l) => l.Name.contains('node'));
    if (this.layers_ && this.layers_.length) {
      this.running = true;

      var headers_object = new HttpHeaders();
      //headers_object.append('Content-Type', 'application/json');
      headers_object.append(
        'Authorization',
        'Basic ' + btoa(`${this.username}:${this.password}`)
      );

      const httpOptions = {
        headers: headers_object,
      };
      debugger;
      let layer_ = this.layers_[this.currentDeleteIndex];
      //first delete layer
      this.httpClient
        .delete(`${this.configs.geoserverUrl}/rest/layers/${layer_.Name}.xml`, {
          headers: headers_object,
        })
        .subscribe(
          (response: any) => {
            this.logs.unshift(
              `layer - ${
                this.layers_[this.currentDeleteIndex].Name
              } was successfully deleted`
            );
            this.currentLayerDeleteStatus = 'ok';
          },
          (error) => {
            this.logs.unshift(
              `could not delete layer - ${
                this.layers_[this.currentDeleteIndex].Name
              }`
            );
            this.currentLayerDeleteStatus = 'error';
          },
          () => {
            //try to delete datastore
            if (this.currentLayerDeleteStatus == 'ok') {
              this.httpClient
                .delete(
                  `${this.configs.geoserverUrl}/rest/workspaces/NODE_1654169512436/datastores/user1_sample_flask_aerial_drop?recurse=true`,
                  {
                    headers: headers_object,
                  }
                )
                .subscribe(
                  (response: any) => {
                    this.logs.unshift(
                      `datastore - ${
                        this.layers_[this.currentDeleteIndex].Name
                      } was successfully deleted`
                    );
                  },
                  (error) => {
                    this.logs.unshift(
                      `could not delete datastore - ${
                        this.layers_[this.currentDeleteIndex].Name
                      }`
                    );
                  },
                  () => {
                    //try to delete
                    this.currentLayerDeleteStatus = 'none';
                    this.currentDeleteIndex += 1;
                    if (this.currentDeleteIndex == this.layers_.length) {
                      this.running = false;
                    } else {
                      this.processDelete(headers_object);
                    }
                  }
                );
            } else {
              this.currentLayerDeleteStatus = 'none';
              this.currentDeleteIndex += 1;
              if (this.currentDeleteIndex == this.layers_.length) {
                this.running = false;
              } else {
                this.processDelete(headers_object);
              }
            }
          }
        );
    } else {
      alert('there is no layers to delete');
    }
  }

  processDelete(headers_object) {
    let layer_ = this.layers_[this.currentDeleteIndex];
    //first delete layer
    this.httpClient
      .delete(`${this.configs.geoserverUrl}/rest/layers/${layer_.Name}.xml`, {
        headers: headers_object,
      })
      .subscribe(
        (response: any) => {
          this.logs.unshift(
            `layer - ${
              this.layers_[this.currentDeleteIndex].Name
            } was successfully deleted`
          );
          this.currentLayerDeleteStatus = 'ok';
        },
        (error) => {
          this.logs.unshift(
            `could not delete layer - ${
              this.layers_[this.currentDeleteIndex].Name
            }`
          );
          this.currentLayerDeleteStatus = 'error';
        },
        () => {
          //try to delete datastore
          if (this.currentLayerDeleteStatus == 'ok') {
            this.httpClient
              .delete(
                `${this.configs.geoserverUrl}/rest/workspaces/NODE_1654169512436/datastores/user1_sample_flask_aerial_drop?recurse=true`,
                {
                  headers: headers_object,
                }
              )
              .subscribe(
                (response: any) => {
                  this.logs.unshift(
                    `datastore - ${
                      this.layers_[this.currentDeleteIndex].Name
                    } was successfully deleted`
                  );
                },
                (error) => {
                  this.logs.unshift(
                    `could not delete datastore - ${
                      this.layers_[this.currentDeleteIndex].Name
                    }`
                  );
                },
                () => {
                  //try to delete
                  this.currentLayerDeleteStatus = 'none';
                  this.currentDeleteIndex += 1;
                  if (this.currentDeleteIndex == this.layers_.length) {
                    this.running = false;
                  } else {
                    this.processDelete(headers_object);
                  }
                }
              );
          } else {
            this.currentLayerDeleteStatus = 'none';
            this.currentDeleteIndex += 1;
            if (this.currentDeleteIndex == this.layers_.length) {
              this.running = false;
            } else {
              this.processDelete(headers_object);
            }
          }
        }
      );
  }

  tryToClose() {}
  getCapabilities() {
    var headers_object = new HttpHeaders();
    //headers_object.append('Content-Type', 'application/json');
    headers_object.append(
      'Authorization',
      'Basic ' + btoa(`${this.username}:${this.password}`)
    );
    this.httpClient
      .get(
        `${this.configs.geoserverUrl}/wfs?service=wfs&version=1.1.1&request=GetCapabilities`,
        {
          responseType: 'text',
          //headers: headers_object,
        }
      )
      .subscribe(
        (response: any) => {
          // For convert the xml to JSON
          const json = new WMSCapabilities(response).toJSON();

          // GetCapabilities provides all the layers so we need to filter the required one.
          debugger;
          this.capabilites = json?.Capability?.Layer?.Layer;
        },
        (error) => {
          //error() callback
          console.error('Request failed with error');
        },
        () => {
          //complete
        }
      );
  }
}
