import {
  Pointer as PointerInteraction,
  defaults as defaultInteractions,
} from 'ol/interaction';
export class Drag extends PointerInteraction {
  coordinate_ = null;
  cursor_ = null;
  previousCursor_ = null;
  feature_ = null;
  constructor() {
    super({
      handleDownEvent: (evt) => {
        const map = evt.map;

        const feature = map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature;
          }
        );

        if (feature) {
          this.coordinate_ = evt.coordinate;
          this.feature_ = feature;
          if (this.feature_.get('action') != 'new') {
            this.feature_.set('action', 'modify');
          }
        }

        return !!feature;
      },
      handleDragEvent: (evt) => {
        const deltaX = evt.coordinate[0] - this.coordinate_[0];
        const deltaY = evt.coordinate[1] - this.coordinate_[1];

        const geometry = this.feature_.getGeometry();
        geometry.translate(deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
      },
      handleMoveEvent: (evt) => {
        if (this.cursor_) {
          const map = evt.map;
          const feature = map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
              return feature;
            }
          );
          const element = evt.map.getTargetElement();
          if (feature) {
            if (element.style.cursor != this.cursor_) {
              this.previousCursor_ = element.style.cursor;
              element.style.cursor = this.cursor_;
            }
          } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
          }
        }
      },
      handleUpEvent: () => {
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
      },
    });

    /**
     * @type {import("../src/ol/coordinate.js").Coordinate}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;
  }
}
