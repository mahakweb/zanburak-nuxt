<template>
  <div class="flex flex-col h-full bg-[#f4f4f5] dark:bg-[#0e1621] relative messenger-settings-panel">
    <!-- Header with contextual back -->
    <div class="flex items-center gap-1 px-2 h-14 border-b border-black/[0.06] dark:border-white/5 flex-shrink-0 bg-white dark:bg-[#17212b]">
      <button
        @click="back"
        class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition active:scale-90 flex-shrink-0"
        :title="$t('messenger.back')"
      >
        <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 12h16m0 0l-6 6m6-6l-6-6" />
        </svg>
      </button>
      <h2 class="flex-1 text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">{{ title }}</h2>
      <div v-if="showHeaderMenu" ref="headerMenuWrap" class="relative flex-shrink-0 min-w-[2.5rem] flex justify-end">
        <button
          type="button"
          class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition"
          :title="$t('messenger.more')"
          @click.stop="headerMenuOpen = !headerMenuOpen"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect width="4" height="4" x="10" y="3" rx="2" />
            <rect width="4" height="4" x="10" y="10" rx="2" />
            <rect width="4" height="4" x="10" y="17" rx="2" />
          </svg>
        </button>
        <div
          v-if="headerMenuOpen"
          class="tg-menu absolute top-full mt-1 rtl:left-0 ltr:right-0 w-56 z-30 py-1"
          @click.stop
        >
          <button
            v-for="item in headerMenuItems"
            :key="item.key"
            type="button"
            :class="['tg-menu-item', item.danger ? 'is-danger' : '']"
            @click="onHeaderMenuAction(item.key)"
          >
            <svg class="tg-menu-item-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
            <span class="tg-menu-item-label">{{ item.label }}</span>
          </button>
        </div>
      </div>
      <div v-else class="w-9 flex-shrink-0" />
    </div>

    <div
      :class="[
        'flex-1 min-h-0 bg-[#f4f4f5] dark:bg-[#0e1621]',
        menuViewFills
          ? 'overflow-hidden flex flex-col'
          : 'overflow-y-auto custom-scrollbar',
      ]"
      @scroll="onContactsScroll"
    >
      <transition name="menu-view" mode="out-in">
        <div
          :key="view"
          :class="menuViewFills
            ? ['flex-1 min-h-0 flex flex-col h-full', view === 'contacts' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar']
            : ''"
        >
          <!-- ROOT (same card style as Settings) -->
          <template v-if="view === 'root'">
            <div class="pt-3 pb-5">
              <div class="tg-card mx-3 mb-3">
                <button
                  @click="openProfileFromRoot"
                  class="menu-profile w-full flex items-center gap-3 px-4 py-3.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition text-start"
                >
                  <MessengerAvatar :user="userInfo" size="lg" />
                  <div class="flex-1 min-w-0">
                    <div class="text-[15px] font-semibold text-gray-800 dark:text-gray-100 truncate">{{ myName }}</div>
                    <div class="text-[13px] text-gray-400 truncate mt-0.5">@{{ userInfo && userInfo.username }}</div>
                  </div>
                  <svg class="w-4 h-4 text-gray-300 dark:text-gray-500 rtl:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div class="tg-card mx-3 mb-3">
                <button
                  v-for="(row, idx) in rootRowsPrimary"
                  :key="row.key"
                  @click="row.action($event)"
                  :class="['menu-row', idx === rootRowsPrimary.length - 1 ? '' : 'border-b border-black/[0.06] dark:border-white/[0.06]']"
                >
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="row.icon" /></svg>
                  <span class="menu-row-label">{{ $t(row.label) }}</span>
                  <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div class="tg-card mx-3 mb-3">
                <button
                  v-for="(row, idx) in rootRowsCreate"
                  :key="row.key"
                  @click="row.action($event)"
                  :class="['menu-row', idx === rootRowsCreate.length - 1 ? '' : 'border-b border-black/[0.06] dark:border-white/[0.06]']"
                >
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="row.icon" /></svg>
                  <span class="menu-row-label">{{ $t(row.label) }}</span>
                  <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div class="tg-card mx-3 mb-3">
                <button type="button" class="menu-row" @click="go('settings')">
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  <span class="menu-row-label">{{ $t('messenger.settings') }}</span>
                  <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div v-if="canInstallPwa" class="tg-card mx-3 mb-3">
                <button type="button" class="menu-row" :disabled="pwaInstalling" @click="installPwa">
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" />
                  </svg>
                  <span class="menu-row-label">{{ pwaInstalling ? $t('pwa.install.installing') : $t('messenger.installMessenger') }}</span>
                </button>
              </div>

              <div class="tg-card mx-3 mb-3">
                <button @click="$emit('exit')" class="menu-row">
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <span class="menu-row-label">{{ $t('messenger.home') }}</span>
                </button>
              </div>
            </div>
          </template>

          <!-- SETTINGS (Telegram-style) -->
          <template v-else-if="view === 'settings'">
            <div class="tg-settings-hero">
              <MessengerAvatar :user="userInfo" size="xl" class="mx-auto" />
              <h3 class="tg-settings-name">{{ myName }}</h3>
              <p class="tg-settings-status">{{ $t('messenger.online') }}</p>
            </div>

            <div class="tg-card mx-3 mb-3">
              <div v-if="userInfo?.mobile" class="tg-info-row">
                <div class="tg-info-content">
                  <div class="tg-info-value-row">
                    <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <span class="tg-info-value msg-plain-nums" dir="ltr">{{ displayMobile }}</span>
                  </div>
                  <div class="tg-info-label">{{ $t('messenger.phone') }}</div>
                </div>
              </div>
              <div v-if="userInfo?.username" class="tg-info-row">
                <div class="tg-info-content">
                  <div class="tg-info-value-row">
                    <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                    <button
                      ref="settingsUsernameEl"
                      type="button"
                      :class="['tg-info-value tg-copyable', { 'is-copy-flash': usernameCopied }]"
                      :title="$t('messenger.tapToCopy')"
                    >
                      <span dir="ltr">@{{ userInfo.username }}</span>
                    </button>
                  </div>
                  <div class="tg-info-label">{{ $t('messenger.username') }}</div>
                </div>
              </div>
              <div v-if="userInfo?.bio || form.bio" class="tg-info-row">
                <div class="tg-info-content">
                  <div class="tg-info-value-row">
                    <svg class="tg-info-icon-sm" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <button
                      ref="settingsBioEl"
                      type="button"
                      :class="['tg-info-value tg-copyable break-words', { 'is-copy-flash': bioCopied }]"
                      :title="$t('messenger.tapToCopy')"
                    >{{ userInfo?.bio || form.bio }}</button>
                  </div>
                  <div class="tg-info-label">{{ $t('messenger.bio') }}</div>
                </div>
              </div>
            </div>

            <div
              v-for="(group, gIdx) in settingsGroups"
              :key="'sg-' + gIdx"
              class="tg-card mx-3 mb-3"
            >
              <button
                v-for="(row, idx) in group"
                :key="row.key"
                type="button"
                @click="row.action()"
                :class="['menu-row', idx === group.length - 1 ? '' : 'border-b border-black/[0.06] dark:border-white/[0.06]']"
              >
                <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="row.icon" /></svg>
                <span class="menu-row-label">{{ $t(row.label) }}</span>
                <span v-if="row.trailing" class="text-[14px] text-[#707579]">{{ row.trailing }}</span>
                <svg v-else class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </template>

          <!-- CONTACTS -->
          <template v-else-if="view === 'contacts'">
            <div class="flex-1 min-h-0 flex flex-col pt-3 pb-3 mx-3">
              <div class="tg-card mb-2 overflow-hidden">
                <div class="px-3 py-2.5">
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1 min-w-0">
                      <svg class="w-4 h-4 text-[#3390ec] absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <input
                        v-model="contactQuery"
                        :placeholder="$t('messenger.searchContacts')"
                        class="w-full ltr:pl-10 rtl:pr-10 pe-3 py-1.5 text-[13px] rounded-full bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:outline-none focus:ring-2 focus:ring-[#3390ec]/30 text-gray-900 dark:text-gray-100 placeholder:text-[#a2acb4]"
                      />
                    </div>
                    <button
                      type="button"
                      @click="cycleContactSort"
                      class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#f4f4f5] dark:bg-[#0e1621] text-[#3390ec] hover:bg-[#e8e8ea] dark:hover:bg-[#15202b] transition select-none"
                      :title="contactSortTitle"
                    >
                      <svg v-if="contactSort === 'name_asc'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-4 4m4-4l4 4"/></svg>
                      <svg v-else-if="contactSort === 'name_desc'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="tg-card mb-2 overflow-hidden">
                <button
                  v-for="(row, idx) in contactActionRows"
                  :key="row.key"
                  type="button"
                  :class="['menu-row w-full', idx < contactActionRows.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
                  @click="row.action()"
                >
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="row.icon" /></svg>
                  <span class="menu-row-label">{{ $t(row.label) }}</span>
                </button>
              </div>

              <div class="tg-card flex-1 min-h-0 overflow-hidden relative flex flex-col">
                <div class="px-3 pt-2 pb-1 text-[11px] text-[#a2acb4] flex-shrink-0">{{ contactSortTitle }}</div>
                <div class="relative flex-1 min-h-0">
                  <div
                    ref="contactScroller"
                    class="contact-scroller custom-scrollbar"
                    @scroll.passive="onContactListScroll"
                  >
                  <div v-if="contactsLoading && !sortedContacts.length" class="py-1">
                    <MessengerSkeleton variant="contacts" :count="8" />
                  </div>
                  <div v-else-if="!sortedContacts.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">{{ contactQuery ? $t('messenger.noResults') : $t('messenger.noContacts') }}</div>
                  <div
                    v-for="(ct, idx) in sortedContacts"
                    :key="ct.id"
                    :data-contact-id="ct.id"
                    :data-contact-letter="contactLetter(ct)"
                    @contextmenu.prevent="openContactCtx($event, ct)"
                    @touchstart.passive="ctLpStart($event, ct)"
                    @touchend="ctLpEnd"
                    @touchcancel="ctLpEnd"
                    @touchmove.passive="ctLpMove"
                    :class="['contact-row w-full flex items-stretch hover:bg-black/[0.04] dark:hover:bg-white/5 cursor-pointer select-none', showInlineLetters ? 'is-lettered' : '', idx < sortedContacts.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
                    @click="onContactClick(ct)"
                  >
                    <div class="contacts-letter-col" :class="{ 'is-open': showInlineLetters }" aria-hidden="true">
                      <span v-if="contactLetterAnchors[ct.id]" class="contacts-letter-glyph">{{ contactLetterAnchors[ct.id] }}</span>
                    </div>
                    <div class="contact-row-main flex-1 min-w-0 flex items-center gap-2.5 pe-3 py-1.5">
                    <MessengerAvatar :user="ct.contact_user" :name="ct.name" size="sm" :online="!!ct.contact_user?.is_online" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1">
                        <span class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">{{ ct.name }}</span>
                        <svg v-if="ct.is_favorite" class="w-2.5 h-2.5 text-[#3390ec] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </div>
                      <div class="text-[12px] truncate leading-snug" :class="ct.contact_user?.is_online ? 'text-[#3390ec]' : 'text-[#a2acb4]'">
                        {{ contactPresenceText(ct.contact_user) }}
                      </div>
                    </div>
                    </div>
                  </div>
                  </div>
                  <div
                    v-if="showContactScrollbar"
                    ref="contactIndexRail"
                    class="contacts-scrollbar absolute inset-y-0 end-0 z-[3] select-none touch-none"
                    :class="{ 'is-dragging': indexDragging }"
                    @pointerdown.prevent="onIndexPointerDown"
                    @pointermove.prevent="onIndexPointerMove"
                    @pointerup="onIndexPointerUp"
                    @pointercancel="onIndexPointerUp"
                  >
                    <div class="contacts-scrollbar-thumb" :style="contactThumbStyle" />
                    <div
                      v-if="indexBubbleLetter"
                      :key="indexBubbleLetter"
                      class="contacts-index-bubble pointer-events-none absolute"
                      :class="{ 'is-on': indexDragging }"
                      :style="indexBubbleStyle"
                    >{{ indexBubbleLetter }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- RENAME CONTACT (inline, replaces contacts list) -->
          <template v-else-if="view === 'renameContact'">
            <div class="pt-3 pb-5">
              <div class="tg-card mx-3 mb-3 overflow-hidden">
                <div class="flex items-center gap-2.5 px-3 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <MessengerAvatar :user="renameTarget?.contact_user" :name="renameTarget?.name" size="md" />
                  <div class="min-w-0">
                    <div class="text-[13.5px] font-medium text-gray-900 dark:text-gray-100 truncate">{{ renameTarget?.name }}</div>
                    <div v-if="renameTarget?.contact_user?.username" class="text-[12px] text-[#a2acb4] truncate" dir="ltr">@{{ renameTarget.contact_user.username }}</div>
                  </div>
                </div>
                <div class="tg-field">
                  <input
                    id="ct-rename"
                    ref="renameInput"
                    v-model="renameName"
                    class="tg-field-input"
                    placeholder=" "
                    @keydown.enter.prevent="saveRenameContact"
                  />
                  <label for="ct-rename" class="tg-field-label">{{ $t('messenger.renameContact') }}</label>
                </div>
              </div>
              <p class="px-5 text-[12.5px] text-[#a2acb4] mb-3">{{ $t('messenger.renameContactHint') }}</p>
              <div class="tg-form-footer">
                <button
                  type="button"
                  class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
                  :disabled="savingRename"
                  @click="saveRenameContact"
                >
                  {{ savingRename ? '...' : $t('messenger.save') }}
                </button>
              </div>
            </div>
          </template>

          <!-- MY COMMUNITIES (groups/channels I manage) -->
          <template v-else-if="view === 'communities'">
            <div class="pt-3 pb-5">
              <div class="tg-card mx-3 mb-3 overflow-hidden">
                <MessengerSkeleton v-if="loading && !myCommunities.length" variant="users" :count="4" />
                <div v-else-if="!myCommunities.length" class="px-4 py-10 text-center text-[13px] text-[#a2acb4]">
                  {{ $t('messenger.noManagedCommunities') }}
                </div>
                <div
                  v-for="(c, idx) in myCommunities"
                  :key="c.id"
                  :class="['w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5 transition', idx < myCommunities.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
                >
                  <button
                    type="button"
                    class="flex-1 min-w-0 flex items-center gap-2.5 text-start"
                    @click="openManagedCommunity(c)"
                  >
                    <MessengerAvatar :src="c.avatar" :name="c.title" size="md" />
                    <div class="flex-1 min-w-0">
                      <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{{ c.title }}</div>
                      <div class="text-[12px] text-[#a2acb4] truncate">
                        {{ c.type === 'channel' ? $t('messenger.channel') : $t('messenger.group') }}
                        <span v-if="communityRoleLabel(c)"> · {{ communityRoleLabel(c) }}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    class="p-1.5 rounded-full text-[#3390ec] hover:bg-[#3390ec]/10 flex-shrink-0"
                    :title="$t('messenger.communityInfo')"
                    @click="openManagedCommunityInfo(c)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                </div>
              </div>
              <div class="tg-card mx-3 overflow-hidden">
                <button type="button" class="menu-row border-b border-black/[0.06] dark:border-white/[0.06]" @click="goCreate('group')">
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span class="menu-row-label">{{ $t('messenger.newGroup') }}</span>
                </button>
                <button type="button" class="menu-row" @click="goCreate('channel')">
                  <svg class="menu-row-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span class="menu-row-label">{{ $t('messenger.newChannel') }}</span>
                </button>
              </div>
            </div>
          </template>

          <!-- JOIN COMMUNITY -->
          <template v-else-if="view === 'joinCommunity'">
            <div class="pt-3 pb-5">
              <div class="tg-card mx-3 p-4">
                <p class="text-[13px] text-[#707579] mb-3">{{ $t('messenger.joinCommunityHint') }}</p>
                <input
                  ref="joinInput"
                  v-model="join.identifier"
                  @keydown.enter.prevent="doJoinCommunity"
                  :placeholder="$t('messenger.joinCommunityPlaceholder')"
                  class="w-full px-4 py-2.5 text-[13px] rounded-2xl bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:ring-2 focus:ring-[#3390ec]/30 focus:outline-none text-gray-800 dark:text-gray-100"
                  dir="ltr"
                />
                <p v-if="join.message" :class="['mt-2 text-[12px]', join.error ? 'text-red-500' : 'text-green-600']">{{ join.message }}</p>
                <button
                  type="button"
                  @click="doJoinCommunity"
                  :disabled="join.busy || join.identifier.trim().length < 2"
                  class="mt-3 w-full py-2.5 rounded-2xl bg-[#3390ec] hover:bg-[#4ea4f5] disabled:opacity-50 text-white font-semibold text-[14px] transition"
                >
                  {{ join.busy ? '...' : $t('messenger.join') }}
                </button>
              </div>
            </div>
          </template>

          <!-- ADD CONTACT -->
          <section v-else-if="view === 'addContact'" class="pt-3 pb-0 px-0 min-h-full flex flex-col">
            <div class="tg-card mx-3 p-4 flex-1">
            <template v-if="ac.stage === 'input'">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ $t('messenger.addContactHint') }}</p>
              <input
                ref="acInput"
                v-model="ac.identifier"
                @keydown.enter.prevent="acLookup"
                :placeholder="$t('messenger.addContactPlaceholder')"
                class="w-full px-4 py-3 text-sm rounded-2xl bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:ring-2 focus:ring-[#3390ec] focus:outline-none text-gray-800 dark:text-gray-100"
                dir="auto"
              />
              <p v-if="ac.message" class="mt-3 text-sm text-red-500">{{ ac.message }}</p>
            </template>

            <template v-else-if="ac.stage === 'found'">
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#f4f4f5] dark:bg-[#0e1621] mb-4">
                <MessengerAvatar :user="ac.foundUser" size="lg" />
                <div class="min-w-0">
                  <p class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ acFoundName }}</p>
                  <p v-if="ac.foundUser?.username" class="text-xs text-gray-500 truncate">@{{ ac.foundUser.username }}</p>
                </div>
              </div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{{ $t('messenger.customNameLabel') }}</label>
              <input
                v-model="ac.customName"
                :placeholder="acFoundName"
                class="w-full px-4 py-3 text-sm rounded-2xl bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:ring-2 focus:ring-[#3390ec] focus:outline-none text-gray-800 dark:text-gray-100"
                dir="auto"
              />
              <p class="mt-1 text-xs text-gray-400">{{ $t('messenger.customNameHint') }}</p>
            </template>

            <template v-else-if="ac.stage === 'invite'">
              <div class="text-center py-2">
                <div class="mx-auto w-12 h-12 rounded-full bg-[#3390ec]/10 flex items-center justify-center mb-3">
                  <svg class="w-6 h-6 text-[#3390ec]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-200 font-bold">{{ $t('messenger.notMemberTitle') }}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('messenger.notMemberInvite', { channel: $t('messenger.channel_' + ac.inviteChannel) }) }}</p>
              </div>
              <p v-if="ac.message" :class="['mt-3 text-sm text-center', ac.error ? 'text-red-500' : 'text-green-600 dark:text-green-400']">{{ ac.message }}</p>
            </template>
            </div>

            <div class="tg-form-footer mt-3">
              <template v-if="ac.stage === 'input'">
                <button
                  type="button"
                  class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
                  :disabled="ac.busy || ac.identifier.trim().length < 2"
                  @click="acLookup"
                >
                  <span class="inline-flex items-center justify-center gap-2">
                    <svg v-if="ac.busy" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                    {{ $t('messenger.continue') }}
                  </span>
                </button>
              </template>
              <template v-else-if="ac.stage === 'found'">
                <button type="button" class="tg-form-btn tg-form-btn--muted" @click="acReset">{{ $t('messenger.back') }}</button>
                <button type="button" class="tg-form-btn tg-form-btn--primary tg-form-btn--grow" :disabled="ac.busy" @click="acConfirmAdd">{{ $t('messenger.saveContact') }}</button>
              </template>
              <template v-else-if="ac.stage === 'invite'">
                <button type="button" class="tg-form-btn tg-form-btn--muted" @click="acReset">{{ $t('messenger.back') }}</button>
                <button type="button" class="tg-form-btn tg-form-btn--primary tg-form-btn--grow" :disabled="ac.busy" @click="acConfirmInvite">
                  <span class="inline-flex items-center justify-center gap-2">
                    <svg v-if="ac.busy" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                    {{ $t('messenger.sendInvite') }}
                  </span>
                </button>
              </template>
            </div>
          </section>

          <!-- EDIT PROFILE (Telegram-style) -->
          <section v-else-if="view === 'profile'" class="pb-0">
            <div class="flex flex-col items-center pt-6 pb-4">
              <div class="relative">
                <button
                  type="button"
                  class="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3390ec]/50"
                  @click="openMyAvatarViewer"
                >
                  <MessengerAvatar :user="userInfo" size="xl" />
                </button>
                <button
                  type="button"
                  class="absolute bottom-2 end-2 z-[5] w-7 h-7 rounded-full bg-[#3390ec] text-white shadow-md flex items-center justify-center border-2 border-[#f4f4f5] dark:border-[#0e1621] hover:bg-[#4ea4f5] transition translate-x-0.5 translate-y-0.5"
                  :title="$t('messenger.changePhoto')"
                  @click="$refs.avatarInput.click()"
                >
                  <svg v-if="!uploading" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2 7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9Zm3 15a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z" />
                  </svg>
                  <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                </button>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
              </div>
            </div>

            <!-- Name + bio card -->
            <div class="tg-card mx-3 mb-2">
              <div class="tg-field">
                <input id="pf-first" v-model="form.first_name" v-no-autofill="'strong'" name="messenger-first-name" class="tg-field-input" placeholder=" " />
                <label for="pf-first" class="tg-field-label">{{ $t('messenger.firstName') }}</label>
              </div>
              <div class="tg-field">
                <input id="pf-last" v-model="form.last_name" v-no-autofill="'strong'" name="messenger-last-name" class="tg-field-input" placeholder=" " />
                <label for="pf-last" class="tg-field-label">{{ $t('messenger.lastName') }}</label>
              </div>
              <div class="tg-field">
                <textarea
                  id="pf-bio"
                  :value="form.bio"
                  rows="1"
                  wrap="off"
                  maxlength="70"
                  class="tg-field-input messenger-hline"
                  placeholder=" "
                  @keydown.enter.prevent
                  @wheel="onHlineWheel"
                  @input="onBioInput"
                ></textarea>
                <label for="pf-bio" class="tg-field-label">{{ $t('messenger.bio') }}</label>
                <span class="tg-field-counter">{{ bioCharsLeft }}</span>
              </div>
            </div>
            <p class="px-5 mb-4 text-[13px] text-[#707579] leading-snug">{{ $t('messenger.bioHelper') }}</p>

            <!-- Username section -->
            <p class="px-5 pb-1.5 text-[13px] text-[#707579]">{{ $t('messenger.username') }}</p>
            <div class="tg-card mx-3 mb-2" :class="usernameBorderClass">
              <div class="tg-field">
                <input
                  id="pf-user"
                  v-no-autofill="'strong'"
                  name="messenger-username"
                  :value="form.username"
                  class="tg-field-input"
                  dir="ltr"
                  placeholder=" "
                  maxlength="50"
                  @input="onUsernameInput"
                  @keydown.enter.prevent
                />
                <label for="pf-user" class="tg-field-label">{{ $t('messenger.username') }}</label>
              </div>
            </div>
            <p v-if="usernameStatus === 'checking'" class="px-5 mb-1 text-[13px] text-[#707579]">{{ $t('messenger.usernameChecking') }}</p>
            <p v-else-if="usernameStatus === 'available'" class="px-5 mb-1 text-[13px] text-green-600">{{ $t('messenger.usernameAvailable') }}</p>
            <p v-else-if="usernameStatus === 'taken'" class="px-5 mb-1 text-[13px] text-red-500">{{ $t('messenger.usernameTaken') }}</p>
            <p v-else-if="usernameStatus === 'invalid'" class="px-5 mb-1 text-[13px] text-red-500">{{ $t('messenger.usernameInvalid') }}</p>
            <p class="px-5 mb-3 text-[13px] text-[#707579] leading-snug">{{ $t('messenger.usernameHelper') }}</p>

            <div class="tg-form-footer">
              <button
                type="button"
                class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
                :disabled="savingProfile || !canSaveProfile"
                @click="saveProfile"
              >
                {{ savingProfile ? '...' : $t('messenger.saveProfile') }}
              </button>
            </div>
          </section>

          <!-- ACTIVE SESSIONS / DEVICES (Telegram-style) -->
          <section v-else-if="view === 'devices'" class="session-view pt-1 pb-4">
            <MessengerSkeleton v-if="sessionsLoading" variant="blocked" :count="3" embedded class="mx-3" />
            <template v-else>
              <p class="session-section-label">{{ $t('profile.login.thisDevice') }}</p>
              <div v-if="currentToken" class="tg-card mx-3 mb-2 overflow-hidden">
                <div class="session-row">
                  <SessionDeviceIcon :token="currentToken" />
                  <div class="session-body">
                    <div class="session-head">
                      <span class="session-title">{{ sessionDeviceTitle(currentToken) }}</span>
                      <span class="session-online">{{ $t('profile.login.online') }}</span>
                    </div>
                    <p v-if="sessionMetaParts(currentToken).length" class="session-meta" dir="ltr">{{ sessionMetaParts(currentToken).join(' · ') }}</p>
                  </div>
                </div>
              </div>

              <template v-if="hasOtherSessions">
                <p class="session-section-label">{{ $t('profile.login.activeSessions') }}</p>
                <div class="tg-card mx-3 mb-2 overflow-hidden">
                  <div
                    v-for="(token, idx) in otherSessions"
                    :key="token.id"
                    :class="['session-row', idx < otherSessions.length - 1 ? 'session-row--bordered' : '']"
                  >
                    <SessionDeviceIcon :token="token" />
                    <div class="session-body">
                      <div class="session-head">
                        <span class="session-title">{{ sessionDeviceTitle(token) }}</span>
                        <button
                          type="button"
                          class="session-terminate-btn"
                          :title="$t('profile.login.deleteSession')"
                          :disabled="sessionTerminateLoading[token.id]"
                          @click="terminateSession(token.id)"
                        >
                          <svg v-if="!sessionTerminateLoading[token.id]" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        </button>
                      </div>
                      <p v-if="sessionMetaParts(token, true).length" class="session-meta" dir="ltr">{{ sessionMetaParts(token, true).join(' · ') }}</p>
                    </div>
                  </div>
                </div>

                <div class="tg-card mx-3 overflow-hidden">
                  <button
                    type="button"
                    class="session-terminate-all-btn"
                    :disabled="sessionTerminateAllLoading"
                    @click="terminateAllSessions"
                  >
                    <svg v-if="sessionTerminateAllLoading" class="w-4 h-4 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{{ $t('profile.login.terminateAllOthers') }}</span>
                  </button>
                </div>
                <p class="session-hint">{{ $t('profile.login.terminateAllHint') }}</p>
              </template>

              <div v-else class="tg-card mx-3 overflow-hidden">
                <div class="session-empty">
                  <svg class="session-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p class="session-empty-title">{{ $t('profile.login.noOtherSessions') }}</p>
                  <p class="session-empty-desc">{{ $t('profile.login.noOtherSessionsDesc1') }}</p>
                </div>
              </div>

              <p v-if="sessionFeedback.message" :class="['session-feedback', sessionFeedback.error ? 'is-error' : 'is-success']">
                {{ sessionFeedback.message }}
              </p>
            </template>
          </section>

          <!-- PRIVACY -->
          <section v-else-if="view === 'privacy'" class="pt-2 pb-5">
            <p class="menu-section-title">{{ $t('messenger.privacy') }}</p>
            <div class="tg-card mx-3 mb-3 overflow-hidden">
              <button
                v-for="(row, idx) in privacyRows"
                :key="row.key"
                type="button"
                :class="['menu-row w-full text-start', idx < privacyRows.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
                @click="openPrivacyDetail(row.key)"
              >
                <span class="menu-row-label">{{ $t(row.labelKey) }}</span>
                <span class="text-[13px] text-[#a2acb4] me-1">{{ privacyRuleLabel(row.key) }}</span>
                <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="menu-settings-group mb-3">
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.showEmail') }}</span>
                <MessengerToggle :model-value="!!settings.show_email" @update:modelValue="toggleSetting('show_email', $event)" />
              </div>
            </div>
            <p class="menu-section-title">{{ $t('messenger.security') }}</p>
            <div class="tg-card mx-3 mb-3 overflow-hidden">
              <button type="button" class="menu-row border-b border-black/[0.06] dark:border-white/[0.06]" @click="go('passcode')">
                <span class="menu-row-label">{{ $t('messenger.passcodeLock') }}</span>
                <span class="text-[13px] text-[#a2acb4] me-1">{{ appLock.enabled ? $t('messenger.on') : $t('messenger.off') }}</span>
                <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button type="button" class="menu-row border-b border-black/[0.06] dark:border-white/[0.06]" @click="go('e2eRecovery')">
                <span class="menu-row-label">{{ $t('messenger.e2eRecovery') }}</span>
                <span class="text-[13px] text-[#a2acb4] me-1">{{ e2eRecoveryStatusLabel }}</span>
                <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button type="button" class="menu-row" @click="go('blocked')">
                <span class="menu-row-label">{{ $t('messenger.blockedUsers') }}</span>
                <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <PrivacyRulePanel
            v-else-if="view === 'privacyDetail' && privacyKey"
            ref="privacyRulePanel"
            :setting-key="privacyKey"
            @exception-mode="privacyExceptionMode = $event"
          />

          <ContactSyncPanel
            v-else-if="view === 'contactSync'"
            @open-user="onSyncedUserOpen"
          />

          <!-- PASSCODE LOCK -->
          <section v-else-if="view === 'passcode'" class="pt-2 pb-5">
            <template v-if="passcodeFlow.step === 'menu'">
              <template v-if="!appLock.enabled">
                <p class="px-5 pb-3 text-[13px] leading-5 text-gray-500 dark:text-gray-400">{{ $t('messenger.passcodeLockHint') }}</p>
                <div class="tg-card mx-3">
                  <button type="button" class="menu-row" @click="startEnablePasscode">
                    <span class="menu-row-label text-[#3390ec]">{{ $t('messenger.enablePasscode') }}</span>
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="tg-card mx-3 mb-3">
                  <button type="button" class="menu-row border-b border-black/[0.06] dark:border-white/[0.06]" @click="startChangePasscode">
                    <span class="menu-row-label">{{ $t('messenger.changePasscode') }}</span>
                    <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <button type="button" class="menu-row border-b border-black/[0.06] dark:border-white/[0.06]" @click="go('autoLock')">
                    <span class="menu-row-label">{{ $t('messenger.autoLock') }}</span>
                    <span class="text-[13px] text-gray-400 me-1">{{ autoLockLabel }}</span>
                    <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                  <div class="menu-row">
                    <span class="menu-row-label flex-1">{{ biometricToggleLabel }}</span>
                    <MessengerToggle
                      :model-value="appLock.biometricEnabled"
                      :disabled="passcodeBusy || (!biometricAvailable && !appLock.biometricEnabled)"
                      @update:modelValue="onBiometricToggle"
                    />
                  </div>
                </div>
                <p v-if="!biometricAvailable" class="px-5 pb-2 text-[12px] text-gray-400">{{ $t('messenger.biometricUnavailable') }}</p>
                <p v-if="passcodeFeedback" class="px-5 pb-2 text-[12px]" :class="passcodeFeedbackError ? 'text-red-500' : 'text-green-600 dark:text-green-400'">{{ passcodeFeedback }}</p>
                <div class="tg-card mx-3">
                  <button type="button" class="menu-row" @click="startDisablePasscode">
                    <span class="menu-row-label text-red-500">{{ $t('messenger.disablePasscode') }}</span>
                  </button>
                </div>
              </template>
            </template>

            <div v-else class="passcode-setup">
              <div class="passcode-setup__hero">
                <div class="passcode-setup__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 118 0v3" />
                    <rect x="5.5" y="11" width="13" height="9.5" rx="2.5" stroke="currentColor" stroke-width="1.75" />
                    <circle cx="12" cy="15.5" r="1.35" fill="currentColor" />
                  </svg>
                </div>
                <p class="passcode-setup__title">{{ passcodeFlowTitle }}</p>
              </div>
              <PasscodePad
                v-model="passcodeFlow.pin"
                compact
                :hint="passcodeFlowHint"
                :error="passcodeFlow.error"
                :busy="passcodeBusy"
                :biometric="false"
                :backspace-label="$t('messenger.passcodeBackspace')"
                :aria-label="$t('messenger.enterPasscode')"
                @complete="onPasscodeFlowComplete"
              />
              <button
                type="button"
                class="passcode-setup__cancel"
                :disabled="passcodeBusy"
                @click="cancelPasscodeFlow"
              >{{ $t('messenger.cancel') }}</button>
            </div>
          </section>

          <!-- E2E RECOVERY PHRASE -->
          <section v-else-if="view === 'e2eRecovery'" class="pt-2 pb-5">
            <p class="px-5 pb-3 text-[13px] leading-5 text-gray-500 dark:text-gray-400">
              {{ e2eRecoveryPageHint }}
            </p>
            <div v-if="e2eRecoveryForm.mode === 'locked'" class="tg-card mx-3 mb-3">
              <p class="px-4 py-3 text-[13px] text-gray-500 dark:text-gray-400">{{ $t('messenger.e2eRecoveryNoKeyHint') }}</p>
            </div>
            <div v-else class="tg-card mx-3 mb-3 overflow-hidden px-4 py-3">
              <label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('messenger.e2eRecoveryPhrase') }}
              </label>
              <input
                v-model="e2eRecoveryForm.phrase"
                type="password"
                autocomplete="new-password"
                class="w-full h-11 px-3 rounded-xl bg-[#f4f4f5] dark:bg-white/5 border-0 text-[15px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3390ec]"
                :placeholder="$t('messenger.e2eRecoveryPlaceholder')"
              />
              <template v-if="e2eRecoveryForm.mode !== 'restore'">
                <label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-3 mb-1">
                  {{ $t('messenger.e2eRecoveryConfirm') }}
                </label>
                <input
                  v-model="e2eRecoveryForm.confirm"
                  type="password"
                  autocomplete="new-password"
                  class="w-full h-11 px-3 rounded-xl bg-[#f4f4f5] dark:bg-white/5 border-0 text-[15px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3390ec]"
                  :placeholder="$t('messenger.e2eRecoveryConfirmPlaceholder')"
                />
              </template>
              <p v-if="e2eRecoveryForm.error" class="mt-2 text-[13px] text-red-500">{{ e2eRecoveryForm.error }}</p>
              <p v-else-if="e2eRecoveryForm.ok" class="mt-2 text-[13px] text-green-600 dark:text-green-400">{{ e2eRecoveryForm.ok }}</p>
              <button
                type="button"
                class="mt-3 w-full h-11 rounded-xl bg-[#3390ec] text-white text-[15px] font-semibold disabled:opacity-60"
                :disabled="e2eRecoveryForm.busy"
                @click="submitE2eRecoveryForm"
              >
                {{ e2eRecoveryForm.busy ? $t('messenger.e2eRecoveryWorking') : e2eRecoverySubmitLabel }}
              </button>
            </div>
          </section>

          <!-- AUTO-LOCK -->
          <section v-else-if="view === 'autoLock'" class="pt-2 pb-5">
            <p class="px-5 pb-3 text-[13px] leading-5 text-gray-500 dark:text-gray-400">{{ $t('messenger.autoLockHint') }}</p>
            <div class="menu-settings-group">
              <button
                v-for="(opt, idx) in autoLockOptions"
                :key="String(opt.value)"
                type="button"
                @click="applyAutoLock(opt.value)"
                :class="['menu-settings-row menu-settings-row-btn w-full text-start', idx === autoLockOptions.length - 1 ? 'menu-settings-row-last' : '']"
              >
                <span>{{ $t(opt.labelKey) }}</span>
                <svg v-if="appLock.autoLockSeconds === opt.value" class="w-5 h-5 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </section>

          <!-- BLOCKED -->
          <section v-else-if="view === 'blocked'" class="pt-3 pb-5">
            <div class="tg-card mx-3 overflow-hidden">
              <MessengerSkeleton v-if="blockedLoading && !blockedContacts.length" variant="blocked" :count="5" />
              <div v-else-if="!blockedContacts.length" class="px-4 py-10 text-center text-sm text-gray-400">{{ $t('messenger.noBlockedUsers') }}</div>
              <div
                v-for="(b, idx) in blockedContacts"
                :key="b.id"
                :class="['flex items-center gap-3 px-4 py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/5 transition', idx < blockedContacts.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
              >
                <MessengerAvatar :user="b.contact_user" :name="b.name" size="md" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ b.name }}</div>
                  <div class="text-xs text-gray-400 truncate">@{{ b.contact_user?.username }}</div>
                </div>
                <button @click="unblock(b)" class="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">{{ $t('messenger.unblock') }}</button>
              </div>
            </div>
          </section>

          <!-- APPEARANCE -->
          <section v-else-if="view === 'appearance'" class="pt-2 pb-5">
            <p class="menu-section-title">{{ $t('messenger.theme') }}</p>
            <p class="px-4 pb-2 text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ $t('messenger.themeAutoHint') }}
            </p>
            <div class="tg-theme-cards mx-3 mb-3">
              <button
                v-for="opt in themeSelectOptions"
                :key="opt.value"
                type="button"
                :class="['tg-theme-card', theme === opt.value ? 'is-on' : '']"
                @click="applyTheme(opt.value)"
              >
                <span class="tg-theme-preview" :data-theme="opt.value" aria-hidden="true">
                  <span class="tg-theme-preview-bar" />
                  <span class="tg-theme-preview-bubbles">
                    <span class="tg-theme-preview-in" />
                    <span class="tg-theme-preview-out" />
                  </span>
                </span>
                <span class="tg-theme-card-label">{{ opt.label }}</span>
                <svg v-if="theme === opt.value" class="tg-theme-check" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>

            <p class="menu-section-title">{{ $t('messenger.animations') }}</p>
            <div class="menu-settings-group">
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.animations') }}</span>
                <MessengerToggle :model-value="animations" @update:modelValue="setAnimations" />
              </div>
            </div>

            <p class="menu-section-title">{{ $t('messenger.font') }}</p>
            <div class="menu-settings-group">
              <button type="button" @click="go('fonts')" class="menu-settings-row menu-settings-row-btn menu-settings-row-last w-full text-start">
                <span class="flex items-center gap-3 min-w-0">
                  <svg class="w-[21px] h-[21px] text-[#707579] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h10M4 12h16M4 17h8"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 17l3-10 3 10M16.2 14h3.6"/></svg>
                  <span class="min-w-0">
                    <span class="block">{{ $t('messenger.fonts') }}</span>
                    <span class="block text-xs text-gray-400 truncate">{{ fontsSummary }}</span>
                  </span>
                </span>
                <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <template v-if="canMessengerFeature('wallpapers')">
              <p class="menu-section-title">{{ $t('messenger.chatBackground') }}</p>
              <div class="menu-settings-group">
                <button @click="go('wallpaper')" class="menu-settings-row menu-settings-row-btn menu-settings-row-last w-full text-start">
                  <span class="flex items-center gap-3 min-w-0">
                    <svg class="w-[21px] h-[21px] text-[#707579] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span class="min-w-0">
                      <span class="block">{{ $t('messenger.chatBackground') }}</span>
                      <span class="block text-xs text-gray-400 truncate">{{ $t('messenger.chatBackgroundHint') }}</span>
                    </span>
                  </span>
                  <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </template>
          </section>

          <!-- FONTS (slot list) -->
          <section v-else-if="view === 'fonts'" class="pt-2 pb-5">
            <template v-for="group in fontSlotGroupedOptions" :key="group.id">
              <p class="menu-section-title">{{ group.label }}</p>
              <div class="menu-settings-group">
                <button
                  v-for="(slot, idx) in group.slots"
                  :key="slot.id"
                  type="button"
                  @click="openFontSlot(slot.id)"
                  :class="['menu-settings-row menu-settings-row-btn w-full text-start', idx === group.slots.length - 1 ? 'menu-settings-row-last' : '']"
                >
                  <span class="min-w-0">
                    <span class="block text-sm">{{ slot.label }}</span>
                    <span class="block text-xs text-gray-400 truncate" :style="{ fontFamily: slot.currentFamily }">{{ slot.currentLabel }}</span>
                  </span>
                  <svg class="menu-row-chevron rtl:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </template>
            <div class="menu-settings-group">
              <button
                type="button"
                @click="resetAllFonts"
                class="menu-settings-row menu-settings-row-btn menu-settings-row-last w-full text-start"
              >
                <span class="text-[#3390ec]">{{ $t('messenger.fontResetAll') }}</span>
              </button>
            </div>
          </section>

          <!-- FONT SLOT picker (replaces menu — Telegram nested settings) -->
          <section v-else-if="view === 'fontSlot'" class="pt-2 pb-5">
            <p class="px-4 pb-2 text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ $t('messenger.fontSlotHint') }}
            </p>
            <div class="menu-settings-group">
              <button
                v-for="(f, idx) in fontSelectOptions"
                :key="f.value"
                type="button"
                @click="applyFontSlot(fontSlotEdit, f.value)"
                :class="['menu-settings-row menu-settings-row-btn w-full text-start', idx === fontSelectOptions.length - 1 ? 'menu-settings-row-last' : '']"
              >
                <span class="min-w-0">
                  <span class="block text-[15px]" :style="{ fontFamily: f.family }">{{ f.label }}</span>
                  <span class="block text-[12px] text-gray-400 truncate mt-0.5" :style="{ fontFamily: f.family }" dir="auto">
                    {{ $t('messenger.fontPreviewSample') }}
                  </span>
                </span>
                <svg
                  v-if="(fontSlots?.[fontSlotEdit] || 'system') === f.value"
                  class="w-5 h-5 text-[#3390ec] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                ><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </section>

          <!-- LANGUAGE -->
          <section v-else-if="view === 'language'" class="pt-2 pb-5">
            <div class="menu-settings-group">
              <button
                v-for="(l, idx) in langOptions"
                :key="l.locale"
                @click="applyLocale(l)"
                :class="['menu-settings-row w-full text-start', idx === langOptions.length - 1 ? 'menu-settings-row-last' : '']"
              >
                <span>{{ l.label }}</span>
                <svg v-if="currentLocale === l.locale" class="w-5 h-5 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </section>

          <!-- NOTIFICATIONS -->
          <section v-else-if="view === 'notifications'" class="pt-2 pb-5">
            <p class="menu-section-title">{{ $t('messenger.notifications') }}</p>
            <div class="menu-settings-group">
              <div class="menu-settings-row">
                <span>{{ $t('messenger.notifSound') }}</span>
                <MessengerToggle :model-value="notif.sound" @update:modelValue="setNotif('sound', $event)" />
              </div>
              <div class="menu-settings-row">
                <span>{{ $t('messenger.notifPreview') }}</span>
                <MessengerToggle :model-value="notif.preview" @update:modelValue="setNotif('preview', $event)" />
              </div>
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.notifBadge') }}</span>
                <MessengerToggle :model-value="notif.badge" @update:modelValue="setNotif('badge', $event)" />
              </div>
            </div>
          </section>

          <!-- CHAT SETTINGS -->
          <section v-else-if="view === 'chat'" class="pt-2 pb-5">
            <p class="menu-section-title">{{ $t('messenger.chatSettings') }}</p>
            <div class="menu-settings-group">
              <div class="menu-settings-row">
                <span>{{ $t('messenger.enterToSend') }}</span>
                <MessengerToggle :model-value="!!settings.enter_to_send" @update:modelValue="toggleSetting('enter_to_send', $event)" />
              </div>
              <div class="menu-settings-row">
                <span>{{ $t('messenger.quoteWithTitle') }}</span>
                <MessengerToggle :model-value="!!settings.quote_with_title" @update:modelValue="toggleSetting('quote_with_title', $event)" />
              </div>
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.forwardTapToChat') }}</span>
                <MessengerToggle :model-value="!!settings.forward_tap_to_chat" @update:modelValue="toggleSetting('forward_tap_to_chat', $event)" />
              </div>
            </div>
          </section>

          <!-- DATA & STORAGE -->
          <section v-else-if="view === 'data'" class="pt-2 pb-5">
            <p class="menu-section-title">{{ $t('messenger.autoDownloadTitle') }}</p>
            <p class="px-4 pb-2 text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ $t('messenger.autoDownloadHint') }}
            </p>
            <div class="menu-settings-group">
              <button
                type="button"
                class="menu-settings-row menu-settings-row-btn w-full text-start"
                @click="go('dataPrivate')"
              >
                <span class="flex flex-col min-w-0">
                  <span>{{ $t('messenger.autoDownloadPrivate') }}</span>
                  <span class="text-[11px] text-gray-400 truncate mt-0.5">{{ autoDlSummary('private') }}</span>
                </span>
                <svg class="w-4 h-4 shrink-0 opacity-40 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                type="button"
                class="menu-settings-row menu-settings-row-btn w-full text-start"
                @click="go('dataGroups')"
              >
                <span class="flex flex-col min-w-0">
                  <span>{{ $t('messenger.autoDownloadGroups') }}</span>
                  <span class="text-[11px] text-gray-400 truncate mt-0.5">{{ autoDlSummary('groups') }}</span>
                </span>
                <svg class="w-4 h-4 shrink-0 opacity-40 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                type="button"
                class="menu-settings-row menu-settings-row-btn menu-settings-row-last w-full text-start"
                @click="go('dataChannels')"
              >
                <span class="flex flex-col min-w-0">
                  <span>{{ $t('messenger.autoDownloadChannels') }}</span>
                  <span class="text-[11px] text-gray-400 truncate mt-0.5">{{ autoDlSummary('channels') }}</span>
                </span>
                <svg class="w-4 h-4 shrink-0 opacity-40 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <p class="menu-section-title mt-4">{{ $t('messenger.autoPlayTitle') }}</p>
            <p class="px-4 pb-2 text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ $t('messenger.autoPlayHint') }}
            </p>
            <div class="menu-settings-group">
              <div class="menu-settings-row">
                <span>{{ $t('messenger.autoPlayGifs') }}</span>
                <MessengerToggle :model-value="!!settings.auto_play?.gifs" @update:modelValue="toggleAutoPlay('gifs', $event)" />
              </div>
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.autoPlayVideos') }}</span>
                <MessengerToggle :model-value="!!settings.auto_play?.videos" @update:modelValue="toggleAutoPlay('videos', $event)" />
              </div>
            </div>
          </section>

          <!-- Auto-download context subpages -->
          <section
            v-else-if="view === 'dataPrivate' || view === 'dataGroups' || view === 'dataChannels'"
            class="pt-2 pb-5"
          >
            <p class="menu-section-title">{{ dataContextTitle }}</p>
            <p class="px-4 pb-2 text-[12px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ $t('messenger.autoDownloadContextHint') }}
            </p>
            <div class="menu-settings-group">
              <div class="menu-settings-row">
                <span>{{ $t('messenger.autoDownloadPhotos') }}</span>
                <MessengerToggle :model-value="!!autoDlFlag('photos')" @update:modelValue="toggleAutoDl('photos', $event)" />
              </div>
              <div class="menu-settings-row">
                <span>{{ $t('messenger.autoDownloadVideos') }}</span>
                <MessengerToggle :model-value="!!autoDlFlag('videos')" @update:modelValue="toggleAutoDl('videos', $event)" />
              </div>
              <div class="menu-settings-row">
                <span>{{ $t('messenger.autoDownloadFiles') }}</span>
                <MessengerToggle :model-value="!!autoDlFlag('files')" @update:modelValue="toggleAutoDl('files', $event)" />
              </div>
              <div class="menu-settings-row">
                <span>{{ $t('messenger.autoDownloadVoice') }}</span>
                <MessengerToggle :model-value="!!autoDlFlag('voice')" @update:modelValue="toggleAutoDl('voice', $event)" />
              </div>
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.autoDownloadAudio') }}</span>
                <MessengerToggle :model-value="!!autoDlFlag('audio')" @update:modelValue="toggleAutoDl('audio', $event)" />
              </div>
            </div>
          </section>

          <!-- HELP hub removed: FAQ / Support are external links; About stays below -->

          <!-- ABOUT -->
          <section v-else-if="view === 'about'" class="pt-2 pb-5">
            <div class="flex flex-col items-center pt-6 pb-5 px-4">
              <div class="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#3390ec] to-[#2b82d9] shadow-lg flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.05 2 11.05c0 2.78 1.35 5.26 3.47 6.95V22l3.3-1.81c.99.27 2.04.42 3.23.42 5.52 0 10-4.05 10-9.05S17.52 2 12 2zm1.1 12.2l-2.55-2.72-4.98 2.72L12.9 7.8l2.6 2.72 4.93-2.72-7.33 6.4z"/>
                </svg>
              </div>
              <h3 class="text-[18px] font-semibold text-gray-900 dark:text-white">{{ $t('messenger.title') }}</h3>
              <p class="mt-1 text-[13px] text-[#707579]">{{ $t('messenger.aboutVersion', { version: appVersion }) }}</p>
            </div>
            <div class="menu-settings-group">
              <div class="menu-settings-row">
                <span>{{ $t('messenger.aboutAppName') }}</span>
                <span class="text-[14px] text-[#707579]">Zanburak</span>
              </div>
              <div class="menu-settings-row menu-settings-row-last">
                <span>{{ $t('messenger.aboutPlatform') }}</span>
                <span class="text-[14px] text-[#707579]">Web</span>
              </div>
            </div>
            <p class="px-5 pt-2 text-[12px] text-[#a2acb4] leading-relaxed text-center">{{ $t('messenger.aboutFooter') }}</p>
          </section>

          <!-- WALLPAPER -->
          <WallpaperPicker v-else-if="view === 'wallpaper'" />

          <!-- AVATAR CROP (inline, same menu — not a modal) -->
          <template v-else-if="view === 'avatarEdit'">
            <AvatarCropEditor
              v-if="avatarEditSrc"
              class="flex-1 min-h-0"
              :image-src="avatarEditSrc"
              :uploading="uploading"
              :upload-percentage="avatarUploadPct"
              @confirm="onAvatarCropConfirm"
              @cancel="closeAvatarEdit"
            />
          </template>

          <!-- CREATE GROUP / CHANNEL (sidebar page, not bottom sheet) -->
          <CreateCommunityForm
            v-else-if="view === 'createGroup' || view === 'createChannel'"
            :kind="view === 'createChannel' ? 'channel' : 'group'"
            @created="onCommunityCreated"
          />
        </div>
      </transition>
    </div>

    <!-- Add-contact FAB (contacts view) -->
    <button
      v-if="view === 'contacts'"
      @click="goAddContact"
      class="absolute bottom-5 rtl:left-5 ltr:right-5 w-14 h-14 rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white shadow-lg active:scale-95 transition flex items-center justify-center z-20"
      :title="$t('messenger.addContact')"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h9m5-6v6m3-3h-6"/></svg>
    </button>

    <ContextMenu
      :visible="contactCtx.visible"
      :x="contactCtx.x"
      :y="contactCtx.y"
      :items="contactCtxItems"
      @select="onContactCtxSelect"
      @close="contactCtx.visible = false"
    />

    <MediaViewerOverlay
      :open="avatarViewer.open"
      :src="avatarViewer.src"
      media-type="photo"
      profile-mode
      :show-delete="hasRealAvatar"
      :show-change-photo="true"
      @close="avatarViewer.open = false"
      @delete="deleteMyAvatar"
      @change-photo="onAvatarViewerChangePhoto"
    />

    <ActionSheet
      :open="iosInstallSheet"
      :title="$t('pwa.install.title')"
      :message="iosInstallMessage"
      :actions="[]"
      @close="iosInstallSheet = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "@/composables/useStore";
import UAParser from 'ua-parser-js';
import axiosInstance from '@/store/axiosInstance';
import { getMyProfile, updateMyProfile, uploadProfilePic, deleteProfilePic, checkUserUsername, joinByUsername, joinByInvite } from '@/services/messenger';
import WallpaperPicker from './WallpaperPicker.vue';
import MessengerAvatar from './MessengerAvatar.vue';
import MessengerToggle from './MessengerToggle.vue';
import ContextMenu from './ContextMenu.vue';
import AvatarCropEditor from './AvatarCropEditor.vue';
import MediaViewerOverlay from './MediaViewerOverlay.vue';
import ActionSheet from './ActionSheet.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import SessionDeviceIcon from './SessionDeviceIcon.vue';
import CreateCommunityForm from './CreateCommunityForm.vue';
import ContactSyncPanel from './ContactSyncPanel.vue';
import PrivacyRulePanel from './PrivacyRulePanel.vue';
import { formatPresenceText } from '@/utils/messengerPresence';
import { shouldPeriodicSync, contactsFromCache } from '@/utils/contactSync';
import { FONTS, FONT_SLOTS, FONT_SLOT_GROUPS, fontFamily, getFontSlot, defaultFontId, shapeUiDigits } from './appearance';
import { toSingleLine, onHorizontalWheel } from './textHelpers';
import { autoDownloadContextSummary } from './autoDownloadSettings';
import { applyThemePreference } from '@/utils/themePreference';
import { userProfileUrl, copyText } from './inviteLinks';
import { bindCopyOnPress } from './clipboardPress';
import { promptPwaInstall, getPwaInstallState } from '@/composables/usePwaInstall';
import PasscodePad from './PasscodePad.vue';
import {
  AUTO_LOCK_OPTIONS,
  getLockSnapshot,
  subscribeAppLock,
  enableAppLock,
  changeAppLockPin,
  disableAppLock,
  verifyAppLockPin,
  setAutoLockSeconds,
  enableBiometric,
  disableBiometric,
  isBiometricAvailable,
  detectBiometricKind,
} from './appLock';
import { avatarInitials } from './avatarInitials';

const DEFAULT_AVATAR = 'https://static.zanburak.ir/images/avatar/default.png';

const NOTIF_KEY = 'messenger_notifications';

function readNotif() {
  try {
    const v = JSON.parse(localStorage.getItem(NOTIF_KEY));
    if (v && typeof v === 'object') return { sound: v.sound !== false, preview: v.preview !== false, badge: v.badge !== false };
  } catch (e) { /* noop */ }
  return { sound: true, preview: true, badge: true };
}

export default {
  components: { WallpaperPicker, MessengerAvatar, MessengerToggle, ContextMenu, AvatarCropEditor, MediaViewerOverlay, ActionSheet, MessengerSkeleton, SessionDeviceIcon, CreateCommunityForm, PasscodePad, ContactSyncPanel, PrivacyRulePanel },
  props: {
    contacts: { type: Array, default: () => [] },
  },
  emits: ['close', 'start-chat', 'rename-contact', 'delete-contact', 'update-contact', 'block-user', 'unblock-user', 'exit', 'request-logout', 'contact-menu', 'open-saved', 'community-created', 'select-conversation', 'open-community-info'],
  data() {
    return {
      view: 'root',
      profileBackTo: 'root',
      createBackTo: 'root',
      avatarEditSrc: '',
      avatarUploadPct: 0,
      contactQuery: '',
      indexBubbleLetter: '',
      indexBubbleY: 0,
      indexBubbleIndex: -1,
      indexDragging: false,
      indexBubbleTimer: null,
      contactScrollTop: 0,
      contactScrollHeight: 1,
      contactClientHeight: 0,
      ctLpTimer: null,
      ctLpStartPos: null,
      ctSuppressClick: false,
      contactCtx: { visible: false, x: 0, y: 0, contact: null },
      renameTarget: null,
      renameName: '',
      savingRename: false,
      join: { identifier: '', busy: false, message: '', error: false },
      form: { first_name: '', last_name: '', username: '', bio: '' },
      originalUsername: '',
      usernameStatus: '', // '' | checking | available | taken | invalid
      usernameTimer: null,
      savingProfile: false,
      uploading: false,
      ac: { stage: 'input', identifier: '', busy: false, message: '', error: false, foundUser: null, customName: '', inviteChannel: 'email' },
      theme: localStorage.getItem('theme') || 'system',
      currentLocale: localStorage.getItem('locale') || 'fa',
      themeOptions: [{ value: 'system' }, { value: 'light' }, { value: 'dark' }],
      fontOptions: FONTS,
      fontSlotEdit: null,
      langOptions: [
        { locale: 'fa', dir: 'rtl', label: 'فارسی' },
        { locale: 'en', dir: 'ltr', label: 'English' },
      ],
      notif: readNotif(),
      headerMenuOpen: false,
      avatarViewer: { open: false, src: '' },
      unbindCopy: [],
      pwaInstalling: false,
      copiedMenuKey: null,
      iosInstallSheet: false,
      usernameCopied: false,
      bioCopied: false,
      usernameCopiedTimer: null,
      bioCopiedTimer: null,
      sessionsLoading: false,
      accessTokens: [],
      currentToken: null,
      sessionTerminateLoading: {},
      sessionTerminateAllLoading: false,
      sessionFeedback: { message: '', error: false },
      sessionFeedbackTimer: null,
      appLock: getLockSnapshot(),
      biometricAvailable: false,
      biometricKind: detectBiometricKind(),
      passcodeBusy: false,
      passcodeFeedback: '',
      passcodeFeedbackError: false,
      passcodeFeedbackTimer: null,
      passcodeFlow: { step: 'menu', pin: '', pending: '', error: '' },
      e2eRecoveryForm: { phrase: '', confirm: '', error: '', ok: '', busy: false, mode: 'setup' },
      unsubAppLock: null,
      animations: typeof localStorage !== 'undefined' ? localStorage.getItem('messenger_animations') !== '0' : true,
      appVersion: '0.1.0',
      privacyExceptionMode: null,
      privacyKey: null, // last_seen | online | profile_photo | bio | phone
    };
  },
  computed: {
    ...mapState('messenger', ['settings', 'blockedContacts', 'font', 'fontSlots', 'conversations', 'contactsLoading', 'blockedLoading', 'loading', 'contacts', 'contactsSort', 'e2eRecovery']),
    ...mapGetters('messenger', ['canMessengerFeature']),
    themeSelectOptions() {
      return this.themeOptions.map((o) => ({ value: o.value, label: this.$t('messenger.theme_' + o.value) }));
    },
    fontSelectOptions() {
      return this.fontOptions.map((f) => ({
        value: f.id,
        label: f.id === 'system' ? this.$t('messenger.font_system') : f.label,
        family: f.family,
      }));
    },
    fontSlotSelectOptions() {
      return FONT_SLOTS.map((s) => this.describeFontSlot(s));
    },
    fontSlotGroupedOptions() {
      return FONT_SLOT_GROUPS.map((g) => {
        const t = this.$t(g.labelKey);
        return {
          id: g.id,
          label: t !== g.labelKey ? t : g.id,
          slots: FONT_SLOTS.filter((s) => s.group === g.id).map((s) => this.describeFontSlot(s)),
        };
      }).filter((g) => g.slots.length);
    },
    fontsSummary() {
      const msg = this.describeFontSlot(getFontSlot('message') || FONT_SLOTS[0]);
      const menu = this.describeFontSlot(getFontSlot('menu') || FONT_SLOTS.find((s) => s.id === 'menu'));
      return `${msg.currentLabel} · ${menu.currentLabel}`;
    },
    bioCharsLeft() {
      return shapeUiDigits(70 - (this.form.bio ? this.form.bio.length : 0), 'settings');
    },
    displayMobile() {
      return shapeUiDigits(this.userInfo?.mobile || '', 'settings');
    },
    fontSlotEditTitle() {
      const slot = getFontSlot(this.fontSlotEdit);
      if (!slot) return this.$t('messenger.font');
      const t = this.$t(slot.labelKey);
      return t !== slot.labelKey ? t : slot.id;
    },
    ...mapState('auth', { userInfo: (s) => s.status.userInfo }),
    meId() {
      const u = this.userInfo;
      if (!u) return null;
      return u.id ?? u.value?.id ?? null;
    },
    avatar() {
      return this.userInfo?.profile_pic || null;
    },
    initials() {
      return avatarInitials(this.userInfo);
    },
    myName() {
      const u = this.userInfo || {};
      return (u.first_name || u.last_name) ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : (u.username || '');
    },
    usernameBorderClass() {
      if (this.usernameStatus === 'available') return 'ring-1 ring-green-500/50';
      if (this.usernameStatus === 'taken' || this.usernameStatus === 'invalid') return 'ring-1 ring-red-500/50';
      return '';
    },
    canSaveProfile() {
      const u = (this.form.username || '').trim();
      if (!u) return false;
      if (u === this.originalUsername) return true;
      if (['taken', 'invalid', 'checking'].includes(this.usernameStatus)) return false;
      return this.usernameStatus === 'available';
    },
    filteredContacts() {
      const q = this.contactQuery.trim().toLowerCase();
      if (!q) return this.contacts;
      return this.contacts.filter((ct) => {
        const u = ct.contact_user || {};
        return [ct.name, u.username, u.first_name, u.last_name]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
    },
    contactSort() {
      return this.contactsSort || 'name_asc';
    },
    menuViewFills() {
      return ['avatarEdit', 'createGroup', 'createChannel', 'contacts'].includes(this.view);
    },
    sortedContacts() {
      const list = [...this.filteredContacts];
      if (this.contactSort === 'last_seen') {
        list.sort((a, b) => {
          const bySeen = this.contactLastSeenScore(b) - this.contactLastSeenScore(a);
          if (bySeen) return bySeen;
          return this.compareContactNames(a, b);
        });
      } else {
        const dir = this.contactSort === 'name_desc' ? -1 : 1;
        list.sort((a, b) => dir * this.compareContactNames(a, b));
      }
      return list;
    },
    contactSortShort() {
      if (this.contactSort === 'name_desc') return this.$t('messenger.sortNameDescShort');
      if (this.contactSort === 'last_seen') return this.$t('messenger.sortLastSeenShort');
      return this.$t('messenger.sortNameAscShort');
    },
    contactSortTitle() {
      if (this.contactSort === 'name_desc') return this.$t('messenger.sortByNameDesc');
      if (this.contactSort === 'last_seen') return this.$t('messenger.sortByLastSeen');
      return this.$t('messenger.sortByNameAsc');
    },
    pagedContacts() {
      return this.sortedContacts;
    },
    contactsHasMorePaged() {
      return false;
    },
    showInlineLetters() {
      return this.contactSort === 'last_seen'
        && !String(this.contactQuery || '').trim()
        && this.sortedContacts.length > 0;
    },
    contactLetterAnchors() {
      if (!this.showInlineLetters) return {};
      const map = Object.create(null);
      const seen = new Set();
      this.sortedContacts.forEach((ct) => {
        const letter = this.contactLetter(ct);
        if (seen.has(letter)) return;
        seen.add(letter);
        map[ct.id] = letter;
      });
      return map;
    },
    contactIndexMarks() {
      const marks = [];
      let prev = null;
      this.sortedContacts.forEach((ct, index) => {
        const letter = this.contactLetter(ct);
        if (letter === prev) return;
        prev = letter;
        marks.push({ letter, index });
      });
      return marks;
    },
    showContactScrollbar() {
      return this.sortedContacts.length > 1
        && this.contactScrollHeight > this.contactClientHeight + 1;
    },
    contactThumbStyle() {
      const view = this.contactClientHeight;
      const full = this.contactScrollHeight;
      if (!view || full <= view + 1) return { height: '0px' };
      const thumbH = Math.max(36, (view / full) * view);
      const maxTop = Math.max(view - thumbH, 0);
      const span = Math.max(full - view, 1);
      const top = (this.contactScrollTop / span) * maxTop;
      return {
        height: `${thumbH}px`,
        transform: `translateY(${top}px)`,
      };
    },
    indexBubbleStyle() {
      return {
        top: `${this.indexBubbleY}px`,
      };
    },
    otherSessions() {
      if (!this.accessTokens?.length || !this.currentToken) return [];
      return this.accessTokens.filter((t) => t.id !== this.currentToken.id);
    },
    hasOtherSessions() {
      return this.otherSessions.length > 0;
    },
    settingsGroups() {
      const account = [
        {
          key: 'account',
          label: 'messenger.account',
          icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
          action: () => this.openProfileFromSettings(),
        },
      ];
      const general = [
        { key: 'privacy', label: 'messenger.privacySecurity', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', action: () => this.go('privacy') },
        { key: 'notifications', label: 'messenger.notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', action: () => this.go('notifications') },
        { key: 'chat', label: 'messenger.chatSettings', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', action: () => this.go('chat') },
        { key: 'data', label: 'messenger.dataAndStorage', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', action: () => this.go('data') },
        { key: 'devices', label: 'messenger.devices', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', action: () => this.go('devices') },
      ];
      const look = [
        { key: 'appearance', label: 'messenger.appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', action: () => this.go('appearance') },
        { key: 'language', label: 'messenger.language', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', trailing: this.currentLocale === 'fa' ? 'فارسی' : 'English', action: () => this.go('language') },
      ];
      const help = [
        { key: 'faq', label: 'messenger.faq', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', action: () => this.openSiteFaq() },
        { key: 'support', label: 'messenger.contactSupport', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', action: () => this.openSiteContact() },
        { key: 'about', label: 'messenger.about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', action: () => this.go('about') },
      ];
      return [account, general, look, help];
    },
    rootRowsPrimary() {
      const rows = [];
      if (this.canMessengerFeature('saved_messages')) {
        rows.push({ key: 'saved', label: 'messenger.savedMessages', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', action: () => { this.$emit('open-saved'); this.$emit('close'); } });
      }
      if (this.canMessengerFeature('contacts')) {
        rows.push({ key: 'contacts', label: 'messenger.contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', action: () => this.go('contacts') });
      }
      if (this.canMessengerFeature('groups') || this.canMessengerFeature('channels')) {
        rows.push({ key: 'communities', label: 'messenger.myCommunities', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', action: () => this.go('communities') });
        rows.push({ key: 'joinCommunity', label: 'messenger.joinCommunity', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', action: () => this.go('joinCommunity') });
      }
      return rows;
    },
    rootRowsCreate() {
      const rows = [];
      if (this.canMessengerFeature('groups')) {
        rows.push({ key: 'newGroup', label: 'messenger.newGroup', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', action: () => this.goCreate('group') });
      }
      if (this.canMessengerFeature('channels')) {
        rows.push({ key: 'newChannel', label: 'messenger.newChannel', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', action: () => this.goCreate('channel') });
      }
      return rows;
    },
    contactActionRows() {
      const rows = [
        {
          key: 'syncContacts',
          label: 'messenger.syncContacts',
          icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
          action: () => this.go('contactSync'),
        },
      ];
      return rows.concat(this.rootRowsCreate);
    },
    privacyRows() {
      return [
        { key: 'last_seen', labelKey: 'messenger.privacyLastSeen' },
        { key: 'online', labelKey: 'messenger.privacyOnline' },
        { key: 'profile_photo', labelKey: 'messenger.privacyProfilePhoto' },
        { key: 'bio', labelKey: 'messenger.privacyBio' },
        { key: 'phone', labelKey: 'messenger.privacyPhone' },
      ];
    },
    myCommunities() {
      const list = Array.isArray(this.conversations) ? this.conversations : [];
      return list.filter((c) => {
        if (!c || (c.type !== 'group' && c.type !== 'channel')) return false;
        const role = c.my_role || c.pivot?.role;
        return ['owner', 'admin', 'moderator'].includes(role)
          || (this.meId && c.owner_id && Number(c.owner_id) === Number(this.meId));
      });
    },
    acFoundName() {
      const u = this.ac.foundUser;
      if (!u) return '';
      return (u.first_name || u.last_name) ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : u.username || '';
    },
    acFoundInitials() {
      return avatarInitials(this.ac.foundUser);
    },
    contactCtxItems() {
      return [
        { label: this.$t('messenger.rename'), icon: 'edit', value: 'rename' },
        { label: this.$t('messenger.deleteContact'), icon: 'trash', value: 'delete', danger: true },
      ];
    },
    title() {
      if (this.view === 'fontSlot') return this.fontSlotEditTitle;
      if (this.view === 'privacyDetail' && this.privacyKey) {
        if (this.privacyExceptionMode === 'allow') return this.$t('messenger.privacyAlwaysAllow');
        if (this.privacyExceptionMode === 'deny') return this.$t('messenger.privacyNeverAllow');
        const labels = {
          last_seen: 'messenger.privacyLastSeen',
          online: 'messenger.privacyOnline',
          profile_photo: 'messenger.privacyProfilePhoto',
          bio: 'messenger.privacyBio',
          phone: 'messenger.privacyPhone',
        };
        return this.$t(labels[this.privacyKey] || 'messenger.privacy');
      }
      const map = {
        root: 'messenger.menu',
        contacts: 'messenger.contacts',
        renameContact: 'messenger.renameContact',
        communities: 'messenger.myCommunities',
        joinCommunity: 'messenger.joinCommunity',
        addContact: 'messenger.addContact',
        settings: 'messenger.settings',
        profile: 'messenger.editProfile',
        devices: 'messenger.devices',
        privacy: 'messenger.privacySecurity',
        privacyDetail: 'messenger.privacy',
        contactSync: 'messenger.syncContacts',
        blocked: 'messenger.blockedUsers',
        passcode: 'messenger.passcodeLock',
        e2eRecovery: 'messenger.e2eRecovery',
        autoLock: 'messenger.autoLock',
        appearance: 'messenger.appearance',
        fonts: 'messenger.fonts',
        language: 'messenger.language',
        notifications: 'messenger.notifications',
        chat: 'messenger.chatSettings',
        data: 'messenger.dataAndStorage',
        dataPrivate: 'messenger.autoDownloadPrivate',
        dataGroups: 'messenger.autoDownloadGroups',
        dataChannels: 'messenger.autoDownloadChannels',
        wallpaper: 'messenger.chatBackground',
        help: 'messenger.help',
        about: 'messenger.about',
        avatarEdit: 'messenger.avatarEditTitle',
        createGroup: 'messenger.newGroup',
        createChannel: 'messenger.newChannel',
      };
      return this.$t(map[this.view] || 'messenger.menu');
    },
    autoLockOptions() {
      return AUTO_LOCK_OPTIONS;
    },
    autoLockLabel() {
      const opt = AUTO_LOCK_OPTIONS.find((o) => o.value === this.appLock.autoLockSeconds);
      return this.$t(opt?.labelKey || 'messenger.autoLock1m');
    },
    passcodeFlowTitle() {
      const step = this.passcodeFlow.step;
      if (step === 'enable' || step === 'changeNew') return this.$t('messenger.createPasscode');
      if (step === 'enableConfirm' || step === 'changeConfirm') return this.$t('messenger.reenterPasscode');
      if (step === 'disable' || step === 'changeCurrent') return this.$t('messenger.enterPasscode');
      return this.$t('messenger.passcodeLock');
    },
    passcodeFlowHint() {
      const step = this.passcodeFlow.step;
      if (step === 'enable' || step === 'changeNew') return this.$t('messenger.createPasscodeHint');
      if (step === 'enableConfirm' || step === 'changeConfirm') return this.$t('messenger.reenterPasscodeHint');
      if (step === 'disable') return this.$t('messenger.disablePasscodeHint');
      if (step === 'changeCurrent') return this.$t('messenger.enterCurrentPasscode');
      return '';
    },
    biometricToggleLabel() {
      return this.biometricKind === 'face'
        ? this.$t('messenger.unlockWithFace')
        : this.$t('messenger.unlockWithFingerprint');
    },
    e2eRecoveryStatusLabel() {
      if (this.e2eRecovery?.hasBackup) return this.$t('messenger.on');
      return this.$t('messenger.off');
    },
    e2eRecoveryPageHint() {
      if (this.e2eRecoveryForm.mode === 'restore') return this.$t('messenger.e2eRecoveryRestoreHint');
      if (this.e2eRecoveryForm.mode === 'locked') return this.$t('messenger.e2eRecoveryNoKeyHint');
      if (this.e2eRecovery?.hasBackup) return this.$t('messenger.e2eRecoveryChangeHint');
      return this.$t('messenger.e2eRecoverySetupHint');
    },
    e2eRecoverySubmitLabel() {
      if (this.e2eRecoveryForm.mode === 'restore') return this.$t('messenger.e2eRecoveryUnlock');
      if (this.e2eRecovery?.hasBackup) return this.$t('messenger.e2eRecoveryChange');
      return this.$t('messenger.e2eRecoverySave');
    },
    showHeaderMenu() {
      return ['root', 'settings', 'profile'].includes(this.view);
    },
    dataContextKey() {
      if (this.view === 'dataPrivate') return 'private';
      if (this.view === 'dataGroups') return 'groups';
      if (this.view === 'dataChannels') return 'channels';
      return null;
    },
    dataContextTitle() {
      if (this.view === 'dataPrivate') return this.$t('messenger.autoDownloadPrivate');
      if (this.view === 'dataGroups') return this.$t('messenger.autoDownloadGroups');
      if (this.view === 'dataChannels') return this.$t('messenger.autoDownloadChannels');
      return this.$t('messenger.autoDownloadTitle');
    },
    hasRealAvatar() {
      const pic = this.userInfo?.profile_pic;
      return !!pic && !pic.includes('avatar/default') && pic !== DEFAULT_AVATAR;
    },
    canInstallPwa() {
      const state = getPwaInstallState();
      return !state.isStandalone && (state.canInstall || state.isIos);
    },
    iosInstallMessage() {
      return `${this.$t('pwa.install.iosHint')}\n\n${this.$t('pwa.install.iosSteps')}`;
    },
    headerMenuItems() {
      const edit = {
        key: 'edit-profile',
        label: this.$t('messenger.editProfile'),
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      };
      const copyLink = {
        key: 'copy-profile-link',
        label: this.copiedMenuKey === 'profile-link' ? this.$t('messenger.copied') : this.$t('messenger.copyProfileLink'),
        icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      };
      const logout = {
        key: 'logout',
        label: this.$t('user.logoutAccount'),
        icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        danger: true,
      };
      if (this.view === 'root') {
        const items = [];
        if (this.userInfo?.username) items.push(copyLink);
        items.push(edit);
        items.push(logout);
        return items;
      }
      if (this.view === 'settings') {
        const items = [edit];
        if (this.userInfo?.username) items.push(copyLink);
        items.push(logout);
        return items;
      }
      if (this.view === 'profile') {
        const items = [];
        if (this.userInfo?.username) items.push(copyLink);
        items.push(logout);
        return items;
      }
      return [];
    },
  },
  watch: {
    contactQuery() {
      this.$nextTick(() => this.syncContactScrollMetrics());
    },
    contacts() {
      this.$nextTick(() => this.syncContactScrollMetrics());
    },
    contactSort() {
      this.$nextTick(() => this.syncContactScrollMetrics());
    },
    view(v) {
      this.headerMenuOpen = false;
      this.$nextTick(() => {
        this.setupCopyBindings();
        if (v === 'contacts') this.bindContactScroller();
        else this.unbindContactScroller();
      });
    },
  },
  beforeUnmount() {
    this.ctLpClear();
    clearTimeout(this.usernameTimer);
    this.revokeAvatarEditSrc();
    this.teardownCopyBindings();
    document.removeEventListener('click', this.onDocClickHeaderMenu, true);
    if (this.usernameCopiedTimer) clearTimeout(this.usernameCopiedTimer);
    if (this.bioCopiedTimer) clearTimeout(this.bioCopiedTimer);
    if (this.sessionFeedbackTimer) clearTimeout(this.sessionFeedbackTimer);
    if (this.passcodeFeedbackTimer) clearTimeout(this.passcodeFeedbackTimer);
    if (this.indexBubbleTimer) clearTimeout(this.indexBubbleTimer);
    if (typeof this.unsubAppLock === 'function') this.unsubAppLock();
    this.unbindContactScroller();
  },
  mounted() {
    document.addEventListener('click', this.onDocClickHeaderMenu, true);
    this.setupCopyBindings();
    this.unsubAppLock = subscribeAppLock((snap) => { this.appLock = snap; });
    this.refreshBiometricAvailability();
    this.$nextTick(() => {
      if (this.view === 'contacts') this.bindContactScroller();
    });
  },
  methods: {
    // Long-press a contact on touch devices to open its context menu.
    ctLpStart(event, ct) {
      const t = event.touches && event.touches[0];
      this.ctLpStartPos = t ? { x: t.clientX, y: t.clientY } : null;
      this.ctLpClear();
      this.ctLpTimer = setTimeout(() => {
        const pos = this.ctLpStartPos || { x: 0, y: 0 };
        this.ctSuppressClick = true;
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* noop */ } }
        this.openContactCtx({ clientX: pos.x, clientY: pos.y }, ct);
        this.ctLpTimer = null;
        setTimeout(() => { this.ctSuppressClick = false; }, 450);
      }, 480);
    },
    ctLpEnd() {
      this.ctLpClear();
    },
    ctLpMove(event) {
      if (!this.ctLpStartPos || !this.ctLpTimer) return;
      const t = event.touches && event.touches[0];
      if (!t) return;
      if (Math.abs(t.clientX - this.ctLpStartPos.x) > 10 || Math.abs(t.clientY - this.ctLpStartPos.y) > 10) this.ctLpClear();
    },
    ctLpClear() {
      if (this.ctLpTimer) {
        clearTimeout(this.ctLpTimer);
        this.ctLpTimer = null;
      }
    },
    openContactCtx(event, ct) {
      if (!ct) return;
      this.contactCtx = {
        visible: true,
        x: event.clientX || 0,
        y: event.clientY || 0,
        contact: ct,
      };
    },
    onContactCtxSelect(item) {
      const ct = this.contactCtx.contact;
      this.contactCtx.visible = false;
      if (!ct || !item) return;
      if (item.value === 'rename') this.openRenameContact(ct);
      else if (item.value === 'delete') this.$emit('delete-contact', ct.id);
    },
    onContactClick(ct) {
      if (this.ctSuppressClick) {
        this.ctSuppressClick = false;
        return;
      }
      this.$emit('start-chat', ct.contact_user);
    },
    openRenameContact(ct) {
      if (!ct?.id) return;
      this.renameTarget = ct;
      this.renameName = ct.name || '';
      this.view = 'renameContact';
      this.$nextTick(() => {
        const el = this.$refs.renameInput;
        if (el) {
          el.focus();
          el.select?.();
        }
      });
    },
    async saveRenameContact() {
      if (!this.renameTarget?.id || this.savingRename) return;
      const name = String(this.renameName || '').trim();
      this.savingRename = true;
      try {
        this.$emit('update-contact', { contactId: this.renameTarget.id, data: { name: name || null } });
        this.view = 'contacts';
        this.renameTarget = null;
        this.renameName = '';
      } finally {
        this.savingRename = false;
      }
    },
    toggleContactSort() {
      this.cycleContactSort();
    },
    cycleContactSort() {
      const order = ['name_asc', 'name_desc', 'last_seen'];
      const i = order.indexOf(this.contactSort);
      const next = order[(i < 0 ? 0 : i + 1) % order.length];
      this.$store.commit('messenger/SET_CONTACTS_SORT', next);
      this.indexDragging = false;
      this.indexBubbleLetter = '';
      this.indexBubbleIndex = -1;
      this.$nextTick(() => {
        const scroller = this.$refs.contactScroller;
        if (scroller) scroller.scrollTop = 0;
        this.syncContactScrollMetrics();
      });
    },
    compareContactNames(a, b) {
      const locale = this.$i18n?.locale === 'fa' ? 'fa' : (this.$i18n?.locale || 'en');
      return String(a?.name || '').localeCompare(String(b?.name || ''), locale, { sensitivity: 'base', numeric: true });
    },
    contactLetter(ct) {
      const n = String(ct?.name || '').trim();
      if (!n) return '#';
      const ch = [...n][0].toUpperCase();
      if (ch && /[\p{L}\p{N}]/u.test(ch)) return ch;
      return '#';
    },
    onIndexPointerDown(e) {
      if (this.indexBubbleTimer) clearTimeout(this.indexBubbleTimer);
      this.indexDragging = true;
      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (err) { /* noop */ }
      this.updateIndexFromY(e.clientY);
    },
    onIndexPointerMove(e) {
      if (!this.indexDragging) return;
      this.updateIndexFromY(e.clientY);
    },
    onIndexPointerUp() {
      this.indexDragging = false;
      if (this.indexBubbleTimer) clearTimeout(this.indexBubbleTimer);
      this.indexBubbleTimer = setTimeout(() => {
        if (!this.indexDragging) {
          this.indexBubbleLetter = '';
          this.indexBubbleIndex = -1;
        }
      }, 180);
    },
    fractionOnRail(clientY) {
      const rail = this.$refs.contactIndexRail;
      if (!rail) return 0;
      const r = rail.getBoundingClientRect();
      const t = (clientY - r.top) / Math.max(r.height, 1);
      return Math.min(1, Math.max(0, t));
    },
    updateIndexFromY(clientY) {
      const rail = this.$refs.contactIndexRail;
      if (rail) {
        const r = rail.getBoundingClientRect();
        const edge = 22;
        this.indexBubbleY = Math.min(Math.max(clientY - r.top, edge), Math.max(edge, r.height - edge));
      }
      const t = this.fractionOnRail(clientY);
      if (this.contactSort === 'last_seen') {
        const last = Math.max(this.sortedContacts.length - 1, 0);
        this.scrollToSortedIndex(Math.round(t * last));
        return;
      }
      const marks = this.contactIndexMarks;
      if (!marks.length) return;
      const mark = marks[Math.round(t * (marks.length - 1))];
      if (mark) this.scrollToSortedIndex(mark.index);
    },
    scrollToSortedIndex(index) {
      const list = this.sortedContacts;
      if (!list.length) return;
      let i = Math.min(Math.max(Number(index) || 0, 0), list.length - 1);
      if (this.contactSort !== 'last_seen') {
        const letter = this.contactLetter(list[i]);
        const first = list.findIndex((ct) => this.contactLetter(ct) === letter);
        if (first >= 0) i = first;
      }
      const ct = list[i];
      this.indexBubbleIndex = i;
      this.indexBubbleLetter = this.contactLetter(ct);
      const scroller = this.$refs.contactScroller;
      if (!scroller || ct?.id == null) return;
      const rawId = String(ct.id);
      const safeId = window.CSS?.escape ? window.CSS.escape(rawId) : rawId.replace(/"/g, '');
      const el = scroller.querySelector(`[data-contact-id="${safeId}"]`);
      if (!el) return;
      const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTop = Math.min(Math.max(el.offsetTop, 0), max);
      this.syncContactScrollMetrics();
    },
    bindContactScroller() {
      this.unbindContactScroller();
      const el = this.$refs.contactScroller;
      if (!el) return;
      if (typeof ResizeObserver !== 'undefined') {
        this._contactScrollObserver = new ResizeObserver(() => this.syncContactScrollMetrics());
        this._contactScrollObserver.observe(el);
      }
      this.syncContactScrollMetrics();
    },
    unbindContactScroller() {
      if (this._contactScrollObserver) {
        this._contactScrollObserver.disconnect();
        this._contactScrollObserver = null;
      }
    },
    syncContactScrollMetrics() {
      const el = this.$refs.contactScroller;
      if (!el) return;
      this.contactScrollTop = el.scrollTop;
      this.contactScrollHeight = el.scrollHeight;
      this.contactClientHeight = el.clientHeight;
    },
    onContactListScroll() {
      this.syncContactScrollMetrics();
    },
    contactLastSeenScore(ct) {
      const u = ct?.contact_user || {};
      if (u.is_online) return Number.MAX_SAFE_INTEGER;
      if (u.last_seen) {
        const t = new Date(u.last_seen).getTime();
        return Number.isFinite(t) ? t : 0;
      }
      return 0;
    },
    onContactsScroll() {
      /* all contacts loaded */
    },
    go(view) {
      if (view === 'contacts') {
        this.$store.dispatch('messenger/fetchContacts').catch(() => {});
        this.maybePeriodicContactSync();
      }
      if (view === 'contactSync') {
        this.$store.dispatch('messenger/fetchSyncedContacts').catch(() => {});
      }
      if (view === 'privacy' || view === 'privacyDetail') {
        this.$store.dispatch('messenger/fetchContacts').catch(() => {});
      }
      if (view === 'joinCommunity') {
        this.join = { identifier: '', busy: false, message: '', error: false };
      }
      if (view === 'createGroup' || view === 'createChannel') {
        if (this.view === 'contacts' || this.view === 'communities' || this.view === 'root') {
          this.createBackTo = this.view;
        } else if (!this.createBackTo) {
          this.createBackTo = 'root';
        }
      }
      this.view = view;
      if (view === 'profile' || view === 'settings') this.loadProfile();
      if (view === 'devices') this.loadSessions();
      if (view === 'blocked') this.$store.dispatch('messenger/fetchBlocked');
      if (view === 'passcode') {
        this.resetPasscodeFlow();
        this.refreshBiometricAvailability();
        this.appLock = getLockSnapshot();
      }
      if (view === 'e2eRecovery') this.openE2eRecoveryPage();
      if (view === 'joinCommunity') this.$nextTick(() => this.$refs.joinInput?.focus());
    },
    openProfileFromRoot() {
      this.profileBackTo = 'root';
      this.go('profile');
    },
    openProfileFromSettings() {
      this.profileBackTo = 'settings';
      this.go('profile');
    },
    goAddContact() {
      this.acReset();
      this.view = 'addContact';
      this.$nextTick(() => this.$refs.acInput?.focus());
    },
    goCreate(kind) {
      const view = kind === 'channel' ? 'createChannel' : 'createGroup';
      // Remember where the user came from so back restores that page.
      if (this.view === 'contacts' || this.view === 'communities' || this.view === 'root') {
        this.createBackTo = this.view;
      }
      this.view = view;
    },
    onCommunityCreated(conversation) {
      this.$emit('community-created', conversation);
      this.$emit('close');
    },
    back() {
      if (this.handleBack()) return;
      this.$emit('close');
    },
    // Step one level back within the menu. Returns true if a level was popped,
    // false when already at the menu root (so the parent can close the menu).
    handleBack() {
      if (this.iosInstallSheet) { this.iosInstallSheet = false; return true; }
      if (this.headerMenuOpen) { this.headerMenuOpen = false; return true; }
      if (this.avatarViewer.open) { this.avatarViewer.open = false; return true; }
      if (this.contactCtx.visible) { this.contactCtx.visible = false; return true; }
      if (this.view === 'renameContact') {
        this.view = 'contacts';
        this.renameTarget = null;
        this.renameName = '';
        return true;
      }
      if (this.view === 'blocked') { this.view = 'privacy'; return true; }
      if (this.view === 'privacyDetail') {
        if (this.$refs.privacyRulePanel?.handleBack?.()) return true;
        this.view = 'privacy';
        this.privacyKey = null;
        this.privacyExceptionMode = null;
        return true;
      }
      if (this.view === 'contactSync') { this.view = 'contacts'; return true; }
      if (this.view === 'passcode') {
        if (this.passcodeFlow.step !== 'menu') {
          this.cancelPasscodeFlow();
          return true;
        }
        this.view = 'privacy';
        return true;
      }
      if (this.view === 'e2eRecovery') {
        this.view = 'privacy';
        return true;
      }
      if (this.view === 'autoLock') { this.view = 'passcode'; return true; }
      if (this.view === 'addContact') { this.view = 'contacts'; return true; }
      if (this.view === 'createGroup' || this.view === 'createChannel') {
        this.view = this.createBackTo || 'root';
        this.createBackTo = 'root';
        return true;
      }
      if (this.view === 'joinCommunity' || this.view === 'communities') { this.view = 'root'; return true; }
      if (this.view === 'wallpaper') { this.view = 'appearance'; return true; }
      if (this.view === 'fontSlot') {
        this.view = 'fonts';
        this.fontSlotEdit = null;
        return true;
      }
      if (this.view === 'fonts') { this.view = 'appearance'; return true; }
      if (['dataPrivate', 'dataGroups', 'dataChannels'].includes(this.view)) {
        this.view = 'data';
        return true;
      }
      // Settings sub-pages → Settings (Telegram-style nesting)
      if (['devices', 'privacy', 'notifications', 'appearance', 'chat', 'data', 'language', 'about'].includes(this.view)) {
        this.view = 'settings';
        return true;
      }
      if (this.view === 'avatarEdit') {
        if (this.uploading) return true;
        this.closeAvatarEdit();
        return true;
      }
      if (this.view === 'profile') {
        this.view = this.profileBackTo === 'settings' ? 'settings' : 'root';
        this.profileBackTo = 'root';
        return true;
      }
      if (this.view === 'settings') { this.view = 'root'; return true; }
      if (this.view !== 'root') { this.view = 'root'; return true; }
      return false;
    },
    communityRoleLabel(c) {
      const role = c?.my_role || c?.pivot?.role;
      if (role === 'owner' || (this.meId && c?.owner_id && Number(c.owner_id) === Number(this.meId))) {
        return this.$t('messenger.roleOwner');
      }
      if (role === 'admin') return this.$t('messenger.roleAdmin');
      if (role === 'moderator') return this.$t('messenger.roleModerator');
      return '';
    },
    openManagedCommunity(c) {
      this.$emit('select-conversation', c);
      this.$emit('close');
    },
    openManagedCommunityInfo(c) {
      this.$emit('select-conversation', c);
      this.$emit('open-community-info', c);
      this.$emit('close');
    },
    async doJoinCommunity() {
      const raw = String(this.join.identifier || '').trim();
      if (raw.length < 2 || this.join.busy) return;
      this.join.busy = true;
      this.join.message = '';
      this.join.error = false;
      try {
        let conv = null;
        if (raw.startsWith('@') || /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/.test(raw)) {
          const username = raw.replace(/^@/, '');
          const res = await joinByUsername(username);
          conv = res?.id ? res : (res?.conversation || res?.data || res);
        } else {
          const code = raw.replace(/^.*\//, '').trim();
          const res = await joinByInvite(code);
          conv = res?.id ? res : (res?.conversation || res?.data || res);
        }
        this.join.message = this.$t('messenger.joinedCommunity');
        if (conv?.id) {
          this.$store.commit('messenger/UPSERT_CONVERSATION', conv);
          this.$emit('select-conversation', conv);
          this.$emit('close');
        } else if (conv?.conversation_id) {
          await this.$store.dispatch('messenger/ingestNewConversation', conv.conversation_id);
          this.$emit('close');
        }
      } catch (e) {
        this.join.error = true;
        this.join.message = e?.response?.data?.message || this.$t('messenger.joinCommunityFailed');
      } finally {
        this.join.busy = false;
      }
    },
    contactInitials(ct) {
      const u = ct.contact_user || {};
      return avatarInitials({ ...u, name: ct.name || u.name });
    },
    async loadProfile() {
      try {
        const p = await getMyProfile();
        this.form = { first_name: p.first_name || '', last_name: p.last_name || '', username: p.username || '', bio: toSingleLine(p.bio || '') };
      } catch (e) {
        const u = this.userInfo || {};
        this.form = { first_name: u.first_name || '', last_name: u.last_name || '', username: u.username || '', bio: toSingleLine(u.bio || '') };
      }
      this.originalUsername = (this.form.username || '').trim();
      this.usernameStatus = '';
    },
    mapAccessTokens(tokens) {
      const parser = new UAParser();
      return (tokens || []).map((token) => ({
        ...token,
        device: parser.setUA(token.name).getResult(),
      }));
    },
    async loadSessions() {
      this.sessionsLoading = true;
      this.sessionFeedback = { message: '', error: false };
      try {
        const response = await axiosInstance.post('/panel/access-tokens');
        const parser = new UAParser();
        this.currentToken = {
          ...response.data.current_token,
          device: parser.setUA(response.data.current_token.name).getResult(),
        };
        this.accessTokens = this.mapAccessTokens(response.data.access_tokens);
      } catch (e) {
        this.currentToken = null;
        this.accessTokens = [];
        this.showSessionFeedback(this.$t('messenger.sessionLoadError'), true);
      } finally {
        this.sessionsLoading = false;
      }
    },
    sessionDeviceTitle(token) {
      const os = token?.device?.os || {};
      const browser = token?.device?.browser || {};
      const osLabel = [os.name, os.version].filter(Boolean).join(' ');
      const browserLabel = browser.name || '';
      if (browserLabel && osLabel) return `${browserLabel} — ${osLabel}`;
      return osLabel || browserLabel || this.$t('messenger.unknownDevice');
    },
    sessionLocation(token) {
      const info = token?.ipInfo;
      if (!info?.countryName || info.countryName.length <= 2) return '';
      return [info.cityName, info.countryName].filter(Boolean).join(', ');
    },
    sessionMetaParts(token, withLastUsed = false) {
      const parts = [];
      const loc = this.sessionLocation(token);
      if (loc) parts.push(loc);
      if (token?.ip) parts.push(token.ip);
      if (withLastUsed) parts.push(this.sessionLastUsed(token));
      return parts;
    },
    sessionLastUsed(token) {
      if (!token?.last_used_at) return this.$t('profile.login.neverUsed');
      try {
        const locale = this.currentLocale === 'fa' ? 'fa-IR' : (this.currentLocale || 'en');
        const d = new Date(token.last_used_at);
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(d);
      } catch (e) {
        return token.last_used_at;
      }
    },
    showSessionFeedback(message, error = false) {
      this.sessionFeedback = { message, error };
      if (this.sessionFeedbackTimer) clearTimeout(this.sessionFeedbackTimer);
      this.sessionFeedbackTimer = setTimeout(() => {
        this.sessionFeedback = { message: '', error: false };
      }, 4000);
    },
    async terminateSession(id) {
      if (!id || this.sessionTerminateLoading[id]) return;
      this.sessionTerminateLoading = { ...this.sessionTerminateLoading, [id]: true };
      try {
        const response = await axiosInstance.post('/panel/access-tokens/terminate', { id });
        this.accessTokens = this.mapAccessTokens(response.data.access_tokens);
        this.showSessionFeedback(this.$t('profile.login.terminateSuccess'));
      } catch (error) {
        if (error.response?.status === 403) {
          this.showSessionFeedback(this.$t('profile.login.securityError'), true);
        } else if (error.response?.status === 404) {
          this.showSessionFeedback(this.$t('profile.login.notFound'), true);
        } else {
          this.showSessionFeedback(this.$t('messenger.sessionTerminateError'), true);
        }
      } finally {
        this.sessionTerminateLoading = { ...this.sessionTerminateLoading, [id]: false };
      }
    },
    async terminateAllSessions() {
      if (this.sessionTerminateAllLoading) return;
      this.sessionTerminateAllLoading = true;
      try {
        const response = await axiosInstance.post('/panel/access-tokens/terminateAll');
        this.accessTokens = this.mapAccessTokens(response.data.access_tokens);
        this.showSessionFeedback(this.$t('profile.login.terminateAllSuccess'));
      } catch (error) {
        if (error.response?.status === 403) {
          this.showSessionFeedback(this.$t('profile.login.securityError'), true);
        } else {
          this.showSessionFeedback(this.$t('messenger.sessionTerminateError'), true);
        }
      } finally {
        this.sessionTerminateAllLoading = false;
      }
    },
    onUsernameInput(e) {
      const raw = String(e.target.value || '').trim().replace(/^@/, '');
      this.form.username = raw;
      e.target.value = raw;
      this.usernameStatus = '';
      clearTimeout(this.usernameTimer);
      if (!raw) return;
      // Only validate when the username actually changes from the saved one.
      if (raw === this.originalUsername) return;
      this.usernameTimer = setTimeout(() => this.checkUsername(), 1500);
    },
    async checkUsername() {
      const username = (this.form.username || '').trim();
      if (!username || username === this.originalUsername) {
        this.usernameStatus = '';
        return;
      }
      this.usernameStatus = 'checking';
      try {
        const res = await checkUserUsername(username);
        if ((this.form.username || '').trim() !== username) return;
        if (res.available) this.usernameStatus = 'available';
        else if (res.reason === 'taken') this.usernameStatus = 'taken';
        else this.usernameStatus = 'invalid';
      } catch (e) {
        if ((this.form.username || '').trim() === username) this.usernameStatus = 'invalid';
      }
    },
    onBioInput(e) {
      this.form.bio = toSingleLine(e.target.value);
    },
    onHlineWheel: onHorizontalWheel,
    async saveProfile() {
      if (!this.canSaveProfile) return;
      const username = (this.form.username || '').trim();
      if (username && username !== this.originalUsername && this.usernameStatus !== 'available') {
        await this.checkUsername();
        if (!this.canSaveProfile) return;
      }
      this.savingProfile = true;
      try {
        await updateMyProfile({
          ...this.form,
          username,
          bio: toSingleLine(this.form.bio),
        });
        this.originalUsername = username;
        this.usernameStatus = '';
        await this.$store.dispatch('auth/getUser');
      } catch (e) { /* noop */ } finally {
        this.savingProfile = false;
      }
    },
    async onAvatarChange(e) {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file || !file.type.startsWith('image/')) return;
      this.revokeAvatarEditSrc();
      this.avatarEditSrc = URL.createObjectURL(file);
      this.avatarUploadPct = 0;
      this.view = 'avatarEdit';
    },
    revokeAvatarEditSrc() {
      if (this.avatarEditSrc && this.avatarEditSrc.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarEditSrc);
      }
      this.avatarEditSrc = '';
    },
    closeAvatarEdit() {
      if (this.uploading) return;
      this.revokeAvatarEditSrc();
      this.avatarUploadPct = 0;
      this.view = 'profile';
    },
    async onAvatarCropConfirm(file) {
      if (!file || this.uploading) return;
      this.uploading = true;
      this.avatarUploadPct = 0;
      try {
        await uploadProfilePic(file, {
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            this.avatarUploadPct = Math.min(100, Math.round((evt.loaded / evt.total) * 100));
          },
        });
        this.avatarUploadPct = 100;
        await this.$store.dispatch('auth/getUser');
        const me = this.userInfo;
        if (me?.id) {
          this.$store.commit('messenger/APPLY_PRESENCE', {
            userId: me.id,
            profilePic: me.profile_pic,
            firstName: me.first_name,
            lastName: me.last_name,
            username: me.username,
          });
        }
        this.revokeAvatarEditSrc();
        this.view = 'profile';
      } catch (err) { /* noop */ } finally {
        this.uploading = false;
        this.avatarUploadPct = 0;
      }
    },
    // ---- Inline add-contact ----
    acReset() {
      this.ac = { stage: 'input', identifier: '', busy: false, message: '', error: false, foundUser: null, customName: '', inviteChannel: 'email' };
    },
    async acLookup() {
      const id = this.ac.identifier.trim();
      if (id.length < 2 || this.ac.busy) return;
      this.ac.busy = true;
      this.ac.message = '';
      this.ac.error = false;
      try {
        const res = await this.$store.dispatch('messenger/lookupContactAction', id);
        if (res.status === 'found') {
          this.ac.foundUser = res.user;
          this.ac.customName = '';
          this.ac.stage = 'found';
        } else if (res.status === 'self') {
          this.ac.error = true;
          this.ac.message = this.$t('messenger.cannotAddSelf');
        } else if (res.status === 'can_invite') {
          this.ac.inviteChannel = res.channel || 'email';
          this.ac.stage = 'invite';
        } else {
          this.ac.error = true;
          this.ac.message = this.$t('messenger.userNotFoundInvalid');
        }
      } catch (e) {
        this.ac.error = true;
        this.ac.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.ac.busy = false;
      }
    },
    async acConfirmAdd() {
      if (!this.ac.foundUser || this.ac.busy) return;
      this.ac.busy = true;
      try {
        const user = this.ac.foundUser;
        await this.$store.dispatch('messenger/addContactAction', {
          contactUserId: user.id,
          name: this.ac.customName.trim() || null,
        });
        await this.$store.dispatch('messenger/fetchContacts');
        this.view = 'contacts';
        this.acReset();
      } catch (e) {
        this.ac.error = true;
        this.ac.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.ac.busy = false;
      }
    },
    async acConfirmInvite() {
      if (this.ac.busy) return;
      this.ac.busy = true;
      this.ac.message = '';
      this.ac.error = false;
      try {
        const res = await this.$store.dispatch('messenger/inviteContactAction', this.ac.identifier.trim());
        if (res.status === 'invited' && res.invited) {
          this.ac.error = false;
          this.ac.message = this.$t('messenger.inviteSent', { channel: this.$t('messenger.channel_' + (res.channel || this.ac.inviteChannel)) });
        } else {
          this.ac.error = true;
          this.ac.message = this.$t('messenger.inviteFailed');
        }
      } catch (e) {
        this.ac.error = true;
        this.ac.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.ac.busy = false;
      }
    },
    unblock(b) {
      const id = b.contact_user?.id;
      if (!id) return;
      this.$store.dispatch('messenger/unblockUserAction', id)
        .then(() => this.$store.dispatch('messenger/fetchBlocked'))
        .catch(() => {});
    },
    applyTheme(value) {
      this.theme = applyThemePreference(value);
      this.$store.dispatch('messenger/saveSettings', { theme: this.theme });
    },
    setAnimations(val) {
      this.animations = !!val;
      try { localStorage.setItem('messenger_animations', this.animations ? '1' : '0'); } catch (e) { /* noop */ }
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('messenger-no-anim', !this.animations);
      }
    },
    openSiteFaq() {
      this.$router.push({ name: 'faq', query: { category: 'messenger' } }).catch(() => {});
    },
    openSiteContact() {
      this.$router.push({ name: 'contact' }).catch(() => {});
    },
    applyFont(id) {
      this.$store.commit('messenger/SET_FONT', id);
    },
    describeFontSlot(s) {
      if (!s) {
        return {
          id: '',
          label: '',
          currentLabel: this.$t('messenger.font_system'),
          currentFamily: fontFamily('system'),
        };
      }
      const currentId = this.fontSlots?.[s.id] || defaultFontId();
      const f = this.fontOptions.find((x) => x.id === currentId) || this.fontOptions[0];
      const t = this.$t(s.labelKey);
      return {
        id: s.id,
        label: t !== s.labelKey ? t : s.id,
        currentLabel: currentId === 'system' ? this.$t('messenger.font_system') : (f?.label || currentId),
        currentFamily: fontFamily(currentId),
      };
    },
    openFontSlot(slotId) {
      this.fontSlotEdit = slotId;
      this.view = 'fontSlot';
    },
    applyFontSlot(slot, id) {
      this.$store.commit('messenger/SET_FONT_SLOT', { slot, id });
      // Stay on picker so user can compare; back button returns to slot list.
    },
    resetAllFonts() {
      const dir = typeof document !== 'undefined' ? document.documentElement.dir : undefined;
      this.$store.commit('messenger/RESET_FONT_SLOTS', dir);
    },
    saveNotif() {
      try { localStorage.setItem(NOTIF_KEY, JSON.stringify(this.notif)); } catch (e) { /* noop */ }
    },
    setNotif(key, value) {
      this.notif[key] = value;
      this.saveNotif();
    },
    applyLocale(lang) {
      this.currentLocale = lang.locale;
      this.$i18n.locale = lang.locale;
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.locale;
      localStorage.setItem('direction', lang.dir);
      localStorage.setItem('locale', lang.locale);
      document.documentElement.dispatchEvent(new Event('onChangeLanguage'));
      this.$store.commit('messenger/APPLY_FONT_DIRECTION', lang.dir);
      this.$store.dispatch('messenger/saveSettings', { locale: lang.locale });
    },
    toggleSetting(key, value) {
      this.$store.dispatch('messenger/saveSettings', { [key]: value });
    },
    privacyRuleLabel(key) {
      const rule = this.settings?.privacy?.[key]?.rule || 'everybody';
      const map = {
        everybody: 'messenger.privacyEverybody',
        contacts: 'messenger.privacyMyContacts',
        nobody: 'messenger.privacyNobody',
      };
      return this.$t(map[rule] || 'privacy.everybody');
    },
    openPrivacyDetail(key) {
      this.privacyKey = key;
      this.privacyExceptionMode = null;
      this.view = 'privacyDetail';
    },
    contactPresenceText(user) {
      return formatPresenceText(user, (k, p) => this.$t(k, p), {
        locale: this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
    onSyncedUserOpen(user) {
      if (!user?.id) return;
      this.$emit('start-chat', user);
      this.$emit('close');
    },
    maybePeriodicContactSync() {
      if (!shouldPeriodicSync()) return;
      const cached = contactsFromCache();
      if (!cached.length) {
        this.$store.dispatch('messenger/refreshContactSyncAction').catch(() => {});
        return;
      }
      this.$store.dispatch('messenger/syncContactsAction', cached).catch(() => {});
    },
    autoDlSummary(context) {
      return autoDownloadContextSummary(this.settings, context, (k) => this.$t(k));
    },
    autoDlFlag(mediaKey) {
      const ctx = this.dataContextKey;
      if (!ctx) return false;
      return !!this.settings?.auto_download?.[ctx]?.[mediaKey];
    },
    toggleAutoDl(mediaKey, value) {
      const ctx = this.dataContextKey;
      if (!ctx) return;
      this.$store.dispatch('messenger/saveSettings', {
        auto_download: { [ctx]: { [mediaKey]: !!value } },
      });
    },
    toggleAutoPlay(kind, value) {
      this.$store.dispatch('messenger/saveSettings', {
        auto_play: { [kind]: !!value },
      });
    },
    async openE2eRecoveryPage() {
      this.e2eRecoveryForm = { phrase: '', confirm: '', error: '', ok: '', busy: false, mode: 'setup' };
      const status = await this.$store.dispatch('messenger/fetchE2eRecoveryStatus').catch(() => this.e2eRecovery);
      if (status?.pending && status?.hasBackup) this.e2eRecoveryForm.mode = 'restore';
      else if (status?.pending && !status?.hasBackup) this.e2eRecoveryForm.mode = 'locked';
      else this.e2eRecoveryForm.mode = 'setup';
    },
    e2eRecoveryErrorText(code) {
      const map = {
        'recovery-too-short': 'messenger.e2eRecoveryTooShort',
        'identity-not-ready': 'messenger.e2eRecoveryNotReady',
        'recovery-required': 'messenger.e2eRecoveryRequired',
        'recovery-missing': 'messenger.e2eRecoveryMissing',
        'recovery-invalid': 'messenger.e2eRecoveryInvalid',
        'recovery-wrong': 'messenger.e2eRecoveryWrong',
        'recovery-mismatch': 'messenger.e2eRecoveryMismatch',
        'recovery-mismatch-confirm': 'messenger.e2eRecoveryConfirmMismatch',
      };
      return this.$t(map[code] || 'messenger.saveError');
    },
    async submitE2eRecoveryForm() {
      this.e2eRecoveryForm.error = '';
      this.e2eRecoveryForm.ok = '';
      const phrase = String(this.e2eRecoveryForm.phrase || '');
      if (this.e2eRecoveryForm.mode !== 'restore' && phrase.trim() !== String(this.e2eRecoveryForm.confirm || '').trim()) {
        this.e2eRecoveryForm.error = this.e2eRecoveryErrorText('recovery-mismatch-confirm');
        return;
      }
      this.e2eRecoveryForm.busy = true;
      try {
        if (this.e2eRecoveryForm.mode === 'restore') {
          await this.$store.dispatch('messenger/restoreE2eFromRecovery', phrase);
          this.e2eRecoveryForm.ok = this.$t('messenger.e2eRecoveryUnlocked');
          this.e2eRecoveryForm.mode = 'setup';
        } else {
          await this.$store.dispatch('messenger/enableE2eRecovery', phrase);
          this.e2eRecoveryForm.ok = this.$t('messenger.e2eRecoverySaved');
        }
        this.e2eRecoveryForm.phrase = '';
        this.e2eRecoveryForm.confirm = '';
      } catch (e) {
        this.e2eRecoveryForm.error = this.e2eRecoveryErrorText(e?.message);
      } finally {
        this.e2eRecoveryForm.busy = false;
      }
    },
    resetPasscodeFlow() {
      this.passcodeFlow = { step: 'menu', pin: '', pending: '', error: '' };
      this.passcodeBusy = false;
    },
    cancelPasscodeFlow() {
      this.resetPasscodeFlow();
    },
    startEnablePasscode() {
      this.passcodeFlow = { step: 'enable', pin: '', pending: '', error: '' };
    },
    startDisablePasscode() {
      this.passcodeFlow = { step: 'disable', pin: '', pending: '', error: '' };
    },
    startChangePasscode() {
      this.passcodeFlow = { step: 'changeCurrent', pin: '', pending: '', error: '' };
    },
    showPasscodeFeedback(message, isError = false) {
      this.passcodeFeedback = message;
      this.passcodeFeedbackError = isError;
      if (this.passcodeFeedbackTimer) clearTimeout(this.passcodeFeedbackTimer);
      this.passcodeFeedbackTimer = setTimeout(() => {
        this.passcodeFeedback = '';
        this.passcodeFeedbackError = false;
      }, 3200);
    },
    async refreshBiometricAvailability() {
      try {
        this.biometricKind = detectBiometricKind();
        this.biometricAvailable = await isBiometricAvailable();
      } catch {
        this.biometricAvailable = false;
      }
    },
    applyAutoLock(seconds) {
      this.appLock = setAutoLockSeconds(seconds);
    },
    async onBiometricToggle(enabled) {
      if (this.passcodeBusy) return;
      this.passcodeBusy = true;
      try {
        if (enabled) {
          this.appLock = await enableBiometric();
          this.showPasscodeFeedback(this.$t('messenger.biometricEnabled'));
        } else {
          this.appLock = await disableBiometric();
        }
      } catch (e) {
        const code = e?.name || e?.message || '';
        if (code === 'NotAllowedError' || code === 'cancelled') {
          this.showPasscodeFeedback(this.$t('messenger.biometricCancelled'), true);
        } else if (code === 'unavailable') {
          this.biometricAvailable = false;
          this.showPasscodeFeedback(this.$t('messenger.biometricUnavailable'), true);
        } else {
          this.showPasscodeFeedback(this.$t('messenger.biometricFailed'), true);
        }
        this.appLock = getLockSnapshot();
      } finally {
        this.passcodeBusy = false;
      }
    },
    async onPasscodeFlowComplete(pin) {
      if (this.passcodeBusy) return;
      const step = this.passcodeFlow.step;
      this.passcodeBusy = true;
      this.passcodeFlow.error = '';
      try {
        if (step === 'enable') {
          this.passcodeFlow = { step: 'enableConfirm', pin: '', pending: pin, error: '' };
          return;
        }
        if (step === 'enableConfirm') {
          if (pin !== this.passcodeFlow.pending) {
            this.passcodeFlow.error = this.$t('messenger.passcodeMismatch');
            this.passcodeFlow.pin = '';
            return;
          }
          this.appLock = await enableAppLock(pin);
          this.resetPasscodeFlow();
          this.showPasscodeFeedback(this.$t('messenger.passcodeEnabled'));
          return;
        }
        if (step === 'disable') {
          try {
            this.appLock = await disableAppLock(pin);
            this.resetPasscodeFlow();
            this.showPasscodeFeedback(this.$t('messenger.passcodeDisabled'));
          } catch {
            this.passcodeFlow.error = this.$t('messenger.wrongPasscode');
            this.passcodeFlow.pin = '';
          }
          return;
        }
        if (step === 'changeCurrent') {
          const ok = await verifyAppLockPin(pin);
          if (!ok) {
            this.passcodeFlow.error = this.$t('messenger.wrongPasscode');
            this.passcodeFlow.pin = '';
            return;
          }
          this.passcodeFlow = { step: 'changeNew', pin: '', pending: pin, error: '' };
          return;
        }
        if (step === 'changeNew') {
          this.passcodeFlow = {
            step: 'changeConfirm',
            pin: '',
            pending: this.passcodeFlow.pending,
            next: pin,
            error: '',
          };
          return;
        }
        if (step === 'changeConfirm') {
          if (pin !== this.passcodeFlow.next) {
            this.passcodeFlow.error = this.$t('messenger.passcodeMismatch');
            this.passcodeFlow.pin = '';
            return;
          }
          this.appLock = await changeAppLockPin(this.passcodeFlow.pending, pin);
          this.resetPasscodeFlow();
          this.showPasscodeFeedback(this.$t('messenger.passcodeChanged'));
        }
      } finally {
        this.passcodeBusy = false;
      }
    },
    onDocClickHeaderMenu(e) {
      if (!this.headerMenuOpen) return;
      const wrap = this.$refs.headerMenuWrap;
      if (wrap && wrap.contains(e.target)) return;
      this.headerMenuOpen = false;
    },
    async onHeaderMenuAction(key) {
      this.headerMenuOpen = false;
      if (key === 'edit-profile') {
        if (this.view === 'settings') this.openProfileFromSettings();
        else this.openProfileFromRoot();
        return;
      }
      if (key === 'copy-profile-link') {
        const url = userProfileUrl(this.userInfo?.username);
        if (!url) return;
        const ok = await copyText(url);
        if (ok) {
          this.copiedMenuKey = 'profile-link';
          setTimeout(() => { this.copiedMenuKey = null; }, 1600);
        }
        return;
      }
      if (key === 'logout') {
        this.$emit('request-logout');
        return;
      }
    },
    openMyAvatarViewer() {
      const src = this.hasRealAvatar ? this.userInfo.profile_pic : '';
      this.avatarViewer = { open: !!src, src: src || '' };
    },
    onAvatarViewerChangePhoto() {
      this.avatarViewer.open = false;
      this.$nextTick(() => this.$refs.avatarInput?.click());
    },
    async deleteMyAvatar() {
      if (!this.hasRealAvatar || this.uploading) return;
      this.uploading = true;
      try {
        await deleteProfilePic();
        await this.$store.dispatch('auth/getUser');
        this.avatarViewer.open = false;
      } catch (e) { /* noop */ } finally {
        this.uploading = false;
      }
    },
    async installPwa() {
      if (this.pwaInstalling) return;
      const state = getPwaInstallState();
      if (state.isStandalone) return;
      this.pwaInstalling = true;
      try {
        if (state.canInstall || state.hasDeferredPrompt) {
          await promptPwaInstall();
          return;
        }
        if (state.isIos) {
          this.iosInstallSheet = true;
        }
      } finally {
        this.pwaInstalling = false;
      }
    },
    flashCopy(field) {
      if (field === 'username') {
        this.usernameCopied = true;
        if (this.usernameCopiedTimer) clearTimeout(this.usernameCopiedTimer);
        this.usernameCopiedTimer = setTimeout(() => { this.usernameCopied = false; }, 650);
      } else if (field === 'bio') {
        this.bioCopied = true;
        if (this.bioCopiedTimer) clearTimeout(this.bioCopiedTimer);
        this.bioCopiedTimer = setTimeout(() => { this.bioCopied = false; }, 650);
      }
    },
    setupCopyBindings() {
      this.teardownCopyBindings();
      if (this.$refs.settingsUsernameEl) {
        this.unbindCopy.push(bindCopyOnPress(
          this.$refs.settingsUsernameEl,
          () => `@${this.userInfo?.username || ''}`,
          () => this.flashCopy('username'),
        ));
      }
      if (this.$refs.settingsBioEl) {
        this.unbindCopy.push(bindCopyOnPress(
          this.$refs.settingsBioEl,
          () => this.userInfo?.bio || this.form.bio || '',
          () => this.flashCopy('bio'),
        ));
      }
    },
    teardownCopyBindings() {
      this.unbindCopy.forEach((fn) => { try { fn(); } catch (e) { /* noop */ } });
      this.unbindCopy = [];
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

.contact-scroller {
  position: absolute;
  inset: 0;
  overflow-y: auto;
}
.contact-row-main {
  padding-inline-start: 0.75rem;
  transition: padding-inline-start 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.contact-row.is-lettered .contact-row-main {
  padding-inline-start: 0.15rem;
}
.contacts-letter-col {
  width: 0;
  opacity: 0;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}
.contacts-letter-col.is-open {
  width: 2.4rem;
  opacity: 1;
}
.contacts-letter-glyph {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: rgba(51, 144, 236, 0.9);
  background: transparent;
  user-select: none;
}
.contacts-scrollbar {
  width: 14px;
  cursor: ns-resize;
  touch-action: none;
}
.contacts-scrollbar-thumb {
  position: absolute;
  top: 0;
  inset-inline-end: 3px;
  width: 4px;
  border-radius: 999px;
  background: rgba(112, 117, 121, 0.45);
  pointer-events: none;
  transition: background 0.15s ease, width 0.15s ease;
}
.contacts-scrollbar:hover .contacts-scrollbar-thumb,
.contacts-scrollbar.is-dragging .contacts-scrollbar-thumb {
  width: 5px;
  background: rgba(51, 144, 236, 0.85);
}
.contacts-index-bubble {
  min-width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(51, 144, 236, 0.94);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(51, 144, 236, 0.35);
  z-index: 5;
  inset-inline-start: auto;
  inset-inline-end: calc(100% + 6px);
  opacity: 0;
  transform: translateY(-50%) scale(0.72);
  transition: opacity 0.16s ease, transform 0.16s ease;
  pointer-events: none;
}
.contacts-index-bubble.is-on {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  animation: contacts-index-pop 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes contacts-index-pop {
  0% { transform: translateY(-50%) scale(0.72); }
  65% { transform: translateY(-50%) scale(1.08); }
  100% { transform: translateY(-50%) scale(1); }
}

/* Quick, soft transition between menu views */
.menu-view-enter-active,
.menu-view-leave-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease,
    transform var(--tg-dur-fast, 140ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.menu-view-enter-from {
  opacity: 0;
  transform: translateX(14px);
}
.menu-view-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}
[dir="rtl"] .menu-view-enter-from {
  transform: translateX(-14px);
}
[dir="rtl"] .menu-view-leave-to {
  transform: translateX(14px);
}

.menu-divider {
  height: 1px;
  margin: 4px 0;
  background: rgba(0, 0, 0, 0.06);
}

.dark .menu-divider {
  background: rgba(255, 255, 255, 0.06);
}

.menu-row {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 9px 18px;
  text-align: start;
  transition: background-color 0.15s ease;
}

.menu-row:hover {
  background: rgba(0, 0, 0, 0.04);
}

.dark .menu-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.menu-row-icon {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  color: #707579;
}

.menu-row-label {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 400;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .menu-row-label {
  color: #e8e8e8;
}

.menu-row-chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #c4c9cc;
}

.menu-section-title {
  padding: 8px 20px 6px;
  font-size: 13px;
  font-weight: 500;
  color: #3390ec;
}

.menu-settings-group {
  margin: 0 12px 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.dark .menu-settings-group {
  background: #17212b;
}

.menu-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  font-size: 15px;
  color: #222;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .menu-settings-row {
  color: #e8e8e8;
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.menu-settings-row-btn {
  cursor: pointer;
  transition: background 0.12s ease;
}
.menu-settings-row-btn:hover {
  background: rgba(0, 0, 0, 0.03);
}
.dark .menu-settings-row-btn:hover {
  background: rgba(255, 255, 255, 0.04);
}

.tg-settings-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 20px;
  background: #f4f4f5;
}
.dark .tg-settings-hero { background: #0e1621; }

.tg-settings-name {
  margin-top: 12px;
  font-size: 17px;
  font-weight: 600;
  color: #000;
}
.dark .tg-settings-name { color: #fff; }

.tg-settings-status {
  margin-top: 2px;
  font-size: 14px;
  color: #3390ec;
}

.tg-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
.dark .tg-card { background: #17212b; }

.tg-info-row {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.tg-info-row:last-child { border-bottom: none; }
.dark .tg-info-row { border-bottom-color: rgba(255, 255, 255, 0.06); }

.tg-info-content {
  min-width: 0;
  text-align: start;
}
.tg-info-value-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-width: 0;
}
.tg-info-icon-sm {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  color: #707579;
}

.tg-info-icon {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  margin-top: 2px;
  color: #707579;
}

.tg-info-value {
  font-size: 15px;
  color: #000;
  line-height: 1.3;
  min-width: 0;
  text-align: start;
  background: none;
  border: 0;
  padding: 0;
  font-family: var(--msg-font-settings);
  font-variant-emoji: text;
  font-variant-numeric: normal;
}
.dark .tg-info-value { color: #fff; }

.tg-info-label {
  font-size: 13px;
  color: #707579;
  margin-top: 4px;
  padding-inline-start: 31px;
  text-align: start;
}
.tg-copyable {
  cursor: pointer;
  transition: color 0.15s ease;
}
.tg-copyable:hover {
  color: #3390ec;
}
.tg-copyable.is-copy-flash {
  animation: copyFlash 0.65s ease;
}
@keyframes copyFlash {
  0% { color: inherit; }
  30% { color: #3390ec; transform: scale(1.02); }
  100% { color: inherit; transform: scale(1); }
}

.session-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  min-height: 0;
}
.session-row--bordered {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .session-row--bordered {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.session-section-label {
  padding: 6px 16px 4px;
  font-size: 12px;
  font-weight: 600;
  color: #3390ec;
}

.session-body {
  flex: 1;
  min-width: 0;
}

.session-head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.session-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark .session-title { color: #f3f4f6; }

.session-online {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: #3390ec;
  line-height: 1;
}

.session-meta {
  margin: 1px 0 0;
  font-size: 11px;
  line-height: 1.3;
  color: #a2acb4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-terminate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  color: #a2acb4;
  transition: background 0.15s ease, color 0.15s ease;
}
.session-terminate-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.session-terminate-btn:disabled {
  opacity: 0.45;
}

.session-terminate-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  transition: background 0.12s ease;
}
.session-terminate-all-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.06);
}
.session-terminate-all-btn:disabled {
  opacity: 0.55;
}

.session-hint {
  margin: 6px 16px 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #a2acb4;
}

.session-empty {
  padding: 20px 16px;
  text-align: center;
}
.session-empty-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto;
  color: rgba(162, 172, 180, 0.55);
}
.session-empty-title {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}
.dark .session-empty-title { color: #d1d5db; }
.session-empty-desc {
  margin-top: 4px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #a2acb4;
}

.session-feedback {
  margin: 10px 16px 0;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
}
.session-feedback.is-error { color: #ef4444; }
.session-feedback.is-success { color: #16a34a; }
.dark .session-feedback.is-success { color: #4ade80; }

/* Floating-label input field (Telegram edit-profile style) */
.tg-field {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.tg-field:last-child { border-bottom: none; }
.dark .tg-field { border-bottom-color: rgba(255, 255, 255, 0.08); }

.tg-field-input {
  width: 100%;
  padding: 20px 16px 8px;
  font-size: 15px;
  color: #000;
  background: transparent;
  border: 0;
  outline: none;
}
.dark .tg-field-input { color: #fff; }

.tg-field-label {
  position: absolute;
  top: 14px;
  inset-inline-start: 16px;
  font-size: 15px;
  color: #a2acb4;
  pointer-events: none;
  transition: all 0.15s ease;
}

.tg-field-input:focus ~ .tg-field-label,
.tg-field-input:not(:placeholder-shown) ~ .tg-field-label {
  top: 6px;
  font-size: 12px;
  color: #3390ec;
}

.tg-field-counter {
  position: absolute;
  top: 8px;
  inset-inline-end: 14px;
  font-size: 13px;
  color: #a2acb4;
}

.menu-settings-row-last {
  border-bottom: none;
}

.passcode-setup {
  padding: 20px 16px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.passcode-setup__hero {
  text-align: center;
  margin-bottom: 18px;
}
.passcode-setup__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3390ec;
  background: rgba(51, 144, 236, 0.12);
}
.passcode-setup__icon svg {
  width: 24px;
  height: 24px;
}
.dark .passcode-setup__icon {
  background: rgba(51, 144, 236, 0.16);
}
.passcode-setup__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}
.dark .passcode-setup__title { color: #f3f4f6; }
.passcode-setup__cancel {
  margin-top: 18px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #3390ec;
  background: transparent;
  border: 0;
}
.passcode-setup__cancel:disabled {
  opacity: 0.5;
}

/* Appearance — Telegram-style theme preview cards */
.tg-theme-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.tg-theme-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 6px 12px;
  border-radius: 14px;
  background: #fff;
  border: 2px solid transparent;
  transition: border-color 0.15s ease, transform 0.12s ease;
  cursor: pointer;
}
.dark .tg-theme-card { background: #17212b; }
.tg-theme-card.is-on { border-color: #3390ec; }
.tg-theme-card:active { transform: scale(0.97); }
.tg-theme-preview {
  width: 100%;
  aspect-ratio: 3 / 4;
  max-height: 88px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.tg-theme-preview[data-theme="light"] { background: #c8d9e8; }
.tg-theme-preview[data-theme="dark"] { background: #0e1621; }
.tg-theme-preview[data-theme="system"] {
  background: linear-gradient(105deg, #c8d9e8 50%, #0e1621 50%);
}
.tg-theme-preview-bar {
  display: block;
  height: 14px;
  background: rgba(255, 255, 255, 0.85);
}
.tg-theme-preview[data-theme="dark"] .tg-theme-preview-bar,
.tg-theme-preview[data-theme="system"] .tg-theme-preview-bar {
  background: #17212b;
}
.tg-theme-preview[data-theme="system"] .tg-theme-preview-bar {
  background: linear-gradient(105deg, rgba(255, 255, 255, 0.9) 50%, #17212b 50%);
}
.tg-theme-preview-bubbles {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 6px;
}
.tg-theme-preview-in,
.tg-theme-preview-out {
  display: block;
  height: 10px;
  border-radius: 8px;
  width: 62%;
}
.tg-theme-preview-in { background: #fff; align-self: flex-start; }
.tg-theme-preview-out { background: #eeffde; align-self: flex-end; width: 55%; }
.tg-theme-preview[data-theme="dark"] .tg-theme-preview-in { background: #1e2c3a; }
.tg-theme-preview[data-theme="dark"] .tg-theme-preview-out { background: #3e6b41; }
.tg-theme-preview[data-theme="system"] .tg-theme-preview-in {
  background: linear-gradient(105deg, #fff 40%, #1e2c3a 60%);
}
.tg-theme-preview[data-theme="system"] .tg-theme-preview-out {
  background: linear-gradient(105deg, #eeffde 40%, #3e6b41 60%);
}
.tg-theme-card-label {
  font-size: 12.5px;
  font-weight: 500;
  color: #222;
}
.dark .tg-theme-card-label { color: #e8e8e8; }
.tg-theme-check {
  position: absolute;
  top: 8px;
  inset-inline-end: 8px;
  width: 16px;
  height: 16px;
  color: #3390ec;
}
</style>
