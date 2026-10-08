<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-quiz-questions' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    بانک سوال
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <AdminInlineLoading v-if="loading" />

            <form v-else @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="QUESTION_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'meta'"
                        :submit-loading="saving"
                        submit-label="ذخیره سوال"
                        submit-loading-label="در حال ذخیره..."
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                    />

                    <div class="min-w-0 min-h-[420px]">
                        <!-- Step 1 -->
                        <section v-show="currentStepId === 'type'" class="admin-form-section space-y-4">
                            <div class="mb-2">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">نوع سوال</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نوع پاسخ‌دهی را انتخاب کنید</p>
                            </div>
                            <AdminQuestionTypePicker
                                :model-value="form.type"
                                @select="changeType"
                            />
                            <div>
                                <label class="field-label">متن سوال <span class="text-rose-500">*</span></label>
                                <textarea
                                    v-model="form.text"
                                    required
                                    rows="4"
                                    class="form-input"
                                    :placeholder="form.type === 'fill_blank'
                                        ? 'مثلاً: برای تعریف ثابت از {{1}} و برای متغیر از {{2}} استفاده می‌کنیم.'
                                        : 'متن سوال را وارد کنید...'"
                                />
                                <div
                                    v-if="form.type === 'fill_blank'"
                                    class="mt-2 rounded-xl border border-sky-200/70 bg-sky-50/60 px-3 py-2.5 text-[11px] leading-6 text-sky-900 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200"
                                >
                                    <p class="font-bold mb-1">چطور جای‌خالی بگذارید؟</p>
                                    <ul class="list-disc ps-4 space-y-0.5">
                                        <li>
                                            با شماره:
                                            <code v-pre class="font-mono bg-white/70 dark:bg-gray-900/50 px-1 rounded">{{1}}</code>
                                            و
                                            <code v-pre class="font-mono bg-white/70 dark:bg-gray-900/50 px-1 rounded">{{2}}</code>
                                        </li>
                                        <li>
                                            یا با خط زیر:
                                            <code class="font-mono bg-white/70 dark:bg-gray-900/50 px-1 rounded">___</code>
                                            (هر سه خط‌تیره یا بیشتر = یک جای‌خالی به ترتیب)
                                        </li>
                                    </ul>
                                    <p class="mt-1.5 text-sky-800/80 dark:text-sky-300/80">
                                        در مرحله پاسخ‌ها برای هر جای‌خالی مقدار صحیح را بنویسید؛ شماره
                                        <span class="font-semibold">۱</span>
                                        همان
                                        <code v-pre class="font-mono bg-white/70 dark:bg-gray-900/50 px-1 rounded">{{1}}</code>
                                        است.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label class="field-label">توضیح پاسخ (اختیاری)</label>
                                <textarea v-model="form.explanation" rows="2" class="form-input" placeholder="پس از پاسخ به دانشجو نمایش داده می‌شود." />
                            </div>
                        </section>

                        <!-- Step 2 -->
                        <section v-show="currentStepId === 'answers'" class="admin-form-section space-y-5">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">پاسخ‌ها و گزینه‌ها</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {{ QUESTION_TYPE_LABELS[form.type] }} — {{ answersStepHint }}
                                </p>
                            </div>

                            <div v-if="form.type === 'long_answer'" class="rounded-xl border border-rose-200/60 bg-rose-50/40 dark:bg-rose-900/10 dark:border-rose-800/30 px-4 py-3 flex gap-3">
                                <div class="shrink-0 w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center text-rose-600">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-rose-700 dark:text-rose-400">پاسخ تشریحی</div>
                                    <p class="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                        دانشجو متن بلند می‌نویسد و این سوال <strong>همیشه تصحیح دستی</strong> می‌شود. راهنمای نمره‌دهی را در «توضیح پاسخ» مرحله قبل بنویسید.
                                    </p>
                                </div>
                            </div>

                            <div v-if="form.type === 'fill_blank'" class="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                                    @click="syncFillBlanksFromText"
                                >
                                    تشخیص جای‌خالی از متن سوال
                                </button>
                                <span v-if="detectedBlankCount" class="text-[11px] text-gray-500 dark:text-gray-400">
                                    {{ detectedBlankCount }} جای‌خالی در متن پیدا شد
                                </span>
                            </div>

                            <AdminQuestionOptionsEditor
                                v-if="needsOptions"
                                :type="form.type"
                                :options="form.options"
                                @add="addOption"
                                @remove="removeOption"
                                @move="moveOption"
                            />

                            <div v-if="showTextSettings" class="rounded-xl border border-gray-200/80 dark:border-gray-800 p-4 space-y-1 bg-gray-50/50 dark:bg-gray-800/30">
                                <p class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">تنظیمات تطبیق</p>
                                <AdminQuizSettingRow
                                    v-if="['short_answer', 'fill_blank'].includes(form.type)"
                                    v-model="form.settings.case_sensitive"
                                    label="حساس به حروف بزرگ/کوچک"
                                    hint="مثلاً «React» با «react» متفاوت است"
                                />
                                <AdminQuizSettingRow
                                    v-if="form.type === 'short_answer'"
                                    v-model="form.settings.manual_review"
                                    label="بررسی دستی پس از تطبیق"
                                    hint="حتی با تشخیص خودکار، قبل از نمره نهایی بررسی شود"
                                />
                            </div>
                        </section>

                        <!-- Step 3 -->
                        <section v-show="currentStepId === 'meta'" class="admin-form-section space-y-4">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="field-label">دسته‌بندی</label>
                                    <select v-model="form.category_id" class="form-input">
                                        <option :value="null">بدون دسته</option>
                                        <option v-for="cat in flatCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="field-label">سطح دشواری</label>
                                    <select v-model="form.difficulty" class="form-input">
                                        <option v-for="(label, key) in DIFFICULTY_LABELS" :key="key" :value="key">{{ label }}</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="field-label">نمره پیش‌فرض</label>
                                <input v-model.number="form.default_score" type="number" min="0" step="0.01" class="form-input max-w-xs" />
                            </div>
                            <div>
                                <label class="field-label">برچسب‌ها</label>
                                <input v-model="tagsText" class="form-input" placeholder="مبتدی، کاربردی — با کاما جدا کنید" />
                                <div v-if="suggestedTags.length" class="flex flex-wrap gap-1.5 mt-2">
                                    <button
                                        v-for="tag in suggestedTags"
                                        :key="tag"
                                        type="button"
                                        @click="appendTag(tag)"
                                        class="text-[10px] font-semibold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-400/10"
                                    >
                                        #{{ tag }}
                                    </button>
                                </div>
                            </div>
                            <AdminQuizSettingRow
                                v-model="form.is_active"
                                label="سوال فعال باشد"
                                hint="سوالات غیرفعال در جستجوی افزودن به آزمون نمایش داده نمی‌شوند"
                            />
                        </section>
                    </div>
                </div>
            </form>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminInlineLoading from '@/views/components/admin/AdminInlineLoading.vue';
import AdminFormStepperNav from '@/views/components/admin/AdminFormStepperNav.vue';
import AdminQuestionTypePicker from '@/views/components/admin/quiz/AdminQuestionTypePicker.vue';
import AdminQuestionOptionsEditor from '@/views/components/admin/quiz/AdminQuestionOptionsEditor.vue';
import AdminQuizSettingRow from '@/views/components/admin/quiz/AdminQuizSettingRow.vue';
import {
    getQuizQuestion, createQuizQuestion, updateQuizQuestion,
    listQuestionCategories, listQuestionTags,
} from '@/services/quiz.service';
import { createStepperMixin, BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import { QUESTION_FORM_STEPS, QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '@/views/components/admin/quiz/adminQuizConstants.js';
import { parseFillBlankText } from '@/utils/quizFillBlank';
import { showToastSuccess, showToastError } from '@/utils/toastConfig';

const OPTION_TYPES = ['single_choice', 'multiple_choice', 'true_false', 'short_answer', 'fill_blank', 'matching', 'ordering'];

export default {
    components: {
        AdminMasterPage,
        AdminInlineLoading,
        AdminFormStepperNav,
        AdminQuestionTypePicker,
        AdminQuestionOptionsEditor,
        AdminQuizSettingRow,
    },
    mixins: [createStepperMixin('QUESTION_FORM_STEPS')],
    props: { id: { type: [String, Number], default: null } },
    data() {
        return {
            BTN_SECONDARY,
            QUESTION_FORM_STEPS,
            QUESTION_TYPE_LABELS,
            DIFFICULTY_LABELS,
            loading: false,
            saving: false,
            tagsText: '',
            suggestedTags: [],
            categories: [],
            form: {
                type: 'single_choice',
                text: '',
                explanation: '',
                category_id: null,
                difficulty: 'medium',
                default_score: 1,
                is_active: true,
                settings: { case_sensitive: false, manual_review: false },
                options: [{ text: '', is_correct: false, position: 0 }],
            },
        };
    },
    computed: {
        isEdit() { return !!this.id; },
        needsOptions() { return OPTION_TYPES.includes(this.form.type); },
        showTextSettings() {
            return ['short_answer', 'fill_blank'].includes(this.form.type);
        },
        answersStepHint() {
            const map = {
                long_answer: 'بدون گزینه — فقط تصحیح دستی',
                fill_blank: 'پاسخ هر جای‌خالی را با شماره آن ثبت کنید',
                matching: 'هر ردیف یک جفت کلید و مقدار صحیح است',
                ordering: 'آیتم‌ها را به ترتیب صحیح بچینید',
                short_answer: 'پاسخ‌های قابل قبول را وارد کنید',
            };
            return map[this.form.type] || (this.needsOptions ? 'گزینه‌ها را وارد کنید' : '');
        },
        detectedBlankCount() {
            if (this.form.type !== 'fill_blank') return 0;
            return parseFillBlankText(this.form.text).blankCount;
        },
        flatCategories() {
            const rows = [];
            const walk = (items, prefix = '') => {
                for (const cat of items || []) {
                    rows.push({ id: cat.id, label: prefix + cat.name });
                    if (cat.children?.length) walk(cat.children, prefix + '— ');
                }
            };
            walk(this.categories);
            return rows;
        },
    },
    mounted() {
        this.loadCategories();
        this.loadTags();
        if (this.isEdit) this.load();
    },
    methods: {
        async loadCategories() {
            try {
                const res = await listQuestionCategories();
                this.categories = res.categories || [];
            } catch (e) {
                this.categories = [];
            }
        },
        async loadTags() {
            try {
                const res = await listQuestionTags();
                this.suggestedTags = (res.tags || []).map(t => t.name).slice(0, 12);
            } catch (e) {
                this.suggestedTags = [];
            }
        },
        appendTag(name) {
            const parts = this.tagsText.split(',').map(s => s.trim()).filter(Boolean);
            if (!parts.includes(name)) parts.push(name);
            this.tagsText = parts.join(', ');
        },
        emptyOption(type, index = 0) {
            const base = {
                text: '',
                is_correct: false,
                position: index,
                blank_index: null,
                match_key: null,
                match_value: null,
                correct_position: null,
            };
            if (type === 'fill_blank') {
                return { ...base, is_correct: true, blank_index: 0 };
            }
            if (type === 'short_answer') {
                return { ...base, is_correct: true };
            }
            if (type === 'matching') {
                return { ...base, match_key: '', match_value: '' };
            }
            if (type === 'ordering') {
                return { ...base, correct_position: index };
            }
            return base;
        },
        changeType(type) {
            const prev = this.form.type;
            this.form.type = type;
            if (type === 'true_false') {
                this.form.options = [
                    { text: 'درست', is_correct: true, position: 0 },
                    { text: 'غلط', is_correct: false, position: 1 },
                ];
                return;
            }
            if (prev !== type || !this.form.options.length) {
                const count = type === 'ordering' || type === 'matching' ? 2 : 1;
                this.form.options = Array.from({ length: count }, (_, i) => this.emptyOption(type, i));
            }
        },
        addOption() {
            const i = this.form.options.length;
            const opt = this.emptyOption(this.form.type, i);
            if (this.form.type === 'fill_blank') {
                const maxBlank = this.form.options.reduce((m, o) => {
                    const n = Number(o.blank_index);
                    return Number.isFinite(n) ? Math.max(m, n) : m;
                }, -1);
                opt.blank_index = Math.max(0, maxBlank);
            }
            this.form.options.push(opt);
        },
        syncFillBlanksFromText() {
            const parsed = parseFillBlankText(this.form.text);
            if (!parsed.blankCount) {
                showToastError('در متن سوال جای‌خالی پیدا نشد. از {{1}} یا ___ استفاده کنید.');
                return;
            }
            const existingByBlank = {};
            this.form.options.forEach((o) => {
                const key = Number(o.blank_index);
                if (!Number.isFinite(key)) return;
                if (!existingByBlank[key]) existingByBlank[key] = [];
                existingByBlank[key].push(o);
            });

            const next = [];
            parsed.indices.forEach((blankIndex) => {
                const prevRows = existingByBlank[blankIndex] || [];
                if (prevRows.length) {
                    prevRows.forEach((row) => {
                        next.push({
                            ...this.emptyOption('fill_blank', next.length),
                            ...row,
                            blank_index: blankIndex,
                            is_correct: true,
                            position: next.length,
                            text: row.text || '',
                        });
                    });
                } else {
                    next.push(this.emptyOption('fill_blank', next.length));
                    next[next.length - 1].blank_index = blankIndex;
                }
            });
            this.form.options = next;
            showToastSuccess(`${parsed.blankCount} جای‌خالی از متن سوال همگام شد.`);
        },
        removeOption(idx) {
            this.form.options.splice(idx, 1);
            this.form.options.forEach((o, i) => {
                o.position = i;
                if (this.form.type === 'ordering') o.correct_position = i;
            });
        },
        moveOption({ index, delta }) {
            const target = index + delta;
            if (target < 0 || target >= this.form.options.length) return;
            const list = this.form.options;
            const [row] = list.splice(index, 1);
            list.splice(target, 0, row);
            list.forEach((o, i) => {
                o.position = i;
                if (this.form.type === 'ordering') o.correct_position = i;
            });
        },
        validateFormStep(stepIndex) {
            const step = QUESTION_FORM_STEPS[stepIndex];
            if (step?.id === 'type' && !this.form.text?.trim()) {
                showToastError('متن سوال الزامی است.');
                return false;
            }
            if (step?.id === 'answers' && this.needsOptions) {
                const type = this.form.type;
                if (type === 'matching') {
                    const pairs = this.form.options.filter(o => (o.match_key || o.text || '').trim() && (o.match_value || '').trim());
                    if (pairs.length < 1) {
                        showToastError('حداقل یک جفت کلید و مقدار وارد کنید.');
                        return false;
                    }
                } else if (type === 'ordering') {
                    const items = this.form.options.filter(o => o.text?.trim());
                    if (items.length < 2) {
                        showToastError('حداقل دو آیتم برای مرتب‌سازی لازم است.');
                        return false;
                    }
                } else if (type === 'fill_blank') {
                    const answers = this.form.options.filter(o => o.text?.trim() && o.blank_index != null && o.blank_index !== '');
                    if (!answers.length) {
                        showToastError('حداقل یک پاسخ جای‌خالی با شماره وارد کنید.');
                        return false;
                    }
                } else {
                    const hasContent = this.form.options.some(o => o.text?.trim());
                    if (!hasContent) {
                        showToastError('حداقل یک گزینه/پاسخ وارد کنید.');
                        return false;
                    }
                    if (['single_choice', 'true_false'].includes(type) && !this.form.options.some(o => o.is_correct)) {
                        showToastError('یک گزینه را به‌عنوان پاسخ صحیح انتخاب کنید.');
                        return false;
                    }
                    if (type === 'short_answer' && !this.form.options.some(o => o.is_correct && o.text?.trim())) {
                        showToastError('حداقل یک پاسخ قابل قبول علامت بزنید.');
                        return false;
                    }
                }
            }
            return true;
        },
        async load() {
            this.loading = true;
            try {
                const res = await getQuizQuestion(this.id);
                const q = res.question;
                this.form = {
                    type: q.type,
                    text: q.text,
                    explanation: q.explanation || '',
                    category_id: q.category_id ?? null,
                    difficulty: q.difficulty,
                    default_score: q.default_score,
                    is_active: q.is_active,
                    settings: {
                        case_sensitive: q.settings?.case_sensitive ?? false,
                        manual_review: q.settings?.manual_review ?? false,
                    },
                    options: (q.options || []).map((o, i) => this.normalizeLoadedOption(q.type, o, i)),
                };
                this.tagsText = (q.tags || []).map(t => t.name).join(', ');
            } finally {
                this.loading = false;
            }
        },
        normalizeLoadedOption(type, o, i) {
            const row = {
                text: o.text ?? '',
                is_correct: !!o.is_correct,
                position: o.position ?? i,
                blank_index: o.blank_index ?? null,
                match_key: o.match_key ?? null,
                match_value: o.match_value ?? null,
                correct_position: o.correct_position ?? null,
                feedback: o.feedback ?? null,
            };
            if (type === 'matching') {
                row.match_key = row.match_key || row.text || '';
                row.text = row.match_key;
            }
            if (type === 'fill_blank') {
                row.is_correct = true;
                if (row.blank_index == null) row.blank_index = 0;
            }
            if (type === 'ordering' && row.correct_position == null) {
                row.correct_position = i;
            }
            if (type === 'short_answer' && !row.is_correct && row.text) {
                row.is_correct = true;
            }
            return row;
        },
        buildPayload() {
            const payload = { ...this.form };
            payload.tags = this.tagsText.split(',').map(s => s.trim()).filter(Boolean);
            if (!this.needsOptions) {
                payload.options = [];
            } else {
                payload.options = this.form.options
                    .map((o, i) => this.normalizeOptionForSave(this.form.type, o, i))
                    .filter(o => this.optionHasContent(this.form.type, o));
            }
            if (this.form.type === 'long_answer') {
                payload.requires_manual_review = true;
            }
            return payload;
        },
        optionHasContent(type, o) {
            if (type === 'matching') {
                return !!(o.match_key || '').trim() && !!(o.match_value || '').trim();
            }
            return !!(o.text || '').trim();
        },
        normalizeOptionForSave(type, o, i) {
            const row = {
                text: (o.text || '').trim(),
                is_correct: !!o.is_correct,
                position: i,
                blank_index: o.blank_index ?? null,
                match_key: o.match_key ?? null,
                match_value: o.match_value ?? null,
                correct_position: o.correct_position ?? null,
                feedback: o.feedback ?? null,
            };
            if (type === 'fill_blank') {
                row.is_correct = true;
                row.blank_index = Number.isFinite(Number(o.blank_index)) ? Number(o.blank_index) : 0;
            }
            if (type === 'short_answer') {
                row.is_correct = true;
            }
            if (type === 'matching') {
                const key = (o.match_key || o.text || '').trim();
                row.match_key = key;
                row.text = key;
                row.match_value = (o.match_value || '').trim();
                row.is_correct = false;
            }
            if (type === 'ordering') {
                row.correct_position = i;
                row.is_correct = false;
            }
            return row;
        },
        async submit() {
            if (!this.validateFormStep(0)) return;
            if (!this.validateFormStep(1)) return;
            this.saving = true;
            try {
                const payload = this.buildPayload();
                if (this.isEdit) await updateQuizQuestion(this.id, payload);
                else await createQuizQuestion(payload);
                showToastSuccess('سوال ذخیره شد.');
                this.$router.push({ name: 'admin-quiz-questions' });
            } catch (e) {
                showToastError('ذخیره سوال با خطا مواجه شد.');
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>

<style scoped>
.admin-form-section {
    background: white;
    border-radius: 1rem;
    border: 1px solid rgba(229, 231, 235, 0.8);
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.dark .admin-form-section {
    background: #111827;
    border-color: rgba(55, 65, 81, 0.8);
}
.form-input {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
}
.form-input:focus { box-shadow: 0 0 0 2px #facc15; }
.dark .form-input { background: #374151; color: #fff; }
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .admin-form-layout { grid-template-columns: 14rem minmax(0, 1fr); }
}
</style>
