import { Component, Input } from '@angular/core';
import Projection from 'ol/proj/Projection';
import WMSCapabilities from 'wms-capabilities';
import { HttpClient } from '@angular/common/http';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-ol-map-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css'],
})
export class OlMapLayersComponent {
  projection: Projection;
  map = null;
  @Input() configs: any;
  capabilites = null;
  constructor(private httpClient: HttpClient) {}
  layerItems = [];
  showPanel = false;

  setMap(map) {
    this.map = map;
    this.reRenderLayers();
  }
  getCapabilities() {
    this.httpClient
      .get(
        `${this.configs.geoserverUrl}/wms?service=wms&version=1.1.1&request=GetCapabilities`,
        {
          responseType: 'text',
        }
      )
      .subscribe(
        (response: any) => {
          // For convert the xml to JSON
          const json = new WMSCapabilities(response).toJSON();

          // GetCapabilities provides all the layers so we need to filter the required one.
          this.capabilites = json?.Capability?.Layer?.Layer;
        },
        (error) => {
          //error() callback
          console.error('Request failed with error');
        },
        () => {}
      );
  }

  reRenderLayers() {
    this.layerItems = [];
    let layers = this.map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('type') == 'wms') {
        this.layerItems.push({
          name: layers[i].get('name'),
          fullName: layers[i].get('full-name'),
        });
      }
    }
  }

  switchLayer(event, layerName) {
    let layers = this.map.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].get('name') == layerName) {
        layers[i].set('visible', event.target.checked);
        this.map.updateSize();
      }
    }
  }

  zoomToLayer(layerName) {
    const layer_ = this.capabilites?.filter((l) => l.Name === layerName)[0];
    if (layer_) {
      // To get the bounding box of the layer
      const bbox = layer_?.LatLonBoundingBox;

      // Use this bounding box to zoom to the layer,
      var countyLimits = transform(bbox, 'EPSG:4326', 'EPSG:900913');
      this.map.getView().setCenter([countyLimits[0], countyLimits[1]]);
      this.map.getView().setZoom(12);

      // this.map.getView().fit(countyLimits, this.map.getSize());
    }
  }

  getDdownloadShapefileUrl(fullLayerName) {
    let arr_ = fullLayerName.split(':');
    let url = `${this.configs.geoserverUrl}/${arr_[0]}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${fullLayerName}&outputFormat=SHAPE-ZIP`;
    return url;
  }
}
