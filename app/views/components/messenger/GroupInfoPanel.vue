<template>
  <div class="relative h-full min-h-0 flex flex-col bg-[#f4f4f5] dark:bg-[#0e1621]">
    <header class="flex items-center gap-2 px-2 h-14 flex-shrink-0 bg-[#f4f4f5] dark:bg-[#0e1621] border-b border-black/[0.06] dark:border-white/[0.06]">
      <button type="button" class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition" @click="onHeaderBack">
        <svg v-if="manageMode || imageEdit" class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 12h16m0 0l-6 6m6-6l-6-6" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h3 class="flex-1 text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate text-center">
        {{ headerTitle }}
      </h3>
      <div v-if="!imageEdit" class="flex items-center gap-0.5 min-w-[4.5rem] justify-end">
        <template v-if="manageMode && canEditInfo">
          <button type="button" class="text-[13px] font-semibold text-[#3390ec] px-2 disabled:opacity-40" :disabled="saving || !canSaveEdit" @click="saveEdit">
            {{ saving ? '…' : $t('messenger.saveProfile') }}
          </button>
        </template>
        <template v-else-if="!manageMode">
          <div ref="moreMenuWrap" class="relative">
            <button
              type="button"
              class="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#707579] transition"
              :title="$t('messenger.more')"
              @click.stop="moreMenuOpen = !moreMenuOpen"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="4" height="4" x="10" y="3" rx="2" />
                <rect width="4" height="4" x="10" y="10" rx="2" />
                <rect width="4" height="4" x="10" y="17" rx="2" />
              </svg>
            </button>
            <div
              v-if="moreMenuOpen"
              class="tg-menu absolute top-full mt-1 rtl:left-0 ltr:right-0 z-30"
              @click.stop
            >
              <button v-if="canEdit" type="button" class="tg-menu-item" @click="moreAction('manage')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('edit')" :key="'ge'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ isChannel ? $t('messenger.editChannel') : $t('messenger.editGroup') }}</span>
              </button>
              <button v-if="canInvite && canEdit" type="button" class="tg-menu-item" @click="moreAction('add-members')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('userPlus')" :key="'ga'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ $t('messenger.addMembers') }}</span>
              </button>
              <button v-if="conversation?.username && conversation?.is_public" type="button" class="tg-menu-item" @click="moreAction('copy-link')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('link')" :key="'gl'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ copiedKey === 'public' ? $t('messenger.copied') : $t('messenger.copyLink') }}</span>
              </button>
              <button v-if="canEdit" type="button" class="tg-menu-item" @click="moreAction('invites')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('link')" :key="'gi'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ $t('messenger.inviteLinks') }}</span>
              </button>
              <button type="button" class="tg-menu-item" @click="moreAction('mute')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths(isMuted ? 'bell' : 'bellOff')" :key="'gm'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ isMuted ? $t('messenger.unmute') : $t('messenger.mute') }}</span>
              </button>
              <div class="tg-menu-divider" />
              <button type="button" class="tg-menu-item" @click="moreAction('clear')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('eraser')" :key="'gc'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ $t('messenger.clearConversation') }}</span>
              </button>
              <button type="button" class="tg-menu-item is-danger" @click="moreAction('leave')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('leave')" :key="'gv'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ isChannel ? $t('messenger.leaveChannel') : $t('messenger.leaveGroup') }}</span>
              </button>
              <button type="button" class="tg-menu-item is-danger" @click="moreAction('delete')">
                <span class="tg-menu-item-glyph" aria-hidden="true">
                  <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path v-for="(d, di) in menuIconPaths('trash')" :key="'gd'+di" :d="d" />
                  </svg>
                </span>
                <span class="tg-menu-item-label">{{ $t('messenger.deleteConversation') }}</span>
              </button>
            </div>
          </div>
        </template>
        <div v-else class="w-9" />
      </div>
      <div v-else class="w-9" />
    </header>

    <AvatarCropEditor
      v-if="imageEdit"
      class="flex-1 min-h-0"
      :image-src="imageEdit.src"
      :mode="imageEdit.kind === 'cover' ? 'cover' : 'avatar'"
      :uploading="imageEdit.uploading"
      :upload-percentage="imageEdit.pct"
      @cancel="closeImageEdit"
      @confirm="onImageEditConfirm"
    />

    <div v-else class="flex-1 overflow-y-auto hide-scrollbar min-h-0 pb-3">
      <!-- Hero -->
      <div class="relative mb-3">
        <div class="h-36 bg-gradient-to-br from-[#3390ec]/25 via-[#8ec7f7]/15 to-transparent relative overflow-hidden group/cover"
          :style="coverStyle">
          <label
            v-if="manageMode && canManageCover"
            class="absolute bottom-3 end-3 z-[5] w-9 h-9 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer shadow-md transition"
            :title="$t('messenger.changeCover')"
          >
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="file" accept="image/*" class="hidden" @change="onPickImage($event, 'cover')" />
          </label>
        </div>
        <div class="flex flex-col items-center px-4 -mt-11 relative z-[1]">
          <div class="relative">
            <div class="rounded-full ring-[3px] ring-[#f4f4f5] dark:ring-[#0e1621] shadow-sm">
              <MessengerAvatar :src="local.avatar || conversation?.avatar" :name="local.title || conversation?.title" size="xl" />
            </div>
            <label
              v-if="manageMode && canManageAvatar"
              class="absolute bottom-0.5 end-0.5 z-[5] w-8 h-8 rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white flex items-center justify-center cursor-pointer shadow ring-2 ring-[#f4f4f5] dark:ring-[#0e1621] transition"
              :title="$t('messenger.changePhoto')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" class="hidden" @change="onPickImage($event, 'avatar')" />
            </label>
          </div>
          <template v-if="!manageMode || !canEditInfo">
            <div class="mt-3.5 flex items-center justify-center gap-1.5 max-w-full px-2">
              <h2 class="text-[17px] font-semibold text-gray-900 dark:text-gray-100 truncate">{{ conversation?.title }}</h2>
              <span v-if="lockedNow" class="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 font-bold">{{ $t('messenger.locked') }}</span>
            </div>
            <p class="mt-0.5 text-[13px] text-[#707579] text-center">
              <span v-if="conversation?.username" dir="ltr">@{{ conversation.username }} · </span>
              {{ memberCountLabel }}
            </p>
          </template>
        </div>
      </div>

      <!-- ========== VIEW MODE ========== -->
      <template v-if="!manageMode">
        <div v-if="conversation?.description" class="tg-card mx-3 mb-3">
          <div class="tg-info-row">
            <svg class="tg-info-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="min-w-0">
              <div class="tg-info-value break-words">{{ conversation.description }}</div>
              <div class="tg-info-label">{{ $t('messenger.groupDescription') }}</div>
            </div>
          </div>
        </div>

        <div class="tg-card mx-3 mb-3 overflow-hidden">
          <div class="tg-select-block border-b-0">
            <label class="tg-select-label">{{ $t('messenger.chatNotifications') }}</label>
            <select :value="myNotificationMode" class="tg-select" @change="setMyNotificationMode($event.target.value)">
              <option value="all">{{ $t('messenger.notifModeAll') }}</option>
              <option value="mentions">{{ $t('messenger.notifModeMentions') }}</option>
              <option value="mute">{{ $t('messenger.notifModeMute') }}</option>
            </select>
          </div>
        </div>

        <SharedMediaSection
          ref="sharedMedia"
          show-members-tab
          :is-channel="isChannel"
          :viewer-host="viewerHost"
          :conversation-id="conversation?.id"
          @tab-change="onSharedMediaTabChange"
          @go-to-message="$emit('go-to-message', $event)"
          @open-link="$emit('open-link', $event)"
        >
          <template #members>
            <div class="gi-tab-panel">
              <MessengerSkeleton
                v-if="membersLoading && !members.length"
                variant="members"
                :count="6"
              />
              <template v-else>
                <div v-for="(m, idx) in members" :key="'view-'+m.user.id"
                  :class="['w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.03] dark:hover:bg-white/5 transition', idx < members.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
                  <button type="button" class="flex items-center gap-2.5 flex-1 min-w-0 text-start" @click="$emit('open-member', m)">
                    <MessengerAvatar :user="m.user" size="sm" />
                    <div class="flex-1 min-w-0">
                      <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{{ m.nickname || displayName(m.user) }}</div>
                      <div class="text-[12px] text-[#a2acb4]">
                        {{ roleLabel(m.role) }}
                        <span v-if="m.custom_title"> · {{ m.custom_title }}</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div ref="membersSentinel" class="h-1" />
                <MessengerSkeleton v-if="membersLoading && members.length" variant="members" :count="2" />
              </template>
            </div>
          </template>
        </SharedMediaSection>
      </template>

      <!-- ========== MANAGE / EDIT MODE ========== -->
      <template v-else>
        <!-- Profile edit form -->
        <div v-if="canEditInfo" class="tg-card mx-3 mb-3">
          <div class="p-4 space-y-3">
            <div>
              <label class="text-[12px] font-medium text-[#707579]">{{ isChannel ? $t('messenger.channelTitle') : $t('messenger.groupTitle') }}</label>
              <input v-model="local.title" type="text" maxlength="128" class="tg-field-inset mt-1" />
            </div>

            <label class="tg-toggle-row">
              <span>{{ isChannel ? $t('messenger.publicChannel') : $t('messenger.publicGroup') }}</span>
              <input type="checkbox" v-model="local.is_public" class="toggle toggle-sm toggle-info" @change="onPublicToggle" />
            </label>

            <div v-if="local.is_public">
              <label class="text-[12px] font-medium text-[#707579]">{{ $t('messenger.username') }} <span class="text-red-500">*</span></label>
              <div class="tg-field-wrap mt-1" :class="usernameBorderClass">
                <span class="ps-3 text-sm text-[#a2acb4]">@</span>
                <input v-model="local.username" type="text" maxlength="32" @input="onUsernameInput" />
              </div>
              <p v-if="usernameStatus === 'checking'" class="mt-1 text-[11px] text-[#a2acb4]">{{ $t('messenger.usernameChecking') }}</p>
              <p v-else-if="usernameStatus === 'available'" class="mt-1 text-[11px] text-green-600">{{ $t('messenger.usernameAvailable') }}</p>
              <p v-else-if="usernameStatus === 'taken'" class="mt-1 text-[11px] text-red-500">{{ $t('messenger.usernameTaken') }}</p>
              <p v-else-if="usernameStatus === 'invalid'" class="mt-1 text-[11px] text-red-500">{{ $t('messenger.usernameInvalid') }}</p>
            </div>
            <div v-else class="rounded-2xl bg-[#f4f4f5] dark:bg-[#0e1621] px-3 py-2.5 text-[12px] text-[#707579]">
              <span class="font-semibold text-gray-800 dark:text-gray-200" dir="ltr">@{{ local.username || conversation?.username || '—' }}</span>
              <span class="ms-1">{{ $t('messenger.privateAutoIdHint') }}</span>
            </div>

            <div>
              <label class="text-[12px] font-medium text-[#707579]">{{ $t('messenger.groupDescription') }}</label>
              <textarea
                :value="local.description"
                rows="1"
                wrap="off"
                maxlength="2000"
                class="tg-field-inset mt-1 messenger-hline"
                @keydown.enter.prevent
                @wheel="onHlineWheel"
                @input="onDescriptionInput"
              ></textarea>
            </div>
            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          </div>
        </div>

        <!-- Admin tabs -->
        <div class="gi-shell mx-3 mb-3">
          <div ref="adminTabs"
            class="gi-tabs hide-scrollbar select-none"
            @mousedown="onTabDragStart"
            @mousemove="onTabDragMove"
            @mouseup="onTabDragEnd"
            @mouseleave="onTabDragEnd"
            @touchstart.passive="onTabTouchStart"
            @touchmove.passive="onTabTouchMove"
            @touchend="onTabDragEnd">
            <button
              v-for="t in adminTabs"
              :key="t.id"
              type="button"
              :class="['gi-tab', tab === t.id ? 'is-active' : '']"
              @click="onTabClick(t.id)"
            >{{ t.label }}</button>
          </div>
        </div>

      <!-- Settings -->
      <div v-if="tab === 'settings' && canEditInfo" class="tg-card mx-3 mb-3">
        <label class="tg-toggle-row">
          <span>{{ isChannel ? $t('messenger.publicChannel') : $t('messenger.publicGroup') }}</span>
          <input type="checkbox" :checked="conversation.is_public" @change="onSettingsPublicChange" class="toggle toggle-sm toggle-info" />
        </label>
        <label v-if="!isChannel" class="tg-toggle-row">
          <span>{{ $t('messenger.historyVisible') }}</span>
          <input type="checkbox" :checked="conversation.history_visible" @change="patch({ history_visible: $event.target.checked })" class="toggle toggle-sm toggle-info" />
        </label>
        <label class="tg-toggle-row">
          <span>{{ $t('messenger.joinApproval') }}</span>
          <input type="checkbox" :checked="conversation.join_approval_required" @change="patch({ join_approval_required: $event.target.checked })" class="toggle toggle-sm toggle-info" />
        </label>
        <label v-if="isChannel" class="tg-toggle-row">
          <span>{{ $t('messenger.commentsEnabled') }}</span>
          <input type="checkbox" :checked="!!conversation.comments_enabled" @change="patch({ comments_enabled: $event.target.checked })" class="toggle toggle-sm toggle-info" />
        </label>
        <label v-if="isChannel" class="tg-toggle-row">
          <span>{{ $t('messenger.signaturesEnabled') }}</span>
          <input type="checkbox" :checked="!!conversation.signatures_enabled" @change="patch({ signatures_enabled: $event.target.checked })" class="toggle toggle-sm toggle-info" />
        </label>

        <div v-if="!isChannel" class="tg-select-block">
          <label class="tg-select-label">{{ $t('messenger.whoCanSend') }}</label>
          <select :value="conversation.who_can_send || 'all'" class="tg-select" @change="patch({ who_can_send: $event.target.value })">
            <option value="all">{{ $t('messenger.permissionEveryone') }}</option>
            <option value="admins">{{ $t('messenger.permissionAdmins') }}</option>
          </select>
        </div>
        <div class="tg-select-block">
          <label class="tg-select-label">{{ $t('messenger.whoCanInvite') }}</label>
          <select :value="conversation.who_can_invite || 'all'" class="tg-select" @change="patch({ who_can_invite: $event.target.value })">
            <option value="all">{{ $t('messenger.permissionEveryone') }}</option>
            <option value="admins">{{ $t('messenger.permissionAdmins') }}</option>
          </select>
        </div>
        <div class="tg-select-block">
          <label class="tg-select-label">{{ $t('messenger.whoCanPin') }}</label>
          <select :value="conversation.who_can_pin || 'admins'" class="tg-select" @change="patch({ who_can_pin: $event.target.value })">
            <option value="all">{{ $t('messenger.permissionEveryone') }}</option>
            <option value="admins">{{ $t('messenger.permissionAdmins') }}</option>
          </select>
        </div>
        <div class="tg-select-block">
          <label class="tg-select-label">{{ $t('messenger.whoCanEditInfo') }}</label>
          <select :value="conversation.who_can_edit_info || 'admins'" class="tg-select" @change="patch({ who_can_edit_info: $event.target.value })">
            <option value="all">{{ $t('messenger.permissionEveryone') }}</option>
            <option value="admins">{{ $t('messenger.permissionAdmins') }}</option>
          </select>
        </div>
        <div class="tg-select-block border-b-0">
          <label class="tg-select-label">{{ $t('messenger.slowMode') }}</label>
          <select :value="conversation.slow_mode_seconds || 0" class="tg-select" @change="patch({ slow_mode_seconds: Number($event.target.value) })">
            <option :value="0">{{ $t('messenger.off') }}</option>
            <option :value="5">5s</option>
            <option :value="10">10s</option>
            <option :value="30">30s</option>
            <option :value="60">1m</option>
            <option :value="300">5m</option>
          </select>
        </div>
      </div>

      <!-- Chat lock -->
      <div v-if="tab === 'lock' && canEditInfo && !isChannel" class="tg-card mx-3 mb-3 p-4 space-y-3">
        <div class="rounded-2xl bg-amber-500/10 px-3 py-2.5 text-sm">
          <div class="font-semibold text-amber-700 dark:text-amber-400 mb-0.5">{{ $t('messenger.chatLock') }}</div>
          <p class="text-[12px] text-[#707579]">{{ $t('messenger.chatLockHint') }}</p>
          <p v-if="lockedNow" class="mt-1.5 text-[12px] font-semibold text-amber-600">
            {{ isStaffRole ? $t('messenger.chatLockedNowStaff') : $t('messenger.chatLockedNow') }}
          </p>
        </div>
        <button type="button"
          :class="['w-full py-2.5 rounded-2xl text-[14px] font-semibold transition', (conversation.messages_locked || conversation.messages_locked_until) ? 'bg-green-500 text-white' : 'bg-amber-500 text-white']"
          @click="toggleManualLock">
          {{ (conversation.messages_locked || conversation.messages_locked_until) ? $t('messenger.unlockChat') : $t('messenger.lockChatNow') }}
        </button>
        <div>
          <label class="tg-select-label">{{ $t('messenger.lockUntil') }}</label>
          <div class="mt-1 flex gap-2">
            <input v-model="lockUntilLocal" type="datetime-local" class="tg-field-inset flex-1" />
            <button type="button" class="px-3 rounded-2xl bg-[#3390ec] text-white text-[12px] font-semibold" @click="applyLockUntil">{{ $t('messenger.apply') }}</button>
          </div>
          <button v-if="conversation.messages_locked_until" type="button" class="mt-1 text-[12px] text-red-500" @click="patch({ messages_locked_until: null })">{{ $t('messenger.clearLockUntil') }}</button>
        </div>
        <div class="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
          <label class="flex items-center justify-between text-[14px] text-gray-900 dark:text-gray-100 gap-3 py-1">
            <span>{{ $t('messenger.scheduleLock') }}</span>
            <input type="checkbox" v-model="schedule.enabled" class="toggle toggle-sm toggle-info" @change="saveSchedule" />
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-[#a2acb4]">{{ $t('messenger.lockFrom') }}</label>
              <input v-model="schedule.start" type="time" class="tg-field-inset mt-0.5" @change="saveSchedule" />
            </div>
            <div>
              <label class="text-[10px] text-[#a2acb4]">{{ $t('messenger.lockTo') }}</label>
              <input v-model="schedule.end" type="time" class="tg-field-inset mt-0.5" @change="saveSchedule" />
            </div>
          </div>
        </div>
      </div>

      <!-- Invites -->
      <div v-if="tab === 'invites' && canEdit" class="space-y-3 mx-3 mb-3">
        <div class="tg-card p-4 space-y-2.5">
          <div class="text-[12px] font-semibold text-[#707579]">{{ $t('messenger.createInviteLink') }}</div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-[#a2acb4]">{{ $t('messenger.inviteMaxUses') }}</label>
              <input v-model.number="inviteForm.max_uses" type="number" min="0" :placeholder="$t('messenger.unlimited')" class="tg-field-inset mt-0.5" />
            </div>
            <div>
              <label class="text-[10px] text-[#a2acb4]">{{ $t('messenger.inviteExpiresHours') }}</label>
              <input v-model.number="inviteForm.expires_hours" type="number" min="0" :placeholder="$t('messenger.never')" class="tg-field-inset mt-0.5" />
            </div>
          </div>
          <label class="flex items-center justify-between text-[14px] text-gray-900 dark:text-gray-100 gap-3 py-1">
            <span>{{ $t('messenger.inviteTemporary') }}</span>
            <input type="checkbox" v-model="inviteForm.is_temporary" class="toggle toggle-sm toggle-info" />
          </label>
          <button type="button" class="w-full py-2.5 rounded-2xl bg-[#3390ec] text-white text-[14px] font-semibold" @click="makeInvite">{{ $t('messenger.createInviteLink') }}</button>
        </div>
        <div class="tg-card overflow-hidden">
          <!-- Public @username link -->
          <div
            v-if="conversation.username && conversation.is_public"
            class="flex items-center gap-2 px-3 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]"
          >
            <div class="flex-1 min-w-0">
              <div class="text-[11px] font-medium text-[#a2acb4] mb-0.5">{{ $t('messenger.publicLink') }}</div>
              <code class="block truncate text-[12px] select-all text-[#3390ec]" dir="ltr">{{ publicLink }}</code>
            </div>
            <button type="button" class="text-[#3390ec] text-[12px] font-semibold shrink-0" @click="copyLink(publicLink)">
              {{ copiedKey === 'public' ? $t('messenger.copied') : $t('messenger.copy') }}
            </button>
          </div>
          <div v-for="(inv, idx) in invites" :key="inv.id" :class="['flex items-center gap-2 px-3 py-2.5', idx < invites.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
            <div class="flex-1 min-w-0">
              <code class="block truncate text-[12px] select-all text-[#3390ec]" dir="ltr">{{ inviteUrl(inv) }}</code>
              <div class="text-[10px] text-[#a2acb4] mt-0.5">
                <span v-if="inv.max_uses">{{ inv.uses_count || 0 }}/{{ inv.max_uses }} · </span>
                <span v-if="inv.expires_at">{{ formatTime(inv.expires_at) }} · </span>
                <span v-if="inv.is_temporary">{{ $t('messenger.inviteTemporary') }}</span>
                <span v-if="inv.is_revoked" class="text-red-500">{{ $t('messenger.revoked') }}</span>
              </div>
            </div>
            <button
              v-if="!inv.is_revoked"
              type="button"
              class="text-[#3390ec] text-[12px] font-semibold shrink-0"
              @click="copyLink(inviteUrl(inv), inv.id)"
            >{{ copiedKey === inv.id ? $t('messenger.copied') : $t('messenger.copy') }}</button>
            <button v-if="!inv.is_revoked" type="button" class="text-red-500 text-[12px] font-semibold shrink-0" @click="doRevoke(inv.id)">{{ $t('messenger.revoke') }}</button>
          </div>
          <p v-if="!invites.length && !(conversation.username && conversation.is_public)" class="text-[12px] text-[#a2acb4] text-center py-6">{{ $t('messenger.noInviteLinks') }}</p>
        </div>
      </div>

      <!-- Bans -->
      <div v-if="tab === 'bans' && canEdit" class="tg-card mx-3 mb-3 overflow-hidden">
        <div v-for="(ban, idx) in bans" :key="ban.id || ban.user_id" :class="['flex items-center gap-2.5 px-3 py-2.5', idx < bans.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
          <MessengerAvatar :user="ban.user || ban.banned_user" size="xs" />
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium truncate text-gray-900 dark:text-gray-100">{{ displayName(ban.user || ban.banned_user) }}</div>
            <div v-if="ban.reason" class="text-[11px] text-[#a2acb4] truncate">{{ ban.reason }}</div>
          </div>
          <button type="button" class="text-[12px] font-semibold text-[#3390ec]" @click="doUnban(ban)">{{ $t('messenger.unban') }}</button>
        </div>
        <p v-if="!bans.length" class="text-[12px] text-[#a2acb4] text-center py-8">{{ $t('messenger.noBannedUsers') }}</p>
      </div>

      <!-- Permissions -->
      <div v-if="tab === 'permissions' && canEditInfo" class="mx-3 mb-3 space-y-3">
        <p class="px-1 text-[12px] text-[#707579]">{{ $t('messenger.permissionsHint') }}</p>
        <div class="gi-shell">
          <div class="gi-tabs hide-scrollbar">
            <button v-for="role in editablePermRoles" :key="role" type="button"
              :class="['gi-tab', permRole === role ? 'is-active' : '']"
              @click="permRole = role">{{ roleLabel(role) }}</button>
          </div>
        </div>
        <div class="tg-card overflow-hidden">
          <div v-for="(perm, idx) in filteredPermissions" :key="perm"
            :class="['flex items-center justify-between gap-3 px-3.5 py-2.5', idx < filteredPermissions.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
            <div class="text-[14px] text-gray-900 dark:text-gray-100 truncate">{{ permLabel(perm) }}</div>
            <MessengerToggle :model-value="roleHasPerm(perm)" :disabled="!!permSaving" @update:modelValue="(v) => togglePerm(perm, v)" />
          </div>
          <p v-if="!filteredPermissions.length" class="text-[12px] text-[#a2acb4] text-center py-6">…</p>
        </div>
      </div>

      <!-- Requests -->
      <div v-if="tab === 'requests' && canEdit" class="tg-card mx-3 mb-3 overflow-hidden">
        <div v-for="(req, idx) in joinRequests" :key="req.id" :class="['flex items-center gap-2.5 px-3 py-2.5', idx < joinRequests.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
          <MessengerAvatar :user="req.user" size="xs" />
          <span class="flex-1 text-[13px] truncate text-gray-900 dark:text-gray-100">{{ displayName(req.user) }}</span>
          <button type="button" class="text-[12px] text-green-600 font-semibold" @click="approve(req.id)">{{ $t('messenger.approve') }}</button>
          <button type="button" class="text-[12px] text-red-500 font-semibold" @click="reject(req.id)">{{ $t('messenger.reject') }}</button>
        </div>
        <p v-if="!joinRequests.length" class="text-[12px] text-[#a2acb4] text-center py-8">{{ $t('messenger.noJoinRequests') }}</p>
      </div>

      <!-- Audit -->
      <div v-if="tab === 'audit' && canEdit" class="tg-card mx-3 mb-3 overflow-hidden">
        <div v-for="(log, idx) in auditLogs" :key="log.id" :class="['px-3.5 py-2.5 text-[12px]', idx < auditLogs.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
          <div class="font-semibold text-gray-900 dark:text-gray-100">{{ log.action }}</div>
          <div class="text-[#a2acb4] mt-0.5">{{ log.actor?.username || log.actor_id }} · {{ formatTime(log.created_at) }}</div>
        </div>
      </div>

      <!-- Members -->
      <div v-if="tab === 'members'" class="space-y-3 mx-3 mb-1">
        <div class="tg-card overflow-hidden">
          <div class="flex items-center justify-between px-3.5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span class="text-[12px] font-semibold text-[#a2acb4]">
              {{ isChannel ? $t('messenger.subscribers') : $t('messenger.members') }}
            </span>
            <button v-if="canInvite" type="button" class="text-[12px] font-semibold text-[#3390ec]" @click="showAdd = !showAdd">
              + {{ $t('messenger.addMembers') }}
            </button>
          </div>

          <div v-if="showAdd && canInvite" class="px-3 pb-3 pt-2 space-y-2 border-b border-black/[0.06] dark:border-white/[0.06]">
            <input v-model="addQuery" v-no-autofill="'strong'" type="search" name="messenger-add-member" @input="onSearchAdd" class="tg-field-inset" :placeholder="$t('messenger.searchUsers')" />
            <button v-for="u in addResults" :key="u.id" type="button"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/5 text-start"
              @click="togglePendingAdd(u)">
              <MessengerAvatar :user="u" size="xs" />
              <span class="flex-1 text-[13px] truncate">{{ displayName(u) }}</span>
              <span v-if="pendingAddIds.includes(u.id)" class="w-5 h-5 rounded-full bg-[#3390ec] text-white text-xs flex items-center justify-center font-bold">✓</span>
              <span v-else class="w-5 h-5 rounded-full border border-[#c4c9cc] dark:border-white/20"></span>
            </button>
            <div v-if="pendingAdd.length" class="flex flex-wrap gap-1.5 pt-1">
              <span v-for="u in pendingAdd" :key="'p'+u.id" class="inline-flex items-center gap-1 rounded-full bg-[#3390ec]/10 text-[#3390ec] text-[12px] px-2 py-1">
                {{ displayName(u) }}
                <button type="button" @click="togglePendingAdd(u)">×</button>
              </span>
            </div>
            <button v-if="pendingAdd.length" type="button"
              class="w-full py-2 rounded-2xl bg-[#3390ec] text-white text-[13px] font-semibold disabled:opacity-50"
              :disabled="addingMembers" @click="doAddSelected">
              {{ addingMembers ? '…' : $t('messenger.addSelected', { count: pendingAdd.length }) }}
            </button>
          </div>

          <MessengerSkeleton v-if="membersLoading && !members.length" variant="members" :count="6" />
          <template v-else>
            <div v-for="(m, idx) in members" :key="m.user.id"
              :class="['w-full flex items-center gap-2.5 px-3 py-2 hover:bg-black/[0.03] dark:hover:bg-white/5 transition', idx < members.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']">
              <button type="button" class="flex items-center gap-2.5 flex-1 min-w-0 text-start" @click="$emit('open-member', m)">
                <MessengerAvatar :user="m.user" size="sm" />
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{{ m.nickname || displayName(m.user) }}</div>
                  <div class="text-[12px] text-[#a2acb4]">
                    {{ roleLabel(m.role) }}
                    <span v-if="m.custom_title"> · {{ m.custom_title }}</span>
                  </div>
                </div>
              </button>
              <div v-if="canOpenMemberMenu(m)" class="relative">
                <button type="button" class="p-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#a2acb4]" @click="openMemberMenu(m)">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="4" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>
                </button>
              </div>
            </div>
            <MessengerSkeleton v-if="membersLoading && members.length" variant="members" :count="2" />
            <button v-if="membersHasMore && !membersLoading" type="button" class="w-full py-2.5 text-[12px] font-semibold text-[#3390ec] border-t border-black/[0.06] dark:border-white/[0.06]" @click="loadMoreMembers">
              {{ $t('messenger.loadMore') }}
            </button>
          </template>
        </div>
      </div>
      </template>
    </div>

    <!-- Member action sheet -->
    <BottomSheetDrawer
      :model-value="!!memberMenu"
      :fit-content="true"
      :initial-height="0.45"
      :min-height="0.25"
      :max-height="0.85"
      :auto-close-on-min="true"
      :close-on-backdrop="true"
      :lock-scroll="true"
      backdrop-z-class="z-[2000000030]"
      panel-z-class="z-[2000000040]"
      :panel-class="sheetPanelClass"
      content-class="px-4 pb-6 pt-1 overflow-auto"
      :backdrop-class="sheetBackdropClass"
      @update:modelValue="(v) => { if (!v) { memberMenu = null; memberEdit = null; } }"
      @close="memberMenu = null; memberEdit = null"
    >
      <template v-if="memberMenu && !memberEdit">
        <div class="text-sm font-bold mb-3 truncate text-center">{{ displayName(memberMenu.user) }}</div>
        <div class="space-y-1">
          <button v-if="canEditMemberProfile(memberMenu)" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
            @click="startMemberEdit">{{ $t('messenger.editMemberProfile') }}</button>
          <template v-if="canManageMember(memberMenu)">
            <button v-if="isOwner && memberMenu.role !== 'admin'" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="setRole('admin')">{{ $t('messenger.promoteAdmin') }}</button>
            <button v-if="isOwner && !isChannel && memberMenu.role !== 'moderator'" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="setRole('moderator')">{{ $t('messenger.promoteModerator') }}</button>
            <button v-if="isOwner && ['admin','moderator'].includes(memberMenu.role)" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="setRole(isChannel ? 'subscriber' : 'member')">{{ $t('messenger.demoteMember') }}</button>
            <button v-if="isOwner && memberMenu.role !== 'owner'" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doTransfer">{{ $t('messenger.transferOwnership') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('10m')">{{ $t('messenger.mute10m') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('1h')">{{ $t('messenger.mute1h') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('8h')">{{ $t('messenger.mute8h') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('1d')">{{ $t('messenger.mute1d') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('1w')">{{ $t('messenger.mute1w') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doMute('forever')">{{ $t('messenger.muteForever') }}</button>
            <button v-if="memberMenu.muted_until" type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm"
              @click="doUnmute">{{ $t('messenger.unmuteMember') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-red-500"
              @click="doKick">{{ $t('messenger.kick') }}</button>
            <button type="button" class="w-full text-start px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-red-600"
              @click="doBan">{{ $t('messenger.ban') }}</button>
          </template>
          <button type="button" class="w-full text-center px-3 py-2.5 text-sm text-gray-400" @click="memberMenu = null; memberEdit = null">{{ $t('messenger.cancel') }}</button>
        </div>
      </template>
      <template v-else-if="memberEdit">
        <div class="text-sm font-bold mb-3 truncate text-center text-gray-900 dark:text-gray-100">{{ $t('messenger.editMemberProfile') }}</div>
        <div class="space-y-3 text-gray-900 dark:text-gray-100">
          <div>
            <label class="text-xs text-gray-500 dark:text-[#a2acb4]">{{ $t('messenger.memberNickname') }}</label>
            <input v-model="memberEdit.nickname" type="text" maxlength="64"
              class="tg-field-inset mt-1"
              :placeholder="displayName(memberMenu?.user)" />
          </div>
          <div v-if="canEditInfo">
            <label class="text-xs text-gray-500 dark:text-[#a2acb4]">{{ $t('messenger.memberCustomTitle') }}</label>
            <input v-model="memberEdit.custom_title" type="text" maxlength="64"
              class="tg-field-inset mt-1"
              :placeholder="$t('messenger.memberCustomTitleHint')" />
          </div>
          <div class="mt-3 tg-form-footer !static !shadow-none rounded-xl border border-black/[0.06] dark:border-white/[0.06] !p-2">
            <button type="button" class="tg-form-btn tg-form-btn--muted" @click="memberEdit = null">{{ $t('messenger.back') }}</button>
            <button type="button" class="tg-form-btn tg-form-btn--primary tg-form-btn--grow"
              :disabled="memberEditSaving" @click="saveMemberEdit">
              {{ memberEditSaving ? '…' : $t('messenger.save') }}
            </button>
          </div>
        </div>
      </template>
    </BottomSheetDrawer>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import MessengerToggle from './MessengerToggle.vue';
import AvatarCropEditor from './AvatarCropEditor.vue';
import SharedMediaSection from './SharedMediaSection.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { toSingleLine, onHorizontalWheel } from './textHelpers';
import { isChatLockedNow, isCommunityStaffRole, normalizeHm } from './chatLock';
import { inviteLinkUrl, publicCommunityUrl, copyText } from './inviteLinks';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { iconPaths as menuIconPaths } from './messengerIcons';
import {
  getMembers, updateCommunityInfo, uploadCommunityImage, createInvite, getInvites, revokeInvite,
  getJoinRequests, approveJoinRequest, rejectJoinRequest, getAuditLogs,
  searchUsers, addMembers, updateMember, kickMember, banMember, unbanMember, getBans,
  muteMember, unmuteMember, transferOwnership,
  checkCommunityUsername, getConversation, getPermissions, setPermission,
} from '@/services/messenger';

function resolveUserId(raw) {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.value != null && typeof raw.value === 'object') {
    return raw.value.id ?? null;
  }
  return raw.id ?? null;
}

export default {
  name: 'GroupInfoPanel',
  components: { MessengerAvatar, MessengerToggle, AvatarCropEditor, SharedMediaSection, MessengerSkeleton, BottomSheetDrawer },
  props: {
    conversation: { type: Object, required: true },
  },
  emits: ['close', 'leave', 'delete', 'mute', 'clear', 'open-member', 'updated', 'go-to-message', 'open-link'],
  data() {
    return {
      viewerHost: null,
      members: [],
      membersPage: 1,
      membersHasMore: false,
      membersLoading: false,
      viewTab: 'members',
      tab: 'members',
      invites: [],
      bans: [],
      joinRequests: [],
      auditLogs: [],
      inviteForm: { max_uses: null, expires_hours: null, is_temporary: false },
      permMatrix: {},
      permAvailable: [],
      permRole: 'admin',
      permSaving: null,
      memberEdit: null,
      memberEditSaving: false,
      manageMode: false,
      moreMenuOpen: false,
      editing: false,
      saving: false,
      error: '',
      local: { title: '', description: '', username: '', avatar: '', is_public: false },
      showAdd: false,
      addQuery: '',
      addResults: [],
      addTimer: null,
      pendingAdd: [],
      addingMembers: false,
      memberMenu: null,
      lockUntilLocal: '',
      schedule: { enabled: false, start: '22:00', end: '08:00' },
      imageEdit: null,
      usernameStatus: '',
      usernameTimer: null,
      tabDrag: { active: false, startX: 0, scrollLeft: 0, moved: false },
      resolvedRole: null,
      loadingMeta: false,
      lockClock: Date.now(),
      copiedKey: null,
    };
  },
  created() {
    // Non-reactive timer handles (must not live in data — vue/no-reserved-keys).
    this.lockClockTimerId = null;
    this.copyTimerId = null;
    this.membersObserver = null;
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    isChannel() {
      return this.conversation?.type === 'channel';
    },
    isStaffRole() {
      return isCommunityStaffRole(this.myRole);
    },
    publicLink() {
      return publicCommunityUrl(this.conversation?.username);
    },
    meId() {
      return resolveUserId(this.$store.state.auth?.status?.userInfo);
    },
    myRole() {
      if (this.resolvedRole) return this.resolvedRole;
      const fromConv = this.conversation?.my_role || this.conversation?.pivot?.role;
      if (fromConv) return fromConv;
      if (this.meId && this.conversation?.owner_id
        && Number(this.conversation.owner_id) === Number(this.meId)) {
        return 'owner';
      }
      const mine = this.members.find((m) => m?.user && Number(m.user.id) === Number(this.meId));
      return mine?.role || null;
    },
    isOwner() {
      return this.myRole === 'owner'
        || (!!this.meId && !!this.conversation?.owner_id
          && Number(this.conversation.owner_id) === Number(this.meId));
    },
    canEdit() {
      return this.isOwner || ['owner', 'admin', 'moderator'].includes(this.myRole);
    },
    canEditInfo() {
      return this.isOwner || ['owner', 'admin'].includes(this.myRole);
    },
    canManageAvatar() {
      return this.canEditInfo;
    },
    canManageCover() {
      return this.canEditInfo;
    },
    canInvite() {
      if (this.isOwner || ['owner', 'admin', 'moderator'].includes(this.myRole)) return true;
      if ((this.conversation?.who_can_invite || 'admins') === 'admins') return false;
      return this.myRole === 'member' || this.myRole === 'subscriber';
    },
    lockedNow() {
      void this.lockClock;
      return isChatLockedNow(this.conversation, new Date(this.lockClock));
    },
    coverStyle() {
      const cover = this.conversation?.cover;
      return cover
        ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};
    },
    headerTitle() {
      if (this.imageEdit?.kind === 'cover') return this.$t('messenger.coverEditTitle');
      if (this.imageEdit?.kind === 'avatar') {
        return this.isChannel
          ? this.$t('messenger.channelAvatarEditTitle')
          : this.$t('messenger.groupAvatarEditTitle');
      }
      if (this.manageMode) {
        return this.isChannel ? this.$t('messenger.editChannel') : this.$t('messenger.editGroup');
      }
      return this.isChannel ? this.$t('messenger.channelInfo') : this.$t('messenger.groupInfo');
    },
    memberCountLabel() {
      const count = this.conversation?.member_count || this.members.length || 0;
      return this.isChannel
        ? this.$t('messenger.subscribersCount', { count })
        : this.$t('messenger.membersCount', { count });
    },
    pendingAddIds() {
      return this.pendingAdd.map((u) => u.id);
    },
    usernameBorderClass() {
      if (this.usernameStatus === 'available') return 'ring-1 ring-green-500/50';
      if (this.usernameStatus === 'taken' || this.usernameStatus === 'invalid') return 'ring-1 ring-red-500/50';
      return '';
    },
    canSaveEdit() {
      if (!this.local.title.trim()) return false;
      if (this.local.is_public) {
        if (!this.local.username.trim()) return false;
        if (['taken', 'invalid', 'checking'].includes(this.usernameStatus)) return false;
        const unchanged = (this.local.username.trim() === (this.conversation?.username || ''))
          && !!this.conversation?.is_public;
        if (!unchanged && this.usernameStatus !== 'available') return false;
      }
      return true;
    },
    adminTabs() {
      const tabs = [
        { id: 'members', label: this.isChannel ? this.$t('messenger.subscribers') : this.$t('messenger.members') },
      ];
      if (this.canEditInfo) {
        tabs.push({ id: 'settings', label: this.isChannel ? this.$t('messenger.channelSettings') : this.$t('messenger.groupSettings') });
      }
      if (!this.isChannel && this.canEditInfo) {
        tabs.push({ id: 'lock', label: this.$t('messenger.chatLock') });
      }
      if (this.canEdit) {
        tabs.push(
          { id: 'invites', label: this.$t('messenger.inviteLinks') },
          { id: 'requests', label: this.$t('messenger.joinRequests') },
          { id: 'bans', label: this.$t('messenger.banList') },
        );
      }
      if (this.canEditInfo) {
        tabs.push({ id: 'permissions', label: this.$t('messenger.permissions') });
      }
      if (this.canEdit) {
        tabs.push({ id: 'audit', label: this.$t('messenger.auditLogs') });
      }
      return tabs;
    },
    editablePermRoles() {
      if (this.isChannel) return ['admin', 'subscriber'];
      return ['admin', 'moderator', 'member'];
    },
    filteredPermissions() {
      const list = this.permAvailable.length
        ? this.permAvailable
        : [];
      if (this.isChannel) {
        return list.filter((p) => p !== 'send_messages');
      }
      return list.filter((p) => p !== 'publish_posts');
    },
    myNotificationMode() {
      const mine = this.members.find((m) => m?.user && Number(m.user.id) === Number(this.meId));
      return mine?.notification_mode
        || this.conversation?.pivot?.notification_mode
        || (this.conversation?.pivot?.muted_at ? 'mute' : 'all');
    },
    isMuted() {
      return this.myNotificationMode === 'mute'
        || !!this.conversation?.pivot?.muted_at
        || !!this.conversation?.muted_at;
    },
  },
  watch: {
    'conversation.id': {
      immediate: true,
      handler(id, prev) {
        if (!id) return;
        if (id === prev && this.members.length) return;
        this.revokeImageEditSrc();
        this.imageEdit = null;
        this.manageMode = false;
        this.moreMenuOpen = false;
        this.editing = false;
        this.viewTab = 'members';
        this.syncLocal(this.conversation);
        this.bootstrap();
      },
    },
    tab(v) {
      if (v === 'invites') this.loadInvites();
      if (v === 'requests') this.loadRequests();
      if (v === 'audit') this.loadAudit();
      if (v === 'bans') this.loadBans();
      if (v === 'permissions') this.loadPermissions();
    },
  },
  mounted() {
    this.viewerHost = this.$el;
    this.setupMembersObserver();
    this.lockClockTimerId = setInterval(() => {
      this.lockClock = Date.now();
    }, 15000);
    document.addEventListener('click', this.onMoreMenuDocClick);
  },
  beforeUnmount() {
    this.teardownMembersObserver();
    clearTimeout(this.addTimer);
    clearTimeout(this.usernameTimer);
    if (this.lockClockTimerId) clearInterval(this.lockClockTimerId);
    if (this.copyTimerId) clearTimeout(this.copyTimerId);
    document.removeEventListener('click', this.onMoreMenuDocClick);
    this.revokeImageEditSrc();
  },
  methods: {
    menuIconPaths,
    inviteUrl(inv) {
      return inviteLinkUrl(inv?.code);
    },
    async copyLink(url, key = 'public') {
      if (!url) return;
      const ok = await copyText(url);
      if (!ok) return;
      this.copiedKey = key;
      if (this.copyTimerId) clearTimeout(this.copyTimerId);
      this.copyTimerId = setTimeout(() => { this.copiedKey = null; }, 1600);
    },
    revokeImageEditSrc() {
      const src = this.imageEdit?.src;
      if (src && String(src).startsWith('blob:')) URL.revokeObjectURL(src);
    },
    syncLocal(c) {
      this.local = {
        title: c.title || '',
        description: toSingleLine(c.description || ''),
        username: c.username || '',
        avatar: c.avatar || '',
        is_public: !!c.is_public,
      };
      this.usernameStatus = '';
      if (c.my_role) this.resolvedRole = c.my_role;
      else if (c.pivot?.role) this.resolvedRole = c.pivot.role;
      const s = c.lock_schedule || {};
      this.schedule = {
        enabled: !!s.enabled,
        start: s.start || '22:00',
        end: s.end || '08:00',
      };
      if (c.messages_locked_until) {
        const d = new Date(c.messages_locked_until);
        if (!Number.isNaN(d.getTime())) {
          const pad = (n) => String(n).padStart(2, '0');
          this.lockUntilLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
      }
    },
    async bootstrap() {
      this.membersPage = 1;
      await Promise.all([this.refreshConversationMeta(), this.loadMembers()]);
    },
    async refreshConversationMeta() {
      if (!this.conversation?.id || this.loadingMeta) return;
      this.loadingMeta = true;
      try {
        const updated = await getConversation(this.conversation.id);
        const conv = updated?.id ? updated : updated?.data;
        if (conv?.id) {
          if (conv.my_role) this.resolvedRole = conv.my_role;
          else if (conv.pivot?.role) this.resolvedRole = conv.pivot.role;
          this.$emit('updated', conv);
          this.syncLocal({ ...this.conversation, ...conv });
        }
      } catch (e) { /* noop */ }
      finally {
        this.loadingMeta = false;
      }
    },
    displayName(u) {
      if (!u) return '';
      return (u.first_name || u.last_name)
        ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
        : u.username || `#${u.id}`;
    },
    roleLabel(role) {
      const map = {
        owner: 'messenger.roleOwner',
        admin: 'messenger.roleAdmin',
        moderator: 'messenger.roleModerator',
        member: 'messenger.roleMember',
        subscriber: 'messenger.roleSubscriber',
        guest: 'messenger.roleGuest',
      };
      const key = map[role] || `messenger.role_${role}`;
      const t = this.$t(key);
      return t !== key ? t : role;
    },
    formatTime(t) {
      if (!t) return '';
      return new Date(t).toLocaleString();
    },
    canManageMember(m) {
      if (!this.canEdit) return false;
      if (m.role === 'owner') return false;
      if (Number(m.user.id) === Number(this.meId)) return false;
      if (this.myRole === 'moderator' && ['admin', 'moderator'].includes(m.role)) return false;
      return true;
    },
    canOpenMemberMenu(m) {
      if (!m?.user) return false;
      if (Number(m.user.id) === Number(this.meId)) return true;
      return this.canManageMember(m);
    },
    canEditMemberProfile(m) {
      if (!m?.user) return false;
      if (Number(m.user.id) === Number(this.meId)) return true;
      return this.canEditInfo && this.canManageMember(m);
    },
    startMemberEdit() {
      if (!this.memberMenu) return;
      this.memberEdit = {
        nickname: this.memberMenu.nickname || '',
        custom_title: this.memberMenu.custom_title || '',
      };
    },
    async saveMemberEdit() {
      if (!this.memberMenu || !this.memberEdit || this.memberEditSaving) return;
      this.memberEditSaving = true;
      try {
        const data = {
          nickname: String(this.memberEdit.nickname || '').trim() || null,
        };
        if (this.canEditInfo) {
          data.custom_title = String(this.memberEdit.custom_title || '').trim() || null;
        }
        await updateMember(this.conversation.id, this.memberMenu.user.id, data);
        this.memberEdit = null;
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.memberEditSaving = false;
      }
    },
    async loadPermissions() {
      try {
        const res = await getPermissions(this.conversation.id);
        this.permMatrix = res.matrix || {};
        this.permAvailable = res.available || [];
        if (!this.editablePermRoles.includes(this.permRole)) {
          this.permRole = this.editablePermRoles[0] || 'admin';
        }
      } catch (e) {
        this.permMatrix = {};
        this.permAvailable = [];
      }
    },
    roleHasPerm(permission) {
      const rolePerms = this.permMatrix[this.permRole];
      if (rolePerms === '*' || (Array.isArray(rolePerms) && rolePerms.includes('*'))) return true;
      return Array.isArray(rolePerms) && rolePerms.includes(permission);
    },
    async togglePerm(permission, allowed) {
      if (this.permSaving) return;
      this.permSaving = permission;
      const prev = this.roleHasPerm(permission);
      // Optimistic
      const rolePerms = Array.isArray(this.permMatrix[this.permRole])
        ? [...this.permMatrix[this.permRole]]
        : [];
      if (allowed) {
        if (!rolePerms.includes(permission)) rolePerms.push(permission);
      } else {
        this.permMatrix = {
          ...this.permMatrix,
          [this.permRole]: rolePerms.filter((p) => p !== permission),
        };
      }
      if (allowed) {
        this.permMatrix = { ...this.permMatrix, [this.permRole]: rolePerms };
      }
      try {
        const res = await setPermission(this.conversation.id, this.permRole, permission, !!allowed);
        if (res?.matrix) this.permMatrix = res.matrix;
      } catch (e) {
        // revert
        const revert = Array.isArray(this.permMatrix[this.permRole])
          ? [...this.permMatrix[this.permRole]]
          : [];
        if (prev && !revert.includes(permission)) revert.push(permission);
        if (!prev) {
          this.permMatrix = {
            ...this.permMatrix,
            [this.permRole]: revert.filter((p) => p !== permission),
          };
        } else {
          this.permMatrix = { ...this.permMatrix, [this.permRole]: revert };
        }
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.permSaving = null;
      }
    },
    permLabel(perm) {
      const key = `messenger.perm_${perm}`;
      const t = this.$t(key);
      return t === key ? perm.replace(/_/g, ' ') : t;
    },
    async reload() {
      this.membersPage = 1;
      await this.loadMembers();
    },
    async loadMembers() {
      if (this.membersLoading) return;
      this.membersLoading = true;
      try {
        const res = await getMembers(this.conversation.id, this.membersPage);
        const rows = res.data || [];
        this.members = this.membersPage === 1 ? rows : [...this.members, ...rows];
        this.membersHasMore = !!(res.meta && res.meta.has_more);
        if (res.meta?.total != null) {
          this.$emit('updated', {
            ...this.conversation,
            member_count: res.meta.total,
            my_role: this.myRole,
          });
        }
        if (this.meId) {
          const mine = this.members.find((m) => m?.user && Number(m.user.id) === Number(this.meId));
          if (mine?.role) {
            this.resolvedRole = mine.role;
            if (mine.role !== this.conversation?.my_role) {
              this.$emit('updated', {
                ...this.conversation,
                my_role: mine.role,
                member_count: res.meta?.total ?? this.conversation.member_count,
              });
            }
          }
        }
        this.$nextTick(() => this.observeMembersSentinel());
      } catch (e) { /* noop */ }
      finally {
        this.membersLoading = false;
      }
    },
    loadMoreMembers() {
      if (!this.membersHasMore || this.membersLoading) return;
      this.membersPage += 1;
      this.loadMembers();
    },
    onViewMembersTab() {
      this.viewTab = 'members';
      this.$nextTick(() => this.observeMembersSentinel());
    },
    onSharedMediaTabChange(tab) {
      this.viewTab = tab;
      if (tab === 'members') {
        this.$nextTick(() => this.observeMembersSentinel());
      }
    },
    setupMembersObserver() {
      if (typeof IntersectionObserver === 'undefined') return;
      this.membersObserver = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) this.loadMoreMembers();
      }, { rootMargin: '120px' });
    },
    observeMembersSentinel() {
      if (!this.membersObserver || this.viewTab !== 'members' || this.manageMode) return;
      this.membersObserver.disconnect();
      const el = this.$refs.membersSentinel;
      if (el && this.membersHasMore) this.membersObserver.observe(el);
    },
    teardownMembersObserver() {
      if (this.membersObserver) {
        this.membersObserver.disconnect();
        this.membersObserver = null;
      }
    },
    enterManageMode() {
      if (!this.canEdit) return;
      this.syncLocal(this.conversation);
      this.manageMode = true;
      this.editing = true;
      this.error = '';
      this.moreMenuOpen = false;
      this.tab = this.canEditInfo ? 'settings' : 'members';
    },
    exitManageMode() {
      this.manageMode = false;
      this.editing = false;
      this.error = '';
      this.usernameStatus = '';
      this.showAdd = false;
      this.syncLocal(this.conversation);
    },
    startEdit() {
      this.enterManageMode();
    },
    cancelEdit() {
      this.exitManageMode();
    },
    onDescriptionInput(e) {
      this.local.description = toSingleLine(e.target.value);
    },
    onHlineWheel: onHorizontalWheel,
    onPublicToggle() {
      this.usernameStatus = '';
      if (this.local.is_public && !this.local.username) {
        this.local.username = '';
      }
    },
    onUsernameInput() {
      this.usernameStatus = '';
      clearTimeout(this.usernameTimer);
      const raw = (this.local.username || '').trim().replace(/^@/, '');
      this.local.username = raw;
      if (!raw) return;
      if (raw === (this.conversation?.username || '') && this.local.is_public === !!this.conversation?.is_public) {
        this.usernameStatus = 'available';
        return;
      }
      this.usernameTimer = setTimeout(() => this.checkUsername(), 1500);
    },
    async checkUsername() {
      const username = (this.local.username || '').trim();
      if (!username) {
        this.usernameStatus = '';
        return;
      }
      this.usernameStatus = 'checking';
      try {
        const res = await checkCommunityUsername(username, this.conversation.id);
        if ((this.local.username || '').trim() !== username) return;
        if (res.available) this.usernameStatus = 'available';
        else if (res.reason === 'invalid') this.usernameStatus = 'invalid';
        else this.usernameStatus = 'taken';
      } catch (e) {
        if ((this.local.username || '').trim() === username) this.usernameStatus = 'invalid';
      }
    },
    async saveEdit() {
      if (this.saving || !this.canSaveEdit) return;
      if (this.local.is_public) {
        const unchanged = (this.local.username.trim() === (this.conversation?.username || ''));
        if (!unchanged && this.usernameStatus !== 'available') {
          await this.checkUsername();
          if (this.usernameStatus !== 'available') {
            this.error = this.$t('messenger.publicRequiresUsername');
            return;
          }
        }
      }
      this.saving = true;
      this.error = '';
      try {
        const payload = {
          title: this.local.title.trim(),
          description: toSingleLine(this.local.description).trim(),
          is_public: !!this.local.is_public,
        };
        if (this.local.is_public) {
          payload.username = this.local.username.trim();
        }
        const updated = await updateCommunityInfo(this.conversation.id, payload);
        this.$emit('updated', updated);
        this.editing = true;
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.saving = false;
      }
    },
    async patch(data) {
      try {
        const updated = await updateCommunityInfo(this.conversation.id, data);
        this.$emit('updated', updated);
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async onSettingsPublicChange(ev) {
      const wantPublic = !!ev.target.checked;
      if (wantPublic && !this.conversation.username) {
        ev.target.checked = false;
        this.local.is_public = true;
        this.error = this.$t('messenger.publicRequiresUsername');
        return;
      }
      await this.patch({ is_public: wantPublic });
    },
    onPickImage(ev, kind) {
      const file = ev.target.files?.[0];
      ev.target.value = '';
      if (!file || !file.type?.startsWith('image/')) return;
      this.revokeImageEditSrc();
      this.imageEdit = {
        kind,
        src: URL.createObjectURL(file),
        uploading: false,
        pct: 0,
      };
    },
    onHeaderBack() {
      if (this.handleBack()) return;
      this.$emit('close');
    },
    hasOverlay() {
      const sm = this.$refs.sharedMedia;
      if (sm && typeof sm.hasOverlay === 'function' && sm.hasOverlay()) return true;
      return !!this.imageEdit || this.moreMenuOpen;
    },
    handleBack() {
      const sm = this.$refs.sharedMedia;
      if (sm && typeof sm.handleBack === 'function' && sm.handleBack()) return true;
      if (this.moreMenuOpen) {
        this.moreMenuOpen = false;
        return true;
      }
      if (this.imageEdit) {
        this.closeImageEdit();
        return true;
      }
      if (this.manageMode) {
        this.exitManageMode();
        return true;
      }
      return false;
    },
    closeImageEdit() {
      if (this.imageEdit?.uploading) return;
      this.revokeImageEditSrc();
      this.imageEdit = null;
    },
    async copyPublicFromMenu() {
      await this.copyLink(this.publicLink, 'public');
    },
    onMoreMenuDocClick(e) {
      if (!this.moreMenuOpen) return;
      const wrap = this.$refs.moreMenuWrap;
      if (wrap && wrap.contains(e.target)) return;
      this.moreMenuOpen = false;
    },
    moreAction(type) {
      if (type === 'copy-link') {
        this.copyPublicFromMenu();
        if (this.copyTimerId) clearTimeout(this.copyTimerId);
        this.copyTimerId = setTimeout(() => { this.moreMenuOpen = false; this.copiedKey = null; }, 900);
        return;
      }
      this.moreMenuOpen = false;
      if (type === 'manage') {
        this.enterManageMode();
        return;
      }
      if (type === 'add-members') {
        this.enterManageMode();
        this.$nextTick(() => {
          this.tab = 'members';
          this.showAdd = true;
        });
        return;
      }
      if (type === 'invites') {
        this.enterManageMode();
        this.$nextTick(() => { this.tab = 'invites'; });
        return;
      }
      if (type === 'mute') {
        this.$emit('mute', this.conversation?.id);
        return;
      }
      if (type === 'clear') {
        this.$emit('clear', this.conversation?.id);
        return;
      }
      if (type === 'leave') {
        this.$emit('leave');
        return;
      }
      if (type === 'delete') {
        this.$emit('delete');
      }
    },
    async onImageEditConfirm(file) {
      if (!file || !this.imageEdit || this.imageEdit.uploading) return;
      const kind = this.imageEdit.kind;
      this.imageEdit.uploading = true;
      this.imageEdit.pct = 0;
      try {
        const updated = await uploadCommunityImage(this.conversation.id, file, kind, {
          onUploadProgress: (evt) => {
            if (!evt.total || !this.imageEdit) return;
            this.imageEdit.pct = Math.min(100, Math.round((evt.loaded / evt.total) * 100));
          },
        });
        if (this.imageEdit) this.imageEdit.pct = 100;
        this.$emit('updated', updated);
        this.revokeImageEditSrc();
        this.imageEdit = null;
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
        if (this.imageEdit) {
          this.imageEdit.uploading = false;
          this.imageEdit.pct = 0;
        }
      }
    },
    async toggleManualLock() {
      if (this.conversation.messages_locked || this.conversation.messages_locked_until) {
        await this.patch({ messages_locked: false, messages_locked_until: null });
      } else {
        await this.patch({ messages_locked: true });
      }
    },
    async applyLockUntil() {
      if (!this.lockUntilLocal) return;
      await this.patch({
        messages_locked: false,
        messages_locked_until: new Date(this.lockUntilLocal).toISOString(),
      });
    },
    async saveSchedule() {
      await this.patch({
        lock_schedule: {
          enabled: !!this.schedule.enabled,
          start: normalizeHm(this.schedule.start) || '22:00',
          end: normalizeHm(this.schedule.end) || '08:00',
          timezone: 'Asia/Tehran',
        },
      });
    },
    async makeInvite() {
      const data = {};
      const maxUses = Number(this.inviteForm.max_uses);
      if (maxUses > 0) data.max_uses = maxUses;
      const hours = Number(this.inviteForm.expires_hours);
      if (hours > 0) {
        data.expires_at = new Date(Date.now() + hours * 3600 * 1000).toISOString();
      }
      if (this.inviteForm.is_temporary) data.is_temporary = true;
      await createInvite(this.conversation.id, data);
      this.inviteForm = { max_uses: null, expires_hours: null, is_temporary: false };
      this.loadInvites();
    },
    async loadInvites() {
      const res = await getInvites(this.conversation.id);
      this.invites = res.data || [];
    },
    async doRevoke(id) {
      await revokeInvite(this.conversation.id, id);
      this.loadInvites();
    },
    async loadBans() {
      try {
        const res = await getBans(this.conversation.id);
        this.bans = res.data || [];
      } catch (e) {
        this.bans = [];
      }
    },
    async doUnban(ban) {
      const userId = ban.user_id || ban.user?.id || ban.banned_user?.id;
      if (!userId) return;
      try {
        await unbanMember(this.conversation.id, userId);
        this.bans = this.bans.filter((b) => {
          const id = b.user_id || b.user?.id || b.banned_user?.id;
          return Number(id) !== Number(userId);
        });
        await this.loadBans();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async loadRequests() {
      const res = await getJoinRequests(this.conversation.id);
      this.joinRequests = res.data || [];
    },
    async approve(id) {
      await approveJoinRequest(this.conversation.id, id);
      this.loadRequests();
      this.reload();
    },
    async reject(id) {
      await rejectJoinRequest(this.conversation.id, id);
      this.loadRequests();
    },
    async loadAudit() {
      const res = await getAuditLogs(this.conversation.id);
      this.auditLogs = res.data || [];
    },
    onSearchAdd() {
      clearTimeout(this.addTimer);
      this.addTimer = setTimeout(async () => {
        const q = this.addQuery.trim();
        if (q.length < 2) { this.addResults = []; return; }
        try {
          const res = await searchUsers(q, 10);
          const existing = new Set(this.members.map((m) => m.user.id));
          this.addResults = (res.data || res || []).filter((u) => !existing.has(u.id));
        } catch (e) {
          this.addResults = [];
        }
      }, 250);
    },
    togglePendingAdd(u) {
      const i = this.pendingAdd.findIndex((x) => x.id === u.id);
      if (i >= 0) this.pendingAdd.splice(i, 1);
      else this.pendingAdd.push(u);
    },
    async doAddSelected() {
      if (!this.pendingAdd.length || this.addingMembers) return;
      this.addingMembers = true;
      try {
        const updated = await addMembers(this.conversation.id, this.pendingAdd.map((u) => u.id));
        this.$emit('updated', updated);
        this.pendingAdd = [];
        this.addQuery = '';
        this.addResults = [];
        this.showAdd = false;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.addingMembers = false;
      }
    },
    openMemberMenu(m) {
      this.memberEdit = null;
      this.memberMenu = m;
    },
    async setRole(role) {
      if (!this.memberMenu) return;
      try {
        await updateMember(this.conversation.id, this.memberMenu.user.id, { role });
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async doTransfer() {
      if (!this.memberMenu) return;
      try {
        const updated = await transferOwnership(this.conversation.id, this.memberMenu.user.id);
        this.$emit('updated', updated);
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async doMute(preset) {
      if (!this.memberMenu) return;
      try {
        await muteMember(this.conversation.id, this.memberMenu.user.id, { preset });
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async doUnmute() {
      if (!this.memberMenu) return;
      try {
        await unmuteMember(this.conversation.id, this.memberMenu.user.id);
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async setMyNotificationMode(mode) {
      if (!this.meId) return;
      try {
        await updateMember(this.conversation.id, this.meId, { notification_mode: mode });
        this.reload();
        this.$emit('updated', { ...this.conversation, pivot: { ...(this.conversation.pivot || {}), notification_mode: mode, muted_at: mode === 'mute' ? new Date().toISOString() : null } });
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async doKick() {
      if (!this.memberMenu) return;
      try {
        await kickMember(this.conversation.id, this.memberMenu.user.id);
        this.memberMenu = null;
        this.reload();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    async doBan() {
      if (!this.memberMenu) return;
      try {
        await banMember(this.conversation.id, this.memberMenu.user.id, {});
        this.memberMenu = null;
        this.reload();
        if (this.tab === 'bans') this.loadBans();
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      }
    },
    onTabDragStart(e) {
      const el = this.$refs.adminTabs;
      if (!el) return;
      this.tabDrag = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft, moved: false };
    },
    onTabDragMove(e) {
      if (!this.tabDrag.active) return;
      const el = this.$refs.adminTabs;
      if (!el) return;
      const dx = e.pageX - this.tabDrag.startX;
      if (Math.abs(dx) > 4) this.tabDrag.moved = true;
      el.scrollLeft = this.tabDrag.scrollLeft - dx;
    },
    onTabDragEnd() {
      this.tabDrag.active = false;
    },
    onTabTouchStart(e) {
      const el = this.$refs.adminTabs;
      if (!el || !e.touches?.[0]) return;
      this.tabDrag = { active: true, startX: e.touches[0].pageX, scrollLeft: el.scrollLeft, moved: false };
    },
    onTabTouchMove(e) {
      if (!this.tabDrag.active || !e.touches?.[0]) return;
      const el = this.$refs.adminTabs;
      if (!el) return;
      const dx = e.touches[0].pageX - this.tabDrag.startX;
      if (Math.abs(dx) > 4) this.tabDrag.moved = true;
      el.scrollLeft = this.tabDrag.scrollLeft - dx;
    },
    onTabClick(id) {
      if (this.tabDrag.moved) {
        this.tabDrag.moved = false;
        return;
      }
      this.tab = id;
    },
  },
};
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
}
.hide-scrollbar:active { cursor: grabbing; }
.hide-scrollbar::-webkit-scrollbar { display: none; }

.gi-shell {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}
.dark .gi-shell {
  background: #17212b;
  box-shadow: none;
}

.gi-tabs,
.gi-subtabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #f7f8f9;
  padding: 0 4px;
}
.dark .gi-tabs,
.dark .gi-subtabs {
  background: #121a22;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
.gi-subtabs {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom-width: 1px;
}
.dark .gi-subtabs {
  border-color: rgba(255, 255, 255, 0.08);
}

.gi-tab {
  position: relative;
  flex: 0 0 auto;
  min-width: 4.25rem;
  padding: 0.45rem 0.85rem 0.35rem;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #7a8288;
  background: transparent;
  border: 0;
  border-radius: 0;
  transition: color 0.15s ease;
  white-space: nowrap;
}
.gi-tab:hover {
  color: #4a5560;
}
.dark .gi-tab:hover {
  color: #c5ccd3;
}
.gi-tab.is-active {
  color: #3390ec;
  background: transparent;
}
.dark .gi-tab.is-active {
  color: #6ab2f2;
  background: transparent;
}
.gi-tab.is-active::after {
  content: '';
  position: absolute;
  left: 0.35rem;
  right: 0.35rem;
  bottom: -1px;
  height: 3.5px;
  background: currentColor;
  border-radius: 4px 4px 0 0;
  z-index: 1;
}

.gi-tab-panel {
  min-height: 4rem;
  background: #fff;
}
.dark .gi-tab-panel {
  background: #17212b;
}

.gi-body {
  padding: 10px;
  background: #f4f4f5;
  min-height: 4rem;
}
.dark .gi-body {
  background: #0e1621;
}

.tg-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  outline: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.dark .tg-card {
  background: #17212b;
  outline-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.tg-info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
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
  line-height: 1.35;
}
.dark .tg-info-value { color: #fff; }
.tg-info-label {
  font-size: 13px;
  color: #707579;
  margin-top: 2px;
}

.tg-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .tg-toggle-row {
  color: #f3f4f6;
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
.tg-toggle-row:last-child { border-bottom: none; }

.tg-select-block {
  padding: 10px 16px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.dark .tg-select-block { border-bottom-color: rgba(255, 255, 255, 0.06); }
.tg-select-block.border-b-0 { border-bottom: none; }
.tg-select-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #707579;
  margin-bottom: 6px;
}
/* .tg-field-inset / .tg-select live in messenger-theme.css */
</style>
