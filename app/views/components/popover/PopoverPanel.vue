<template>
    <transition name="fade">
        <div v-if="popover?.isOpen" ref="panel"
            :class="[positionClass]">
            <slot></slot>
            <!-- <span class="absolute w-3 h-3 rotate-45 bg-white -z-10" :class="arrowClass"></span> -->
        </div>
    </transition>
</template>

<script>
export default {
    name: "PopoverPanel",
    inject: ['popover'],
    props: {
        horizontal: {
            type: String,
            default: 'start', // start | end
        },
        vertical: {
            type: String,
            default: 'auto', // top | bottom | auto
        },
    },
    data() {
        return {
            actualVertical: 'bottom',
        };
    },
    computed: {
        positionClass() {
            const horizontalMap = {
                start: 'start-0',
                end: 'end-0',
            };
            const verticalMap = {
                top: 'bottom-full mb-2',
                bottom: 'top-full mt-2',
            };
            return `${horizontalMap[this.horizontal]} ${verticalMap[this.actualVertical]}`;
        },
        arrowClass() {
            const verticalMap = {
                top: 'bottom-[-6px]',
                bottom: 'top-[-6px]',
            };
            const horizontalMap = {
                start: 'start-4',
                end: 'end-4',
            };
            return `${ verticalMap[this.actualVertical] } ${ horizontalMap[this.horizontal] || 'start-4' }`;
        },
    },
    mounted() {
        if (!this.popover) {
            console.warn('Popover inject is undefined! Check component nesting and provide.');
            return;
        }

        if (this.vertical === 'auto') {
            this.$nextTick(() => {
                this.setVerticalAuto();
            });
        } else {
            this.actualVertical = this.vertical;
        }
    },
    methods: {
        setVerticalAuto() {
            if (!this.popover || !this.popover.$el || !this.$refs.panel) {
                // اگه هنوز کامپوننت ها آماده نیستند، از ادامه جلوگیری کن
                return;
            }

            const triggerRect = this.popover.$el.querySelector('button')?.getBoundingClientRect();
            const panelRect = this.$refs.panel.getBoundingClientRect();
            if (!triggerRect || !panelRect) return;

            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            if (spaceBelow < panelRect.height && spaceAbove > panelRect.height) {
                this.actualVertical = 'top';
            } else {
                this.actualVertical = 'bottom';
            }
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>