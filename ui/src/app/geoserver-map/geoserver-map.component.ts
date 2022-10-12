import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
// import * as geojson from 'geojson';
import WMSCapabilities from 'wms-capabilities';

import 'leaflet-geoserver-request';
import { GisfileuploadfireService } from '../gisfileuploadfire.service';
@Component({
  selector: 'app-geoserver-map',
  templateUrl: './geoserver-map.component.html',
  styleUrls: ['./geoserver-map.component.css'],
})
export class GeoserverMapComponent implements OnInit {
  baseMapObj = {};
  CLS: string = 'NODE_1647202549:sample_flask_cluster_output';
  map: any;
  dataJSON: any;
  layerArry = ['SAMPLE_DATA_TWO_234:sample_flask'];
  loadingData = false;
  constructor(
    private dataShare: GisfileuploadfireService,
    private http: HttpClient
  ) {
    this.dataShare.data$.subscribe((res) => {
      console.log(res);
      if (res) {
        res['table_name'].forEach((element) => {
          this.x(res['workspace_name'] + ':' + 'sample_flask_' + element);
          console.log(res['workspace_name'] + ':' + 'sample_flask_' + element);
        });
      }
    });

    this.dataShare.nodeBoundary$.subscribe((res) => {
      if (res) this.x(res['workspace'] + ':' + res['sample_flask']);
      // }
    });
  }

  ngOnInit(): void {
    this.addmaptoInterface();
    // this.wmsLayes("UAT_1:sample_flask_cluster_output_1")
    this.map.on('click', (e) => {
      let LAAT = e;
      var X = Math.trunc(this.map.layerPointToContainerPoint(e.layerPoint).x);
      var Y = Math.trunc(this.map.layerPointToContainerPoint(e.layerPoint).y);

      // console.log(e.latlng())
      console.log(this.map.getBounds());
      // e.latlng()
      var sw = this.map.options.crs.project(
        this.map.getBounds().getSouthWest()
      );
      var ne = this.map.options.crs.project(
        this.map.getBounds().getNorthEast()
      );
      var BBOX = sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y;
      var WIDTH = this.map.getSize().x;
      var HEIGHT = this.map.getSize().y;
      console.log(WIDTH);
      console.log(HEIGHT);
      console.log(BBOX);
      // -60118.851818977884,7023773.519754961,-59761.1504131746,7024282.900888765
      //   this.http.get("http://localhost:8080/geoserver/wms?&INFO_FORMAT=application/json&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&SERVICE=WMS&VERSION=1.1.1&WIDTH="+WIDTH+"&HEIGHT="+HEIGHT+"&X="+X+"&Y="+Y+"&BBOX=496841.25,370088.96875,497990.03125,370718.625&LAYERS=cite:dp_clip&QUERY_LAYERS=cite:dp_clip&TYPENAME=cite:dp_clip")

      http: this.http
        .get(
          '/geoserver/wms/?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&layers=' +
            this.CLS +
            '&BBOX=-60118.851818977884,7023773.519754961,-59761.1504131746,7024282.900888765&FEATURE_COUNT=1&info_format=application/json&HEIGHT=' +
            HEIGHT +
            '&WIDTH=' +
            WIDTH +
            '&query_layers=' +
            this.CLS +
            '&SRS=EPSG%3A27700&buffer=15&X=' +
            X +
            '&Y=' +
            Y
        )
        .subscribe((res) => {
          console.log(res);

          L.popup()
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .setContent(
              `
      <p>GIS ToolID: ${res['features'][0]['properties']['gistool_id']}<p>
      <p>Cluster ID: ${res['features'][0]['properties']['cluster_id']}<p>

      `
            )
            .openOn(this.map);

          this.dataShare.passGIStoolid(
            res['features'][0]['properties']['gistool_id']
          );
        });
    });
  }

  x(data) {
    this.loadingData = true;
    this.wmsLayes(data);
  }
  addmaptoInterface() {
    this.map = L.map('map').fitBounds([
      [1.48275, 103.581653],
      [1.16647, 104.134244],
    ]);
    //this.map.options.minZoom = 12;
    this.map.options.maxZoom = 24;
    var osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 24,
        maxNativeZoom: 23,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    osm.addTo(this.map);
  }

  wmsLayes(layer) {
    console.log(layer);
    var wms = L.Geoserver.wms('/geoserver/wms', {
      layers: layer,
      maxZoom: 24,
      maxNativeZoom: 23,
    });
    console.log(wms);
    wms.addTo(this.map);
    this.http
      .get('/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities', {
        responseType: 'text',
      })
      .subscribe(
        (response: any) => {
          //next() callback
          console.log('response received');
          // For convert the xml to JSON
          const json = new WMSCapabilities(response).toJSON();

          // GetCapabilities provides all the layers so we need to filter the required one.
          const layers = json?.Capability?.Layer?.Layer;
          const layer_ = layers?.filter((l) => l.Name === layer)[0];

          // To get the bounding box of the layer
          const bbox = layer_?.LatLonBoundingBox;

          // Use this bounding box to zoom to the layer,
          this.map.fitBounds([
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]],
          ]);
        },
        (error) => {
          //error() callback
          console.error('Request failed with error');
        },
        () => {
          //complete() callback
          console.error('Request completed'); //This is actually not needed
        }
      );
    // console.log(wms.getBounds())

    // var baseMaps = {
    //   x: wms,
    // };
    // L.control.layers(baseMaps).addTo(this.map);
  }
}

// http:///geoserver/wms?&INFO_FORMAT=application/json&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&SERVICE=WMS&VERSION=1.1.1&WIDTH=770&HEIGHT=485&X=522&Y=341&BBOX=496841.25,370088.96875,497990.03125,370718.625&LAYERS=OUT_LAYER_1:sample_flask_cluster_output&QUERY_LAYERS=OUT_LAYER_1:sample_flask_cluster_output&TYPENAME=OUT_LAYER_1:sample_flask_cluster_output
