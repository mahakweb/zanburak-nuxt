<template>
    <BottomSheetDrawer
        :model-value="open"
        :initial-height="0.55"
        :min-height="0.35"
        :max-height="0.85"
        :fit-content="true"
        backdrop-z-class="z-[2000000030]"
        panel-z-class="z-[2000000040]"
        panel-class="bg-white dark:bg-gray-900 border-t border-gray-200/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[28rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]"
        content-class="px-5 pb-6 overflow-auto custom-scrollbar"
        backdrop-class="bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm"
        @update:modelValue="(v) => { if (!v) close(); }"
        @close="close"
    >
        <div class="shrink-0 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-400/20 flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 7L8 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 7L13 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18 10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 14H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="min-w-0">
                    <h3 class="text-base font-extrabold text-gray-900 dark:text-gray-50">{{ $t('tags.addTagTitle') }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{{ questionSubject }}</p>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('tags.currentTags') }}</span>
                <span class="text-xs font-semibold text-gray-400">{{ localTags.length }}/3</span>
            </div>
            <div v-if="localTags.length" class="flex flex-wrap gap-2 mb-4">
                <span
                    v-for="(tag, index) in localTags"
                    :key="tag.id || tag.slug || tag.name"
                    class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs font-bold border border-gray-200 dark:border-gray-700">
                    # {{ tag.name }}
                    <button type="button" @click="removeLocalTag(index)" class="text-gray-400 hover:text-rose-500 transition" :aria-label="$t('tags.removeTag')">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </span>
            </div>
            <p v-else class="text-xs text-gray-400 dark:text-gray-500 mb-4">{{ $t('tags.noCurrentTags') }}</p>
        </div>

        <template v-if="remainingSlots > 0">
            <div class="relative">
                <svg class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <input
                    ref="searchInput"
                    v-model="searchQuery"
                    @input="onSearchInput"
                    @keydown.enter.prevent="addFromSearch"
                    type="search"
                    :placeholder="$t('tags.addTagPlaceholder')"
                    :maxlength="TAG_MAX_LENGTH"
                    class="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ps-9 pe-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    :class="tagInputError ? 'border-rose-400 focus:ring-rose-400' : ''"
                />
            </div>
            <p v-if="tagInputError" class="mt-1.5 text-xs font-semibold text-rose-500">{{ tagInputError }}</p>
            <p v-else class="mt-1.5 text-xs text-gray-400">{{ $t('tags.addTagHint', { count: remainingSlots }) }}</p>
            <p class="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{{ $t('tags.tagFormatHint') }}</p>

            <div v-if="selectedNewTags.length" class="mt-3 flex flex-wrap gap-2">
                <span
                    v-for="(tag, i) in selectedNewTags"
                    :key="tag"
                    class="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-400/30">
                    # {{ tag }}
                    <button type="button" @click="removeSelected(i)" class="hover:text-rose-500 transition">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </span>
            </div>

            <div v-if="searchLoading" class="py-4 flex justify-center">
                <svg class="w-5 h-5 text-amber-400 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
            </div>

            <div v-else-if="suggestions.length" class="mt-3 space-y-1">
                <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{{ $t('tags.suggestedTags') }}</p>
                <button
                    v-for="tag in suggestions"
                    :key="tag.id"
                    type="button"
                    @click="selectSuggestion(tag)"
                    :disabled="isTagDisabled(tag.name)"
                    :class="isTagDisabled(tag.name)
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
                    class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 transition">
                    <span class="truncate"># {{ tag.name }}</span>
                    <span class="text-xs text-gray-400 shrink-0">{{ $t('tags.questionsCount', { count: tag.questions_count || 0 }) }}</span>
                </button>
            </div>

            <button
                v-if="searchQuery.trim() && !suggestions.some(t => t.name.toLowerCase() === searchQuery.trim().toLowerCase())"
                type="button"
                @click="addFromSearch"
                :disabled="isTagDisabled(searchQuery.trim())"
                class="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10 transition disabled:opacity-40">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ $t('tags.createTag', { name: searchQuery.trim() }) }}
            </button>

            <span v-if="errors && errors.tags" class="mt-3 block text-red-500 text-xs font-semibold">{{ errors.tags[0] }}</span>
            <div v-for="(messages, key) in errors || {}" :key="key">
                <template v-if="key.startsWith('tags.')">
                    <span v-for="(message, index) in messages" :key="index" class="mt-1 block text-red-500 text-xs font-semibold">
                        {{ message }}
                    </span>
                </template>
            </div>
        </template>

        <div v-else-if="!hasChanges" class="py-4 text-center">
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">{{ $t('tags.maxTagsReached') }}</p>
        </div>

        <div class="mt-5 flex items-center gap-3">
            <button
                type="button"
                @click="close"
                class="flex-1 h-11 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {{ $t('discuss.common.cancel') }}
            </button>
            <button
                type="button"
                @click="saveTags"
                :disabled="saving || !hasChanges"
                class="flex-1 h-11 rounded-xl text-sm font-bold text-gray-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition flex items-center justify-center gap-2">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {{ $t('tags.saveTags') }}
            </button>
        </div>
    </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { tagService } from "@/services/tag.service";
import { toast } from "vue3-toastify";
import { sanitizeTagInput, validateTagName, TAG_MAX_LENGTH } from "@/utils/tagFormat";

export default {
    components: { BottomSheetDrawer },
    props: {
        open: { type: Boolean, default: false },
        questionSlug: { type: String, required: true },
        questionSubject: { type: String, default: "" },
        tags: { type: Array, default: () => [] },
    },
    emits: ["close", "updated"],
    data() {
        return {
            TAG_MAX_LENGTH,
            searchQuery: "",
            searchTimer: null,
            searchLoading: false,
            suggestions: [],
            selectedNewTags: [],
            localTags: [],
            saving: false,
            errors: null,
            tagInputError: null,
        };
    },
    computed: {
        remainingSlots() {
            return Math.max(0, 3 - this.localTags.length - this.selectedNewTags.length);
        },
        existingNamesLower() {
            return [
                ...this.localTags.map((t) => (t.name || "").toLowerCase()),
                ...this.selectedNewTags.map((t) => t.toLowerCase()),
            ];
        },
        finalTagNames() {
            return [
                ...this.localTags.map((t) => t.name),
                ...this.selectedNewTags,
            ];
        },
        hasChanges() {
            const original = (this.tags || []).map((t) => t.name).join("|");
            const current = this.finalTagNames.join("|");
            return original !== current;
        },
    },
    watch: {
        open(val) {
            if (val) {
                this.reset();
                this.$nextTick(() => this.$refs.searchInput?.focus());
            }
        },
    },
    methods: {
        close() {
            this.$emit("close");
        },
        reset() {
            this.searchQuery = "";
            this.suggestions = [];
            this.selectedNewTags = [];
            this.localTags = (this.tags || []).map((t) => ({ ...t }));
            this.errors = null;
            this.tagInputError = null;
            this.saving = false;
            clearTimeout(this.searchTimer);
        },
        removeLocalTag(index) {
            this.localTags.splice(index, 1);
        },
        isTagDisabled(name) {
            const lower = (name || "").trim().toLowerCase();
            if (!lower) return true;
            if (validateTagName(name, this.$t.bind(this))) return true;
            return this.existingNamesLower.includes(lower) || this.remainingSlots <= 0;
        },
        onSearchInput() {
            this.searchQuery = sanitizeTagInput(this.searchQuery);
            this.tagInputError = this.searchQuery.trim()
                ? validateTagName(this.searchQuery.trim(), this.$t.bind(this))
                : null;
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.fetchSuggestions(), 350);
        },
        async fetchSuggestions() {
            const q = this.searchQuery.trim();
            if (!q || validateTagName(q, this.$t.bind(this))) {
                this.suggestions = [];
                return;
            }
            this.searchLoading = true;
            try {
                const response = await tagService.list({ search: q, sort: "popular", perPage: 8, page: 1 });
                this.suggestions = response.data.tags || [];
            } catch {
                this.suggestions = [];
            } finally {
                this.searchLoading = false;
            }
        },
        selectSuggestion(tag) {
            if (this.isTagDisabled(tag.name)) return;
            if (this.remainingSlots <= 0) return;
            this.selectedNewTags.push(tag.name);
            this.searchQuery = "";
            this.tagInputError = null;
            this.suggestions = [];
        },
        addFromSearch() {
            const name = this.searchQuery.trim();
            const error = validateTagName(name, this.$t.bind(this));
            if (error) {
                this.tagInputError = error;
                return;
            }
            if (this.isTagDisabled(name)) return;
            if (this.remainingSlots <= 0) return;
            this.selectedNewTags.push(name);
            this.searchQuery = "";
            this.tagInputError = null;
            this.suggestions = [];
        },
        removeSelected(index) {
            this.selectedNewTags.splice(index, 1);
        },
        async saveTags() {
            if (!this.hasChanges || this.saving) return;
            this.saving = true;
            this.errors = null;
            try {
                const response = await tagService.syncQuestionTags(this.questionSlug, this.finalTagNames);
                toast.success(this.$t("tags.addTagSuccess"), {
                    theme: "colored",
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.$emit("updated", response.data.tags);
                this.close();
            } catch (error) {
                this.errors = error.response?.data?.errors || { tags: [this.$t("tags.addTagError")] };
            } finally {
                this.saving = false;
            }
        },
    },
    beforeUnmount() {
        clearTimeout(this.searchTimer);
    },
};
</script>
