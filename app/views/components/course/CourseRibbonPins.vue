<template>
    <div
        v-if="items.length"
        class="absolute z-30 top-0 inset-inline-start-0 p-3 flex items-start gap-1.5 pointer-events-none">
        <div
            v-for="item in items"
            :key="item.id"
            class="ribbon-pin pointer-events-auto"
            :class="`ribbon-pin--${item.tone}`"
            :style="{ '--banner-h': item.bannerHeight }"
            tabindex="0"
            role="img"
            :aria-label="item.label"
            :title="item.label">
            <span class="ribbon-pin__body">
                <span class="ribbon-pin__icon">
                    <svg
                        v-if="item.icon === 'presale'"
                        class="ribbon-pin__svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">
                        <path d="M4.2 9.4v5.2h2.7l6.4 3.9V5.5L6.9 9.4H4.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                        <path d="M16.4 8.4a4.6 4.6 0 0 1 0 7.2M18.7 6.4a7.4 7.4 0 0 1 0 11.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                    </svg>
                    <svg
                        v-else-if="item.icon === 'upcoming'"
                        class="ribbon-pin__svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">
                        <circle cx="12" cy="12.2" r="7.4" stroke="currentColor" stroke-width="1.7" />
                        <path d="M12 8.6v4.1l2.8 1.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                        v-else-if="item.icon === 'archive'"
                        class="ribbon-pin__svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">
                        <rect x="3.4" y="3.6" width="17.2" height="4.2" rx="1.1" stroke="currentColor" stroke-width="1.7" />
                        <path d="M5.4 7.8v11.2h13.2V7.8M9.8 12.4h4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                        v-else-if="item.icon === 'installment'"
                        class="ribbon-pin__svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">
                        <rect x="3.1" y="5.6" width="17.8" height="12.8" rx="2" stroke="currentColor" stroke-width="1.7" />
                        <path d="M3.1 9.6h17.8M7 14.4h4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                    </svg>
                    <svg
                        v-else
                        class="ribbon-pin__svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true">
                        <circle cx="7.3" cy="7.3" r="2.05" stroke="currentColor" stroke-width="1.7" />
                        <circle cx="16.7" cy="16.7" r="2.05" stroke="currentColor" stroke-width="1.7" />
                        <path d="M16.4 6.6 7.6 17.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                    </svg>
                </span>
                <span class="ribbon-pin__text">{{ item.label }}</span>
            </span>
        </div>
    </div>
</template>

<script>
const STATUS_TONES = {
    presale: 'presale',
    upcoming: 'upcoming',
    archive: 'archive',
};

const STATUS_ICONS = {
    presale: 'presale',
    upcoming: 'upcoming',
    archive: 'archive',
};

export default {
    name: 'CourseRibbonPins',
    props: {
        status: {
            type: [Object, String],
            default: null,
        },
        allowsInstallment: {
            type: Boolean,
            default: false,
        },
        discountPercent: {
            type: [Number, String],
            default: 0,
        },
    },
    computed: {
        statusSlug() {
            if (this.status && typeof this.status === 'object') {
                return this.status.english_title || this.status.slug || null;
            }
            return typeof this.status === 'string' ? this.status : null;
        },
        statusLabel() {
            if (this.status && typeof this.status === 'object' && this.status.title) {
                return this.status.title;
            }
            if (this.statusSlug === 'presale') {
                return this.$t('course.card.presale');
            }
            if (this.statusSlug === 'archive') {
                return this.$t('course.show.archived');
            }
            return typeof this.status === 'string' ? this.status : '';
        },
        items() {
            const pins = [];
            if (this.statusSlug && STATUS_TONES[this.statusSlug] && this.statusLabel) {
                pins.push(this.makeItem(this.statusSlug, this.statusLabel, STATUS_ICONS[this.statusSlug], STATUS_TONES[this.statusSlug]));
            }
            if (this.allowsInstallment) {
                pins.push(this.makeItem('installment', this.$t('course.installment.badge'), 'installment', 'installment'));
            }
            const percent = Number(this.discountPercent);
            if (Number.isFinite(percent) && percent > 0) {
                pins.push(this.makeItem('discount', `${percent}% ${this.$t('course.card.discount')}`, 'discount', 'discount'));
            }
            return pins;
        },
    },
    methods: {
        makeItem(id, label, icon, tone) {
            const length = String(label || '').length;
            const height = Math.max(72, Math.min(108, 40 + length * 8));
            return {
                id,
                label,
                icon,
                tone,
                bannerHeight: `${height}px`,
            };
        },
    },
};
</script>

<style scoped>
.ribbon-pin {
    --ribbon-from: #f59e0b;
    --ribbon-to: #d97706;
    position: relative;
    z-index: 1;
    outline: none;
}

.ribbon-pin:hover,
.ribbon-pin:focus-within {
    z-index: 8;
}

.ribbon-pin--upcoming {
    --ribbon-from: #38bdf8;
    --ribbon-to: #0369a1;
}

.ribbon-pin--archive {
    --ribbon-from: #94a3b8;
    --ribbon-to: #475569;
}

.ribbon-pin--installment {
    --ribbon-from: #818cf8;
    --ribbon-to: #4f46e5;
}

.ribbon-pin--discount {
    --ribbon-from: #fb7185;
    --ribbon-to: #be123c;
}

.ribbon-pin__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1.85rem;
    height: 1.85rem;
    overflow: hidden;
    border-radius: 0.5rem;
    color: #fff;
    background: linear-gradient(180deg, var(--ribbon-from), var(--ribbon-to));
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.32);
    transition: height 0.42s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}

.ribbon-pin:hover .ribbon-pin__body,
.ribbon-pin:focus-within .ribbon-pin__body {
    height: calc(1.85rem + var(--banner-h));
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.38);
}

.ribbon-pin:focus-visible .ribbon-pin__body {
    outline: 2px solid #fff;
    outline-offset: 2px;
}

.ribbon-pin__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.85rem;
    height: 1.85rem;
}

.ribbon-pin__svg {
    width: 0.95rem;
    height: 0.95rem;
}

.ribbon-pin__text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--banner-h);
    padding: 0.15rem 0 0.55rem;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1;
    color: #fff;
    white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
    .ribbon-pin__body {
        transition: none;
    }
}
</style>
