<template>

    <div v-if="visible" class="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl">

        <div class="course-status-ribbon" :class="ribbonClass">

            <span class="course-status-ribbon__text">{{ label }}</span>

        </div>

    </div>

</template>



<script>

const RIBBON_STATUSES = ['presale', 'upcoming', 'archive'];



const RIBBON_CLASSES = {

    presale: 'course-status-ribbon--presale',

    upcoming: 'course-status-ribbon--upcoming',

    archive: 'course-status-ribbon--archive',

};



export default {

    props: {

        status: {

            type: [Object, String],

            default: null,

        },

    },

    computed: {

        statusSlug() {

            if (this.status && typeof this.status === 'object') {

                return this.status.english_title || this.status.slug || null;

            }

            return null;

        },

        label() {

            if (this.status && typeof this.status === 'object') {

                return this.status.title || '';

            }

            if (typeof this.status === 'string') {

                return this.status;

            }

            return '';

        },

        visible() {

            return Boolean(this.label && this.statusSlug && RIBBON_STATUSES.includes(this.statusSlug));

        },

        ribbonClass() {

            return RIBBON_CLASSES[this.statusSlug] || 'course-status-ribbon--presale';

        },

    },

};

</script>



<style scoped>

.course-status-ribbon {

    position: absolute;

    bottom: 0;

    inset-inline-start: 0;

    width: 5.5rem;

    height: 5.5rem;

    overflow: hidden;

    pointer-events: none;

}



.course-status-ribbon__text {

    position: absolute;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 9rem;

    min-height: 1.5rem;

    padding: 0.45rem 0.75rem;

    font-size: 0.6875rem;

    font-weight: 700;

    line-height: 1;

    text-align: center;

    color: #fff;

    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28);

    bottom: 1.35rem;

    inset-inline-start: -2.35rem;

    transform-origin: center center;

    transform: rotate(45deg);

    white-space: nowrap;

}



[dir='rtl'] .course-status-ribbon__text {

    transform: rotate(-45deg);

}



.course-status-ribbon--presale .course-status-ribbon__text {

    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);

}



.course-status-ribbon--upcoming .course-status-ribbon__text {

    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);

}



.course-status-ribbon--archive .course-status-ribbon__text {

    background: linear-gradient(135deg, #64748b 0%, #475569 100%);

}

</style>

