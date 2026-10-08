<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link v-if="isEdit" :to="{ name: 'admin-quiz-reports', params: { id } }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5 text-xs">گزارش و تصحیح</span>
            </router-link>
            <router-link :to="{ name: 'admin-quizzes-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    فهرست آزمون‌ها
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <AdminInlineLoading v-if="loading" />

            <form v-else id="quiz-form" @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4 items-start admin-form-layout">
                    <AdminFormStepperNav
                        :steps="QUIZ_FORM_STEPS"
                        :current-step="currentStep"
                        :footer-label="footerStepLabel"
                        :show-submit="currentStepId === 'confirm'"
                        :submit-loading="saving"
                        :submit-label="isEdit ? 'ذخیره تغییرات' : 'ایجاد آزمون'"
                        submit-loading-label="در حال ذخیره..."
                        @go-to-step="goToStep"
                        @prev="prevStep"
                        @next="nextStep"
                        @submit="submit"
                    />

                    <div class="min-w-0 min-h-[420px] space-y-4">
                        <!-- Step 1: Basic -->
                        <section v-show="currentStepId === 'basic'" class="admin-form-section">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، توضیحات و اتصال به دوره/فصل/درس</p>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <label class="field-label">عنوان آزمون <span class="text-rose-500">*</span></label>
                                    <input v-model="form.title" required class="form-input" placeholder="مثلاً: آزمون پایانی دوره React" />
                                </div>
                                <div>
                                    <label class="field-label">توضیح کوتاه</label>
                                    <textarea v-model="form.description" rows="2" class="form-input" placeholder="یک جمله کوتاه زیر عنوان آزمون (اختیاری)..." />
                                </div>
                                <div>
                                    <label class="field-label">توضیحات آزمون</label>
                                    <p class="text-[11px] text-gray-400 mb-2">{{ $t('quiz.intro.instructionsAdminHint') }}</p>
                                    <EditorComponent
                                        v-model="form.instructions"
                                        :submitButton="false"
                                        :cancelButton="false"
                                        :previewClass="['bg-gray-100', 'dark:bg-gray-800']"
                                        :bodyClass="['bg-gray-50', 'dark:bg-gray-700', 'rounded-xl', 'text-gray-700', 'dark:text-gray-100']"
                                        :focusedBorder="'1px #f59e0b solid'"
                                    />
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="field-label">اتصال به</label>
                                        <select v-model="form.quizzable.type" @change="onQuizzableTypeChange" class="form-input">
                                            <option value="">مستقل (بدون اتصال)</option>
                                            <option value="course">دوره</option>
                                            <option value="section">فصل</option>
                                            <option value="episode">درس</option>
                                        </select>
                                    </div>
                                    <div v-if="form.quizzable.type" class="md:col-span-2">
                                        <label class="field-label">انتخاب {{ QUIZZABLE_TYPES[form.quizzable.type] }}</label>
                                        <AsyncSearchSelect
                                            v-model="selectedQuizzable"
                                            :key="form.quizzable.type"
                                            :searchApi="quizzableSearchApi"
                                            optionLabel="title"
                                            optionValue="id"
                                            :placeholder="'جستجوی ' + QUIZZABLE_TYPES[form.quizzable.type] + '...'"
                                            :inputClass="searchInputClass"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Step 2: Scoring -->
                        <section v-show="currentStepId === 'scoring'" class="admin-form-section">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">نمره‌دهی و زمان</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">آستانه قبولی، محدودیت زمان و بازه دسترسی</p>
                            </div>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label class="field-label">حداقل نمره</label>
                                        <input v-model.number="form.passing_score" type="number" min="0" step="0.01" class="form-input" placeholder="اختیاری" />
                                    </div>
                                    <div>
                                        <label class="field-label">حداقل درصد</label>
                                        <input v-model.number="form.passing_percentage" type="number" min="0" max="100" step="0.01" class="form-input" />
                                    </div>
                                    <div>
                                        <label class="field-label">زمان (دقیقه)</label>
                                        <input v-model.number="timeLimitMinutes" type="number" min="1" class="form-input" placeholder="بدون محدودیت" />
                                    </div>
                                    <div>
                                        <label class="field-label">حداکثر تلاش</label>
                                        <input v-model.number="form.max_attempts" type="number" min="1" class="form-input" placeholder="نامحدود" />
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="field-label">نمایش نتیجه</label>
                                        <select v-model="form.result_display" class="form-input">
                                            <option v-for="opt in RESULT_DISPLAY_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="field-label">شروع دسترسی</label>
                                        <div class="relative">
                                            <input v-model="form.start_at" type="datetime-local" class="form-input !pe-9" />
                                            <button
                                                v-if="form.start_at"
                                                type="button"
                                                class="absolute end-2 top-1/2 -translate-y-1/2 rounded-md px-1.5 text-xs text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                                                title="پاک کردن"
                                                @click="form.start_at = ''"
                                            >×</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="field-label">پایان دسترسی</label>
                                        <div class="relative">
                                            <input v-model="form.end_at" type="datetime-local" class="form-input !pe-9" />
                                            <button
                                                v-if="form.end_at"
                                                type="button"
                                                class="absolute end-2 top-1/2 -translate-y-1/2 rounded-md px-1.5 text-xs text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                                                title="پاک کردن"
                                                @click="form.end_at = ''"
                                            >×</button>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="form.negative_scoring">
                                    <label class="field-label">ضریب نمره منفی (۰ تا ۱)</label>
                                    <input v-model.number="form.negative_scoring_factor" type="number" min="0" max="1" step="0.01" class="form-input max-w-xs" />
                                </div>
                            </div>
                        </section>

                        <!-- Step 3: Settings -->
                        <section v-show="currentStepId === 'settings'" class="admin-form-section">
                            <div class="mb-4">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تنظیمات آزمون</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">رفتار نمره‌دهی، نمایش و ناوبری</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                <p class="md:col-span-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">عمومی</p>
                                <AdminQuizSettingRow
                                    v-for="opt in QUIZ_TOGGLE_OPTIONS"
                                    :key="opt.key"
                                    :model-value="form[opt.key]"
                                    :label="opt.label"
                                    :hint="toggleHint(opt)"
                                    :disabled="isToggleDisabled(opt)"
                                    @update:model-value="onToggleChange(opt.key, $event)"
                                />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p class="md:col-span-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">ناوبری سوالات (صفحه شرکت)</p>
                                <AdminQuizSettingRow
                                    v-for="nav in visibleNavSettings"
                                    :key="nav.key"
                                    v-model="form.settings[nav.key]"
                                    :label="nav.label"
                                    :hint="nav.hint"
                                    :disabled="isNavSettingDisabled(nav)"
                                    @update:model-value="onNavSettingChange(nav.key, $event)"
                                />
                            </div>

                            <div class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 gap-3">
                                <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400">واترمارک صفحه آزمون</p>
                                <AdminQuizSettingRow
                                    v-model="form.settings.exam_watermark_enabled"
                                    label="نمایش واترمارک"
                                    hint="متن تکرارشونده روی صفحه شرکت در آزمون"
                                />
                                <div v-if="form.settings.exam_watermark_enabled">
                                    <label class="field-label">متن واترمارک</label>
                                    <input
                                        v-model="form.settings.exam_watermark_text"
                                        type="text"
                                        maxlength="120"
                                        class="form-input"
                                        placeholder="مثلاً: نام آزمون یا پیام محرمانه"
                                    />
                                    <p class="mt-1 text-[10px] text-gray-400">این متن توسط ادمین تعیین می‌شود و روی صفحه آزمون نمایش داده می‌شود.</p>
                                </div>
                            </div>
                        </section>

                        <!-- Step 4: Questions -->
                        <section v-show="currentStepId === 'questions'" class="admin-form-section">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                                    سوالات آزمون
                                    <span v-if="orderedQuestions.length" class="text-xs font-medium text-gray-400">({{ orderedQuestions.length }} سوال)</span>
                                </h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">از بانک سوال انتخاب کنید و ترتیب را با کشیدن تنظیم کنید</p>
                            </div>

                            <label class="field-label">جستجو و افزودن سوال</label>
                            <AsyncSearchSelect
                                v-model="questionSearchBuffer"
                                searchApi="/admin/quizzes/search/questions"
                                optionLabel="title"
                                optionValue="id"
                                :closeOnSelect="true"
                                :hideSelectedChips="true"
                                placeholder="حداقل یک حرف از متن سوال را بنویسید..."
                                :inputClass="searchInputClass"
                                @update:modelValue="onQuestionSearchPick"
                            />

                            <div v-if="orderedQuestions.length" class="mt-4 space-y-1.5">
                                <div class="flex items-center justify-between text-[10px] text-gray-400 px-1">
                                    <span>{{ orderedQuestions.length }} سوال · کشیدن برای تغییر ترتیب</span>
                                    <span>نمره خالی = پیش‌فرض بانک</span>
                                </div>
                                <div
                                    v-for="(q, idx) in orderedQuestions"
                                    :key="q.id"
                                    draggable="true"
                                    @dragstart="onDragStart(idx)"
                                    @dragover.prevent
                                    @drop.prevent="onDrop(idx)"
                                    class="quiz-question-row group flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-2.5 py-2 cursor-grab active:cursor-grabbing hover:border-amber-200 dark:hover:border-amber-400/30 transition-colors"
                                >
                                    <div class="flex items-center gap-2 min-w-0 flex-1">
                                    <span class="shrink-0 text-gray-300 dark:text-gray-600 cursor-grab" title="جابجایی">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M4 5h8v1H4V5zm0 2.5h8v1H4v-1zM4 10h8v1H4v-1z"/></svg>
                                    </span>
                                    <span class="shrink-0 w-7 h-7 rounded-lg bg-amber-400/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center">{{ idx + 1 }}</span>
                                    <span class="flex-1 min-w-0 text-sm font-medium text-gray-800 dark:text-gray-100 truncate" :title="q.title">{{ q.title }}</span>
                                    </div>
                                    <div class="flex items-center gap-2 shrink-0 ps-6 sm:ps-0">
                                    <label class="flex items-center gap-1 text-[10px] text-gray-400">
                                        <span>نمره</span>
                                        <input v-model.number="q.score" type="number" min="0" step="0.01" placeholder="—"
                                            class="w-16 h-8 form-input !mt-0 !py-1 text-center text-xs" />
                                    </label>
                                    <button type="button" @click="removeQuestion(idx)" title="حذف"
                                        class="shrink-0 w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center transition-colors">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                    </div>
                                </div>
                            </div>

                            <p class="text-xs text-gray-400 mt-4">
                                سوال جدید را در
                                <router-link :to="{ name: 'admin-quiz-question-create' }" class="text-amber-600 font-semibold">بانک سوال</router-link>
                                بسازید.
                            </p>
                        </section>

                        <!-- Step 5: Confirm -->
                        <section v-show="currentStepId === 'confirm'" class="admin-form-section space-y-4">
                            <div class="rounded-2xl bg-gradient-to-l from-amber-50 to-white dark:from-amber-400/10 dark:to-gray-900 border border-amber-100 dark:border-amber-400/20 p-4">
                                <p class="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1">آماده ذخیره</p>
                                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ form.title || 'بدون عنوان' }}</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ attachmentSummary }}</p>
                            </div>

                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div v-for="item in confirmSummaryItems" :key="item.label"
                                    class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3">
                                    <p class="text-[10px] font-medium text-gray-400 mb-1">{{ item.label }}</p>
                                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ item.value }}</p>
                                </div>
                            </div>

                            <div class="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">تنظیمات فعال</p>
                                <div class="flex flex-wrap gap-1.5">
                                    <span v-for="tag in activeSettingTags" :key="tag"
                                        class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300">{{ tag }}</span>
                                    <span v-if="!activeSettingTags.length" class="text-xs text-gray-400">تنظیمات پیش‌فرض</span>
                                </div>
                            </div>

                            <div v-if="orderedQuestions.length" class="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">سوالات ({{ orderedQuestions.length }})</p>
                                <ul class="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                    <li v-for="(q, i) in orderedQuestions" :key="q.id" class="text-xs text-gray-600 dark:text-gray-300 truncate">
                                        <span class="font-bold text-amber-600 dark:text-amber-400">{{ i + 1 }}.</span> {{ q.title }}
                                    </li>
                                </ul>
                            </div>
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
import AdminQuizSettingRow from '@/views/components/admin/quiz/AdminQuizSettingRow.vue';
import AsyncSearchSelect from '@/views/components/multiselect/AsyncSearchSelect.vue';
import EditorComponent from '@/views/components/editor/EditorComponent.vue';
import { getQuiz, createQuiz, updateQuiz, QUIZZABLE_TYPES } from '@/services/quiz.service';
import { createStepperMixin, BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import {
    QUIZ_FORM_STEPS,
    QUIZ_TOGGLE_OPTIONS,
    QUIZ_NAVIGATION_SETTINGS,
    RESULT_DISPLAY_OPTIONS,
    defaultQuizSettings,
} from '@/views/components/admin/quiz/adminQuizConstants.js';
import { showToastSuccess, showToastError, showToastWarning } from '@/utils/toastConfig';

const QUIZZABLE_SEARCH_API = {
    course: '/admin/quizzes/search/courses',
    section: '/admin/quizzes/search/sections',
    episode: '/admin/quizzes/search/episodes',
};

const defaultForm = () => ({
    title: '',
    description: '',
    instructions: '',
    quizzable: { type: '', id: null },
    passing_score: null,
    passing_percentage: 70,
    time_limit: null,
    max_attempts: null,
    randomize_questions: false,
    randomize_answers: false,
    result_display: 'immediately',
    negative_scoring: false,
    negative_scoring_factor: 0.25,
    start_at: '',
    end_at: '',
    manual_review_required: false,
    show_correct_answers: true,
    show_questions_in_result: true,
    is_published: false,
    settings: defaultQuizSettings(),
});

export default {
    components: {
        AdminMasterPage,
        AdminInlineLoading,
        AdminFormStepperNav,
        AdminQuizSettingRow,
        AsyncSearchSelect,
        EditorComponent,
    },
    mixins: [createStepperMixin('QUIZ_FORM_STEPS')],
    props: { id: { type: [String, Number], default: null } },
    data() {
        return {
            BTN_SECONDARY,
            QUIZ_FORM_STEPS,
            QUIZ_TOGGLE_OPTIONS,
            QUIZ_NAVIGATION_SETTINGS,
            RESULT_DISPLAY_OPTIONS,
            QUIZZABLE_TYPES,
            searchInputClass: 'h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-xl outline-none focus:ring-2 focus:ring-amber-400/40 block w-full p-2.5 border border-transparent',
            loading: false,
            saving: false,
            form: defaultForm(),
            orderedQuestions: [],
            questionSearchBuffer: [],
            selectedQuizzable: [],
            dragFromIndex: null,
        };
    },
    computed: {
        isEdit() { return !!this.id; },
        timeLimitMinutes: {
            get() { return this.form.time_limit ? Math.round(this.form.time_limit / 60) : null; },
            set(v) { this.form.time_limit = v ? Math.round(v * 60) : null; },
        },
        quizzableSearchApi() {
            return QUIZZABLE_SEARCH_API[this.form.quizzable.type] || '';
        },
        visibleNavSettings() {
            return QUIZ_NAVIGATION_SETTINGS;
        },
        attachmentSummary() {
            if (!this.form.quizzable.type) return 'آزمون مستقل';
            const title = this.selectedQuizzable[0]?.title;
            return `${QUIZZABLE_TYPES[this.form.quizzable.type]}${title ? ': ' + title : ''}`;
        },
        activeSettingTags() {
            const tags = [];
            for (const opt of QUIZ_TOGGLE_OPTIONS) {
                if (this.form[opt.key]) tags.push(opt.label);
            }
            for (const nav of QUIZ_NAVIGATION_SETTINGS) {
                if (this.form.settings[nav.key]) tags.push(nav.label);
            }
            return tags;
        },
        confirmSummaryItems() {
            const resultLabel = RESULT_DISPLAY_OPTIONS.find(o => o.value === this.form.result_display)?.label || '—';
            return [
                { label: 'حداقل درصد', value: `${this.form.passing_percentage ?? 0}%` },
                { label: 'زمان', value: this.timeLimitMinutes ? `${this.timeLimitMinutes} دقیقه` : 'نامحدود' },
                { label: 'تلاش', value: this.form.max_attempts || 'نامحدود' },
                { label: 'نمایش نتیجه', value: resultLabel },
            ];
        },
    },
    watch: {
        selectedQuizzable(val) {
            if (val.length > 1) this.selectedQuizzable = [val[val.length - 1]];
        },
    },
    mounted() {
        if (this.isEdit) {
            this.loadQuiz();
        } else {
            this.applyRoutePrefill();
        }
    },
    methods: {
        applyRoutePrefill() {
            const q = this.$route.query || {};
            const type = q.quizzableType
                || (q.courseId ? 'course' : '')
                || (q.sectionId ? 'section' : '')
                || (q.episodeId ? 'episode' : '');
            const id = q.quizzableId || q.courseId || q.sectionId || q.episodeId;
            const title = q.quizzableTitle || q.courseTitle || q.sectionTitle || q.episodeTitle;

            if (!type || !id) return;

            const numericId = Number(id);
            this.form.quizzable.type = type;
            this.form.quizzable.id = numericId;
            this.selectedQuizzable = [{
                id: numericId,
                title: (title && String(title).trim()) || `${QUIZZABLE_TYPES[type] || type} #${numericId}`,
            }];
        },
        isNavSettingDisabled(nav) {
            if (nav.dependsOn && !this.form.settings[nav.dependsOn]) return true;
            if (nav.inverseDepends && this.form.settings[nav.inverseDepends]) return true;
            return false;
        },
        isToggleDisabled(opt) {
            if (opt.dependsOn && !this.form[opt.dependsOn]) return true;
            return false;
        },
        toggleHint(opt) {
            if (opt.dependsOn && !this.form[opt.dependsOn]) {
                const parent = QUIZ_TOGGLE_OPTIONS.find((o) => o.key === opt.dependsOn);
                return `ابتدا «${parent?.label || opt.dependsOn}» را فعال کنید.`;
            }
            return opt.hint;
        },
        onToggleChange(key, value) {
            this.form[key] = value;
            if (key === 'show_questions_in_result' && !value) {
                this.form.show_correct_answers = false;
            }
        },
        onNavSettingChange(key, value) {
            this.form.settings[key] = value;
            if (key === 'one_question_at_a_time' && !value) {
                this.form.settings.require_answer_before_next = false;
                this.form.settings.allow_previous_question = true;
            }
            if (key === 'require_answer_before_next' && value) {
                this.form.settings.allow_skip_questions = false;
            }
        },
        validateFormStep(stepIndex) {
            const step = QUIZ_FORM_STEPS[stepIndex];
            if (step?.id === 'basic' && !this.form.title?.trim()) {
                showToastError('عنوان آزمون الزامی است.');
                return false;
            }
            if (step?.id === 'questions' && !this.orderedQuestions.length) {
                showToastError('حداقل یک سوال به آزمون اضافه کنید.');
                return false;
            }
            return true;
        },
        toLocalDatetime(value) {
            if (!value) return '';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return '';
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        },
        toApiDatetime(value) {
            if (!value || !String(value).trim()) return null;
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return null;
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        },
        async loadQuiz() {
            this.loading = true;
            try {
                const res = await getQuiz(this.id);
                const q = res.quiz;
                this.form = {
                    ...defaultForm(),
                    title: q.title,
                    description: q.description || '',
                    instructions: q.instructions || '',
                    quizzable: {
                        type: this.reverseQuizzableType(q.quizzable_type),
                        id: q.quizzable_id,
                    },
                    passing_score: q.passing_score,
                    passing_percentage: q.passing_percentage,
                    time_limit: q.time_limit,
                    max_attempts: q.max_attempts,
                    randomize_questions: q.randomize_questions,
                    randomize_answers: q.randomize_answers,
                    result_display: q.result_display,
                    negative_scoring: q.negative_scoring,
                    negative_scoring_factor: q.negative_scoring_factor,
                    start_at: this.toLocalDatetime(q.start_at),
                    end_at: this.toLocalDatetime(q.end_at),
                    manual_review_required: q.manual_review_required,
                    show_questions_in_result: q.show_questions_in_result ?? true,
                    show_correct_answers: (q.show_questions_in_result ?? true) ? q.show_correct_answers : false,
                    is_published: q.is_published,
                    settings: { ...defaultQuizSettings(), ...(q.settings || {}) },
                };
                this.orderedQuestions = (q.questions || []).map(x => ({
                    id: x.id,
                    title: '#' + x.id + ' · ' + this.truncate(x.text),
                    score: x.pivot?.score ?? null,
                }));
                this.questionSearchBuffer = [];
                if (q.quizzable_id && this.form.quizzable.type) {
                    this.selectedQuizzable = [{
                        id: q.quizzable_id,
                        title: q.quizzable?.title || q.quizzable?.english_title || ('#' + q.quizzable_id),
                    }];
                }
            } finally {
                this.loading = false;
            }
        },
        truncate(text) {
            if (!text) return '';
            return text.length > 70 ? text.slice(0, 70) + '…' : text;
        },
        onQuizzableTypeChange() {
            this.selectedQuizzable = [];
            this.form.quizzable.id = null;
        },
        reverseQuizzableType(type) {
            if (!type) return '';
            const map = { Course: 'course', Section: 'section', Episode: 'episode' };
            return map[type.split('\\').pop()] || '';
        },
        buildPayload() {
            const payload = { ...this.form, settings: { ...this.form.settings } };
            if (!payload.quizzable.type) {
                payload.quizzable = null;
            } else {
                payload.quizzable = {
                    type: payload.quizzable.type,
                    id: this.selectedQuizzable[0]?.id || null,
                };
            }
            payload.questions = this.orderedQuestions.map(q => ({
                id: q.id,
                score: q.score ?? null,
            }));
            payload.start_at = this.toApiDatetime(this.form.start_at);
            payload.end_at = this.toApiDatetime(this.form.end_at);
            return payload;
        },
        onQuestionSearchPick(items) {
            const picked = items[items.length - 1];
            if (!picked?.id) {
                this.questionSearchBuffer = [];
                return;
            }
            if (this.orderedQuestions.some(q => q.id === picked.id)) {
                showToastWarning('این سوال قبلاً به آزمون اضافه شده است.');
            } else {
                this.orderedQuestions.push({
                    id: picked.id,
                    title: picked.title || ('#' + picked.id),
                    score: picked.default_score ?? null,
                });
                showToastSuccess('سوال به آزمون اضافه شد.');
            }
            this.$nextTick(() => { this.questionSearchBuffer = []; });
        },
        onDragStart(index) { this.dragFromIndex = index; },
        onDrop(index) {
            if (this.dragFromIndex === null || this.dragFromIndex === index) return;
            const moved = this.orderedQuestions.splice(this.dragFromIndex, 1)[0];
            this.orderedQuestions.splice(index, 0, moved);
            this.dragFromIndex = null;
        },
        removeQuestion(index) {
            this.orderedQuestions.splice(index, 1);
        },
        async submit() {
            if (!this.validateFormStep(0) || !this.validateFormStep(3)) return;
            this.saving = true;
            try {
                const payload = this.buildPayload();
                if (this.isEdit) await updateQuiz(this.id, payload);
                else await createQuiz(payload);
                showToastSuccess(this.isEdit ? 'آزمون به‌روزرسانی شد.' : 'آزمون ایجاد شد.');
                this.$router.push({ name: 'admin-quizzes-list' });
            } catch (e) {
                showToastError('ذخیره آزمون با خطا مواجه شد.');
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
.form-input:focus {
    box-shadow: 0 0 0 2px #facc15;
}
.dark .form-input {
    background: #374151;
    color: #fff;
}
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .admin-form-layout {
        grid-template-columns: 14rem minmax(0, 1fr);
    }
}
</style>
