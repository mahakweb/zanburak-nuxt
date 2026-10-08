<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button type="button" @click="load" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5 text-xs">بروزرسانی</span>
            </button>
            <router-link :to="{ name: 'admin-quiz-edit', params: { id } }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5 text-xs">ویرایش آزمون</span>
            </router-link>
            <router-link :to="{ name: 'admin-quizzes-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5 text-xs">فهرست آزمون‌ها</span>
            </router-link>
        </template>

        <div class="space-y-4">
            <AdminInlineLoading v-if="loading && !quiz" />

            <template v-else>
                <!-- Quiz header -->
                <div v-if="quiz" class="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div class="flex items-start gap-3 min-w-0">
                            <AdminQuizAttachIcon :type="quizAttachType" size="md" />
                            <div class="min-w-0">
                                <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{{ quiz.title }}</h2>
                                <p v-if="quiz.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ quiz.description }}</p>
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{{ attachLabel }}</span>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                        :class="quiz.is_published ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'">
                                        {{ quiz.is_published ? 'منتشر شده' : 'پیش‌نویس' }}
                                    </span>
                                    <span v-if="quiz.manual_review_required" class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300">تصحیح دستی</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 shrink-0">
                            <div class="text-center px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 min-w-[4.5rem]">
                                <div class="text-lg font-extrabold text-gray-900 dark:text-white tabular-nums">{{ quiz.questions_count || 0 }}</div>
                                <div class="text-[10px] text-gray-400">سوال</div>
                            </div>
                            <div class="text-center px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 min-w-[4.5rem]">
                                <div class="text-lg font-extrabold text-gray-900 dark:text-white tabular-nums">{{ quiz.total_score || 0 }}</div>
                                <div class="text-[10px] text-gray-400">نمره کل</div>
                            </div>
                            <div class="text-center px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 min-w-[4.5rem]">
                                <div class="text-lg font-extrabold text-gray-900 dark:text-white tabular-nums">{{ formatTimeLimit(quiz.time_limit) }}</div>
                                <div class="text-[10px] text-gray-400">زمان</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div :class="ADMIN_TAB_LIST" class="w-full sm:w-max overflow-x-auto">
                    <button
                        v-for="t in tabs"
                        :key="t.id"
                        type="button"
                        @click="tab = t.id"
                        :class="adminTabButtonClass(tab === t.id)"
                    >
                        {{ t.label }}
                        <span v-if="t.id === 'review' && reviewQueue.length" :class="ADMIN_TAB_BADGE">
                            {{ reviewQueue.length }}
                        </span>
                    </button>
                </div>

                <AdminInlineLoading v-if="loading" />

                <!-- Overview -->
                <div v-else-if="tab === 'overview' && quiz" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section class="admin-form-section">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">نمره‌دهی و قبولی</h3>
                            <dl class="space-y-2.5 text-sm">
                                <div v-for="row in scoringRows" :key="row.label" class="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <dt class="text-gray-500 dark:text-gray-400">{{ row.label }}</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100">{{ row.value }}</dd>
                                </div>
                            </dl>
                        </section>
                        <section class="admin-form-section">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">تنظیمات رفتاری</h3>
                            <dl class="space-y-2.5 text-sm">
                                <div v-for="row in behaviorRows" :key="row.label" class="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <dt class="text-gray-500 dark:text-gray-400">{{ row.label }}</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100">{{ row.value }}</dd>
                                </div>
                            </dl>
                        </section>
                    </div>
                    <section class="admin-form-section">
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">سوالات آزمون ({{ quizQuestions.length }})</h3>
                        <div v-if="!quizQuestions.length" class="text-sm text-gray-400 text-center py-8">سوالی به این آزمون اضافه نشده است.</div>
                        <ol v-else class="space-y-2">
                            <li v-for="(q, idx) in quizQuestions" :key="q.id"
                                class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                <span class="shrink-0 w-7 h-7 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">{{ idx + 1 }}</span>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2">{{ q.text }}</p>
                                    <div class="flex flex-wrap gap-2 mt-1.5 text-[10px] text-gray-400">
                                        <span>{{ questionTypeLabel(q.type) }}</span>
                                        <span>·</span>
                                        <span>{{ q.pivot?.score ?? q.default_score ?? 0 }} نمره</span>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </section>
                </div>

                <!-- Reports -->
                <div v-else-if="tab === 'report' && summary" class="space-y-4">
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <AdminReportStatCard title="کل تلاش‌ها" :value="formatNumber(summary.total_attempts)" accent="cyan">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="نرخ قبولی" :value="summary.success_rate + '%'" accent="emerald" :subtitle="`${summary.passed_count} قبول / ${summary.failed_count} مردود`">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="میانگین نمره" :value="summary.average_score" accent="blue">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><circle cx="12" cy="8" r="5"/></svg>
                            </template>
                        </AdminReportStatCard>
                        <AdminReportStatCard title="میانگین زمان" :value="formatDuration(summary.average_time_spent)" accent="violet">
                            <template #icon>
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                            </template>
                        </AdminReportStatCard>
                    </div>

                    <div v-if="summary.pending_review_count > 0"
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-500/20 dark:bg-sky-500/10">
                        <p class="text-sm text-sky-900 dark:text-sky-200">
                            <span class="font-bold">{{ formatNumber(summary.pending_review_count) }}</span>
                            تلاش در انتظار تصحیح یا انتشار نتیجه است.
                        </p>
                        <button type="button" class="h-10 shrink-0 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
                            @click="tab = 'review'">
                            رفتن به تصحیح دستی
                        </button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div class="admin-form-section flex flex-col items-center justify-center">
                            <div class="relative w-28 h-28">
                                <svg viewBox="0 0 36 36" class="w-28 h-28 -rotate-90">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" class="text-gray-100 dark:text-gray-800" stroke-width="3"/>
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" :stroke-dasharray="`${summary.success_rate}, 100`"/>
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ summary.success_rate }}%</span>
                                    <span class="text-[10px] text-gray-400">موفقیت</span>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-3 text-center">از {{ summary.completed_attempts }} تلاش تکمیل‌شده</p>
                        </div>
                        <div class="lg:col-span-2 admin-form-section">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4">توزیع نمرات (درصد)</h3>
                            <div class="flex items-end justify-between gap-2 h-36">
                                <div v-for="bucket in distribution" :key="bucket.label" class="flex-1 flex flex-col items-center justify-end gap-1.5 min-w-0">
                                    <span class="text-[11px] font-bold text-gray-600 dark:text-gray-300 tabular-nums">{{ bucket.count }}</span>
                                    <div class="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-sky-300 dark:from-sky-600 dark:to-sky-400 transition-all min-h-[4px]"
                                        :style="{ height: bucketHeight(bucket) }"/>
                                    <span class="text-[10px] text-gray-400 truncate w-full text-center">{{ bucket.label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <section class="admin-form-section">
                            <h3 class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-500"/>
                                دانشجویان قبول‌شده
                            </h3>
                            <ul class="space-y-2 max-h-80 overflow-y-auto md:custom-scrollbar">
                                <li v-for="s in passed" :key="s.id" class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                        <img v-if="s.user?.profile_pic" :src="s.user.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ studentName(s.user) }}</div>
                                        <div class="text-[10px] text-gray-400">{{ formatAttemptMeta(s) }}</div>
                                    </div>
                                    <span class="text-sm font-bold text-emerald-600 tabular-nums">{{ s.percentage }}%</span>
                                </li>
                                <li v-if="!passed.length" class="text-gray-400 text-sm text-center py-8">موردی نیست</li>
                            </ul>
                        </section>
                        <section class="admin-form-section">
                            <h3 class="text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-rose-500"/>
                                دانشجویان مردود
                            </h3>
                            <ul class="space-y-2 max-h-80 overflow-y-auto md:custom-scrollbar">
                                <li v-for="s in failed" :key="s.id" class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                        <img v-if="s.user?.profile_pic" :src="s.user.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ studentName(s.user) }}</div>
                                        <div class="text-[10px] text-gray-400">{{ formatAttemptMeta(s) }}</div>
                                    </div>
                                    <span class="text-sm font-bold text-rose-500 tabular-nums">{{ s.percentage }}%</span>
                                </li>
                                <li v-if="!failed.length" class="text-gray-400 text-sm text-center py-8">موردی نیست</li>
                            </ul>
                        </section>
                    </div>
                </div>

                <!-- Manual review -->
                <div v-else-if="tab === 'review'" class="space-y-4">
                    <AdminEmptyState v-if="!reviewQueue.length" message="تلاشی در انتظار تصحیح دستی نیست." />

                    <article
                        v-for="attempt in reviewQueue"
                        :key="attempt.id"
                        class="grid grid-cols-1 gap-4 items-start review-layout"
                    >
                        <!-- Mobile: compact student bar -->
                        <div class="admin-form-section space-y-3 lg:hidden">
                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300 shrink-0">
                                    <img
                                        v-if="attempt.user?.profile_pic"
                                        :src="attempt.user.profile_pic"
                                        class="w-full h-full object-cover"
                                        onerror="this.style.display='none'"
                                    />
                                    <span v-else>{{ studentInitial(attempt.user) }}</span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ studentName(attempt.user) }}</div>
                                    <div class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                        #{{ attempt.attempt_number || attempt.id }} · {{ reviewProgress(attempt) }}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="shrink-0 h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center"
                                    title="جزئیات دانشجو"
                                    @click="openReviewInfo(attempt.id)"
                                >
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                                        <path d="M12 11V16M12 8H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    @click="saveAllGrades(attempt)"
                                    :disabled="savingAttemptId === attempt.id"
                                    class="h-10 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                >
                                    ثبت همه
                                </button>
                                <button
                                    type="button"
                                    @click="finishReview(attempt)"
                                    :disabled="completingId === attempt.id || !canCompleteReview(attempt)"
                                    class="h-10 rounded-xl bg-sky-600 dark:bg-sky-500 font-bold text-xs text-white hover:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-50 transition-colors"
                                >
                                    {{ completingId === attempt.id ? '...' : 'انتشار' }}
                                </button>
                            </div>
                        </div>

                        <!-- Desktop: full user panel -->
                        <aside class="admin-form-section sticky top-4 space-y-4 hidden lg:block">
                            <div class="flex flex-col items-center text-center gap-3">
                                <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-300">
                                    <img
                                        v-if="attempt.user?.profile_pic"
                                        :src="attempt.user.profile_pic"
                                        class="w-full h-full object-cover"
                                        onerror="this.style.display='none'"
                                    />
                                    <span v-else>{{ studentInitial(attempt.user) }}</span>
                                </div>
                                <div class="min-w-0 w-full">
                                    <div class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ studentName(attempt.user) }}</div>
                                    <div v-if="attempt.user?.username" dir="ltr" class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                        @{{ attempt.user.username }}
                                    </div>
                                </div>
                                <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300">
                                    در انتظار تصحیح
                                </span>
                            </div>

                            <dl class="space-y-2 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
                                <div class="flex items-center justify-between gap-2">
                                    <dt class="text-gray-500 dark:text-gray-400">شماره تلاش</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">#{{ attempt.attempt_number || attempt.id }}</dd>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <dt class="text-gray-500 dark:text-gray-400">نمره فعلی</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                                        {{ attempt.score ?? 0 }} / {{ attempt.max_score ?? quiz?.total_score ?? '—' }}
                                    </dd>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <dt class="text-gray-500 dark:text-gray-400">پیشرفت تصحیح</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100 text-end">{{ reviewProgress(attempt) }}</dd>
                                </div>
                                <div v-if="attempt.submitted_at || attempt.completed_at" class="flex items-center justify-between gap-2">
                                    <dt class="text-gray-500 dark:text-gray-400">زمان ارسال</dt>
                                    <dd class="font-semibold text-gray-900 dark:text-gray-100 text-end">
                                        {{ formatDateTime(attempt.submitted_at || attempt.completed_at) }}
                                    </dd>
                                </div>
                            </dl>

                            <div class="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                                <p class="text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                                    پس از ثبت همه نمرات، نتیجه برای دانشجو منتشر می‌شود.
                                </p>
                                <button
                                    type="button"
                                    @click="saveAllGrades(attempt)"
                                    :disabled="savingAttemptId === attempt.id"
                                    class="w-full h-9 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                >
                                    ثبت همه نمرات
                                </button>
                                <button
                                    type="button"
                                    @click="finishReview(attempt)"
                                    :disabled="completingId === attempt.id || !canCompleteReview(attempt)"
                                    class="w-full h-9 rounded-xl bg-sky-600 dark:bg-sky-500 font-bold text-xs text-white hover:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-50 transition-colors"
                                >
                                    {{ completingId === attempt.id ? 'در حال انتشار...' : 'انتشار نتیجه' }}
                                </button>
                            </div>
                        </aside>

                        <!-- Questions panel -->
                        <div class="min-w-0 space-y-3">
                            <div
                                v-if="!manualAnswers(attempt).length && attempt.requires_manual_review"
                                class="admin-form-section space-y-3"
                            >
                                <p class="text-xs leading-6 text-sky-800 dark:text-sky-200">
                                    نمره سوالات خودکار محاسبه شده؛ پس از بررسی، نتیجه را منتشر کنید.
                                </p>
                                <div class="space-y-1.5">
                                    <div
                                        v-for="ans in attempt.answers || []"
                                        :key="ans.id"
                                        class="flex items-center justify-between gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 px-3 py-2 text-[11px]"
                                    >
                                        <span class="line-clamp-1 text-gray-700 dark:text-gray-200">{{ ans.question?.text }}</span>
                                        <span class="shrink-0 font-semibold tabular-nums text-gray-500 dark:text-gray-400">
                                            {{ ans.score ?? 0 }}/{{ ans.max_score ?? 0 }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-for="(ans, qIdx) in manualAnswers(attempt)"
                                :key="ans.id"
                                class="admin-form-section space-y-3 transition-colors"
                                :class="grades[ans.id]?.saved ? 'ring-1 ring-emerald-300/60 dark:ring-emerald-500/30' : ''"
                            >
                                <div class="flex items-start gap-3">
                                    <span class="shrink-0 w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                                        {{ qIdx + 1 }}
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-6">{{ ans.question?.text }}</p>
                                            <span
                                                v-if="grades[ans.id]?.saved"
                                                class="shrink-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md"
                                            >
                                                ثبت شد
                                            </span>
                                        </div>
                                        <div v-if="ans.question?.type" class="text-[10px] text-gray-400 mt-1">
                                            {{ questionTypeLabel(ans.question.type) }} · حداکثر {{ ans.max_score }} نمره
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5">پاسخ دانشجو</div>
                                    <div class="text-sm leading-7 text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-xl px-3 py-2.5 whitespace-pre-wrap">
                                        {{ answerText(ans) || '— پاسخی ثبت نشده —' }}
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center gap-2">
                                    <div class="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 p-0.5">
                                        <button
                                            type="button"
                                            @click="setCorrect(ans, true)"
                                            class="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                                            :class="grades[ans.id]?.is_correct === true
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'"
                                        >
                                            صحیح
                                        </button>
                                        <button
                                            type="button"
                                            @click="setCorrect(ans, false)"
                                            class="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                                            :class="grades[ans.id]?.is_correct === false
                                                ? 'bg-rose-500 text-white shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400'"
                                        >
                                            نادرست
                                        </button>
                                    </div>

                                    <div class="flex items-center gap-1.5 ms-auto text-xs text-gray-500 dark:text-gray-400">
                                        <span>نمره</span>
                                        <input
                                            type="number"
                                            min="0"
                                            :max="ans.max_score"
                                            step="0.25"
                                            v-model.number="grades[ans.id].score"
                                            class="w-16 h-9 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm text-center outline-none border border-gray-200 dark:border-gray-700 focus:border-sky-400 dark:focus:border-sky-500"
                                            @input="grades[ans.id].saved = false"
                                        />
                                        <span>/ {{ ans.max_score }}</span>
                                    </div>

                                    <button
                                        type="button"
                                        @click="saveGrade(ans)"
                                        :disabled="savingAnswerId === ans.id || grades[ans.id]?.is_correct === null"
                                        class="text-[11px] font-bold px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-40 transition-opacity"
                                    >
                                        {{ savingAnswerId === ans.id ? '...' : 'ثبت' }}
                                    </button>
                                </div>

                                <div>
                                    <label class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 block">
                                        پیام برای دانشجو (اختیاری)
                                    </label>
                                    <textarea
                                        v-model="grades[ans.id].comment"
                                        rows="2"
                                        placeholder="توضیح یا بازخورد برای دانشجو..."
                                        class="w-full resize-none rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs leading-6 px-3 py-2.5 outline-none border border-gray-200 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-sky-400 dark:focus:border-sky-500"
                                        @input="grades[ans.id].saved = false"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </article>

                    <!-- Mobile student details sheet -->
                    <div
                        v-if="reviewInfoAttempt"
                        class="fixed inset-0 z-[80] flex flex-col justify-end lg:hidden"
                    >
                        <button
                            type="button"
                            class="absolute inset-0 bg-gray-950/50"
                            aria-label="بستن"
                            @click="closeReviewInfo"
                        ></button>
                        <div class="relative max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                            <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">مشخصات دانشجو</h3>
                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    aria-label="بستن"
                                    @click="closeReviewInfo"
                                >
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="space-y-4 p-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center text-base font-bold text-gray-500 dark:text-gray-300 shrink-0">
                                        <img
                                            v-if="reviewInfoAttempt.user?.profile_pic"
                                            :src="reviewInfoAttempt.user.profile_pic"
                                            class="w-full h-full object-cover"
                                            onerror="this.style.display='none'"
                                        />
                                        <span v-else>{{ studentInitial(reviewInfoAttempt.user) }}</span>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ studentName(reviewInfoAttempt.user) }}</div>
                                        <div v-if="reviewInfoAttempt.user?.username" dir="ltr" class="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                            @{{ reviewInfoAttempt.user.username }}
                                        </div>
                                        <span class="mt-1 inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300">
                                            در انتظار تصحیح
                                        </span>
                                    </div>
                                </div>
                                <dl class="space-y-2.5 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
                                    <div class="flex items-center justify-between gap-2">
                                        <dt class="text-gray-500 dark:text-gray-400">شماره تلاش</dt>
                                        <dd class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">#{{ reviewInfoAttempt.attempt_number || reviewInfoAttempt.id }}</dd>
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                        <dt class="text-gray-500 dark:text-gray-400">نمره فعلی</dt>
                                        <dd class="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                                            {{ reviewInfoAttempt.score ?? 0 }} / {{ reviewInfoAttempt.max_score ?? quiz?.total_score ?? '—' }}
                                        </dd>
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                        <dt class="text-gray-500 dark:text-gray-400">پیشرفت تصحیح</dt>
                                        <dd class="font-semibold text-gray-900 dark:text-gray-100 text-end">{{ reviewProgress(reviewInfoAttempt) }}</dd>
                                    </div>
                                    <div v-if="reviewInfoAttempt.submitted_at || reviewInfoAttempt.completed_at" class="flex items-center justify-between gap-2">
                                        <dt class="text-gray-500 dark:text-gray-400">زمان ارسال</dt>
                                        <dd class="font-semibold text-gray-900 dark:text-gray-100 text-end">
                                            {{ formatDateTime(reviewInfoAttempt.submitted_at || reviewInfoAttempt.completed_at) }}
                                        </dd>
                                    </div>
                                </dl>
                                <p class="text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                                    پس از ثبت همه نمرات، نتیجه برای دانشجو منتشر می‌شود.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import AdminInlineLoading from '@/views/components/admin/AdminInlineLoading.vue';
import AdminEmptyState from '@/views/components/admin/AdminEmptyState.vue';
import AdminReportStatCard from '@/views/components/admin/report/AdminReportStatCard.vue';
import AdminQuizAttachIcon from '@/views/components/admin/quiz/AdminQuizAttachIcon.vue';
import { BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import { ADMIN_TAB_LIST, ADMIN_TAB_BADGE, adminTabButtonClass } from '@/views/components/admin/adminTabStyles.js';
import {
    getQuiz, getQuizReportSummary, getQuizPassedStudents, getQuizFailedStudents,
    getQuizReviewQueue, gradeAttemptAnswer, gradeAttemptAnswers, completeAttemptReview,
    QUESTION_TYPE_LABELS, QUIZZABLE_TYPES,
} from '@/services/quiz.service';
import { showToastSuccess, showToastError, showToastWarning } from '@/utils/toastConfig';

const RESULT_LABELS = {
    immediately: 'بلافاصله پس از اتمام',
    after_review: 'پس از تصحیح دستی',
    after_end: 'پس از پایان بازه آزمون',
};

export default {
    components: {
        AdminMasterPage, AdminInlineLoading, AdminEmptyState,
        AdminReportStatCard, AdminQuizAttachIcon,
    },
    props: { id: { type: [String, Number], required: true } },
    data() {
        return {
            BTN_SECONDARY,
            ADMIN_TAB_LIST,
            ADMIN_TAB_BADGE,
            tab: 'overview',
            tabs: [
                { id: 'overview', label: 'مشخصات آزمون' },
                { id: 'report', label: 'گزارشات' },
                { id: 'review', label: 'تصحیح دستی' },
            ],
            loading: false,
            quiz: null,
            summary: null,
            distribution: [],
            passed: [],
            failed: [],
            reviewQueue: [],
            grades: {},
            savingAnswerId: null,
            savingAttemptId: null,
            completingId: null,
            reviewInfoAttemptId: null,
        };
    },
    computed: {
        reviewInfoAttempt() {
            if (!this.reviewInfoAttemptId) return null;
            return this.reviewQueue.find(a => a.id === this.reviewInfoAttemptId) || null;
        },
        quizAttachType() {
            if (!this.quiz?.quizzable_type) return 'standalone';
            return this.quiz.quizzable_type.split('\\').pop()?.toLowerCase() || 'standalone';
        },
        attachLabel() {
            if (!this.quiz?.quizzable) return 'آزمون مستقل';
            const t = this.quizAttachType;
            return (QUIZZABLE_TYPES[t] ? `متصل به ${QUIZZABLE_TYPES[t]}` : 'متصل') + ': ' + (this.quiz.quizzable.title || '');
        },
        quizQuestions() {
            return this.quiz?.questions || [];
        },
        scoringRows() {
            if (!this.quiz) return [];
            return [
                { label: 'حداقل نمره قبولی', value: this.quiz.passing_score ?? '—' },
                { label: 'حداقل درصد قبولی', value: this.quiz.passing_percentage != null ? `${this.quiz.passing_percentage}%` : '—' },
                { label: 'نمره کل آزمون', value: this.quiz.total_score ?? 0 },
                { label: 'حداکثر تلاش', value: this.quiz.max_attempts ?? 'نامحدود' },
            ];
        },
        behaviorRows() {
            if (!this.quiz) return [];
            return [
                { label: 'نمایش نتیجه', value: RESULT_LABELS[this.quiz.result_display] || this.quiz.result_display || '—' },
                { label: 'تصحیح دستی', value: this.quiz.manual_review_required ? 'فعال' : 'غیرفعال' },
                { label: 'نمایش پاسخ صحیح', value: this.quiz.show_correct_answers ? 'بله' : 'خیر' },
                { label: 'نمایش سوالات در نتیجه', value: this.quiz.show_questions_in_result !== false ? 'بله' : 'خیر' },
                { label: 'ترتیب تصادفی سوالات', value: this.quiz.randomize_questions ? 'بله' : 'خیر' },
                { label: 'نمره منفی', value: this.quiz.negative_scoring ? `فعال (${this.quiz.negative_scoring_factor ?? 0})` : 'خیر' },
                { label: 'شروع دسترسی', value: this.formatDateTime(this.quiz.start_at) },
                { label: 'پایان دسترسی', value: this.formatDateTime(this.quiz.end_at) },
            ];
        },
    },
    mounted() { this.load(); },
    methods: {
        adminTabButtonClass,
        openReviewInfo(attemptId) {
            this.reviewInfoAttemptId = attemptId;
        },
        closeReviewInfo() {
            this.reviewInfoAttemptId = null;
        },
        formatNumber(v) {
            return Number(v || 0).toLocaleString('fa-IR');
        },
        formatTimeLimit(seconds) {
            if (!seconds) return '∞';
            return `${Math.round(seconds / 60).toLocaleString('fa-IR')}′`;
        },
        formatDuration(seconds) {
            if (!seconds) return '۰';
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return m ? `${m}د ${s}ث` : `${s}ث`;
        },
        formatDateTime(v) {
            if (!v) return '—';
            try {
                return new Date(v).toLocaleString('fa-IR');
            } catch {
                return v;
            }
        },
        questionTypeLabel(type) {
            return QUESTION_TYPE_LABELS[type] || type;
        },
        studentName(user) {
            if (!user) return '—';
            return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || '—';
        },
        studentInitial(user) {
            const n = this.studentName(user);
            return n !== '—' ? n.charAt(0) : '?';
        },
        formatAttemptMeta(attempt) {
            const parts = [];
            if (attempt.score != null && attempt.max_score != null) {
                parts.push(`${attempt.score}/${attempt.max_score}`);
            }
            if (attempt.completed_at) {
                parts.push(new Date(attempt.completed_at).toLocaleDateString('fa-IR'));
            }
            return parts.join(' · ') || '—';
        },
        bucketHeight(bucket) {
            const max = Math.max(...this.distribution.map(b => b.count), 1);
            const pct = Math.round((bucket.count / max) * 100);
            return Math.max(pct, bucket.count > 0 ? 8 : 2) + '%';
        },
        manualAnswers(attempt) {
            return (attempt.answers || []).filter(a => a.needs_manual_review);
        },
        answerText(ans) {
            const a = ans.answer;
            if (!a) return '';
            if (typeof a === 'string') return a;
            return a.text || a.value || JSON.stringify(a);
        },
        prepareGrades() {
            const map = {};
            this.reviewQueue.forEach(attempt => {
                this.manualAnswers(attempt).forEach(ans => {
                    map[ans.id] = {
                        is_correct: ans.is_correct === true ? true : (ans.is_correct === false ? false : null),
                        score: ans.score != null ? Number(ans.score) : Number(ans.max_score || 0),
                        comment: ans.reviewer_comment || '',
                        saved: !ans.needs_manual_review && ans.is_correct !== null,
                    };
                });
            });
            this.grades = map;
        },
        setCorrect(ans, value) {
            const g = this.grades[ans.id];
            if (!g) return;
            g.is_correct = value;
            g.saved = false;
            if (value) {
                g.score = Number(ans.max_score || 0);
            } else {
                g.score = 0;
            }
        },
        reviewProgress(attempt) {
            const all = this.manualAnswers(attempt);
            if (!all.length) {
                return attempt.requires_manual_review ? 'آماده انتشار نتیجه' : '—';
            }
            const done = all.filter(a => this.grades[a.id]?.saved).length;
            return `${done} از ${all.length} سوال تصحیح‌شده`;
        },
        canCompleteReview(attempt) {
            const all = this.manualAnswers(attempt);
            if (!all.length) {
                return !!attempt.requires_manual_review;
            }
            return all.every(a => this.grades[a.id]?.saved);
        },
        async load() {
            this.loading = true;
            try {
                const [quizRes, report, passedRes, failedRes, reviewRes] = await Promise.all([
                    getQuiz(this.id),
                    getQuizReportSummary(this.id),
                    getQuizPassedStudents(this.id, { perPage: 30 }),
                    getQuizFailedStudents(this.id, { perPage: 30 }),
                    getQuizReviewQueue(this.id),
                ]);
                this.quiz = quizRes.quiz;
                this.summary = report.summary;
                this.distribution = report.distribution || [];
                this.passed = passedRes.students?.data || [];
                this.failed = failedRes.students?.data || [];
                this.reviewQueue = reviewRes.attempts?.data || reviewRes.attempts || [];
                this.prepareGrades();
                if (this.reviewQueue.length > 0 && this.$route.query.tab === 'review') {
                    this.tab = 'review';
                }
            } catch {
                showToastError('بارگذاری اطلاعات آزمون با خطا مواجه شد.');
            } finally {
                this.loading = false;
            }
        },
        applyGradeResponse(ans, g, res) {
            g.saved = true;
            if (res?.answer) {
                Object.assign(ans, res.answer);
                g.comment = ans.reviewer_comment || g.comment;
            } else {
                ans.needs_manual_review = false;
                ans.is_correct = g.is_correct;
                ans.score = g.score;
                ans.reviewer_comment = g.comment || null;
            }
        },
        async persistGrade(ans) {
            const g = this.grades[ans.id];
            if (!g || g.is_correct === null) {
                throw new Error('missing_verdict');
            }
            const res = await gradeAttemptAnswer(ans.id, {
                is_correct: !!g.is_correct,
                score: g.score,
                comment: g.comment || null,
            });
            this.applyGradeResponse(ans, g, res);
            return res;
        },
        async saveGrade(ans) {
            const g = this.grades[ans.id];
            if (!g || g.is_correct === null) {
                showToastWarning('ابتدا صحیح یا نادرست بودن پاسخ را مشخص کنید.');
                return;
            }
            this.savingAnswerId = ans.id;
            try {
                await this.persistGrade(ans);
                showToastSuccess('نمره سوال برای دانشجو ثبت شد.');
            } catch {
                showToastError('ثبت نمره با خطا مواجه شد.');
            } finally {
                this.savingAnswerId = null;
            }
        },
        async saveAllGrades(attempt) {
            const pending = this.manualAnswers(attempt).filter(a => !this.grades[a.id]?.saved);
            if (!pending.length) {
                showToastWarning('همه سوالات قبلاً ثبت شده‌اند.');
                return;
            }
            const missingVerdict = pending.filter(a => this.grades[a.id]?.is_correct === null);
            if (missingVerdict.length) {
                showToastWarning('برای همه سوالات، صحیح یا نادرست را انتخاب کنید.');
                return;
            }
            this.savingAttemptId = attempt.id;
            try {
                const res = await gradeAttemptAnswers(attempt.id, pending.map(ans => {
                    const g = this.grades[ans.id];
                    return {
                        answer_id: ans.id,
                        is_correct: !!g.is_correct,
                        score: g.score,
                        comment: g.comment || null,
                    };
                }));
                const byId = Object.fromEntries((res.answers || []).map(a => [a.id, a]));
                pending.forEach(ans => {
                    this.applyGradeResponse(ans, this.grades[ans.id], { answer: byId[ans.id] });
                });
                if (res.attempt) {
                    Object.assign(attempt, {
                        score: res.attempt.score,
                        max_score: res.attempt.max_score,
                        percentage: res.attempt.percentage,
                    });
                }
                showToastSuccess(`${pending.length} نمره با موفقیت ثبت شد.`);
            } catch {
                showToastError('ثبت گروهی نمرات با خطا مواجه شد. دوباره تلاش کنید.');
            } finally {
                this.savingAttemptId = null;
            }
        },
        async finishReview(attempt) {
            if (!this.canCompleteReview(attempt)) {
                showToastWarning('ابتدا نمره همه سوالات نیازمند تصحیح را ثبت کنید.');
                return;
            }
            this.completingId = attempt.id;
            try {
                await completeAttemptReview(attempt.id);
                showToastSuccess('تصحیح نهایی شد و نتیجه برای دانشجو منتشر شد.');
                this.reviewQueue = this.reviewQueue.filter(a => a.id !== attempt.id);
                const report = await getQuizReportSummary(this.id);
                this.summary = report.summary;
                this.distribution = report.distribution || [];
                const [passedRes, failedRes] = await Promise.all([
                    getQuizPassedStudents(this.id, { perPage: 30 }),
                    getQuizFailedStudents(this.id, { perPage: 30 }),
                ]);
                this.passed = passedRes.students?.data || [];
                this.failed = failedRes.students?.data || [];
            } catch (e) {
                const msg = e?.response?.data?.message || 'نهایی‌سازی تصحیح با خطا مواجه شد.';
                showToastError(msg);
            } finally {
                this.completingId = null;
            }
        },
    },
};
</script>

<style scoped>
.admin-form-section {
    @apply rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm;
}

@media (min-width: 1024px) {
    .review-layout {
        grid-template-columns: 16rem minmax(0, 1fr);
    }
}
</style>
