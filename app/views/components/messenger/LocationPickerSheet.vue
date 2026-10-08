<template>
  <BottomSheetDrawer
    :model-value="open"
    :draggable="false"
    :fit-content="false"
    :initial-height="0.82"
    :min-height="0.65"
    :max-height="0.95"
    :auto-close-on-min="false"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="p-0 overflow-hidden flex flex-col h-full"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="flex flex-col h-full min-h-0">
      <!-- Compact icon header -->
      <div class="flex items-center gap-2 px-3 pt-1 pb-2 flex-shrink-0">
        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 active:scale-95 transition"
          :aria-label="$t('messenger.cancel')"
          :title="$t('messenger.cancel')"
          @click="$emit('close')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex-1 flex items-center justify-center gap-2 min-w-0">
          <span class="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(230,126,34,0.12)] text-[#e67e22] flex-shrink-0">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21.2s6.5-5.35 6.5-10.4A6.5 6.5 0 0012 4.3a6.5 6.5 0 00-6.5 6.5c0 5.05 6.5 10.4 6.5 10.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <circle cx="12" cy="10.8" r="2.15" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </span>
          <span
            v-if="coordsLabel"
            class="text-[12px] font-medium text-gray-500 dark:text-gray-400 font-mono truncate"
            dir="ltr"
          >{{ coordsLabel }}</span>
        </div>

        <button
          type="button"
          class="w-9 h-9 flex items-center justify-center rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white shadow-sm active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canSend"
          :title="$t('messenger.sendLocation')"
          :aria-label="$t('messenger.sendLocation')"
          @click="confirm"
        >
          <svg class="w-[17px] h-[17px] rtl:-scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
          </svg>
        </button>
      </div>

      <!-- Map -->
      <div class="relative flex-1 min-h-[260px] bg-[#dbe7f0] dark:bg-[#0e1621] rounded-t-xl overflow-hidden mx-2 mb-2">
        <div ref="mapEl" class="absolute inset-0 z-0" />

        <!-- Fixed center pin -->
        <div class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div class="relative -mt-6 flex flex-col items-center">
            <svg
              class="w-9 h-9 text-[#e53935] drop-shadow-lg transition-transform duration-150"
              :class="moving ? 'scale-110 -translate-y-1' : 'scale-100'"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
            </svg>
            <span class="block w-1.5 h-1.5 rounded-full bg-black/30 -mt-0.5" />
          </div>
        </div>

        <!-- My location -->
        <button
          type="button"
          class="absolute z-20 bottom-3 end-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md text-[#3390ec] flex items-center justify-center active:scale-95 transition disabled:opacity-50"
          :title="$t('messenger.myLocation')"
          :aria-label="$t('messenger.myLocation')"
          :disabled="gpsBusy"
          @click="goToMyLocation"
        >
          <svg v-if="!gpsBusy" class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          <svg v-else class="w-[18px] h-[18px] animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
          </svg>
        </button>

        <div
          v-if="accuracyLabel"
          class="absolute z-20 bottom-3 start-3 max-w-[55%] px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur text-[10px] font-medium text-gray-500 dark:text-gray-400 shadow-sm truncate"
        >
          {{ accuracyLabel }}
        </div>
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { formatCoords, requestCurrentPosition } from './geolocation';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

const DEFAULT_CENTER = [35.6892, 51.389];
const DEFAULT_ZOOM = 15;

export default {
  name: 'LocationPickerSheet',
  components: { BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
    initialLat: { type: Number, default: null },
    initialLng: { type: Number, default: null },
    initialAccuracy: { type: Number, default: null },
  },
  emits: ['close', 'confirm', 'gps-error'],
  data() {
    return {
      map: null,
      accuracyCircle: null,
      center: {
        lat: Number.isFinite(this.initialLat) ? this.initialLat : DEFAULT_CENTER[0],
        lng: Number.isFinite(this.initialLng) ? this.initialLng : DEFAULT_CENTER[1],
      },
      accuracy: Number.isFinite(this.initialAccuracy) ? this.initialAccuracy : null,
      moving: false,
      gpsBusy: false,
      mapReady: false,
    };
  },
  computed: {
    sheetPanelClass() { return `${MESSENGER_SHEET_PANEL} overflow-hidden`; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    canSend() {
      return Number.isFinite(this.center.lat) && Number.isFinite(this.center.lng);
    },
    coordsLabel() {
      return formatCoords(this.center.lat, this.center.lng);
    },
    accuracyLabel() {
      const a = Number(this.accuracy);
      if (!Number.isFinite(a) || a <= 0) return '';
      const meters = a >= 10 ? Math.round(a) : Math.round(a * 10) / 10;
      return this.$t('messenger.locationAccuracy', { meters });
    },
  },
  watch: {
    open(v) {
      if (v) {
        this.$nextTick(() => this.mountMap());
      } else {
        this.destroyMap();
      }
    },
    initialLat(v) {
      if (!this.open || !this.map) return;
      if (!Number.isFinite(v) || !Number.isFinite(this.initialLng)) return;
      this.center = { lat: v, lng: this.initialLng };
      this.accuracy = Number.isFinite(this.initialAccuracy) ? this.initialAccuracy : null;
      this.map.flyTo([v, this.initialLng], Math.max(this.map.getZoom(), 16), { duration: 0.55 });
      this.drawAccuracy(v, this.initialLng, this.accuracy);
    },
  },
  mounted() {
    if (this.open) this.$nextTick(() => this.mountMap());
  },
  beforeUnmount() {
    this.destroyMap();
  },
  methods: {
    mountMap() {
      if (this.map || !this.$refs.mapEl) return;

      const startLat = Number.isFinite(this.initialLat) ? this.initialLat : this.center.lat;
      const startLng = Number.isFinite(this.initialLng) ? this.initialLng : this.center.lng;
      this.center = { lat: startLat, lng: startLng };
      if (Number.isFinite(this.initialAccuracy)) this.accuracy = this.initialAccuracy;

      this.map = L.map(this.$refs.mapEl, {
        zoomControl: false,
        attributionControl: true,
      }).setView([startLat, startLng], DEFAULT_ZOOM);

      L.control.zoom({ position: 'topright' }).addTo(this.map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
      }).addTo(this.map);

      this.map.on('movestart', () => {
        this.moving = true;
        this.accuracy = null;
        this.clearAccuracyCircle();
      });
      this.map.on('move', this.syncCenterFromMap);
      this.map.on('moveend', () => {
        this.moving = false;
        this.syncCenterFromMap();
      });

      this.mapReady = true;
      this.$nextTick(() => {
        this.map?.invalidateSize();
        this.syncCenterFromMap();
        setTimeout(() => this.map?.invalidateSize(), 280);
        if (!Number.isFinite(this.initialLat) || !Number.isFinite(this.initialLng)) {
          this.goToMyLocation({ silent: true });
        } else {
          this.drawAccuracy(startLat, startLng, this.accuracy);
        }
      });
    },
    destroyMap() {
      if (this.map) {
        this.map.off();
        this.map.remove();
        this.map = null;
      }
      this.accuracyCircle = null;
      this.mapReady = false;
      this.moving = false;
    },
    syncCenterFromMap() {
      if (!this.map) return;
      const c = this.map.getCenter();
      this.center = { lat: c.lat, lng: c.lng };
    },
    clearAccuracyCircle() {
      if (this.accuracyCircle && this.map) {
        this.map.removeLayer(this.accuracyCircle);
      }
      this.accuracyCircle = null;
    },
    drawAccuracy(lat, lng, accuracy) {
      this.clearAccuracyCircle();
      if (!this.map || !Number.isFinite(accuracy) || accuracy <= 0) return;
      this.accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#3390ec',
        fillColor: '#3390ec',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(this.map);
    },
    async goToMyLocation({ silent = false } = {}) {
      if (this.gpsBusy) return;
      this.gpsBusy = true;
      try {
        const pos = await requestCurrentPosition();
        this.center = { lat: pos.lat, lng: pos.lng };
        this.accuracy = pos.accuracy;
        if (this.map) {
          this.map.flyTo([pos.lat, pos.lng], Math.max(this.map.getZoom(), 16), { duration: 0.6 });
          this.drawAccuracy(pos.lat, pos.lng, pos.accuracy);
        }
      } catch (err) {
        if (!silent) this.$emit('gps-error', err);
      } finally {
        this.gpsBusy = false;
      }
    },
    confirm() {
      if (!this.canSend) return;
      this.$emit('confirm', {
        lat: this.center.lat,
        lng: this.center.lng,
        accuracy: this.accuracy,
      });
    },
  },
};
</script>

<style scoped>
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  font: inherit;
  background: #dbe7f0;
  border-radius: 0.75rem;
}
:deep(.leaflet-control-attribution) {
  font-size: 9px;
  max-width: 55%;
  border-radius: 0.5rem 0 0 0;
}
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.12) !important;
  border-radius: 10px !important;
  overflow: hidden;
}
:deep(.leaflet-control-zoom a) {
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px !important;
  color: #3390ec !important;
  background: #fff !important;
}
.dark :deep(.leaflet-control-zoom a) {
  background: #1f2937 !important;
  color: #6ab2f2 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
