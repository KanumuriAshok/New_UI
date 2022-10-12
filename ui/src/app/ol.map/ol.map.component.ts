import {
  Component,
  NgZone,
  AfterViewInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { View, Feature, Map } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import { register } from 'ol/proj/proj4';
import { get as GetProjection } from 'ol/proj';
import { Extent } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM, { ATTRIBUTION } from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import { OlMapLayersComponent } from './layers.component/layers.component';
import { OlMapWmsLayerEditorComponent } from './editor.component/editor.component';
@Component({
  selector: 'app-ol-map',
  templateUrl: './ol.map.component.html',
  styleUrls: ['./ol.map.component.css'],
  //directives: [OlMapLayersComponent]
})
export class OlMapComponent implements OnInit, AfterViewInit {
  configs = {
    geoserverUrl: '/geoserver',
  };
  @ViewChild('mapLayers') mapLayers: OlMapLayersComponent;
  @ViewChild('mapEditor') mapEditor: OlMapWmsLayerEditorComponent;

  @Input() center: Coordinate;
  @Input() zoom: number;
  view: View;
  projection: Projection;
  //extent: Extent = [-16.972197, 49.838197, 9.615234, 60.130564];
  extent: Extent = [-20026376.39, -20048966.1, 20026376.39, 20048966.1];
  Map: Map;
  @Output() mapReady = new EventEmitter<Map>();

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    if (window.location.port == '9090') {
      this.configs.geoserverUrl =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':8080/geoserver';
    }
  }

  ngAfterViewInit(): void {
    if (!this.Map) {
      this.zone.runOutsideAngular(() => this.initMap());
    }
    setTimeout(() => this.mapReady.emit(this.Map));
  }

  private initMap(): void {
    proj4.defs(
      'EPSG:900913',
      '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
    );
    proj4.defs(
      'EPSG:27700',
      '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs '
    );
    register(proj4);
    this.projection = GetProjection('EPSG:900913');
    this.projection.setExtent(this.extent);
    this.view = new View({
      center: this.center,
      zoom: this.zoom,
      projection: this.projection,
    });
    this.Map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({}),
        }),
      ],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([new ScaleLine({})]),
    });
    //this.Map.addLayer(
    //  this.getWmsLayer('NODE_1649919708:node_boundary', 'polygon', 'test')
    //);7
    this.mapLayers.setMap(this.Map);
    this.mapEditor.setMap(this.Map);
  }

  addWmsLayer(fullLayerName, geometryType, modelName) {
    let arr_ = fullLayerName.split(':');
    let fullLayerName_ = '';
    let layerName_ = arr_[1];
    if (layerName_.indexOf(localStorage.getItem('username')) == -1) {
      layerName_ = localStorage.getItem('username') + '_' + layerName_;
    }
    fullLayerName_ = arr_[0] + ':' + layerName_;
    let lyr = new TileLayer({
      source: new TileWMS({
        url: `${this.configs.geoserverUrl}/${arr_[0]}/wms`,
        params: {
          LAYERS: fullLayerName_,
        },
      }),
    });
    lyr.set('name', fullLayerName_);
    lyr.set('model-name', modelName);
    lyr.set('type', 'wms');
    lyr.set('full-name', fullLayerName_);
    lyr.set('geometry-type', geometryType);
    lyr.setVisible(true);
    this.Map.addLayer(lyr);
    this.Map.updateSize();
    this.mapLayers.getCapabilities();
    this.mapLayers.reRenderLayers();
    this.mapEditor.refreshLayers();
  }

  getWmsLayer(fullLayerName, geometryType, modelName) {
    let arr_ = fullLayerName.split(':');
    let lyr = new TileLayer({
      source: new TileWMS({
        url: `${this.configs.geoserverUrl}/${arr_[0]}/wms`,
        params: {
          LAYERS: fullLayerName,
        },
      }),
    });
    lyr.set('name', fullLayerName);
    lyr.set('model-name', modelName);
    lyr.set('type', 'wms');
    lyr.set('full-name', fullLayerName);
    lyr.set('geometry-type', geometryType);
    lyr.setVisible(true);
    return lyr;
  }

  removeLayer(layerName) {
    let layers = this.Map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('name') == layerName) {
        this.Map.removeLayer(layers[i]);
      }
    }
    this.mapLayers.reRenderLayers();
    this.mapEditor.refreshLayers();
  }

  removeLayerByModelName(modelName) {
    let layers = this.Map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('model-name') == modelName) {
        this.Map.removeLayer(layers[i]);
      }
    }
    this.mapLayers.reRenderLayers();
    this.mapEditor.refreshLayers();
    this.Map.updateSize();
  }

  removeAllWmsLayers() {
    let layers = this.Map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('type') == 'wms') {
        this.Map.removeLayer(layers[i]);
      }
    }
    this.mapLayers.reRenderLayers();
    this.mapEditor.refreshLayers();
  }
}
