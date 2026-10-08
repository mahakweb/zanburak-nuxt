<template>

    <!-- Mobile: bottom sheet -->

    <BottomSheetDrawer

        v-if="isMobile"

        :model-value="open"

        :draggable="true"

        :fit-content="true"

        :initial-height="0.35"

        :min-height="0.22"

        :max-height="0.75"

        :close-on-backdrop="true"

        backdrop-z-class="z-[2000000010]"

        panel-z-class="z-[2000000020]"

        backdrop-class="zb-player-settings-backdrop"

        panel-class="zb-player-settings-sheet"

        content-class="px-3 pb-5 pt-1 overflow-auto custom-scrollbar"

        @update:model-value="onSheetToggle"

        @close="$emit('close')"

    >

        <PlayerSettingsMenu

            :view="view"

            :is-mobile="true"

            :segments-only="false"

            :qualities="qualities"

            :speeds="speeds"

            :segments="segments"

            :current-quality="currentQuality"

            :current-speed="currentSpeed"

            :current-segment-index="currentSegmentIndex"

            :current-quality-label="currentQualityLabel"

            :current-speed-label="currentSpeedLabel"

            :quality-disabled="qualityDisabled"

            :show-segments-entry="showSegmentsEntry"

            @update:view="$emit('update:view', $event)"

            @select-quality="$emit('select-quality', $event)"

            @select-speed="$emit('select-speed', $event)"

            @select-segment="(...args) => $emit('select-segment', ...args)"

        />

    </BottomSheetDrawer>



    <!-- Desktop (lg+): glass popover on player -->

    <Teleport v-else-if="open && teleportTarget" :to="teleportTarget">

        <div class="zb-player-popover-anchor" :style="anchorStyle">

            <div

                ref="popoverRef"

                class="zb-player-popover"

                :dir="isRtl ? 'rtl' : 'ltr'"

                @click.stop

            >

                <PlayerSettingsMenu

                    :view="segmentsOnly ? 'segments' : view"

                    :is-mobile="false"

                    :segments-only="segmentsOnly"

                    :qualities="qualities"

                    :speeds="speeds"

                    :segments="segments"

                    :current-quality="currentQuality"

                    :current-speed="currentSpeed"

                    :current-segment-index="currentSegmentIndex"

                    :current-quality-label="currentQualityLabel"

                    :current-speed-label="currentSpeedLabel"

                    :quality-disabled="qualityDisabled"

                    :show-segments-entry="!segmentsOnly && showSegmentsEntry"

                    @update:view="$emit('update:view', $event)"

                    @select-quality="$emit('select-quality', $event)"

                    @select-speed="$emit('select-speed', $event)"

                    @select-segment="(...args) => $emit('select-segment', ...args)"

                    @back="$emit('close')"

                />

            </div>

        </div>

    </Teleport>

</template>



<script setup>

import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';

import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';

import PlayerSettingsMenu from '@/views/components/player/PlayerSettingsMenu.vue';



const props = defineProps({

    open: { type: Boolean, default: false },

    view: { type: String, default: 'main' },

    isMobile: { type: Boolean, default: false },

    teleportTarget: { type: [Object, String], default: null },

    anchorRect: { type: Object, default: null },

    segmentsOnly: { type: Boolean, default: false },

    qualities: { type: Array, default: () => [] },

    speeds: { type: Array, default: () => [] },

    segments: { type: Array, default: () => [] },

    currentQuality: { type: [String, Number], default: 'auto' },

    currentSpeed: { type: Number, default: 1 },

    currentSegmentIndex: { type: Number, default: -1 },

    currentQualityLabel: { type: String, default: '' },
    currentSpeedLabel: { type: String, default: '' },
    qualityDisabled: { type: Boolean, default: false },
    showSegmentsEntry: { type: Boolean, default: true },

});



const emit = defineEmits([

    'close',

    'update:view',

    'select-quality',

    'select-speed',

    'select-segment',

    'back',

]);



const popoverRef = ref(null);



const isRtl = computed(() => {

    try {

        return localStorage.getItem('direction') === 'rtl';

    } catch {

        return true;

    }

});



const anchorStyle = computed(() => ({

    position: 'absolute',

    bottom: '3.25rem',

    insetInlineEnd: '0.5rem',

    zIndex: 60,

}));



const onSheetToggle = (val) => {

    if (!val) emit('close');

};



const handleClickOutside = (e) => {

    if (!props.open || props.isMobile) return;

    const el = popoverRef.value;

    if (el && !el.contains(e.target)) {

        const isTrigger = e.target?.closest?.('.zb-settings-btn, .zb-segments-btn');

        if (!isTrigger) emit('close');

    }

};



watch(() => props.open, (val) => {

    if (val && !props.isMobile) {

        nextTick(() => {

            document.addEventListener('click', handleClickOutside, true);

        });

    } else {

        document.removeEventListener('click', handleClickOutside, true);

    }

});



onBeforeUnmount(() => {

    document.removeEventListener('click', handleClickOutside, true);

});

</script>



<style scoped>

.zb-player-popover-anchor {

    pointer-events: none;

}



.zb-player-popover {

    pointer-events: auto;

    min-width: 10.5rem;

}

</style>


