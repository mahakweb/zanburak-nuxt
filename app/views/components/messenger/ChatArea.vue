<template>
  <div
    ref="root"
    :class="[
      'chat-frame flex flex-col h-full relative z-[1] bg-transparent w-full gap-0',
      conversation ? 'chat-frame--active' : '',
      (composerLift || showStickerSuggestOverlay) ? 'chat-frame--lift' : '',
    ]"
    :style="rootLayoutStyle"
    @touchstart.passive="onPageTouchStart" @touchmove.passive="onPageTouchMove" @touchend="onPageTouchEnd"
    @dragenter.prevent="onChatDragEnter"
    @dragover.prevent="onChatDragOver"
    @dragleave.prevent="onChatDragLeave"
    @drop.prevent="onChatFilesDrop"
    @pointerdown.capture="onChatSurfacePointerDown"
    @pointermove.capture="onChatSurfacePointerMove"
    @pointerup.capture="onChatSurfacePointerUp"
    @pointercancel.capture="onChatSurfacePointerUp"
    @click.capture="onChatSurfaceClick"
  >
    <!-- Telegram-style drop overlay -->
    <div
      v-if="dragActive && conversation"
      class="chat-drop-overlay"
      aria-hidden="true"
    >
      <div class="chat-drop-card">
        <svg class="w-10 h-10 text-[#3390ec]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5V19a2 2 0 002 2h12a2 2 0 002-2v-2.5" />
        </svg>
        <p class="chat-drop-title">{{ $t('messenger.dropFilesHere') }}</p>
      </div>
    </div>
    <!-- Empty state — fixed canvas (not the chat wallpaper). -->
    <div v-if="bootLoading || !conversation" class="chat-empty flex-1 flex flex-col items-center justify-center text-center px-6">
      <div class="chat-empty-canvas" aria-hidden="true">
        <span class="chat-empty-glow chat-empty-glow--a" />
        <span class="chat-empty-glow chat-empty-glow--b" />
        <span class="chat-empty-grid" />
      </div>
      <div class="chat-empty-card">
        <div class="chat-empty-orb" aria-hidden="true">
          <span class="chat-empty-orb-ring" />
          <span class="chat-empty-orb-ring chat-empty-orb-ring--delayed" />
          <span class="chat-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9C3.5 15 3 13.6 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
        </div>
        <p class="chat-empty-title">{{ $t('messenger.selectConversation') }}</p>
        <p class="chat-empty-hint">{{ $t('messenger.selectConversationHint') }}</p>
      </div>
    </div>

    <template v-else>
      <!-- Fixed-height chrome slot: selection / search / chat headers swap in place (no layout jump). -->
      <div
        class="chat-chrome-slot relative h-16 flex-shrink-0"
        :class="[chromeEdgeClass, showMenu ? 'z-40 overflow-visible' : 'z-10 overflow-hidden']"
      >
        <transition name="chrome-slide" mode="out-in">
          <header
            v-if="selectionMode"
            key="sel"
            class="chat-chrome-panel absolute inset-0 flex items-center gap-0.5 px-1.5 chat-chrome bg-[#f4f4f5] dark:bg-[#0e1621]"
          >
            <button
              type="button"
              class="sel-action"
              :title="$t('messenger.cancel')"
              :aria-label="$t('messenger.cancel')"
              @click="exitSelection"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span class="flex-1 min-w-0 text-[16px] font-semibold text-gray-800 dark:text-gray-100 tabular-nums truncate ps-1.5">
              {{ selectedCount }}
            </span>
            <button
              v-if="selectedCount === 1 && !isChannel"
              type="button"
              class="sel-action"
              :title="$t('messenger.reply')"
              @click="replySelected"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17l-5-5 5-5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h10.5a5.5 5.5 0 015.5 5.5V20" />
              </svg>
            </button>
            <button
              type="button"
              class="sel-action"
              :disabled="!selectedCount"
              :title="$t('messenger.copy')"
              @click="copySelected"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 8V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 10h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
              </svg>
            </button>
            <button
              v-if="canMessengerFeature('saved_messages')"
              type="button"
              class="sel-action"
              :disabled="!selectedCount"
              :title="$t('messenger.save')"
              @click="saveSelected"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 4a2 2 0 012-2h8a2 2 0 012 2v17l-6-3.5L6 21V4z" />
              </svg>
            </button>
            <button
              v-if="canMessengerFeature('forward')"
              type="button"
              class="sel-action"
              :disabled="!selectedCount"
              :title="$t('messenger.forward')"
              @click="forwardSelected"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17l5-5-5-5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H9.5A5.5 5.5 0 004 17.5V20" />
              </svg>
            </button>
            <button
              v-if="selectionAllMine || canDeleteOthersMessages"
              type="button"
              class="sel-action sel-action--danger"
              :disabled="!selectedCount"
              :title="$t('messenger.delete')"
              @click="deleteSelected"
            >
              <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
            </button>
          </header>

          <header
            v-else-if="searchMode"
            key="search"
            class="chat-chrome-panel absolute inset-0 flex items-center gap-1.5 px-2 chat-chrome bg-[#f4f4f5] dark:bg-[#0e1621]"
          >
            <button type="button" @click="exitSearchMode"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 flex-shrink-0"
              :title="$t('messenger.back')">
              <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 12h16m0 0l-6 6m6-6l-6-6" />
              </svg>
            </button>
            <div class="relative flex-1 min-w-0">
              <input
                ref="chatSearchInput"
                v-model="searchQuery"
                v-no-autofill="'strong'"
                type="text"
                name="chat-search"
                inputmode="search"
                enterkeyhint="search"
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
                :placeholder="$t('messenger.searchInChat')"
                class="messenger-search-input w-full pe-9 ps-3.5 py-2.5 text-[15px] rounded-full bg-white dark:bg-[#17212b] shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06] border-0 focus:ring-2 focus:ring-[#3390ec]/30 focus:outline-none text-gray-800 dark:text-gray-100 placeholder:text-[#a2acb4]"
                data-msg-font="search"
                @input="onChatSearchInput"
                @keydown.enter.prevent="submitChatSearch"
                @keydown.esc.prevent="exitSearchMode"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="absolute inset-y-0 rtl:left-2 ltr:right-2 flex items-center text-[#a2acb4] hover:text-gray-600 dark:hover:text-gray-300"
                :title="$t('messenger.clearSearch')"
                @click="clearChatSearchQuery"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <header
            v-else
            key="normal"
            data-msg-font="header"
            class="chat-chrome-panel absolute inset-0 flex items-center gap-2 px-3 chat-chrome bg-[#f4f4f5] dark:bg-[#0e1621]"
          >
            <button @click="$emit('back')"
              class="lg:hidden p-1.5 -ms-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500">
              <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 12h16m0 0l-6 6m6-6l-6-6"></path>
              </svg>
            </button>
            <button class="flex items-center gap-3 flex-1 min-w-0 text-start"
              @click="$emit('open-profile', isCommunity || isSaved ? conversation : partner)">
              <MessengerAvatar :user="partner" size="sm" :saved="isSaved" :online="showPeerOnlineDot" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ partnerName }}</h4>
                  <svg v-if="conversation?.is_verified" class="w-3.5 h-3.5 text-[#3390ec] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 4.9L20 8l-4 3.9.9 5.4L12 14.9 7.1 17.3 8 11.9 4 8l5.6-1.1L12 2z" />
                  </svg>
                  <svg v-if="isMuted" class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
                    stroke-width="2" viewBox="0 0 24 24" :title="$t('messenger.muted')">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M18 8a6 6 0 00-9.33-5M1 1l22 22" />
                  </svg>
                </div>
                <p class="text-xs truncate">
                  <span v-if="isSaved" class="text-gray-400">{{ $t('messenger.savedMessagesHint') }}</span>
                  <span
                    v-else-if="showHeaderConnectionStatus"
                    class="messenger-header-conn-status"
                    role="status"
                    aria-live="polite"
                  >
                    {{ headerConnectionText
                    }}<span
                      v-if="headerConnectionDots"
                      class="messenger-status-dots"
                      aria-hidden="true"
                      ><span>.</span><span>.</span><span>.</span></span
                    >
                  </span>
                  <span
                    v-else-if="typingLabel"
                    class="typing-status"
                    :class="`is-${typingActivity || 'typing'}`"
                  >
                    <span class="typing-status-text">{{ typingLabel }}</span>
                    <span class="typing-dots" aria-hidden="true">
                      <span class="typing-dot" />
                      <span class="typing-dot" />
                      <span class="typing-dot" />
                    </span>
                  </span>
                  <span v-else-if="isCommunity" class="text-gray-400">{{ communitySubtitle }}</span>
                  <span v-else-if="partner?.is_online" class="text-green-500">{{ $t('messenger.online') }}</span>
                  <span v-else-if="lastSeenText" class="text-gray-400">{{ lastSeenText }}</span>
                  <span v-else class="text-gray-400">{{ $t('messenger.lastSeenRecently') }}</span>
                </p>
              </div>
            </button>
            <button
              type="button"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
              :title="$t('messenger.search')"
              @click="enterSearchMode"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div ref="headerMenuWrap" class="relative">
              <button type="button" @click.stop="showMenu = !showMenu"
                class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="4" height="4" x="10" y="3" rx="2"></rect>
                  <rect width="4" height="4" x="10" y="10" rx="2"></rect>
                  <rect width="4" height="4" x="10" y="17" rx="2"></rect>
                </svg>
              </button>
              <div v-if="showMenu"
                class="tg-menu absolute top-full mt-1 rtl:left-0 ltr:right-0 z-[200]"
                @click.stop>
                <button type="button" @click="headerAction('profile')" class="tg-menu-item">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths('edit')" :key="'hp'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ profileMenuLabel }}</span>
                </button>
                <button type="button" @click="headerAction('mute')" class="tg-menu-item">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths(isMuted ? 'bell' : 'bellOff')" :key="'hm'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ isMuted ? $t('messenger.unmute') : $t('messenger.mute') }}</span>
                </button>
                <button type="button" @click="headerAction('select')" class="tg-menu-item">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths('select')" :key="'hs'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ $t('messenger.selectMessages') }}</span>
                </button>
                <button type="button" @click="headerAction('wallpaper')" class="tg-menu-item">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths('wallpaper')" :key="'hw'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ $t('messenger.chatBackground') }}</span>
                </button>
                <div class="tg-menu-divider" />
                <button type="button" @click="headerAction('clear')" class="tg-menu-item">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths('eraser')" :key="'hc'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ $t('messenger.clearConversation') }}</span>
                </button>
                <button type="button" @click="headerAction('delete')" class="tg-menu-item is-danger">
                  <span class="tg-menu-item-glyph" aria-hidden="true">
                    <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path v-for="(d, di) in menuIconPaths('trash')" :key="'hd'+di" :d="d" />
                    </svg>
                  </span>
                  <span class="tg-menu-item-label">{{ $t('messenger.deleteConversation') }}</span>
                </button>
              </div>
            </div>
          </header>
        </transition>
      </div>

      <!-- Pinned messages bar (below the header) -->
      <div v-if="pinnedCount && !selectionMode && !searchMode"
        :class="['flex items-center gap-2 px-2 py-1.5 chat-chrome bg-[#f4f4f5] dark:bg-[#0e1621] flex-shrink-0', chromeEdgeClass]">
        <!-- Stacked slide-style indicators (one per pin, capped) -->
        <div class="flex flex-col gap-0.5 self-stretch justify-center py-0.5 ps-1">
          <span
            v-for="i in pinnedIndicatorCount"
            :key="i"
            class="pin-bar-tick w-[3px] flex-1 min-h-[4px] rounded-full"
            :class="(i - 1) === activeIndicatorIndex ? 'is-active' : ''"
          />
        </div>
        <button type="button" class="flex-1 min-w-0 text-start overflow-hidden" @click="onPinnedBarClick">
          <div class="text-[11px] font-bold text-[#3390ec] dark:text-[#6ab2f2]">
            {{ $t('messenger.pinnedMessage') }}
            <span v-if="pinnedCount > 1" class="opacity-70 font-semibold">({{ pinnedCount }})</span>
          </div>
          <transition name="pin-preview" mode="out-in">
            <div
              :key="activePin?.id || pinCursor"
              class="pin-bar-preview text-xs text-gray-600 dark:text-gray-300 truncate flex items-center gap-1 min-w-0"
            >
              <svg
                v-if="activePinIsSticker"
                class="pin-bar-preview-ico flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M14.5 4.5H8A2.5 2.5 0 005.5 7v10A2.5 2.5 0 008 19.5h8A2.5 2.5 0 0018.5 17v-6.5L14.5 4.5z" />
                <path d="M14.5 4.5V10h5.5" />
                <circle cx="9.25" cy="12.25" r="0.85" fill="currentColor" stroke="none" />
                <circle cx="14.25" cy="12.25" r="0.85" fill="currentColor" stroke="none" />
                <path d="M9.5 15s.9 1.2 2.5 1.2 2.5-1.2 2.5-1.2" />
              </svg>
              <span
                v-if="activePinIsSticker"
                class="pin-bar-preview-label flex-shrink-0"
              >{{ $t('messenger.mediaSticker') }}</span>
              <span
                v-else
                class="truncate min-w-0"
              >{{ formatPinBarPreview(activePin) }}</span>
            </div>
          </transition>
        </button>
        <!-- Single pin → unpin (X); multiple → open the pinned list panel -->
        <button v-if="pinnedCount === 1" @click="unpinOne(activePin)"
          class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 flex-shrink-0"
          :title="$t('messenger.unpin')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button v-else @click="openPinnedSheet"
          class="flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 flex-shrink-0"
          :title="$t('messenger.pinnedMessages')">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M22.75 8C22.75 8.41421 22.4142 8.75 22 8.75H17C16.5858 8.75 16.25 8.41421 16.25 8C16.25 7.58579 16.5858 7.25 17 7.25L22 7.25C22.4142 7.25 22.75 7.58579 22.75 8Z"
                fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M22.75 12.5C22.75 12.9142 22.4142 13.25 22 13.25H18C17.5858 13.25 17.25 12.9142 17.25 12.5C17.25 12.0858 17.5858 11.75 18 11.75H22C22.4142 11.75 22.75 12.0858 22.75 12.5Z"
                fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M13.7605 7.29224L14.1966 7.72835C14.932 8.46373 15.5319 9.06363 15.9422 9.58515C16.3622 10.1191 16.6764 10.683 16.6759 11.3489C16.6756 11.7215 16.5996 12.09 16.4525 12.4323C16.1896 13.0441 15.678 13.4378 15.081 13.7621C14.498 14.0788 13.7098 14.3925 12.7435 14.7771L12.5521 14.8532C11.9399 15.0969 11.7791 15.1689 11.6557 15.2667C11.5467 15.353 11.4528 15.457 11.378 15.5742C11.2934 15.707 11.2382 15.8743 11.0583 16.5082L11.0484 16.5428C10.927 16.9707 10.8212 17.3435 10.7083 17.6318C10.5933 17.9253 10.427 18.2543 10.1137 18.484C9.75352 18.7481 9.306 18.8645 8.8628 18.8093C8.47725 18.7613 8.17174 18.5551 7.92839 18.3548C7.68926 18.158 7.41531 17.884 7.10076 17.5694L6.04035 16.509L3.87701 18.6723C3.58412 18.9652 3.10924 18.9652 2.81635 18.6723C2.52346 18.3794 2.52346 17.9046 2.81635 17.6117L4.97969 15.4483L3.91948 14.3881C3.60488 14.0736 3.33089 13.7996 3.13408 13.5605C2.93379 13.3171 2.72754 13.0116 2.67955 12.626C2.6244 12.1829 2.74078 11.7353 3.00486 11.3752C3.2346 11.0618 3.56355 10.8955 3.85702 10.7806C4.14539 10.6676 4.51813 10.5618 4.9461 10.4404L4.98066 10.4306C5.61458 10.2507 5.78183 10.1955 5.91462 10.1108C6.03187 10.036 6.13582 9.94218 6.22218 9.83317C6.31999 9.70972 6.39195 9.54897 6.63562 8.93672L6.71176 8.74541C7.09632 7.77911 7.41003 6.99084 7.72677 6.40781C8.05109 5.81082 8.44472 5.29922 9.05655 5.03634C9.39882 4.88928 9.7674 4.81329 10.1399 4.81299C10.8058 4.81245 11.3697 5.12666 11.9037 5.54669C12.4252 5.95691 13.0251 6.55684 13.7605 7.29224ZM8.13601 16.4833L6.57938 14.9267L6.57075 14.9179L6.56198 14.9093L5.00552 13.3528C4.65811 13.0054 4.43708 12.7832 4.29225 12.6072C4.20301 12.4988 4.17434 12.4441 4.16681 12.428C4.16283 12.3732 4.17704 12.3186 4.20723 12.2726C4.22164 12.2622 4.27332 12.2285 4.40407 12.1772C4.61629 12.0941 4.91757 12.0077 5.39021 11.8736L5.47823 11.8487C5.98238 11.706 6.37913 11.5937 6.72126 11.3754C6.97922 11.2109 7.20791 11.0045 7.39791 10.7647C7.64991 10.4466 7.80211 10.0634 7.99551 9.57641L8.0872 9.34589C8.49446 8.32262 8.77597 7.61874 9.04482 7.12387C9.31108 6.63376 9.4985 6.47904 9.64869 6.41451C9.80427 6.34767 9.97181 6.31313 10.1411 6.31299C10.3046 6.31286 10.5379 6.38083 10.9763 6.72567C11.419 7.07386 11.9559 7.60901 12.7347 8.38777L13.1011 8.75415C13.8798 9.53291 14.415 10.0699 14.7632 10.5125C15.108 10.9509 15.176 11.1842 15.1759 11.3477C15.1757 11.517 15.1412 11.6846 15.0743 11.8402C15.0098 11.9903 14.8551 12.1778 14.365 12.444C13.8701 12.7129 13.1662 12.9944 12.143 13.4016L11.9124 13.4933C11.4255 13.6867 11.0423 13.8389 10.7242 14.0909C10.4844 14.2809 10.2779 14.5096 10.1134 14.7676C9.89518 15.1097 9.78288 15.5065 9.64019 16.0106L9.61525 16.0986C9.48111 16.5713 9.39472 16.8726 9.3116 17.0848C9.26039 17.2155 9.22661 17.2672 9.21621 17.2816C9.17027 17.3118 9.11564 17.326 9.06082 17.322C9.04472 17.3145 8.99004 17.2858 8.88161 17.1966C8.70564 17.0518 8.48342 16.8307 8.13601 16.4833Z"
                fill="currentColor"></path>
              <path
                d="M21.9999 17.75C22.4141 17.75 22.7499 17.4142 22.7499 17C22.7499 16.5858 22.4141 16.25 21.9999 16.25H12.9999C12.5857 16.25 12.2499 16.5858 12.2499 17C12.2499 17.4142 12.5857 17.75 12.9999 17.75H21.9999Z"
                fill="currentColor"></path>
          </svg>
        </button>
      </div>

      <!-- Messages: shell paints chrome in the corner crescents; scroll has concave radii. -->
      <div :class="['chat-messages-shell flex-1 min-h-0 flex flex-col relative', messagesShellClass]">
      <!-- Telegram-style empty chat greeting — centered in the message viewport -->
      <EmptyChatGreeting
        v-if="!messages.length && !messagesLoading"
        :conversation-id="emptyGreetingSeed"
        @greet="onEmptyChatGreet"
      />
      <div ref="scrollBox" @scroll="onScroll" @click="onScrollBoxClick"
        class="flex-1 overflow-y-auto overflow-x-hidden py-4 chat-messages-scroll select-none relative min-h-0">
        <transition name="newbar-fade">
          <div v-if="revealLoading" class="sticky top-0 z-20 flex justify-center pointer-events-none">
            <span
              class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-200 bg-white/90 dark:bg-[#1e2c3a]/90 backdrop-blur rounded-full px-3 py-1.5 shadow ring-1 ring-black/5 dark:ring-white/10">
              <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {{ $t('messenger.loadingMessage') }}
            </span>
          </div>
        </transition>
        <div v-if="messagesLoading && messages.length" class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <span
            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-[#1e2c3a]/90 shadow ring-1 ring-black/5 dark:ring-white/10"
            role="status" aria-label="loading">
            <svg class="w-4 h-4 animate-spin text-[#3390ec]" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </span>
        </div>
        <div class="chat-column px-3 sm:px-6 lg:px-3" :class="{ 'chat-open-enter': chatOpening }">
        <div v-if="loadingMore || hasMore" class="text-center py-2">
          <span v-if="loadingMore"
            class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/80 dark:bg-white/10"
            role="status" aria-label="loading">
            <svg class="w-3.5 h-3.5 animate-spin text-[#3390ec]" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </span>
          <button v-else @click="onLoadMoreClick"
            class="text-xs text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-white/10 rounded-full px-3 py-1 hover:bg-white">{{
              $t('messenger.loadMore') }}</button>
        </div>

        <template v-for="item in grouped" :key="item.key">
          <div v-if="item.type === 'date'" class="flex justify-center my-3">
            <span
              data-msg-font="date"
              class="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-black/30 rounded-full px-3 py-1 shadow-sm">{{
                item.label }}</span>
          </div>
          <div v-else-if="item.type === 'system'" class="flex justify-center my-3">
            <span
              class="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-black/30 rounded-full px-3 py-1 shadow-sm inline-flex items-center gap-1 flex-wrap justify-center max-w-[90%]">
              <template v-if="systemParts(item.message).clickable">
                <span>{{ systemParts(item.message).before }}</span>
                <button type="button"
                  class="text-[#3390ec] dark:text-[#6ab2f2] font-bold hover:underline"
                  @click="$emit('open-profile', systemParts(item.message).user)">{{ systemParts(item.message).name }}</button>
                <span>{{ systemParts(item.message).after }}</span>
              </template>
              <template v-else>{{ systemText(item.message) }}</template>
            </span>
          </div>
          <div v-else-if="item.type === 'newdivider'" class="flex items-center gap-2 my-2 px-1">
            <span class="flex-1 h-px bg-[#3390ec]/40"></span>
            <span class="text-[11px] font-bold text-[#3390ec] dark:text-[#6ab2f2]">{{ $t('messenger.newMessages')
            }}</span>
            <span class="flex-1 h-px bg-[#3390ec]/40"></span>
          </div>
          <MediaAlbumBubble
            v-else-if="item.type === 'album'"
            :messages="item.messages"
            :is-mine="item.isMine"
            :selection-mode="selectionMode"
            :selected="item.messages.some((m) => selectedIds.some((id) => Number(id) === Number(m.id)))"
            :group-pos="item.groupPos"
            :tight="item.tight"
            :show-avatar="item.showAvatar"
            :avatar-user="item.avatarUser"
            :chat-type="conversation?.type || 'private'"
            :show-sender-name="isCommunity && !isChannel"
            @toggle-select-album="toggleSelectAlbum"
            @enter-select-album="onEnterSelectAlbum"
            @avatar-click="onAvatarClick"
            @context="openMsgMenu"
            @open-lightbox="onOpenLightbox"
            @cancel-upload="onCancelUpload"
            @forward-tap="onForwardTap"
            @forward-chat-tap="onForwardChatTap"
          />
          <MessageBubble v-else :message="item.message" :is-mine="item.isMine" :selection-mode="selectionMode"
            :selected="selectedIds.some((id) => Number(id) === Number(item.message.id))" :group-pos="item.groupPos" :tight="item.tight"
            :show-avatar="item.showAvatar" :avatar-user="item.avatarUser" :pinned="item.pinned"
            :chat-type="conversation?.type || 'private'"
            :chat-title="conversation?.title || partnerName"
            :show-sender-name="isCommunity && !isChannel"
            :highlight-query="searchHighlightQuery"
            :search-current="searchCurrentId === item.message.id"
            @edit="onEdit"
            @delete="onDelete" @reply="onReply" @context="openMsgMenu" @toggle-select="toggleSelect"
            @enter-select="onEnterSelect" @avatar-click="onAvatarClick" @forward-tap="onForwardTap"
            @forward-chat-tap="onForwardChatTap" @channel-tap="onChannelHeaderTap"
            @scroll-to-reply="onScrollToReply" @retry="onRetryMessage" @cancel-upload="onCancelUpload" @open-lightbox="onOpenLightbox" @open-link="$emit('open-link', $event)" @open-sticker-pack="onOpenStickerPack" />
        </template>
        </div>
      </div>
      </div>

      <!-- New-messages bar (stays put; only scrolls when the arrow is tapped) -->
      <transition name="newbar-fade">
        <button v-if="showNewBadge && !searchMode"
          type="button"
          @pointerdown.prevent
          @click="jumpToLatest"
          :class="[
            'absolute inset-x-3 sm:inset-x-6 z-20 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#3390ec]/95 hover:bg-[#4ea4f5] text-white shadow-lg active:scale-[0.99] transition backdrop-blur',
            voiceLocked ? 'bottom-36' : 'bottom-24',
          ]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span class="text-xs font-bold">{{ newCount > 99 ? '99+' : newCount }} {{ $t('messenger.newMessages')
          }}</span>
        </button>
      </transition>

      <!-- Smooth scroll-to-bottom button -->
      <transition name="scrolldown-fade">
        <button v-if="scrolledUp && !showNewBadge && !searchMode"
          type="button"
          @pointerdown.prevent
          @click="jumpToLatest"
          :class="[
            'absolute ltr:right-4 rtl:left-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-[#1e2c3a] text-gray-600 dark:text-gray-200 shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-90 transition',
            voiceLocked ? 'bottom-36' : 'bottom-24',
          ]"
          :title="$t('messenger.scrollToBottom')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </transition>

      <!-- In-chat search: nav arrows above the bottom bar -->
      <div
        v-if="searchMode"
        class="chat-search-nav absolute z-30 flex flex-col gap-1.5 bottom-[4.75rem] start-3"
      >
        <button
          type="button"
          class="chat-search-nav-btn"
          :disabled="!searchTotal || searchIndex >= searchTotal - 1"
          :title="$t('messenger.searchNextResult')"
          @click="goSearchNext"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          class="chat-search-nav-btn"
          :disabled="!searchTotal || searchIndex <= 0"
          :title="$t('messenger.searchPrevResult')"
          @click="goSearchPrev"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <ContextMenu :visible="msgMenu.visible" :x="msgMenu.x" :y="msgMenu.y" :items="msgMenuItems"
        @select="onMsgMenuSelect" @close="onMsgMenuClose" />

      <ContextMenu
        v-if="inputMenu.mode === 'format'"
        :visible="inputMenu.visible"
        :x="inputMenu.x"
        :y="inputMenu.y"
        prefer-above
        :items="inputFormatMenuItems"
        @select="onInputMenuSelect"
        @close="closeInputMenu"
      />

      <!-- Composer: flush edges; compact Telegram-style input -->
      <div v-if="searchMode" :class="['composer-bar chat-chrome flex-shrink-0 bg-[#f4f4f5] dark:bg-[#0e1621]', chromeEdgeClassTop]">
        <div class="chat-column flex items-center gap-2 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 flex-shrink-0"
            :class="searchShowDates ? 'text-[#3390ec] bg-[#3390ec]/10' : ''"
            :title="$t('messenger.searchByDate')"
            @click="searchShowDates = !searchShowDates"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <div class="flex-1 min-w-0 text-center">
            <template v-if="searchShowDates">
              <div class="flex items-center justify-center gap-2">
                <input
                  v-model="searchFrom"
                  type="date"
                  class="min-w-0 flex-1 max-w-[9.5rem] text-[12px] rounded-lg bg-[#f4f4f5] dark:bg-white/5 border-0 px-2 py-1.5 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#3390ec]/30 focus:outline-none"
                  :aria-label="$t('messenger.searchFromDate')"
                  @change="onSearchDatesChange"
                />
                <span class="text-[11px] text-[#a2acb4] flex-shrink-0">–</span>
                <input
                  v-model="searchTo"
                  type="date"
                  class="min-w-0 flex-1 max-w-[9.5rem] text-[12px] rounded-lg bg-[#f4f4f5] dark:bg-white/5 border-0 px-2 py-1.5 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#3390ec]/30 focus:outline-none"
                  :aria-label="$t('messenger.searchToDate')"
                  @change="onSearchDatesChange"
                />
              </div>
            </template>
            <template v-else>
              <p class="text-[13px] font-medium text-gray-600 dark:text-gray-300 tabular-nums">
                <span v-if="searchSearching" class="text-[#a2acb4]">…</span>
                <span v-else-if="searchQuery.trim() && !chatSearchMeetsMin && !searchFrom && !searchTo" class="text-[#a2acb4]">{{ $t('messenger.searchMinChars', { count: searchMinChars }) }}</span>
                <span v-else-if="!searchSubmitted" class="text-[#a2acb4]">{{ $t('messenger.searchInChat') }}</span>
                <span v-else-if="!searchTotal">{{ $t('messenger.searchNoResults') }}</span>
                <span v-else>{{ $t('messenger.searchResultsCount', { current: searchIndex + 1, total: searchTotal }) }}</span>
              </p>
            </template>
          </div>
          <div class="w-9 flex-shrink-0" aria-hidden="true" />
        </div>
      </div>
      <div
        v-else-if="canSend || pendingForward"
        :class="['composer-bar chat-chrome flex-shrink-0 bg-[#f4f4f5] dark:bg-[#0e1621] relative overflow-visible', chromeEdgeClassTop, { 'z-40': composerLift || composerFormatBarVisible || showStickerSuggestOverlay }]"
        >
          <div class="chat-column overflow-visible">
          <div
            v-if="chatLockedForMembers"
            class="px-3 pt-2 text-center text-[11px] font-medium text-amber-600 dark:text-amber-400"
          >
            {{ $t('messenger.chatLockedNowStaff') }}
          </div>
          <!-- Reply bar -->
          <div v-if="replyTo && !editingMessage && !pendingForward" class="flex items-center justify-between gap-2 px-3 pt-2 pb-1.5">
            <ReplyQuotePreview
              class="min-w-0 flex-1"
              :message="replyTo"
              :show-title="true"
              :title-prefix="$t('messenger.reply')"
              :embedded="false"
            />
            <button @click="cancelReply"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Forward bar -->
          <div v-else-if="pendingForward && !editingMessage" class="flex items-center justify-between gap-2 px-3 pt-2 pb-1.5 relative">
            <div class="flex items-stretch gap-2 min-w-0 flex-1">
              <div ref="forwardMenuWrap" class="relative flex-shrink-0 self-center">
                <button
                  ref="forwardMenuBtn"
                  type="button"
                  class="p-1.5 rounded-full hover:bg-[#3390ec]/10 text-[#3390ec] transition"
                  :title="$t('messenger.more')"
                  @click.stop="toggleForwardMenu"
                >
                  <svg class="w-5 h-5 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
              </div>
              <!-- Multi-message forward: count + sender names (no message body) -->
              <div
                v-if="isMultiForward"
                class="reply-quote reply-quote--bar flex items-stretch gap-2 min-w-0 flex-1"
              >
                <div class="flex-shrink-0 self-stretch w-0.5 rounded-sm bg-[#3390ec]" aria-hidden="true" />
                <div class="min-w-0 flex-1">
                  <div class="font-bold text-[11px] text-[#3390ec] dark:text-[#6ab2f2] truncate">
                    {{ forwardMultiTitle }}
                  </div>
                  <div
                    v-if="forwardMultiSubtitle"
                    class="text-xs text-gray-500 dark:text-gray-300 truncate"
                  >
                    {{ forwardMultiSubtitle }}
                  </div>
                </div>
              </div>
              <ReplyQuotePreview
                v-else
                class="min-w-0 flex-1"
                :message="forwardPreviewMessage"
                :show-title="!pendingForward.dropAuthor"
                :embedded="false"
              />
            </div>
            <button
              type="button"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 flex-shrink-0"
              @click="cancelPendingForward"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Edit bar -->
          <div v-else-if="editingMessage" class="flex items-center justify-between px-3 pt-2 pb-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <svg class="w-4 h-4 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="text-xs text-[#3390ec] dark:text-[#6ab2f2] truncate">{{ formatPreview(editingMessage) }}</span>
            </div>
            <button @click="cancelEdit"
              class="p-1 rounded-full hover:bg-[#3390ec]/10 dark:hover:bg-white/10 text-gray-500 flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="composerExpanded" class="mx-3 border-t border-black/10 dark:border-white/10"></div>

          <!-- Format “More” while text is selected — clipboard stays native OS/browser -->
          <div
            v-if="composerFormatBarVisible"
            class="composer-fmt-bar flex justify-center px-2 pt-1"
            @mousedown.prevent
          >
            <button
              ref="fmtMoreBtn"
              type="button"
              class="composer-fmt-more"
              :aria-label="$t('messenger.more')"
              :title="$t('messenger.more')"
              @click.stop="openFormatMoreMenu"
            >
              <span class="composer-fmt-more-aa" aria-hidden="true">Aa</span>
              <svg class="composer-fmt-more-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <!-- Input row: sticker suggest floats above this row, same width as emoji+input+actions -->
          <div
            class="composer-row relative flex items-end gap-0.5 px-2 pt-1"
            :class="[composerBottomPadClass, { 'composer-row--voice': voiceRecording }]"
          >
            <transition name="stk-suggest">
              <div
                v-if="showStickerSuggestOverlay"
                class="composer-sticker-suggest"
                data-sticker-suggest
                @mousedown.prevent
                @pointerdown.stop
              >
                <div
                  ref="stickerSuggestStrip"
                  class="composer-sticker-suggest__strip"
                  @wheel.prevent="onStickerSuggestWheel"
                >
                  <button
                    v-for="st in emojiStickerSuggestions"
                    :key="st.id"
                    type="button"
                    class="composer-sticker-suggest__cell"
                    @click="onPickSuggestedSticker(st)"
                  >
                    <img v-if="st.kind === 'image' && st.src" :src="st.src" alt="" class="composer-sticker-suggest__img">
                    <span v-else class="composer-sticker-suggest__emoji">{{ st.emoji }}</span>
                  </button>
                </div>
              </div>
            </transition>

            <!-- Attach opposite emoji+mic; emoji stays next to input in LTR and RTL. -->
            <button
              v-show="!voiceRecording"
              type="button"
              :disabled="!!editingMessage || !!pendingForward"
              :title="$t('messenger.attach')"
              :aria-label="$t('messenger.attach')"
              :tabindex="composerHasContent ? -1 : 0"
              :aria-hidden="composerHasContent ? 'true' : 'false'"
              class="composer-attach flex-shrink-0 self-end flex items-center justify-center rounded-full text-[#707579] dark:text-[#8b98a5] hover:text-[#3390ec] dark:hover:text-[#6ab2f2] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              :class="{ 'composer-attach--hidden': composerHasContent }"
              @click="attachSheet.open = true"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.44 11.05l-8.49 8.49a5.25 5.25 0 01-7.42-7.42l8.84-8.84a3.5 3.5 0 014.95 4.95l-8.84 8.84a1.75 1.75 0 01-2.47-2.47l7.78-7.78" />
              </svg>
            </button>

            <!-- Timer/trash on attach side (opposite mic). -->
            <button
              v-if="voiceRecording && voicePaused"
              type="button"
              class="voice-rec-trash flex-shrink-0 w-10 h-10 mb-0.5 flex items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
              :title="$t('messenger.cancel')"
              :aria-label="$t('messenger.cancel')"
              @click="cancelVoiceRecord"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
            </button>
            <div
              v-else-if="voiceRecording"
              class="voice-rec-led flex-shrink-0 flex items-center gap-2 h-10 mb-0.5 ps-1.5 pe-1"
              aria-live="polite"
            >
              <span class="voice-rec-dot" aria-hidden="true" />
              <span class="voice-rec-time tabular-nums">{{ voiceElapsedPrecise }}</span>
            </div>

            <div class="composer-field relative flex-1 flex items-end min-w-0 rounded-[22px] bg-transparent" :class="voiceRecording ? 'ps-0 pe-0' : 'ps-1 pe-1'">
              <!-- Keep textarea focusable while voice UI shows so soft-keyboard stays up -->
              <textarea
                ref="input"
                v-model="text"
                v-no-autofill="'strong'"
                name="messenger-composer"
                :dir="composerDir"
                :inputmode="composerInputMode"
                :style="composerInputStyle"
                :aria-hidden="voiceRecording ? 'true' : 'false'"
                :tabindex="voiceRecording ? -1 : 0"
                @keydown="onKeydown"
                @input="onInput"
                @paste="onComposerPaste"
                @focus="onComposerFocus"
                @blur="onComposerBlur"
                @pointerdown="onComposerPointerDown"
                @select="onComposerSelect"
                @keyup="onComposerSelect"
                @mouseup="onComposerSelect"
                @touchend.passive="onComposerSelect"
                :placeholder="editingMessage && isMediaType(editingMessage.type) ? $t('messenger.captionPlaceholder') : $t('messenger.messagePlaceholder')"
                rows="1"
                :class="[
                  'composer-input flex-1 min-w-0 resize-none pe-2 py-2 text-[15px] bg-transparent lg:bg-gray-200 lg:dark:bg-gray-800 lg:rounded-2xl lg:ps-2 border-0 focus:outline-none text-gray-800 dark:text-gray-100 overflow-y-hidden min-h-[36px] max-h-[120px]',
                  voiceRecording ? 'composer-input--voice-ghost' : '',
                ]"
              />

              <!-- Locked + paused: fine trim waveform + play badge -->
              <div
                v-if="voiceRecording && voiceLocked && voicePaused"
                class="voice-paused-panel relative flex-1 flex items-center min-w-0 h-10 mb-0.5 rounded-2xl"
                dir="ltr"
              >
                <div class="voice-trim flex-1 min-w-0">
                  <div class="voice-trim-inner" @pointerdown.prevent="onVoiceTrimPointerDown">
                    <div class="voice-trim-wave" aria-hidden="true">
                      <span
                        v-for="(p, i) in voiceWaveBars"
                        :key="'vp'+i"
                        class="voice-trim-bar"
                        :class="{ 'is-out': voiceBarOutsideTrim(i) }"
                        :style="{ height: `${Math.round(18 + p * 82)}%` }"
                      />
                    </div>
                    <div
                      class="voice-trim-handle start"
                      :style="{ left: `${voiceTrimStartPct}%` }"
                      data-handle="start"
                      role="slider"
                      :aria-valuenow="Math.round(voiceTrimStart)"
                    />
                    <div
                      class="voice-trim-handle end"
                      :style="{ left: `${voiceTrimEndPct}%` }"
                      data-handle="end"
                      role="slider"
                      :aria-valuenow="Math.round(voiceTrimEnd)"
                    />
                    <div class="voice-trim-playhead" :style="{ left: `${voicePlayheadPct}%` }" />
                  </div>
                </div>
                <button
                  type="button"
                  class="voice-preview-badge"
                  :title="voicePreviewPlaying ? $t('messenger.voicePause') : $t('messenger.voicePlay')"
                  :aria-label="voicePreviewPlaying ? $t('messenger.voicePause') : $t('messenger.voicePlay')"
                  @click.stop="toggleVoicePreviewPlayback"
                  @pointerdown.stop
                >
                  <span class="voice-preview-badge-orb">
                    <svg v-if="voicePreviewPlaying" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                    <svg v-else class="w-2.5 h-2.5 ms-px" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.14v13.72L19 12 8 5.14z" />
                    </svg>
                  </span>
                  <span class="voice-preview-badge-time tabular-nums">{{ voiceTrimDurationLabel }}</span>
                </button>
              </div>

              <!-- Locked recording: tappable Cancel in the center -->
              <button
                v-else-if="voiceRecording && voiceLocked"
                type="button"
                class="voice-rec-cancel-mid flex-1 h-10 mb-0.5 min-w-0"
                @click="cancelVoiceRecord"
              >
                {{ $t('messenger.cancel') }}
              </button>

              <!-- Hold (finger still down): slide-to-cancel hint -->
              <div
                v-else-if="voiceRecording"
                class="voice-slide-cancel flex-1 h-10 mb-0.5 min-w-0"
                :class="{ 'is-armed': voiceCancelHint, 'is-cancel-end': isRtlDoc }"
                aria-hidden="true"
              >
                <span class="voice-slide-cancel-chev" aria-hidden="true">{{ isRtlDoc ? '››' : '‹‹' }}</span>
                <span class="voice-slide-cancel-text">{{ $t('messenger.voiceSlideToCancel') }}</span>
              </div>
            </div>

            <!-- Emoji next to input; mic sits outside emoji (same side). -->
            <button
              v-show="!voiceRecording"
              ref="emojiBtn"
              type="button"
              class="composer-emoji flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-[#707579] dark:text-[#8b98a5] hover:text-[#3390ec] dark:hover:text-[#6ab2f2] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-colors"
              :title="composerPanelBtnTitle"
              :aria-label="composerPanelBtnTitle"
              @pointerdown.prevent="onEmojiBtnPointerDown"
              @mouseenter="onEmojiBtnHoverEnter"
              @mouseleave="onEmojiBtnHoverLeave"
              @click.stop.prevent="toggleEmojiPanel"
            >
              <!-- Keyboard while panel is open (or mid panel→keyboard swap) -->
              <svg
                v-if="showComposerKeyboardIcon"
                class="w-[22px] h-[22px]"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="2.75" y="5.25" width="18.5" height="11.5" rx="2.25" />
                <path d="M7 9.25h.01M10.5 9.25h.01M14 9.25h.01M17.5 9.25h.01M7 12.25h.01M10.5 12.25h.01M14 12.25h.01M17.5 12.25h.01M9 15.1h6" />
              </svg>
              <!-- Telegram-style smile (panel destination remembered separately) -->
              <svg
                v-else
                class="w-[22px] h-[22px]"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.2 13.6c.9 1.45 2.2 2.15 3.8 2.15s2.9-.7 3.8-2.15" />
                <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <button
              v-show="!voiceRecording"
              type="button"
              class="composer-send composer-mic flex-shrink-0 self-end w-9 h-9 flex items-center justify-center rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition"
              :disabled="composerHasContent
                ? ((!text.trim() && !(editingMessage && isMediaType(editingMessage.type)) && !pendingForward))
                : (!!editingMessage || !canSend)"
              :title="composerHasContent ? $t('messenger.send') : $t('messenger.mediaVoice')"
              :aria-label="composerHasContent ? $t('messenger.send') : $t('messenger.mediaVoice')"
              @click="onComposerSendClick"
              @pointerdown="onComposerActionPointerDown($event)"
              @contextmenu.prevent
            >
              <span class="composer-send-icon relative w-5 h-5 block">
                <svg
                  class="absolute inset-0 w-5 h-5 transition-all duration-200 ease-out"
                  :class="composerHasContent ? 'opacity-0 scale-50' : 'opacity-100 scale-100'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5.3-3a5.3 5.3 0 01-10.6 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-1.7z" />
                </svg>
                <svg
                  class="absolute inset-0 w-5 h-5 rtl:-scale-x-100 transition-all duration-200 ease-out"
                  :class="composerHasContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                </svg>
              </span>
            </button>

            <!-- Recording trailing: mic protrudes; pause/lock float above the bar -->
            <div v-if="voiceRecording" class="voice-rec-trailing">
              <!-- Pause / resume badge ABOVE the composer bar (like lock capsule) -->
              <button
                v-if="voiceLocked"
                type="button"
                class="voice-ctrl-pause-badge"
                :title="voicePaused ? $t('messenger.voiceResume') : $t('messenger.voicePause')"
                :aria-label="voicePaused ? $t('messenger.voiceResume') : $t('messenger.voicePause')"
                @click="voicePaused ? resumeVoiceRecord() : pauseVoiceRecord()"
              >
                <svg v-if="voicePaused" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5.3-3a5.3 5.3 0 01-10.6 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-1.7z" />
                </svg>
                <svg v-else class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1.2" />
                  <rect x="14" y="5" width="4" height="14" rx="1.2" />
                </svg>
              </button>

              <!-- Lock rail stays fixed (does NOT slide sideways with cancel drag) -->
              <div
                v-if="!voiceLocked"
                class="voice-lock-rail pointer-events-none"
                :class="{
                  'is-near': voiceLockHint,
                  'is-closing': voiceLockProgress > 0.35,
                  'is-armed': voiceLockProgress > 0.72,
                  'is-cancel-hide': voiceCancelHide > 0.08,
                }"
                :style="voiceLockRailStyle"
              >
                <div class="voice-lock-capsule">
                  <span class="voice-lock-glow" aria-hidden="true" />
                  <span class="voice-lock-icon" aria-hidden="true">
                    <svg class="voice-lock-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect class="voice-lock-body" x="6" y="11" width="12" height="9" rx="2.2" />
                      <path
                        class="voice-lock-shackle voice-lock-shackle--open"
                        stroke-linecap="round"
                        d="M8.2 11V8.2a3.8 3.8 0 017.2-1.7"
                      />
                      <path
                        class="voice-lock-shackle voice-lock-shackle--closed"
                        stroke-linecap="round"
                        d="M8.2 11V8.4a3.8 3.8 0 017.6 0V11"
                      />
                      <circle class="voice-lock-keyhole" cx="12" cy="15.2" r="1.15" />
                    </svg>
                  </span>
                  <span class="voice-lock-chevrons" aria-hidden="true">
                    <svg class="voice-lock-chevron voice-lock-chevron--1" viewBox="0 0 24 24" fill="none">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 14l5-5 5 5" />
                    </svg>
                    <svg class="voice-lock-chevron voice-lock-chevron--2" viewBox="0 0 24 24" fill="none">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 14l5-5 5 5" />
                    </svg>
                    <svg class="voice-lock-chevron voice-lock-chevron--3" viewBox="0 0 24 24" fill="none">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 14l5-5 5 5" />
                    </svg>
                  </span>
                </div>
              </div>

              <div
                class="voice-mic-slot relative flex-shrink-0 flex items-center justify-center overflow-visible"
                :class="{
                  'is-cancel-burst': voiceCancelBurst,
                  'is-locked': voiceLocked,
                }"
                :style="voiceMicFollowStyle"
              >
                <!-- Locked send: paper-plane icon; waves only while recording -->
                <div
                  v-if="voiceLocked"
                  class="voice-hold-mic voice-hold-mic--locked voice-hold-mic--snap"
                  :class="{ 'is-silent': voicePaused }"
                  :style="{ '--voice-level': String(Math.max(0.45, voiceHoldLevel)) }"
                >
                  <template v-if="!voicePaused">
                    <span class="voice-hold-ring voice-hold-ring--a" />
                    <span class="voice-hold-ring voice-hold-ring--b" />
                    <span class="voice-hold-ring voice-hold-ring--c" />
                    <span class="voice-hold-ring voice-hold-ring--d" />
                    <span class="voice-hold-ring voice-hold-ring--e" />
                  </template>
                  <button
                    type="button"
                    class="voice-hold-core voice-hold-core--send"
                    :title="$t('messenger.send')"
                    :aria-label="$t('messenger.send')"
                    @click="stopVoiceRecordAndSend"
                  >
                    <svg class="w-6 h-6 rtl:-scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                    </svg>
                  </button>
                </div>
                <!-- Hold mic: follows finger toward cancel -->
                <div
                  v-else
                  class="voice-hold-mic"
                  :class="{
                    'is-cancel': voiceCancelHint,
                    'is-lock': voiceLockHint,
                  }"
                  :style="{
                    '--voice-level': String(voiceHoldLevel),
                    '--lock-lift': String(voiceLockProgress),
                  }"
                  aria-hidden="true"
                >
                  <span class="voice-hold-ring voice-hold-ring--a" />
                  <span class="voice-hold-ring voice-hold-ring--b" />
                  <span class="voice-hold-ring voice-hold-ring--c" />
                  <span class="voice-hold-ring voice-hold-ring--d" />
                  <span class="voice-hold-ring voice-hold-ring--e" />
                  <span class="voice-hold-core">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5.3-3a5.3 5.3 0 01-10.6 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-1.7z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>




          </div>
          </div>
      </div>
      <div v-else :class="['composer-bar chat-chrome flex-shrink-0 bg-[#f4f4f5] dark:bg-[#0e1621]', chromeEdgeClassTop]">
        <div class="chat-column">
        <div v-if="conversation?.is_preview" class="px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            class="w-full py-3 rounded-2xl bg-[#3390ec] hover:bg-[#4ea4f5] text-white text-[15px] font-bold shadow-sm active:scale-[0.99] transition"
            @click="$emit('join-community', conversation)"
          >
            {{ isChannel ? $t('messenger.joinChannel') : $t('messenger.joinGroup') }}
          </button>
        </div>
        <div v-else class="px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {{ cannotSendReason }}
        </div>
        </div>
      </div>

      <!-- Mobile emoji dock: absolute overlay matching soft-keyboard height (Telegram).
           Not in document flow — reserved via root paddingBottom so total height stays exact.
           Picker stays mounted (v-show) so the second tap is instant. -->
      <div
        v-if="isMobileEmojiMode && conversation && (canSend || pendingForward)"
        class="emoji-keyboard-dock"
        :class="{
          'is-switching': pendingKeyboardInset && !emojiOpen,
          'is-closed': !mobileEmojiDockVisible,
        }"
        :style="{ height: mobileEmojiDockVisible ? `${emojiPanelHeight}px` : '0px' }"
        :aria-hidden="!emojiOpen"
      >
        <MessengerEmojiPicker
          v-show="emojiOpen"
          ref="emojiPicker"
          mobile
          class="emoji-dock-panel"
          :initial-mode="lastEmojiPanelMode"
          @mode-change="onEmojiPanelModeChange"
          @select="onEmojiSelect"
          @backspace="onEmojiBackspace"
          @send-gif="onSendGifFromPanel"
          @send-sticker="onSendStickerFromPanel"
          @compose-stickers="openStickerComposer"
          @edit-sticker="openStickerEditor"
        />
      </div>

      <!-- Pinned messages view — replaces chat content only (Telegram Web) -->
      <transition name="tg-panel-slide">
        <div v-if="pinnedSheetOpen" class="tg-pinned-view">
          <header class="tg-pinned-view__header chat-chrome">
            <button
              type="button"
              @click="closePinnedSheet"
              class="p-1.5 -ms-1 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/10 text-[var(--tg-text-secondary)]"
              :aria-label="$t('messenger.back')"
            >
              <svg class="w-5 h-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h4 class="tg-pinned-view__title">
              {{ $t('messenger.pinnedMessagesCount', { count: pinnedCount }) }}
            </h4>
          </header>

          <div class="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 py-3 chat-messages-scroll select-none tg-scroll">
            <template v-for="item in pinnedGrouped" :key="item.key">
              <div v-if="item.type === 'date'" class="flex justify-center my-3">
                <span
                  data-msg-font="date"
                  class="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-black/30 rounded-full px-3 py-1 shadow-sm">{{
                    item.label }}</span>
              </div>
              <div v-else-if="item.type === 'system'" class="flex justify-center my-3">
                <span
                  class="text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-black/30 rounded-full px-3 py-1 shadow-sm inline-flex items-center gap-1 flex-wrap justify-center max-w-[90%]">
                  <template v-if="systemParts(item.message).clickable">
                    <span>{{ systemParts(item.message).before }}</span>
                    <button type="button"
                      class="text-[#3390ec] dark:text-[#6ab2f2] font-bold hover:underline"
                      @click="$emit('open-profile', systemParts(item.message).user)">{{ systemParts(item.message).name }}</button>
                    <span>{{ systemParts(item.message).after }}</span>
                  </template>
                  <template v-else>{{ systemText(item.message) }}</template>
                </span>
              </div>
              <MediaAlbumBubble
                v-else-if="item.type === 'album'"
                :messages="item.messages"
                :is-mine="item.isMine"
                :selection-mode="selectionMode"
                :selected="item.messages.some((m) => selectedIds.some((id) => Number(id) === Number(m.id)))"
                :group-pos="item.groupPos"
                :tight="item.tight"
                :show-avatar="item.showAvatar"
                :avatar-user="item.avatarUser"
                :chat-type="conversation?.type || 'private'"
                :show-sender-name="isCommunity && !isChannel"
                @toggle-select-album="toggleSelectAlbum"
                @enter-select-album="onEnterSelectAlbum"
                @avatar-click="onAvatarClick"
                @context="openMsgMenu"
                @open-lightbox="onOpenLightbox"
                @cancel-upload="onCancelUpload"
                @forward-tap="onForwardTap"
                @forward-chat-tap="onForwardChatTap"
              />
              <div v-else-if="item.message" class="relative">
                <MessageBubble :message="item.message" :is-mine="item.isMine" :selection-mode="selectionMode"
                  :selected="selectedIds.some((id) => Number(id) === Number(item.message.id))" :group-pos="item.groupPos" :tight="item.tight"
                  :show-avatar="item.showAvatar" :avatar-user="item.avatarUser" :pinned="item.pinned"
                  :chat-type="conversation?.type || 'private'"
                  :chat-title="conversation?.title || partnerName"
                  :show-sender-name="isCommunity && !isChannel"
                  @edit="onEdit"
                  @delete="onDelete" @reply="onReply" @context="openMsgMenu" @toggle-select="toggleSelect"
                  @enter-select="onEnterSelect" @avatar-click="onAvatarClick" @forward-tap="onForwardTap"
                  @forward-chat-tap="onForwardChatTap" @channel-tap="onChannelHeaderTap"
                  @scroll-to-reply="onScrollToReply" @open-link="$emit('open-link', $event)" />
                <button @click.stop="jumpToPinned(item.message)"
                  :class="['absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-sm text-white/90 hover:bg-black/35 flex-shrink-0', item.isMine ? 'ltr:left-2 rtl:right-2' : 'ltr:right-2 rtl:left-2']"
                  :title="$t('messenger.goToMessage')">
                  <svg class="w-4 h-4 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </template>
          </div>

          <div class="tg-pinned-view__footer">
            <button type="button" class="tg-pinned-view__unpin-all" @click="requestUnpinAll">
              {{ $t('messenger.unpinAllCount', { count: pinnedCount }) }}
            </button>
          </div>
        </div>
      </transition>

      <PinMessageSheet
        :open="pinChoice.open"
        :partner-name="partnerName"
        @close="cancelPin"
        @confirm="onPinSheetConfirm"
      />

      <ConfirmDialog
        :open="unpinAllConfirmOpen"
        :title="$t('messenger.unpinAllConfirm', { count: pinnedCount })"
        :confirm-label="$t('messenger.unpin')"
        :danger="true"
        @close="unpinAllConfirmOpen = false"
        @confirm="confirmUnpinAll"
      />
    </template>

    <LocationPickerSheet
      :open="locationSheet.open"
      :initial-lat="locationSheet.lat"
      :initial-lng="locationSheet.lng"
      :initial-accuracy="locationSheet.accuracy"
      @close="closeLocationSheet"
      @confirm="confirmSendLocation"
      @gps-error="showLocationError"
    />

    <AttachMediaSheet
      :open="attachSheet.open"
      @close="onAttachSheetClose"
      @select="onAttachSelect"
    />

    <MediaComposerSheet
      :open="mediaCompose.open"
      :type="mediaCompose.type"
      :file="mediaCompose.file"
      :file-name="mediaCompose.fileName"
      :preview-url="mediaCompose.previewUrl"
      :cover-url="mediaCompose.coverUrl"
      :size="mediaCompose.size"
      :duration="mediaCompose.duration"
      :width="mediaCompose.width"
      :height="mediaCompose.height"
      :items="mediaCompose.items"
      @close="closeMediaCompose"
      @send="confirmMediaCompose"
      @send-batch="confirmMediaBatch"
    />

    <MediaViewerOverlay
      :open="mediaViewer.open"
      :src="mediaViewer.src"
      :media-type="mediaViewer.type"
      :message="mediaViewer.message"
      :items="mediaViewer.items"
      :index="mediaViewer.index"
      :can-forward="canMessengerFeature('forward')"
      @close="closeMediaViewer"
      @navigate="onMediaViewerNavigate"
      @need-download="onMediaViewerNeedDownload"
      @need-more="onMediaViewerNeedMore"
      @forward="onMediaViewerForward"
      @go-to-message="onMediaViewerGoToMessage"
    />

    <input ref="photoInput" type="file" :accept="photoAccept" multiple class="hidden" @change="onFilePicked('gallery', $event)" />
    <input ref="videoInput" type="file" :accept="videoAccept" multiple class="hidden" @change="onFilePicked('video', $event)" />
    <input ref="audioInput" type="file" :accept="audioAccept" class="hidden" @change="onFilePicked('audio', $event)" />
    <input ref="fileInput" type="file" :accept="fileAccept" multiple class="hidden" @change="onFilePicked('file', $event)" />
    <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onCameraPicked" />

    <ActionSheet
      :open="locationDenied.open"
      :title="locationDenied.title || $t('messenger.locationPermissionTitle')"
      :message="locationDenied.message"
      :actions="locationDeniedActions"
      @close="locationDenied.open = false"
      @select="onLocationDeniedSelect"
    />

    <!-- Desktop hover emoji popover (click opens the fixed right sidebar). -->
    <Teleport to="body">
      <div
        v-show="emojiHoverOpen && !isMobileEmojiMode && !emojiSidebarOpen"
        v-if="emojiHoverMounted"
        ref="emojiPopover"
        class="fixed z-[2000000020] w-[min(360px,calc(100vw-1rem))] h-[320px] rounded-2xl overflow-hidden shadow-2xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#17212b]"
        :style="emojiPopoverStyle"
        @mouseenter="onEmojiPopoverEnter"
        @mouseleave="onEmojiPopoverLeave"
      >
        <MessengerEmojiPicker
          ref="emojiHoverPicker"
          :initial-mode="lastEmojiPanelMode"
          external-settings
          @mode-change="onEmojiPanelModeChange"
          @select="onEmojiSelect"
          @backspace="onEmojiBackspace"
          @send-gif="onSendGifFromPanel"
          @send-sticker="onSendStickerFromPanel"
          @compose-stickers="openStickerComposer"
          @edit-sticker="openStickerEditor"
          @open-sticker-settings="openHoverStickerSettings"
          @sticker-packs-changed="onHoverStickerPacksChanged"
        />
      </div>
    </Teleport>

    <StickerPackSheet
      :open="stickerPackSheet.open"
      :pack-id="stickerPackSheet.packId"
      :fallback-sticker="stickerPackSheet.fallback"
      :seed-stickers="stickerPackSheet.seedStickers"
      @close="closeStickerPackSheet"
      @send="onStickerPackSend"
      @pack-changed="onStickerPackChanged"
    />

    <StickerComposerSheet
      :open="stickerComposer.open"
      :mode="stickerComposer.mode"
      :initial-files="stickerComposer.files"
      :edit-sticker="stickerComposer.editSticker"
      :target-pack-id="stickerComposer.targetPackId"
      @close="stickerComposer.open = false"
      @saved="onStickerComposerSaved"
    />

    <StickerSettingsSheet
      :open="stickerSettingsOpen"
      @close="stickerSettingsOpen = false"
      @changed="onHoverStickerPacksChanged"
    />

    <!-- Forward options: teleported so it isn't clipped by overflow:hidden parents on mobile -->
    <Teleport to="body">
      <div
        v-if="forwardMenuOpen"
        ref="forwardMenuPanel"
        class="tg-menu forward-menu-pop fixed py-1"
        :style="forwardMenuStyle"
        @click.stop
      >
        <button type="button" class="tg-menu-item" @click="onForwardMenu('hide-sender')">
          <span class="tg-menu-item-glyph" aria-hidden="true">
            <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, di) in menuIconPaths(pendingForward?.dropAuthor ? 'eye' : 'eyeOff')" :key="'fe'+di" :d="d" />
            </svg>
          </span>
          <span class="tg-menu-item-label">{{
            pendingForward?.dropAuthor
              ? $t('messenger.showSenderName')
              : $t('messenger.hideSenderName')
          }}</span>
        </button>
        <button type="button" class="tg-menu-item is-danger" @click="onForwardMenu('cancel')">
          <span class="tg-menu-item-glyph" aria-hidden="true">
            <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, di) in menuIconPaths('close')" :key="'fc'+di" :d="d" />
            </svg>
          </span>
          <span class="tg-menu-item-label">{{ $t('messenger.cancelForward') }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "@/composables/useStore";
import MessageBubble from './MessageBubble.vue';
import ContextMenu from './ContextMenu.vue';
import PinMessageSheet from './PinMessageSheet.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import MessengerAvatar from './MessengerAvatar.vue';
import ActionSheet from './ActionSheet.vue';
import LocationPickerSheet from './LocationPickerSheet.vue';
import MediaComposerSheet from './MediaComposerSheet.vue';
import MediaViewerOverlay from './MediaViewerOverlay.vue';
import AttachMediaSheet from './AttachMediaSheet.vue';
import ReplyQuotePreview from './ReplyQuotePreview.vue';
import { openAfterPointerSettled } from './interactionManagers';
import { iconPaths as menuIconPaths } from './messengerIcons';
import { isChatLockedNow, isCommunityStaffRole } from './chatLock';
import { applyFormatMarker, stripFormatMarkers } from './messageFormat';
import {
  SEARCH_MIN_CHARS,
  meetsSearchMin,
  searchCachedMessages,
  mergeMessageSearchHits,
} from './searchHelpers';
import { recordMessageViews, searchMessages, getSharedMedia } from '@/services/messenger';
import { decryptMessageList } from '@/crypto/messenger';
import { GEO_ERROR, locationBody, mapsUrl } from './geolocation';
import {
  AUDIO_ACCEPT,
  classifyDroppedFiles,
  extractAudioArtworkBlob,
  FILE_ACCEPT,
  GALLERY_ACCEPT,
  getMicrophoneStream,
  isGalleryMediaMessage,
  isMediaType,
  isMediaWithinLimit,
  MEDIA_MAX_MB,
  MEDIA_MAX_PICK,
  mediaTypeLabelKey,
  probeLocalFile,
  sliceAudioBlob,
  VIDEO_ACCEPT,
  captureVideoPoster,
} from './mediaHelpers';
import { downloadMedia, saveMediaToDevice, getCachedBlobUrl, isMediaDownloaded } from './mediaCache';
import { analyzeWaveform } from './mediaPlayer';
import { expandMediaBatchForSend, batchLeadType } from './mediaUploadHelpers';
import MediaAlbumBubble from './MediaAlbumBubble.vue';
import EmptyChatGreeting from './EmptyChatGreeting.vue';
import MessengerEmojiPicker from './MessengerEmojiPicker.vue';
import StickerPackSheet from './StickerPackSheet.vue';
import StickerComposerSheet from './StickerComposerSheet.vue';
import StickerSettingsSheet from './StickerSettingsSheet.vue';
import {
  addGifToLibrary,
  deleteLastGrapheme,
  emojiToStickerBlob,
  isAnimationMessage,
  isGifSaved,
  isStickerMessage,
} from './stickerGifLibrary';
import { findPackById, findStickerById, findStickersByEmoji } from './stickerPacks';
import { avatarInitials } from './avatarInitials';
import { shapeUiDigits } from './appearance';
import { peerDisplayName, contactNameMap, conversationPartner } from '@/utils/messengerPeerName';
import { formatPresenceText } from '@/utils/messengerPresence';
import {
  connectionStatusI18nKey,
  connectionStatusShowsDots,
  isConnectionHealthy,
  resolveConnectionDisplayStatus,
} from '@/utils/connectionStatus';
import { compareMessages } from './outbox';
import {
  PAGE_SWIPE_THRESHOLD,
  TG_EASE_OUT,
  tgTransformTransition,
  animationsEnabled,
} from './motion';

const EMOJI_KEYBOARD_HEIGHT_KEY = 'messenger-keyboard-height';
const EMOJI_PANEL_MODE_KEY = 'messenger-emoji-panel-mode';
const DEFAULT_EMOJI_PANEL_HEIGHT = 280;
const EMOJI_PANEL_MODES = ['emoji', 'gif', 'stickers'];

function readLastEmojiPanelMode() {
  try {
    const m = localStorage.getItem(EMOJI_PANEL_MODE_KEY);
    if (EMOJI_PANEL_MODES.includes(m)) return m;
  } catch { /* noop */ }
  return 'emoji';
}

function defaultEmojiPanelHeight() {
  if (typeof window === 'undefined') return DEFAULT_EMOJI_PANEL_HEIGHT;
  return Math.round(Math.min(420, Math.max(260, window.innerHeight * 0.42)));
}

// Telegram-style: a single message longer than this is sent as several
// messages. Kept under the backend's 5000-char limit with headroom.
const MAX_SEND_LENGTH = 4096;

export default {
  components: {
    MessageBubble,
    ContextMenu,
    PinMessageSheet,
    ConfirmDialog,
    MessengerAvatar,
    ActionSheet,
    LocationPickerSheet,
    MediaComposerSheet,
    MediaViewerOverlay,
    AttachMediaSheet,
    ReplyQuotePreview,
    MediaAlbumBubble,
    EmptyChatGreeting,
    MessengerEmojiPicker,
    StickerPackSheet,
    StickerComposerSheet,
    StickerSettingsSheet,
  },
  props: {
    conversation: { type: Object, default: null },
    messages: { type: Array, default: () => [] },
    meId: { type: [Number, String], default: null },
    meUser: { type: Object, default: null },
    typingLabel: { type: String, default: null },
    typingActivity: { type: String, default: null },
    sending: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    messagesLoading: { type: Boolean, default: false },
    /** Messenger page still resolving auth / boot / route — never paint a stale chat. */
    bootLoading: { type: Boolean, default: false },
    /** Desktop profile/info rail open — drives end-side corner scoops. */
    profileOpen: { type: Boolean, default: false },
    /** Desktop emoji/sticker sidebar open (MessengerPage right rail). */
    emojiSidebarOpen: { type: Boolean, default: false },
    connected: { type: Boolean, default: false },
    connectionState: { type: String, default: 'connecting' },
    connectionDisplayStatus: { type: String, default: '' },
    networkOnline: { type: Boolean, default: true },
  },
  provide() {
    return {
      consumeChatAccessoryTap: () => this.consumeChatAccessoryTap(),
    };
  },
  emits: ['send', 'send-media', 'edit', 'request-delete', 'request-delete-selected', 'typing', 'clear', 'delete-conversation', 'mute', 'load-more', 'back', 'open-forward', 'confirm-forward', 'open-profile', 'open-chat-with-user', 'open-community', 'reveal-message', 'retry-message', 'delete-failed-message', 'cancel-upload', 'join-community', 'open-link', 'accessory-change', 'open-wallpaper', 'composer-lift', 'emoji-sidebar-change', 'sticker-packs-changed'],
  data() {
    return {
      text: '',
      editingMessage: null,
      forwardMenuOpen: false,
      forwardMenuStyle: {},
      showMenu: false,
      searchMode: false,
      searchQuery: '',
      searchActiveQuery: '',
      searchSubmitted: false,
      searchFrom: '',
      searchTo: '',
      searchShowDates: false,
      searchResults: [],
      searchTotal: 0,
      searchIndex: 0,
      searchSearching: false,
      searchTimer: null,
      typingTimer: null,
      typingIdleTimer: null,
      activityPulseTimer: null,
      activityPulseKind: null,
      /** Background upload activity to resume when typing pauses (Telegram-like). */
      uploadPulseKind: null,
      uploadPulseWatch: null,
      /** lg+ split layout (list + chat). Scoops are desktop-only. */
      isDesktopSplit: typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(min-width: 1024px)').matches,
      draftTimer: null,
      msgMenu: { visible: false, x: 0, y: 0, message: null, albumMessageIds: null, albumMessages: null },
      inputMenu: { visible: false, x: 0, y: 0, mode: 'format' },
      inputSel: { start: 0, end: 0 },
      clipCanPaste: false,
      composerFocused: false,
      /** Mobile: 'none' = caret without soft keyboard; 'text' = normal typing. */
      composerInputMode: 'text',
      // Scroll / new-message tracking
      atBottom: true,
      scrolledUp: false,
      showNewBadge: false,
      newCount: 0,
      firstUnreadId: null,
      loadingMore: false,
      revealLoading: false,
      trackedConvId: null,
      lastFirstId: null,
      lastLastId: null,
      lastLen: 0,
      pendingPrependHeight: null,
      loadMoreWatchdog: null,
      // Swipe-the-page-back-to-list gesture (mobile).
      pageSwipe: null,
      pageSwipeX: 0,
      pageSwipeOut: 0,
      /** Soft open animation while switching chats. */
      chatOpening: false,
      skipNextOpenAnim: false,
      chatOpenTimer: null,
      // Pinned-messages sheet (overlays the chat area).
      pinnedSheetOpen: false,
      unpinAllConfirmOpen: false,
      // Pinned bar cursor — starts at the newest pin, walks to older on each tap.
      pinCursor: 0,
      /** After first bar jump, further taps cycle to the next older pin. */
      pinBarJumped: false,
      // Pin confirm modal (checkbox to also pin for the partner).
      pinChoice: { open: false, message: null, forEveryone: false },
      lockClock: Date.now(),
      lockClockTimer: null,
      viewedIds: {},
      locationSheet: { open: false, lat: null, lng: null, accuracy: null },
      locationDenied: { open: false, message: '', title: '' },
      attachSheet: { open: false },
      mediaCompose: {
        open: false,
        type: 'photo',
        file: null,
        fileName: '',
        previewUrl: '',
        coverBlob: null,
        coverUrl: '',
        size: 0,
        duration: null,
        width: null,
        height: null,
        items: [],
      },
      mediaViewer: {
        open: false,
        src: '',
        type: 'photo',
        message: null,
        items: [],
        index: 0,
        hasMoreOlder: false,
        loadingGallery: false,
        galleryBeforeId: null,
        galleryToken: 0,
      },
      voiceRecording: false,
      voiceRecorder: null,
      voiceChunks: [],
      voiceStartedAt: 0,
      voiceElapsed: 0,
      voiceAccumulatedMs: 0,
      voiceTick: null,
      voiceStream: null,
      voiceLocked: false,
      voicePaused: false,
      voiceCancelHint: false,
      voiceLockHint: false,
      voiceLockProgress: 0,
      voiceDragX: 0,
      voiceCancelBurst: false,
      voiceCancelTimer: null,
      voiceGesture: null,
      voicePointerActive: false,
      voicePointerId: null,
      voiceHoldTimer: null,
      voicePreviewUrl: '',
      voicePeaks: [],
      voiceLivePeaks: [],
      voiceDurationSec: 0,
      voiceTrimStart: 0,
      voiceTrimEnd: 0,
      voicePreviewPlaying: false,
      voicePlayhead: 0,
      voicePreviewAudio: null,
      voiceAnalyser: null,
      voiceAudioCtx: null,
      voiceAnimFrame: null,
      voiceMimeType: '',
      emojiOpen: false,
      emojiPanelHeight: defaultEmojiPanelHeight(),
      lastEmojiPanelMode: readLastEmojiPanelMode(),
      lastKeyboardOffsetTop: 0,
      pendingKeyboardInset: false,
      /**
       * Single surface transition for Telegram-like composer accessories.
       * null | 'to-keyboard' | 'to-panel' — prevents focus/blur/tap races from
       * stacking contradictory open/close handlers.
       */
      surfaceTransition: null,
      insetFallbackTimer: null,
      emojiPopoverStyle: { top: '0px', left: '0px' },
      emojiHoverOpen: false,
      emojiHoverMounted: false,
      emojiHoverOpenTimer: null,
      emojiHoverCloseTimer: null,
      stickerSettingsOpen: false,
      /** Soft keyboard currently consuming visual viewport (for composer safe-area). */
      keyboardOpen: false,
      /** First tap on the transcript only dismisses KB/emoji; second tap acts. */
      _accPtr: null,
      _accScrollGesture: false,
      _suppressMsgActionUntil: 0,
      dragActive: false,
      dragDepth: 0,
      stickerPackSheet: { open: false, packId: null, fallback: null, seedStickers: [] },
      stickerComposer: { open: false, mode: 'pack', files: [], editSticker: null, targetPackId: null },
    };
  },
  computed: {
    photoAccept() { return GALLERY_ACCEPT; },
    videoAccept() { return VIDEO_ACCEPT; },
    audioAccept() { return AUDIO_ACCEPT; },
    fileAccept() { return FILE_ACCEPT; },
    voiceElapsedLabel() {
      const s = Math.floor(this.voiceElapsed / 1000);
      const m = Math.floor(s / 60);
      const r = s % 60;
      return shapeUiDigits(`${m}:${String(r).padStart(2, '0')}`, 'composer');
    },
    /** Telegram-style timer with centiseconds: 0:05,23 */
    voiceElapsedPrecise() {
      const ms = Math.max(0, this.voiceElapsed || 0);
      const totalCs = Math.floor(ms / 10);
      const cs = totalCs % 100;
      const totalSec = Math.floor(totalCs / 100);
      const m = Math.floor(totalSec / 60);
      const r = totalSec % 60;
      return shapeUiDigits(`${m}:${String(r).padStart(2, '0')},${String(cs).padStart(2, '0')}`, 'composer');
    },
    /** Mic follows finger toward the cancel side while holding. */
    voiceMicFollowStyle() {
      if (!this.voiceRecording || this.voiceLocked) return {};
      const slide = Math.max(0, this.voiceDragX || 0);
      // Mic is last in the composer row → LTR right / RTL left; cancel is toward the field.
      const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
      const x = rtl ? slide : -slide;
      const scale = this.voiceCancelHint ? Math.max(0.82, 1 - slide / 420) : 1;
      return {
        transform: `translate3d(${Math.round(x)}px, 0, 0) scale(${scale})`,
        transition: this.voiceCancelBurst ? 'transform 0.22s ease, opacity 0.22s ease' : 'none',
      };
    },
    /** 0..1 how far the finger has slid toward cancel (for lock fade). */
    voiceCancelHide() {
      if (this.voiceLocked || !this.voiceRecording) return 0;
      return Math.max(0, Math.min(1, (this.voiceDragX || 0) / 72));
    },
    /** Lock capsule fades/shrinks downward when sliding to cancel; returns when finger comes back. */
    voiceLockRailStyle() {
      const hide = this.voiceCancelHide;
      const close = this.voiceLockProgress || 0;
      const lift = this.voiceLockHint ? (close * -8) : 0;
      const armedBoost = close > 0.72 ? 1.02 : 1;
      const hideScale = Math.max(0.45, 1 - hide * 0.42);
      return {
        '--lock-close': String(close),
        '--lock-hide': String(hide),
        opacity: String(Math.max(0, 1 - hide * 1.2)),
        transform: `translateX(-50%) translateY(${Math.round(hide * 30 + lift)}px) scale(${(armedBoost * hideScale).toFixed(3)})`,
        transition: 'opacity 0.18s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.18s ease',
        filter: hide > 0.35 ? `blur(${(hide * 3).toFixed(1)}px)` : 'none',
        pointerEvents: 'none',
      };
    },
    voiceTrimStartPct() {
      const d = this.voiceDurationSec || 1;
      return Math.max(0, Math.min(100, (this.voiceTrimStart / d) * 100));
    },
    voiceTrimEndPct() {
      const d = this.voiceDurationSec || 1;
      return Math.max(0, Math.min(100, (this.voiceTrimEnd / d) * 100));
    },
    voicePlayheadPct() {
      const d = this.voiceDurationSec || 1;
      return Math.max(0, Math.min(100, (this.voicePlayhead / d) * 100));
    },
    voiceTrimRangeStyle() {
      const start = this.voiceTrimStartPct;
      const end = this.voiceTrimEndPct;
      return { left: `${start}%`, width: `${Math.max(0, end - start)}%` };
    },
    voiceTrimDurationLabel() {
      const sec = Math.max(0, this.voiceTrimEnd - this.voiceTrimStart);
      const s = Math.floor(sec);
      const m = Math.floor(s / 60);
      const r = s % 60;
      return shapeUiDigits(`${m}:${String(r).padStart(2, '0')}`, 'composer');
    },
    voiceWaveBars() {
      if (this.voicePaused && this.voicePeaks.length) return this.voicePeaks;
      if (this.voiceLivePeaks.length) return this.voiceLivePeaks;
      // Idle pulse bars while analyser warms up (Telegram-like).
      return Array.from({ length: 36 }, (_, i) => 0.18 + ((i * 13) % 11) / 22);
    },
    /** 0..1 mic energy for hold-button ripple scale (Telegram). */
    voiceHoldLevel() {
      const peaks = this.voiceLivePeaks;
      if (!peaks?.length) return 0.35;
      let sum = 0;
      for (let i = 0; i < peaks.length; i += 1) sum += peaks[i] || 0;
      const avg = sum / peaks.length;
      return Math.max(0.18, Math.min(1, avg * 1.35));
    },
    locationDeniedActions() {
      if (this.locationDenied.title === this.$t('messenger.mediaVoice')) {
        return [{ label: this.$t('messenger.ok'), value: 'ok', primary: true }];
      }
      return [
        { label: this.$t('messenger.locationTryAgain'), value: 'retry', primary: true },
      ];
    },
    ...mapState('messenger', ['selectionMode', 'selectedIds', 'replyTo', 'settings', 'pendingForward']),
    ...mapGetters('messenger', [
      'selectedCount',
      'selectedMessages',
      'selectionAllMine',
      'activePinnedMessages',
      'draftForConversation',
      'contactNameByUserId',
      'canMessengerFeature',
      'canMessengerUpload',
      'messengerLimits',
      'messengerUploads',
    ]),
    rootSwipeStyle() {
      if (this.pageSwipeOut) {
        return {
          transform: `translateX(${this.pageSwipeOut * 100}%)`,
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          opacity: 0,
        };
      }
      if (this.pageSwipeX === 0) return {};
      return {
        transform: `translateX(${this.pageSwipeX}px)`,
        transition: this.pageSwipe ? 'none' : tgTransformTransition(220, TG_EASE_OUT),
      };
    },
    /** Reserve exactly the keyboard band for the absolute emoji dock (Telegram). */
    rootLayoutStyle() {
      const swipe = this.rootSwipeStyle || {};
      const dockOn = this.isMobileEmojiMode
        && this.mobileEmojiDockVisible
        && this.conversation
        && (this.canSend || this.pendingForward);
      if (dockOn) {
        return {
          ...swipe,
          paddingBottom: `${this.emojiPanelHeight}px`,
        };
      }
      return swipe;
    },
    /**
     * When the soft keyboard or emoji dock owns the bottom inset, drop iOS
     * safe-area padding — otherwise a gap appears between input and keyboard.
     */
    composerBottomPadClass() {
      // Keep a small inner pad so mic/emoji/attach icons are not glued to the
      // keyboard/dock edge. The bar background fills this pad — external hairline
      // gaps vs the soft keyboard are handled by shell visualViewport pinning.
      if (this.keyboardOpen || this.mobileEmojiDockVisible) {
        return 'pb-1.5';
      }
      // Mobile: safe-area only. Desktop (lg+): lift the input row slightly off the bottom.
      return 'pb-[env(safe-area-inset-bottom,0px)] lg:pb-3';
    },
    pinnedList() {
      // Ordered by send time (oldest → newest), like the chat itself.
      return [...(this.activePinnedMessages || [])].sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (ta !== tb) return ta - tb;
        return (a.id || 0) - (b.id || 0);
      });
    },
    // Date-separated, author-grouped pinned messages (mirrors the chat list).
    pinnedGrouped() {
      return this.groupMessages(this.pinnedList, false);
    },
    pinnedCount() {
      return this.pinnedList.length;
    },
    // The message the pinned bar currently points at (cycles on each tap).
    activePin() {
      if (!this.pinnedCount) return null;
      const idx = ((this.pinCursor % this.pinnedCount) + this.pinnedCount) % this.pinnedCount;
      return this.pinnedList[idx];
    },
    activePinIsSticker() {
      return isStickerMessage(this.activePin);
    },
    // Small stacked indicators, capped so the bar stays compact.
    pinnedIndicatorCount() {
      return Math.min(this.pinnedCount, 4);
    },
    // Which capped indicator to highlight for the current cursor.
    activeIndicatorIndex() {
      if (!this.pinnedCount) return 0;
      const idx = ((this.pinCursor % this.pinnedCount) + this.pinnedCount) % this.pinnedCount;
      // Map the (newest-first) cursor onto the capped indicator strip.
      const fromTop = this.pinnedCount - 1 - idx;
      return Math.min(fromTop, this.pinnedIndicatorCount - 1);
    },
    isMuted() {
      return !!(this.conversation?.pivot && this.conversation.pivot.muted_at);
    },
    // True while a reply, edit, or forward bar is docked above the textarea.
    composerExpanded() {
      return !!this.editingMessage
        || (!!this.replyTo && !this.editingMessage && !this.pendingForward)
        || !!this.pendingForward;
    },
    /** Escape overflow:hidden ancestors so mic waves / lock rail paint above chat. */
    composerLift() {
      return !!(this.voiceRecording || this.forwardMenuOpen);
    },
    forwardPreviewMessage() {
      const msgs = this.pendingForward?.messages || [];
      return msgs[0] || null;
    },
    isMultiForward() {
      return (this.pendingForward?.messageIds?.length || 0) > 1
        || (this.pendingForward?.messages?.length || 0) > 1;
    },
    forwardMultiTitle() {
      const n = Math.max(
        this.pendingForward?.messageIds?.length || 0,
        this.pendingForward?.messages?.length || 0,
      );
      return this.$t('messenger.forwardingNMessages', { n });
    },
    forwardMultiSubtitle() {
      if (!this.pendingForward || this.pendingForward.dropAuthor) return '';
      const names = this.forwardSenderNames;
      if (!names.length) return '';
      return this.$t('messenger.forwardFromSenders', { names: this.joinForwardNames(names) });
    },
    forwardSenderNames() {
      const msgs = this.pendingForward?.messages || [];
      const seen = new Set();
      const names = [];
      const contactMap = contactNameMap(this.$store.state.messenger?.contacts);
      for (const m of msgs) {
        const u = m?.user || m?.forwarded_from;
        if (!u) continue;
        const key = u.id != null ? `u:${u.id}` : `n:${u.first_name}|${u.last_name}|${u.username}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const nick = u.id != null ? contactMap[u.id] : '';
        const name = peerDisplayName(u, nick, this.$t('messenger.user'));
        if (name) names.push(name);
        if (names.length >= 4) break;
      }
      return names;
    },
    // Telegram-style: hide attach + swap mic→send once the composer has content.
    isMobileEmojiMode() {
      // Track via matchMedia (isDesktopSplit) so rotate/resize stays consistent.
      return !this.isDesktopSplit;
    },
    /** Keep dock height while swapping emoji ↔ keyboard so messages never jump. */
    mobileEmojiDockVisible() {
      return this.emojiOpen || this.pendingKeyboardInset;
    },
    /** Mobile dock or desktop sidebar emoji panel is active. */
    emojiPanelActive() {
      return !!(this.emojiOpen || this.emojiSidebarOpen);
    },
    /** Keyboard glyph while panel is open or mid panel→keyboard transition. */
    showComposerKeyboardIcon() {
      if (!this.isMobileEmojiMode) return false;
      return !!(this.emojiOpen || this.surfaceTransition === 'to-keyboard');
    },
    composerPanelBtnTitle() {
      if (this.showComposerKeyboardIcon || this.emojiPanelActive) {
        return this.$t('messenger.showKeyboard');
      }
      if (this.lastEmojiPanelMode === 'gif') return this.$t('messenger.panelGif');
      if (this.lastEmojiPanelMode === 'stickers') return this.$t('messenger.panelStickers');
      return this.$t('messenger.emoji');
    },
    composerHasContent() {
      return !!(this.text && this.text.trim()) || !!this.editingMessage || !!this.pendingForward;
    },
    /** Physical sides: list/profile sit opposite in RTL flex — don't use logical start/end. */
    isRtlDoc() {
      return typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    },
    /** Conversation list rail open (desktop + chat open). */
    scoopList() {
      return !!(this.conversation && this.isDesktopSplit);
    },
    /** Profile/info or emoji sidebar rail open. */
    scoopProfile() {
      return !!(this.conversation && this.isDesktopSplit && (this.profileOpen || this.emojiSidebarOpen));
    },
    /** LTR: list=left, profile=right. RTL: list=right, profile=left. */
    scoopLeft() {
      if (!this.conversation || !this.isDesktopSplit) return false;
      return this.isRtlDoc ? this.scoopProfile : this.scoopList;
    },
    scoopRight() {
      if (!this.conversation || !this.isDesktopSplit) return false;
      return this.isRtlDoc ? this.scoopList : this.scoopProfile;
    },
    messagesShellClass() {
      return {
        'chat-messages-shell--scoop': this.scoopLeft || this.scoopRight,
        'chat-messages-shell--left': this.scoopLeft,
        'chat-messages-shell--right': this.scoopRight,
      };
    },
    /** Internal chrome↔messages borders — desktop only (hidden on mobile). */
    chromeEdgeClass() {
      return (this.scoopLeft || this.scoopRight)
        ? ''
        : 'lg:border-b-[3px] lg:border-[#ececec] dark:lg:border-[#243041]';
    },
    chromeEdgeClassTop() {
      return (this.scoopLeft || this.scoopRight)
        ? ''
        : 'lg:border-t-[3px] lg:border-[#ececec] dark:lg:border-[#243041]';
    },
    lastSeenText() {
      if (!this.partner || this.partner.is_online) return '';
      if (!this.partner.last_seen) return '';
      return formatPresenceText(this.partner, (k, p) => this.$t(k, p), {
        locale: this.$i18n?.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
    resolvedDisplayStatus() {
      if (this.connectionDisplayStatus) return this.connectionDisplayStatus;
      return resolveConnectionDisplayStatus({
        state: this.connectionState,
        isOnline: this.networkOnline,
        networkConfirmedDown: this.connectionState === 'unavailable',
      });
    },
    connectionHealthy() {
      return isConnectionHealthy(this.resolvedDisplayStatus);
    },
    showHeaderConnectionStatus() {
      // Never show stale online/last-seen while the local connection is unhealthy.
      return !this.connectionHealthy;
    },
    headerConnectionText() {
      const key = connectionStatusI18nKey(this.resolvedDisplayStatus);
      return key ? this.$t(key) : '';
    },
    headerConnectionDots() {
      return connectionStatusShowsDots(this.resolvedDisplayStatus);
    },
    showPeerOnlineDot() {
      if (this.isSaved || this.isCommunity) return false;
      if (this.showHeaderConnectionStatus) return false;
      return !!this.partner?.is_online;
    },
    isSaved() {
      return this.conversation?.type === 'saved';
    },
    isCommunity() {
      return this.conversation?.type === 'group' || this.conversation?.type === 'channel';
    },
    isChannel() {
      return this.conversation?.type === 'channel';
    },
    profileMenuLabel() {
      if (this.isChannel) return this.$t('messenger.channelInfo');
      if (this.isCommunity) return this.$t('messenger.groupInfo');
      if (this.isSaved) return this.$t('messenger.savedMessagesInfo');
      return this.$t('messenger.userInfo');
    },
    canSend() {
      if (this.conversation?.is_preview) return false;
      if (!this.isCommunity) return true;
      const role = this.conversation?.my_role || this.conversation?.pivot?.role;
      const isStaff = isCommunityStaffRole(role);

      if (this.isChannel) {
        return ['owner', 'admin'].includes(role);
      }

      const mutedUntil = this.conversation?.pivot?.muted_until;
      if (mutedUntil && new Date(mutedUntil) > new Date()) return false;

      void this.lockClock;
      if (isChatLockedNow(this.conversation, new Date(this.lockClock)) && !isStaff) return false;

      if (this.conversation?.who_can_send === 'admins' && !isStaff) return false;

      return true;
    },
    /** Admins/mods/owners can delete others' messages in communities. */
    canDeleteOthersMessages() {
      if (!this.isCommunity) return false;
      if (!this.canMessengerFeature('delete_messages')) return false;
      const role = this.conversation?.my_role || this.conversation?.pivot?.role;
      return isCommunityStaffRole(role);
    },
    chatLockedForMembers() {
      if (!this.isCommunity || this.isChannel) return false;
      void this.lockClock;
      return isChatLockedNow(this.conversation, new Date(this.lockClock));
    },
    cannotSendReason() {
      if (this.canSend) return '';
      if (this.isChannel) return this.$t('messenger.channelReadOnly');
      const mutedUntil = this.conversation?.pivot?.muted_until;
      if (mutedUntil && new Date(mutedUntil) > new Date()) return this.$t('messenger.mutedCannotSend');
      if (this.chatLockedForMembers) {
        return this.$t('messenger.chatLocked');
      }
      if (this.conversation?.who_can_send === 'admins') return this.$t('messenger.adminsOnlySend');
      return this.$t('messenger.mutedCannotSend');
    },
    partner() {
      if (!this.conversation) return null;
      if (this.isSaved) {
        return this.conversation.users?.find((u) => Number(u.id) === Number(this.meId)) || null;
      }
      if (this.isCommunity) {
        return {
          id: this.conversation.id,
          first_name: this.conversation.title,
          profile_pic: this.conversation.avatar,
          username: this.conversation.username,
          is_online: false,
        };
      }
      return conversationPartner(this.conversation, this.meId);
    },
    partnerName() {
      if (this.isSaved) return this.$t('messenger.savedMessages');
      if (this.isCommunity) return this.conversation.title || '';
      const p = this.partner;
      if (!p) return '';
      return peerDisplayName(p, this.contactNameByUserId?.[Number(p.id)]);
    },
    communitySubtitle() {
      if (!this.isCommunity) return null;
      const count = this.conversation.member_count || 0;
      if (this.isChannel) return this.$t('messenger.subscribersCount', { count });
      return this.$t('messenger.membersCount', { count });
    },
    searchHighlightQuery() {
      return this.searchMode ? (this.searchActiveQuery || '').trim() : '';
    },
    searchCurrentId() {
      if (!this.searchMode || !this.searchResults.length) return null;
      return this.searchResults[this.searchIndex]?.id ?? null;
    },
    searchMinChars() {
      return SEARCH_MIN_CHARS;
    },
    chatSearchMeetsMin() {
      return meetsSearchMin(this.searchQuery);
    },
    initials() {
      return avatarInitials(this.partner);
    },
    grouped() {
      // Store already keeps chronological order; re-sort as a safety net.
      const list = [...(this.messages || [])].sort(compareMessages);
      return this.groupMessages(list, true);
    },
    msgMenuItems() {
      const m = this.msgMenu.message;
      if (!m) return [];
      // Failed / stuck-pending optimistic messages: only retry or discard locally.
      if (m.failed || (m.pending && this.isStalePending(m))) {
        const albumFail = Array.isArray(this.msgMenu.albumMessages) && this.msgMenu.albumMessages.length > 1;
        return [
          { label: this.$t('messenger.retry'), icon: 'retry', value: 'retry-failed' },
          {
            label: albumFail ? this.$t('messenger.deleteAlbum') : this.$t('messenger.delete'),
            icon: 'trash',
            value: 'delete-failed',
            danger: true,
          },
        ];
      }

      const mine = Number(m.user_id) === Number(this.meId);
      const sticker = isStickerMessage(m);
      const media = isMediaType(m.type);
      const location = m.type === 'location';
      const voiceOrAudio = m.type === 'voice' || m.type === 'audio';
      const album = Array.isArray(this.msgMenu.albumMessageIds) && this.msgMenu.albumMessageIds.length > 1;
      // Copy only for plain text / location — never stickers, media, voice, or files.
      const canCopy = !sticker && !media && !album && (m.type === 'text' || location);
      // Stickers never download; other media/files/voice can when a URL exists.
      const mediaUrl = m.meta?.url || m.meta?.local_url || m.meta?.cdn_url;
      const canDownload = !sticker && media && !!mediaUrl;
      // Caption edit only for non-sticker photo/video/file (not voice/audio/location).
      const canEditCaption = media && !sticker && !voiceOrAudio;
      const canEditText = m.type === 'text';

      const items = [];
      if (!this.isChannel) {
        items.push({ label: this.$t('messenger.reply'), icon: 'reply', value: 'reply' });
      }

      // Sticker: open pack (Telegram-style) instead of copy/download.
      if (sticker && (m.meta?.sticker_pack_id || m.meta?.sticker_id)) {
        items.push({
          label: this.$t('messenger.stickerShowPack'),
          icon: 'star',
          value: 'view-sticker-pack',
        });
      }

      if (canCopy) {
        items.push({ label: this.$t('messenger.copy'), icon: 'copy', value: 'copy' });
      }

      if (this.canMessengerFeature('forward')) {
        items.push({ label: this.$t('messenger.forward'), icon: 'forward', value: 'forward' });
      }
      items.push({ label: this.$t('messenger.select'), icon: 'select', value: 'select' });
      if (this.canMessengerFeature('saved_messages') && !this.isSaved) {
        items.push({ label: this.$t('messenger.save'), icon: 'bookmark', value: 'save' });
      }
      if (canDownload) {
        items.push({ label: this.$t('messenger.download'), icon: 'download', value: 'download' });
      }
      // Add GIF to local library (Telegram-style "Add GIF") — not for stickers.
      if (!sticker && isAnimationMessage(m) && mediaUrl) {
        const sourceKey = `msg:${m.id || m.client_id || mediaUrl}`;
        if (!isGifSaved(sourceKey)) {
          items.push({ label: this.$t('messenger.addGif'), icon: 'gif', value: 'add-gif' });
        }
      }
      if (this.canMessengerFeature('pin_messages') && !m.deleted_at) {
        if (this.isPinned(m.id)) {
          items.push({ label: this.$t('messenger.unpin'), icon: 'unpin', value: 'unpin' });
        } else {
          items.push({ label: this.$t('messenger.pin'), icon: 'pin', value: 'pin' });
        }
      }
      if (mine && !m.deleted_at) {
        const canEdit = this.canMessengerFeature('edit_messages')
          && this.isWithinEditWindow(m)
          && (canEditText || canEditCaption);
        const canDelete = this.canMessengerFeature('delete_messages');
        if (canEdit || canDelete) {
          items.push({ divider: true });
        }
        if (canEdit) {
          const editLabel = canEditCaption
            ? this.$t('messenger.editCaption')
            : this.$t('messenger.edit');
          items.push({ label: editLabel, icon: 'edit', value: 'edit' });
        }
        if (canDelete) {
          const albumIds = this.msgMenu.albumMessageIds;
          const deleteLabel = (Array.isArray(albumIds) && albumIds.length > 1)
            ? this.$t('messenger.deleteAlbum')
            : this.$t('messenger.delete');
          items.push({ label: deleteLabel, icon: 'trash', value: 'delete', danger: true });
        }
      } else if (!mine && !m.deleted_at && this.canDeleteOthersMessages) {
        items.push({ divider: true });
        const albumIds = this.msgMenu.albumMessageIds;
        const deleteLabel = (Array.isArray(albumIds) && albumIds.length > 1)
          ? this.$t('messenger.deleteAlbum')
          : this.$t('messenger.delete');
        items.push({ label: deleteLabel, icon: 'trash', value: 'delete', danger: true });
      }
      // Info header: read receipt (my messages) + edited timestamp.
      const info = [];
      if (mine && m.read_at) {
        info.push({ header: true, icon: 'doubleCheck', label: this.$t('messenger.readAt', { time: this.formatStamp(m.read_at) }) });
      }
      if (m.edited_at) {
        info.push({ header: true, icon: 'editClock', label: this.$t('messenger.editedAt', { time: this.formatStamp(m.edited_at) }) });
      }
      if (info.length) {
        info.push({ divider: true });
        items.unshift(...info);
      }
      return items;
    },
    inputFormatMenuItems() {
      return [
        { label: this.$t('messenger.formatBold'), icon: 'bold', value: 'fmt-bold', trailing: '**' },
        { label: this.$t('messenger.formatItalic'), icon: 'italic', value: 'fmt-italic', trailing: '*' },
        { label: this.$t('messenger.formatUnderline'), icon: 'underline', value: 'fmt-underline', trailing: '__' },
        { label: this.$t('messenger.formatSuperscript'), icon: 'superscript', value: 'fmt-superscript', trailing: '^^' },
        { label: this.$t('messenger.formatSubscript'), icon: 'subscript', value: 'fmt-subscript', trailing: ',,' },
      ];
    },
    /** Empty → follow UI locale; while typing → first strong letter (Telegram). */
    composerDir() {
      const t = String(this.text || '');
      for (let i = 0; i < t.length; i += 1) {
        const code = t.codePointAt(i);
        if (code > 0xffff) i += 1;
        if (
          (code >= 0x0590 && code <= 0x05FF)
          || (code >= 0x0600 && code <= 0x06FF)
          || (code >= 0x0750 && code <= 0x077F)
          || (code >= 0x08A0 && code <= 0x08FF)
          || (code >= 0xFB50 && code <= 0xFDFF)
          || (code >= 0xFE70 && code <= 0xFEFF)
        ) return 'rtl';
        if (
          (code >= 0x0041 && code <= 0x005A)
          || (code >= 0x0061 && code <= 0x007A)
          || (code >= 0x00C0 && code <= 0x024F)
          || (code >= 0x0400 && code <= 0x04FF)
        ) return 'ltr';
      }
      const loc = String(this.$i18n?.locale || 'fa').toLowerCase();
      if (loc.startsWith('fa') || loc.startsWith('ar') || loc.startsWith('he') || loc.startsWith('ur')) {
        return 'rtl';
      }
      return 'ltr';
    },
    composerInputStyle() {
      // Keep caret + placeholder on the logical start edge for the active dir.
      return { direction: this.composerDir, textAlign: 'start' };
    },
    composerFormatBarVisible() {
      if (this.voiceRecording) return false;
      if (this.inputMenu.visible) return true;
      if (!this.composerFocused) return false;
      return this.inputSel.start !== this.inputSel.end;
    },
    /** First grapheme if emoji → matching stickers for glass suggest strip. */
    emojiStickerSuggestions() {
      const first = this.firstComposerGrapheme;
      if (!first || !this.isEmojiGrapheme(first)) return [];
      return findStickersByEmoji(first);
    },
    /**
     * Stay open while composer has exactly one emoji grapheme (Telegram-like).
     * Closes only when: input cleared, a 2nd+ character is typed, or a suggested sticker is sent.
     */
    showStickerSuggestOverlay() {
      if (this.voiceRecording || this.editingMessage) return false;
      if (!this.emojiStickerSuggestions.length) return false;
      const parts = this.composerContentGraphemes;
      if (parts.length !== 1) return false;
      return this.isEmojiGrapheme(parts[0]);
    },
    /** Non-whitespace graphemes in the composer (for suggest open/close). */
    composerContentGraphemes() {
      const s = String(this.text || '').replace(/\s+/g, '');
      if (!s) return [];
      try {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          return [...seg.segment(s)].map((p) => p.segment).filter(Boolean);
        }
      } catch (e) { /* noop */ }
      return [...s];
    },
    firstComposerGrapheme() {
      const parts = this.composerContentGraphemes;
      return parts[0] || '';
    },
    /** Stable seed so each chat keeps one greeting variant. */
    emptyGreetingSeed() {
      const c = this.conversation;
      if (!c) return '0';
      if (c.id && c.id !== 'draft') return c.id;
      const partner = c.partner || conversationPartner(c, this.meId);
      if (partner?.id) return `u:${partner.id}`;
      if (c.title) return `t:${c.title}`;
      return 'draft';
    },
  },
  watch: {
    bootLoading(val, prev) {
      // Skeleton → first real chat: skip the rise animation (reads as flicker).
      if (prev && !val) this.skipNextOpenAnim = true;
    },
    emojiSidebarOpen(open) {
      if (open) {
        this.clearEmojiHoverTimers();
        this.emojiHoverOpen = false;
      }
    },
    messages(newMsgs) {
      this.onMessagesChange(newMsgs || []);
      this.recordChannelViews(newMsgs || []);
      this.maybeStopUploadPulse();
      // Close photo/video lightbox if the open message was deleted.
      const mid = this.mediaViewer?.message?.id;
      if (this.mediaViewer?.open && mid != null) {
        const stillThere = (newMsgs || []).some((m) => String(m.id) === String(mid)
          || (m.client_id != null && String(m.client_id) === String(mid)));
        if (!stillThere) this.closeMediaViewer();
      }
    },
    // Reset the bar cursor to the newest pin whenever the pin set changes.
    pinnedCount() {
      this.pinCursor = this.pinnedCount ? this.pinnedCount - 1 : 0;
      this.pinBarJumped = false;
      if (this.pinnedCount < 2 && this.pinnedSheetOpen) this.pinnedSheetOpen = false;
    },
    conversation(newConv, oldConv) {
      // Only reset composer/UI when switching chats — UPSERT after create
      // refreshes the same conversation object and must not wipe typed text.
      // Do not stopMediaPlayer here — mini player persists across chats until X.
      if (newConv?.id === oldConv?.id) return;
      // Draft → real promote is the same chat: keep scroll, composer, bubbles.
      if (oldConv?.id === 'draft' && newConv?.id && newConv.id !== 'draft') {
        this.chatOpening = false;
        if (this.chatOpenTimer) {
          clearTimeout(this.chatOpenTimer);
          this.chatOpenTimer = null;
        }
        return;
      }
      this.stopActivityPulse();
      if (oldConv?.id && oldConv.id !== 'draft') {
        this.persistDraft(oldConv.id, this.text);
      }
      this.pinCursor = this.pinnedCount ? this.pinnedCount - 1 : 0;
      this.pinBarJumped = false;
      this.pinnedSheetOpen = false;
      this.pinChoice = { open: false, message: null, forEveryone: false };
      this.text = (newConv?.id && newConv.id !== 'draft')
        ? (this.draftForConversation(newConv.id) || '')
        : '';
      this.editingMessage = null;
      this.showMenu = false;
      this.exitSearchMode({ focusComposer: false });
      this.closeEmojiPanel();
      this.composerInputMode = 'none';
      this.keyboardOpen = false;
      this.pendingKeyboardInset = false;
      this.surfaceTransition = null;
      this.clearComposerFocusTimers();
      this.viewedIds = {};
      this.$store.commit('messenger/CLEAR_SELECTION');
      this.$store.commit('messenger/SET_REPLY', null);
      const skipOpenAnim = this.skipNextOpenAnim;
      this.skipNextOpenAnim = false;
      if (newConv?.id && animationsEnabled() && !skipOpenAnim) {
        this.chatOpening = false;
        if (this.chatOpenTimer) clearTimeout(this.chatOpenTimer);
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            this.chatOpening = true;
            this.chatOpenTimer = setTimeout(() => {
              this.chatOpening = false;
              this.chatOpenTimer = null;
            }, 280);
          });
        });
      } else {
        this.chatOpening = false;
        if (this.chatOpenTimer) {
          clearTimeout(this.chatOpenTimer);
          this.chatOpenTimer = null;
        }
      }
      // Keep soft keyboard closed on touch devices when entering a chat
      // (especially after a forward pick). Desktop still focuses the composer.
      this.$nextTick(() => {
        if (this.isCoarsePointer()) this.blurComposer();
        else this.focusInput();
        this.autoResize();
      });
    },
    text(val) {
      const cid = this.conversation?.id;
      if (!cid || cid === 'draft' || this.editingMessage) return;
      if (this.draftTimer) clearTimeout(this.draftTimer);
      this.draftTimer = setTimeout(() => {
        this.persistDraft(cid, val);
      }, 350);
    },
    voiceRecording(active) {
      if (active) {
        this.clearTypingIdleTimer();
        this.startActivityPulse('recording_voice');
      } else if (this.activityPulseKind === 'recording_voice') {
        // Prefer resuming an in-flight upload over a blank status.
        if (this.hasPendingMineUpload()) this.resumeUploadPulseIfNeeded();
        else this.stopActivityPulse();
      }
    },
    composerLift(active) {
      this.$emit('composer-lift', !!active);
    },
    forwardMenuOpen(open) {
      if (open) {
        this.$nextTick(() => this.positionForwardMenu());
        window.addEventListener('resize', this.positionForwardMenu);
        window.addEventListener('scroll', this.positionForwardMenu, true);
      } else {
        window.removeEventListener('resize', this.positionForwardMenu);
        window.removeEventListener('scroll', this.positionForwardMenu, true);
        this.scheduleComposerFocus({ openKeyboard: false });
      }
    },
    showMenu(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    'msgMenu.visible'(open) {
      // Opening the menu must never re-focus (that pops the soft keyboard).
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    'attachSheet.open'(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    'pinChoice.open'(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    pinnedSheetOpen(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    keyboardOpen(open) {
      if (!open) return;
      this.pinScrollToBottomForKeyboard();
    },
    'mediaCompose.open'(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    'mediaViewer.open'(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    'locationSheet.open'(open) {
      if (!open) this.scheduleComposerFocus({ openKeyboard: false });
    },
    selectionMode(on) {
      if (!on) this.scheduleComposerFocus({ openKeyboard: false });
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('pointerdown', this.onDocPointerDown, true);
    this.bindDesktopSplitMq();
    this.loadEmojiPanelHeight();
    if (this.conversation) {
      this.onMessagesChange(this.messages || []);
      this.recordChannelViews(this.messages || []);
    }
    this.$nextTick(() => this.autoResize());
    if (!this.isMobileEmojiMode) this.emojiHoverMounted = true;
    this.lockClockTimer = setInterval(() => {
      this.lockClock = Date.now();
    }, 15000);
    if (this.composerLift) this.$emit('composer-lift', true);
  },
  beforeUnmount() {
    this.unbindDesktopSplitMq();
    window.removeEventListener('resize', this.positionForwardMenu);
    window.removeEventListener('scroll', this.positionForwardMenu, true);
    this.$emit('composer-lift', false);
    if (this.conversation?.id && this.conversation.id !== 'draft') {
      this.persistDraft(this.conversation.id, this.text);
    }
    if (this.draftTimer) clearTimeout(this.draftTimer);
    if (this.chatOpenTimer) clearTimeout(this.chatOpenTimer);
    this.clearInsetFallback();
    this.pendingKeyboardInset = false;
    this.surfaceTransition = null;
    this.$emit('accessory-change', null);
    // Keep media playing when leaving a chat view; MessengerPage stops on exit.
    document.removeEventListener('click', this.onDocClick);
    document.removeEventListener('pointerdown', this.onDocPointerDown, true);
    if (this._composerFocusTimers) {
      this._composerFocusTimers.forEach((id) => clearTimeout(id));
      this._composerFocusTimers = null;
    }
    this.clearEmojiHoverTimers();
    this.emojiHoverOpen = false;
    if (this.loadMoreWatchdog) clearTimeout(this.loadMoreWatchdog);
    if (this.lockClockTimer) clearInterval(this.lockClockTimer);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.stopActivityPulse();
    this.clearTypingIdleTimer();
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
    this.teardownVoice(true);
    this.closeMediaCompose();
  },
  methods: {
    ...mapActions('messenger', ['setDraftText', 'clearDraftText']),
    menuIconPaths,
    /** Match backend: edit_window_minutes <= 0 means unlimited. */
    isWithinEditWindow(message) {
      const minutes = Number(this.messengerLimits?.edit_window_minutes) || 0;
      if (minutes <= 0) return true;
      const created = message?.created_at ? new Date(message.created_at).getTime() : NaN;
      if (!Number.isFinite(created)) return true;
      return (Date.now() - created) <= minutes * 60 * 1000;
    },
    bindDesktopSplitMq() {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      this._desktopMq = window.matchMedia('(min-width: 1024px)');
      this._onDesktopMq = () => {
        this.isDesktopSplit = !!this._desktopMq.matches;
      };
      this._onDesktopMq();
      if (this._desktopMq.addEventListener) {
        this._desktopMq.addEventListener('change', this._onDesktopMq);
      } else if (this._desktopMq.addListener) {
        this._desktopMq.addListener(this._onDesktopMq);
      }
    },
    unbindDesktopSplitMq() {
      if (!this._desktopMq || !this._onDesktopMq) return;
      if (this._desktopMq.removeEventListener) {
        this._desktopMq.removeEventListener('change', this._onDesktopMq);
      } else if (this._desktopMq.removeListener) {
        this._desktopMq.removeListener(this._onDesktopMq);
      }
      this._desktopMq = null;
      this._onDesktopMq = null;
    },
    clearTypingIdleTimer() {
      if (this.typingIdleTimer) {
        clearTimeout(this.typingIdleTimer);
        this.typingIdleTimer = null;
      }
    },
    clearActivityInterval() {
      if (this.activityPulseTimer) {
        clearInterval(this.activityPulseTimer);
        this.activityPulseTimer = null;
      }
    },
    hasPendingMineUpload() {
      return (this.messages || []).some((m) => {
        if (!m || !m.pending || m.failed) return false;
        if (!this.isMineMessage(m)) return false;
        const t = m.type;
        return t === 'photo' || t === 'video' || t === 'audio' || t === 'voice' || t === 'file';
      });
    },
    inferUploadActivityFromMessages() {
      const pending = (this.messages || []).filter((m) => {
        if (!m || !m.pending || m.failed) return false;
        if (!this.isMineMessage(m)) return false;
        const t = m.type;
        return t === 'photo' || t === 'video' || t === 'audio' || t === 'voice' || t === 'file';
      });
      if (!pending.length) return null;
      // Prefer the newest pending item's type.
      const last = pending[pending.length - 1];
      return this.mediaUploadActivity(last.type);
    },
    startActivityPulse(activity = 'typing') {
      const kind = activity || 'typing';
      if (kind.startsWith('uploading_')) this.uploadPulseKind = kind;
      if (this.activityPulseKind === kind && (kind === 'typing' || this.activityPulseTimer)) {
        this.$emit('typing', kind);
        return;
      }
      this.clearActivityInterval();
      this.activityPulseKind = kind;
      const beat = () => this.$emit('typing', kind);
      beat();
      // Continuous heartbeats for recording / uploading — typing is idle-based.
      if (kind !== 'typing') {
        this.activityPulseTimer = setInterval(beat, 2500);
      }
    },
    stopActivityPulse() {
      this.clearActivityInterval();
      this.activityPulseKind = null;
      this.uploadPulseKind = null;
      this.clearTypingIdleTimer();
      if (this.uploadPulseWatch) {
        clearTimeout(this.uploadPulseWatch);
        this.uploadPulseWatch = null;
      }
    },
    mediaUploadActivity(type) {
      if (type === 'photo') return 'uploading_photo';
      if (type === 'video') return 'uploading_video';
      if (type === 'audio' || type === 'voice') return 'uploading_audio';
      return 'uploading_file';
    },
    /** True while the composer is actively advertising "typing" (idle timer running). */
    isTypingForeground() {
      return this.activityPulseKind === 'typing' && !!this.typingIdleTimer;
    },
    pulseUploadActivity(type) {
      const kind = this.mediaUploadActivity(type);
      this.uploadPulseKind = kind;
      // Safety stop if upload never resolves (peer also clears on message.new).
      if (this.uploadPulseWatch) clearTimeout(this.uploadPulseWatch);
      this.uploadPulseWatch = setTimeout(() => {
        this.uploadPulseWatch = null;
        if (this.uploadPulseKind === kind && !this.hasPendingMineUpload()) {
          this.uploadPulseKind = null;
          if (this.activityPulseKind === kind) this.stopActivityPulse();
        }
      }, 20000);
      // Don't steal the status bar while the user is typing a follow-up message.
      if (this.voiceRecording || this.isTypingForeground()) {
        this.$nextTick(() => this.maybeStopUploadPulse());
        return;
      }
      this.startActivityPulse(kind);
      this.$nextTick(() => this.maybeStopUploadPulse());
    },
    /** After typing pauses / text is sent, show upload status again if still pending. */
    resumeUploadPulseIfNeeded() {
      if (this.voiceRecording) return;
      if (!this.hasPendingMineUpload()) {
        this.uploadPulseKind = null;
        if (this.activityPulseKind && String(this.activityPulseKind).startsWith('uploading_')) {
          this.clearActivityInterval();
          this.activityPulseKind = null;
        }
        return;
      }
      const kind = this.uploadPulseKind || this.inferUploadActivityFromMessages();
      if (!kind) return;
      this.startActivityPulse(kind);
    },
    maybeStopUploadPulse() {
      if (this.hasPendingMineUpload()) return;
      const wasUpload = !!(this.uploadPulseKind
        || (this.activityPulseKind && String(this.activityPulseKind).startsWith('uploading_')));
      this.uploadPulseKind = null;
      if (this.uploadPulseWatch) {
        clearTimeout(this.uploadPulseWatch);
        this.uploadPulseWatch = null;
      }
      if (this.activityPulseKind && String(this.activityPulseKind).startsWith('uploading_')) {
        this.clearActivityInterval();
        this.activityPulseKind = null;
      }
      // Upload finished while still composing → keep advertising typing.
      if (wasUpload && (this.text || '').trim() && !this.voiceRecording && !this.editingMessage) {
        this.$emit('typing', 'typing');
        this.activityPulseKind = 'typing';
        this.armTypingIdleResume();
      }
    },
    armTypingIdleResume() {
      this.clearTypingIdleTimer();
      // Slightly under peer typing clear (~3.2s) so upload status returns smoothly.
      this.typingIdleTimer = setTimeout(() => {
        this.typingIdleTimer = null;
        if (this.voiceRecording) return;
        if (this.hasPendingMineUpload()) {
          // Pause ended → fall back to "sending photo/video…" like Telegram.
          this.resumeUploadPulseIfNeeded();
        } else if (this.activityPulseKind === 'typing') {
          this.activityPulseKind = null;
        }
      }, 2600);
    },

    persistDraft(conversationId, text) {
      this.setDraftText({ conversationId, text: text || '' });
    },
    // Build a date-separated, author-grouped render list from a message array.
    // Used by both the chat list (`grouped`) and the pinned sheet
    // (`pinnedGrouped`). `withUnread` adds the "new messages" divider.
    groupMessages(raw, withUnread) {
      const out = [];
      let lastDate = null;
      let i = 0;
      while (i < raw.length) {
        const m = raw[i];
        if (m.type === 'system') {
          const d = m.created_at ? new Date(m.created_at) : null;
          const dayKey = d ? d.toDateString() : '';
          if (dayKey !== lastDate) {
            lastDate = dayKey;
            out.push({ type: 'date', key: 'd' + dayKey, label: this.dateLabel(d) });
          }
          out.push({ type: 'system', key: 's' + m.id, message: m });
          i++;
          continue;
        }
        const d = m.created_at ? new Date(m.created_at) : null;
        const dayKey = d ? d.toDateString() : '';
        if (dayKey !== lastDate) {
          lastDate = dayKey;
          out.push({ type: 'date', key: 'd' + dayKey, label: this.dateLabel(d) });
        }
        if (withUnread && this.firstUnreadId && m.id === this.firstUnreadId) {
          out.push({ type: 'newdivider', key: 'nd' });
        }

        // Telegram-style media album: same album_id photo/video from one author.
        // Skip over interleaved non-visuals (file/audio) so a mixed batch still
        // renders as one grid; those skipped messages are emitted afterward.
        const albumId = m?.meta?.album_id;
        if (albumId && (m.type === 'photo' || m.type === 'video')) {
          const albumMsgs = [m];
          const skipped = [];
          let aj = i + 1;
          while (aj < raw.length) {
            const n = raw[aj];
            if (!n || n.type === 'system') break;
            if (this.authorKey(n) !== this.authorKey(m)) break;
            if (n.type === 'photo' || n.type === 'video') {
              if (String(n.meta?.album_id || '') !== String(albumId)) break;
              albumMsgs.push(n);
              aj++;
              continue;
            }
            // Non-visual from same author — hold aside and keep scanning album.
            // Stop if another album starts after this gap (peek).
            let peek = aj + 1;
            let sawSameAlbum = false;
            while (peek < raw.length) {
              const p = raw[peek];
              if (!p || p.type === 'system') break;
              if (this.authorKey(p) !== this.authorKey(m)) break;
              if (p.type === 'photo' || p.type === 'video') {
                sawSameAlbum = String(p.meta?.album_id || '') === String(albumId);
                break;
              }
              peek++;
            }
            if (!sawSameAlbum) break;
            skipped.push(n);
            aj++;
          }
          if (albumMsgs.length > 1 || Number(m.meta?.album_count) > 1) {
            const isMine = this.isMineMessage(m);
            // Expand to album_count slots so the recipient sees a Telegram-style
            // reserved grid while later items are still uploading/arriving.
            const expected = Math.max(
              albumMsgs.length,
              ...albumMsgs.map((x) => Number(x?.meta?.album_count) || 0),
              Number(m.meta?.album_count) || 0,
            );
            const byIndex = new Map();
            albumMsgs.forEach((am, idx) => {
              const ai = Number(am?.meta?.album_index);
              byIndex.set(Number.isFinite(ai) ? ai : idx, am);
            });
            const shellMsgs = [];
            for (let si = 0; si < expected; si += 1) {
              if (byIndex.has(si)) {
                shellMsgs.push(byIndex.get(si));
              } else {
                shellMsgs.push({
                  id: `albph_${albumId}_${si}`,
                  client_id: `albph_${albumId}_${si}`,
                  conversation_id: m.conversation_id,
                  user_id: m.user_id,
                  type: 'photo',
                  body: '',
                  pending: true,
                  failed: false,
                  created_at: m.created_at,
                  meta: {
                    album_id: albumId,
                    album_index: si,
                    album_count: expected,
                    _album_placeholder: true,
                  },
                });
              }
            }
            // Preserve any out-of-range arrivals after the reserved slots.
            albumMsgs.forEach((am, idx) => {
              const ai = Number(am?.meta?.album_index);
              const key = Number.isFinite(ai) ? ai : idx;
              if (key < 0 || key >= expected) shellMsgs.push(am);
            });
            out.push({
              type: 'album',
              // Stable key: album_id alone — never flip when first bubble settles
              // (client_id → server id), which remounted and blanked media.
              key: 'a' + albumId,
              messages: shellMsgs,
              groupPos: 'single',
              tight: false,
              showAvatar: !this.isChannel && !isMine,
              isMine,
              avatarUser: this.isChannel ? null : this.avatarUserFor(m),
              pinned: albumMsgs.some((x) => this.isPinned(x.id)),
            });
            // Re-emit interleaved files/docs after the album bubble.
            skipped.forEach((msg) => {
              const isMineSkip = this.isMineMessage(msg);
              out.push({
                type: 'msg',
                key: 'm' + (msg.client_id || msg.id),
                message: msg,
                groupPos: 'single',
                tight: false,
                showAvatar: !this.isChannel && !isMineSkip,
                isMine: isMineSkip,
                avatarUser: this.isChannel ? null : this.avatarUserFor(msg),
                pinned: this.isPinned(msg.id),
              });
            });
            i = aj;
            continue;
          }
        }

        const batch = [m];
        let j = i + 1;
        while (j < raw.length) {
          const n = raw[j];
          if (n.type === 'system') break;
          if (this.authorKey(n) !== this.authorKey(m)) break;
          // Don't pull the start of another album into a text/media cluster.
          if (n.meta?.album_id && (n.type === 'photo' || n.type === 'video')) {
            const sameAlbum = String(n.meta.album_id) === String(m.meta?.album_id || '');
            if (!sameAlbum) break;
          }
          const prev = batch[batch.length - 1];
          const tPrev = prev.created_at ? new Date(prev.created_at).getTime() : 0;
          const tNext = n.created_at ? new Date(n.created_at).getTime() : 0;
          if (!tPrev || !tNext || Math.abs(tNext - tPrev) > 60000) break;
          batch.push(n);
          j++;
        }

        batch.forEach((msg, idx) => {
          let groupPos = 'single';
          if (batch.length > 1) {
            if (idx === 0) groupPos = 'first';
            else if (idx === batch.length - 1) groupPos = 'last';
            else groupPos = 'middle';
          }
          const isMine = this.isMineMessage(msg);
          const tight = groupPos === 'middle' || groupPos === 'last';
          const showAvatar = !this.isChannel && (groupPos === 'last' || groupPos === 'single');
          out.push({
            type: 'msg',
            // Prefer client_id so settle (c_… → server id) does not remount the bubble.
            key: 'm' + (msg.client_id || msg.id),
            message: msg,
            groupPos,
            tight,
            showAvatar,
            isMine,
            avatarUser: this.isChannel ? null : this.avatarUserFor(msg),
            pinned: this.isPinned(msg.id),
          });
        });
        i = j;
      }
      return out;
    },
    // In Saved Messages every row belongs to me, so use the original author
    // (forwarded_from) to decide the side and grouping; elsewhere it's the sender.
    isMineMessage(m) {
      if (this.isSaved) {
        if (m.forwarded_from && m.forwarded_from.id && m.forwarded_from.id !== this.meId) return false;
        return true;
      }
      return Number(m.user_id) === Number(this.meId);
    },
    isStalePending(m) {
      if (!m?.pending) return false;
      const t = Date.parse(m.created_at || '');
      if (!Number.isFinite(t)) return true;
      return (Date.now() - t) > 20000;
    },
    authorKey(m) {
      if (this.isSaved && m.forwarded_from && m.forwarded_from.id && m.forwarded_from.id !== this.meId) {
        return 'f' + m.forwarded_from.id;
      }
      return 'u' + m.user_id;
    },
    avatarUserFor(m) {
      if (this.isMineMessage(m)) return this.meUser || this.partner;
      if (this.isSaved && m.forwarded_from) return m.forwarded_from;
      if (this.isCommunity && m.user) return m.user;
      return this.partner;
    },
    dateLabel(d) {
      if (!d) return '';
      const now = new Date();
      const today = now.toDateString();
      const yesterday = new Date(now.getTime() - 86400000).toDateString();
      if (d.toDateString() === today) return this.$t('messenger.today');
      if (d.toDateString() === yesterday) return this.$t('messenger.yesterday');
      return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    formatPreview(bodyOrMsg) {
      if (bodyOrMsg && typeof bodyOrMsg === 'object') {
        const m = bodyOrMsg;
        // Prefer decrypted bubble from the open chat when the pin snapshot is locked.
        let view = m;
        if (
          m.id != null
          && (m._e2e_locked || (m.is_encrypted && !m._e2e_decrypted)
            || (m.body && /^[A-Za-z0-9+/=\s]{24,}$/.test(String(m.body).trim())))
        ) {
          const local = (this.messages || []).find((x) => Number(x.id) === Number(m.id));
          if (local && local._e2e_decrypted && !local._e2e_locked) view = local;
        }
        if (isStickerMessage(view)) {
          return this.$t('messenger.mediaSticker');
        }
        if (view.type === 'location') return this.$t('messenger.location');
        if (isMediaType(view.type)) {
          const raw = stripFormatMarkers(view.body || '').trim();
          const locked = view._e2e_locked
            || (view.is_encrypted && !view._e2e_decrypted)
            || (raw && /^[A-Za-z0-9+/=\s]{24,}$/.test(raw));
          if (locked) return this.$t(mediaTypeLabelKey(view.type));
          return raw || this.$t(mediaTypeLabelKey(view.type));
        }
        const body = stripFormatMarkers(view.body || '').trim();
        if (
          view._e2e_locked
          || (view.is_encrypted && !view._e2e_decrypted)
          || (body && /^[A-Za-z0-9+/=\s]{24,}$/.test(body))
        ) {
          return '…';
        }
        return body;
      }
      return stripFormatMarkers(bodyOrMsg || '');
    },
    /** Pin bar subtitle — stickers show label only (emoji/icon rendered beside). */
    formatPinBarPreview(m) {
      if (!m) return '';
      if (isStickerMessage(m)) return this.$t('messenger.mediaSticker');
      return this.formatPreview(m);
    },
    isMediaType,
    onKeydown(e) {
      // Formatting shortcuts (Ctrl/Cmd + B / I / U).
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey) {
        const k = String(e.key || '').toLowerCase();
        if (k === 'b') {
          e.preventDefault();
          this.snapshotInputSelection();
          this.applyComposerFormat('bold');
          return;
        }
        if (k === 'i') {
          e.preventDefault();
          this.snapshotInputSelection();
          this.applyComposerFormat('italic');
          return;
        }
        if (k === 'u') {
          e.preventDefault();
          this.snapshotInputSelection();
          this.applyComposerFormat('underline');
          return;
        }
      }

      if (e.key !== 'Enter') return;
      const enterSends = this.settings.enter_to_send;
      if (enterSends && !e.shiftKey) {
        e.preventDefault();
        this.send();
      } else if (!enterSends && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.send();
      }
    },
    snapshotInputSelection() {
      const el = this.$refs.input;
      if (!el) {
        this.inputSel = { start: 0, end: 0 };
        return;
      }
      this.inputSel = {
        start: el.selectionStart ?? 0,
        end: el.selectionEnd ?? 0,
      };
    },
    restoreInputSelection(start, end) {
      this.$nextTick(() => {
        const el = this.$refs.input;
        if (!el) return;
        try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
        const s = Math.max(0, start);
        const e = Math.max(s, end);
        el.setSelectionRange(s, e);
        this.inputSel = { start: s, end: e };
        this.composerFocused = true;
      });
    },
    onComposerSelect() {
      this.snapshotInputSelection();
    },
    openFormatMoreMenu() {
      this.snapshotInputSelection();
      if (this.inputSel.start === this.inputSel.end) return;
      const btn = this.$refs.fmtMoreBtn;
      let x = 0;
      let y = 0;
      if (btn && typeof btn.getBoundingClientRect === 'function') {
        const r = btn.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight * 0.7;
      }
      this.inputMenu = { visible: true, x, y, mode: 'format' };
    },
    closeInputMenu() {
      this.inputMenu.visible = false;
      this.scheduleComposerFocus({ openKeyboard: false });
    },
    async onInputMenuSelect(item) {
      if (!item || item.disabled) return;
      const value = item.value;
      if (String(value).startsWith('fmt-')) {
        const kind = String(value).slice(4);
        this.applyComposerFormat(kind);
      }
      this.closeInputMenu();
    },
    applyComposerFormat(kind) {
      const { start, end } = this.inputSel;
      const result = applyFormatMarker(this.text || '', start, end, kind);
      this.text = result.text;
      this.restoreInputSelection(result.start, result.end);
      this.$nextTick(() => this.autoResize());
      this.onTyping();
    },
    async onComposerPaste(e) {
      const files = Array.from(e?.clipboardData?.files || []);
      if (!files.length) return;
      e.preventDefault();
      await this.openFilesComposer(files, { forceFile: false });
    },
    send() {
      // Always allow send while a prior media upload is in flight (Telegram-like).
      // Store uses a separate text lane; do not gate on the `sending` prop.
      if (this.pendingForward) {
        const caption = this.text.trim();
        this.$emit('confirm-forward', {
          messageIds: this.pendingForward.messageIds,
          dropAuthor: !!this.pendingForward.dropAuthor,
          caption: caption || null,
        });
        this.text = '';
        if (this.conversation?.id && this.conversation.id !== 'draft') {
          this.clearDraftText(this.conversation.id);
        }
        this.clearTypingIdleTimer();
        this.$nextTick(() => {
          this.autoResize();
          this.resumeUploadPulseIfNeeded();
          this.keepComposerTypingFocus();
        });
        return;
      }
      const body = this.text.trim();
      const editingMedia = this.editingMessage && isMediaType(this.editingMessage.type);
      if (!body && !editingMedia) return;
      if (this.editingMessage) {
        this.$emit('edit', { messageId: this.editingMessage.id, body });
        this.editingMessage = null;
      } else {
        const chunks = this.splitForSend(body);
        // One chunk → keep the plain-string payload; many → send an array.
        this.$emit('send', chunks.length > 1 ? chunks : chunks[0]);
        // Our own send should always snap to the latest message.
        this.atBottom = true;
      }
      this.text = '';
      if (this.conversation?.id && this.conversation.id !== 'draft') {
        this.clearDraftText(this.conversation.id);
      }
      this.clearTypingIdleTimer();
      // Text sent while media still uploads → fall back to "sending photo/video…".
      // Keep soft keyboard open — never blur/refocus cycle after send.
      this.$nextTick(() => {
        this.autoResize();
        this.resumeUploadPulseIfNeeded();
        this.keepComposerTypingFocus();
      });
    },
    onComposerActionPointerDown(e) {
      if (e.button != null && e.button !== 0) return;
      // Prevent the button from stealing focus (keeps soft keyboard / caret stable).
      e.preventDefault();
      if (!this.composerHasContent) {
        this.onVoiceMicDown(e);
      }
    },
    onComposerSendClick() {
      if (this.isComposerUiClickSuppressed()) return;
      if (!this.composerHasContent) return;
      this.send();
    },
    onEmojiBtnPointerDown() {
      // Snapshot caret before the button can steal focus.
      this.snapshotInputSelection();
      this.clearComposerFocusTimers();
      this._emojiToggleFromPointer = false;
      if (!this.isMobileEmojiMode) {
        if (!this.emojiOpen) this.composerInputMode = 'none';
        return;
      }
      // Keyboard → panel MUST open in pointerdown. Changing inputmode/dismissing
      // the soft keyboard reflows the viewport and the subsequent `click` is often
      // lost (user sees KB close and has to tap again). Panel → keyboard still
      // uses click so focus()+KB open stay in the activating gesture.
      if (this.emojiOpen || this.surfaceTransition === 'to-keyboard') return;
      this._emojiToggleFromPointer = true;
      this.openComposerPanel();
    },
    /** Invalidate in-flight surface transitions (fallback timers, pending inset). */
    bumpComposerSurfaceGen() {
      this._composerSurfaceGen = (this._composerSurfaceGen || 0) + 1;
      return this._composerSurfaceGen;
    },
    clearComposerSurfaceTransition() {
      this.surfaceTransition = null;
      this.clearInsetFallback();
    },
    clearComposerFocusTimers() {
      if (!this._composerFocusTimers) return;
      this._composerFocusTimers.forEach((id) => clearTimeout(id));
      this._composerFocusTimers = [];
    },
    pinScrollToBottomForKeyboard() {
      if (!this._pinBottomOnKeyboard && !this.atBottom) return;
      this.atBottom = true;
      this.$nextTick(() => {
        this.scrollToBottom();
        requestAnimationFrame(() => this.scrollToBottom());
      });
    },
    keepComposerCaret({ keyboard = false } = {}) {
      // Focus composer with optional soft keyboard. Allowed during voice hold
      // (ghost textarea) so the keyboard inset does not collapse under the finger.
      if (this._composerFocusTimers) {
        this._composerFocusTimers.forEach((id) => clearTimeout(id));
        this._composerFocusTimers = [];
      }
      if (this.searchMode || this.selectionMode) return;
      if (this.mediaCompose?.open || this.mediaViewer?.open) return;
      this.composerInputMode = keyboard ? 'text' : 'none';
      const el = this.$refs.input;
      if (!el || typeof el.focus !== 'function') return;
      try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); }
      this.composerFocused = true;
      const len = (el.value || '').length;
      const s = Math.max(0, Math.min(len, this.inputSel?.start ?? len));
      const e = Math.max(s, Math.min(len, this.inputSel?.end ?? s));
      try { el.setSelectionRange(s, e); } catch (err) { /* noop */ }
      this.inputSel = { start: s, end: e };
    },
    keepComposerTypingFocus() {
      this.keepComposerCaret({ keyboard: true });
    },
    dismissKeyboardKeepCaret() {
      // Telegram: dismiss soft keyboard, keep blinking caret via inputmode=none.
      this.keepComposerCaret({ keyboard: false });
    },
    keepComposerCaretNoKeyboard() {
      this.keepComposerCaret({ keyboard: false });
    },
    onAttachSelect(value) {
      if (value === 'camera') {
        this.attachSheet.open = false;
        this.$nextTick(() => {
          const el = this.$refs.cameraInput;
          if (el) {
            el.value = '';
            el.click();
          }
        });
        return;
      }
      this.attachSheet.open = false;
      if (value === 'location') {
        this.onShareLocation();
        return;
      }
      // photo = gallery (images + videos), audio, file
      const refMap = { photo: 'photoInput', video: 'videoInput', audio: 'audioInput', file: 'fileInput' };
      const el = this.$refs[refMap[value]];
      if (el) {
        el.value = '';
        el.click();
      }
    },
    onCameraPicked(event) {
      const file = event?.target?.files?.[0];
      event.target.value = '';
      if (!file) return;
      // Camera is photo-only → open composer preview like a gallery photo.
      this.onFilePicked('gallery', { target: { files: [file] } });
    },
    dragHasFiles(dt) {
      if (!dt) return false;
      if (dt.types && typeof dt.types.includes === 'function') {
        return dt.types.includes('Files');
      }
      return Array.from(dt.types || []).includes('Files');
    },
    onChatDragEnter(e) {
      if (!this.conversation || !this.dragHasFiles(e.dataTransfer)) return;
      if (this.mediaCompose.open || this.voiceRecording) return;
      this.dragDepth += 1;
      this.dragActive = true;
    },
    onChatDragOver(e) {
      if (!this.conversation || !this.dragHasFiles(e.dataTransfer)) return;
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      this.dragActive = true;
    },
    onChatDragLeave() {
      this.dragDepth = Math.max(0, this.dragDepth - 1);
      if (this.dragDepth === 0) this.dragActive = false;
    },
    async onChatFilesDrop(e) {
      this.dragDepth = 0;
      this.dragActive = false;
      if (!this.conversation || this.mediaCompose.open || this.voiceRecording) return;
      const files = e?.dataTransfer?.files;
      if (!files?.length) return;
      await this.openFilesComposer(files, { forceFile: false });
    },
    async onFilePicked(pickKind, event) {
      const list = Array.from(event?.target?.files || []);
      event.target.value = '';
      if (!list.length) return;

      if (pickKind === 'audio') {
        const file = list[0];
        const mime = String(file.type || '').toLowerCase();
        const name = String(file.name || '').toLowerCase();
        const ok = mime.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|wav|flac|opus)$/i.test(name);
        if (!ok) return;
        if (!isMediaWithinLimit(file)) {
          this.locationDenied = {
            open: true,
            title: this.$t(mediaTypeLabelKey('audio')),
            message: this.$t('messenger.mediaTooLarge', { size: MEDIA_MAX_MB }),
          };
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        const probed = await probeLocalFile(file, 'audio');
        const coverBlob = await extractAudioArtworkBlob(file);
        const coverUrl = coverBlob ? URL.createObjectURL(coverBlob) : null;
        this.mediaCompose = {
          open: true,
          type: 'audio',
          file,
          fileName: file.name || 'media',
          previewUrl,
          coverBlob,
          coverUrl,
          size: file.size || 0,
          duration: probed.duration,
          width: probed.width,
          height: probed.height,
          items: [],
        };
        return;
      }

      if (pickKind === 'file') {
        await this.openFilesComposer(list, { forceFile: true });
        return;
      }

      if (pickKind === 'video') {
        const filtered = list.filter((file) => {
          const mime = String(file.type || '').toLowerCase();
          const name = String(file.name || '').toLowerCase();
          return mime.startsWith('video/') || /\.(mp4|webm|mov|m4v|3gp)$/i.test(name);
        });
        await this.openFilesComposer(filtered, { forceFile: false, forceVideo: true });
        return;
      }

      // Gallery / mixed drop path
      await this.openFilesComposer(list, { forceFile: false });
    },
    async openFilesComposer(fileList, { forceFile = false, forceVideo = false } = {}) {
      const list = Array.from(fileList || []).filter(Boolean);
      if (!list.length) return;

      const { items, skippedLarge, skippedBlocked, truncated } = await classifyDroppedFiles(list, {
        forceFile: !!forceFile,
        maxPick: MEDIA_MAX_PICK,
        probe: probeLocalFile,
      });

      // Gallery picker: keep only photo/video; video-only picker already filtered.
      let finalItems = items;
      if (!forceFile && !forceVideo) {
        // Drop/gallery may include docs — keep them (Telegram mixed send).
        finalItems = items;
      }
      if (forceVideo) {
        finalItems = items.filter((it) => it.type === 'video').map((it) => ({ ...it, type: 'video' }));
      }

      if (skippedLarge && !finalItems.length) {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaFile'),
          message: this.$t('messenger.mediaTooLarge', { size: MEDIA_MAX_MB }),
        };
        return;
      }
      if (skippedBlocked && !finalItems.length) {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaFile'),
          message: this.$t('messenger.fileTypeBlocked'),
        };
        return;
      }
      if (truncated) {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaFile'),
          message: this.$t('messenger.mediaMaxPick', { count: MEDIA_MAX_PICK }),
        };
      }
      if (!finalItems.length) return;

      // Single audio from mixed drop → compact audio sheet with cover probe.
      if (finalItems.length === 1 && finalItems[0].type === 'audio' && !forceFile) {
        const it = finalItems[0];
        const coverBlob = await extractAudioArtworkBlob(it.file);
        const coverUrl = coverBlob ? URL.createObjectURL(coverBlob) : null;
        this.mediaCompose = {
          open: true,
          type: 'audio',
          file: it.file,
          fileName: it.fileName,
          previewUrl: it.previewUrl,
          coverBlob,
          coverUrl,
          size: it.size,
          duration: it.duration,
          width: it.width,
          height: it.height,
          items: [],
        };
        return;
      }

      if (finalItems.length === 1) {
        const it = finalItems[0];
        this.mediaCompose = {
          open: true,
          type: it.type,
          file: it.file,
          fileName: it.fileName,
          previewUrl: it.previewUrl || '',
          coverBlob: null,
          coverUrl: '',
          size: it.size,
          duration: it.duration,
          width: it.width,
          height: it.height,
          items: [],
        };
        return;
      }

      this.mediaCompose = {
        open: true,
        type: finalItems[0].type,
        file: finalItems[0].file,
        fileName: finalItems[0].fileName,
        previewUrl: finalItems[0].previewUrl || '',
        coverBlob: null,
        coverUrl: '',
        size: finalItems[0].size,
        duration: finalItems[0].duration,
        width: finalItems[0].width,
        height: finalItems[0].height,
        items: finalItems,
      };
    },
    emptyMediaCompose() {
      return {
        open: false,
        type: 'photo',
        file: null,
        fileName: '',
        previewUrl: '',
        coverBlob: null,
        coverUrl: '',
        size: 0,
        duration: null,
        width: null,
        height: null,
        items: [],
      };
    },
    closeMediaCompose() {
      const urls = [];
      if (this.mediaCompose.previewUrl) urls.push(this.mediaCompose.previewUrl);
      if (this.mediaCompose.coverUrl) urls.push(this.mediaCompose.coverUrl);
      (this.mediaCompose.items || []).forEach((it) => {
        if (it.previewUrl) urls.push(it.previewUrl);
      });
      urls.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) { /* noop */ }
      });
      this.mediaCompose = this.emptyMediaCompose();
    },
    confirmMediaCompose(payload) {
      const sheet = payload || {};
      const data = { ...this.mediaCompose, ...sheet };
      if (!data?.file) return;
      this.atBottom = true;
      let coverFile = null;
      if (data.coverBlob instanceof Blob) {
        const ext = (data.coverBlob.type || '').includes('png') ? 'png' : 'jpg';
        coverFile = new File([data.coverBlob], `cover.${ext}`, { type: data.coverBlob.type || 'image/jpeg' });
      }
      this.pulseUploadActivity(data.type);
      this.$emit('send-media', {
        file: data.file,
        type: data.type,
        caption: sheet.caption || data.caption || '',
        duration: data.duration,
        width: data.width,
        height: data.height,
        localUrl: data.previewUrl || this.mediaCompose.previewUrl,
        coverFile,
        localCover: data.coverUrl || this.mediaCompose.coverUrl || null,
        silent: !!sheet.silent,
        animation: !!sheet.animation,
      });
      // Keep preview/cover blob URLs alive for optimistic bubble; don't revoke here.
      this.mediaCompose = this.emptyMediaCompose();
    },
    confirmMediaBatch(payload) {
      const items = payload?.items || [];
      if (!items.length) return;
      this.atBottom = true;
      this.pulseUploadActivity(batchLeadType(items));
      expandMediaBatchForSend(payload).forEach((emitPayload) => {
        this.$emit('send-media', emitPayload);
      });
      this.mediaCompose = this.emptyMediaCompose();
    },
    toggleSelectAlbum(ids) {
      const list = Array.isArray(ids) ? ids : [];
      list.forEach((id) => this.toggleSelect(id));
    },
    onOpenLightbox(payload) {
      if (this.consumeChatAccessoryTap()) return;
      if (!payload) return;
      if (typeof payload === 'string') {
        this.mediaViewer = {
          open: true,
          src: payload,
          type: 'photo',
          message: null,
          items: [],
          index: 0,
          hasMoreOlder: false,
          loadingGallery: false,
          galleryBeforeId: null,
          galleryToken: (this.mediaViewer.galleryToken || 0) + 1,
        };
        return;
      }
      const selected = payload.message || null;
      // Stickers never open the media gallery.
      if (selected && isStickerMessage(selected)) return;

      // Every photo/video in this chat — both peers — oldest → newest (Telegram).
      // Stickers are excluded. Unloaded history is filled via shared-media API.
      const pool = [];
      const seen = new Set();
      const pushMsg = (m) => {
        if (!isGalleryMediaMessage(m)) return;
        const key = m.id != null ? `id:${m.id}` : `c:${m.client_id || ''}`;
        if (!key || key === 'id:' || key === 'c:' || seen.has(key)) return;
        seen.add(key);
        pool.push(m);
      };
      const cid = this.conversation?.id;
      const fromStore = (cid != null && this.$store?.state?.messenger?.messages?.[cid]) || [];
      (this.messages || []).forEach(pushMsg);
      fromStore.forEach(pushMsg);
      // Album open may pass siblings that aren't all in the flat list yet.
      if (Array.isArray(payload.album)) payload.album.forEach(pushMsg);

      const items = this.buildGalleryItems(pool, selected, payload);

      let index = items.findIndex((item) => {
        if (!selected) return false;
        if (selected.id != null && item.message?.id != null) {
          return Number(item.message.id) === Number(selected.id);
        }
        return !!(selected.client_id && item.message?.client_id === selected.client_id);
      });
      if (index < 0) index = 0;

      // Ensure the opened item always has the payload src when provided.
      if (items[index] && payload.src) {
        items[index] = { ...items[index], src: payload.src, downloaded: true };
      }
      // Video can open without blob — progressive player uses meta.url.
      if (items[index] && !items[index].src && payload.type === 'video') {
        items[index] = { ...items[index], src: '', downloaded: false };
      }

      const galleryToken = (this.mediaViewer.galleryToken || 0) + 1;
      this.mediaViewer = {
        open: true,
        src: payload.src || items[index]?.src || '',
        type: payload.type || items[index]?.type || 'photo',
        message: selected || items[index]?.message || null,
        items,
        index,
        hasMoreOlder: true,
        loadingGallery: false,
        galleryBeforeId: null,
        galleryToken,
      };

      // Fill cached blob URLs for neighbors without auto-downloading the rest.
      this.hydrateMediaViewerCache();
      // First shared-media page; further pages load near the gallery edge.
      this.loadMediaViewerGallery(galleryToken);
    },
    buildGalleryItems(messages, selected = null, payload = null) {
      return (messages || [])
        .filter(isGalleryMediaMessage)
        .slice()
        .sort(compareMessages)
        .map((m) => {
          const isSelected = selected
            && (
              (selected.id != null && m.id != null && Number(m.id) === Number(selected.id))
              || (selected.client_id && m.client_id && selected.client_id === m.client_id)
            );
          const local = m.meta?.local_url;
          const localOk = local && /^(blob:|data:)/.test(String(local));
          let src = '';
          if (isSelected && payload?.src) src = payload.src;
          else if (localOk) src = local;
          else if (m.meta?.url && !String(m.meta.url).includes('/messenger/media/') && isMediaDownloaded(m.meta.url)) {
            src = m.meta.url;
          }
          const thumb = m.meta?.thumb_url || m.meta?.cover_url || (localOk ? local : '') || '';
          return {
            src,
            thumb: thumb && !String(thumb).includes('/messenger/media/') ? thumb : '',
            type: m.type === 'video' ? 'video' : 'photo',
            message: m,
            downloaded: !!src,
            senderName: this.resolveGallerySenderName(m),
          };
        });
    },
    resolveGallerySenderName(m) {
      if (!m) return '';
      const contactMap = contactNameMap(this.$store.state.messenger?.contacts);
      const u = m.user || null;
      if (u) {
        const nick = u.id != null ? contactMap[u.id] : '';
        return peerDisplayName(u, nick, this.$t('messenger.user'));
      }
      if (Number(m.user_id) === Number(this.meId)) {
        const me = this.conversation?.users?.find((x) => Number(x.id) === Number(this.meId));
        if (me) return peerDisplayName(me, contactMap[me.id], this.$t('messenger.user'));
      }
      const partner = this.conversation?.users?.find((x) => Number(x.id) === Number(m.user_id));
      if (partner) return peerDisplayName(partner, contactMap[partner.id], this.$t('messenger.user'));
      return this.partnerName || '';
    },
    galleryMsgKey(m) {
      if (!m) return '';
      if (m.id != null) return `id:${m.id}`;
      if (m.client_id) return `c:${m.client_id}`;
      return '';
    },
    mergeGalleryMessages(existingItems, incomingMessages) {
      const map = new Map();
      (existingItems || []).forEach((item) => {
        const key = this.galleryMsgKey(item?.message);
        if (key) map.set(key, item);
      });
      (incomingMessages || []).forEach((m) => {
        if (!isGalleryMediaMessage(m)) return;
        const key = this.galleryMsgKey(m);
        if (!key) return;
        const prev = map.get(key);
        if (prev) {
          map.set(key, {
            ...prev,
            message: { ...m, ...(prev.message || {}), meta: { ...(m.meta || {}), ...(prev.message?.meta || {}) } },
            senderName: prev.senderName || this.resolveGallerySenderName(m),
            thumb: prev.thumb || (m.meta?.thumb_url || m.meta?.cover_url || ''),
          });
          return;
        }
        const built = this.buildGalleryItems([m])[0];
        if (built) map.set(key, built);
      });
      return [...map.values()].sort((a, b) => compareMessages(a.message, b.message));
    },
    applyGalleryItems(items, preferredMessage = null) {
      if (!this.mediaViewer.open) return;
      const preferred = preferredMessage || this.mediaViewer.message;
      let index = items.findIndex((item) => {
        if (!preferred) return false;
        if (preferred.id != null && item.message?.id != null) {
          return Number(item.message.id) === Number(preferred.id);
        }
        return !!(preferred.client_id && item.message?.client_id === preferred.client_id);
      });
      if (index < 0) index = Math.min(this.mediaViewer.index || 0, Math.max(0, items.length - 1));
      const cur = items[index] || null;
      this.mediaViewer = {
        ...this.mediaViewer,
        items,
        index,
        src: cur?.src || this.mediaViewer.src,
        type: cur?.type || this.mediaViewer.type,
        message: cur?.message || this.mediaViewer.message,
      };
    },
    async loadMediaViewerGallery(token) {
      const cid = this.conversation?.id;
      if (!cid || !this.mediaViewer.open) return;
      if (this.mediaViewer.loadingGallery) return;
      if (this.mediaViewer.hasMoreOlder === false) return;
      const beforeId = this.mediaViewer.galleryBeforeId || null;
      this.mediaViewer = { ...this.mediaViewer, loadingGallery: true };
      try {
        const res = await getSharedMedia(cid, 'media', beforeId, 80);
        if (this.mediaViewer.galleryToken !== token || !this.mediaViewer.open) return;
        let rows = Array.isArray(res?.data) ? res.data : [];
        try {
          rows = await decryptMessageList(rows);
        } catch (e) { /* keep ciphertext rows for merge */ }
        const merged = this.mergeGalleryMessages(this.mediaViewer.items, rows);
        this.applyGalleryItems(merged);
        this.hydrateMediaViewerCache();
        const hasMore = !!res?.meta?.has_more;
        const last = rows[rows.length - 1];
        const nextBefore = last?.id || null;
        this.mediaViewer = {
          ...this.mediaViewer,
          hasMoreOlder: !!(hasMore && nextBefore),
          galleryBeforeId: nextBefore,
          loadingGallery: false,
        };
      } catch (e) {
        // Keep whatever local gallery we already have.
        if (this.mediaViewer.galleryToken === token && this.mediaViewer.open) {
          this.mediaViewer = { ...this.mediaViewer, loadingGallery: false };
        }
      }
    },
    onMediaViewerNeedMore({ direction } = {}) {
      if (direction === 'older' && this.mediaViewer.hasMoreOlder && !this.mediaViewer.loadingGallery) {
        this.loadMediaViewerGallery(this.mediaViewer.galleryToken);
      }
    },
    onMediaViewerForward(message) {
      const m = message || this.mediaViewer.message;
      if (!m?.id) return;
      this.closeMediaViewer();
      this.$emit('open-forward', { messageIds: [m.id], dropAuthor: false });
    },
    onMediaViewerGoToMessage(message) {
      const m = message || this.mediaViewer.message;
      if (!m?.id) return;
      // Remember chat scroll so returning from highlight / reopening feels stable.
      const box = this.$refs.scrollBox;
      if (box) {
        this._mediaViewerReturnScroll = {
          top: box.scrollTop,
          conversationId: this.conversation?.id ?? null,
        };
      }
      this.closeMediaViewer();
      this.$nextTick(() => {
        this.goToMessage(m.id, 2500);
      });
    },
    restoreMediaViewerScrollIfNeeded() {
      const saved = this._mediaViewerReturnScroll;
      if (!saved) return;
      if (saved.conversationId != null && saved.conversationId !== this.conversation?.id) {
        this._mediaViewerReturnScroll = null;
        return;
      }
      const box = this.$refs.scrollBox;
      if (!box) return;
      // Only restore when caller asks (e.g. user backs out of a jump without landing).
      box.scrollTop = saved.top;
      this._mediaViewerReturnScroll = null;
    },
    async hydrateMediaViewerCache() {
      const items = this.mediaViewer?.items;
      if (!Array.isArray(items) || !items.length) return;
      const next = items.slice();
      let changed = false;
      const usableThumb = (url) => {
        if (!url) return '';
        const s = String(url);
        if (s.includes('/messenger/media/')) return '';
        return s;
      };
      await Promise.all(next.map(async (item, i) => {
        const m = item?.message;
        const meta = m?.meta || {};
        let patch = null;

        if (!item?.src) {
          const url = meta.url || meta.local_url;
          if (url) {
            try {
              const cached = await getCachedBlobUrl(url);
              if (cached) {
                patch = { ...(patch || item), src: cached, downloaded: true };
                changed = true;
              }
            } catch (e) { /* noop */ }
          }
        }

        let thumb = usableThumb(item?.thumb) || usableThumb(item?.poster);
        if (!thumb) {
          const thumbCandidates = [meta.thumb_url, meta.cover_url].filter(Boolean);
          for (const cand of thumbCandidates) {
            try {
              // Clear CDN thumbs can be used directly.
              if (usableThumb(cand)) {
                thumb = cand;
                break;
              }
              const cachedThumb = await getCachedBlobUrl(cand);
              if (cachedThumb) {
                thumb = cachedThumb;
                break;
              }
            } catch (e) { /* noop */ }
          }
        }

        // Videos without a poster: capture a frame from the blob src.
        const srcForPoster = (patch?.src || item?.src || '');
        if (!thumb && item?.type === 'video' && srcForPoster && String(srcForPoster).startsWith('blob:')) {
          try {
            const poster = await captureVideoPoster(srcForPoster);
            if (poster) thumb = poster;
          } catch (e) { /* noop */ }
        }

        if (thumb && thumb !== item.thumb) {
          patch = { ...(patch || item), thumb, poster: thumb };
          changed = true;
        } else if (patch) {
          patch = { ...patch, thumb: patch.thumb || item.thumb || '' };
        }

        if (patch) next[i] = patch;
      }));
      if (!changed || !this.mediaViewer.open) return;
      const idx = this.mediaViewer.index;
      this.mediaViewer = {
        ...this.mediaViewer,
        items: next,
        src: next[idx]?.src || this.mediaViewer.src,
        type: next[idx]?.type || this.mediaViewer.type,
        message: next[idx]?.message || this.mediaViewer.message,
      };
    },
    closeMediaViewer() {
      this.mediaViewer = {
        open: false,
        src: '',
        type: 'photo',
        message: null,
        items: [],
        index: 0,
        hasMoreOlder: false,
        loadingGallery: false,
        galleryBeforeId: null,
        galleryToken: (this.mediaViewer.galleryToken || 0) + 1,
      };
    },
    onMediaViewerNavigate({ index, item, patchOnly }) {
      if (patchOnly && item && Number.isFinite(index)) {
        const items = this.mediaViewer.items.slice();
        items[index] = { ...items[index], ...item };
        this.mediaViewer = {
          ...this.mediaViewer,
          items,
          src: items[index]?.src || this.mediaViewer.src,
        };
        return;
      }
      this.mediaViewer = {
        ...this.mediaViewer,
        index,
        src: item?.src || '',
        type: item?.type || 'photo',
        message: item?.message || null,
      };
    },
    async onMediaViewerNeedDownload({ index, item }) {
      const message = item?.message;
      const url = message?.meta?.url || message?.meta?.cdn_url || message?.meta?.local_url;
      if (!url) return;
      try {
        let src = '';
        try {
          const cached = await getCachedBlobUrl(url);
          if (cached) src = cached;
        } catch (e) { /* fall through to download */ }
        if (!src) {
          const result = await downloadMedia(url, { message });
          src = result?.blobUrl || result?.remoteUrl || '';
        }
        if (!src || !this.mediaViewer.open) return;
        const items = this.mediaViewer.items.slice();
        if (!items[index]) return;
        items[index] = { ...items[index], src, downloaded: true, thumb: items[index].thumb || src };
        this.mediaViewer = {
          ...this.mediaViewer,
          items,
          index,
          src,
          type: items[index].type,
          message: items[index].message,
        };
        // Capture a filmstrip poster for newly downloaded videos.
        if (items[index].type === 'video' && src && String(src).startsWith('blob:') && !items[index].thumb) {
          captureVideoPoster(src).then((poster) => {
            if (!poster || !this.mediaViewer.open) return;
            const list = this.mediaViewer.items.slice();
            if (!list[index]) return;
            list[index] = { ...list[index], thumb: poster, poster };
            this.mediaViewer = { ...this.mediaViewer, items: list };
          }).catch(() => {});
        }
      } catch (e) {
        // Leave the locked state available for an explicit retry.
      }
    },
    beginVoiceFromGesture() {
      // Kick off getUserMedia immediately (still in the click handler stack),
      // then close the sheet and finish recorder setup.
      if (this.editingMessage || !this.canSend || this.voiceRecording) {
        this.attachSheet.open = false;
        return;
      }
      if (typeof window !== 'undefined' && window.isSecureContext === false) {
        this.attachSheet.open = false;
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message: this.$t('messenger.voiceInsecureContext'),
        };
        return;
      }
      if (typeof MediaRecorder === 'undefined') {
        this.attachSheet.open = false;
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message: this.$t('messenger.voiceUnsupported'),
        };
        return;
      }
      const streamPromise = getMicrophoneStream();
      this.attachSheet.open = false;
      this.startVoiceRecord(streamPromise);
    },
    async startVoiceRecord(prefetchedStream = null) {
      if (this.editingMessage || !this.canSend || this.voiceRecording) return;
      if (typeof window !== 'undefined' && window.isSecureContext === false) {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message: this.$t('messenger.voiceInsecureContext'),
        };
        return;
      }
      if (typeof MediaRecorder === 'undefined') {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message: this.$t('messenger.voiceUnsupported'),
        };
        return;
      }
      // @click may pass a DOM Event — only accept a real stream or Promise.
      let prefetch = prefetchedStream;
      if (prefetch && typeof prefetch.then !== 'function' && typeof prefetch.getTracks !== 'function') {
        prefetch = null;
      }
      try {
        const stream = prefetch
          ? (typeof prefetch.then === 'function' ? await prefetch : prefetch)
          : await getMicrophoneStream();
        if (!stream || typeof stream.getTracks !== 'function') {
          throw Object.assign(new Error('Invalid microphone stream'), { name: 'NotSupportedError' });
        }
        this.voiceStream = stream;
        let mime = '';
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
        else if (MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mime = 'audio/ogg';
        const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        this.voiceMimeType = mime || recorder.mimeType || 'audio/webm';
        this.voiceChunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size) this.voiceChunks.push(e.data);
        };
        this.voiceRecorder = recorder;
        this.voiceRecording = true;
        this.voicePaused = false;
        this.voiceAccumulatedMs = 0;
        this.voiceStartedAt = Date.now();
        this.voiceElapsed = 0;
        // Mic hold gesture: stay unlocked until swipe-up. Attach-sheet start locks immediately.
        if (!this.voiceGesture) this.voiceLocked = true;
        // Race: pointer already released before getUserMedia finished → discard tap.
        if (this.voiceGesture && !this.voicePointerActive) {
          this.teardownVoice(true);
          return;
        }
        this.startVoiceTimer();
        this.startVoiceLiveWave();
        recorder.start(250);
        // Keep soft-keyboard up: textarea stays mounted (ghost) and focused.
        this.$nextTick(() => {
          if (this.emojiOpen) return;
          const keepKb = !!(this._voiceKeepKeyboard || this.keyboardOpen || this.composerInputMode === 'text');
          this.keepComposerCaret({ keyboard: keepKb });
        });
      } catch (e) {
        this.voiceRecording = false;
        this.teardownVoice(true);
        const name = e?.name || '';
        let message = this.$t('messenger.voicePermissionDenied');
        if (name === 'NotSupportedError' || name === 'TypeError') {
          message = this.$t('messenger.voiceUnsupported');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          message = this.$t('messenger.voiceNoMic');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          message = this.$t('messenger.voiceMicBusy');
        } else if (name === 'SecurityError') {
          message = this.$t('messenger.voiceInsecureContext');
        } else if (name !== 'NotAllowedError' && name !== 'PermissionDeniedError') {
          message = this.$t('messenger.voiceUnsupported');
        }
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message,
        };
      }
    },
    startVoiceTimer() {
      if (this.voiceTick) clearInterval(this.voiceTick);
      this.voiceTick = setInterval(() => {
        if (this.voicePaused) {
          this.voiceElapsed = this.voiceAccumulatedMs;
          return;
        }
        this.voiceElapsed = this.voiceAccumulatedMs + (Date.now() - this.voiceStartedAt);
      }, 40);
    },
    startVoiceLiveWave() {
      this.stopVoiceLiveWave();
      if (!this.voiceStream) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const source = ctx.createMediaStreamSource(this.voiceStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.65;
        source.connect(analyser);
        this.voiceAudioCtx = ctx;
        this.voiceAnalyser = analyser;
        try { ctx.resume(); } catch (e) { /* noop */ }
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!this.voiceRecording || this.voicePaused || !this.voiceAnalyser) {
            this.voiceAnimFrame = null;
            return;
          }
          this.voiceAnalyser.getByteFrequencyData(data);
          const bars = 36;
          const step = Math.max(1, Math.floor(data.length / bars));
          const peaks = [];
          for (let i = 0; i < bars; i += 1) {
            let sum = 0;
            for (let j = 0; j < step; j += 1) sum += data[i * step + j] || 0;
            // Emphasize mid-band energy for a Telegram-like lively wave.
            const raw = (sum / step) / 160;
            peaks.push(Math.max(0.1, Math.min(1, raw ** 0.85)));
          }
          // Scroll previous frame slightly so the wave feels continuous.
          const prev = this.voiceLivePeaks || [];
          if (prev.length === bars) {
            const mixed = peaks.map((p, i) => {
              const shift = prev[(i + 1) % bars] || p;
              return Math.max(0.1, Math.min(1, p * 0.72 + shift * 0.28));
            });
            this.voiceLivePeaks = mixed;
          } else {
            this.voiceLivePeaks = peaks;
          }
          this.voiceAnimFrame = requestAnimationFrame(tick);
        };
        this.voiceAnimFrame = requestAnimationFrame(tick);
      } catch (e) {
        this.voiceLivePeaks = [];
      }
    },
    stopVoiceLiveWave() {
      if (this.voiceAnimFrame) {
        cancelAnimationFrame(this.voiceAnimFrame);
        this.voiceAnimFrame = null;
      }
      this.voiceAnalyser = null;
      if (this.voiceAudioCtx) {
        try { this.voiceAudioCtx.close(); } catch (e) { /* noop */ }
        this.voiceAudioCtx = null;
      }
    },
    async pauseVoiceRecord() {
      if (!this.voiceLocked || this.voicePaused || !this.voiceRecorder) return;
      if (this.voiceRecorder.state !== 'recording') return;
      this.voiceAccumulatedMs += Date.now() - this.voiceStartedAt;
      this.voiceElapsed = this.voiceAccumulatedMs;
      try { this.voiceRecorder.requestData(); } catch (e) { /* noop */ }
      try { this.voiceRecorder.pause(); } catch (e) { /* noop */ }
      this.voicePaused = true;
      this.stopVoiceLiveWave();
      await new Promise((r) => setTimeout(r, 80));
      await this.buildVoicePreview();
    },
    async resumeVoiceRecord() {
      if (!this.voiceLocked || !this.voicePaused || !this.voiceRecorder) return;
      this.stopVoicePreviewPlayback();
      this.clearVoicePreview();
      this.voicePaused = false;
      this.voiceStartedAt = Date.now();
      try { this.voiceRecorder.resume(); } catch (e) { /* noop */ }
      this.startVoiceLiveWave();
    },
    async buildVoicePreview() {
      const chunks = this.voiceChunks.slice();
      if (!chunks.length) {
        this.voicePeaks = [];
        this.voiceDurationSec = Math.max(0.2, this.voiceAccumulatedMs / 1000);
        this.voiceTrimStart = 0;
        this.voiceTrimEnd = this.voiceDurationSec;
        return;
      }
      const blob = new Blob(chunks, { type: this.voiceMimeType || 'audio/webm' });
      if (this.voicePreviewUrl) {
        try { URL.revokeObjectURL(this.voicePreviewUrl); } catch (e) { /* noop */ }
      }
      this.voicePreviewUrl = URL.createObjectURL(blob);
      let duration = this.voiceAccumulatedMs / 1000;
      try {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = this.voicePreviewUrl;
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => resolve();
          audio.onerror = () => resolve();
          setTimeout(resolve, 600);
        });
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          duration = audio.duration;
        }
      } catch (e) { /* noop */ }
      this.voiceDurationSec = Math.max(0.2, duration);
      this.voiceTrimStart = 0;
      this.voiceTrimEnd = this.voiceDurationSec;
      this.voicePlayhead = 0;
      try {
        this.voicePeaks = await analyzeWaveform(this.voicePreviewUrl, 72);
      } catch (e) {
        this.voicePeaks = [];
      }
    },
    clearVoicePreview() {
      this.stopVoicePreviewPlayback();
      if (this.voicePreviewUrl) {
        try { URL.revokeObjectURL(this.voicePreviewUrl); } catch (e) { /* noop */ }
      }
      this.voicePreviewUrl = '';
      this.voicePeaks = [];
      this.voiceDurationSec = 0;
      this.voiceTrimStart = 0;
      this.voiceTrimEnd = 0;
      this.voicePlayhead = 0;
    },
    stopVoicePreviewPlayback() {
      const a = this.voicePreviewAudio;
      if (a) {
        try { a.pause(); } catch (e) { /* noop */ }
        try { a.src = ''; } catch (e) { /* noop */ }
      }
      this.voicePreviewAudio = null;
      this.voicePreviewPlaying = false;
    },
    toggleVoicePreviewPlayback() {
      if (!this.voicePreviewUrl) return;
      if (this.voicePreviewPlaying) {
        this.stopVoicePreviewPlayback();
        return;
      }
      const audio = new Audio(this.voicePreviewUrl);
      this.voicePreviewAudio = audio;
      const start = this.voiceTrimStart;
      const end = this.voiceTrimEnd;
      audio.currentTime = start;
      this.voicePlayhead = start;
      this.voicePreviewPlaying = true;
      const onTime = () => {
        this.voicePlayhead = audio.currentTime;
        if (audio.currentTime >= end - 0.02) {
          this.stopVoicePreviewPlayback();
          this.voicePlayhead = this.voiceTrimStart;
        }
      };
      audio.addEventListener('timeupdate', onTime);
      audio.addEventListener('ended', () => {
        this.stopVoicePreviewPlayback();
        this.voicePlayhead = this.voiceTrimStart;
      });
      audio.play().catch(() => {
        this.stopVoicePreviewPlayback();
      });
    },
    formatVoiceSec(sec) {
      const s = Math.max(0, Math.floor(Number(sec) || 0));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${m}:${String(r).padStart(2, '0')}`;
    },
    voiceBarOutsideTrim(index) {
      const n = this.voiceWaveBars.length || 1;
      // Use bar center so edge bars still count as inside when handles sit on the ends.
      const t = ((index + 0.5) / n) * (this.voiceDurationSec || 1);
      return t < this.voiceTrimStart || t > this.voiceTrimEnd;
    },
    onVoiceTrimPointerDown(e) {
      if (!this.voicePaused) return;
      const handle = e.target?.dataset?.handle;
      const track = e.currentTarget;
      if (!track) return;
      this.stopVoicePreviewPlayback();
      const rect = track.getBoundingClientRect();
      const pctFromX = (clientX) => {
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        return x / rect.width;
      };
      let mode = handle || 'end';
      if (!handle) {
        const p = pctFromX(e.clientX);
        const d = this.voiceDurationSec || 1;
        const t = p * d;
        const mid = (this.voiceTrimStart + this.voiceTrimEnd) / 2;
        mode = t < mid ? 'start' : 'end';
      }
      const move = (ev) => {
        const d = this.voiceDurationSec || 1;
        const t = pctFromX(ev.clientX) * d;
        if (mode === 'start') {
          this.voiceTrimStart = Math.max(0, Math.min(this.voiceTrimEnd - 0.2, t));
          this.voicePlayhead = this.voiceTrimStart;
        } else {
          this.voiceTrimEnd = Math.min(d, Math.max(this.voiceTrimStart + 0.2, t));
          this.voicePlayhead = this.voiceTrimEnd;
        }
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
      move(e);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    },
    cancelVoiceRecord() {
      this.playVoiceCancelBurst(() => {
        this.unbindVoiceMicListeners();
        this.teardownVoice(false);
      });
    },
    playVoiceCancelBurst(done) {
      if (this.voiceCancelBurst) {
        if (typeof done === 'function') done();
        return;
      }
      this.voiceCancelBurst = true;
      this.voiceCancelHint = true;
      if (this.voiceCancelTimer) clearTimeout(this.voiceCancelTimer);
      this.voiceCancelTimer = setTimeout(() => {
        this.voiceCancelTimer = null;
        this.voiceCancelBurst = false;
        if (typeof done === 'function') done();
      }, 240);
    },
    onVoiceMicDown(e) {
      if (this.editingMessage || !this.canSend || this.voiceRecording) return;
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      // Keep emoji panel / soft-keyboard exactly as they are (Telegram-style).
      // Do NOT closeEmojiPanel() or blur the composer here.
      this._voiceKeepKeyboard = this.isSoftKeyboardOpen() || this.composerInputMode === 'text';
      if (this._voiceKeepKeyboard) {
        this.composerInputMode = 'text';
      }
      this.voicePointerActive = true;
      this.voicePointerId = e.pointerId;
      this.voiceGesture = { startX: e.clientX, startY: e.clientY };
      this.voiceLocked = false;
      this.voicePaused = false;
      this.voiceCancelHint = false;
      this.voiceLockHint = false;
      this.voiceLockProgress = 0;
      this.voiceDragX = 0;
      this.voiceCancelBurst = false;
      // Keep receiving moves even if the finger leaves the mic button / browser
      // starts treating the gesture as a scroll (main cause of accidental send).
      try {
        e.currentTarget?.setPointerCapture?.(e.pointerId);
      } catch (err) { /* noop */ }
      this.bindVoiceMicListeners();
      if (this.voiceHoldTimer) clearTimeout(this.voiceHoldTimer);
      this.voiceHoldTimer = setTimeout(() => {
        this.voiceHoldTimer = null;
        if (!this.voicePointerActive || this.voiceRecording) return;
        this.beginVoiceFromGesture();
      }, 160);
    },
    bindVoiceMicListeners() {
      this.unbindVoiceMicListeners();
      window.addEventListener('pointermove', this.onVoiceMicMove, { passive: false });
      window.addEventListener('pointerup', this.onVoiceMicUp);
      window.addEventListener('pointercancel', this.onVoiceMicUp);
    },
    unbindVoiceMicListeners() {
      window.removeEventListener('pointermove', this.onVoiceMicMove);
      window.removeEventListener('pointerup', this.onVoiceMicUp);
      window.removeEventListener('pointercancel', this.onVoiceMicUp);
    },
    onVoiceMicMove(e) {
      if (!this.voicePointerActive || this.voiceLocked || !this.voiceGesture) return;
      if (this.voicePointerId != null && e.pointerId !== this.voicePointerId) return;
      const dx = e.clientX - this.voiceGesture.startX;
      const dy = e.clientY - this.voiceGesture.startY;
      // Generous dead-zone so small finger jitter never cancels/locks.
      // Lock distance tuned closer to Telegram (short upward flick).
      const CANCEL_HINT = 56;
      const CANCEL_COMMIT = 112;
      const LOCK_HINT = 36;
      const LOCK_COMMIT = 92;
      const CANCEL_GUARD = 56;
      const up = Math.max(0, -dy);
      // Mic is last in DOM (LTR: right, RTL: left); cancel slides toward the field (inward).
      const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
      const cancelSlide = Math.max(0, rtl ? dx : -dx);
      const isCancel = this.voiceRecording && cancelSlide > CANCEL_HINT && up < LOCK_HINT;
      const isLockZone = this.voiceRecording && up > LOCK_HINT && cancelSlide < CANCEL_GUARD;

      this.voiceDragX = this.voiceRecording ? Math.min(160, cancelSlide) : 0;
      this.voiceCancelHint = !!(isCancel && cancelSlide > CANCEL_HINT);
      this.voiceLockHint = !!isLockZone;
      this.voiceLockProgress = isLockZone
        ? Math.max(0, Math.min(1, (up - LOCK_HINT) / (LOCK_COMMIT - LOCK_HINT)))
        : 0;

      if (this.voiceRecording && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
        try { e.preventDefault(); } catch (err) { /* noop */ }
      }

      if (this.voiceRecording && up >= LOCK_COMMIT && cancelSlide < CANCEL_GUARD) {
        this.voiceLocked = true;
        this.voiceLockHint = false;
        this.voiceCancelHint = false;
        this.voiceLockProgress = 1;
        this.voiceDragX = 0;
        this.voicePointerActive = false;
        this.voicePointerId = null;
        this.unbindVoiceMicListeners();
        return;
      }
      // Dragged far enough toward delete → cancel with a short burst animation.
      if (this.voiceRecording && isCancel && cancelSlide >= CANCEL_COMMIT) {
        this.voicePointerActive = false;
        this.voicePointerId = null;
        this.unbindVoiceMicListeners();
        this.cancelVoiceRecord();
      }
    },
    onVoiceMicUp(e) {
      if (this.voicePointerId != null && e?.pointerId != null && e.pointerId !== this.voicePointerId) return;
      this.voicePointerActive = false;
      this.voicePointerId = null;
      this.voiceLockProgress = 0;
      if (this.voiceHoldTimer) {
        clearTimeout(this.voiceHoldTimer);
        this.voiceHoldTimer = null;
      }
      this.unbindVoiceMicListeners();
      if (!this.voiceRecording) {
        this.voiceGesture = null;
        this.voiceCancelHint = false;
        this.voiceLockHint = false;
        this.voiceDragX = 0;
        return;
      }
      if (this.voiceLocked) return;
      if (this.voiceCancelHint) {
        this.cancelVoiceRecord();
        return;
      }
      const elapsed = this.voiceAccumulatedMs + (Date.now() - this.voiceStartedAt);
      if (elapsed < 450) {
        this.cancelVoiceRecord();
        return;
      }
      this.stopVoiceRecordAndSend();
    },
    async stopVoiceRecordAndSend() {
      const payload = await this.finalizeVoiceBlob();
      if (!payload) return;
      this.pulseUploadActivity('voice');
      this.$emit('send-media', payload);
    },
    async stopVoiceRecord() {
      const payload = await this.finalizeVoiceBlob();
      if (!payload) return;
      this.pulseUploadActivity('voice');
      this.$emit('send-media', payload);
    },
    async finalizeVoiceBlob() {
      if (!this.voiceRecorder && !this.voiceChunks.length) return null;
      const wasPaused = this.voicePaused;
      const trimStart = this.voiceTrimStart;
      const trimEnd = this.voiceTrimEnd;
      const fullSec = wasPaused
        ? Math.max(0.2, this.voiceDurationSec || (this.voiceAccumulatedMs / 1000))
        : Math.max(0.2, (this.voiceAccumulatedMs + Math.max(0, Date.now() - this.voiceStartedAt)) / 1000);
      const sendDuration = wasPaused
        ? Math.max(1, Math.round(Math.max(0.2, trimEnd - trimStart)))
        : Math.max(1, Math.round(fullSec));
      const mime = this.voiceMimeType || this.voiceRecorder?.mimeType || 'audio/webm';
      const needsSlice = wasPaused && this.trimNeedsSlice(trimStart, trimEnd, fullSec);

      if (this.voiceRecorder && this.voiceRecorder.state !== 'inactive') {
        const recorder = this.voiceRecorder;
        const done = new Promise((resolve) => {
          recorder.onstop = () => resolve();
        });
        try { recorder.requestData(); } catch (e) { /* noop */ }
        try { recorder.stop(); } catch (e) { /* noop */ }
        await done;
      }

      const chunks = this.voiceChunks.slice();
      this.teardownVoice(true);
      if (!chunks.length) return null;
      let blob = new Blob(chunks, { type: mime });
      let file = new File([blob], `voice_${Date.now()}.webm`, { type: blob.type || mime });

      if (needsSlice) {
        try {
          const sliced = await sliceAudioBlob(blob, trimStart, trimEnd);
          if (sliced) {
            file = sliced;
            blob = sliced;
          }
        } catch (e) { /* keep full blob */ }
      }

      if (!isMediaWithinLimit(file)) {
        this.locationDenied = {
          open: true,
          title: this.$t('messenger.mediaVoice'),
          message: this.$t('messenger.mediaTooLarge', { size: MEDIA_MAX_MB }),
        };
        return null;
      }
      return {
        file,
        type: 'voice',
        duration: sendDuration,
        caption: '',
      };
    },
    trimNeedsSlice(start, end, fullSec) {
      const s = Number(start) || 0;
      const e = Number(end) || 0;
      const full = Number(fullSec) || 0;
      if (e - s < 0.15) return false;
      if (s <= 0.05 && e >= full - 0.12) return false;
      return true;
    },
    teardownVoice(keepSilent) {
      this.unbindVoiceMicListeners();
      this.stopVoiceLiveWave();
      this.clearVoicePreview();
      if (this.voiceHoldTimer) {
        clearTimeout(this.voiceHoldTimer);
        this.voiceHoldTimer = null;
      }
      if (this.voiceTick) {
        clearInterval(this.voiceTick);
        this.voiceTick = null;
      }
      if (this.voiceRecorder && this.voiceRecorder.state !== 'inactive') {
        try { this.voiceRecorder.stop(); } catch (e) { /* noop */ }
      }
      if (this.voiceStream && typeof this.voiceStream.getTracks === 'function') {
        this.voiceStream.getTracks().forEach((t) => t.stop());
      }
      this.voiceStream = null;
      this.voiceRecorder = null;
      this.voiceChunks = [];
      this.voiceRecording = false;
      this.voiceElapsed = 0;
      this.voiceAccumulatedMs = 0;
      this.voiceLocked = false;
      this.voicePaused = false;
      this.voiceCancelHint = false;
      this.voiceLockHint = false;
      this.voiceLockProgress = 0;
      this.voiceDragX = 0;
      this.voiceCancelBurst = false;
      if (this.voiceCancelTimer) {
        clearTimeout(this.voiceCancelTimer);
        this.voiceCancelTimer = null;
      }
      this.voiceGesture = null;
      this.voicePointerActive = false;
      this.voicePointerId = null;
      this.voiceLivePeaks = [];
      this.voiceMimeType = '';
      if (!keepSilent) { /* cancelled */ }
    },
    async onShareLocation() {
      if (this.editingMessage || !this.canSend) return;
      this.locationDenied.open = false;
      // Open interactive picker immediately; it requests GPS itself and also
      // lets the user pan to any point (Telegram-style).
      this.locationSheet = {
        open: true,
        lat: null,
        lng: null,
        accuracy: null,
      };
    },
    showLocationError(err) {
      const code = err?.code;
      let message = this.$t('messenger.locationUnavailable');
      if (code === GEO_ERROR.DENIED) {
        message = this.$t('messenger.locationPermissionDenied');
      } else if (code === GEO_ERROR.UNSUPPORTED) {
        message = this.$t('messenger.locationUnsupported');
      } else if (code === GEO_ERROR.TIMEOUT) {
        message = this.$t('messenger.locationTimeout');
      }
      this.locationDenied = {
        open: true,
        title: this.$t('messenger.locationPermissionTitle'),
        message,
      };
    },
    onLocationDeniedSelect(value) {
      this.locationDenied.open = false;
      if (value === 'retry' && this.locationSheet.open) {
        // User can tap the my-location button again; keep picker open.
        return;
      }
      if (value === 'retry') this.$nextTick(() => this.onShareLocation());
    },
    closeLocationSheet() {
      this.locationSheet = { open: false, lat: null, lng: null, accuracy: null };
    },
    confirmSendLocation(payload) {
      const lat = payload?.lat ?? this.locationSheet.lat;
      const lng = payload?.lng ?? this.locationSheet.lng;
      const accuracy = payload?.accuracy ?? this.locationSheet.accuracy;
      if (lat == null || lng == null) return;
      this.closeLocationSheet();
      this.atBottom = true;
      this.$emit('send', {
        body: locationBody(lat, lng),
        type: 'location',
        meta: {
          lat,
          lng,
          accuracy: accuracy != null ? Math.round(accuracy * 10) / 10 : null,
        },
      });
    },
    // Break an over-long message into chunks, preferring newline/word breaks
    // near the limit so words and lines aren't sliced mid-way.
    splitForSend(text) {
      const limit = MAX_SEND_LENGTH;
      if (text.length <= limit) return [text];
      const out = [];
      let rest = text;
      while (rest.length > limit) {
        const slice = rest.slice(0, limit);
        let cut = slice.lastIndexOf('\n');
        if (cut < limit * 0.5) {
          const sp = slice.lastIndexOf(' ');
          if (sp >= limit * 0.5) cut = sp;
        }
        if (cut <= 0) cut = limit;
        const piece = rest.slice(0, cut).replace(/\s+$/, '');
        if (piece) out.push(piece);
        rest = rest.slice(cut).replace(/^\s+/, '');
      }
      if (rest.length) out.push(rest);
      return out;
    },
    onEdit(message) {
      this.$store.commit('messenger/CLEAR_SELECTION');
      this.$store.commit('messenger/SET_REPLY', null);
      this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      this.editingMessage = message;
      this.text = message.body || '';
      this.$nextTick(() => {
        this.scheduleComposerFocus({ openKeyboard: true });
        this.autoResize();
        const el = this.$refs.input;
        if (el && typeof el.setSelectionRange === 'function') {
          const len = (this.text || '').length;
          // Place caret inside the existing text (end) so edit feels like Telegram.
          try { el.setSelectionRange(len, len); } catch (e) { /* noop */ }
          this.inputSel = { start: len, end: len };
        }
      });
    },
    onDelete(message, albumMessageIds = null) {
      // Close the context menu first, then let the parent open the confirm
      // after the pointer gesture settles (avoids mobile ghost-dismiss).
      this.msgMenu.visible = false;
      const ids = Array.isArray(albumMessageIds)
        ? albumMessageIds.filter((id) => id != null && Number.isFinite(Number(id)) && Number(id) > 0)
        : [];
      const msg = message;
      this.$nextTick(() => {
        if (ids.length > 1) {
          this.$emit('request-delete-selected', { messageIds: ids, isAlbum: true });
          return;
        }
        this.$emit('request-delete', msg);
      });
    },
    onReply(message) {
      this.$store.commit('messenger/CLEAR_SELECTION');
      this.editingMessage = null;
      this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
      this.$store.commit('messenger/SET_REPLY', message);
      this.$nextTick(() => this.scheduleComposerFocus({ openKeyboard: true }));
    },
    cancelReply() {
      this.$store.commit('messenger/SET_REPLY', null);
      this.focusInput(false);
    },
    cancelEdit() {
      this.editingMessage = null;
      this.text = '';
      this.focusInput(false);
    },
    onInput() {
      this.autoResize();
      this.onTyping();
      this.snapshotInputSelection();
    },
    isEmojiGrapheme(ch) {
      const s = String(ch || '');
      if (!s) return false;
      // Letters/digits/common punctuation are not emoji.
      if (/^[\p{L}\p{N}\p{P}\p{Z}]+$/u.test(s) && !/\p{Extended_Pictographic}/u.test(s)) return false;
      try {
        return /\p{Extended_Pictographic}/u.test(s) || /\p{Emoji_Presentation}/u.test(s);
      } catch (e) {
        return s.length <= 4 && Array.from(s).some((c) => (c.codePointAt(0) || 0) > 0xff);
      }
    },
    onStickerSuggestWheel(e) {
      const el = this.$refs.stickerSuggestStrip;
      if (!el) return;
      el.scrollLeft += e.deltaY || e.deltaX || 0;
    },
    /** Pick from the suggest strip: clear composer so the strip closes, then send. */
    onPickSuggestedSticker(st) {
      if (!st) return;
      // Ignore ghost clicks right after the desktop emoji popover closes.
      if (this.isComposerUiClickSuppressed()) return;
      this.text = '';
      this.inputSel = { start: 0, end: 0 };
      this.$nextTick(() => {
        this.autoResize();
      });
      this.onSendStickerFromPanel(st);
    },
    onTyping() {
      // Recording owns the status exclusively (Telegram).
      if (this.voiceRecording) return;
      if (this.activityPulseKind === 'recording_voice') return;
      // Typing overlays an in-flight upload; when idle, upload status resumes.
      if (this.activityPulseKind && String(this.activityPulseKind).startsWith('uploading_')) {
        this.clearActivityInterval();
      }
      this.activityPulseKind = 'typing';
      // Throttle emits; pause → peers clear typing, then we may resume upload.
      if (!this.typingTimer) {
        this.$emit('typing', 'typing');
        this.typingTimer = setTimeout(() => { this.typingTimer = null; }, 2000);
      }
      this.armTypingIdleResume();
    },
    // Grow the composer with its content up to a 5-line cap, then scroll.
    autoResize() {
      const el = this.$refs.input;
      if (!el) return;
      el.style.height = 'auto';
      const cs = window.getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || 20;
      const padT = parseFloat(cs.paddingTop) || 0;
      const padB = parseFloat(cs.paddingBottom) || 0;
      const minH = (lh * 1) + padT + padB;
      const maxH = (lh * 5) + padT + padB;
      const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > maxH + 1 ? 'auto' : 'hidden';
    },
    // ----- Swipe the whole chat aside to return to the conversation list -----
    onPageTouchStart(e) {
      this.pageSwipe = null;
      if (this.pageSwipeOut) return;
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;
      if (!this.conversation || this.selectionMode) return;
      const target = e.target;
      if (target && target.closest && (
        target.closest('[data-mid]')
        || target.closest('button, a, input, textarea, [contenteditable="true"]')
      )) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      this.pageSwipe = { x: t.clientX, y: t.clientY, active: false };
    },
    onPageTouchMove(e) {
      if (!this.pageSwipe) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - this.pageSwipe.x;
      const dy = t.clientY - this.pageSwipe.y;
      if (!this.pageSwipe.active) {
        if (Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          this.pageSwipe.active = true;
        } else if (Math.abs(dy) > 16) {
          this.pageSwipe = null;
          return;
        } else {
          return;
        }
      }
      this.pageSwipeX = dx;
    },
    onPageTouchEnd() {
      if (!this.pageSwipe || !this.pageSwipe.active) {
        this.pageSwipe = null;
        this.pageSwipeX = 0;
        return;
      }
      const dx = this.pageSwipeX;
      this.pageSwipe = null;
      if (Math.abs(dx) > PAGE_SWIPE_THRESHOLD) {
        this.pageSwipeOut = dx > 0 ? 1 : -1;
        setTimeout(() => {
          this.$emit('back');
          this.pageSwipeOut = 0;
          this.pageSwipeX = 0;
        }, 200);
      } else {
        this.pageSwipeX = 0;
      }
    },
    onAvatarClick(user) {
      if (!user) return;
      const id = user.id ?? user.user_id;
      if (id == null) return;
      if (Number(id) === Number(this.meId)) return;
      this.$emit('open-profile', { ...user, id });
    },
    onForwardTap(user) {
      // The forwarded sender opted in (flag carried on the user object); the
      // bubble already guards the click, so just route to the chat with them.
      if (!user?.id) return;
      if (Number(user.id) === Number(this.meId)) return;
      this.$emit('open-profile', user);
    },
    onForwardChatTap(chat) {
      if (!chat?.id) return;
      this.$emit('open-community', chat);
    },
    onChannelHeaderTap() {
      if (!this.conversation?.id) return;
      this.$emit('open-profile');
    },
    recordChannelViews(msgs) {
      if (!this.isChannel || this.conversation?.is_preview) return;
      const ids = [];
      (msgs || []).forEach((m) => {
        if (!m?.id || m.type === 'system' || this.viewedIds[m.id]) return;
        this.viewedIds[m.id] = true;
        ids.push(m.id);
      });
      if (!ids.length) return;
      recordMessageViews(ids).then((res) => {
        const views = res?.views;
        if (!views || typeof views !== 'object') return;
        const cid = this.conversation?.id;
        if (!cid) return;
        Object.keys(views).forEach((id) => {
          const count = views[id];
          if (count == null) return;
          this.$store.commit('messenger/UPDATE_MESSAGE', {
            conversationId: cid,
            message: { id: Number(id), view_count: count },
          });
        });
      }).catch(() => {});
    },
    // Tapping a reply quote: jump to the original message (3s highlight).
    onScrollToReply(id) {
      this.goToMessage(id, 3000);
    },
    onRetryMessage(message) {
      this.$emit('retry-message', message);
    },
    onCancelUpload(message) {
      this.$emit('cancel-upload', message);
    },
    // Jump to a message, paging in older history first if it isn't loaded yet.
    goToMessage(id, duration = 3000) {
      if (id == null) return;
      const target = Number(id);
      if (!Number.isFinite(target)) return;
      const loaded = (this.messages || []).some((m) => Number(m.id) === target);
      if (loaded) {
        this.scrollToMessage(target, { duration });
      } else {
        this.$emit('reveal-message', { id: target, duration });
      }
    },
    setRevealLoading(v) {
      this.revealLoading = !!v;
    },
    isPinned(id) {
      return this.pinnedList.some((m) => m.id === id);
    },
    // Pin entry point from the context menu: in a private chat show a confirm
    // with a checkbox to also pin for the partner; Saved Messages pins directly.
    requestPin(m) {
      if (!m || !this.conversation) return;
      if (!this.isSaved && this.partner) {
        this.msgMenu.visible = false;
        const msg = m;
        this.$nextTick(() => {
          setTimeout(() => {
            this.pinChoice = { open: true, message: msg, forEveryone: false };
          }, 60);
        });
      } else {
        this.pinMessage(m, false);
      }
    },
    onPinSheetConfirm(forEveryone) {
      const m = this.pinChoice.message;
      this.pinChoice = { open: false, message: null, forEveryone: false };
      if (m) this.pinMessage(m, !!forEveryone);
    },
    cancelPin() {
      this.pinChoice = { open: false, message: null, forEveryone: false };
    },
    pinMessage(m, forEveryone) {
      if (!m || !this.conversation) return;
      this.$store.dispatch('messenger/pinMessageAction', {
        messageId: m.id,
        forEveryone,
        message: m,
        conversationId: this.conversation.id,
      }).catch(() => {});
    },
    unpinOne(m) {
      if (!m || !this.conversation) return;
      this.$store.dispatch('messenger/unpinMessageAction', {
        messageId: m.id,
        conversationId: this.conversation.id,
      }).catch(() => {});
    },
    unpinAll() {
      if (!this.conversation) return;
      this.$store.dispatch('messenger/unpinAllAction', this.conversation.id).catch(() => {});
      this.pinnedSheetOpen = false;
    },
    openPinnedSheet() {
      this.pinnedSheetOpen = true;
    },
    closePinnedSheet() {
      this.pinnedSheetOpen = false;
    },
    // Bar tap: jump to the previewed pin. With multiple pins, further taps cycle older → newer.
    // The side list button opens the full pinned panel (not the bar).
    onPinnedBarClick() {
      if (!this.pinnedCount) return;
      if (this.pinnedCount >= 2 && this.pinBarJumped) {
        this.pinCursor = (this.pinCursor - 1 + this.pinnedCount) % this.pinnedCount;
      }
      this.pinBarJumped = true;
      const target = this.activePin;
      if (!target) return;
      this.goToMessage(target.id, 5000);
    },
    requestUnpinAll() {
      openAfterPointerSettled(() => {
        this.unpinAllConfirmOpen = true;
      });
    },
    confirmUnpinAll() {
      this.unpinAllConfirmOpen = false;
      this.unpinAll();
    },
    jumpToPinned(m) {
      if (!m) return;
      this.pinnedSheetOpen = false;
      this.goToMessage(m.id, 5000);
    },
    // Scroll to (and briefly highlight) a specific message by id.
    scrollToMessage(id, { fallbackToBottom = false, duration = 3000 } = {}) {
      this.$nextTick(() => {
        const box = this.$refs.scrollBox;
        if (!box) return;
        const el = box.querySelector(`[data-mid="${id}"]`);
        if (!el) {
          if (fallbackToBottom) this.scrollToBottom();
          return;
        }
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        el.style.animationDuration = `${duration}ms`;
        el.classList.remove('msg-flash');
        // Force reflow so re-adding the class restarts the animation.
        void el.offsetWidth;
        el.classList.add('msg-flash');
        setTimeout(() => {
          el.classList.remove('msg-flash');
          el.style.animationDuration = '';
        }, duration);
      });
    },
    // Reports whether a transient overlay (context/header menu) is open, so the
    // parent's back-button handler can treat the chat as "not at root".
    hasOverlay() {
      return this.msgMenu.visible
        || this.inputMenu.visible
        || this.showMenu
        || this.forwardMenuOpen
        || !!this.pendingForward
        || this.searchMode
        || this.pinnedSheetOpen
        || this.pinChoice.open
        || this.attachSheet.open
        || this.mediaCompose.open
        || this.mediaViewer.open
        || this.locationSheet.open
        || this.voiceRecording
        || this.emojiOpen
        || this.emojiSidebarOpen;
    },
    enterSearchMode() {
      this.showMenu = false;
      if (this.selectionMode) this.$store.commit('messenger/CLEAR_SELECTION');
      this.searchMode = true;
      this.searchShowDates = false;
      // chrome-slide uses mode="out-in" — input mounts after the leave (~200ms).
      this.$nextTick(() => {
        window.setTimeout(() => {
          const el = this.$refs.chatSearchInput;
          if (!el || typeof el.focus !== 'function') return;
          try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
          try {
            const len = (el.value || '').length;
            el.setSelectionRange(len, len);
          } catch (e) { /* noop */ }
        }, 230);
      });
    },
    exitSearchMode({ focusComposer = true } = {}) {
      this.searchMode = false;
      this.searchQuery = '';
      this.searchActiveQuery = '';
      this.searchSubmitted = false;
      this.searchFrom = '';
      this.searchTo = '';
      this.searchShowDates = false;
      this.searchResults = [];
      this.searchTotal = 0;
      this.searchIndex = 0;
      this.searchSearching = false;
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      if (focusComposer) {
        this.$nextTick(() => this.focusInput());
      }
    },
    clearChatSearchQuery() {
      this.searchQuery = '';
      this.searchActiveQuery = '';
      this.searchSubmitted = false;
      this.searchResults = [];
      this.searchTotal = 0;
      this.searchIndex = 0;
      this.searchSearching = false;
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
      }
      this.$nextTick(() => this.$refs.chatSearchInput?.focus());
    },
    onChatSearchInput() {
      clearTimeout(this.searchTimer);
      const q = this.searchQuery.trim();
      const hasDates = !!(this.searchFrom || this.searchTo);
      if (!q && !hasDates) {
        this.searchSubmitted = false;
        this.searchActiveQuery = '';
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchIndex = 0;
        this.searchSearching = false;
        return;
      }
      if (q && !meetsSearchMin(q) && !hasDates) {
        this.searchSubmitted = false;
        this.searchActiveQuery = '';
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchIndex = 0;
        this.searchSearching = false;
        return;
      }
      this.searchTimer = setTimeout(() => this.runChatSearch(), 280);
    },
    submitChatSearch() {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
      this.runChatSearch();
    },
    onSearchDatesChange() {
      // Date filter applies only after the user has already submitted a search,
      // or when searching by date range alone.
      if (this.searchSubmitted || this.searchFrom || this.searchTo) {
        this.runChatSearch();
      }
    },
    async runChatSearch() {
      if (!this.conversation?.id || this.conversation.isDraft) {
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchIndex = 0;
        this.searchSearching = false;
        this.searchSubmitted = true;
        this.searchActiveQuery = this.searchQuery.trim();
        return;
      }
      const q = this.searchQuery.trim();
      const hasDates = !!(this.searchFrom || this.searchTo);
      if (!q && !hasDates) {
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchIndex = 0;
        this.searchSubmitted = false;
        this.searchActiveQuery = '';
        this.searchSearching = false;
        return;
      }
      if (q && !meetsSearchMin(q) && !hasDates) {
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchIndex = 0;
        this.searchSubmitted = false;
        this.searchActiveQuery = '';
        this.searchSearching = false;
        return;
      }
      this.searchSubmitted = true;
      this.searchActiveQuery = q;
      this.searchSearching = true;
      const filters = {};
      if (q) filters.q = q;
      if (this.searchFrom) filters.from = this.searchFrom;
      if (this.searchTo) filters.to = this.searchTo;

      const t = (k) => this.$t(k);
      const localHits = searchCachedMessages({
        messagesByConv: { [this.conversation.id]: this.messages || [] },
        conversations: [this.conversation],
        query: q,
        conversationId: this.conversation.id,
        limit: 80,
        t,
        from: this.searchFrom || null,
        to: this.searchTo || null,
      });

      try {
        const res = await searchMessages(this.conversation.id, filters);
        const serverRows = Array.isArray(res?.data) ? res.data : [];
        const rows = mergeMessageSearchHits(localHits, serverRows, 80);
        this.searchResults = rows;
        this.searchTotal = Math.max(Number(res?.meta?.total) || 0, rows.length);
        // If server total is for encrypted-miss, prefer local count when local has more.
        if (rows.length > (Number(res?.meta?.total) || 0)) {
          this.searchTotal = rows.length;
        }
        this.searchIndex = 0;
        if (rows.length) {
          this.jumpToSearchResult(0);
        }
      } catch (e) {
        this.searchResults = localHits;
        this.searchTotal = localHits.length;
        this.searchIndex = 0;
        if (localHits.length) this.jumpToSearchResult(0);
      } finally {
        this.searchSearching = false;
      }
    },
    jumpToSearchResult(index) {
      if (!this.searchResults.length) return;
      const i = Math.max(0, Math.min(index, this.searchResults.length - 1));
      this.searchIndex = i;
      const id = this.searchResults[i]?.id;
      if (id != null) this.goToMessage(id, 2500);
    },
    goSearchPrev() {
      // Up = newer (lower index; results are newest-first).
      if (this.searchIndex <= 0) return;
      this.jumpToSearchResult(this.searchIndex - 1);
    },
    goSearchNext() {
      // Down = older (higher index).
      if (this.searchIndex >= this.searchResults.length - 1) {
        if (this.searchIndex < this.searchTotal - 1) {
          this.loadMoreSearchResults();
        }
        return;
      }
      this.jumpToSearchResult(this.searchIndex + 1);
    },
    async loadMoreSearchResults() {
      if (!this.conversation?.id || this.searchSearching) return;
      const page = Math.floor(this.searchResults.length / 40) + 1;
      if (page < 2) return;
      const q = this.searchQuery.trim();
      const filters = { page };
      if (q) filters.q = q;
      if (this.searchFrom) filters.from = this.searchFrom;
      if (this.searchTo) filters.to = this.searchTo;
      this.searchSearching = true;
      try {
        const res = await searchMessages(this.conversation.id, filters);
        const rows = Array.isArray(res?.data) ? res.data : [];
        if (!rows.length) return;
        const seen = new Set(this.searchResults.map((m) => m.id));
        const extra = rows.filter((m) => !seen.has(m.id));
        this.searchResults = this.searchResults.concat(extra);
        this.searchTotal = Number(res?.meta?.total) || this.searchTotal;
        if (this.searchIndex < this.searchResults.length - 1) {
          this.jumpToSearchResult(this.searchIndex + 1);
        }
      } catch (e) {
        /* ignore */
      } finally {
        this.searchSearching = false;
      }
    },
    headerAction(type) {
      this.showMenu = false;
      // Same target as clicking the header: conversation for groups/channels, partner for DMs.
      if (type === 'profile') {
        this.$emit('open-profile', (this.isCommunity || this.isSaved) ? this.conversation : this.partner);
      }
      if (type === 'mute') this.$emit('mute', this.conversation.id);
      if (type === 'select') this.$store.commit('messenger/SET_SELECTION_MODE', true);
      if (type === 'wallpaper') this.$emit('open-wallpaper');
      if (type === 'clear') this.$emit('clear');
      if (type === 'delete') this.$emit('delete-conversation');
    },
    onDocClick(e) {
      if (this.forwardMenuOpen) {
        const wrap = this.$refs.forwardMenuWrap;
        const menu = this.$refs.forwardMenuPanel;
        const inWrap = wrap && wrap.contains(e.target);
        const inMenu = menu && menu.contains(e.target);
        if (!inWrap && !inMenu) this.forwardMenuOpen = false;
      }
      if (!this.showMenu) return;
      const wrap = this.$refs.headerMenuWrap;
      if (wrap && wrap.contains(e.target)) return;
      this.showMenu = false;
    },
    toggleForwardMenu() {
      if (this.forwardMenuOpen) {
        this.forwardMenuOpen = false;
        return;
      }
      this.positionForwardMenu();
      this.forwardMenuOpen = true;
      this.$nextTick(() => {
        this.positionForwardMenu();
        requestAnimationFrame(() => this.positionForwardMenu());
      });
    },
    positionForwardMenu() {
      const btn = this.$refs.forwardMenuBtn;
      if (!btn || typeof window === 'undefined') return;
      const rect = btn.getBoundingClientRect();
      const panel = this.$refs.forwardMenuPanel;
      const pad = 32; // 2rem
      const gap = 10;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxW = Math.max(160, vw - pad * 2);
      // Prefer natural content width (max-content); only clamp to viewport.
      const natural = panel?.offsetWidth || 0;
      const menuW = Math.min(natural > 40 ? natural : 200, maxW);
      const menuH = panel?.offsetHeight || 96;
      const rtl = document.documentElement.dir === 'rtl';

      let left = rtl ? rect.right - menuW : rect.left;
      left = Math.max(pad, Math.min(left, vw - menuW - pad));

      const placeAbove = rect.top >= menuH + gap + pad;
      let top = placeAbove ? (rect.top - gap - menuH) : (rect.bottom + gap);
      top = Math.max(pad, Math.min(top, vh - menuH - pad));

      this.forwardMenuStyle = {
        position: 'fixed',
        left: Math.round(left) + 'px',
        top: Math.round(top) + 'px',
        bottom: 'auto',
        width: 'max-content',
        maxWidth: Math.floor(maxW) + 'px',
        zIndex: 2000000210,
        transformOrigin: placeAbove
          ? (rtl ? 'bottom right' : 'bottom left')
          : (rtl ? 'top right' : 'top left'),
      };
    },
    onDocPointerDown(e) {
      // Dismiss desktop hover emoji popover on outside pointer.
      if (this.emojiHoverOpen && !this.isMobileEmojiMode) {
        if (e.target?.closest?.('[data-sticker-hold-overlay]')) return;
        const pop = this.$refs.emojiPopover;
        const btn = this.$refs.emojiBtn;
        if (pop?.contains(e.target) || btn?.contains(e.target)) return;
        this.clearEmojiHoverTimers();
        this.emojiHoverOpen = false;
        this.suppressComposerUiClick(450);
        return;
      }
      if (!this.emojiOpen || this.isMobileEmojiMode) return;
      // Hold-preview overlays teleport to body; keep the emoji panel open.
      if (e.target?.closest?.('[data-sticker-hold-overlay]')) return;
      const pop = this.$refs.emojiPopover;
      const btn = this.$refs.emojiBtn;
      if (pop?.contains(e.target) || btn?.contains(e.target)) return;
      // Dismiss emoji popover only — never clear composer / sticker suggest.
      this.closeEmojiPanel();
      // Same pointer gesture must not "fall through" onto the suggest strip
      // (would send a sticker and wipe the input).
      this.suppressComposerUiClick(450);
    },
    /** Ignore accidental clicks on suggest/send for a short window after UI swaps. */
    suppressComposerUiClick(ms = 400) {
      this._suppressComposerUiClickUntil = Date.now() + ms;
    },
    isComposerUiClickSuppressed() {
      return !!(this._suppressComposerUiClickUntil && Date.now() < this._suppressComposerUiClickUntil);
    },
    loadEmojiPanelHeight() {
      try {
        const stored = sessionStorage.getItem(EMOJI_KEYBOARD_HEIGHT_KEY);
        const n = stored ? parseInt(stored, 10) : NaN;
        if (Number.isFinite(n) && n > 120 && n < 600) {
          this.emojiPanelHeight = n;
          return;
        }
      } catch {
        /* noop */
      }
      this.emojiPanelHeight = defaultEmojiPanelHeight();
    },
    ensureEmojiPanelHeight() {
      this.measureKeyboardHeight();
      if (!Number.isFinite(this.emojiPanelHeight) || this.emojiPanelHeight < 160) {
        this.loadEmojiPanelHeight();
      }
      // Never taller than the soft-keyboard band / half the viewport.
      const maxH = Math.round(Math.min(
        window.innerHeight * 0.5,
        Math.max(160, window.innerHeight - 160),
      ));
      if (this.emojiPanelHeight > maxH) this.emojiPanelHeight = maxH;
      if (this.emojiPanelHeight < 160) this.emojiPanelHeight = Math.min(maxH, defaultEmojiPanelHeight());
    },
    onEmojiPanelModeChange(mode) {
      if (!EMOJI_PANEL_MODES.includes(mode)) return;
      this.lastEmojiPanelMode = mode;
      try { localStorage.setItem(EMOJI_PANEL_MODE_KEY, mode); } catch { /* noop */ }
    },
    measureKeyboardHeight() {
      if (typeof window === 'undefined') return;
      const vv = window.visualViewport;
      if (!vv) return;
      const offsetTop = Math.round(vv.offsetTop || 0);
      const kh = Math.round(window.innerHeight - vv.height - offsetTop);
      this.keyboardOpen = kh > 80;
      if (kh > 120 && kh < window.innerHeight * 0.75) {
        this.emojiPanelHeight = kh;
        this.lastKeyboardOffsetTop = offsetTop;
        try {
          sessionStorage.setItem(EMOJI_KEYBOARD_HEIGHT_KEY, String(kh));
        } catch {
          /* noop */
        }
      }
    },
    emitAccessoryState() {
      if (!this.isMobileEmojiMode) {
        this.$emit('accessory-change', null);
        return;
      }
      if (this.emojiOpen || this.pendingKeyboardInset) {
        const vv = typeof window !== 'undefined' ? window.visualViewport : null;
        const offsetTop = this.lastKeyboardOffsetTop
          || Math.round(vv?.offsetTop || 0)
          || 0;
        this.$emit('accessory-change', {
          active: true,
          mode: this.emojiOpen ? 'emoji' : 'keyboard-pending',
          height: this.emojiPanelHeight,
          offsetTop,
        });
        return;
      }
      this.$emit('accessory-change', null);
    },
    onVisualViewportChange() {
      if (typeof window === 'undefined') return;
      const vv = window.visualViewport;
      // Keep learning the real soft-keyboard height whenever it is visible,
      // but never resize the dock mid emoji↔keyboard swap (that causes jumps).
      if (!this.emojiOpen && !this.pendingKeyboardInset) this.measureKeyboardHeight();
      if (!vv) return;

      const offsetTop = Math.round(vv.offsetTop || 0);
      const kh = Math.round(window.innerHeight - vv.height - offsetTop);
      if (!(this.emojiOpen || this.pendingKeyboardInset)) {
        this.keyboardOpen = kh > 80;
      }

      // While emoji is open, track offsetTop→0 as the keyboard finishes closing
      // so the shell can expand upward without a sudden jump.
      if (this.emojiOpen && this.isMobileEmojiMode) {
        if (offsetTop !== this.lastKeyboardOffsetTop) {
          this.lastKeyboardOffsetTop = offsetTop;
          this.emitAccessoryState();
        }
        return;
      }

      if (!this.pendingKeyboardInset) return;
      // Wait until the keyboard has meaningfully risen AND the parent vvHeight
      // already reflects the shrink before dropping the spacer.
      const target = Math.max(120, this.emojiPanelHeight * 0.75);
      if (kh > target) {
        this.clearInsetFallback();
        this.lastKeyboardOffsetTop = offsetTop;
        // Drop the spacer only after vvHeight has been updated by the parent
        // (onViewportResize runs before this). Two rAFs avoid a 1-frame gap on
        // slower Android WebViews.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!this.pendingKeyboardInset) return;
            const vv2 = window.visualViewport;
            if (!vv2) return;
            const ot2 = Math.round(vv2.offsetTop || 0);
            const kh2 = Math.round(window.innerHeight - vv2.height - ot2);
            if (kh2 < target) return;
            this.lastKeyboardOffsetTop = ot2;
            this.keyboardOpen = true;
            this.pendingKeyboardInset = false;
            if (this.surfaceTransition === 'to-keyboard') {
              this.surfaceTransition = null;
            }
            this.clearInsetFallback();
            this.emitAccessoryState();
            this.pinScrollToBottomForKeyboard();
          });
        });
      }
    },
    scheduleInsetFallback(gen) {
      this.clearInsetFallback();
      const expected = gen ?? this._composerSurfaceGen;
      this.insetFallbackTimer = setTimeout(() => {
        this.insetFallbackTimer = null;
        // Stale transition (dismiss / opposite toggle / conversation change).
        if (expected !== this._composerSurfaceGen) return;
        if (!this.pendingKeyboardInset || this.surfaceTransition !== 'to-keyboard') return;
        // Soft keyboard never rose (focus blocked / slow). Restore the last
        // panel at the same height instead of collapsing the chat.
        this.pendingKeyboardInset = false;
        this.surfaceTransition = null;
        this.emojiOpen = true;
        this.composerInputMode = 'none';
        this.emitAccessoryState();
        this.keepComposerCaret({ keyboard: false });
        this.$nextTick(() => {
          const picker = this.$refs.emojiPicker;
          if (picker && typeof picker.setMode === 'function') {
            picker.setMode(this.lastEmojiPanelMode);
          }
        });
      }, 1000);
    },
    clearInsetFallback() {
      if (this.insetFallbackTimer) {
        clearTimeout(this.insetFallbackTimer);
        this.insetFallbackTimer = null;
      }
    },
    positionEmojiPopover() {
      const btn = this.$refs.emojiBtn;
      if (!btn || typeof window === 'undefined') return;
      const rect = btn.getBoundingClientRect();
      const panelW = Math.min(360, window.innerWidth - 16);
      const panelH = 320;
      const margin = 8;
      // Open toward the chat (inward): RTL emoji is left → grow right; LTR emoji is right → grow left.
      const rtl = document.documentElement.dir === 'rtl';
      let left = rtl ? rect.left : rect.right - panelW;
      if (left + panelW > window.innerWidth - margin) {
        left = window.innerWidth - panelW - margin;
      }
      left = Math.max(margin, left);
      let top = rect.top - panelH - margin;
      if (top < margin) {
        top = rect.bottom + margin;
      }
      this.emojiPopoverStyle = {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
      };
    },
    clearEmojiHoverTimers() {
      if (this.emojiHoverOpenTimer) {
        clearTimeout(this.emojiHoverOpenTimer);
        this.emojiHoverOpenTimer = null;
      }
      if (this.emojiHoverCloseTimer) {
        clearTimeout(this.emojiHoverCloseTimer);
        this.emojiHoverCloseTimer = null;
      }
    },
    onEmojiBtnHoverEnter() {
      if (this.isMobileEmojiMode || this.emojiSidebarOpen || this.voiceRecording) return;
      if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches) return;
      this.clearEmojiHoverTimers();
      this.emojiHoverMounted = true;
      this.emojiHoverOpen = true;
      this.$nextTick(() => this.positionEmojiPopover());
    },
    onEmojiBtnHoverLeave() {
      if (this.isMobileEmojiMode || this.stickerSettingsOpen) return;
      this.clearEmojiHoverTimers();
      this.emojiHoverCloseTimer = setTimeout(() => {
        this.emojiHoverCloseTimer = null;
        if (this.stickerSettingsOpen) return;
        this.emojiHoverOpen = false;
      }, 80);
    },
    onEmojiPopoverEnter() {
      this.clearEmojiHoverTimers();
    },
    onEmojiPopoverLeave() {
      if (this.stickerSettingsOpen) return;
      this.clearEmojiHoverTimers();
      this.emojiHoverCloseTimer = setTimeout(() => {
        this.emojiHoverCloseTimer = null;
        if (this.stickerSettingsOpen) return;
        this.emojiHoverOpen = false;
      }, 80);
    },
    /** Host sticker settings outside the hover popover so it is not destroyed on mouseleave. */
    openHoverStickerSettings() {
      this.clearEmojiHoverTimers();
      this.stickerSettingsOpen = true;
      this.emojiHoverOpen = false;
    },
    onHoverStickerPacksChanged() {
      this.$refs.emojiHoverPicker?.refreshStickerPacks?.({ sync: false });
      this.$refs.emojiPicker?.refreshStickerPacks?.({ sync: false });
      this.$emit('sticker-packs-changed');
    },
    closeEmojiPanel() {
      this.bumpComposerSurfaceGen();
      this.emojiOpen = false;
      this.emojiHoverOpen = false;
      this.clearEmojiHoverTimers();
      this.pendingKeyboardInset = false;
      this.clearComposerSurfaceTransition();
      this.lastKeyboardOffsetTop = 0;
      // Never clear composer text here — sticker suggest depends on it.
      this.emitAccessoryState();
      if (!this.isMobileEmojiMode) {
        this.$emit('emoji-sidebar-change', { open: false, mode: this.lastEmojiPanelMode });
      }
    },
    /**
     * Begin panel → keyboard height swap. Callers decide whether to restore a
     * snapshotted caret (toggle button) or keep the native tap caret (field).
     */
    beginPanelToKeyboardTransition() {
      if (!this.isMobileEmojiMode) return null;
      if (this.surfaceTransition === 'to-keyboard' && this.pendingKeyboardInset && !this.emojiOpen) {
        return this._composerSurfaceGen;
      }
      const gen = this.bumpComposerSurfaceGen();
      this.clearComposerFocusTimers();
      this.ensureEmojiPanelHeight();
      this.surfaceTransition = 'to-keyboard';
      this.pendingKeyboardInset = true;
      this.emojiOpen = false;
      this.composerInputMode = 'text';
      this.emitAccessoryState();
      this.scheduleInsetFallback(gen);
      return gen;
    },
    /**
     * Telegram: panel → soft keyboard via the toggle button.
     * Focuses the composer in the same user gesture so the soft keyboard may open.
     */
    openComposerKeyboardFromPanel() {
      if (this.beginPanelToKeyboardTransition() == null) return;
      this.keepComposerCaret({ keyboard: true });
      this.pinScrollToBottomForKeyboard();
    },
    /**
     * Telegram: soft keyboard / closed → last selected panel (emoji/gif/stickers).
     */
    openComposerPanel() {
      if (!this.isMobileEmojiMode) return;
      this.bumpComposerSurfaceGen();
      this.clearComposerFocusTimers();
      this.snapshotInputSelection();
      this.ensureEmojiPanelHeight();
      const vv = window.visualViewport;
      this.lastKeyboardOffsetTop = Math.round(vv?.offsetTop || 0);
      this.surfaceTransition = 'to-panel';
      // Lock accessory first so shell height doesn't jump, then show picker.
      this.pendingKeyboardInset = true;
      this.composerInputMode = 'none';
      this.keyboardOpen = false;
      // Blur immediately so the soft keyboard starts dismissing in this gesture;
      // caret is restored with inputmode=none after the panel is up.
      this.blurComposer();
      this.emitAccessoryState();
      this.emojiOpen = true;
      this.pendingKeyboardInset = false;
      this.surfaceTransition = null;
      this.emitAccessoryState();
      this.$nextTick(() => {
        const picker = this.$refs.emojiPicker;
        if (picker && typeof picker.setMode === 'function') {
          picker.setMode(this.lastEmojiPanelMode);
        }
        this.keepComposerCaret({ keyboard: false });
      });
    },
    toggleEmojiPanel() {
      if (this.isMobileEmojiMode) {
        // Already opened from pointerdown (keyboard → panel).
        if (this._emojiToggleFromPointer) {
          this._emojiToggleFromPointer = false;
          return;
        }
        this.clearComposerFocusTimers();
        // Mid to-panel: already opening.
        if (this.surfaceTransition === 'to-panel') return;
        // Mid panel→keyboard: a second tap means the user wants the panel back.
        if (this.surfaceTransition === 'to-keyboard' || (this.pendingKeyboardInset && !this.emojiOpen)) {
          this.openComposerPanel();
          return;
        }
        if (this.emojiOpen) {
          this.openComposerKeyboardFromPanel();
          return;
        }
        this.openComposerPanel();
        return;
      }
      // Desktop: close hover popover, then open/close right sidebar emoji panel.
      this.emojiHoverOpen = false;
      this.clearEmojiHoverTimers();
      this.snapshotInputSelection();
      if (this.emojiSidebarOpen) {
        this.$emit('emoji-sidebar-change', { open: false, mode: this.lastEmojiPanelMode });
        return;
      }
      this.$emit('emoji-sidebar-change', { open: true, mode: this.lastEmojiPanelMode });
    },
    onComposerFocus() {
      this.composerFocused = true;
      if (this.isMobileEmojiMode) {
        // Controlled swap already in flight — do not stack another transition.
        if (this.surfaceTransition === 'to-keyboard' || this.pendingKeyboardInset) {
          this.snapshotInputSelection();
          return;
        }
        if (this.emojiOpen) {
          // Only swap panel → keyboard when the user wants to type (inputmode text).
          // Focusing with inputmode=none keeps the caret while the emoji dock stays.
          // Do not restore a caret snapshot here — pointer/tap already placed it.
          if (this.composerInputMode === 'text') {
            this.beginPanelToKeyboardTransition();
          }
          this.snapshotInputSelection();
          return;
        }
      }
      this.snapshotInputSelection();
      if (this.pendingKeyboardInset) return;
      if (!this.emojiOpen) this.measureKeyboardHeight();
      this.emitAccessoryState();
    },
    onComposerBlur() {
      this.$nextTick(() => {
        if (this.inputMenu.visible) return;
        const el = this.$refs.input;
        if (el && document.activeElement === el) {
          this.composerFocused = true;
          return;
        }
        this.composerFocused = false;
        // While the emoji panel is open we already snapshotted BEFORE blur —
        // re-reading selection after blur often collapses to 0 on mobile.
        if (this.emojiOpen || this.surfaceTransition) return;
        this.snapshotInputSelection();
      });
      // While holding/recording voice, ignore blur so keyboard/emoji dock stay put.
      if (this.voiceRecording || this.voicePointerActive) return;
      if (!this.isMobileEmojiMode || this.emojiOpen || this.pendingKeyboardInset) return;
      this.emitAccessoryState();
    },
    onEmojiSelect(emoji) {
      this.insertEmoji(emoji);
    },
    onEmojiBackspace() {
      const ta = this.$refs.input;
      const text = String(this.text || '');
      if (!text) return;
      const isFocused = ta && document.activeElement === ta;
      let start;
      let end;
      if (isFocused && Number.isFinite(ta.selectionStart) && Number.isFinite(ta.selectionEnd)) {
        start = ta.selectionStart;
        end = ta.selectionEnd;
      } else if (
        this.inputSel
        && Number.isFinite(this.inputSel.start)
        && Number.isFinite(this.inputSel.end)
      ) {
        start = Math.max(0, Math.min(text.length, this.inputSel.start));
        end = Math.max(0, Math.min(text.length, this.inputSel.end));
      } else {
        start = text.length;
        end = text.length;
      }
      let next;
      let pos;
      if (start !== end) {
        next = `${text.slice(0, start)}${text.slice(end)}`;
        pos = start;
      } else if (start <= 0) {
        return;
      } else {
        const before = text.slice(0, start);
        const after = text.slice(start);
        const trimmed = deleteLastGrapheme(before);
        next = `${trimmed}${after}`;
        pos = trimmed.length;
      }
      this.text = next;
      this.inputSel = { start: pos, end: pos };
      this.onTyping();
      this.$nextTick(() => {
        if (ta && typeof ta.setSelectionRange === 'function') {
          try { ta.setSelectionRange(pos, pos); } catch (e) { /* noop */ }
        }
        this.autoResize();
        if (this.emojiOpen && this.isMobileEmojiMode) {
          this.keepComposerCaret({ keyboard: false });
        }
      });
    },
    async onSendGifFromPanel(payload) {
      let blob = payload?.blob || null;
      if (!blob && payload?.id) {
        const { getGifBlob } = await import('./stickerGifLibrary');
        blob = await getGifBlob(payload.id);
      }
      if (!(blob instanceof Blob)) return;
      const mime = String(payload?.mime || blob.type || 'image/gif').toLowerCase();
      const isVideo = !!payload?.isVideo || mime.startsWith('video/') || /\.(mp4|webm)$/i.test(payload?.name || '');
      const type = isVideo ? 'video' : 'photo';
      const ext = isVideo
        ? (mime.includes('webm') ? 'webm' : 'mp4')
        : (mime.includes('webp') ? 'webp' : 'gif');
      const file = blob instanceof File
        ? blob
        : new File([blob], payload?.name || `animation.${ext}`, { type: mime || (isVideo ? 'video/mp4' : 'image/gif') });
      const localUrl = URL.createObjectURL(blob);
      this.$emit('send-media', {
        file,
        type,
        caption: '',
        width: payload?.width || null,
        height: payload?.height || null,
        duration: null,
        localUrl,
        silent: true,
        animation: true,
      });
    },
    openStickerComposer(payload = null) {
      const packId = payload?.packId || null;
      this.stickerComposer = {
        open: true,
        mode: packId ? 'add' : 'pack',
        files: [],
        editSticker: null,
        targetPackId: packId,
      };
    },
    openStickerEditor(sticker) {
      this.stickerComposer = {
        open: true,
        mode: 'edit',
        files: [],
        editSticker: sticker || null,
        targetPackId: sticker?.packId || null,
      };
    },
    onStickerComposerSaved(payload) {
      const refresh = (picker) => {
        if (!picker || typeof picker.refreshStickerPacks !== 'function') return;
        // Skip remote sync once so local data: previews aren't raced away.
        picker.refreshStickerPacks({ sync: false });
        if (payload?.packId) {
          picker.packViewId = payload.packId;
          picker.activePackId = payload.packId;
        }
        setTimeout(() => {
          if (typeof picker.syncRemotePacks === 'function') picker.syncRemotePacks();
        }, 800);
      };
      refresh(this.$refs.emojiPicker);
      this.$emit('sticker-packs-changed', payload);
    },
    onOpenStickerPack(payload) {
      const packId = payload?.packId || null;
      const msg = payload?.message || null;
      const meta = msg?.meta || {};
      let fallback = null;
      if (payload?.stickerId) {
        fallback = findStickerById(payload.stickerId);
      }
      const previewSrc = payload?.src
        || payload?.cdn_url
        || meta.cdn_url
        || meta.local_url
        || (fallback?.src || null);
      if (!fallback) {
        fallback = {
          id: payload?.stickerId || `tmp_${Date.now()}`,
          emoji: payload?.emoji || meta.sticker_emoji || '⭐',
          kind: payload?.kind || meta.sticker_kind || (previewSrc ? 'image' : 'emoji'),
          src: previewSrc,
          mediaId: payload?.mediaId || meta.media_id || null,
          width: payload?.width || meta.width || null,
          height: payload?.height || meta.height || null,
          packId,
        };
      } else if (previewSrc && !fallback.src) {
        fallback = {
          ...fallback,
          src: previewSrc,
          kind: 'image',
          mediaId: fallback.mediaId || payload?.mediaId || meta.media_id || null,
        };
      }
      const pack = packId ? findPackById(packId) : null;
      this.stickerPackSheet = {
        open: true,
        packId: pack?.id || packId,
        fallback,
        seedStickers: this.collectPackStickersFromChat(pack?.id || packId, fallback),
      };
    },
    collectPackStickersFromChat(packId, fallback = null) {
      const byId = new Map();
      const push = (st) => {
        if (!st?.id) return;
        const id = String(st.id);
        const prev = byId.get(id);
        if (!prev) {
          byId.set(id, st);
          return;
        }
        if ((!prev.src || prev.kind === 'emoji') && st.src) {
          byId.set(id, { ...prev, ...st, kind: 'image', src: st.src });
        }
      };
      if (fallback) push(fallback);
      if (!packId) return [...byId.values()];
      const pid = String(packId);
      (this.messages || []).forEach((m) => {
        if (!(m?.meta?.sticker) || m?.type !== 'photo') return;
        if (String(m.meta.sticker_pack_id || '') !== pid) return;
        const src = m.meta.cdn_url
          || m.meta.local_url
          || (m.meta.url && !String(m.meta.url).includes('/messenger/media/') ? m.meta.url : null);
        push({
          id: m.meta.sticker_id || `msg_${m.id || m.client_id}`,
          emoji: m.meta.sticker_emoji || '⭐',
          kind: m.meta.sticker_kind || (src ? 'image' : 'emoji'),
          src,
          mediaId: m.meta.media_id || null,
          width: m.meta.width || null,
          height: m.meta.height || null,
        });
      });
      return [...byId.values()];
    },
    closeStickerPackSheet() {
      this.stickerPackSheet = {
        open: false,
        packId: null,
        fallback: null,
        seedStickers: [],
      };
    },
    onStickerPackSend(payload) {
      this.onSendStickerFromPanel(payload);
    },
    onStickerPackChanged(payload) {
      const picker = this.$refs.emojiPicker;
      if (!picker || typeof picker.refreshStickerPacks !== 'function') return;
      // After uninstall, do not immediately re-sync owned packs back into "installed".
      if (payload?.action === 'uninstall') {
        picker.refreshStickerPacks({ sync: false });
        return;
      }
      picker.refreshStickerPacks({ sync: true });
    },
    onEmptyChatGreet(variant) {
      if (!variant?.emoji) return;
      this.onSendStickerFromPanel({
        id: variant.stickerId || `greet_${variant.id}`,
        emoji: variant.emoji,
        kind: 'emoji',
        packId: 'greetings',
      });
    },
    async onSendStickerFromPanel(payload) {
      if (!payload) return;
      const mediaId = payload.mediaId || payload.media_id || null;
      let localUrl = null;
      // Only use inline previews for optimistic paint — never broken http CDN URLs.
      if (payload.src && (String(payload.src).startsWith('data:') || String(payload.src).startsWith('blob:'))) {
        localUrl = payload.src;
      }
      if (mediaId && payload.kind === 'image') {
        if (payload.src && (String(payload.src).startsWith('data:') || String(payload.src).startsWith('blob:'))) {
          try {
            const res = await fetch(payload.src);
            const blob = await res.blob();
            const { putCachedStickerBlob } = await import('./stickerGifLibrary');
            if (payload.id && blob) await putCachedStickerBlob(payload.id, blob);
            localUrl = URL.createObjectURL(blob);
          } catch (e) {
            localUrl = payload.src;
          }
        }
        this.$emit('send-media', {
          file: null,
          mediaId,
          type: 'photo',
          caption: '',
          width: payload.width || 512,
          height: payload.height || 512,
          duration: null,
          localUrl,
          silent: false,
          animation: false,
          sticker: true,
          stickerId: payload.id || null,
          stickerPackId: payload.packId || null,
          stickerEmoji: payload.emoji || null,
          stickerKind: payload.kind || 'image',
        });
        return;
      }
      let blob = null;
      let mime = 'image/png';
      let name = `sticker-${payload.id || 'x'}.png`;
      if (payload.kind === 'image' && payload.src) {
        try {
          if (String(payload.src).startsWith('data:') || String(payload.src).startsWith('blob:')) {
            const res = await fetch(payload.src);
            blob = await res.blob();
          } else if (/^https?:\/\//i.test(String(payload.src))) {
            const res = await fetch(payload.src, { mode: 'cors', credentials: 'omit' });
            if (res.ok) blob = await res.blob();
          }
          if (blob) {
            mime = blob.type || 'image/png';
            const ext = mime.includes('webp') ? 'webp' : (mime.includes('gif') ? 'gif' : 'png');
            name = `sticker-${payload.id || 'x'}.${ext}`;
          }
        } catch (e) {
          blob = null;
        }
      }
      if (!blob && payload.emoji) {
        try {
          blob = await emojiToStickerBlob(payload.emoji, 512);
          mime = 'image/png';
        } catch (e) {
          blob = null;
        }
      }
      if (!(blob instanceof Blob)) return;
      try {
        const { putCachedStickerBlob } = await import('./stickerGifLibrary');
        if (payload.id) await putCachedStickerBlob(payload.id, blob);
      } catch (e) { /* noop */ }
      const file = new File([blob], name, { type: mime });
      localUrl = URL.createObjectURL(blob);
      this.$emit('send-media', {
        file,
        type: 'photo',
        caption: '',
        width: 512,
        height: 512,
        duration: null,
        localUrl,
        silent: false,
        animation: false,
        sticker: true,
        stickerId: payload.id || null,
        stickerPackId: payload.packId || null,
        stickerEmoji: payload.emoji || null,
        stickerKind: payload.kind || (payload.src ? 'image' : 'emoji'),
      });
    },
    async addMessageGifToLibrary(message) {
      const url = message?.meta?.url || message?.meta?.local_url;
      if (!url) return;
      const sourceKey = `msg:${message.id || message.client_id || url}`;
      if (isGifSaved(sourceKey)) return;
      try {
        const { blobUrl } = await downloadMedia(url, { message });
        const res = await fetch(blobUrl || url);
        const blob = await res.blob();
        await addGifToLibrary({
          blob,
          mime: message?.meta?.mime || blob.type,
          width: message?.meta?.width,
          height: message?.meta?.height,
          sourceKey,
          name: message?.meta?.name || `gif-${message?.id || 'saved'}.gif`,
        });
        const picker = this.$refs.emojiPicker;
        if (picker && typeof picker.refreshGifs === 'function') picker.refreshGifs();
      } catch (e) { /* noop */ }
    },
    insertEmoji(emoji) {
      const ta = this.$refs.input;
      const text = String(this.text || '');
      const isFocused = ta && document.activeElement === ta;
      let start;
      let end;
      if (isFocused && Number.isFinite(ta.selectionStart) && Number.isFinite(ta.selectionEnd)) {
        start = ta.selectionStart;
        end = ta.selectionEnd;
      } else if (
        this.inputSel
        && Number.isFinite(this.inputSel.start)
        && Number.isFinite(this.inputSel.end)
      ) {
        // Prefer last caret snapshot (taken on blur / select before emoji panel).
        start = Math.max(0, Math.min(text.length, this.inputSel.start));
        end = Math.max(0, Math.min(text.length, this.inputSel.end));
      } else {
        // Never default to 0 — append at end when we have no caret info.
        start = text.length;
        end = text.length;
      }
      this.text = `${text.slice(0, start)}${emoji}${text.slice(end)}`;
      const pos = start + emoji.length;
      this.inputSel = { start: pos, end: pos };
      this.onTyping();
      this.$nextTick(() => {
        if (ta && typeof ta.setSelectionRange === 'function') {
          try { ta.setSelectionRange(pos, pos); } catch (e) { /* noop */ }
        }
        this.autoResize();
        if (this.emojiOpen && this.isMobileEmojiMode) {
          this.keepComposerCaret({ keyboard: false });
        } else if (!this.emojiOpen || !this.isMobileEmojiMode) {
          this.focusInput(!this.isMobileEmojiMode);
        }
      });
    },
    openMsgMenu({ event, message, albumMessageIds = null, albumMessages = null }) {
      // Keyboard / emoji / GIF / sticker panel: first tap only dismisses.
      if (this.consumeChatAccessoryTap()) return;
      // Soft keyboard must dismiss before the menu paints (Telegram mobile).
      this.blurComposer();
      this.closeInputMenu();
      const ids = Array.isArray(albumMessageIds) ? albumMessageIds.filter(Boolean) : null;
      const x = Number(event?.clientX);
      const y = Number(event?.clientY);
      this.msgMenu = {
        visible: true,
        x: Number.isFinite(x) ? x : Math.round(window.innerWidth / 2),
        y: Number.isFinite(y) ? y : Math.round(window.innerHeight / 2),
        message,
        albumMessageIds: ids && ids.length > 1 ? ids : null,
        albumMessages: Array.isArray(albumMessages) && albumMessages.length > 1 ? albumMessages : null,
      };
    },
    onMsgMenuSelect(item) {
      const m = this.msgMenu.message;
      if (!m) return;
      const albumIds = this.msgMenu.albumMessageIds;
      const albumMessages = this.msgMenu.albumMessages;
      // Actions that hand focus back to the chat should close the pinned sheet.
      if (['reply', 'edit', 'forward', 'select'].includes(item.value)) {
        this.pinnedSheetOpen = false;
      }
      if (item.value === 'reply') this.onReply(m);
      else if (item.value === 'copy') {
        if (m.type === 'location' && m.meta?.lat != null && m.meta?.lng != null) {
          this.copyText(mapsUrl(m.meta.lat, m.meta.lng));
        } else if (isMediaType(m.type)) {
          this.copyText((m.body || '').trim() || this.$t(mediaTypeLabelKey(m.type)));
        } else {
          this.copyText(m.body || '');
        }
      }
      else if (item.value === 'forward') {
        this.$emit('open-forward', { messageIds: [m.id], dropAuthor: false });
      } else if (item.value === 'save') {
        this.saveMessagesToSaved([m.id], [m]);
      } else if (item.value === 'download') {
        this.downloadMessageMedia(m);
      } else if (item.value === 'add-gif') {
        this.addMessageGifToLibrary(m);
      } else if (item.value === 'select') {
        this.$store.commit('messenger/SET_SELECTION_MODE', true);
        if (albumIds && albumIds.length > 1) {
          albumIds.forEach((id) => this.$store.commit('messenger/TOGGLE_SELECT', id));
        } else {
          this.$store.commit('messenger/TOGGLE_SELECT', m.id);
        }
      } else if (item.value === 'pin') this.requestPin(m);
      else if (item.value === 'unpin') this.unpinOne(m);
      else if (item.value === 'edit') this.onEdit(m);
      else if (item.value === 'delete') this.onDelete(m, albumIds);
      else if (item.value === 'retry-failed') this.onRetryMessage(m);
      else if (item.value === 'view-sticker-pack') {
        this.onOpenStickerPack({
          packId: m.meta?.sticker_pack_id || null,
          stickerId: m.meta?.sticker_id || null,
          emoji: m.meta?.sticker_emoji || null,
          kind: m.meta?.sticker_kind || 'image',
          src: m.meta?.cdn_url || m.meta?.local_url || null,
          cdn_url: m.meta?.cdn_url || null,
          mediaId: m.meta?.media_id || null,
          width: m.meta?.width || null,
          height: m.meta?.height || null,
          message: m,
        });
      }
      else if (item.value === 'delete-failed') {
        if (Array.isArray(albumMessages) && albumMessages.length > 1) {
          albumMessages.forEach((msg) => {
            if (msg?.client_id) this.$emit('delete-failed-message', msg);
          });
        } else {
          this.$emit('delete-failed-message', m);
        }
      }
      if (['reply', 'edit'].includes(item.value)) {
        this.scheduleComposerFocus({ openKeyboard: true });
      } else if (!['select', 'forward', 'delete'].includes(item.value)) {
        this.scheduleComposerFocus({ openKeyboard: false });
      }
    },
    async downloadMessageMedia(message) {
      const url = message?.meta?.url || message?.meta?.local_url;
      if (!url) return;
      const rawName = message?.meta?.name || message?.meta?.file_name || '';
      const extFallback = {
        photo: 'jpg',
        video: 'mp4',
        audio: 'mp3',
        voice: 'ogg',
      }[message?.type] || 'bin';
      const fileName = rawName || `${message?.type || 'media'}-${message?.id || 'file'}.${extFallback}`;
      try {
        await saveMediaToDevice(url, fileName);
      } catch (e) { /* noop */ }
    },
    toggleSelect(messageId) {
      this.$store.commit('messenger/TOGGLE_SELECT', messageId);
    },
    onEnterSelect(messageId) {
      // Long-press: dismiss keyboard + blur, then enter selection (Telegram).
      this.blurComposer();
      this.closeInputMenu();
      this.msgMenu.visible = false;
      this.$store.commit('messenger/SET_SELECTION_MODE', true);
      this.$store.commit('messenger/TOGGLE_SELECT', messageId);
    },
    onEnterSelectAlbum(ids) {
      const list = Array.isArray(ids) ? ids : [];
      if (!list.length) return;
      this.blurComposer();
      this.closeInputMenu();
      this.msgMenu.visible = false;
      this.$store.commit('messenger/SET_SELECTION_MODE', true);
      list.forEach((id) => this.$store.commit('messenger/TOGGLE_SELECT', id));
    },
    // Close transient overlays on a back-button press. Returns true if one was open.
    handleBack() {
      // Message context menu first (OS back should dismiss it immediately).
      if (this.msgMenu.visible) { this.msgMenu.visible = false; return true; }
      if (this.inputMenu.visible) { this.closeInputMenu(); return true; }
      if (this.showMenu) { this.showMenu = false; return true; }
      if (this.forwardMenuOpen) { this.forwardMenuOpen = false; return true; }
      if (this.pendingForward) { this.cancelPendingForward(); return true; }
      if (this.searchMode) { this.exitSearchMode(); return true; }
      if (this.selectionMode) { this.exitSelection(); return true; }
      if (this.pinChoice.open) { this.cancelPin(); return true; }
      // Media editor / attach must close before leaving the chat.
      if (this.mediaCompose.open) { this.closeMediaCompose(); return true; }
      if (this.attachSheet.open) { this.attachSheet.open = false; return true; }
      if (this.mediaViewer.open) { this.closeMediaViewer(); return true; }
      if (this.locationSheet.open) { this.locationSheet.open = false; return true; }
      if (this.pinnedSheetOpen) { this.pinnedSheetOpen = false; return true; }
      if (this.voiceRecording) {
        try { this.cancelVoiceRecord?.(); } catch (e) { /* noop */ }
        return true;
      }
      if (this.emojiOpen || this.pendingKeyboardInset || this.surfaceTransition) {
        this.closeEmojiPanel();
        return true;
      }
      if (this.emojiSidebarOpen) {
        this.$emit('emoji-sidebar-change', { open: false, mode: this.lastEmojiPanelMode });
        return true;
      }
      return false;
    },
    /** Soft-keyboard dismiss for OS back — stay in chat with caret ready. */
    dismissSoftKeyboard() {
      // Cancel any in-flight panel↔keyboard swap so fallback cannot reopen a panel.
      this.bumpComposerSurfaceGen();
      this.pendingKeyboardInset = false;
      this.clearComposerSurfaceTransition();
      this.composerInputMode = 'none';
      this.keyboardOpen = false;
      this.blurComposer();
      this.emitAccessoryState();
      this.$nextTick(() => this.keepComposerCaret({ keyboard: false }));
    },
    cancelPendingForward() {
      this.forwardMenuOpen = false;
      this.$store.commit('messenger/CLEAR_PENDING_FORWARD');
    },
    joinForwardNames(names) {
      const list = (names || []).filter(Boolean);
      if (!list.length) return '';
      const and = this.$t('messenger.and');
      if (list.length === 1) return list[0];
      if (list.length === 2) return `${list[0]} ${and} ${list[1]}`;
      // Cap display at 3 names for the subtitle.
      const shown = list.slice(0, 3);
      if (list.length > 3) {
        return `${shown.join('، ')} ${and} …`;
      }
      const last = shown[shown.length - 1];
      const rest = shown.slice(0, -1).join('، ');
      return `${rest} ${and} ${last}`;
    },
    onForwardMenu(action) {
      this.forwardMenuOpen = false;
      if (action === 'cancel') {
        this.cancelPendingForward();
        return;
      }
      if (action === 'hide-sender' && this.pendingForward) {
        this.$store.commit(
          'messenger/SET_PENDING_FORWARD_DROP_AUTHOR',
          !this.pendingForward.dropAuthor,
        );
      }
    },
    onScrollBoxClick(e) {
      if (!this.selectionMode) return;
      // Tap empty chrome / padding (not a message row) exits selection.
      if (e.target.closest('[data-mid], .msg-select-circle, button, a, label, input, textarea')) return;
      this.exitSelection();
    },
    exitSelection() {
      this.$store.commit('messenger/CLEAR_SELECTION');
    },
    selectAllMessages() {
      const ids = (this.messages || [])
        .map((m) => m?.id)
        .filter((id) => id != null);
      if (!ids.length) return;
      this.$store.commit('messenger/SELECT_ALL', ids);
    },
    replySelected() {
      if (this.selectedCount !== 1) return;
      const m = this.selectedMessages[0];
      if (!m) return;
      this.onReply(m);
    },
    async saveSelected() {
      if (!this.selectedCount) return;
      const ids = [...this.selectedIds];
      const messages = [...this.selectedMessages];
      this.exitSelection();
      await this.saveMessagesToSaved(ids, messages);
    },
    async saveMessagesToSaved(ids, messages) {
      const list = (ids || []).filter((id) => id != null && Number(id) > 0);
      if (!list.length) return;
      const sources = (messages || []).filter((m) => list.some((id) => Number(id) === Number(m?.id)));
      try {
        const conv = await this.$store.dispatch('messenger/openSavedMessages');
        if (!conv?.id) throw new Error('saved_unavailable');
        await this.$store.dispatch('messenger/forwardMessagesAction', {
          messageIds: list,
          toConversationId: conv.id,
          dropAuthor: false,
          sourceMessages: sources.length ? sources : messages || [],
        });
      } catch (e) {
        const detail = e?.response?.data?.message || e?.message || e;
        console.warn('[messenger] save to Saved Messages failed', detail, e?.response?.status);
      }
    },
    copySelected() {
      const text = this.selectedMessages.map((m) => m.body).filter(Boolean).join('\n');
      this.copyText(text);
      this.exitSelection();
    },
    forwardSelected() {
      if (!this.selectedCount) return;
      this.$emit('open-forward', { messageIds: [...this.selectedIds], dropAuthor: false });
    },
    deleteSelected() {
      if (!this.selectedCount) return;
      if (!this.selectionAllMine && !this.canDeleteOthersMessages) return;
      this.$emit('request-delete-selected', [...this.selectedIds]);
    },
    copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => { });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
    },
    scrollToBottom(smooth = false) {
      const el = this.$refs.scrollBox;
      if (!el) return;
      if (smooth && typeof el.scrollTo === 'function') {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    },
    isCoarsePointer() {
      // Touch devices (phones/tablets) where focusing the composer would pop the
      // soft keyboard open unexpectedly.
      return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(pointer: coarse)').matches;
    },
    focusInput(force = false) {
      // force=true → user intends to type (reply/edit/send) → allow keyboard.
      this.scheduleComposerFocus({ openKeyboard: !!force });
    },
    isSoftKeyboardOpen() {
      if (typeof window === 'undefined') return false;
      const vv = window.visualViewport;
      if (vv && Number.isFinite(vv.height) && Number.isFinite(window.innerHeight)) {
        if ((window.innerHeight - vv.height) > 120) return true;
      }
      const el = this.$refs.input;
      return !!(el && document.activeElement === el && this.composerInputMode !== 'none');
    },
    onComposerPointerDown() {
      // User tapped the field — always open the soft keyboard and keep the
      // native caret where they tapped (do not restore a snapshot).
      this.clearComposerFocusTimers();
      this._pinBottomOnKeyboard = this.atBottom;
      this.composerInputMode = 'text';
      if (!this.isMobileEmojiMode) return;
      if (this.surfaceTransition === 'to-keyboard' || (this.pendingKeyboardInset && !this.emojiOpen)) {
        return;
      }
      if (this.emojiOpen) {
        this.beginPanelToKeyboardTransition();
      }
    },
    scheduleComposerFocus({ openKeyboard = false } = {}) {
      // Telegram-like: keep caret ready, but on mobile never pop the keyboard
      // unless it was already open or the caller explicitly wants typing.
      this.clearComposerFocusTimers();
      const run = () => {
        if (this.voiceRecording || this.mediaCompose?.open || this.mediaViewer?.open) return;
        if (this.searchMode || this.selectionMode) return;
        if (this.attachSheet?.open || this.locationSheet?.open || this.pinChoice?.open) return;
        if (this.msgMenu?.visible || this.showMenu || this.forwardMenuOpen) return;
        if (this.pinnedSheetOpen || this.emojiOpen || this.emojiSidebarOpen) return;

        const el = this.$refs.input;
        if (!el || typeof el.focus !== 'function') return;

        const coarse = this.isCoarsePointer();
        // Always use inputmode=none when we do not want the keyboard — even if
        // the KB is still mid-close (otherwise it immediately reopens).
        if (coarse && !openKeyboard) {
          this.composerInputMode = 'none';
        } else {
          this.composerInputMode = 'text';
        }

        try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
        this.composerFocused = true;
      };
      this._composerFocusTimers = [
        setTimeout(() => { this.$nextTick(() => { run(); }); }, 0),
        setTimeout(run, 40),
        setTimeout(run, 160),
      ];
    },
    onMsgMenuClose() {
      this.msgMenu.visible = false;
      this.scheduleComposerFocus({ openKeyboard: false });
    },
    onAttachSheetClose() {
      this.attachSheet.open = false;
      this.scheduleComposerFocus({ openKeyboard: false });
    },
    onChatSurfacePointerDown(e) {
      this._accScrollGesture = false;
      if (this.isChatChromeTarget(e?.target)) {
        this._accPtr = null;
        return;
      }
      if (!this.isComposerAccessoryOpen()) {
        this._accPtr = null;
        return;
      }
      this._accPtr = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        moved: false,
      };
    },
    onChatSurfacePointerMove(e) {
      const g = this._accPtr;
      if (!g || g.id !== e.pointerId) return;
      if (Math.abs(e.clientX - g.x) > 12 || Math.abs(e.clientY - g.y) > 12) {
        g.moved = true;
      }
    },
    onChatSurfacePointerUp(e) {
      const g = this._accPtr;
      this._accPtr = null;
      if (!g || g.id !== e.pointerId) return;
      if (g.moved) {
        this._accScrollGesture = true;
        return;
      }
      if (this.isChatChromeTarget(e?.target)) return;
      this.consumeChatAccessoryTap();
    },
    isChatChromeTarget(t) {
      if (!t || typeof t.closest !== 'function') return false;
      return !!t.closest(
        '.composer-bar, .composer-sticker-suggest, .emoji-keyboard-dock, .ctx-menu-root, .tg-menu, .chat-chrome-slot, .chat-chrome-panel, input, textarea, [contenteditable="true"]',
      );
    },
    isComposerAccessoryOpen() {
      if (this.emojiOpen || this.emojiSidebarOpen || this.emojiHoverOpen) return true;
      if (this.pendingKeyboardInset) return true;
      if (this.keyboardOpen) return true;
      return this.isSoftKeyboardOpen();
    },
    dismissComposerAccessoryFromChat() {
      if (this.emojiHoverOpen) {
        this.clearEmojiHoverTimers();
        this.emojiHoverOpen = false;
      }
      // Always clear panel + pending inset (pending alone used to leave a stuck
      // spacer and let the 1s fallback reopen the wrong panel).
      if (this.emojiOpen || this.pendingKeyboardInset || this.surfaceTransition) {
        this.closeEmojiPanel();
      }
      if (this.emojiSidebarOpen) {
        this.$emit('emoji-sidebar-change', { open: false, mode: this.lastEmojiPanelMode });
      }
      this.dismissSoftKeyboard();
      this.suppressComposerUiClick(450);
    },
    /** True when this gesture should only close KB/panel (Telegram first-tap). */
    consumeChatAccessoryTap() {
      if (this._accScrollGesture) {
        this._accScrollGesture = false;
        return false;
      }
      if (this._suppressMsgActionUntil && Date.now() < this._suppressMsgActionUntil) {
        return true;
      }
      if (this._accPtr?.moved) return false;
      if (!this.isComposerAccessoryOpen()) return false;
      this.dismissComposerAccessoryFromChat();
      this._suppressMsgActionUntil = Date.now() + 520;
      return true;
    },
    onChatSurfaceClick(e) {
      if (this.isChatChromeTarget(e?.target)) return;
      if (this.consumeChatAccessoryTap()) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e?.target && typeof e.target.closest === 'function') {
        if (e.target.closest('button, a, label, select, [data-media-interactive]')) return;
      }
      if (this.showStickerSuggestOverlay) return;
      if (this.isCoarsePointer()) {
        this.dismissKeyboardKeepCaret();
      } else {
        this.scheduleComposerFocus({ openKeyboard: false });
      }
    },
    blurComposer() {
      const el = this.$refs.input;
      if (el && typeof el.blur === 'function' && document.activeElement === el) {
        try { el.blur(); } catch (e) { /* noop */ }
      }
    },
    clearNewBadge() {
      this.showNewBadge = false;
      this.newCount = 0;
      this.firstUnreadId = null;
    },
    jumpToLatest() {
      // Do not touch composer focus — avoids soft-keyboard open/close jump.
      this.atBottom = true;
      this.scrolledUp = false;
      this.clearNewBadge();
      this.$nextTick(() => this.scrollToBottom(true));
    },
    onLoadMoreClick() {
      this.maybeLoadOlder();
    },
    maybeLoadOlder() {
      if (this.loadingMore || !this.hasMore) return;
      const el = this.$refs.scrollBox;
      this.loadingMore = true;
      this.pendingPrependHeight = el ? el.scrollHeight : null;
      // Safety net: never get stuck "loading" if no older messages come back.
      if (this.loadMoreWatchdog) clearTimeout(this.loadMoreWatchdog);
      this.loadMoreWatchdog = setTimeout(() => { this.loadingMore = false; }, 5000);
      this.$emit('load-more');
    },
    onScroll() {
      const el = this.$refs.scrollBox;
      if (!el) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      this.atBottom = distanceFromBottom < 80;
      this.scrolledUp = distanceFromBottom > 300;
      if (this.atBottom) this.clearNewBadge();
      if (el.scrollTop < 120) this.maybeLoadOlder();
    },
    onMessagesChange(newMsgs) {
      const convId = this.conversation?.id || null;
      const newLastId = newMsgs.length ? newMsgs[newMsgs.length - 1].id : null;
      const newFirstId = newMsgs.length ? newMsgs[0].id : null;
      const newLen = newMsgs.length;

      // 1) Conversation switched (or first mount) → reset state, pin to bottom.
      // Draft → real promote is the same chat — keep tracked ids / scroll.
      const draftPromote = this.trackedConvId === 'draft'
        && convId != null
        && convId !== 'draft';
      if (convId !== this.trackedConvId) {
        if (draftPromote) {
          this.trackedConvId = convId;
          this.lastFirstId = newFirstId;
          this.lastLastId = newLastId;
          this.lastLen = newLen;
          return;
        }
        this.trackedConvId = convId;
        this.clearNewBadge();
        this.loadingMore = false;
        this.pendingPrependHeight = null;
        this.atBottom = true;
        this.lastFirstId = newFirstId;
        this.lastLastId = newLastId;
        this.lastLen = newLen;
        this.$nextTick(() => { this.scrollToBottom(); this.focusInput(); });
        return;
      }

      // 2) Older messages prepended (load-more) → keep the viewport anchored
      //    relative to where the user currently is (even if they left the top).
      if (this.loadingMore && newFirstId !== this.lastFirstId && newLen > this.lastLen) {
        const prevHeight = this.pendingPrependHeight;
        const elNow = this.$refs.scrollBox;
        // Capture scroll BEFORE the DOM grows — then add the prepended delta so
        // scrolling back down mid-load never jumps the user up to the new top.
        const scrollBefore = elNow ? elNow.scrollTop : 0;
        if (this.loadMoreWatchdog) { clearTimeout(this.loadMoreWatchdog); this.loadMoreWatchdog = null; }
        this.$nextTick(() => {
          const el = this.$refs.scrollBox;
          if (el && prevHeight != null) {
            const delta = el.scrollHeight - prevHeight;
            el.scrollTop = scrollBefore + delta;
          }
          this.loadingMore = false;
          this.pendingPrependHeight = null;
        });
        this.lastFirstId = newFirstId;
        this.lastLastId = newLastId;
        this.lastLen = newLen;
        return;
      }

      // 3) New message(s) appended at the bottom.
      if (newLen > this.lastLen && newLastId !== this.lastLastId) {
        const idx = this.lastLastId != null ? newMsgs.findIndex((m) => m.id === this.lastLastId) : -1;
        const added = idx >= 0 ? newMsgs.slice(idx + 1) : newMsgs.slice(this.lastLen);
        const lastMsg = newMsgs[newMsgs.length - 1];
        const isMine = lastMsg && lastMsg.user_id === this.meId;
        const firstLoad = this.lastLastId == null;

        if (firstLoad || this.atBottom || isMine) {
          this.clearNewBadge();
          this.$nextTick(() => this.scrollToBottom());
        } else {
          const incoming = added.filter((m) => m.type !== 'system' && m.user_id !== this.meId);
          if (incoming.length) {
            if (!this.firstUnreadId) this.firstUnreadId = incoming[0].id;
            this.newCount += incoming.length;
            this.showNewBadge = true;
          } else {
            // Only my own / system messages added while scrolled up — follow them.
            this.$nextTick(() => this.scrollToBottom());
          }
        }
      }

      this.lastFirstId = newFirstId;
      this.lastLastId = newLastId;
      this.lastLen = newLen;
    },
    parseSystemMeta(message) {
      if (!message || message.type !== 'system' || !message.body) return null;
      try {
        return typeof message.body === 'string' ? JSON.parse(message.body) : message.body;
      } catch (e) {
        return null;
      }
    },
    systemParts(message) {
      if (message?.system_kind === 'cleared') {
        const text = (!message.system_by_me && message.system_actor)
          ? this.$t('messenger.historyClearedBy', { name: message.system_actor })
          : this.$t('messenger.historyCleared');
        return { clickable: false, text };
      }
      const meta = this.parseSystemMeta(message);
      if (!meta) {
        return { clickable: false, text: message?.system_text || this.$t('messenger.systemMessage') };
      }

      const event = meta.event || message.meta?.event;
      const name = meta.target_name || meta.actor_name || '';
      const userId = meta.target_id || meta.actor_id || null;
      let key = `messenger.sys_${event}`;
      if (event === 'created') {
        key = this.isChannel ? 'messenger.sys_channel_created' : 'messenger.sys_group_created';
      } else if (event === 'group_photo_changed' && this.isChannel) {
        key = 'messenger.sys_channel_photo_changed';
      } else if (event === 'group_name_changed' && this.isChannel) {
        key = 'messenger.sys_channel_name_changed';
      } else if (event === 'user_joined' && this.isChannel) {
        key = 'messenger.sys_channel_user_joined';
      } else if (event === 'user_left' && this.isChannel) {
        key = 'messenger.sys_channel_user_left';
      }
      const template = this.$t(key, { name: name || '…' });
      // Groups: clickable member name. Channels: plain text (event is private to that user).
      if (name && userId && this.isCommunity && !this.isChannel && String(template).includes(name)) {
        const idx = template.indexOf(name);
        return {
          clickable: true,
          before: template.slice(0, idx),
          name,
          after: template.slice(idx + name.length),
          user: {
            id: userId,
            first_name: name,
            username: meta.target_username || meta.actor_username || null,
          },
        };
      }
      const text = template !== key ? template : this.$t('messenger.systemMessage');
      return { clickable: false, text };
    },
    systemText(message) {
      const parts = this.systemParts(message);
      if (parts.text) return parts.text;
      if (parts.clickable) return `${parts.before}${parts.name}${parts.after}`;
      return message?.system_text || '';
    },
    // Locale used for menu timestamps (Persian by default, English when chosen).
    stampLocale() {
      return (this.$i18n && this.$i18n.locale === 'en') ? 'en-US' : 'fa-IR';
    },
    // today  → time only (am/pm)
    // yesterday → "yesterday" + time
    // older  → "5 month" + time
    formatStamp(t) {
      const d = new Date(t);
      if (Number.isNaN(d.getTime())) return '';
      const locale = this.stampLocale();
      const time = d.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const now = new Date();
      const today = now.toDateString();
      const yesterday = new Date(now.getTime() - 86400000).toDateString();
      if (d.toDateString() === today) return time;
      if (d.toDateString() === yesterday) return `${this.$t('messenger.yesterday')} ${time}`;
      const date = d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
      return `${date} ${time}`;
    },
  },
};
</script>

<style scoped>
/* Constrain message + composer column on wide chat panes (lg+). */
.chat-column {
  width: 100%;
}

@media (min-width: 1024px) {
  .chat-column {
    max-width: 45.5rem; /* ~728px — Telegram-like readable column */
    margin-inline: auto;
  }
}

.chat-frame {
  gap: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

/* Mic waves + lock rail must paint over messages (escape overflow clip). */
.chat-frame--lift {
  overflow: visible !important;
}
.chat-frame--lift .chat-messages-shell {
  z-index: 0;
}
.chat-frame--lift .composer-bar {
  z-index: 80;
  overflow: visible !important;
}
.chat-frame--lift .composer-bar .chat-column {
  overflow: visible !important;
}

.chat-chrome {
  margin: 0;
}

.chat-messages-shell {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/*
  Concave chrome crescents — physical left/right (JS maps list/profile for RTL).
  Wallpaper stays visible; no solid shell fill. None on mobile.
*/
.chat-messages-shell--scoop {
  --scoop-r: 16px;
  --scoop-chrome: #f4f4f5;
}
:global(.dark) .chat-messages-shell--scoop,
.dark .chat-messages-shell--scoop {
  --scoop-chrome: #0e1621;
}
.chat-messages-shell--scoop::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: var(--scoop-r) var(--scoop-r);
}
.chat-messages-shell--scoop.chat-messages-shell--left:not(.chat-messages-shell--right)::before {
  background-image:
    radial-gradient(circle at 100% 100%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r)),
    radial-gradient(circle at 100% 0%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r));
  background-position: left top, left bottom;
}
.chat-messages-shell--scoop.chat-messages-shell--right:not(.chat-messages-shell--left)::before {
  background-image:
    radial-gradient(circle at 0% 100%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r)),
    radial-gradient(circle at 0% 0%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r));
  background-position: right top, right bottom;
}
.chat-messages-shell--scoop.chat-messages-shell--left.chat-messages-shell--right::before {
  background-image:
    radial-gradient(circle at 100% 100%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r)),
    radial-gradient(circle at 100% 0%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r)),
    radial-gradient(circle at 0% 100%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r)),
    radial-gradient(circle at 0% 0%, transparent calc(var(--scoop-r) - 0.5px), var(--scoop-chrome) var(--scoop-r));
  background-position: left top, left bottom, right top, right bottom;
}
.chat-messages-shell--scoop .chat-messages-scroll {
  overflow-x: hidden;
  overflow-y: auto;
}
.chat-messages-shell--scoop.chat-messages-shell--left .chat-messages-scroll {
  border-top-left-radius: var(--scoop-r);
  border-bottom-left-radius: var(--scoop-r);
}
.chat-messages-shell--scoop.chat-messages-shell--right .chat-messages-scroll {
  border-top-right-radius: var(--scoop-r);
  border-bottom-right-radius: var(--scoop-r);
}

/* Slim, auto-hiding scrollbar that thickens slightly on hover.
   No arrow buttons, no track background. Desktop only — mobile has none. */
.chat-messages-scroll {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.25s ease;
  overflow-x: hidden;
  overscroll-behavior: contain;
  overscroll-behavior-x: none;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  /* Promote scroll layer — reduces compositor thrash with bubble transforms */
  transform: translateZ(0);
}

.chat-messages-scroll:hover {
  scrollbar-color: rgba(130, 130, 130, 0.45) transparent;
}

.chat-messages-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.chat-messages-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

.chat-messages-scroll::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  transition: background-color 0.25s ease, border-width 0.15s ease;
}

.chat-messages-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(130, 130, 130, 0.4);
}

.chat-messages-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(130, 130, 130, 0.7);
  border-width: 2px;
}

@media (max-width: 1023.98px) {
  .chat-frame,
  .chat-messages-shell {
    max-width: 100%;
    overflow-x: hidden;
  }
  .composer-bar,
  .chat-column {
    max-width: 100%;
    overflow-x: visible;
  }
  .chat-messages-scroll {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  .chat-messages-scroll::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
}

.chat-search-nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #ffffff;
  color: #4b5563;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
  border: 1px solid rgba(0, 0, 0, 0.06);
  opacity: 1;
  transform: none;
  transition: background-color 0.15s ease, transform 0.12s ease;
}

.chat-search-nav-btn:hover:not(:disabled) {
  background: #eef2f6;
  opacity: 1;
}

.chat-search-nav-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.chat-search-nav-btn:disabled {
  opacity: 0.38;
  cursor: default;
}

.dark .chat-search-nav-btn {
  background: #1e2c3a;
  color: #e5e7eb;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.dark .chat-search-nav-btn:hover:not(:disabled) {
  background: #2a3b4d;
  opacity: 1;
}

.scrolldown-fade-enter-active,
.scrolldown-fade-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.scrolldown-fade-enter-from,
.scrolldown-fade-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.85);
}

.newbar-fade-enter-active,
.newbar-fade-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.newbar-fade-enter-from,
.newbar-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.chat-chrome-slot {
  background: #f4f4f5;
}
.dark .chat-chrome-slot {
  background: #0e1621;
}
.chat-chrome-panel {
  width: 100%;
  height: 100%;
}
.sel-action {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #707579;
  transition: background-color var(--tg-dur-fast, 140ms) ease,
    color var(--tg-dur-fast, 140ms) ease,
    opacity var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-instant, 100ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  -webkit-tap-highlight-color: transparent;
}
.sel-action:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #3390ec;
}
.sel-action:active:not(:disabled) {
  transform: scale(0.9);
}
.dark .sel-action {
  color: #8b98a5;
}
.dark .sel-action:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #6ab2f2;
}
.sel-action:disabled {
  opacity: 0.35;
  pointer-events: none;
}
.sel-action--danger,
.sel-action--danger:hover {
  color: #e53935;
}
.dark .sel-action--danger,
.dark .sel-action--danger:hover {
  color: #f07178;
}

/* Selection ↔ chat header: same slot height, slide swap (out-in). */
.chrome-slide-enter-active,
.chrome-slide-leave-active {
  transition: transform var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    opacity var(--tg-dur-fast, 140ms) ease;
}
.chrome-slide-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.chrome-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
[dir="rtl"] .chrome-slide-enter-from {
  transform: translateX(-18px);
}
[dir="rtl"] .chrome-slide-leave-to {
  transform: translateX(18px);
}

.pinned-sheet-enter-active,
.pinned-sheet-leave-active {
  transition: opacity var(--tg-dur-normal, 200ms) ease,
    transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.pinned-sheet-enter-from,
.pinned-sheet-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}

/* Pinned bar: active tick + preview swap (Telegram-like) */
.pin-bar-tick {
  background: rgba(51, 144, 236, 0.28);
  transition: background-color 0.22s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    transform 0.22s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.pin-bar-tick.is-active {
  background: #3390ec;
  transform: scaleX(1.35);
}
.pin-bar-preview-ico {
  width: 14px;
  height: 14px;
  color: #3390ec;
}
.dark .pin-bar-preview-ico {
  color: #6ab2f2;
}
.pin-bar-preview-label {
  font-weight: 600;
  color: #3390ec;
}
.dark .pin-bar-preview-label {
  color: #6ab2f2;
}
.pin-preview-enter-active,
.pin-preview-leave-active {
  transition: opacity 0.16s ease, transform 0.16s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.pin-preview-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.pin-preview-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Brief highlight when jumping to a specific message (reply tap / notification). */
.msg-flash {
  animation: msg-flash-kf 2.4s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  border-radius: 1rem;
}

@keyframes msg-flash-kf {
  0% {
    background-color: rgba(51, 144, 236, 0.22);
  }
  18% {
    background-color: rgba(51, 144, 236, 0.16);
  }
  100% {
    background-color: transparent;
  }
}

.composer-fmt-bar {
  pointer-events: auto;
}
.composer-fmt-more {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 34px;
  padding: 0 12px 0 14px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #222;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7) inset,
    0 6px 20px rgba(15, 40, 70, 0.16);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.12s ease, background 0.12s ease;
}
.composer-fmt-more:active {
  transform: scale(0.97);
}
.dark .composer-fmt-more {
  background: rgba(36, 47, 61, 0.96);
  color: #f5f5f5;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 8px 22px rgba(0, 0, 0, 0.35);
}
.composer-fmt-more-aa {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-family: var(--msg-font-ui);
  line-height: 1;
}
.composer-fmt-more-chevron {
  width: 14px;
  height: 14px;
  opacity: 0.55;
}

.composer-input {
  /* Grow via autoResize JS — avoid field-sizing which can inflate empty height. */
  min-height: 36px;
  box-sizing: border-box;
  /* Allow native OS/browser text callout (copy/paste/select). */
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  user-select: text;
  /* Keep overflow scrollable when capped; hide the scrollbar chrome. */
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* Fixed line box so YekanBakh + emoji share the same vertical center */
  font-size: 14px;
  line-height: 20px;
  font-family: var(--msg-font-composer);
  font-variant-emoji: normal;
  text-align: start;
}

/* Invisible but focusable while voice UI owns the composer row (keeps soft KB up). */
.composer-input--voice-ghost {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: 0 !important;
  padding: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
  overflow: hidden !important;
  border: 0 !important;
  clip: rect(0, 0, 0, 0) !important;
}

.messenger-search-input::-webkit-search-cancel-button,
.messenger-search-input::-webkit-search-decoration,
.messenger-search-input::-ms-clear {
  display: none;
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}

.composer-input::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.composer-attach {
  width: 2.25rem;
  height: 2.25rem;
  opacity: 1;
  transform: scale(1);
  overflow: hidden;
  pointer-events: auto;
  transition:
    width 0.22s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.18s ease,
    transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}

.composer-attach--hidden {
  width: 0;
  opacity: 0;
  transform: scale(0.55);
  pointer-events: none;
}

.composer-emoji {
  -webkit-tap-highlight-color: transparent;
}

/* Empty state — fixed elegant canvas (independent of chat wallpaper). */
.chat-empty {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #e8eef5;
}
.dark .chat-empty {
  background: #0b1219;
}
.chat-empty-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(1200px 600px at 18% 12%, rgba(51, 144, 236, 0.14), transparent 55%),
    radial-gradient(900px 500px at 88% 78%, rgba(51, 144, 236, 0.1), transparent 50%),
    linear-gradient(165deg, #eef3f8 0%, #e2eaf3 48%, #d8e3ef 100%);
}
.dark .chat-empty-canvas {
  background:
    radial-gradient(1100px 560px at 16% 10%, rgba(51, 144, 236, 0.16), transparent 55%),
    radial-gradient(800px 480px at 90% 82%, rgba(45, 120, 200, 0.1), transparent 52%),
    linear-gradient(165deg, #0e1621 0%, #0b1219 45%, #0a1018 100%);
}
.chat-empty-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.55;
}
.chat-empty-glow--a {
  width: 18rem;
  height: 18rem;
  top: 12%;
  inset-inline-start: 8%;
  background: rgba(51, 144, 236, 0.22);
  animation: chat-empty-drift 14s ease-in-out infinite alternate;
}
.chat-empty-glow--b {
  width: 14rem;
  height: 14rem;
  bottom: 14%;
  inset-inline-end: 10%;
  background: rgba(51, 144, 236, 0.14);
  animation: chat-empty-drift 18s ease-in-out infinite alternate-reverse;
}
.chat-empty-grid {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(15, 40, 70, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 40, 70, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%);
}
.dark .chat-empty-grid {
  opacity: 0.22;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
}
.chat-empty-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 22rem;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.78);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.65) inset,
    0 18px 48px rgba(15, 40, 70, 0.12);
  animation: chat-empty-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dark .chat-empty-card {
  background: rgba(14, 22, 33, 0.82);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 18px 48px rgba(0, 0, 0, 0.4);
}
@keyframes chat-empty-drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(18px, -14px, 0) scale(1.06); }
}
.chat-empty-orb {
  position: relative;
  width: 5.5rem;
  height: 5.5rem;
  margin-bottom: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-empty-orb-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1.5px solid rgba(51, 144, 236, 0.28);
  animation: chat-empty-pulse 2.8s ease-out infinite;
}
.chat-empty-orb-ring--delayed {
  animation-delay: 1.1s;
}
.chat-empty-icon {
  position: relative;
  z-index: 1;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3390ec;
  background: linear-gradient(160deg, rgba(51, 144, 236, 0.18), rgba(51, 144, 236, 0.06));
  box-shadow: 0 8px 24px rgba(51, 144, 236, 0.18);
}
.chat-empty-icon svg {
  width: 2.15rem;
  height: 2.15rem;
}
.chat-empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1a2332;
  line-height: 1.35;
}
.dark .chat-empty-title {
  color: #f0f4f8;
}
.chat-empty-hint {
  margin: 0.45rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #708090;
  max-width: 16rem;
}
.dark .chat-empty-hint {
  color: #8b98a5;
}
@keyframes chat-empty-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes chat-empty-pulse {
  0% {
    transform: scale(0.92);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.28);
    opacity: 0;
  }
  100% {
    transform: scale(1.28);
    opacity: 0;
  }
}

.emoji-keyboard-dock {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
  flex-shrink: 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: #fff;
  /* Height locked to measured soft-keyboard height — avoid animating height on swap. */
  will-change: transform;
  transition: none;
}

.emoji-keyboard-dock :deep(.messenger-emoji-picker),
.emoji-keyboard-dock .emoji-dock-panel {
  height: 100%;
  width: 100%;
}

.dark .emoji-keyboard-dock {
  border-top-color: rgba(255, 255, 255, 0.08);
  background: #17212b;
}

.emoji-keyboard-dock.is-closed {
  overflow: hidden;
  pointer-events: none;
  border-top-width: 0;
}

.emoji-keyboard-dock.is-switching {
  pointer-events: none;
  /* Empty spacer matching keyboard height while the soft keyboard rises */
  background: transparent;
  border-top-color: transparent;
}

.dark .emoji-keyboard-dock.is-switching {
  background: transparent;
}

/* Telegram-like slide: emoji panel rises into the reserved keyboard band. */
.emoji-slide-enter-active,
.emoji-slide-leave-active {
  transition: transform var(--tg-dur-slow, 280ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  position: absolute;
  inset: 0;
  will-change: transform;
}

.emoji-slide-enter-from {
  transform: translateY(100%);
}

.emoji-slide-enter-to,
.emoji-slide-leave-from {
  transform: translateY(0);
}

.emoji-slide-leave-to {
  transform: translateY(100%);
}

.emoji-popover-enter-active,
.emoji-popover-leave-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-fast, 140ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.emoji-popover-enter-from,
.emoji-popover-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.composer-mic {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.composer-gif-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 14px;
  padding: 0 3px;
  border: 1.4px solid currentColor;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.03em;
  line-height: 1;
  font-family: var(--msg-font-ui);
}

.composer-sticker-suggest {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 6px);
  z-index: 90;
  padding: 6px 8px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(22px) saturate(1.55);
  -webkit-backdrop-filter: blur(22px) saturate(1.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 10px 28px rgba(15, 23, 42, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  pointer-events: auto;
  overflow: hidden;
}
.dark .composer-sticker-suggest {
  background: rgba(23, 33, 43, 0.58);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.composer-sticker-suggest__strip {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-x;
  padding: 0 2px;
}
.composer-sticker-suggest__strip::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.composer-sticker-suggest__cell {
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}
.composer-sticker-suggest__cell:active {
  background: rgba(51, 144, 236, 0.12);
  transform: scale(0.96);
}
.composer-sticker-suggest__img {
  width: 86%;
  height: 86%;
  object-fit: contain;
}
.composer-sticker-suggest__emoji {
  font-size: 1.55rem;
  line-height: 1;
}
.stk-suggest-enter-active,
.stk-suggest-leave-active {
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.stk-suggest-enter-from,
.stk-suggest-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.composer-row {
  overflow: visible;
}
.composer-row--voice {
  overflow: visible;
  min-height: 44px;
  align-items: center;
}

/* Hold-to-record mic: large, irregular outward pulse (Telegram mobile) */
.voice-hold-mic {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  --voice-level: 0.35;
  --lock-lift: 0;
  --hold-color: #3390ec;
  /* Smooth spring lift toward lock capsule */
  transform:
    translateY(calc(var(--lock-lift) * -58px))
    scale(calc(1 + (var(--lock-lift) * 0.12)));
  transition: transform 0.08s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
  z-index: 6;
}
.voice-hold-mic--locked {
  width: 36px;
  height: 36px;
  transform: none;
  transition: none;
}
.voice-hold-mic--locked .voice-hold-core,
.voice-hold-mic--locked .voice-hold-core--send {
  width: 36px;
  height: 36px;
  transform: scale(1);
  box-shadow: 0 1px 4px rgba(51, 144, 236, 0.35);
}
.voice-hold-mic--locked .voice-hold-core svg {
  width: 20px;
  height: 20px;
}
.voice-hold-mic--locked .voice-hold-ring {
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
}
.voice-hold-mic--locked.is-silent .voice-hold-ring {
  display: none;
}
.voice-hold-mic--snap {
  animation: voice-lock-snap 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.voice-hold-mic--locked.voice-hold-mic--snap {
  animation: voice-send-shrink 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes voice-lock-snap {
  0% { transform: translateY(-28px) scale(0.88); opacity: 0.7; }
  55% { transform: translateY(3px) scale(1.08); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes voice-send-shrink {
  0% { transform: scale(1.12); opacity: 0.85; }
  100% { transform: scale(1); opacity: 1; }
}
.voice-hold-mic.is-cancel {
  --hold-color: #e53935;
}
.voice-hold-mic.is-lock {
  --hold-color: #3390ec;
}
.voice-hold-core {
  position: relative;
  z-index: 2;
  width: 56px;
  height: 56px;
  border: 0;
  padding: 0;
  border-radius: 999px;
  background: var(--hold-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 4px 18px rgba(51, 144, 236, 0.42),
    0 0 0 calc(var(--lock-lift) * 4px) rgba(51, 144, 236, 0.18);
  /* Soft breathe with mic level */
  transform: scale(calc(1 + (var(--voice-level) * 0.1)));
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.07s linear;
}
.voice-hold-core--send {
  transform: scale(1);
}
.voice-hold-mic--locked .voice-hold-core--send {
  transform: scale(1);
}
.voice-hold-mic.is-cancel .voice-hold-core {
  box-shadow: 0 3px 14px rgba(229, 57, 53, 0.5);
}
.voice-hold-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  border-radius: 42% 58% 48% 52% / 48% 42% 58% 52%;
  background: var(--hold-color);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  will-change: transform, opacity, border-radius;
}
/* Irregular blobs: each ring has different ellipse + phase + larger reach */
.voice-hold-ring--a {
  animation: voice-hold-pulse-a 1.05s ease-in-out infinite;
}
.voice-hold-ring--b {
  animation: voice-hold-pulse-b 1.28s ease-in-out infinite 0.1s;
}
.voice-hold-ring--c {
  animation: voice-hold-pulse-c 0.92s ease-in-out infinite 0.22s;
}
.voice-hold-ring--d {
  animation: voice-hold-pulse-d 1.42s ease-in-out infinite 0.36s;
}
.voice-hold-ring--e {
  animation: voice-hold-pulse-e 1.18s ease-in-out infinite 0.48s;
  border-radius: 58% 42% 55% 45% / 45% 55% 42% 58%;
}

@keyframes voice-hold-pulse-a {
  0%, 100% {
    opacity: 0.42;
    border-radius: 42% 58% 48% 52% / 48% 42% 58% 52%;
    transform: scale(calc(1.08 + var(--voice-level) * 0.12), calc(1.12 + var(--voice-level) * 0.1));
  }
  40% {
    opacity: 0.22;
    border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%;
    transform: scale(calc(1.55 + var(--voice-level) * 0.35), calc(1.4 + var(--voice-level) * 0.28));
  }
  70% {
    opacity: 0.08;
    border-radius: 48% 52% 42% 58% / 55% 48% 52% 45%;
    transform: scale(calc(1.95 + var(--voice-level) * 0.45), calc(1.85 + var(--voice-level) * 0.4));
  }
}
@keyframes voice-hold-pulse-b {
  0%, 100% {
    opacity: 0.35;
    border-radius: 58% 42% 50% 50% / 50% 55% 45% 50%;
    transform: scale(calc(1.1 + var(--voice-level) * 0.08), calc(1.05 + var(--voice-level) * 0.14)) rotate(12deg);
  }
  50% {
    opacity: 0.12;
    border-radius: 40% 60% 55% 45% / 60% 40% 55% 45%;
    transform: scale(calc(1.7 + var(--voice-level) * 0.4), calc(2.05 + var(--voice-level) * 0.3)) rotate(-14deg);
  }
}
@keyframes voice-hold-pulse-c {
  0%, 100% {
    opacity: 0.3;
    border-radius: 45% 55% 42% 58% / 58% 45% 55% 42%;
    transform: scale(calc(1.05 + var(--voice-level) * 0.1), calc(1.15 + var(--voice-level) * 0.08)) rotate(-16deg);
  }
  55% {
    opacity: 0.1;
    border-radius: 60% 40% 48% 52% / 42% 58% 40% 60%;
    transform: scale(calc(2.1 + var(--voice-level) * 0.28), calc(1.55 + var(--voice-level) * 0.42)) rotate(8deg);
  }
}
@keyframes voice-hold-pulse-d {
  0%, 100% {
    opacity: 0.26;
    border-radius: 50% 50% 55% 45% / 45% 55% 50% 50%;
    transform: scale(calc(1.15 + var(--voice-level) * 0.06));
  }
  35% {
    opacity: 0.16;
    border-radius: 42% 58% 60% 40% / 55% 42% 58% 45%;
    transform: scale(calc(1.45 + var(--voice-level) * 0.25), calc(1.75 + var(--voice-level) * 0.2));
  }
  75% {
    opacity: 0.06;
    border-radius: 55% 45% 40% 60% / 48% 52% 45% 55%;
    transform: scale(calc(2.0 + var(--voice-level) * 0.38), calc(1.8 + var(--voice-level) * 0.32));
  }
}
@keyframes voice-hold-pulse-e {
  0%, 100% {
    opacity: 0.2;
    transform: scale(calc(1.2 + var(--voice-level) * 0.05), calc(1.08 + var(--voice-level) * 0.1)) rotate(5deg);
  }
  45% {
    opacity: 0.14;
    transform: scale(calc(1.65 + var(--voice-level) * 0.22), calc(1.9 + var(--voice-level) * 0.35)) rotate(-20deg);
  }
  80% {
    opacity: 0.04;
    transform: scale(calc(2.25 + var(--voice-level) * 0.4), calc(2.1 + var(--voice-level) * 0.35)) rotate(15deg);
  }
}

/* Telegram lock capsule above the mic while holding */
.voice-lock-rail {
  position: absolute;
  bottom: calc(100% + 34px);
  left: 50%;
  z-index: 8;
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  animation: voice-lock-rail-in 0.42s cubic-bezier(0.22, 1.15, 0.36, 1) both;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    filter 0.2s ease;
  will-change: transform, opacity;
  filter: none;
  pointer-events: none;
}
.voice-lock-rail.is-cancel-hide {
  pointer-events: none;
}
@keyframes voice-lock-rail-in {
  0% {
    opacity: 0;
    filter: blur(6px);
    transform: translateX(-50%) translateY(18px) scale(0.72);
  }
  60% {
    opacity: 1;
    filter: blur(0);
    transform: translateX(-50%) translateY(-3px) scale(1.04);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateX(-50%) translateY(0) scale(1);
  }
}
.voice-lock-capsule {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38px;
  padding: 8px 0 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.42);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 6px 20px rgba(15, 35, 55, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(14px) saturate(1.35);
  -webkit-backdrop-filter: blur(14px) saturate(1.35);
  overflow: hidden;
  transition:
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease,
    transform 0.2s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.voice-lock-glow {
  position: absolute;
  inset: -30% -40% auto;
  height: 70%;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(51, 144, 236, 0.28), transparent 70%);
  opacity: calc(var(--lock-close, 0) * 0.95);
  transition: opacity 0.15s ease;
}
.dark .voice-lock-capsule {
  background: rgba(22, 34, 48, 0.48);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 8px 22px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.06);
}
.voice-lock-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: #8b98a5;
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1),
    box-shadow 0.18s ease;
}
.voice-lock-svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.85;
  fill: none;
}
.voice-lock-body {
  fill: none;
  stroke: currentColor;
}
.voice-lock-keyhole {
  fill: currentColor;
  stroke: none;
  opacity: 0.9;
  transform-origin: 12px 15.2px;
  transition: transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.voice-lock-shackle {
  transform-origin: 12px 8px;
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.voice-lock-shackle--open {
  opacity: calc(1 - var(--lock-close, 0));
  transform: rotate(calc(var(--lock-close, 0) * -28deg)) translateY(calc(var(--lock-close, 0) * -2px));
}
.voice-lock-shackle--closed {
  opacity: var(--lock-close, 0);
  transform: scale(calc(0.92 + (var(--lock-close, 0) * 0.08)));
}
.voice-lock-chevrons {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
  height: 30px;
  justify-content: center;
  gap: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.voice-lock-chevron {
  width: 14px;
  height: 10px;
  stroke: #9aa6b2;
  stroke-width: 2.2;
  margin-top: -3px;
  opacity: 0.35;
  animation: voice-lock-chevron 1.05s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
.voice-lock-chevron--1 { animation-delay: 0s; }
.voice-lock-chevron--2 { animation-delay: 0.14s; }
.voice-lock-chevron--3 { animation-delay: 0.28s; }

.voice-lock-rail.is-near .voice-lock-icon,
.voice-lock-rail.is-closing .voice-lock-icon {
  color: #3390ec;
  background: rgba(51, 144, 236, 0.16);
  transform: scale(calc(1 + (var(--lock-close, 0) * 0.14)));
}
.voice-lock-rail.is-near .voice-lock-chevron,
.voice-lock-rail.is-closing .voice-lock-chevron {
  stroke: #3390ec;
  animation-duration: 0.58s;
}
.voice-lock-rail.is-closing .voice-lock-chevron {
  opacity: calc(0.65 - (var(--lock-close, 0) * 0.6));
}
.voice-lock-rail.is-closing .voice-lock-chevrons {
  transform: translateY(calc(var(--lock-close, 0) * 5px));
}
.voice-lock-rail.is-armed .voice-lock-capsule {
  transform: scale(1.05);
  background: rgba(51, 144, 236, 0.18);
  border-color: rgba(51, 144, 236, 0.28);
  box-shadow:
    0 0 0 3px rgba(51, 144, 236, 0.12),
    0 10px 26px rgba(51, 144, 236, 0.22);
}
.voice-lock-rail.is-armed .voice-lock-icon {
  color: #fff;
  background: #3390ec;
  box-shadow: 0 4px 14px rgba(51, 144, 236, 0.45);
  transform: scale(1.16);
}
.voice-lock-rail.is-armed .voice-lock-keyhole {
  fill: #fff;
  transform: scale(0.85);
}
.voice-lock-rail.is-armed .voice-lock-chevron {
  opacity: 0;
}

@keyframes voice-lock-chevron {
  0%, 100% {
    transform: translateY(5px);
    opacity: 0.18;
  }
  45% {
    transform: translateY(-4px);
    opacity: 0.95;
  }
}

.forward-menu-pop {
  animation: tg-menu-pop 0.16s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ——— Voice record UI (Telegram-like) ——— */
/* Keep bar height = normal input row; mic/pause protrude above via overflow:visible */
.voice-rec-trailing {
  position: relative;
  width: 56px;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  margin-bottom: 2px;
  flex-shrink: 0;
  align-self: flex-end;
  z-index: 6;
  overflow: visible;
}
.voice-ctrl-pause-badge {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 34px);
  z-index: 9;
  width: 36px;
  height: 36px;
  margin: 0;
  border: 0;
  padding: 0;
  border-radius: 999px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.42);
  color: #3390ec;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.4) inset,
    0 4px 14px rgba(15, 35, 60, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(14px) saturate(1.35);
  -webkit-backdrop-filter: blur(14px) saturate(1.35);
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.16s cubic-bezier(0.34, 1.4, 0.64, 1), background-color 0.15s ease, box-shadow 0.15s ease;
  animation: voice-lock-rail-in 0.38s cubic-bezier(0.22, 1.15, 0.36, 1) both;
}
:global(.dark) .voice-ctrl-pause-badge,
.dark .voice-ctrl-pause-badge {
  background: rgba(22, 34, 48, 0.48);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 6px 16px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.06);
}
.voice-ctrl-pause-badge:active {
  transform: translateX(-50%) scale(0.92);
}

.voice-mic-slot {
  position: absolute;
  left: 50%;
  bottom: -2px;
  width: 56px;
  height: 56px;
  margin: 0 0 0 -28px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
  z-index: 6;
  overflow: visible;
}
.voice-mic-slot.is-locked {
  width: 36px;
  height: 36px;
  margin-left: -18px;
  bottom: 2px;
}
.voice-mic-slot.is-cancel-burst {
  opacity: 0;
  transform: scale(0.55) !important;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease !important;
}

.voice-rec-led {
  color: inherit;
  min-width: 4.75rem;
}
.voice-rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #e53935;
  box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.45);
  animation: voice-rec-pulse 1.15s ease-out infinite;
  flex-shrink: 0;
}
@keyframes voice-rec-pulse {
  0% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.5); transform: scale(1); }
  70% { box-shadow: 0 0 0 10px rgba(229, 57, 53, 0); transform: scale(1.06); }
  100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); transform: scale(1); }
}
.voice-rec-time {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: #1f2937;
  line-height: 1;
}
.dark .voice-rec-time {
  color: #e5e7eb;
}

.voice-rec-cancel-mid {
  border: 0;
  padding: 0 8px;
  background: transparent;
  color: rgba(229, 57, 53, 0.72);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s ease, transform 0.12s ease, color 0.15s ease;
}
.voice-rec-cancel-mid:active {
  opacity: 0.7;
  transform: scale(0.98);
  color: rgba(229, 57, 53, 0.9);
}

.voice-slide-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #8b98a5;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.voice-slide-cancel-chev {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.12em;
  opacity: 0.75;
  animation: voice-slide-nudge 1.15s ease-in-out infinite;
}
.voice-slide-cancel-text {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  animation: voice-slide-nudge 1.15s ease-in-out infinite;
}
.voice-slide-cancel.is-cancel-end .voice-slide-cancel-chev,
.voice-slide-cancel.is-cancel-end .voice-slide-cancel-text {
  animation-name: voice-slide-nudge-ltr;
}
.voice-slide-cancel.is-armed {
  color: #e53935;
}
.voice-slide-cancel.is-armed .voice-slide-cancel-text,
.voice-slide-cancel.is-armed .voice-slide-cancel-chev {
  animation-duration: 0.7s;
}
@keyframes voice-slide-nudge {
  0%, 100% { transform: translateX(0); opacity: 0.72; }
  50% { transform: translateX(-10px); opacity: 1; }
}
@keyframes voice-slide-nudge-ltr {
  0%, 100% { transform: translateX(0); opacity: 0.72; }
  50% { transform: translateX(10px); opacity: 1; }
}

.voice-paused-panel {
  max-height: 40px;
  background: transparent;
  overflow: visible;
}

/* Fine Telegram-style waveform + slim handles (bars fill edge-to-edge) */
.voice-trim {
  position: relative;
  height: 40px;
  touch-action: none;
  user-select: none;
  padding-inline: 0;
  box-sizing: border-box;
}
.voice-trim-inner {
  position: relative;
  height: 100%;
  width: 100%;
}
.voice-trim-wave {
  position: absolute;
  inset: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  pointer-events: none;
  z-index: 1;
}
.voice-trim-bar {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  max-width: 1.5px;
  align-self: center;
  border-radius: 99px;
  background: #3390ec;
  opacity: 0.9;
  min-height: 10%;
  margin-inline: 0.35px;
}
.voice-trim-bar.is-out {
  opacity: 0.18;
  background: #8b98a5;
}
.voice-trim-handle {
  position: absolute;
  top: 50%;
  width: 2.5px;
  height: 18px;
  transform: translate(-50%, -50%);
  border-radius: 99px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgba(51, 144, 236, 0.35),
    0 1px 3px rgba(0, 0, 0, 0.18);
  cursor: ew-resize;
  z-index: 3;
  touch-action: none;
  border: none;
}
.voice-trim-handle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 34px;
  transform: translate(-50%, -50%);
}
.voice-trim-handle.start {
  /* sit flush on the first bar */
}
.voice-trim-handle.end {
  /* sit flush on the last bar */
}
.voice-trim-playhead {
  position: absolute;
  top: 50%;
  width: 1.5px;
  height: 18px;
  transform: translate(-50%, -50%);
  border-radius: 1px;
  background: #f59e0b;
  pointer-events: none;
  z-index: 2;
  opacity: 0.9;
}
.dark .voice-trim-handle {
  background: #f3f6fa;
  box-shadow: 0 0 0 1px rgba(106, 178, 242, 0.4), 0 1px 2px rgba(0, 0, 0, 0.35);
}

/* Compact play + duration badge over the waveform */
.voice-preview-badge {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 4;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.94);
  color: #fff;
  box-shadow: 0 2px 8px rgba(15, 35, 60, 0.22);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.12s ease, background-color 0.15s ease;
}
.voice-preview-badge:active {
  transform: translate(-50%, -50%) scale(0.96);
}
.voice-preview-badge-orb {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.voice-preview-badge-time {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

/* Connection status in chat header (replaces online / last seen when unhealthy) */
.messenger-header-conn-status {
  color: #707579;
  font-weight: 500;
  transition: color var(--tg-dur-fast, 140ms) ease, opacity var(--tg-dur-fast, 140ms) ease;
}
.dark .messenger-header-conn-status {
  color: #8b95a0;
}
.messenger-status-dots {
  display: inline-flex;
  width: 1.1em;
  overflow: hidden;
  vertical-align: baseline;
}
.messenger-status-dots span {
  opacity: 0;
  animation: messenger-header-dot-wave 1.5s ease-in-out infinite;
}
.messenger-status-dots span:nth-child(1) { animation-delay: 0s; }
.messenger-status-dots span:nth-child(2) { animation-delay: 0.25s; }
.messenger-status-dots span:nth-child(3) { animation-delay: 0.5s; }
@keyframes messenger-header-dot-wave {
  0%, 15% { opacity: 0; }
  30%, 55% { opacity: 1; }
  70%, 100% { opacity: 0; }
}

/* Presence / typing status — Telegram-style bouncing dots after the label */
.typing-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  color: #3390ec;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  vertical-align: middle;
}
.dark .typing-status {
  color: #6ab2f2;
}
.typing-status.is-recording_voice {
  color: #ef4444;
}
.dark .typing-status.is-recording_voice {
  color: #f87171;
}
.typing-status.is-uploading_photo,
.typing-status.is-uploading_video,
.typing-status.is-uploading_audio,
.typing-status.is-uploading_file {
  color: #0ea5e9;
}
.dark .typing-status.is-uploading_photo,
.dark .typing-status.is-uploading_video,
.dark .typing-status.is-uploading_audio,
.dark .typing-status.is-uploading_file {
  color: #38bdf8;
}
.typing-status-text {
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
  gap: 3px;
  height: 10px;
  padding-inline-start: 1px;
}
.typing-dot {
  width: 3.5px;
  height: 3.5px;
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
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-3.5px);
    opacity: 1;
  }
}

.chat-drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(23, 33, 43, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: none;
}
.chat-drop-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: min(280px, 86vw);
  padding: 28px 24px;
  border-radius: 22px;
  border: 2px dashed rgba(51, 144, 236, 0.65);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.45);
}
.dark .chat-drop-card {
  background: rgba(23, 33, 43, 0.92);
}
.chat-drop-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1c2733;
  text-align: center;
}
.dark .chat-drop-title {
  color: #f1f5f9;
}
</style>
