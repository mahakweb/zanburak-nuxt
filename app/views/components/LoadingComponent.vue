<template>
    <div
        :class="overlayClasses">
        <div class="bg-white dark:bg-gray-800  p-8 rounded-full shadow-lg shadow-yellow-400">
            <orbit-spinner :animation-duration="600" :size="55" color="#ff1d5e" />
        </div>
    </div>
</template>

<script>
// To use minified css and js files instead of .vue single file components:
// import 'epic-spinners/dist/lib/epic-spinners.min.css'
// import {AtomSpinner} from 'epic-spinners/dist/lib/epic-spinners.min.js'

// import { AtomSpinner } from "epic-spinners";
import { OrbitSpinner } from 'epic-spinners'
// document.documentElement.classList.add('overflow-y-hidden')
export default {
    inheritAttrs: false,
    components: {
        // AtomSpinner,
        OrbitSpinner,
    },
    props: {
        /** When true, covers the viewport (login, auth, etc.). Default covers the nearest positioned ancestor. */
        fullscreen: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        overlayClasses() {
            return [
                this.fullscreen ? 'fixed' : 'absolute',
                'select-none inset-0 z-50 flex items-center justify-center bg-center bg-cover bg-no-repeat backdrop-blur-sm',
                this.$attrs.class,
            ];
        },
    },
};
</script>
