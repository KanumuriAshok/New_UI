import { Component, Input, ChangeDetectorRef } from '@angular/core';
import Projection from 'ol/proj/Projection';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { transform } from 'ol/proj';
import { Drag } from './Drag';
import { Draw, Modify } from 'ol/interaction';
import { View, Feature, Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import GML from 'ol/format/GML';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
@Component({
  selector: 'app-ol-map-wms-layer-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class OlMapWmsLayerEditorComponent {
  projection: Projection;
  map = null;
  @Input() configs: any;
  constructor(
    private httpClient: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  drawInt = null;
  modifyInt = null;
  dragInt = null;
  editingLayer: any = null;
  editingWfsLayer = null;
  editingLayers: Array<any> = [];
  editorStarted = false;
  tmpLayerName = null;
  loaderGifPath = 'assets/Loader.gif';
  loading = true;
  savedFeatues = [];
  attributes: Array<any> = [];
  showAttributePanel = false;
  currentEditFeature: any = null;
  setMap(map) {
    this.map = map;
    proj4.defs(
      'EPSG:900913',
      '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
    );
    register(proj4);
    setTimeout(() => this.refreshLayers(), 2000);
  }

  refreshLayers() {
    this.editingLayers = [];
    let layers = this.map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('type') == 'wms') {
        this.editingLayers.push({
          name: layers[i].get('name'),
          fullName: layers[i].get('full-name'),
          modelName: layers[i].get('model-name'),
          geometryType: layers[i].get('geometry-type'),
        });
      }
    }
  }

  getGeomCoords(geom, geomType) {}

  async saveFeatures() {
    let feats = this.editingWfsLayer.getSource().getFeatures();
    let editedFeats = [];
    for (let i = 0; i < feats.length; i++) {
      if (feats[i].get('action')) {
        editedFeats.push(feats[i]);
      }
    }
    if (editedFeats.length > 0) {
      const getXml = function (feat, layer_) {
        switch (feat.get('action')) {
          case 'add':
            return '';
          case 'modify':
            let props_ = '';
            let geomType = feat.getGeometry().getType();
            let geomCoords = [];

            let format = new GML({
              //featureNS: 'http://www.census.gov',
              // featurePrefix: 'tiger',
              //featureType: 'tiger:tiger_roads',
              srsName: 'urn:ogc:def:crs:EPSG::27700',
            });

            feat.getGeometry().transform('EPSG:3857', 'EPSG:27700');
            var gml3 = format.writeGeometry(feat.getGeometry(), {
              dataProjection: 'EPSG:27700',
              featureProjection: 'urn:ogc:def:crs:EPSG::27700',
              rightHanded: false,
            });
            props_ += `<wfs:Property><wfs:Name>geom</wfs:Name><wfs:Value>${gml3}</wfs:Value></wfs:Property>`;
            let featProps_ = feat.getProperties();
            for (var k in featProps_) {
              if (k == 'geometry') {
              } else if (k == 'action') {
                continue;
              } else {
                props_ += `<wfs:Property><wfs:Name>${k}</wfs:Name><wfs:Value>${
                  featProps_[k] ? featProps_[k] : ''
                }</wfs:Value></wfs:Property>`;
              }
            }
            let xml_ = `<wfs:Transaction service="WFS" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd"><wfs:Update typeName="${layer_}">${props_}<ogc:Filter><ogc:FeatureId fid="${
              feat.getId().split('.')[1]
            }"/></ogc:Filter></wfs:Update></wfs:Transaction>`;
            return xml_;
          case 'removed':
            return `<wfs:Transaction service="WFS" version="1.0.0"
          xmlns:cdf="http://www.opengis.net/cite/data"
          xmlns:ogc="http://www.opengis.net/ogc"
          xmlns:wfs="http://www.opengis.net/wfs"
          xmlns:topp="http://www.openplans.org/topp">
          <wfs:Delete typeName="${layer_}">
            <ogc:Filter>
              <ogc:FeatureId fid="${feat.getId().split('.')[1]}"/>
            </ogc:Filter>
          </wfs:Delete>
        </wfs:Transaction>`;
          default:
            return null;
        }
      };
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'text/xml', //<- To SEND XML
          Accept: 'text/xml,text/html, application/xhtml+xml, */*',
          'Response-Type': 'text/xml', //<- b/c Angular understands text
        }),
        responseType: 'text',
      };

      /*let url_ = this.configs.geoserverUrl.replace(
        'http://',
        `http://admin:geoserver@`
      );*/
      //console.log(url_);
      for (let j = 0; j < editedFeats.length; j++) {
        let resp_ = await fetch(`${this.configs.geoserverUrl}/wfs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml', //<- To SEND XML
            Accept: 'text/xml,text/html, application/xhtml+xml, */*',
            'Response-Type': 'text/xml', //<- b/c Angular understands text,
            Authorization: 'Basic ' + btoa('admin:geoserver'),
          },
          mode: 'no-cors',
          body: getXml(editedFeats[j], this.editingLayer.fullName),
        });
        debugger;
        let d = await resp_.status;
        console.log(d);
        console.log(resp_);
        /*
        this.httpClient
          .post(
            `${url_}/wfs`,
            getXml(editedFeats[j], this.editingLayer.fullName),
            {
              headers: new HttpHeaders({
                'Content-Type': 'text/xml', //<- To SEND XML
                Accept: 'text/xml,text/html, application/xhtml+xml,',
                'Response-Type': 'text/xml', //<- b/c Angular understands text
              }),
              responseType: 'text',
            }
          )
          .subscribe((res) => {
            this.savedFeatues.push(1);
            if (editedFeats.length == this.savedFeatues.length) {
              alert('save completed');
              this.switchStartInteractions(null);
              let layers = this.map.getLayers().getArray();
              for (let i = 0; i < layers.length; i++) {
                if (layers[i].get('full-name') == this.tmpLayerName) {
                  layers[i].set('full-name', this.editingLayer.fullName);
                  layers[i].set('name', this.editingLayer.name);
                  layers[i].set('visible', true);
                  layers[i].getSource().updateParams({ time: Date.now() });
                }
              }
              this.editingWfsLayer.getSource().clear();
              this.editingWfsLayer = null;
              this.tmpLayerName = null;
              this.attributes = [];
              this.currentEditFeature = null;
              this.map.removeLayer(this.editingWfsLayer);
              this.map.updateSize({});
            }
          });*/
      }

      alert('save completed');
      this.switchStartInteractions(null);
      let layers = this.map.getLayers().getArray();
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].get('full-name') == this.tmpLayerName) {
          layers[i].set('full-name', this.editingLayer.fullName);
          layers[i].set('name', this.editingLayer.name);
          layers[i].set('visible', true);
          layers[i].getSource().updateParams({ time: Date.now() });
        }
      }
      this.editingWfsLayer.getSource().clear();
      this.editingWfsLayer = null;
      this.tmpLayerName = null;
      this.attributes = [];
      this.currentEditFeature = null;
      this.map.removeLayer(this.editingWfsLayer);
      this.map.updateSize({});
      this.editorStarted = false;
    }
  }

  startEndEditing() {
    if (!this.editorStarted) {
      this.editorStarted = true;
    }

    if (this.editorStarted) {
      const image = new CircleStyle({
        radius: 3,
        fill: null,
        stroke: new Stroke({ color: 'red', width: 3 }),
      });

      const styles = {
        Point: new Style({
          image: image,
        }),
        LineString: new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        MultiLineString: new Style({
          stroke: new Stroke({
            color: 'green',
            width: 1,
          }),
        }),
        MultiPoint: new Style({
          image: image,
        }),
        MultiPolygon: new Style({
          stroke: new Stroke({
            color: 'yellow',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)',
          }),
        }),
        Polygon: new Style({
          stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
        GeometryCollection: new Style({
          stroke: new Stroke({
            color: 'magenta',
            width: 2,
          }),
          fill: new Fill({
            color: 'magenta',
          }),
          image: new CircleStyle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
              color: 'magenta',
            }),
          }),
        }),
        Circle: new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255,0,0,0.2)',
          }),
        }),
      };

      const styleFunction = function (feature) {
        if (feature.get('action') == 'removed') {
          return null;
        }
        return styles[feature.getGeometry().getType()];
      };

      //get geojson data --start
      let url_ = `${this.configs.geoserverUrl}/${
        this.editingLayer.fullName.split(':')[0]
      }/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${
        this.editingLayer.fullName
      }&outputFormat=application/json&srsName=EPSG:900913`;

      this.editingWfsLayer = new VectorLayer({
        style: styleFunction,
        source: new VectorSource({
          format: new GeoJSON(),
          url: url_,
        }),
      });
      //get geojson data --end

      //get layer attributes data --start

      let url2_ = `${this.configs.geoserverUrl}/wfs?version=1.3.0&request=describeFeatureType&outputFormat=application/json&service=WFS&typeName=${this.editingLayer.fullName}`;
      this.httpClient.get(url2_).subscribe((res: any) => {
        this.attributes = res.featureTypes[0].properties;
      });

      //get layer attributes data --end
      this.editingWfsLayer.set('name', this.editingLayer.fullName);
      this.editingWfsLayer.set('model-name', this.editingLayer.modelName);
      this.editingWfsLayer.set('type', 'wfs');
      this.editingWfsLayer.set('full-name', this.editingLayer.fullName);
      this.editingWfsLayer.set('geometry-type', this.editingLayer.geometryType);
      this.editingWfsLayer.set('visible', true);
      //turn off current wms layer while editing
      this.tmpLayerName =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
      var that = this;
      this.map.getLayers().forEach(function (layer) {
        if (layer.get('full-name') == that.editingLayer.fullName) {
          layer.set('full-name', that.tmpLayerName);
          layer.set('name', that.tmpLayerName);
          layer.set('visible', false);
          that.map.updateSize();
        }
      });
      this.map.addLayer(this.editingWfsLayer);
    } else {
      //save edited features start
      this.saveFeatures();
      //end edited features start
    }
    this.map.updateSize();
  }
  onLayerChange(event) {
    this.editingLayer = this.editingLayers[event.target.selectedIndex - 1];
  }
  forEachFeatureAtPixel(a, b) {}
  updateSize(d) {}
  deleteFeatureOnMapClick(evt) {
    var that = this;
    this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      let remove_ = confirm('Do you want to remove this feature?');
      if (remove_) {
        if (feature.get('action') == 'new') {
          layer.getSource().removeFeature(feature);
        } else {
          feature.set('action', 'removed');
        }
        that.updateSize({});
      }
    });
  }
  addFeatureMode() {}
  editFeatureMode() {}
  dragFeatureMode() {}
  removeFeatureMode() {}
  drawEndEvent(e) {
    e.feature.set('action', 'new');

    this.currentEditFeature = e.feature;
    this.showAttributePanel = true;
  }
  modifyEndEvent(e) {
    if (
      e.features.getArray().length > 0 &&
      e.features.getArray()[0].get('action') != 'new'
    ) {
      e.features.getArray()[0].set('action', 'modify');
    }
  }
  parentComponent = null;
  modifystart(e) {
    if (
      e.features.getArray().length > 0 &&
      e.features.getArray()[0].get('action') != 'new'
    ) {
      e.features.getArray()[0].set('action', 'modify');
    }
    if (
      !this.parentComponent.currentEditFeature ||
      this.parentComponent.currentEditFeature.getId() !=
        e.features.getArray()[0].getId()
    ) {
      this.parentComponent.showAttributePanel = true;
      this.parentComponent.currentEditFeature = e.features.getArray()[0];
      this.parentComponent.changeDetectorRef.detectChanges();
    }
  }
  dragEndEvent(e) {}
  updateFeature(e, prop_) {
    let props_ = this.currentEditFeature.getProperties();
    props_[prop_] = e.target.value;
    this.currentEditFeature.setProperties(props_);
  }
  switchStartInteractions(type_) {
    if (this.drawInt) {
      this.map.removeInteraction(this.drawInt);
      this.drawInt.un('drawend', this.drawEndEvent);
      this.drawInt = null;
    }
    if (this.modifyInt) {
      this.map.removeInteraction(this.modifyInt);
      this.modifyInt.un('modifyend', this.modifyEndEvent);
      this.modifyInt.un('modifystart', this.modifystart);
      this.modifyInt.parentComponent = null;
      this.modifyInt = null;
    }
    if (this.dragInt) {
      this.map.removeInteraction(this.dragInt);
      this.dragInt = null;
    }
    this.map.un('singleclick', this.deleteFeatureOnMapClick);
    if (type_) {
      switch (type_) {
        case 'add':
          this.drawInt = new Draw({
            source: this.editingWfsLayer.getSource(),
            type: this.editingLayer.geometryType,
          });
          this.drawInt.on('drawend', this.drawEndEvent);
          this.map.addInteraction(this.drawInt);
          break;
        case 'modify':
          this.modifyInt = new Modify({
            source: this.editingWfsLayer.getSource(),
          });
          this.modifyInt.on('modifyend', this.modifyEndEvent);
          this.modifyInt.on('modifystart', this.modifystart);
          this.map.addInteraction(this.modifyInt);
          this.modifyInt.parentComponent = this;
          break;
        case 'drag':
          this.dragInt = new Drag();
          this.map.addInteraction(this.dragInt);
          break;
        case 'remove':
          this.map.on('singleclick', this.deleteFeatureOnMapClick);
          break;
      }
    }
  }
}
