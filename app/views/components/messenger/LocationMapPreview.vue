<template>
  <div
    class="loc-map relative overflow-hidden rounded-none bg-[#cfdce8] dark:bg-[#15202b]"
    :style="{ height: height + 'px', minHeight: height + 'px' }"
  >
    <!-- Tile mosaic (imgs don't need CORS; static-map APIs often fail) -->
    <div
      class="absolute"
      :style="tileLayerStyle"
      aria-hidden="true"
    >
      <img
        v-for="t in tiles"
        :key="t.key"
        :src="t.src"
        alt=""
        class="absolute block"
        :style="{ left: t.left + 'px', top: t.top + 'px', width: '256px', height: '256px' }"
        draggable="false"
        @load="onTileLoad"
        @error="onTileError"
      />
    </div>

    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
      <div class="loc-pin">
        <svg class="w-9 h-9" viewBox="0 0 24 24" fill="#e53935">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
        </svg>
      </div>
    </div>

    <div
      v-if="!anyTileReady"
      class="absolute inset-0 z-[1] bg-gradient-to-br from-[#d7e4ef] to-[#b8c9d8] dark:from-[#1a2734] dark:to-[#0f1822]"
    />
  </div>
</template>

<script>
import { osmTileGrid } from './geolocation';

export default {
  name: 'LocationMapPreview',
  props: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    height: { type: Number, default: 168 },
    zoom: { type: Number, default: 15 },
  },
  data() {
    return {
      loaded: 0,
      failed: 0,
    };
  },
  computed: {
    grid() {
      if (!Number.isFinite(this.lat) || !Number.isFinite(this.lng)) return null;
      return osmTileGrid(this.lat, this.lng, { zoom: this.zoom });
    },
    tiles() {
      return this.grid?.tiles || [];
    },
    tileLayerStyle() {
      const g = this.grid;
      if (!g) return {};
      return {
        width: `${g.width}px`,
        height: `${g.height}px`,
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${g.offsetX}px), calc(-50% + ${g.offsetY}px))`,
      };
    },
    anyTileReady() {
      return this.loaded > 0;
    },
  },
  watch: {
    lat() { this.reset(); },
    lng() { this.reset(); },
    zoom() { this.reset(); },
  },
  methods: {
    reset() {
      this.loaded = 0;
      this.failed = 0;
    },
    onTileLoad() {
      this.loaded += 1;
    },
    onTileError() {
      this.failed += 1;
    },
  },
};
</script>

<style scoped>
.loc-pin {
  transform: translateY(-12px);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
}
</style>
