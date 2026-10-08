<script setup>
definePageMeta({
  name: "admin-inbox",
  middleware: ['auth'],
})
</script>

<template>
    <AdminMasterPage>
        <div class="mail-client -mx-2 md:-mx-4 flex flex-col h-[calc(100vh-6.5rem)] min-h-[640px] bg-[#f4f7f6] dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800">
            <!-- Top bar (hidden on mobile while reading a message) -->
            <div
                class="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                :class="showMobileDetail ? 'hidden md:flex' : ''"
            >
                <div class="flex items-center gap-3 min-w-0">
                    <h1 class="text-lg font-bold text-gray-900 dark:text-white shrink-0">صندوق ایمیل</h1>
                    <select
                        v-model="selectedAccountKey"
                        @change="onAccountChange"
                        class="h-9 min-w-0 max-w-[52vw] sm:min-w-[180px] rounded-xl border-0 bg-gray-100 dark:bg-gray-800 text-sm px-3 focus:ring-2 focus:ring-teal-500"
                    >
                        <option v-for="acc in accounts" :key="acc.key" :value="acc.key" :disabled="!acc.is_configured">
                            {{ acc.label }} — {{ acc.address }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        v-if="canSend"
                        @click="openCompose"
                        class="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold"
                    >
                        <span>+</span> پیام جدید
                    </button>
                    <button @click="refreshAll" :disabled="loading" class="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200">
                        <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none"><path d="M12 4V2M12 22V20M4.93 4.93L3.52 3.52M20.48 20.48L19.07 19.07M4 12H2M22 12H20M4.93 19.07L3.52 20.48M20.48 3.52L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                </div>
            </div>

            <div v-if="configError" class="mx-4 mt-3 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm border border-rose-100">
                {{ configError }}
            </div>

            <div class="mail-workspace relative flex flex-1 min-h-0 overflow-hidden">
                <!-- Sidebar folders -->
                <aside class="hidden lg:flex w-56 xl:w-60 flex-col bg-white dark:bg-gray-900 border-e border-gray-100 dark:border-gray-800">
                    <button
                        v-if="canSend"
                        @click="openCompose"
                        class="m-3 flex items-center justify-center gap-2 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold"
                    >
                        + پیام جدید
                    </button>

                    <nav class="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-0.5">
                        <button
                            v-for="folder in primaryFolders"
                            :key="folder.path"
                            @click="selectFolder(folder)"
                            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition"
                            :class="selectedFolder?.path === folder.path ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
                        >
                            <span class="flex items-center gap-2">
                                <span v-if="folder.unread > 0" class="w-2 h-2 rounded-full bg-teal-500"></span>
                                <span v-else class="w-2 h-2 rounded-full" :class="folderDotClass(folder.type)"></span>
                                {{ folder.label }}
                            </span>
                            <span v-if="folder.unread > 0" class="min-w-[20px] h-5 px-1.5 rounded-full bg-teal-500 text-white text-[11px] font-bold flex items-center justify-center">
                                {{ folder.unread }}
                            </span>
                        </button>

                        <div v-if="otherFolders.length" class="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                            <p class="px-3 text-[11px] font-semibold text-gray-400 uppercase mb-1">سایر پوشه‌ها</p>
                            <button
                                v-for="folder in otherFolders"
                                :key="folder.path"
                                @click="selectFolder(folder)"
                                class="w-full text-start px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 truncate"
                                :class="selectedFolder?.path === folder.path ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''"
                            >
                                {{ folder.name }}
                            </button>
                        </div>
                    </nav>
                </aside>

                <!-- Message list -->
                <section
                    class="mail-list w-full lg:w-80 xl:w-96 flex flex-col bg-white dark:bg-gray-900 border-e border-gray-100 dark:border-gray-800 min-h-0 transition-opacity duration-300"
                    :class="showMobileDetail ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'"
                >
                    <div class="p-3 border-b border-gray-100 dark:border-gray-800 space-y-2">
                        <div class="lg:hidden">
                            <select v-model="mobileFolderPath" @change="onMobileFolderChange" class="w-full h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm px-3">
                                <option v-for="f in folders" :key="f.path" :value="f.path">{{ f.label || f.name }}</option>
                            </select>
                        </div>
                        <div class="relative">
                            <input
                                v-model="searchQuery"
                                @input="debounceSearch"
                                type="text"
                                placeholder="جستجو..."
                                class="w-full h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 ps-9 pe-3 text-sm focus:ring-2 focus:ring-teal-500"
                            />
                            <svg class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg>
                        </div>
                        <div class="flex gap-1">
                            <button v-for="f in filterTabs" :key="f.value" @click="setFilter(f.value)"
                                class="flex-1 h-8 rounded-lg text-xs font-medium"
                                :class="selectedFilter === f.value ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'">
                                {{ f.label }}
                            </button>
                        </div>
                    </div>

                    <div v-if="loadingList && !messages.length" class="flex-1 flex items-center justify-center">
                        <span class="loading loading-spinner text-teal-500"></span>
                    </div>
                    <div
                        v-else
                        ref="messageList"
                        class="flex-1 overflow-y-auto custom-scrollbar"
                        @scroll="onListScroll"
                    >
                        <button
                            v-for="msg in messages"
                            :key="`${msg.folder}-${msg.uid}`"
                            @click="openMessage(msg)"
                            class="w-full text-start px-3 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-teal-50/40 dark:hover:bg-gray-800/60 transition active:bg-teal-50 dark:active:bg-gray-800"
                            :class="isSelected(msg) ? 'bg-teal-50 dark:bg-gray-800' : ''"
                        >
                            <div class="flex gap-3">
                                <div class="w-10 h-10 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    :class="msg.is_outgoing ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'">
                                    {{ avatarLetters(msg) }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center justify-between gap-2">
                                        <p class="text-sm truncate" :class="!msg.is_read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'">
                                            {{ displayName(msg) }}
                                        </p>
                                        <span class="text-[10px] text-gray-400 shrink-0">{{ formatListDate(msg.received_at) }}</span>
                                    </div>
                                    <p class="text-xs text-gray-800 dark:text-gray-200 truncate mt-0.5" :class="!msg.is_read ? 'font-semibold' : ''">{{ msg.subject }}</p>
                                    <p class="text-[11px] text-gray-500 truncate mt-0.5">{{ msg.preview }}</p>
                                </div>
                                <div class="flex flex-col items-center gap-1 shrink-0 mt-1">
                                    <span v-if="!msg.is_read" class="w-2 h-2 rounded-full bg-teal-500"></span>
                                    <svg v-if="msg.has_attachments" class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24A6 6 0 1 1 5.76 13.75L15.66 3.85A4 4 0 1 1 21.32 9.5L11.41 19.41A2 2 0 1 1 8.59 16.59L17.07 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                </div>
                            </div>
                        </button>
                        <div v-if="!messages.length && !loadingList" class="p-8 text-center text-sm text-gray-500">ایمیلی در این پوشه نیست</div>
                        <div v-if="loadingMore" class="py-3 flex justify-center">
                            <span class="loading loading-spinner loading-sm text-teal-500"></span>
                        </div>
                    </div>
                </section>

                <!-- Thread / detail -->
                <section
                    class="mail-detail hidden md:flex md:relative md:flex-1 flex-col bg-[#fafbfb] dark:bg-gray-950 min-h-0 min-w-0 md:translate-x-0 md:opacity-100 md:pointer-events-auto"
                    :class="{ 'mail-detail--open': showMobileDetail }"
                >
                    <div v-if="loadingDetail" class="flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
                        <span class="loading loading-spinner text-teal-500"></span>
                    </div>

                    <div v-else-if="!activeMessage" class="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <svg class="w-16 h-16 mb-3 opacity-30" viewBox="0 0 24 24" fill="none"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/></svg>
                        <p class="text-sm">یک ایمیل را انتخاب کنید</p>
                    </div>

                    <template v-else>
                        <!-- Mobile Gmail-like toolbar -->
                        <div class="md:hidden flex items-center gap-1 px-2 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <button
                                type="button"
                                @click="closeMobileDetail"
                                class="h-10 w-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="بازگشت"
                            >
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                            <div class="flex-1 min-w-0 px-1">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ activeMessage.subject }}</p>
                            </div>
                            <button v-if="canMove && archiveFolder && !isArchiveFolder" type="button" @click="archiveCurrent" class="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600" title="آرشیو">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M7 7V5H17V7M6 7L7 19H17L18 7M10 11V15M14 11V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                            </button>
                            <button type="button" @click="toggleRead" class="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800" :title="activeMessage.is_read ? 'خوانده‌نشده' : 'خوانده‌شده'">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 4H20V18H4V4Z" stroke="currentColor" stroke-width="1.5"/><path d="M4 4L12 11L20 4" stroke="currentColor" stroke-width="1.5"/></svg>
                            </button>
                            <button v-if="canDelete" type="button" @click="deleteCurrent" class="h-10 w-10 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50" title="حذف">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M6 7H18M9 7V5H15V7M10 11V17M14 11V17M7 7L8 19H16L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                            </button>
                        </div>

                        <!-- Desktop header -->
                        <div class="hidden md:flex px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 items-start justify-between gap-3 shrink-0">
                            <h2 class="text-xl font-bold text-gray-900 dark:text-white min-w-0 break-words">{{ activeMessage.subject }}</h2>
                            <div class="flex items-center gap-1 shrink-0">
                                <button v-if="canMove && archiveFolder && !isArchiveFolder" @click="archiveCurrent" class="p-2 rounded-lg hover:bg-teal-50 text-teal-600" title="آرشیو">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M7 7V5H17V7M6 7L7 19H17L18 7M10 11V15M14 11V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                </button>
                                <button v-if="canMove && !isTrashFolder && !isSpamFolder" @click="moveToSpam" class="p-2 rounded-lg hover:bg-orange-50 text-orange-500" title="هرزنامه">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.64 21H20.36A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="1.5"/></svg>
                                </button>
                                <button @click="toggleRead" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" :title="activeMessage.is_read ? 'خوانده‌نشده' : 'خوانده‌شده'">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 4H20V18H4V4Z" stroke="currentColor" stroke-width="1.5"/><path d="M4 4L12 11L20 4" stroke="currentColor" stroke-width="1.5"/></svg>
                                </button>
                                <button v-if="canDelete" @click="deleteCurrent" class="p-2 rounded-lg hover:bg-rose-50 text-rose-500" title="حذف">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 7H18M9 7V5H15V7M10 11V17M14 11V17M7 7L8 19H16L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 md:px-5 py-3 md:py-4 space-y-3 bg-white md:bg-[#fafbfb] dark:bg-gray-950">
                            <!-- Mobile subject under toolbar -->
                            <h2 class="md:hidden text-xl font-bold text-gray-900 dark:text-white leading-snug px-1">{{ activeMessage.subject }}</h2>

                            <div
                                v-for="(item, idx) in thread"
                                :key="`${item.folder}-${item.uid}`"
                                class="rounded-none md:rounded-2xl border-0 md:border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                                :class="idx < thread.length - 1 ? 'border-b border-gray-100 dark:border-gray-800 md:border-b-0' : ''"
                            >
                                <button
                                    @click="toggleThreadItem(idx)"
                                    class="w-full flex items-center gap-3 px-2 md:px-4 py-3 text-start hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    :class="expandedThreadIndex === idx ? 'md:border-b border-gray-100 dark:border-gray-800' : ''"
                                >
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                        :class="item.is_outgoing ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-700'">
                                        {{ avatarLetters(item) }}
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ displayName(item) }}</span>
                                            <span v-if="item.is_outgoing" class="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">شما</span>
                                        </div>
                                        <p class="text-xs text-gray-500 truncate">{{ item.is_outgoing ? 'ارسال‌شده' : item.from_email }}</p>
                                    </div>
                                    <span class="text-[11px] text-gray-400 shrink-0">{{ formatListDate(item.received_at, true) }}</span>
                                </button>

                                <div v-if="expandedThreadIndex === idx" class="px-2 md:px-4 py-3 md:py-4">
                                    <div class="hidden md:flex items-start gap-3 mb-4">
                                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                            :class="item.is_outgoing ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-700'">
                                            {{ avatarLetters(item) }}
                                        </div>
                                        <div class="min-w-0 flex-1 space-y-1">
                                            <div class="flex items-start justify-between gap-3">
                                                <div class="min-w-0">
                                                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {{ headerName(item) }}
                                                        <span class="font-normal text-gray-500" dir="ltr">&lt;{{ item.from_email }}&gt;</span>
                                                    </p>
                                                    <p class="text-xs text-gray-500 mt-0.5">
                                                        به {{ formatAddressList(item.to_addresses) || currentAccount?.address }}
                                                    </p>
                                                    <p v-if="item.cc_addresses?.length" class="text-xs text-gray-500">رونوشت: {{ formatAddressList(item.cc_addresses) }}</p>
                                                </div>
                                                <div class="text-end shrink-0">
                                                    <p class="text-[11px] text-gray-500">{{ formatFullDate(item.received_at) }}</p>
                                                    <p class="mt-1 inline-flex items-center gap-1 text-[11px] font-medium" :class="item.encrypted ? 'text-teal-700' : 'text-amber-600'">
                                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M7 11V8A5 5 0 0 1 17 8V11M6 11H18V20H6V11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                                        {{ item.encrypted ? `رمزنگاری استاندارد (${item.encryption || 'TLS'})` : 'بدون رمزنگاری' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Compact mobile meta -->
                                    <div class="md:hidden mb-3 space-y-1 text-xs text-gray-500 px-1">
                                        <p>به {{ formatAddressList(item.to_addresses) || currentAccount?.address }}</p>
                                        <p>{{ formatFullDate(item.received_at) }}</p>
                                    </div>

                                    <MailHtmlBody :html="item.body_html" :text="item.body_text || stripHtml(item.body_html)" />

                                    <div v-if="item.attachments?.length" class="mt-4 flex flex-wrap gap-2">
                                        <button
                                            v-for="att in item.attachments"
                                            :key="att.part"
                                            type="button"
                                            @click="downloadAttachment(item, att)"
                                            class="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <svg class="w-4 h-4 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24A6 6 0 1 1 5.76 13.75L15.66 3.85A4 4 0 1 1 21.32 9.5L11.41 19.41A2 2 0 1 1 8.59 16.59L17.07 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                            <span class="truncate max-w-[180px]">{{ att.name }}</span>
                                            <span class="text-gray-400">({{ formatFileSize(att.size) }})</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop reply (always visible) -->
                        <div v-if="canReply && !isTrashFolder" class="hidden md:block p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-2 shrink-0">
                            <MailRichEditor ref="replyEditorDesktop" v-model="replyBody" compact placeholder="پاسخ خود را بنویسید..." />
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <label class="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 cursor-pointer" title="پیوست">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24A6 6 0 1 1 5.76 13.75L15.66 3.85A4 4 0 1 1 21.32 9.5L11.41 19.41A2 2 0 1 1 8.59 16.59L17.07 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                        <input type="file" multiple class="hidden" @change="onReplyFiles" />
                                    </label>
                                    <span v-for="(file, i) in replyFiles" :key="i" class="text-[11px] px-2 py-1 rounded-lg bg-teal-50 text-teal-700 flex items-center gap-1">
                                        {{ file.name }}
                                        <button type="button" @click="removeReplyFile(i)" class="text-teal-900">×</button>
                                    </span>
                                </div>
                                <button
                                    @click="sendReply"
                                    :disabled="sending || !hasReplyContent"
                                    class="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold disabled:opacity-50"
                                >
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                                    {{ sending ? 'در حال ارسال...' : 'ارسال پاسخ' }}
                                </button>
                            </div>
                        </div>

                        <!-- Mobile reply: collapsed bar + animated sheet -->
                        <div v-if="canReply && !isTrashFolder" class="md:hidden shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <button
                                v-if="!replyComposerOpen"
                                type="button"
                                @click="openReplyComposer"
                                class="w-full flex items-center gap-3 px-4 py-3 text-start active:bg-gray-50 dark:active:bg-gray-800"
                            >
                                <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                                    شما
                                </div>
                                <span class="flex-1 text-sm text-gray-400">پاسخ بنویسید...</span>
                                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                            </button>

                            <transition name="reply-sheet">
                                <div v-if="replyComposerOpen" class="reply-sheet px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2">
                                    <div class="flex items-center justify-between gap-2 pb-1">
                                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                            پاسخ به {{ displayName(activeMessage) }}
                                        </p>
                                        <button type="button" @click="closeReplyComposer" class="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="بستن">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                        </button>
                                    </div>
                                    <MailRichEditor ref="replyEditorMobile" v-model="replyBody" compact placeholder="پاسخ خود را بنویسید..." />
                                    <div v-if="replyFiles.length" class="flex flex-wrap gap-1.5">
                                        <span v-for="(file, i) in replyFiles" :key="i" class="text-[11px] px-2 py-1 rounded-lg bg-teal-50 text-teal-700 flex items-center gap-1 max-w-full">
                                            <span class="truncate">{{ file.name }}</span>
                                            <button type="button" @click="removeReplyFile(i)" class="text-teal-900 shrink-0">×</button>
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                        <label class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:bg-gray-200 cursor-pointer" title="پیوست">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24A6 6 0 1 1 5.76 13.75L15.66 3.85A4 4 0 1 1 21.32 9.5L11.41 19.41A2 2 0 1 1 8.59 16.59L17.07 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                            <input type="file" multiple class="hidden" @change="onReplyFiles" />
                                        </label>
                                        <button
                                            @click="sendReply"
                                            :disabled="sending || !hasReplyContent"
                                            class="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-teal-500 active:bg-teal-600 text-white text-sm font-semibold disabled:opacity-50"
                                        >
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                                            {{ sending ? 'ارسال...' : 'ارسال' }}
                                        </button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </template>
                </section>

                <!-- Mobile compose FAB -->
                <button
                    v-if="canSend && !showMobileDetail"
                    type="button"
                    @click="openCompose"
                    class="md:hidden absolute bottom-5 end-4 z-20 h-14 w-14 rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center active:scale-95 transition"
                    aria-label="پیام جدید"
                >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>

            <!-- Compose modal -->
            <div v-if="showCompose" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" @click.self="showCompose = false">
                <div class="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 class="font-bold text-gray-900 dark:text-white">پیام جدید</h3>
                        <button @click="showCompose = false" class="h-9 w-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
                    </div>
                    <div class="p-5 space-y-3 overflow-y-auto custom-scrollbar">
                        <input v-model="compose.to" type="email" placeholder="گیرنده (email@example.com)" dir="ltr" class="w-full h-10 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 text-sm" />
                        <input v-model="compose.subject" type="text" placeholder="موضوع" class="w-full h-10 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 text-sm" />
                        <MailRichEditor ref="composeEditor" v-model="compose.body" placeholder="متن پیام..." />
                        <div class="flex flex-wrap items-center gap-2">
                            <label class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 cursor-pointer" title="پیوست">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05L12.25 20.24A6 6 0 1 1 5.76 13.75L15.66 3.85A4 4 0 1 1 21.32 9.5L11.41 19.41A2 2 0 1 1 8.59 16.59L17.07 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                                <input type="file" multiple class="hidden" @change="onComposeFiles" />
                            </label>
                            <span v-for="(file, i) in composeFiles" :key="i" class="text-[11px] px-2 py-1 rounded-lg bg-teal-50 text-teal-700 flex items-center gap-1">
                                {{ file.name }}
                                <button type="button" @click="removeComposeFile(i)">×</button>
                            </span>
                        </div>
                    </div>
                    <div class="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                        <button @click="showCompose = false" class="h-10 px-4 rounded-xl bg-gray-100 text-sm">انصراف</button>
                        <button @click="sendCompose" :disabled="sending" class="h-10 px-5 rounded-xl bg-teal-500 text-white text-sm font-semibold disabled:opacity-50">ارسال</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import MailHtmlBody from "@/views/components/mail/MailHtmlBody.vue";
import MailRichEditor from "@/views/components/mail/MailRichEditor.vue";
import { mailInboxService } from "@/services/mail-inbox.service";
import { usePermission } from "@/composables/usePermission";

const PRIMARY_TYPES = ["inbox", "sent", "drafts", "outbox", "archive", "spam", "trash"];
const HISTORY_STATE_KEY = "adminMailInboxDetail";

export default {
    name: "AdminInbox",
    components: { AdminMasterPage, MailHtmlBody, MailRichEditor },
    setup() {
        const { can } = usePermission();
        return { can };
    },
    data() {
        return {
            accounts: [],
            selectedAccountKey: "",
            folders: [],
            selectedFolder: null,
            mobileFolderPath: "",
            messages: [],
            thread: [],
            activeMessage: null,
            expandedThreadIndex: 0,
            searchQuery: "",
            selectedFilter: "all",
            filterTabs: [
                { value: "all", label: "همه" },
                { value: "unread", label: "جدید" },
                { value: "read", label: "خوانده" },
            ],
            pagination: { current_page: 1, last_page: 1, per_page: 25, total: 0 },
            loading: false,
            loadingList: false,
            loadingMore: false,
            loadingDetail: false,
            sending: false,
            replyBody: "",
            replyFiles: [],
            composeFiles: [],
            showCompose: false,
            compose: { to: "", subject: "", body: "" },
            searchTimeout: null,
            configError: "",
            showMobileDetail: false,
            replyComposerOpen: false,
            isMobileViewport: false,
            mailHistoryPushed: false,
            _mediaQuery: null,
            _onMediaChange: null,
            _closingViaHistory: false,
        };
    },
    computed: {
        currentAccount() {
            return this.accounts.find((a) => a.key === this.selectedAccountKey);
        },
        primaryFolders() {
            return this.folders.filter((f) => PRIMARY_TYPES.includes(f.type));
        },
        otherFolders() {
            return this.folders.filter((f) => !PRIMARY_TYPES.includes(f.type));
        },
        isTrashFolder() {
            return this.selectedFolder?.type === "trash";
        },
        isSpamFolder() {
            return this.selectedFolder?.type === "spam";
        },
        isArchiveFolder() {
            return this.selectedFolder?.type === "archive";
        },
        archiveFolder() {
            return this.folders.find((f) => f.type === "archive")
                || this.folders.find((f) => /archive/i.test(`${f.path} ${f.name || ""}`));
        },
        hasReplyContent() {
            const desktop = this.$refs.replyEditorDesktop?.getText?.();
            const mobile = this.$refs.replyEditorMobile?.getText?.();
            return Boolean(this.replyBody?.trim() || desktop || mobile);
        },
        canReply() {
            return this.can("support.inbox.reply");
        },
        canSend() {
            return this.can("support.inbox.send");
        },
        canDelete() {
            return this.can("support.inbox.delete");
        },
        canMove() {
            return this.can("support.inbox.move");
        },
        hasMoreMessages() {
            return this.pagination.current_page < this.pagination.last_page;
        },
    },
    async mounted() {
        this.setupMobileViewportWatcher();
        window.addEventListener("popstate", this.onBrowserPopState);
        await this.loadAccounts();
    },
    beforeUnmount() {
        this.teardownMobileViewportWatcher();
        window.removeEventListener("popstate", this.onBrowserPopState);
        clearTimeout(this.searchTimeout);
        if (this.mailHistoryPushed) {
            this.mailHistoryPushed = false;
            // Leave history entry as-is; next back just leaves the page normally.
        }
    },
    methods: {
        setupMobileViewportWatcher() {
            if (typeof window === "undefined" || !window.matchMedia) return;
            this._mediaQuery = window.matchMedia("(max-width: 767px)");
            this.isMobileViewport = this._mediaQuery.matches;
            this._onMediaChange = (event) => {
                this.isMobileViewport = event.matches;
                if (!event.matches) {
                    // Desktop: detail sits side-by-side; drop mobile-only history trap.
                    this.showMobileDetail = false;
                    this.replyComposerOpen = false;
                    this.clearMailHistoryState();
                } else if (this.activeMessage) {
                    this.showMobileDetail = true;
                    this.pushMailHistoryState();
                }
            };
            if (this._mediaQuery.addEventListener) {
                this._mediaQuery.addEventListener("change", this._onMediaChange);
            } else {
                this._mediaQuery.addListener(this._onMediaChange);
            }
        },
        teardownMobileViewportWatcher() {
            if (!this._mediaQuery || !this._onMediaChange) return;
            if (this._mediaQuery.removeEventListener) {
                this._mediaQuery.removeEventListener("change", this._onMediaChange);
            } else {
                this._mediaQuery.removeListener(this._onMediaChange);
            }
        },
        pushMailHistoryState() {
            if (!this.isMobileViewport || this.mailHistoryPushed || typeof window === "undefined") return;
            try {
                // Preserve Vue Router history fields (position/current/...) so popstate
                // does not look like a real route change that cancels in-flight requests.
                const current = window.history.state && typeof window.history.state === "object"
                    ? { ...window.history.state }
                    : {};
                const position = typeof current.position === "number" ? current.position + 1 : undefined;
                window.history.pushState(
                    {
                        ...current,
                        ...(position !== undefined ? { position } : {}),
                        [HISTORY_STATE_KEY]: true,
                    },
                    "",
                    window.location.href,
                );
                this.mailHistoryPushed = true;
            } catch {
                /* noop */
            }
        },
        clearMailHistoryState() {
            if (!this.mailHistoryPushed || typeof window === "undefined") return;
            this.mailHistoryPushed = false;
            this._closingViaHistory = true;
            try {
                window.history.back();
            } catch {
                this._closingViaHistory = false;
            }
            setTimeout(() => {
                this._closingViaHistory = false;
            }, 400);
        },
        onBrowserPopState(event) {
            if (this._closingViaHistory) {
                this._closingViaHistory = false;
                this.mailHistoryPushed = false;
                return;
            }
            const state = event?.state;
            const stillInMailDetail = !!(state && state[HISTORY_STATE_KEY]);
            if (this.replyComposerOpen) {
                this.replyComposerOpen = false;
                if (!stillInMailDetail && this.showMobileDetail) {
                    this.mailHistoryPushed = false;
                    this.pushMailHistoryState();
                }
                return;
            }
            if (this.showMobileDetail && !stillInMailDetail) {
                this.mailHistoryPushed = false;
                this.closeMobileDetail({ fromHistory: true });
            }
        },
        closeMobileDetail({ fromHistory = false } = {}) {
            this.showMobileDetail = false;
            this.replyComposerOpen = false;
            this.activeMessage = null;
            this.thread = [];
            this.loadingDetail = false;
            if (!fromHistory && this.mailHistoryPushed) {
                this.clearMailHistoryState();
            } else {
                this.mailHistoryPushed = false;
            }
        },
        mailRequestErrorMessage(error, fallback) {
            if (!error) return fallback;
            if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
                return null;
            }
            const data = error?.response?.data;
            if (typeof data?.message === "string" && data.message.trim()) {
                return data.message;
            }
            if (error.message && !String(error.message).startsWith("Request failed")) {
                return error.message;
            }
            return fallback;
        },
        openReplyComposer() {
            this.replyComposerOpen = true;
            this.$nextTick(() => this.$refs.replyEditorMobile?.focusEditor?.());
        },
        closeReplyComposer() {
            this.replyComposerOpen = false;
        },
        async loadAccounts() {
            try {
                const { data } = await mailInboxService.getAccounts();
                this.accounts = data.accounts || [];
                const configured = this.accounts.find((a) => a.is_configured);
                this.selectedAccountKey = configured?.key || this.accounts[0]?.key || "";
                if (this.selectedAccountKey) await this.refreshAll();
            } catch (e) {
                this.configError = this.mailRequestErrorMessage(e, "خطا در بارگذاری صندوق‌ها") || "";
            }
        },
        async refreshAll() {
            if (!this.selectedAccountKey) return;
            this.loading = true;
            this.configError = "";
            try {
                await this.loadFolders();
                await this.fetchMessages();
            } catch (e) {
                this.configError = this.mailRequestErrorMessage(e, "اتصال به سرور ایمیل برقرار نشد") || "";
            } finally {
                this.loading = false;
            }
        },
        async loadFolders() {
            const { data } = await mailInboxService.getFolders(this.selectedAccountKey);
            this.folders = data.folders || [];
            if (!this.selectedFolder && this.folders.length) {
                this.selectedFolder = this.folders.find((f) => f.type === "inbox") || this.folders[0];
                this.mobileFolderPath = this.selectedFolder.path;
            }
        },
        async fetchMessages(page = 1, { append = false } = {}) {
            if (!this.selectedFolder) return;
            if (append) {
                if (this.loadingMore || this.loadingList || !this.hasMoreMessages) return;
                this.loadingMore = true;
            } else {
                this.messages = [];
                this.loadingList = true;
            }
            try {
                const { data } = await mailInboxService.listMessages(this.selectedAccountKey, {
                    folder: this.selectedFolder.path,
                    page,
                    perPage: this.pagination.per_page,
                    filter: this.selectedFilter,
                    search: this.searchQuery || undefined,
                });
                const incoming = data.messages || [];
                if (append) {
                    const seen = new Set(this.messages.map((m) => `${m.folder}-${m.uid}`));
                    this.messages = [
                        ...this.messages,
                        ...incoming.filter((m) => !seen.has(`${m.folder}-${m.uid}`)),
                    ];
                } else {
                    this.messages = incoming;
                    this.$nextTick(() => {
                        if (this.$refs.messageList) this.$refs.messageList.scrollTop = 0;
                    });
                }
                this.pagination = data.pagination || this.pagination;
            } catch (e) {
                const message = this.mailRequestErrorMessage(e, "خطا در دریافت لیست ایمیل‌ها");
                if (message) this.configError = message;
            } finally {
                this.loadingList = false;
                this.loadingMore = false;
            }
        },
        onListScroll(event) {
            const el = event.target;
            if (!el || this.loadingMore || this.loadingList || !this.hasMoreMessages) return;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
                this.fetchMessages(this.pagination.current_page + 1, { append: true });
            }
        },
        async openMessage(msg) {
            if (!msg?.uid || !msg?.folder) {
                this.configError = "شناسه ایمیل نامعتبر است";
                return;
            }
            this.loadingDetail = true;
            this.configError = "";
            this.replyBody = "";
            this.replyFiles = [];
            this.replyComposerOpen = false;
            if (this.isMobileViewport) {
                this.showMobileDetail = true;
            }
            const wasUnread = !msg.is_read;
            try {
                const { data } = await mailInboxService.getMessage(
                    this.selectedAccountKey,
                    msg.uid,
                    msg.folder || this.selectedFolder?.path,
                );
                const detail = data?.message;
                if (!detail || typeof detail !== "object" || Array.isArray(detail)) {
                    throw new Error("پاسخ سرور برای ایمیل ناقص بود");
                }
                this.activeMessage = { ...detail, is_read: true };
                const threadSource = Array.isArray(data.thread) && data.thread.length
                    ? data.thread.filter((item) => item && typeof item === "object")
                    : [detail];
                this.thread = threadSource.map((item) => (
                    item.uid === msg.uid ? { ...item, is_read: true } : item
                ));
                this.expandedThreadIndex = Math.max(0, this.thread.length - 1);
                const listItem = this.messages.find((m) => m.uid === msg.uid && m.folder === msg.folder);
                if (listItem && !listItem.is_read) {
                    listItem.is_read = true;
                }
                if (wasUnread) {
                    this.adjustUnread(msg.folder, -1);
                }
                if (this.selectedFilter === "unread") {
                    this.messages = this.messages.filter((m) => !(m.uid === msg.uid && m.folder === msg.folder));
                }
                if (this.isMobileViewport) {
                    this.pushMailHistoryState();
                }
            } catch (e) {
                const message = this.mailRequestErrorMessage(e, "خطا در خواندن ایمیل");
                if (message) this.configError = message;
                if (this.isMobileViewport) {
                    this.closeMobileDetail();
                }
            } finally {
                this.loadingDetail = false;
            }
        },
        selectFolder(folder) {
            if (this.showMobileDetail) {
                this.closeMobileDetail();
            } else {
                this.activeMessage = null;
                this.thread = [];
            }
            this.selectedFolder = folder;
            this.mobileFolderPath = folder.path;
            this.fetchMessages(1);
        },
        onAccountChange() {
            if (this.showMobileDetail) {
                this.closeMobileDetail();
            } else {
                this.activeMessage = null;
                this.thread = [];
            }
            this.selectedFolder = null;
            this.refreshAll();
        },
        onMobileFolderChange() {
            const folder = this.folders.find((f) => f.path === this.mobileFolderPath);
            if (folder) this.selectFolder(folder);
        },
        setFilter(value) {
            this.selectedFilter = value;
            this.fetchMessages(1);
        },
        debounceSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.fetchMessages(1), 400);
        },
        async toggleRead() {
            if (!this.activeMessage) return;
            const nextRead = !this.activeMessage.is_read;
            const fn = nextRead ? mailInboxService.markRead : mailInboxService.markUnread;
            await fn(this.selectedAccountKey, this.activeMessage.uid, this.activeMessage.folder);
            this.activeMessage.is_read = nextRead;
            const listItem = this.messages.find((m) => m.uid === this.activeMessage.uid && m.folder === this.activeMessage.folder);
            if (listItem) listItem.is_read = nextRead;
            this.adjustUnread(this.activeMessage.folder, nextRead ? -1 : 1);
        },
        async deleteCurrent() {
            if (!this.activeMessage || !confirm("این ایمیل حذف شود؟")) return;
            const current = this.activeMessage;
            await mailInboxService.deleteMessage(
                this.selectedAccountKey,
                current.uid,
                current.folder,
                this.isTrashFolder,
            );
            this.removeMessageLocally(current);
        },
        async archiveCurrent() {
            if (!this.activeMessage || !this.archiveFolder) return;
            const current = this.activeMessage;
            await mailInboxService.moveMessage(
                this.selectedAccountKey,
                current.uid,
                current.folder,
                this.archiveFolder.path,
            );
            this.removeMessageLocally(current);
        },
        getActiveReplyEditor() {
            if (this.isMobileViewport) return this.$refs.replyEditorMobile;
            return this.$refs.replyEditorDesktop;
        },
        async sendReply() {
            if (!this.activeMessage || !this.hasReplyContent) return;
            this.sending = true;
            try {
                const editor = this.getActiveReplyEditor();
                const bodyHtml = editor?.getHtml?.() || "";
                const bodyText = editor?.getText?.() || this.stripHtml(bodyHtml);
                await mailInboxService.reply(this.selectedAccountKey, this.activeMessage.uid, {
                    folder: this.activeMessage.folder,
                    body: bodyText,
                    body_html: bodyHtml,
                    attachments: this.replyFiles,
                });
                this.replyBody = "";
                this.replyFiles = [];
                this.replyComposerOpen = false;
                editor?.clear?.();
                await this.openMessage(this.activeMessage);
                await this.loadFolders();
            } catch (e) {
                alert(e?.response?.data?.message || "ارسال پاسخ ناموفق بود");
            } finally {
                this.sending = false;
            }
        },
        openCompose() {
            this.compose = { to: "", subject: "", body: "" };
            this.composeFiles = [];
            this.showCompose = true;
            this.$nextTick(() => this.$refs.composeEditor?.clear?.());
        },
        async sendCompose() {
            this.sending = true;
            try {
                const bodyHtml = this.$refs.composeEditor?.getHtml?.() || "";
                const bodyText = this.$refs.composeEditor?.getText?.() || this.stripHtml(bodyHtml);
                await mailInboxService.compose(this.selectedAccountKey, {
                    ...this.compose,
                    body: bodyText,
                    body_html: bodyHtml,
                    attachments: this.composeFiles,
                });
                this.showCompose = false;
                this.composeFiles = [];
                const sent = this.folders.find((f) => f.type === "sent");
                if (sent) this.selectFolder(sent);
            } catch (e) {
                alert(e?.response?.data?.message || "ارسال ناموفق بود");
            } finally {
                this.sending = false;
            }
        },
        async moveToSpam() {
            if (!this.activeMessage || !this.canMove) return;
            const spamFolder = this.folders.find((f) => f.type === "spam");
            if (!spamFolder) return;
            const current = this.activeMessage;
            await mailInboxService.moveMessage(
                this.selectedAccountKey,
                current.uid,
                current.folder,
                spamFolder.path,
            );
            this.removeMessageLocally(current);
        },
        onReplyFiles(event) {
            const files = Array.from(event.target.files || []);
            this.replyFiles = [...this.replyFiles, ...files];
            event.target.value = "";
        },
        onComposeFiles(event) {
            const files = Array.from(event.target.files || []);
            this.composeFiles = [...this.composeFiles, ...files];
            event.target.value = "";
        },
        removeReplyFile(index) {
            this.replyFiles.splice(index, 1);
        },
        removeComposeFile(index) {
            this.composeFiles.splice(index, 1);
        },
        async downloadAttachment(message, attachment) {
            try {
                const { data, headers } = await mailInboxService.downloadAttachment(
                    this.selectedAccountKey,
                    message.uid,
                    message.folder,
                    attachment.part,
                );
                const blob = new Blob([data], { type: headers["content-type"] || attachment.mime });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = attachment.name || "attachment";
                link.click();
                window.URL.revokeObjectURL(url);
            } catch (e) {
                alert(e?.response?.data?.message || "دانلود پیوست ناموفق بود");
            }
        },
        formatFileSize(bytes) {
            if (!bytes) return "0 B";
            const units = ["B", "KB", "MB", "GB"];
            let size = bytes;
            let unit = 0;
            while (size >= 1024 && unit < units.length - 1) {
                size /= 1024;
                unit += 1;
            }
            return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
        },
        toggleThreadItem(idx) {
            this.expandedThreadIndex = this.expandedThreadIndex === idx ? -1 : idx;
        },
        isSelected(msg) {
            return this.activeMessage?.uid === msg.uid && this.activeMessage?.folder === msg.folder;
        },
        displayName(msg) {
            if (msg.is_outgoing) return "شما";
            return msg.from_name || msg.from_email;
        },
        headerName(msg) {
            const name = (msg.from_name || "").trim();
            if (name) {
                if (msg.is_outgoing && !name.includes("زنبورک")) return `${name} زنبورک`;
                return name;
            }
            return (msg.from_email || "").split("@")[0] || "ناشناس";
        },
        formatAddressList(list) {
            if (!Array.isArray(list) || !list.length) return "";
            return list
                .map((item) => {
                    if (item?.name && item?.email) return `${item.name} <${item.email}>`;
                    return item?.email || item?.name || "";
                })
                .filter(Boolean)
                .join("، ");
        },
        formatFullDate(value) {
            if (!value) return "";
            const d = new Date(value);
            return d.toLocaleString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        adjustUnread(folderPath, delta) {
            const folder = this.folders.find((f) => f.path === folderPath);
            if (!folder) return;
            folder.unread = Math.max(0, (folder.unread || 0) + delta);
        },
        removeMessageLocally(msg) {
            if (!msg) return;
            if (!msg.is_read) this.adjustUnread(msg.folder, -1);
            this.messages = this.messages.filter((m) => !(m.uid === msg.uid && m.folder === msg.folder));
            this.pagination.total = Math.max(0, (this.pagination.total || 0) - 1);
            if (this.showMobileDetail) {
                this.closeMobileDetail();
            } else {
                this.activeMessage = null;
                this.thread = [];
            }
        },
        avatarLetters(msg) {
            const name = this.displayName(msg);
            return name.slice(0, 2).toUpperCase();
        },
        folderDotClass(type) {
            const map = {
                inbox: "bg-teal-500",
                sent: "bg-blue-400",
                drafts: "bg-amber-400",
                trash: "bg-rose-400",
                spam: "bg-orange-400",
                archive: "bg-slate-400",
            };
            return map[type] || "bg-gray-400";
        },
        formatListDate(value, withTime = false) {
            if (!value) return "";
            const d = new Date(value);
            const now = new Date();
            if (!withTime && d.toDateString() === now.toDateString()) {
                return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
            }
            return d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
        },
        stripHtml(html) {
            if (!html) return "";
            const el = document.createElement("div");
            el.innerHTML = html;
            return el.textContent || "";
        },
    },
};
</script>

<style scoped>
.mail-client {
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

@media (max-width: 767px) {
    .mail-detail {
        position: absolute;
        inset: 0;
        z-index: 30;
        width: 100%;
        display: flex !important;
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
        pointer-events: none;
        transition:
            transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.24s ease;
        will-change: transform, opacity;
    }

    .mail-detail.mail-detail--open {
        transform: translate3d(0, 0, 0);
        opacity: 1;
        pointer-events: auto;
    }
}

.reply-sheet-enter-active,
.reply-sheet-leave-active {
    transition:
        transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.22s ease,
        max-height 0.28s ease;
    overflow: hidden;
    max-height: 420px;
}

.reply-sheet-enter-from,
.reply-sheet-leave-to {
    opacity: 0;
    transform: translateY(18px);
    max-height: 0;
}
</style>
