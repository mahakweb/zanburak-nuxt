<template>
    <component :is="tag" aria-live="polite" class="typewriter-text relative">
        <span v-if="preserveLayout" aria-hidden="true" class="invisible select-none">{{ text }}</span>
        <span :class="{ 'absolute inset-0': preserveLayout }">
            {{ typedText }}<span
                v-if="shouldShowCursor"
                class="typewriter-cursor"
                :class="cursorClass"
                :style="cursorStyle"
                aria-hidden="true"></span>
        </span>
    </component>
</template>

<script>
export default {
    props: {
        /** Text to type out */
        text: {
            type: String,
            required: true,
        },
        /** HTML tag wrapper (h1, p, span, ...) */
        tag: {
            type: String,
            default: "span",
        },
        /** Delay between each character in milliseconds */
        speed: {
            type: Number,
            default: 25,
        },
        /** Whether to repeat typing after finishing */
        repeat: {
            type: Boolean,
            default: true,
        },
        /** Pause before restarting, in milliseconds (only when repeat is true) */
        repeatAfter: {
            type: Number,
            default: 5000,
        },
        /** Show blinking cursor while typing */
        showCursor: {
            type: Boolean,
            default: true,
        },
        /** Hide cursor after typing finishes (when repeat is false) */
        hideCursorOnComplete: {
            type: Boolean,
            default: false,
        },
        /** Cursor color */
        cursorColor: {
            type: String,
            default: "#facc15",
        },
        /** Cursor width in pixels */
        cursorWidth: {
            type: Number,
            default: 3,
        },
        /** Cursor blink interval in milliseconds */
        cursorBlinkSpeed: {
            type: Number,
            default: 700,
        },
        /** Extra CSS classes for the cursor */
        cursorClass: {
            type: String,
            default: "",
        },
        /** Reserve space with invisible full text to prevent layout shift */
        preserveLayout: {
            type: Boolean,
            default: true,
        },
        /** Start typing automatically on mount */
        autoplay: {
            type: Boolean,
            default: true,
        },
        /** Delay before the first typing cycle, in milliseconds */
        startDelay: {
            type: Number,
            default: 0,
        },
    },
    emits: ["complete", "restart"],
    data() {
        return {
            typedText: "",
            typingComplete: false,
            typewriterTimer: null,
            restartTimer: null,
            startTimer: null,
        };
    },
    computed: {
        shouldShowCursor() {
            if (!this.showCursor) {
                return false;
            }

            if (!this.typingComplete) {
                return true;
            }

            if (this.repeat) {
                return true;
            }

            return !this.hideCursorOnComplete;
        },
        cursorStyle() {
            return {
                backgroundColor: this.cursorColor,
                width: `${this.cursorWidth}px`,
                animationDuration: `${this.cursorBlinkSpeed}ms`,
            };
        },
    },
    watch: {
        text: "handleConfigChange",
        speed: "handleConfigChange",
        repeat: "handleConfigChange",
        repeatAfter: "handleConfigChange",
        autoplay(enabled) {
            if (enabled) {
                this.start();
                return;
            }

            this.stop();
        },
    },
    mounted() {
        if (this.autoplay) {
            this.scheduleStart();
        }
    },
    beforeUnmount() {
        this.clearTimers();
    },
    methods: {
        clearTimers() {
            if (this.typewriterTimer) {
                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
            }

            if (this.restartTimer) {
                clearTimeout(this.restartTimer);
                this.restartTimer = null;
            }

            if (this.startTimer) {
                clearTimeout(this.startTimer);
                this.startTimer = null;
            }
        },
        handleConfigChange() {
            if (this.autoplay) {
                this.start();
            }
        },
        scheduleStart() {
            this.clearTimers();
            this.typedText = "";
            this.typingComplete = false;

            if (this.startDelay > 0) {
                this.startTimer = setTimeout(() => this.run(), this.startDelay);
                return;
            }

            this.run();
        },
        start() {
            this.scheduleStart();
        },
        stop() {
            this.clearTimers();
        },
        restart() {
            this.$emit("restart");
            this.run();
        },
        run() {
            let index = 0;
            this.typedText = "";
            this.typingComplete = false;

            this.typewriterTimer = setInterval(() => {
                if (index < this.text.length) {
                    this.typedText += this.text.charAt(index);
                    index += 1;
                    return;
                }

                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
                this.typingComplete = true;
                this.$emit("complete");

                if (this.repeat && this.repeatAfter >= 0) {
                    this.restartTimer = setTimeout(() => this.restart(), this.repeatAfter);
                }
            }, this.speed);
        },
    },
};
</script>

<style scoped>
.typewriter-cursor {
    display: inline-block;
    height: 0.85em;
    margin-inline-start: 3px;
    vertical-align: -0.05em;
    animation: typewriter-blink step-end infinite;
}

@keyframes typewriter-blink {
    50% {
        opacity: 0;
    }
}
</style>
