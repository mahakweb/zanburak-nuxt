<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ optionsTitle }}</h3>
                <p v-if="hint" class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{{ hint }}</p>
            </div>
            <button
                v-if="canAddOption"
                type="button"
                @click="addOption"
                class="inline-flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors"
            >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                افزودن
            </button>
        </div>

        <!-- Choice / short answer / fill blank -->
        <div v-if="layout === 'choice'" class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden overflow-x-auto">
            <div class="min-w-[20rem] sm:min-w-0">
                <div
                    class="hidden sm:grid gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 text-[10px] font-semibold text-gray-400 border-b border-gray-200/80 dark:border-gray-800"
                    :class="choiceGridClass"
                >
                    <span>#</span>
                    <span>{{ type === 'fill_blank' ? 'پاسخ قابل قبول' : 'متن' }}</span>
                    <span v-if="showCorrectToggle" class="text-center">پاسخ صحیح</span>
                    <span v-if="type === 'fill_blank'" class="text-center">جای‌خالی</span>
                    <span class="text-center sr-only sm:not-sr-only">حذف</span>
                </div>
                <div
                    v-for="(opt, idx) in options"
                    :key="idx"
                    class="grid gap-2 items-center px-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    :class="choiceGridClass"
                >
                    <span class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] font-bold text-gray-500">{{ idx + 1 }}</span>
                    <input
                        v-model="opt.text"
                        :placeholder="textPlaceholder"
                        class="opt-input"
                    />
                    <div v-if="showCorrectToggle" class="flex justify-center">
                        <label
                            v-if="useRadio"
                            class="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors"
                            :class="opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
                        >
                            <input type="radio" :name="radioGroupName" :checked="opt.is_correct" class="sr-only" @change="setSingleCorrect(idx)" />
                            <svg v-if="opt.is_correct" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
                        </label>
                        <label
                            v-else
                            class="inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors"
                            :class="opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
                        >
                            <input type="checkbox" v-model="opt.is_correct" class="sr-only" />
                            <svg v-if="opt.is_correct" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
                        </label>
                    </div>
                    <input
                        v-if="type === 'fill_blank'"
                        :value="blankDisplayNumber(opt)"
                        type="number"
                        min="1"
                        placeholder="1"
                        class="opt-input opt-input-sm text-center"
                        @input="setBlankDisplayNumber(opt, $event)"
                    />
                    <button
                        v-if="canRemoveOption"
                        type="button"
                        @click="removeOption(idx)"
                        class="w-8 h-8 mx-auto rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center justify-center"
                        title="حذف"
                    >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    </button>
                    <span v-else class="w-8 h-8 mx-auto"/>
                </div>
            </div>
        </div>

        <!-- Matching -->
        <div v-else-if="layout === 'matching'" class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden">
            <div class="hidden sm:grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 text-[10px] font-semibold text-gray-400 border-b border-gray-200/80 dark:border-gray-800">
                <span>#</span><span>سمت چپ (کلید)</span><span>سمت راست (پاسخ صحیح)</span><span/>
            </div>
            <div
                v-for="(opt, idx) in options"
                :key="idx"
                class="grid grid-cols-1 sm:grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center px-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 bg-white dark:bg-gray-900"
            >
                <span class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] font-bold text-gray-500">{{ idx + 1 }}</span>
                <input
                    :value="opt.match_key || opt.text || ''"
                    placeholder="مثلاً GET"
                    class="opt-input"
                    @input="onMatchKeyInput(opt, $event)"
                />
                <input v-model="opt.match_value" placeholder="مثلاً دریافت داده" class="opt-input" />
                <button
                    v-if="canRemoveOption"
                    type="button"
                    @click="removeOption(idx)"
                    class="w-8 h-8 mx-auto rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center"
                >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                </button>
            </div>
        </div>

        <!-- Ordering: enter items in correct order -->
        <div v-else-if="layout === 'ordering'" class="rounded-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden">
            <div class="hidden sm:grid grid-cols-[2rem_1fr_4.5rem_2rem] gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/80 text-[10px] font-semibold text-gray-400 border-b border-gray-200/80 dark:border-gray-800">
                <span>#</span><span>متن آیتم (به ترتیب صحیح)</span><span class="text-center">جابه‌جایی</span><span/>
            </div>
            <div
                v-for="(opt, idx) in options"
                :key="idx"
                class="grid grid-cols-1 sm:grid-cols-[2rem_1fr_4.5rem_2rem] gap-2 items-center px-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 bg-white dark:bg-gray-900"
            >
                <span class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] font-bold text-gray-500">{{ idx + 1 }}</span>
                <input v-model="opt.text" placeholder="متن آیتم..." class="opt-input" />
                <div class="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center"
                        :disabled="idx === 0"
                        title="بالا"
                        @click="$emit('move', { index: idx, delta: -1 })"
                    >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 14L12 8L18 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button
                        type="button"
                        class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 flex items-center justify-center"
                        :disabled="idx === options.length - 1"
                        title="پایین"
                        @click="$emit('move', { index: idx, delta: 1 })"
                    >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 10L12 16L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <button
                    v-if="canRemoveOption"
                    type="button"
                    @click="removeOption(idx)"
                    class="w-8 h-8 mx-auto rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center"
                >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: { type: String, required: true },
        options: { type: Array, required: true },
    },
    emits: ['add', 'remove', 'move'],
    computed: {
        radioGroupName() {
            return `question-options-${this.type}`;
        },
        layout() {
            if (this.type === 'matching') return 'matching';
            if (this.type === 'ordering') return 'ordering';
            return 'choice';
        },
        choiceGridClass() {
            if (this.type === 'fill_blank') {
                return 'grid-cols-[2rem_1fr_5rem_2rem]';
            }
            if (this.showCorrectToggle) {
                return 'grid-cols-[2rem_1fr_3rem_2rem]';
            }
            return 'grid-cols-[2rem_1fr_2rem]';
        },
        useRadio() {
            return ['single_choice', 'true_false'].includes(this.type);
        },
        showCorrectToggle() {
            return ['single_choice', 'multiple_choice', 'true_false', 'short_answer'].includes(this.type);
        },
        canAddOption() {
            return this.type !== 'true_false';
        },
        canRemoveOption() {
            return this.type !== 'true_false' && this.options.length > 1;
        },
        optionsTitle() {
            const map = {
                single_choice: 'گزینه‌ها',
                multiple_choice: 'گزینه‌ها (چند پاسخ صحیح)',
                true_false: 'درست / غلط',
                short_answer: 'پاسخ‌های قابل قبول',
                fill_blank: 'پاسخ‌های جای خالی',
                matching: 'جفت‌های تطبیق',
                ordering: 'آیتم‌ها به ترتیب صحیح',
            };
            return map[this.type] || 'گزینه‌ها';
        },
        textPlaceholder() {
            const map = {
                short_answer: 'پاسخ قابل قبول...',
                fill_blank: 'پاسخ جای خالی...',
            };
            return map[this.type] || 'متن گزینه...';
        },
        hint() {
            const map = {
                multiple_choice: 'می‌توانید چند گزینه را به‌عنوان پاسخ صحیح علامت بزنید.',
                short_answer: 'هر ردیف یک پاسخ معتبر است؛ تطبیق خودکار انجام می‌شود.',
                fill_blank: 'شماره جای‌خالی همان عدد داخل {{1}} یا ترتیب ___ در متن سوال است. چند پاسخ برای یک جای‌خالی را با شماره یکسان وارد کنید.',
                matching: 'دانشجو مقدار سمت راست را برای هر کلید وارد می‌کند.',
                ordering: 'آیتم‌ها را به ترتیب صحیح بچینید؛ ترتیب ردیف‌ها همان پاسخ درست است.',
                true_false: 'یکی از «درست» یا «غلط» را به‌عنوان پاسخ صحیح انتخاب کنید.',
                single_choice: 'فقط یک گزینه می‌تواند پاسخ صحیح باشد.',
            };
            return map[this.type] || '';
        },
    },
    methods: {
        addOption() {
            this.$emit('add');
        },
        removeOption(idx) {
            this.$emit('remove', idx);
        },
        setSingleCorrect(idx) {
            this.options.forEach((o, i) => {
                o.is_correct = i === idx;
            });
        },
        onMatchKeyInput(opt, event) {
            const value = event.target.value;
            opt.match_key = value;
            opt.text = value;
        },
        blankDisplayNumber(opt) {
            const n = Number(opt.blank_index);
            return Number.isFinite(n) ? n + 1 : 1;
        },
        setBlankDisplayNumber(opt, event) {
            const n = parseInt(event.target.value, 10);
            opt.blank_index = Number.isFinite(n) ? Math.max(0, n - 1) : 0;
        },
    },
};
</script>

<style scoped>
.opt-input {
    display: block;
    width: 100%;
    height: 2.25rem;
    padding: 0 0.75rem;
    font-size: 0.8125rem;
    border-radius: 0.625rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
}
.opt-input:focus {
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.35);
    border-color: rgba(14, 165, 233, 0.3);
}
.opt-input-sm {
    max-width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.dark .opt-input {
    background: #1f2937;
    color: #f9fafb;
}
</style>
