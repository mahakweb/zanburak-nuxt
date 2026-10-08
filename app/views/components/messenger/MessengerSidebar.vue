<template>
  <div
    class="messenger-sidebar flex flex-col h-full relative"
    data-msg-font="sidebar"
    @pointerdown.capture="onSidebarPointerDown"
  >
    <!-- LIST / SEARCH header: hamburger · title|status · expanding search · lock -->
    <div
      v-if="panel === 'list' || panel === 'search'"
      ref="listHeader"
      class="messenger-list-header flex items-center gap-1.5 px-2 h-14 border-b border-black/[0.05] dark:border-white/5 flex-shrink-0 relative z-20"
    >
      <button
        ref="menuBtn"
        type="button"
        @click="searchExpanded ? collapseSearch() : toggleAccountMenu()"
        class="p-2 -ms-0.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] dark:text-gray-300 transition flex-shrink-0"
        :title="searchExpanded ? $t('messenger.back') : $t('messenger.menu')"
        :aria-label="searchExpanded ? $t('messenger.back') : $t('messenger.menu')"
      >
        <svg
          v-if="searchExpanded"
          class="w-5 h-5 ltr:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 12h16m0 0l-6 6m6-6l-6-6"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div class="messenger-header-main flex-1 min-w-0 relative h-10 flex items-center">
        <!-- Brand / connection status (hidden while search expanded) -->
        <div
          class="messenger-header-title-slot absolute inset-y-0 start-0 end-10 flex items-center pe-2 pointer-events-none"
          :class="{ 'is-hidden': searchExpanded }"
        >
          <transition name="conn-title" mode="out-in">
            <span
              v-if="showConnectionStatus"
              key="status"
              class="messenger-status-label truncate"
              role="status"
              aria-live="polite"
            >
              {{ connectionStatusText
              }}<span
                v-if="connectionStatusDots"
                class="messenger-status-dots"
                aria-hidden="true"
                ><span>.</span><span>.</span><span>.</span></span
              >
            </span>
            <span
              v-else
              key="brand"
              class="messenger-brand-title truncate"
            >{{ $t("messenger.title") }}</span>
          </transition>
        </div>

        <!-- Compact search → expands to full-width field -->
        <div
          class="messenger-search-expand absolute inset-y-0 end-0 flex items-center"
          :class="{ 'is-expanded': searchExpanded }"
        >
          <button
            v-show="!searchExpanded"
            type="button"
            class="messenger-search-icon-btn p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] dark:text-gray-300 transition active:scale-95"
            :title="$t('messenger.search')"
            :aria-label="$t('messenger.search')"
            @click="expandSearch"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div
            class="messenger-search-field relative h-10"
            :class="{ 'is-expanded': searchExpanded }"
          >
            <span
              class="absolute inset-y-0 rtl:right-3 ltr:left-3 flex items-center text-[#a2acb4] pointer-events-none"
              :class="{ 'opacity-0': !searchExpanded }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </span>
            <input
              ref="searchInput"
              v-model="query"
              v-no-autofill="'strong'"
              type="text"
              name="messenger-search"
              inputmode="search"
              enterkeyhint="search"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              tabindex="0"
              :aria-hidden="!searchExpanded"
              :placeholder="$t('messenger.searchEverywhere')"
              class="messenger-search-input messenger-search-expand-input w-full h-10 rtl:pr-9 ltr:pl-9 pe-9 text-[13px] rounded-full bg-white dark:bg-[#17212b] border-0 focus:outline-none text-gray-800 dark:text-gray-100 placeholder:text-[#a2acb4]"
              @input="onSearchInput"
              @keydown.esc.prevent="collapseSearch"
            />
            <button
              v-if="searchExpanded && query"
              type="button"
              @click="clearSearch"
              class="absolute inset-y-0 rtl:left-2 ltr:right-2 flex items-center text-[#a2acb4] hover:text-gray-600 dark:hover:text-gray-300"
              :title="$t('messenger.clearSearch')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="appLockEnabled && !searchExpanded"
        type="button"
        class="p-2 -me-0.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] dark:text-gray-300 transition active:scale-90 flex-shrink-0"
        :title="$t('messenger.lockNow')"
        :aria-label="$t('messenger.lockNow')"
        @click="lockNow"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3.25C14.7402 3.25 13.532 3.75045 12.6412 4.64124C11.7504 5.53204 11.25 6.74022 11.25 8V10.25H6C5.27065 10.25 4.57118 10.5397 4.05546 11.0555C3.53973 11.5712 3.25 12.2707 3.25 13V18C3.25 18.7293 3.53973 19.4288 4.05546 19.9445C4.57118 20.4603 5.27065 20.75 6 20.75H13C13.7293 20.75 14.4288 20.4603 14.9445 19.9445C15.4603 19.4288 15.75 18.7293 15.75 18V13C15.75 12.2707 15.4603 11.5712 14.9445 11.0555C14.4288 10.5397 13.7293 10.25 13 10.25H12.75V8C12.75 7.13805 13.0924 6.3114 13.7019 5.7019C14.3114 5.09241 15.138 4.75 16 4.75C16.862 4.75 17.6886 5.09241 18.2981 5.7019C18.9076 6.3114 19.25 7.13805 19.25 8C19.25 8.19891 19.329 8.38968 19.4697 8.53033C19.6103 8.67098 19.8011 8.75 20 8.75C20.1989 8.75 20.3897 8.67098 20.5303 8.53033C20.671 8.38968 20.75 8.19891 20.75 8C20.75 6.74022 20.2496 5.53204 19.3588 4.64124C18.468 3.75045 17.2598 3.25 16 3.25Z"
            fill="currentColor"
          />
          <rect
            x="4.75"
            y="10.25"
            width="11"
            height="9.75"
            rx="2.5"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <!-- Voice/music mini player docks here so conversation tiles sit below it. -->
    <div id="zb-media-player-dock" class="flex-shrink-0" />

    <!-- ============ BODY: LIST ============ -->
    <div
      v-show="panel === 'list'"
      class="flex-1 min-h-0 relative"
    >
      <div
        ref="scrollBox"
        @scroll="onListScroll"
        class="absolute inset-0 overflow-y-auto custom-scrollbar tg-scroll"
      >
        <div class="conv-list-shell pt-1 pb-24">
          <MessengerSkeleton v-if="loading || emptyStatePending" variant="conversations" />
          <!-- Scenario 1: new user — contact onboarding -->
          <ContactOnboardingPanel
            v-else-if="showContactOnboarding"
            @skip="onOnboardingSkip"
            @synced="onOnboardingSynced"
          />
          <!-- Scenario 2: imported contacts, no chats — suggested carousel -->
          <div v-else-if="showSuggestedContacts" class="space-y-3">
            <SuggestedContactsCarousel
              :synced-registered="syncedRegistered"
              :contacts="contacts"
              :me-id="meId"
              @select="onSuggestedSelect"
            />
            <div class="px-4 pb-2 text-center">
              <p class="text-[13px] text-[#a2acb4]">{{ $t("messenger.suggestedContactsHint") }}</p>
            </div>
          </div>
          <!-- Skipped onboarding / empty with retry -->
          <div
            v-else-if="!conversations.length"
            class="mx-3"
          >
            <div class="contact-empty-glass px-4 py-10">
              <div class="tg-empty-block !py-0">
                <p class="tg-empty-block__title">{{ $t("messenger.noConversations") }}</p>
                <p class="tg-empty-block__hint">{{ $t("messenger.contactOnboardingRetryHint") }}</p>
                <button
                  type="button"
                  class="mt-4 px-5 py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#4ea4f5] text-white text-[14px] font-semibold transition active:scale-[.98]"
                  @click="retryContactImport"
                >
                  {{ $t("messenger.contactOnboardingRetry") }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="conv-list">
            <button
              v-for="(c, idx) in conversations"
              :key="c.id"
              :data-conv-id="c.id"
              type="button"
              @click="onConvClick(c)"
              @contextmenu.prevent="openConvMenu($event, c)"
              @touchstart.passive="lpStart($event, c)"
              @touchend="lpEnd"
              @touchmove.passive="lpMove"
              :class="[
                'conv-row',
                activeId === c.id ? 'is-active' : '',
                idx < conversations.length - 1 ? 'has-divider' : '',
                c.unread_count > 0 ? 'has-unread' : '',
              ]"
            >
              <MessengerAvatar
                :user="convUser(c)"
                size="md"
                :saved="isSaved(c)"
                :online="showOnline(c)"
              />
              <div class="conv-row-body flex-1 min-w-0">
                <div class="conv-row-top">
                  <div class="conv-row-title min-w-0">
                    <svg
                      v-if="c.type === 'group'"
                      class="conv-row-type"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                      />
                    </svg>
                    <svg
                      v-else-if="c.type === 'channel'"
                      class="conv-row-type"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 11l18-5v12L3 13v-2z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.6 16.8a3 3 0 11-5.8-1.6"
                      />
                    </svg>
                    <span class="conv-row-name">{{ convName(c) }}</span>
                    <svg
                      v-if="isMuted(c)"
                      class="conv-row-mute"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5M1 1l22 22"
                      />
                    </svg>
                  </div>
                  <span
                    class="conv-row-time"
                    :class="{ 'is-unread': c.unread_count > 0 && !isMuted(c) }"
                  >{{ lastTime(c) }}</span>
                </div>
                <div class="conv-row-bottom">
                  <span
                    class="conv-row-preview flex-1"
                    :class="[
                      typingLabelFor(c) ? 'is-typing' : '',
                      typingActivityFor(c) ? `is-${typingActivityFor(c)}` : '',
                      hasDraftPreview(c) ? 'is-draft' : '',
                    ]"
                  >
                    <span
                      v-if="typingLabelFor(c)"
                      class="truncate conv-typing-text"
                    >
                      <span class="conv-typing-label">{{
                        typingLabelFor(c)
                      }}</span>
                      <span class="typing-dots" aria-hidden="true">
                        <span class="typing-dot" />
                        <span class="typing-dot" />
                        <span class="typing-dot" />
                      </span>
                    </span>
                    <template v-else>
                      <span
                        v-if="lastIsMine(c) && !hasDraftPreview(c)"
                        class="conv-row-ticks flex-shrink-0 leading-none"
                        :class="{
                          'is-read': lastRead(c),
                          'is-delivered': lastDelivered(c) && !lastRead(c),
                        }"
                      >
                        <PendingClockIcon
                          v-if="lastPending(c)"
                          icon-class="w-3.5 h-3.5 opacity-80"
                        />
                        <svg
                          v-else-if="lastRead(c)"
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M1 13l4 4L13 7"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M11 13l4 4L23 7"
                          />
                        </svg>
                        <svg
                          v-else-if="lastDelivered(c)"
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M1 13l4 4L13 7"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M11 13l4 4L23 7"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4 13l4 4L18 7"
                          />
                        </svg>
                      </span>
                      <span class="conv-row-snippet truncate">
                        <span
                          v-if="lastPreviewEmoji(c)"
                          class="conv-preview-emoji"
                          aria-hidden="true"
                        >{{ lastPreviewEmoji(c) }}</span>
                        <svg
                          v-else-if="lastPreviewKind(c) === 'gif'"
                          class="conv-preview-ico"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8" />
                          <path d="M3 15l4.2-3.6a1.2 1.2 0 011.5 0L12 14l2.3-1.8a1.2 1.2 0 011.5 0L21 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                          <circle cx="8.2" cy="9" r="1.35" fill="currentColor" />
                          <path d="M15.2 10.2l4.3 2.5-4.3 2.5v-5z" fill="currentColor" />
                        </svg>
                        <span
                          v-if="lastPreviewAccent(c)"
                          class="conv-preview-label"
                          :class="`is-${lastPreviewKind(c)}`"
                        >{{ lastPreviewAccent(c) }}</span>
                        <span
                          v-if="lastPreviewAccent(c) && lastSnippet(c)"
                          class="conv-preview-sep"
                          aria-hidden="true"
                        >, </span>
                        <span v-if="lastSnippet(c)" class="conv-preview-text truncate">{{ lastSnippet(c) }}</span>
                      </span>
                    </template>
                  </span>
                  <span
                    v-if="c.unread_count > 0"
                    class="conv-row-badge"
                    :class="{ 'is-muted': isMuted(c) }"
                  >
                    {{ unreadLabel(c.unread_count) }}
                  </span>
                </div>
              </div>
            </button>
          </div>
          <MessengerSkeleton
            v-if="convLoadingMore"
            variant="conversations"
            :count="2"
            class="mt-1"
          />
        </div>
      </div>

      <!-- Contacts FAB -->
      <transition name="fab-pop">
        <button
          v-show="fabVisible"
          type="button"
          class="absolute bottom-5 rtl:left-5 ltr:right-5 w-14 h-14 rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white shadow-lg active:scale-95 transition flex items-center justify-center z-20"
          :title="$t('messenger.contacts')"
          @click.stop="openContacts"
        >
        <svg
          class="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M21.265 8.18a9.8 9.8 0 0 0-2.17-3.25a10 10 0 0 0-10.9-2.17a10.2 10.2 0 0 0-3.25 2.17A9.94 9.94 0 0 0 2.025 12a9.6 9.6 0 0 0 .74 3.77l-.5 3.65a1.9 1.9 0 0 0 0 .94a2 2 0 0 0 .46.82a2 2 0 0 0 .79.5c.296.098.612.122.92.07l3.66-.54a9.7 9.7 0 0 0 3.88.79a10 10 0 0 0 7.07-2.93a9.7 9.7 0 0 0 2.17-3.24a10 10 0 0 0 0-7.65zm-5.6 4.51h-2.91v2.89a1 1 0 1 1-2 0v-2.89h-2.89a1 1 0 1 1 0-2h2.89v-2.9a1 1 0 0 1 2 0v2.9h2.91a1 1 0 0 1 0 2"
            />
          </svg>
        </button>
      </transition>
    </div>

    <!-- ============ BODY: SEARCH ============ -->
    <transition name="panel-fade">
      <div
        v-if="panel === 'search'"
        class="messenger-search-results flex-1 overflow-y-auto custom-scrollbar min-h-0 bg-[#f4f4f5] dark:bg-[#0e1621]"
      >
        <!-- Recent searches (no query) -->
        <template v-if="!query.trim()">
          <div v-if="recentSearches.length" class="pt-3 pb-5">
            <div class="tg-card mx-3 overflow-hidden">
              <div
                class="flex items-center justify-between px-3.5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                <p class="text-[12px] font-medium text-[#a2acb4]">
                  {{ $t("messenger.recentSearches") }}
                </p>
                <button
                  @click="clearRecents"
                  class="text-[12px] font-medium text-red-500 hover:text-red-600"
                >
                  {{ $t("messenger.clearAll") }}
                </button>
              </div>
              <div
                v-for="(term, i) in recentSearches"
                :key="'r' + i"
                :class="[
                  'group w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition',
                  i < recentSearches.length - 1
                    ? 'border-b border-black/[0.06] dark:border-white/[0.06]'
                    : '',
                ]"
              >
                <button
                  class="flex items-center gap-2.5 flex-1 min-w-0 text-start"
                  @click="runRecentSearch(term)"
                >
                  <span
                    class="w-8 h-8 rounded-full bg-white dark:bg-[#17212b] ring-1 ring-black/[0.04] dark:ring-white/[0.06] flex items-center justify-center text-[#a2acb4] flex-shrink-0"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span
                    class="text-[13px] text-gray-700 dark:text-gray-200 truncate"
                    >{{ term }}</span
                  >
                </button>
                <button
                  @click="removeRecent(i)"
                  class="p-1.5 rounded-full text-[#a2acb4] hover:bg-black/[0.04] dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                >
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="px-4 py-12 text-center text-[13px] text-[#a2acb4]">
            {{ $t("messenger.searchEverywhere") }}
          </div>
        </template>

        <!-- Below min length: chat name matches only + hint -->
        <template v-else-if="!queryMeetsMin">
          <div class="pt-3 pb-5 space-y-3">
            <div v-if="convMatches.length" class="tg-card mx-3 overflow-hidden">
              <p
                class="px-3.5 py-2 text-[12px] font-medium text-[#a2acb4] border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                {{ $t("messenger.conversationsSection") }}
              </p>
              <button
                v-for="(c, idx) in convMatches"
                :key="'sc' + c.id"
                type="button"
                @click="onSearchSelectConversation(c)"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition text-start',
                  idx < convMatches.length - 1
                    ? 'border-b border-black/[0.06] dark:border-white/[0.06]'
                    : '',
                ]"
              >
                <MessengerAvatar
                  :user="convUser(c)"
                  size="md"
                  :saved="isSaved(c)"
                  :online="showOnline(c)"
                />
                <span class="text-[13px] font-medium text-gray-800 dark:text-gray-100 truncate">{{
                  convName(c)
                }}</span>
              </button>
            </div>
            <div class="mx-3 px-4 py-8 text-center text-[13px] text-[#a2acb4]">
              {{ $t("messenger.searchMinChars", { count: searchMinChars }) }}
            </div>
          </div>
        </template>

        <!-- Results (with query) -->
        <template v-else>
          <div class="pt-3 pb-5 space-y-3">
            <div v-if="convMatches.length" class="tg-card mx-3 overflow-hidden">
              <p
                class="px-3.5 py-2 text-[12px] font-medium text-[#a2acb4] border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                {{ $t("messenger.conversationsSection") }}
              </p>
              <button
                v-for="(c, idx) in convMatches"
                :key="'c' + c.id"
                @click="onSearchSelectConversation(c)"
                @contextmenu.prevent="openConvMenu($event, c)"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition text-start',
                  idx < convMatches.length - 1
                    ? 'border-b border-black/[0.06] dark:border-white/[0.06]'
                    : '',
                ]"
              >
                <MessengerAvatar
                  :user="convUser(c)"
                  size="md"
                  :saved="isSaved(c)"
                  :online="showOnline(c)"
                />
                <span
                  class="text-[13px] font-medium text-gray-800 dark:text-gray-100 truncate"
                  >{{ convName(c) }}</span
                >
              </button>
            </div>

            <div
              v-if="searching || globalResults.length"
              class="tg-card mx-3 overflow-hidden"
            >
              <p
                class="px-3.5 py-2 text-[12px] font-medium text-[#a2acb4] border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                {{ $t("messenger.usersSection") }}
              </p>
              <MessengerSkeleton
                v-if="searching && !globalResults.length"
                variant="users"
                :count="4"
              />
              <button
                v-for="(u, idx) in globalResults"
                :key="'u' + u.id"
                @click="onSearchStartChat(u)"
                @contextmenu.prevent="openUserMenu($event, u)"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition text-start',
                  idx < globalResults.length - 1
                    ? 'border-b border-black/[0.06] dark:border-white/[0.06]'
                    : '',
                ]"
              >
                <MessengerAvatar :user="u" size="md" :online="!!u?.is_online" />
                <div class="flex-1 min-w-0">
                  <div
                    class="text-[13px] font-medium text-gray-800 dark:text-gray-100 truncate"
                  >
                    {{ partnerName(u) }}
                  </div>
                  <div class="text-[12px] text-[#a2acb4] truncate">
                    @{{ u.username }}
                  </div>
                </div>
              </button>
            </div>

            <div
              v-if="messageResults.length || searchingMessages"
              class="tg-card mx-3 overflow-hidden"
            >
              <p
                class="px-3.5 py-2 text-[12px] font-medium text-[#a2acb4] border-b border-black/[0.06] dark:border-white/[0.06]"
              >
                {{ $t("messenger.messagesSection") }}
              </p>
              <MessengerSkeleton
                v-if="searchingMessages && !messageResults.length"
                variant="conversations"
                :count="3"
              />
              <button
                v-for="(m, idx) in messageResults"
                :key="'m' + m.id"
                type="button"
                @click="onSearchSelectMessage(m)"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition text-start',
                  idx < messageResults.length - 1
                    ? 'border-b border-black/[0.06] dark:border-white/[0.06]'
                    : '',
                ]"
              >
                <MessengerAvatar
                  :user="messageHitUser(m)"
                  size="md"
                  :saved="m.conversation?.type === 'saved'"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span
                      class="text-[13px] font-medium text-gray-800 dark:text-gray-100 truncate"
                      >{{ messageHitName(m) }}</span
                    >
                    <span
                      class="text-[11px] text-[#a2acb4] flex-shrink-0 tabular-nums"
                      >{{ messageHitTime(m) }}</span
                    >
                  </div>
                  <div
                    class="text-[12px] text-[#707579] dark:text-[#a2acb4] truncate mt-0.5"
                    dir="auto"
                  >
                    <template
                      v-for="(seg, si) in messageHitSegs(m)"
                      :key="'hs' + si"
                    >
                      <mark v-if="seg.hit" class="msg-global-search-hit">{{
                        seg.text
                      }}</mark>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </div>
                </div>
              </button>
            </div>

            <div
              v-if="
                !searching &&
                !searchingMessages &&
                !globalResults.length &&
                !convMatches.length &&
                !messageResults.length
              "
              class="mx-3 px-4 py-8 text-center text-[13px] text-[#a2acb4]"
            >
              {{ $t("messenger.noResults") }}
            </div>
          </div>
        </template>
      </div>
    </transition>

    <!-- ============ BODY: MENU ============ -->
    <transition name="panel-fade">
      <MenuPanel
        v-if="panel === 'menu'"
        ref="menuPanel"
        class="flex-1 min-h-0"
        :contacts="contacts"
        @close="closeMenu"
        @start-chat="onMenuStartChat"
        @update-contact="(p) => $emit('update-contact', p)"
        @delete-contact="(id) => $emit('delete-contact', id)"
        @rename-contact="(c) => $emit('rename-contact', c)"
        @block-user="(id) => $emit('block-user', id)"
        @unblock-user="(id) => $emit('unblock-user', id)"
        @contact-menu="({ event, contact }) => openContactMenu(event, contact)"
        @open-saved="onMenuOpenSaved"
        @community-created="(c) => $emit('community-created', c)"
        @select-conversation="onMenuSelectConversation"
        @open-community-info="onMenuOpenCommunityInfo"
        @exit="$emit('exit')"
        @request-logout="$emit('request-logout')"
      />
    </transition>

    <!-- ============ BODY: FORWARD PICKER ============ -->
    <transition name="panel-fade">
      <ForwardPickerPanel
        v-if="panel === 'forward'"
        ref="forwardPanel"
        class="flex-1 min-h-0"
        :conversations="conversations"
        :contacts="contacts"
        :me-id="meId"
        @close="closeForward"
        @pick-conversation="(p) => $emit('forward-pick-conversation', p)"
        @pick-user="(p) => $emit('forward-pick-user', p)"
        @pick-saved="$emit('forward-pick-saved')"
        @send-targets="(p) => $emit('forward-send-targets', p)"
      />
    </transition>

    <AccountMenu
      :visible="accountMenuOpen"
      :anchor-rect="accountMenuAnchor"
      @close="accountMenuOpen = false"
      @navigate="onAccountNavigate"
    />

    <ContextMenu
      :visible="convMenu.visible"
      :x="convMenu.x"
      :y="convMenu.y"
      :items="convMenuItems"
      @select="onConvMenuSelect"
      @close="convMenu.visible = false"
    />

    <ContextMenu
      :visible="entityMenu.visible"
      :x="entityMenu.x"
      :y="entityMenu.y"
      :items="entityMenuItems"
      @select="onEntityMenuSelect"
      @close="entityMenu.visible = false"
    />
  </div>
</template>

<script>
import { searchUsers, searchAllMessages } from "@/services/messenger";
import { mapGetters, mapState } from "@/composables/useStore";
import ContextMenu from "./ContextMenu.vue";
import AccountMenu from "./AccountMenu.vue";
import MenuPanel from "./MenuPanel.vue";
import ForwardPickerPanel from "./ForwardPickerPanel.vue";
import MessengerSkeleton from "./MessengerSkeleton.vue";
import MessengerAvatar from "./MessengerAvatar.vue";
import PendingClockIcon from "./PendingClockIcon.vue";
import ContactOnboardingPanel from "./ContactOnboardingPanel.vue";
import SuggestedContactsCarousel, {
  buildSuggestedContacts,
} from "./SuggestedContactsCarousel.vue";
import { formatTypingStatus } from "./typingHelpers";
import { stripFormatMarkers } from "./messageFormat";
import { splitHighlight } from "./textHelpers";
import { isAnimationMessage, isStickerMessage } from "./stickerGifLibrary";
import { shapeUiDigits } from "./appearance";
import {
  SEARCH_MIN_CHARS,
  meetsSearchMin,
  searchCachedMessages,
  mergeMessageSearchHits,
} from "./searchHelpers";
import { peerDisplayName, conversationPartner } from "@/utils/messengerPeerName";
import { cachedSidebarSnippet } from "@/utils/messengerSidebarPreview";
import { subscribeAppLock, lockAppNow, isAppLockEnabled } from "./appLock";
import { LOCKED_PLACEHOLDER } from "@/crypto/messenger";
import { LONG_PRESS_MS } from "./motion";
import {
  hasImportedContacts,
  isContactOnboardingSkipped,
  clearContactOnboardingSkip,
} from "@/utils/contactSync";
import {
  connectionStatusI18nKey,
  connectionStatusShowsDots,
  isConnectionHealthy,
  resolveConnectionDisplayStatus,
} from "@/utils/connectionStatus";

const RECENTS_KEY = "messenger_recent_searches";

function readRecents() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENTS_KEY));
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

export default {
  components: {
    MessengerAvatar,
    ContextMenu,
    AccountMenu,
    MenuPanel,
    ForwardPickerPanel,
    MessengerSkeleton,
    PendingClockIcon,
    ContactOnboardingPanel,
    SuggestedContactsCarousel,
  },
  props: {
    conversations: { type: Array, default: () => [] },
    contacts: { type: Array, default: () => [] },
    activeId: { type: [Number, null], default: null },
    meId: { type: [Number, String], default: null },
    loading: { type: Boolean, default: false },
    connected: { type: Boolean, default: false },
    connectionState: { type: String, default: "connecting" },
    connectionDisplayStatus: { type: String, default: "" },
    networkOnline: { type: Boolean, default: true },
    convHasMore: { type: Boolean, default: false },
    convLoadingMore: { type: Boolean, default: false },
  },
  emits: [
    "select",
    "load-more-conversations",
    "start-chat",
    "update-contact",
    "delete-contact",
    "exit",
    "request-logout",
    "mark-read",
    "mute",
    "clear-conversation",
    "delete-conversation",
    "add-contact",
    "rename-contact",
    "block-user",
    "unblock-user",
    "add-user-contact",
    "open-saved",
    "community-created",
    "open-profile",
    "open-message",
    "forward-pick-conversation",
    "forward-pick-user",
    "forward-pick-saved",
    "forward-send-targets",
    "forward-cancel",
  ],
  data() {
    return {
      panel: "list", // list | search | menu | forward
      searchExpanded: false,
      query: "",
      globalResults: [],
      messageResults: [],
      searching: false,
      searchingMessages: false,
      searchTimer: null,
      recentSearches: readRecents(),
      convMenu: { visible: false, x: 0, y: 0, conv: null },
      accountMenuOpen: false,
      accountMenuAnchor: null,
      themeDark:
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark"),
      entityMenu: { visible: false, x: 0, y: 0, kind: null, payload: null },
      lpTimer: null,
      lpStartPos: null,
      lpSuppressClick: false,
      fabVisible: true,
      lastScrollTop: 0,
      appLockEnabled: isAppLockEnabled(),
      unsubAppLock: null,
      onboardingSkipped: isContactOnboardingSkipped(),
      syncedContactsReady: false,
    };
  },
  computed: {
    ...mapState("messenger", ["messages", "syncedContacts", "syncedContactsLoading"]),
    ...mapGetters("messenger", [
      "typingByConversation",
      "draftForConversation",
    ]),
    syncedRegistered() {
      return this.syncedContacts?.registered || [];
    },
    hasImported() {
      return hasImportedContacts(this.syncedContacts);
    },
    suggestedPreview() {
      return buildSuggestedContacts({
        syncedRegistered: this.syncedRegistered,
        contacts: this.contacts,
        meId: this.meId,
        limit: 10,
      });
    },
    /** No chats + no address-book import → dedicated onboarding (unless skipped). */
    showContactOnboarding() {
      if (this.loading || this.conversations.length) return false;
      if (!this.syncedContactsReady) return false;
      if (this.onboardingSkipped) return false;
      return !this.hasImported;
    },
    /** Imported contacts, no chats → suggested avatars carousel. */
    showSuggestedContacts() {
      if (this.loading || this.conversations.length) return false;
      if (!this.syncedContactsReady) return false;
      if (!this.hasImported && !this.contacts.length) return false;
      return this.suggestedPreview.length > 0;
    },
    /** Hold empty UI until we know whether to onboard or suggest. */
    emptyStatePending() {
      return !this.loading && !this.conversations.length && !this.syncedContactsReady;
    },
    searchMinChars() {
      return SEARCH_MIN_CHARS;
    },
    queryMeetsMin() {
      return meetsSearchMin(this.query);
    },
    /** Precomputed typing subtitles for visible conversations (avoids repeat work in template). */
    typingStatusMap() {
      const by = this.typingByConversation || {};
      const fallback = this.$t("messenger.user");
      const out = {};
      this.conversations.forEach((c) => {
        if (!c?.id) return;
        const users = by[c.id] || by[String(c.id)];
        if (!users?.length) return;
        const status = formatTypingStatus(this.$t.bind(this), users, {
          privateChat: !this.isCommunity(c) && !this.isSaved(c),
          fallbackName: fallback,
        });
        if (status) out[String(c.id)] = status;
      });
      return out;
    },
    typingLabelMap() {
      const out = {};
      Object.entries(this.typingStatusMap).forEach(([id, status]) => {
        if (status?.label) out[id] = status.label;
      });
      return out;
    },
    statusConnected() {
      return this.connected || this.connectionState === "connected";
    },
    resolvedDisplayStatus() {
      if (this.connectionDisplayStatus) return this.connectionDisplayStatus;
      return resolveConnectionDisplayStatus({
        state: this.connectionState,
        isOnline: this.networkOnline,
        networkConfirmedDown: this.connectionState === "unavailable",
        everConnected: false,
        reconnectAttempt: 0,
      });
    },
    showConnectionStatus() {
      return !isConnectionHealthy(this.resolvedDisplayStatus);
    },
    connectionStatusKey() {
      return connectionStatusI18nKey(this.resolvedDisplayStatus);
    },
    connectionStatusText() {
      const key = this.connectionStatusKey;
      return key ? this.$t(key) : "";
    },
    connectionStatusDots() {
      return connectionStatusShowsDots(this.resolvedDisplayStatus);
    },
    isDark() {
      return this.themeDark;
    },
    convMatches() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return this.conversations.filter((c) =>
        this.convName(c).toLowerCase().includes(q),
      );
    },
    convMenuItems() {
      const c = this.convMenu.conv;
      if (!c) return [];
      const items = [
        { label: this.$t("messenger.open"), icon: "open", value: "open" },
      ];
      if (c.unread_count > 0) {
        items.push({
          label: this.$t("messenger.markRead"),
          icon: "check",
          value: "mark-read",
        });
      }
      const muted = !!(c.pivot && c.pivot.muted_at);
      items.push({
        label: muted ? this.$t("messenger.unmute") : this.$t("messenger.mute"),
        icon: muted ? "bell" : "bellOff",
        value: "mute",
      });
      items.push({ divider: true });
      items.push({
        label: this.$t("messenger.clearConversation"),
        icon: "eraser",
        value: "clear",
      });
      items.push({
        label: this.$t("messenger.deleteConversation"),
        icon: "trash",
        value: "delete",
        danger: true,
      });
      return items;
    },
    entityMenuItems() {
      const { kind, payload } = this.entityMenu;
      if (!payload) return [];
      if (kind === "contact") {
        const blocked = !!payload.is_blocked;
        return [
          {
            label: this.$t("messenger.sendMessage"),
            icon: "open",
            value: "message",
          },
          { label: this.$t("messenger.rename"), icon: "edit", value: "rename" },
          {
            label: payload.is_favorite
              ? this.$t("messenger.unfavorite")
              : this.$t("messenger.favorite"),
            icon: "star",
            value: "favorite",
          },
          { divider: true },
          {
            label: blocked
              ? this.$t("messenger.unblock")
              : this.$t("messenger.block"),
            icon: blocked ? "bell" : "bellOff",
            value: blocked ? "unblock" : "block",
            danger: !blocked,
          },
          {
            label: this.$t("messenger.deleteContact"),
            icon: "trash",
            value: "delete",
            danger: true,
          },
        ];
      }
      return [
        {
          label: this.$t("messenger.sendMessage"),
          icon: "open",
          value: "message",
        },
        { label: this.$t("messenger.addContact"), icon: "edit", value: "add" },
        { divider: true },
        {
          label: this.$t("messenger.block"),
          icon: "bellOff",
          value: "block",
          danger: true,
        },
      ];
    },
  },
  beforeUnmount() {
    this.lpClear();
    document.documentElement.removeEventListener(
      "onChangeTheme",
      this.syncThemeDark,
    );
    if (typeof this.unsubAppLock === "function") this.unsubAppLock();
  },
  mounted() {
    document.documentElement.addEventListener(
      "onChangeTheme",
      this.syncThemeDark,
    );
    this.appLockEnabled = isAppLockEnabled();
    this.unsubAppLock = subscribeAppLock((snap) => {
      this.appLockEnabled = !!snap.enabled;
    });
    this.ensureSyncedContacts();
  },
  methods: {
    syncThemeDark() {
      this.themeDark = document.documentElement.classList.contains("dark");
    },
    lockNow() {
      lockAppNow();
    },
    async ensureSyncedContacts() {
      try {
        await this.$store.dispatch("messenger/fetchSyncedContacts");
      } catch {
        /* offline / first paint */
      } finally {
        this.syncedContactsReady = true;
      }
    },
    onOnboardingSkip() {
      this.onboardingSkipped = true;
    },
    onOnboardingSynced() {
      this.onboardingSkipped = false;
      this.syncedContactsReady = true;
    },
    retryContactImport() {
      clearContactOnboardingSkip();
      this.onboardingSkipped = false;
      if (this.hasImported) {
        this.openMenu("contactSync");
        return;
      }
      // Re-show dedicated onboarding in the list empty state.
    },
    onSuggestedSelect(user) {
      if (!user) return;
      this.$emit("start-chat", user);
    },
    scrollToConversation(conversationId) {
      if (conversationId == null) return;
      this.$nextTick(() => {
        const box = this.$refs.scrollBox;
        if (!box) return;
        const el = box.querySelector(`[data-conv-id="${conversationId}"]`);
        if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    },
    // Called by the parent's back-button handler. Step one level back inside the
    // sidebar (close open context menus, search, or menu levels). Returns true
    // when a level was consumed.
    // True only when the sidebar shows the bare conversation list with no menu,
    // search panel, or open context menu — i.e. the messenger's real root.
    isAtListRoot() {
      return (
        this.panel === "list" &&
        !this.searchExpanded &&
        !this.accountMenuOpen &&
        !this.convMenu.visible &&
        !this.entityMenu.visible
      );
    },
    handleBack() {
      if (this.accountMenuOpen) {
        this.accountMenuOpen = false;
        return true;
      }
      if (this.convMenu.visible) {
        this.convMenu.visible = false;
        return true;
      }
      if (this.entityMenu.visible) {
        this.entityMenu.visible = false;
        return true;
      }
      if (this.panel === "forward") {
        const fp = this.$refs.forwardPanel;
        if (fp && typeof fp.handleBack === "function" && fp.handleBack())
          return true;
        this.closeForward();
        return true;
      }
      if (this.panel === "menu") {
        const mp = this.$refs.menuPanel;
        if (mp && typeof mp.handleBack === "function" && mp.handleBack())
          return true;
        this.closeMenu();
        return true;
      }
      if (this.searchExpanded || this.panel === "search") {
        this.closeSearch();
        return true;
      }
      return false;
    },
    // -------- Panels --------
    expandSearch() {
      this.searchExpanded = true;
      this.panel = "search";
      this.accountMenuOpen = false;
      this.$nextTick(() => this.$refs.searchInput?.focus());
    },
    /** Collapse search field but keep the query for the expand animation. */
    collapseSearch() {
      this.searchExpanded = false;
      this.panel = "list";
      // Do not clear query — Telegram preserves it across collapse/expand.
      this.$refs.searchInput?.blur?.();
    },
    openSearch() {
      this.expandSearch();
    },
    closeSearch() {
      this.searchExpanded = false;
      this.panel = "list";
      this.query = "";
      this.globalResults = [];
      this.messageResults = [];
      this.searching = false;
      this.searchingMessages = false;
    },
    onSidebarPointerDown(e) {
      if (!this.searchExpanded) return;
      const header = this.$refs.listHeader;
      const target = e.target;
      if (!(target instanceof Node)) return;
      // Clicks inside the header (input / clear / back) stay in search.
      if (header && header.contains(target)) return;
      // Clicks on search results stay in search.
      if (this.panel === "search") {
        const resultsRoot = this.$el?.querySelector?.(".messenger-search-results");
        if (resultsRoot && resultsRoot.contains(target)) return;
      }
      this.collapseSearch();
    },
    openMenu(view = "root") {
      this.panel = "menu";
      this.$nextTick(() => {
        const mp = this.$refs.menuPanel;
        if (mp && view !== "root" && typeof mp.go === "function") mp.go(view);
      });
    },
    closeMenu() {
      this.panel = "list";
    },
    openForward() {
      this.panel = "forward";
      this.$store.dispatch("messenger/fetchContacts").catch(() => {});
      this.$nextTick(() => this.$refs.forwardPanel?.armPicks?.());
    },
    /** Close forward picker. Pass `{ cancel: false }` after a successful pick. */
    closeForward({ cancel = true } = {}) {
      this.panel = "list";
      if (cancel) this.$emit("forward-cancel");
    },
    toggleAccountMenu() {
      if (this.accountMenuOpen) {
        this.accountMenuOpen = false;
        return;
      }
      const btn = this.$refs.menuBtn;
      this.accountMenuAnchor = btn ? btn.getBoundingClientRect() : null;
      this.accountMenuOpen = true;
    },
    onAccountNavigate(value) {
      if (value === "exit") {
        this.$emit("exit");
        return;
      }
      if (value === "saved") {
        this.$emit("open-saved");
        return;
      }
      const viewMap = {
        profile: "profile",
        contacts: "contacts",
        settings: "settings",
        appearance: "appearance",
        language: "language",
        communities: "communities",
        joinCommunity: "joinCommunity",
      };
      const view = viewMap[value] || "root";
      this.openMenu(view);
    },
    onMenuSelectConversation(c) {
      if (!c) return;
      this.$emit("select", c);
      this.closeMenu();
    },
    onMenuOpenCommunityInfo(c) {
      if (!c) return;
      this.$emit("select", c);
      this.$nextTick(() => this.$emit("open-profile", c));
      this.closeMenu();
    },
    openContacts() {
      this.openMenu("contacts");
    },
    applyTheme(value) {
      if (value === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      this.themeDark = value === "dark";
      localStorage.setItem("theme", value);
      document.documentElement.dispatchEvent(new Event("onChangeTheme"));
      this.$store.dispatch("messenger/saveSettings", { theme: value });
    },

    // -------- Recent searches --------
    saveRecents() {
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(this.recentSearches));
      } catch (e) {
        /* noop */
      }
    },
    rememberSearch() {
      const term = this.query.trim();
      if (!meetsSearchMin(term)) return;
      this.recentSearches = [
        term,
        ...this.recentSearches.filter((t) => t !== term),
      ].slice(0, 12);
      this.saveRecents();
    },
    removeRecent(i) {
      this.recentSearches = this.recentSearches.filter((_, idx) => idx !== i);
      this.saveRecents();
    },
    clearRecents() {
      this.recentSearches = [];
      this.saveRecents();
    },
    runRecentSearch(term) {
      this.query = term;
      this.onSearchInput();
    },

    // -------- Conversation helpers --------
    isSaved(c) {
      return c?.type === "saved";
    },
    isCommunity(c) {
      return c?.type === "group" || c?.type === "channel";
    },
    /** Online dot is presence for private partners only — never groups/channels/saved. */
    showOnline(c) {
      if (!c || this.isSaved(c) || this.isCommunity(c)) return false;
      return !!this.partnerOf(c)?.is_online;
    },
    typingLabelFor(c) {
      if (!c?.id) return null;
      return this.typingStatusMap[String(c.id)]?.label || null;
    },
    typingActivityFor(c) {
      if (!c?.id) return null;
      return this.typingStatusMap[String(c.id)]?.activity || null;
    },
    hasDraftPreview(c) {
      if (!c?.id || this.typingLabelFor(c)) return false;
      return !!this.draftForConversation(c.id)?.trim();
    },
    convUser(c) {
      if (this.isSaved(c))
        return c.users?.find((u) => u.id === this.meId) || {};
      if (this.isCommunity(c)) {
        return {
          id: c.id,
          first_name: c.title,
          profile_pic: c.avatar,
          username: c.username,
        };
      }
      return this.partnerOf(c);
    },
    convName(c) {
      if (this.isSaved(c)) return this.$t("messenger.savedMessages");
      if (this.isCommunity(c))
        return (
          c.title ||
          (c.type === "channel"
            ? this.$t("messenger.channel")
            : this.$t("messenger.group"))
        );
      return this.partnerName(this.partnerOf(c));
    },
    partnerOf(c) {
      return conversationPartner(c, this.meId) || {};
    },
    isMuted(c) {
      return !!(
        c.pivot &&
        (c.pivot.muted_at || c.pivot.notification_mode === "mute")
      );
    },
    unreadLabel(count) {
      const n = Number(count) || 0;
      return shapeUiDigits(n > 99 ? "99+" : String(n), "sidebar");
    },
    partnerName(u) {
      if (!u || !u.id) return "—";
      const nick = (this.contacts || []).find(
        (ct) => Number(ct.contact_user?.id) === Number(u.id),
      )?.name;
      return peerDisplayName(u, nick, this.$t("messenger.user"));
    },
    lastSnippet(c) {
      const draft = this.draftForConversation(c.id);
      if (draft?.trim() && !this.typingLabelFor(c)) {
        const preview = stripFormatMarkers(draft).trim();
        const snippet =
          preview.length > 32 ? `${preview.slice(0, 32)}…` : preview;
        return `${this.$t("messenger.draft")}: ${snippet}`;
      }
      const msg = c.last_message;
      if (!msg) return this.$t("messenger.startConversation");

      // Prefer a previously unlocked preview when decrypt is still pending after refresh.
      const cached = cachedSidebarSnippet(c.id, msg);
      const view = cached
        ? {
          ...msg,
          type: cached.type || msg.type,
          body: cached.body,
          meta: cached.meta ? { ...(msg.meta || {}), ...cached.meta } : msg.meta,
          _e2e_decrypted: true,
          _e2e_locked: false,
          _decryptFailed: false,
        }
        : msg;

      // Media / location: always show type label (never the locked ciphertext string).
      if (view.type === "system") {
        const text = this.systemSnippet(c, view);
        return text.length > 38 ? `${text.slice(0, 38)}…` : text;
      }
      if (view.type === "location") {
        return this.$t("messenger.location");
      }
      if (["photo", "video", "voice", "audio", "file"].includes(view.type)) {
        // Sticker: only emoji + "Sticker" accent (no body text).
        if (isStickerMessage(view)) {
          return "";
        }
        const rawCap = view._e2e_decrypted
          && view.body
          && view.body !== LOCKED_PLACEHOLDER
          && !/^[A-Za-z0-9+/=\s]{24,}$/.test(String(view.body).trim())
          ? stripFormatMarkers(view.body || "").trim()
          : "";
        // GIF: accent "GIF" + optional caption after it.
        if (this.isGifPreviewMessage(view)) {
          if (!rawCap) return "";
          return rawCap.length > 32 ? `${rawCap.slice(0, 32)}…` : rawCap;
        }
        if (rawCap) return rawCap.length > 38 ? `${rawCap.slice(0, 38)}…` : rawCap;
        if (view.meta?.album_id) return this.$t("messenger.mediaAlbum");
        if (view.type === "photo") return this.$t("messenger.mediaPhoto");
        if (view.type === "video") return this.$t("messenger.mediaVideo");
        if (view.type === "voice") return this.$t("messenger.mediaVoice");
        if (view.type === "file") return view.meta?.name || this.$t("messenger.mediaFile");
        return this.$t("messenger.mediaAudio");
      }

      const locked = !!(
        view._e2e_locked
        || view._decryptFailed
        || (view.is_encrypted && !view._e2e_decrypted)
        || view.body === LOCKED_PLACEHOLDER
        || (view.is_encrypted && view.body && /^[A-Za-z0-9+/=\s]{24,}$/.test(String(view.body).trim()))
      );
      if (locked) return '…';

      const body = stripFormatMarkers(view.body || "");
      if (body && /^[A-Za-z0-9+/=\s]{24,}$/.test(body) && (view.is_encrypted || view.e2e)) {
        return '…';
      }
      return body.length > 38 ? `${body.slice(0, 38)}…` : body;
    },
    /** Last-message view used for Telegram-style sticker/GIF prefixes. */
    lastPreviewView(c) {
      const msg = c?.last_message;
      if (!msg || this.draftForConversation(c.id)?.trim()) return null;
      if (this.typingLabelFor(c)) return null;
      const cached = cachedSidebarSnippet(c.id, msg);
      if (!cached) return msg;
      return {
        ...msg,
        type: cached.type || msg.type,
        body: cached.body,
        meta: cached.meta ? { ...(msg.meta || {}), ...cached.meta } : msg.meta,
      };
    },
    isGifPreviewMessage(m) {
      if (!m || isStickerMessage(m)) return false;
      if (isAnimationMessage(m)) return true;
      const meta = m.meta || {};
      if (meta.animation || meta.silent) return true;
      return false;
    },
    lastPreviewKind(c) {
      const view = this.lastPreviewView(c);
      if (!view) return null;
      if (isStickerMessage(view)) return "sticker";
      if (this.isGifPreviewMessage(view)) return "gif";
      return null;
    },
    lastPreviewEmoji(c) {
      if (this.lastPreviewKind(c) !== "sticker") return "";
      const view = this.lastPreviewView(c);
      const emoji = String(view?.meta?.sticker_emoji || "").trim();
      return emoji || "⭐";
    },
    lastPreviewAccent(c) {
      const kind = this.lastPreviewKind(c);
      if (kind === "sticker") return this.$t("messenger.mediaSticker");
      if (kind === "gif") return this.$t("messenger.mediaGif");
      return "";
    },
    systemSnippet(c, msg) {
      if (msg?.system_kind === "cleared") {
        return msg.system_by_me === false && msg.system_actor
          ? this.$t("messenger.historyClearedBy", { name: msg.system_actor })
          : this.$t("messenger.historyCleared");
      }
      try {
        const meta =
          typeof msg.body === "string" ? JSON.parse(msg.body) : msg.body;
        const name = meta?.target_name || meta?.actor_name || "";
        const event = meta?.event;
        if (!event) return this.$t("messenger.systemMessage");

        let key = `messenger.sys_${event}`;
        // Match ChatArea: created / photo / title depend on group vs channel.
        if (event === "created") {
          key =
            c?.type === "channel"
              ? "messenger.sys_channel_created"
              : "messenger.sys_group_created";
        } else if (event === "group_photo_changed" && c?.type === "channel") {
          key = "messenger.sys_channel_photo_changed";
        } else if (event === "group_name_changed" && c?.type === "channel") {
          key = "messenger.sys_channel_name_changed";
        } else if (event === "user_joined" && c?.type === "channel") {
          key = "messenger.sys_channel_user_joined";
        } else if (event === "user_left" && c?.type === "channel") {
          key = "messenger.sys_channel_user_left";
        }

        const t = this.$t(key, { name: name || "…" });
        if (t !== key) return t;
      } catch (e) {
        /* fall through */
      }
      return this.$t("messenger.systemMessage");
    },
    lastTime(c) {
      const t = c.last_message_at || c.last_message?.created_at;
      if (!t) return "";
      const d = new Date(t);
      if (Number.isNaN(d.getTime())) return "";
      const now = new Date();
      const locale =
        this.$i18n && this.$i18n.locale === "en" ? "en-US" : "fa-IR";
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      const opts = { month: "long", day: "numeric" };
      if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
      return d.toLocaleDateString(locale, opts);
    },
    lastIsMine(c) {
      const msg = c.last_message;
      // System events shouldn't show delivery ticks in the list.
      if (!msg || msg.type === "system") return false;
      return !!(this.meId && Number(msg.user_id) === Number(this.meId));
    },
    lastPending(c) {
      const msg = c.last_message;
      if (!msg || msg.failed) return false;
      // Durable / receipt-stamped tips must never show the waiting clock.
      if (msg.delivered_at || msg.read_at) return false;
      const id = msg.id;
      const durable = id != null && (
        (typeof id === 'number' && Number.isFinite(id))
        || (typeof id === 'string' && /^\d+$/.test(id))
      );
      if (durable && !msg.awaiting_server) return false;
      return !!(msg.pending || msg.awaiting_server || msg.queued);
    },
    lastDelivered(c) {
      const msg = c.last_message;
      return !!(msg && (msg.delivered_at || msg.read_at));
    },
    lastRead(c) {
      return !!c.last_message?.read_at;
    },

    // -------- List scroll: pagination + FAB visibility --------
    onListScroll(e) {
      const el = e.target;
      if (
        this.convHasMore &&
        !this.convLoadingMore &&
        el.scrollHeight - el.scrollTop - el.clientHeight < 200
      ) {
        this.$emit("load-more-conversations");
      }
      const st = el.scrollTop;
      const noScroll = el.scrollHeight <= el.clientHeight + 4;
      if (noScroll || st <= 0) {
        this.fabVisible = true;
      } else if (st > this.lastScrollTop + 4) {
        this.fabVisible = false; // scrolling down
      } else if (st < this.lastScrollTop - 4) {
        this.fabVisible = true; // scrolling up
      }
      this.lastScrollTop = st;
    },

    // -------- Search --------
    onSearchInput() {
      clearTimeout(this.searchTimer);
      const q = this.query.trim();
      if (!meetsSearchMin(q)) {
        this.globalResults = [];
        this.messageResults = [];
        this.searching = false;
        this.searchingMessages = false;
        return;
      }
      this.searching = true;
      this.searchingMessages = true;
      this.searchTimer = setTimeout(async () => {
        const t = (k) => this.$t(k);
        const localHits = searchCachedMessages({
          messagesByConv: this.messages,
          conversations: this.conversations,
          query: q,
          limit: 40,
          t,
        });
        try {
          const [users, messagesRes] = await Promise.all([
            searchUsers(q, 15).catch(() => []),
            searchAllMessages({ q }).catch(() => ({ data: [] })),
          ]);
          this.globalResults = users || [];
          const serverHits = Array.isArray(messagesRes?.data)
            ? messagesRes.data
            : [];
          this.messageResults = mergeMessageSearchHits(localHits, serverHits, 40);
        } catch (e) {
          this.globalResults = [];
          this.messageResults = localHits;
        } finally {
          this.searching = false;
          this.searchingMessages = false;
        }
      }, 300);
    },
    clearSearch() {
      this.query = "";
      this.globalResults = [];
      this.messageResults = [];
      this.searching = false;
      this.searchingMessages = false;
      this.$nextTick(() => this.$refs.searchInput?.focus());
    },
    onSearchSelectConversation(c) {
      this.rememberSearch();
      this.$emit("select", c);
      this.closeSearch();
    },
    onSearchStartChat(u) {
      this.rememberSearch();
      this.$emit("start-chat", u);
      this.closeSearch();
    },
    onSearchSelectMessage(m) {
      if (!m?.conversation_id && !m?.conversation?.id) return;
      this.rememberSearch();
      this.$emit("open-message", {
        conversation: m.conversation || { id: m.conversation_id },
        messageId: m.id,
      });
      // Keep the search panel open (Telegram-style) so the user can pick another hit.
    },
    messageHitUser(m) {
      const c = m.conversation || {};
      if (c.type === "saved")
        return c.users?.find((u) => u.id === this.meId) || {};
      if (c.type === "group" || c.type === "channel") {
        return {
          id: c.id,
          first_name: c.title,
          profile_pic: c.avatar,
          username: c.username,
        };
      }
      return (
        c.partner || c.users?.find((u) => u.id !== this.meId) || m.user || {}
      );
    },
    messageHitName(m) {
      const c = m.conversation || {};
      if (c.type === "saved") return this.$t("messenger.savedMessages");
      if (c.type === "group" || c.type === "channel") {
        return (
          c.title ||
          (c.type === "channel"
            ? this.$t("messenger.channel")
            : this.$t("messenger.group"))
        );
      }
      return this.partnerName(c.partner || this.messageHitUser(m));
    },
    messageHitTime(m) {
      const t = m.created_at;
      if (!t) return "";
      const d = new Date(t);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return d.toLocaleDateString("fa-IR", {
        month: "numeric",
        day: "numeric",
      });
    },
    messageHitSegs(m) {
      let body = stripFormatMarkers(m.body || "")
        .replace(/\s+/g, " ")
        .trim();
      if (m.type === "location") body = this.$t("messenger.location");
      else if (isStickerMessage(m)) {
        const emoji = String(m.meta?.sticker_emoji || "").trim() || "⭐";
        body = `${emoji} ${this.$t("messenger.mediaSticker")}`;
      } else if (isAnimationMessage(m) || m.meta?.animation || m.meta?.silent) {
        body = this.$t("messenger.mediaGif");
      } else if (
        ["photo", "video", "voice", "audio", "file"].includes(m.type) &&
        !body
      ) {
        if (m.type === "photo") body = this.$t("messenger.mediaPhoto");
        else if (m.type === "video") body = this.$t("messenger.mediaVideo");
        else if (m.type === "voice") body = this.$t("messenger.mediaVoice");
        else if (m.type === "file")
          body = m.meta?.name || this.$t("messenger.mediaFile");
        else body = this.$t("messenger.mediaAudio");
      }
      return splitHighlight(body, this.query.trim());
    },
    onMenuStartChat(user) {
      this.closeMenu();
      this.$emit("start-chat", user);
    },
    onMenuOpenSaved() {
      this.closeMenu();
      this.$emit("open-saved");
    },

    // -------- Context menus --------
    openConvMenu(event, c) {
      this.convMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        conv: c,
      };
    },
    onConvClick(c) {
      if (this.lpSuppressClick) {
        this.lpSuppressClick = false;
        return;
      }
      this.$emit("select", c);
    },
    lpStart(event, c) {
      const t = event.touches && event.touches[0];
      this.lpStartPos = t ? { x: t.clientX, y: t.clientY } : null;
      this.lpClear();
      this.lpTimer = setTimeout(() => {
        const pos = this.lpStartPos || { x: 0, y: 0 };
        this.lpSuppressClick = true;
        if (navigator.vibrate) {
          try {
            navigator.vibrate(12);
          } catch (err) {
            /* noop */
          }
        }
        this.openConvMenu({ clientX: pos.x, clientY: pos.y }, c);
        this.lpTimer = null;
        setTimeout(() => {
          this.lpSuppressClick = false;
        }, 450);
      }, LONG_PRESS_MS);
    },
    lpEnd() {
      this.lpClear();
    },
    lpMove(event) {
      if (!this.lpStartPos || !this.lpTimer) return;
      const t = event.touches && event.touches[0];
      if (!t) return;
      if (
        Math.abs(t.clientX - this.lpStartPos.x) > 10 ||
        Math.abs(t.clientY - this.lpStartPos.y) > 10
      )
        this.lpClear();
    },
    lpClear() {
      if (this.lpTimer) {
        clearTimeout(this.lpTimer);
        this.lpTimer = null;
      }
    },
    openContactMenu(event, ct) {
      this.entityMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        kind: "contact",
        payload: ct,
      };
    },
    openUserMenu(event, u) {
      this.entityMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        kind: "user",
        payload: u,
      };
    },
    onEntityMenuSelect(item) {
      const { kind, payload } = this.entityMenu;
      if (!payload) return;
      if (kind === "contact") {
        const user = payload.contact_user;
        if (item.value === "message") this.onMenuStartChat(user);
        else if (item.value === "rename") {
          const mp = this.$refs.menuPanel;
          if (mp && typeof mp.openRenameContact === "function")
            mp.openRenameContact(payload);
          else this.$emit("rename-contact", payload);
        } else if (item.value === "favorite") {
          this.$emit("update-contact", {
            contactId: payload.id,
            data: { is_favorite: !payload.is_favorite },
          });
        } else if (item.value === "block") this.$emit("block-user", user?.id);
        else if (item.value === "unblock") this.$emit("unblock-user", user?.id);
        else if (item.value === "delete")
          this.$emit("delete-contact", payload.id);
      } else {
        if (item.value === "message") this.onSearchStartChat(payload);
        else if (item.value === "add") this.$emit("add-user-contact", payload);
        else if (item.value === "block") this.$emit("block-user", payload.id);
      }
    },
    onConvMenuSelect(item) {
      const c = this.convMenu.conv;
      if (!c) return;
      if (item.value === "open") {
        this.$emit("select", c);
        if (this.panel === "search") this.closeSearch();
      } else if (item.value === "mark-read") {
        this.$emit("mark-read", c.id);
      } else if (item.value === "mute") {
        this.$emit("mute", c.id);
      } else if (item.value === "clear") {
        this.$emit("clear-conversation", c.id);
      } else if (item.value === "delete") {
        this.$emit("delete-conversation", c.id);
      }
    },
  },
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.messenger-sidebar {
  background: #ffffff;
}

.dark .messenger-sidebar {
  background: #0e1621;
}

.messenger-list-header {
  background: #ffffff;
}

.dark .messenger-list-header {
  background: #0e1621;
}

.conv-list-shell {
  min-height: 100%;
}

.conv-list {
  display: flex;
  flex-direction: column;
  background: transparent;
}

.conv-row {
  --conv-divider-inset: 72px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  text-align: start;
  transition: background-color var(--tg-dur-fast, 140ms) ease;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.conv-row.has-divider::after {
  content: "";
  position: absolute;
  inset-inline-start: var(--conv-divider-inset);
  inset-inline-end: 0;
  bottom: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.055);
  pointer-events: none;
}

.dark .conv-row.has-divider::after {
  background: rgba(255, 255, 255, 0.055);
}

.conv-row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.dark .conv-row:hover {
  background: rgba(255, 255, 255, 0.035);
}

.conv-row:active:not(.is-active) {
  background: rgba(0, 0, 0, 0.05);
}

.dark .conv-row:active:not(.is-active) {
  background: rgba(255, 255, 255, 0.06);
}

.conv-row.is-active {
  background: #3390ec;
}

.conv-row.is-active:hover,
.conv-row.is-active:active {
  background: #3390ec;
}

.conv-row.is-active.has-divider::after {
  background: transparent;
}

.conv-row-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.conv-row-top,
.conv-row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.conv-row-title {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.tg-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  outline: 1px solid rgba(0, 0, 0, 0.04);
}

.dark .tg-card {
  background: #17212b;
  box-shadow: none;
  outline-color: rgba(255, 255, 255, 0.06);
}

.contact-empty-glass {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  backdrop-filter: blur(22px) saturate(1.35);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
}

.dark .contact-empty-glass {
  background: rgba(23, 33, 43, 0.58);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.26);
}

.conv-row-name {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-row.has-unread .conv-row-name {
  font-weight: 600;
}

.dark .conv-row-name {
  color: #f1f5f9;
}

.conv-row.is-active .conv-row-name {
  color: #fff;
}

.conv-row-type,
.conv-row-mute {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #94a3b8;
}

.conv-row.is-active .conv-row-type,
.conv-row.is-active .conv-row-mute {
  color: rgba(255, 255, 255, 0.82);
}

.conv-row-time {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.2;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.conv-row-time.is-unread {
  color: #3390ec;
  font-weight: 600;
}

.dark .conv-row-time.is-unread {
  color: #6ab3f3;
}

.conv-row.is-active .conv-row-time,
.conv-row.is-active .conv-row-time.is-unread {
  color: rgba(255, 255, 255, 0.88);
}

.conv-row-preview {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1 1 auto;
  font-size: 13.5px;
  /* Tall enough for emoji glyphs without clipping under the title row */
  line-height: 1.4;
  min-height: 1.4em;
  color: #64748b;
  overflow: hidden;
}
.conv-row-snippet {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.45;
  /* Digits via MsgUiDigits — color-emoji faces are not in the UI stack. */
  font-family: inherit;
}
.conv-preview-emoji {
  flex-shrink: 0;
  font-size: 13px;
  line-height: 1;
}
.conv-preview-ico {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: #3390ec;
}
.conv-preview-label {
  flex-shrink: 0;
  font-weight: 600;
  color: #3390ec;
}
.conv-preview-label.is-sticker,
.conv-preview-label.is-gif {
  color: #3390ec;
}
.conv-preview-sep {
  flex-shrink: 0;
  color: inherit;
  opacity: 0.75;
}
.conv-preview-text {
  min-width: 0;
}
.dark .conv-preview-ico,
.dark .conv-preview-label {
  color: #6ab3f3;
}
.conv-row.is-active .conv-preview-ico,
.conv-row.is-active .conv-preview-label {
  color: rgba(255, 255, 255, 0.95);
}

.dark .conv-row-preview {
  color: #94a3b8;
}

.conv-row.has-unread .conv-row-preview:not(.is-typing):not(.is-draft) {
  color: #475569;
}

.dark .conv-row.has-unread .conv-row-preview:not(.is-typing):not(.is-draft) {
  color: #cbd5e1;
}

.conv-row.is-active .conv-row-preview {
  color: rgba(255, 255, 255, 0.9);
}

.conv-row-preview.is-typing {
  color: #3390ec;
  font-weight: 500;
}
.conv-row-preview.is-typing.is-recording_voice {
  color: #ef4444;
}
.conv-row-preview.is-typing.is-uploading_photo,
.conv-row-preview.is-typing.is-uploading_video,
.conv-row-preview.is-typing.is-uploading_audio,
.conv-row-preview.is-typing.is-uploading_file {
  color: #0ea5e9;
}

.conv-row-preview.is-draft {
  color: #e53935;
}

.dark .conv-row-preview.is-draft {
  color: #ff6b6b;
}

.dark .conv-row-preview.is-typing {
  color: #6ab2f2;
}
.dark .conv-row-preview.is-typing.is-recording_voice {
  color: #f87171;
}
.dark .conv-row-preview.is-typing.is-uploading_photo,
.dark .conv-row-preview.is-typing.is-uploading_video,
.dark .conv-row-preview.is-typing.is-uploading_audio,
.dark .conv-row-preview.is-typing.is-uploading_file {
  color: #38bdf8;
}

.conv-row.is-active .conv-row-preview.is-typing {
  color: #ffffff;
  font-weight: 600;
}

.conv-typing-text {
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  line-height: 1;
}
.conv-typing-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
  position: relative;
  top: 0.5px;
}
.typing-dots {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 2.5px;
  height: 9px;
  padding-inline-start: 1px;
}
.typing-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.45;
  animation: typing-bounce 1.05s ease-in-out infinite;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.16s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.32s;
}
@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

.conv-row-ticks {
  color: #707579;
}

.conv-row-ticks.is-delivered {
  color: #707579;
}

.conv-row-ticks.is-read {
  color: #4fc3f7;
}

.conv-row.is-active .conv-row-ticks {
  color: rgba(255, 255, 255, 0.9);
}

.conv-row.is-active .conv-row-ticks.is-read {
  color: #ffffff;
}

.conv-row.is-active .conv-row-preview.is-draft {
  color: #ffcdd2;
}

.conv-row-badge {
  flex: 0 0 auto;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 20px;
  min-width: 20px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  border-radius: 10px;
  background: #3390ec;
  color: #fff;
  box-shadow: 0 1px 2px rgba(51, 144, 236, 0.22);
  /* Never scale down under flex pressure */
  transform: none;
}

.conv-row-badge.is-muted {
  background: #9aa4af;
  color: #fff;
  box-shadow: none;
}

.dark .conv-row-badge.is-muted {
  background: #6b7280;
  color: #f3f4f6;
}

/* Active row: keep unread blue; muted stays grayscale (not translucent white) */
.conv-row.is-active .conv-row-badge:not(.is-muted) {
  background: rgba(255, 255, 255, 0.92);
  color: #3390ec;
}

.conv-row.is-active .conv-row-badge.is-muted {
  background: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.dark .conv-row.is-active .conv-row-badge.is-muted {
  background: rgba(255, 255, 255, 0.28);
  color: #e5e7eb;
}

.fab-pop-enter-active,
.fab-pop-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1));
}

.fab-pop-enter-from,
.fab-pop-leave-to {
  opacity: 0;
  transform: scale(0.72) translateY(8px);
}

/* Soft, quick panel swap (search / menu) */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

/* Pull the leaving panel out of flow so the underlying list isn't squished. */
.panel-fade-leave-active {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.panel-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.panel-fade-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.messenger-brand-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #2b2b2b;
  line-height: 1.25;
}

.dark .messenger-brand-title {
  color: #e8e8e8;
}

.messenger-status-label {
  font-size: 14px;
  font-weight: 500;
  color: #707579;
  line-height: 1.25;
}

.dark .messenger-status-label {
  color: #8b95a0;
}

.messenger-header-title-slot {
  transition: opacity var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  opacity: 1;
  transform: translateX(0);
}

.messenger-header-title-slot.is-hidden {
  opacity: 0;
  transform: translateX(-6px);
  pointer-events: none;
}

.conn-title-enter-active,
.conn-title-leave-active {
  transition: opacity var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.conn-title-enter-from,
.conn-title-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Expanding search — compact icon → full-width field (Telegram Web) */
.messenger-search-expand {
  z-index: 2;
  justify-content: flex-end;
  width: 40px;
  transition: width var(--tg-dur-med, 240ms) var(--tg-ease-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.messenger-search-expand.is-expanded {
  inset-inline-start: 0;
  width: 100%;
}

.messenger-search-field {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition:
    width var(--tg-dur-med, 240ms) var(--tg-ease-emphasized, cubic-bezier(0.2, 0, 0, 1)),
    opacity var(--tg-dur-fast, 140ms) ease;
}

.messenger-search-field.is-expanded {
  width: 100%;
  opacity: 1;
  pointer-events: auto;
}

.messenger-search-expand-input {
  min-width: 0;
}

.messenger-search-icon-btn {
  flex-shrink: 0;
}

.messenger-status-dots {
  display: inline-flex;
  width: 1.1em;
  overflow: hidden;
  vertical-align: baseline;
}

.messenger-status-dots span {
  opacity: 0;
  animation: messenger-dot-wave 1.5s ease-in-out infinite;
}

.messenger-status-dots span:nth-child(1) {
  animation-delay: 0s;
}
.messenger-status-dots span:nth-child(2) {
  animation-delay: 0.25s;
}
.messenger-status-dots span:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes messenger-dot-wave {
  0%,
  15% {
    opacity: 0;
  }
  30%,
  55% {
    opacity: 1;
  }
  70%,
  100% {
    opacity: 0;
  }
}

.msg-global-search-hit {
  background: rgba(51, 144, 236, 0.28);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}

/* Hide native clear on search-like inputs (we render our own). */
.messenger-search-input::-webkit-search-cancel-button,
.messenger-search-input::-webkit-search-decoration,
.messenger-search-input::-ms-clear {
  display: none;
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}

:global(.dark) .msg-global-search-hit,
.dark .msg-global-search-hit {
  background: rgba(106, 178, 242, 0.35);
}
</style>
