<template>
    <div class="space-y-4">
        <!-- Step 1: Basic -->
        <section v-show="stepId === 'basic'" class="admin-form-section">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div class="space-y-4">
                    <div>
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه پلن</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">عنوان، مدت و قیمت اشتراک را مشخص کنید</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="field-label">عنوان <span class="text-rose-500">*</span></label>
                            <input v-model="root.form.title" type="text" class="form-input" :class="{ 'ring-2 ring-rose-500': errorAt('title') }" />
                            <span v-if="errorAt('title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('title')[0] }}</span>
                        </div>
                        <div class="md:col-span-2">
                            <label class="field-label">عنوان انگلیسی <span class="text-rose-500">*</span></label>
                            <input v-model="root.form.english_title" type="text" dir="ltr" class="form-input font-sans" :class="{ 'ring-2 ring-rose-500': errorAt('english_title') }" />
                            <span v-if="errorAt('english_title')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('english_title')[0] }}</span>
                        </div>
                        <div>
                            <label class="field-label">مدت (روز) <span class="text-rose-500">*</span></label>
                            <input v-model.number="root.form.period_time" type="number" min="1" class="form-input font-anjoman" :class="{ 'ring-2 ring-rose-500': errorAt('period_time') }" />
                            <span v-if="errorAt('period_time')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('period_time')[0] }}</span>
                        </div>
                        <div>
                            <label class="field-label">قیمت (تومان) <span class="text-rose-500">*</span></label>
                            <input v-model.number="root.form.price" type="number" min="0" class="form-input font-anjoman" :class="{ 'ring-2 ring-rose-500': errorAt('price') }" />
                            <span v-if="errorAt('price')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('price')[0] }}</span>
                        </div>
                    </div>
                </div>

                <div class="hidden lg:flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-amber-50/40 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/30 border border-gray-100 dark:border-gray-800 p-4 min-h-[240px]">
                    <PlanIllustration />
                </div>
            </div>

            <div class="lg:hidden mt-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-amber-50/40 dark:from-gray-800/40 dark:to-gray-900/30 border border-gray-100 dark:border-gray-800 p-3">
                <PlanIllustration />
            </div>
        </section>

        <!-- Step 2: Settings -->
        <section v-show="stepId === 'settings'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تنظیمات نمایش</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">آیکن، وضعیت فعال بودن و برچسب محبوب</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="field-label">آیکن (URL)</label>
                    <input v-model="root.form.icon" type="text" dir="ltr" class="form-input text-sm" :class="{ 'ring-2 ring-rose-500': errorAt('icon') }" placeholder="https://..." />
                    <span v-if="errorAt('icon')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('icon')[0] }}</span>
                    <div v-if="root.form.icon" class="mt-3 inline-flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 px-3 py-2">
                        <img :src="root.form.icon" alt="" class="w-10 h-10 rounded-lg object-cover bg-white" onerror="this.style.display='none'" />
                        <span class="text-[11px] text-gray-500 truncate max-w-[12rem]" dir="ltr">{{ root.form.icon }}</span>
                    </div>
                </div>

                <div>
                    <label class="field-label">وضعیت</label>
                    <ul class="h-10 grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                        <li>
                            <input v-model="root.form.status" type="radio" :id="`${uid}-status-off`" :value="false" class="hidden peer" />
                            <label :for="`${uid}-status-off`" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400 transition-colors">غیرفعال</label>
                        </li>
                        <li>
                            <input v-model="root.form.status" type="radio" :id="`${uid}-status-on`" :value="true" class="hidden peer" />
                            <label :for="`${uid}-status-on`" class="h-full inline-flex items-center justify-center w-full text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400 transition-colors">فعال</label>
                        </li>
                    </ul>
                </div>

                <div class="flex items-end">
                    <label class="flex items-center gap-2 cursor-pointer rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 px-3 py-2.5 w-full">
                        <input v-model="root.form.popular" type="checkbox" class="custom-checkbox" :class="root.form.popular ? 'is-checked' : ''" />
                        <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">ثبت به عنوان پلن محبوب</span>
                    </label>
                </div>
            </div>

            <AdminInstallmentToggle
                v-model="root.form.allows_installment"
                :title="$t('admin.installment.title')"
                :description="$t('admin.installment.desc')"
            />
        </section>

        <!-- Step 3: Content -->
        <section v-show="stepId === 'content'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">محتوا و ویژگی‌ها</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">توضیحات پلن و لیست مزایا (حداکثر ۵ مورد)</p>
            </div>

            <div>
                <label class="field-label">توضیحات</label>
                <textarea v-model="root.form.description" rows="4" class="form-input resize-none" :class="{ 'ring-2 ring-rose-500': errorAt('description') }" />
                <span v-if="errorAt('description')" class="mt-1 text-rose-500 text-xs font-medium block">{{ errorAt('description')[0] }}</span>
            </div>

            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="field-label mb-0">ویژگی‌ها</label>
                    <span class="text-[11px] font-medium text-gray-400">{{ root.features.length }}/5</span>
                </div>
                <div class="space-y-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-3">
                    <div v-for="(feat, i) in root.features" :key="i" class="flex items-center gap-2">
                        <input v-model="root.features[i]" type="text" class="form-input" placeholder="مثلاً دسترسی به همه دوره‌ها" />
                        <button type="button" @click="root.removeFeature(i)" class="shrink-0 p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <button type="button" @click="root.addFeature()" :disabled="root.features.length >= 5"
                        class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline disabled:opacity-40 disabled:no-underline">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        افزودن ویژگی
                    </button>
                    <span v-if="errorAt('features')" class="text-rose-500 text-xs font-medium block">{{ errorAt('features')[0] }}</span>
                    <span v-if="errorAt('features.0')" class="text-rose-500 text-xs font-medium block">{{ errorAt('features.0')[0] }}</span>
                </div>
            </div>
        </section>

        <!-- Step 4: Confirm -->
        <section v-show="stepId === 'confirm'" class="admin-form-section space-y-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تایید و ثبت</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">خلاصه پلن را بررسی کنید</p>
            </div>

            <div class="rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                <div class="px-4 py-3 bg-gray-50/80 dark:bg-gray-800/40">
                    <p class="text-[10px] font-semibold text-gray-400 mb-1">عنوان</p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ root.form.title || '—' }}</p>
                    <p v-if="root.form.english_title" class="text-xs text-gray-500 font-sans mt-0.5" dir="ltr">{{ root.form.english_title }}</p>
                </div>

                <div class="px-4 py-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span class="text-gray-400">مدت</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5 font-anjoman">{{ root.form.period_time || '—' }} روز</p>
                    </div>
                    <div>
                        <span class="text-gray-400">قیمت</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5 font-anjoman flex items-center gap-1">
                            {{ root.formatCurrency(root.form.price) }}
                            <img :src="tomanIcon" alt="" class="w-3 h-3 opacity-60" />
                        </p>
                    </div>
                    <div>
                        <span class="text-gray-400">وضعیت</span>
                        <p class="font-semibold mt-0.5" :class="root.form.status ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'">{{ root.form.status ? 'فعال' : 'غیرفعال' }}</p>
                    </div>
                    <div>
                        <span class="text-gray-400">محبوب</span>
                        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-0.5">{{ root.form.popular ? 'بله' : 'خیر' }}</p>
                    </div>
                </div>

                <div v-if="root.form.description" class="px-4 py-3">
                    <p class="text-[10px] font-semibold text-gray-400 mb-1">توضیحات</p>
                    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{{ root.form.description }}</p>
                </div>

                <div v-if="filledFeatures.length" class="px-4 py-3">
                    <p class="text-[10px] font-semibold text-gray-400 mb-2">ویژگی‌ها</p>
                    <ul class="space-y-1.5">
                        <li v-for="(feat, i) in filledFeatures" :key="i" class="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <span class="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                            {{ feat }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="flex justify-end">
                <router-link :to="{ name: 'admin-plans-list' }" class="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2">
                    انصراف و بازگشت به لیست
                </router-link>
            </div>
        </section>
    </div>
</template>

<script>
import PlanIllustration from '@/views/components/plan/PlanIllustration.vue';
import AdminInstallmentToggle from '@/views/components/admin/AdminInstallmentToggle.vue';
import tomanIcon from '@/assets/image/svg/Toman.svg';

export default {
    name: 'PlanFormSections',
    components: { PlanIllustration, AdminInstallmentToggle },
    props: {
        stepId: { type: String, required: true },
    },
    inject: {
        planFormRoot: { default: null },
    },
    data() {
        return {
            tomanIcon,
            uid: `plan-${Math.random().toString(36).slice(2, 9)}`,
        };
    },
    computed: {
        root() {
            return this.planFormRoot;
        },
        filledFeatures() {
            return (this.root?.features || [])
                .map((f) => (typeof f === 'string' ? f.trim() : ''))
                .filter(Boolean);
        },
    },
    methods: {
        errorAt(path) {
            return this.root?.errorAt(path);
        },
    },
};
</script>
