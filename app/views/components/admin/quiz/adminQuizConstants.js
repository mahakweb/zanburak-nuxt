import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '@/services/quiz.service';

export { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS };

export const QUIZ_FORM_STEPS = [
    { id: 'basic', label: 'اطلاعات پایه', hint: 'عنوان و اتصال' },
    { id: 'scoring', label: 'نمره و زمان', hint: 'آستانه قبولی و مهلت' },
    { id: 'settings', label: 'تنظیمات', hint: 'رفتار آزمون و نمایش' },
    { id: 'questions', label: 'سوالات', hint: 'انتخاب از بانک' },
    { id: 'confirm', label: 'تأیید', hint: 'بازبینی نهایی' },
];

export const QUESTION_FORM_STEPS = [
    { id: 'type', label: 'نوع و متن', hint: 'انتخاب نوع سوال' },
    { id: 'answers', label: 'پاسخ‌ها', hint: 'گزینه‌ها و تنظیمات' },
    { id: 'meta', label: 'جزئیات', hint: 'دسته، برچسب، وضعیت' },
];

export const QUESTION_TYPE_META = {
    single_choice: {
        label: QUESTION_TYPE_LABELS.single_choice,
        desc: 'یک گزینه صحیح از بین چند گزینه',
        icon: 'radio',
        color: 'indigo',
    },
    multiple_choice: {
        label: QUESTION_TYPE_LABELS.multiple_choice,
        desc: 'چند گزینه صحیح هم‌زمان',
        icon: 'checkbox',
        color: 'violet',
    },
    true_false: {
        label: QUESTION_TYPE_LABELS.true_false,
        desc: 'پاسخ درست یا غلط',
        icon: 'tf',
        color: 'sky',
    },
    short_answer: {
        label: QUESTION_TYPE_LABELS.short_answer,
        desc: 'پاسخ کوتاه با تطبیق خودکار',
        icon: 'text',
        color: 'teal',
    },
    long_answer: {
        label: QUESTION_TYPE_LABELS.long_answer,
        desc: 'پاسخ تشریحی — تصحیح دستی',
        icon: 'essay',
        color: 'rose',
    },
    fill_blank: {
        label: QUESTION_TYPE_LABELS.fill_blank,
        desc: 'چند جای خالی با پاسخ مشخص',
        icon: 'blank',
        color: 'amber',
    },
    matching: {
        label: QUESTION_TYPE_LABELS.matching,
        desc: 'تطبیق کلید و مقدار',
        icon: 'match',
        color: 'cyan',
    },
    ordering: {
        label: QUESTION_TYPE_LABELS.ordering,
        desc: 'مرتب‌سازی آیتم‌ها',
        icon: 'order',
        color: 'lime',
    },
};

export const QUIZ_TOGGLE_OPTIONS = [
    { key: 'is_published', label: 'انتشار آزمون', hint: 'آزمون برای دانشجویان قابل مشاهده شود' },
    { key: 'randomize_questions', label: 'ترتیب تصادفی سوالات', hint: 'هر تلاش ترتیب متفاوتی از سوالات دارد' },
    { key: 'randomize_answers', label: 'ترتیب تصادفی گزینه‌ها', hint: 'گزینه‌های هر سوال shuffle می‌شوند' },
    { key: 'negative_scoring', label: 'نمره منفی', hint: 'کسر نمره برای پاسخ غلط' },
    { key: 'manual_review_required', label: 'تصحیح دستی کل آزمون', hint: 'همه تلاش‌ها قبل از نتیجه نهایی بررسی شوند' },
    { key: 'show_questions_in_result', label: 'نمایش سوالات در نتیجه', hint: 'اگر غیرفعال باشد دانشجو فقط خلاصه نمره را می‌بیند و لیست سوالات نمایش داده نمی‌شود' },
    {
        key: 'show_correct_answers',
        label: 'نمایش پاسخ صحیح',
        hint: 'پس از اتمام، پاسخ درست به دانشجو نشان داده شود',
        dependsOn: 'show_questions_in_result',
    },
];

export const QUIZ_NAVIGATION_SETTINGS = [
    {
        key: 'one_question_at_a_time',
        label: 'نمایش تک‌سواله',
        hint: 'در هر لحظه فقط یک سوال نمایش داده شود (به‌جای لیست کامل)',
    },
    {
        key: 'require_answer_before_next',
        label: 'اجبار پاسخ قبل از سوال بعد',
        hint: 'دانشجو بدون پاسخ به سوال فعلی نتواند به بعدی برود',
        dependsOn: 'one_question_at_a_time',
    },
    {
        key: 'allow_skip_questions',
        label: 'امکان رد کردن سوال',
        hint: 'اجازه رفتن به سوال بعد بدون پاسخ (اگر اجبار پاسخ خاموش باشد)',
        dependsOn: 'one_question_at_a_time',
        inverseDepends: 'require_answer_before_next',
    },
    {
        key: 'allow_previous_question',
        label: 'بازگشت به سوال قبلی',
        hint: 'دانشجو بتواند در حالت تک‌سواله به سوال‌های قبلی برگردد',
        dependsOn: 'one_question_at_a_time',
    },
];

export const RESULT_DISPLAY_OPTIONS = [
    { value: 'immediately', label: 'بلافاصله پس از ارسال' },
    { value: 'after_review', label: 'پس از تصحیح دستی' },
    { value: 'after_end', label: 'پس از پایان مهلت آزمون' },
];

export const defaultQuizSettings = () => ({
    one_question_at_a_time: false,
    require_answer_before_next: false,
    allow_skip_questions: true,
    allow_previous_question: true,
    exam_watermark_enabled: false,
    exam_watermark_text: '',
});

export const TYPE_BADGE_CLASSES = {
    single_choice: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    multiple_choice: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    true_false: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
    short_answer: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
    long_answer: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
    fill_blank: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    matching: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
    ordering: 'bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400',
};

export const DIFFICULTY_BADGE_CLASSES = {
    easy: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    medium: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    hard: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
};
