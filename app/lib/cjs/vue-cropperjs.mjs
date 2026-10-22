/**
 * vue-cropperjs ships Babel CJS (`Object.defineProperty(exports, ...)`) with no
 * "module" field. Vite 8 + optimizeDeps.noDiscovery serves it raw in the browser
 * → `exports is not defined`. This is the upstream ESM source, importing Cropper's
 * real ESM build instead of the UMD "browser" file.
 */
import { h } from 'vue';
import Cropper from 'cropperjs/dist/cropper.esm.js';

function without(obj, keys) {
  const target = {};
  for (const key in obj) {
    if (keys.indexOf(key) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    target[key] = obj[key];
  }
  return target;
}

const previewPropType = typeof window === 'undefined'
  ? [String, Array]
  : [String, Array, Element, NodeList];

export default {
  render() {
    const crossorigin = this.crossorigin || undefined;
    return h('div', { style: this.containerStyle }, [
      h('img', {
        ref: 'img',
        src: this.src,
        alt: this.alt || 'image',
        style: [{ maxWidth: '100%' }, this.imgStyle],
        crossorigin,
      }),
    ]);
  },
  props: {
    containerStyle: Object,
    src: { type: String, default: '' },
    alt: String,
    imgStyle: Object,
    viewMode: Number,
    dragMode: String,
    initialAspectRatio: Number,
    aspectRatio: Number,
    data: Object,
    preview: previewPropType,
    responsive: { type: Boolean, default: true },
    restore: { type: Boolean, default: true },
    checkCrossOrigin: { type: Boolean, default: true },
    checkOrientation: { type: Boolean, default: true },
    crossorigin: { type: String },
    modal: { type: Boolean, default: true },
    guides: { type: Boolean, default: true },
    center: { type: Boolean, default: true },
    highlight: { type: Boolean, default: true },
    background: { type: Boolean, default: true },
    autoCrop: { type: Boolean, default: true },
    autoCropArea: Number,
    movable: { type: Boolean, default: true },
    rotatable: { type: Boolean, default: true },
    scalable: { type: Boolean, default: true },
    zoomable: { type: Boolean, default: true },
    zoomOnTouch: { type: Boolean, default: true },
    zoomOnWheel: { type: Boolean, default: true },
    wheelZoomRatio: Number,
    cropBoxMovable: { type: Boolean, default: true },
    cropBoxResizable: { type: Boolean, default: true },
    toggleDragModeOnDblclick: { type: Boolean, default: true },
    minCanvasWidth: Number,
    minCanvasHeight: Number,
    minCropBoxWidth: Number,
    minCropBoxHeight: Number,
    minContainerWidth: Number,
    minContainerHeight: Number,
    ready: Function,
    cropstart: Function,
    cropmove: Function,
    cropend: Function,
    crop: Function,
    zoom: Function,
  },
  mounted() {
    const data = without(this.$options.props, ['containerStyle', 'src', 'alt', 'imgStyle']);
    const props = {};
    for (const key in data) {
      if (this[key] !== undefined) props[key] = this[key];
    }
    this.cropper = new Cropper(this.$refs.img, props);
  },
  unmounted() {
    this.cropper?.destroy();
    this.cropper = null;
  },
  methods: {
    reset() { return this.cropper.reset(); },
    clear() { return this.cropper.clear(); },
    initCrop() { return this.cropper.crop(); },
    replace(url, onlyColorChanged = false) { return this.cropper.replace(url, onlyColorChanged); },
    enable() { return this.cropper.enable(); },
    disable() { return this.cropper.disable(); },
    destroy() { return this.cropper.destroy(); },
    move(offsetX, offsetY) { return this.cropper.move(offsetX, offsetY); },
    moveTo(x, y = x) { return this.cropper.moveTo(x, y); },
    relativeZoom(ratio, originalEvent) { return this.cropper.zoom(ratio, originalEvent); },
    zoomTo(ratio, originalEvent) { return this.cropper.zoomTo(ratio, originalEvent); },
    rotate(degree) { return this.cropper.rotate(degree); },
    rotateTo(degree) { return this.cropper.rotateTo(degree); },
    scaleX(value) { return this.cropper.scaleX(value); },
    scaleY(value) { return this.cropper.scaleY(value); },
    scale(scaleX, scaleY = scaleX) { return this.cropper.scale(scaleX, scaleY); },
    getData(rounded = false) { return this.cropper.getData(rounded); },
    setData(data) { return this.cropper.setData(data); },
    getContainerData() { return this.cropper.getContainerData(); },
    getImageData() { return this.cropper.getImageData(); },
    getCanvasData() { return this.cropper.getCanvasData(); },
    setCanvasData(data) { return this.cropper.setCanvasData(data); },
    getCropBoxData() { return this.cropper.getCropBoxData(); },
    setCropBoxData(data) { return this.cropper.setCropBoxData(data); },
    getCroppedCanvas(options = {}) { return this.cropper.getCroppedCanvas(options); },
    setAspectRatio(aspectRatio) { return this.cropper.setAspectRatio(aspectRatio); },
    setDragMode(mode) { return this.cropper.setDragMode(mode); },
  },
};
