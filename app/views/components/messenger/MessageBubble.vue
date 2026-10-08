<template>
  <div :data-mid="message.id" :class="[
    'msg-row relative flex w-full',
    tight ? 'msg-row--tight' : 'msg-row--loose',
    isSingleEmojiOnly ? 'msg-row--big-emoji' : '',
    isSticker ? 'msg-row--sticker' : '',
    selectionMode ? 'cursor-pointer' : '',
    searchCurrent ? 'msg-search-current' : '',
  ]" @click="onRootClick">
    <!-- Selection tint: absolute overlay — never changes row metrics -->
    <div
      v-show="selectionMode && selected"
      class="msg-select-tint pointer-events-none absolute inset-y-0 inset-x-[-8px] rounded-lg"
      aria-hidden="true"
    />

    <!-- Selection circle: overlay rail — no flex/layout shift -->
    <button
      type="button"
      class="msg-select-circle"
      :class="{ 'is-on': selectionMode, 'is-selected': selected, 'is-mine': isMine }"
      :tabindex="selectionMode ? 0 : -1"
      :aria-hidden="!selectionMode"
      :aria-pressed="selected"
      :aria-label="$t('messenger.select')"
      @click.stop="$emit('toggle-select', message.id)"
    >
      <svg v-if="selected" class="msg-select-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <div
      :class="[
        'msg-row-body flex-1 flex items-end gap-2.5 min-w-0 relative',
        isMine ? 'justify-end is-mine' : 'justify-start',
        selectionMode ? 'is-selecting' : '',
      ]"
    >
      <!-- Avatar column: fixed-width gutter only — avatar is absolute so its
           height never stretches the row / opens a gap above the bubble. -->
      <div v-if="!isMine && showAvatarColumn" :class="avatarColumnClass">
        <button
          v-if="showAvatar && avatarUser"
          type="button"
          class="msg-avatar-btn"
          :aria-label="$t('messenger.profilePhoto')"
          @click.stop="onAvatarClick"
        >
          <MessengerAvatar :user="avatarUser" size="xs" />
        </button>
      </div>

      <!-- Reply hint revealed while swiping (Telegram-style progress ring). -->
      <span
        v-if="swipeActive"
        class="msg-reply-fab pointer-events-none"
        :class="{
          'is-armed': swipeProgress >= 1,
          'is-pulse': swipePulse,
        }"
        :style="replyIconStyle"
        aria-hidden="true"
      >
        <svg class="msg-reply-ring" viewBox="0 0 40 40" aria-hidden="true">
          <circle class="msg-reply-ring-track" cx="20" cy="20" r="16" />
          <circle
            class="msg-reply-ring-prog"
            cx="20"
            cy="20"
            r="16"
            :style="{ strokeDashoffset: replyRingOffset }"
          />
        </svg>
        <span class="msg-reply-orb">
          <svg class="msg-reply-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M10 9V5.5a.5.5 0 00-.85-.35L3.4 10.9a1.25 1.25 0 000 1.7l5.75 5.75a.5.5 0 00.85-.35V14.5c5.2 0 8.85 1.65 11.1 5.05.15.22.48.1.45-.16C20.7 13.2 17.05 9 10 9z" />
          </svg>
        </span>
      </span>

      <!-- Failed-send indicator (opposite side of the bubble, mine only). -->
      <span v-if="isMine && showFailedAffordance"
        class="flex-shrink-0 self-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center shadow-sm ring-2 ring-red-500/30"
        :title="$t('messenger.sendError')">!</span>

      <!-- Empty side (mine): tap opens context — opposite of the bubble, not on the card. -->
      <button
        v-if="gutterMenuEnabled && isMine"
        type="button"
        class="msg-gutter-hit"
        aria-label="message menu"
        @click.stop="onGutterMenu"
      />

      <div data-msg-bubble @contextmenu.prevent="onContextMenu" @touchstart.passive="onTouchStart" @touchend="onTouchEnd"
        @touchmove.passive="onTouchMove" @touchcancel="onTouchCancel" :style="bubbleSwipeStyle" :class="[
          'relative text-[15px]',
          (isFullBleedMedia || isSticker)
            ? (isFullBleedMedia && hasMediaCaption
              ? 'w-full max-w-[320px]'
              : 'w-fit max-w-[82%] sm:max-w-[70%]')
            : 'max-w-[82%] sm:max-w-[70%]',
          (isSingleEmojiOnly || isSticker)
            ? 'bg-transparent text-gray-900 dark:text-gray-100 p-0'
            : (isFullBleedMedia || isMedia ? 'p-0.5' : (tight ? 'px-3 py-1' : 'px-3 py-1.5')),
          !isSingleEmojiOnly && !isSticker && (isMine
            ? 'msg-bubble-mine text-gray-900 dark:text-gray-100'
            : 'msg-bubble-other bg-white dark:bg-[#1e2c3a] text-gray-900 dark:text-gray-100'),
          !isSingleEmojiOnly && !isSticker ? bubbleShape : '',
          isSticker ? 'msg-sticker-bubble' : '',
        ]">
        <!-- Telegram-style tail on the last bubble of a group (must stay outside overflow clip). -->
        <span v-if="hasTail && !isSticker" :class="[
          'msg-tail absolute bottom-[1px] w-[12px] h-[15px] pointer-events-none z-[2]',
          isMine ? 'msg-tail-mine text-[#eeffde] dark:text-[#3e6b41]' : 'msg-tail-other text-white dark:text-[#1e2c3a]',
        ]">
        <svg class="w-4 h-4 block transform rtl:scale-x-[-1]" fill="none" viewBox="0 0 20 20">
          <path
            d="M20 20 V6 C20 10 18 13 16 15 C14.5 16.5 13 17.5 12 18 C10.8 18.5 10 18.8 10 19.4 C10 20 11 20 13 20 Z"
            fill="currentColor" />
        </svg>
        </span>

        <div
          v-if="forwardedFromName"
          data-forward-preview
          class="msg-fwd"
          :class="{
            'is-tappable': forwardTapEnabled,
            'msg-fwd--padded': forwardNeedsPad,
          }"
          @click.stop="onForwardHeaderTap"
        >
          <div class="msg-fwd-row">
            <!-- Telegram-style forward / share arrow -->
            <svg class="msg-fwd-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.5 5.5v3.4C8.15 9.35 5.2 10.9 3.5 14.85c.9-2.55 3.05-4.2 6.5-4.5v3.15L16.5 9.5 12.5 5.5z" />
            </svg>
            <span class="msg-fwd-label">{{ $t('messenger.forwardedFrom') }}</span>
          </div>
          <button
            type="button"
            class="msg-fwd-name"
            dir="auto"
            :tabindex="forwardTapEnabled ? 0 : -1"
            :aria-disabled="!forwardTapEnabled"
            @click.stop="onForwardHeaderTap"
          >{{ forwardedFromName }}</button>
        </div>

        <button
          v-else-if="channelHeader"
          type="button"
          class="block text-start text-[13px] font-bold text-[#3390ec] dark:text-[#6ab2f2] mb-px truncate max-w-full hover:underline"
          @click.stop="onChannelHeaderTap"
        >
          {{ channelHeader }}
        </button>

        <div
          v-else-if="senderLabel"
          class="text-[12px] font-bold mb-px truncate"
          :style="{ color: senderColor }"
        >
          {{ senderLabel }}
        </div>

        <ReplyQuotePreview
          v-if="message.reply_to"
          data-reply-preview
          class="mb-1"
          :message="message.reply_to"
          :show-title="!!message.reply_show_title"
          :embedded="true"
          @click.stop="onReplyTap"
        />

        <!-- Location: padded bubble + inner rounded media (follows bubble curve, keeps حاشیه) -->
        <div v-if="isLocation" class="msg-body-stack">
          <div
            class="msg-media-clip msg-media-stage relative overflow-hidden w-[min(92vw,320px)] sm:w-[320px] max-w-full"
            :style="mediaClipStyle"
          >
            <button
              type="button"
              class="msg-location block w-full text-start p-0 border-0 bg-transparent cursor-pointer"
              @click.stop="onLocationOpen"
            >
              <LocationMapPreview
                :lat="locationLat"
                :lng="locationLng"
                :height="132"
              />
            </button>
            <div
              v-if="!hasMediaCaption"
              data-msg-menu-hit
              class="msg-meta msg-meta--on-media msg-meta--menu-hit"
              :style="mediaTimeBadgeStyle"
              @click.stop="onMetaMenuTap"
            >
              <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
              <span v-if="showViews" class="msg-meta-views">
                <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="msg-meta-text">{{ viewsLabel }}</span>
              </span>
              <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"
                :title="$t('messenger.pinned')" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
              </svg>
              <span v-if="message.edited_at" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
              <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
              <template v-if="isMine">
                <PendingClockIcon v-if="showPendingClock" />
                <template v-else-if="showSendTicks">
                  <svg v-if="message.read_at" class="msg-meta-icon text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                  </svg>
                  <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                  </svg>
                  <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                  </svg>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- Media card (photo / video / voice / audio) -->
        <div
          v-else-if="isFile"
          class="msg-body-stack"
        >
          <DocumentMessageCard
            :message="message"
            :is-mine="isMine"
            :show-menu-btn="showFileMenuBtn"
            @open-link="onMediaLink"
            @cancel-upload="$emit('cancel-upload', $event)"
            @open-menu="onMediaMenu"
          />
          <div
            v-if="!hideAudioBubbleMeta"
            class="msg-meta"
            dir="ltr"
            data-msg-menu-hit
            @click.stop="onMetaMenuTap"
          >
            <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
            <span v-if="showViews" class="msg-meta-views">
              <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="msg-meta-text">{{ viewsLabel }}</span>
            </span>
            <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
            </svg>
            <span v-if="message.edited_at" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
            <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine">
              <PendingClockIcon v-if="showPendingClock" />
              <template v-else-if="showSendTicks">
                <svg v-if="message.read_at" class="msg-meta-icon text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </div>
        </div>

        <div
          v-else-if="isSticker"
          class="msg-body-stack msg-sticker-frame"
        >
          <StickerMessageCard
            :message="message"
            :is-mine="isMine"
            :auto-unlock="true"
            @open-pack="$emit('open-sticker-pack', $event)"
            @open-menu="onMediaMenu"
            @cancel-upload="$emit('cancel-upload', $event)"
          />
          <div
            class="msg-meta msg-meta--badge msg-meta--emoji-badge"
            dir="ltr"
          >
            <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
            <span v-if="showViews" class="msg-meta-views">
              <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="msg-meta-text">{{ viewsLabel }}</span>
            </span>
            <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              :title="$t('messenger.pinned')" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
            </svg>
            <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine">
              <PendingClockIcon v-if="showPendingClock" />
              <template v-else-if="showSendTicks">
                <svg v-if="message.read_at" class="msg-meta-icon text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </div>
        </div>

        <div
          v-else-if="isMedia"
          :class="[
            'msg-body-stack',
            isFullBleedMedia ? 'msg-media-frame' : '',
            isFullBleedMedia && hasMediaCaption ? 'has-caption' : '',
          ]"
        >
          <div
            :class="isFullBleedMedia ? 'msg-media-clip msg-media-stage overflow-hidden' : ''"
            :style="isFullBleedMedia ? mediaClipStyle : undefined"
          >
            <MediaMessageCard
              :message="message"
              :auto-unlock="mediaAutoUnlock"
              :auto-play="mediaAutoPlay"
              :is-mine="isMine"
              :flush="isFullBleedMedia"
              :hide-caption="isFullBleedMedia && hasMediaCaption"
              :round-media="isFullBleedMedia && hasMediaCaption"
              :show-menu-btn="showMediaMenuBtn"
              @open-link="onMediaLink"
              @open-lightbox="$emit('open-lightbox', $event)"
              @cancel-upload="$emit('cancel-upload', $event)"
              @open-menu="onMediaMenu"
            >
              <template v-if="isFullBleedMedia && !hasMediaCaption" #overlay>
                <div
                  data-msg-menu-hit
                  class="msg-meta msg-meta--on-media msg-meta--menu-hit"
                  :style="mediaTimeBadgeStyle"
                  @click.stop="onMetaMenuTap"
                >
                  <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
                  <span v-if="showViews" class="msg-meta-views">
                    <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span class="msg-meta-text">{{ viewsLabel }}</span>
                  </span>
                  <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                    :title="$t('messenger.pinned')" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
                  </svg>
                  <span v-if="message.edited_at" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
                  <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
                  <template v-if="isMine">
                    <PendingClockIcon v-if="showPendingClock" />
                    <template v-else-if="showSendTicks">
                      <svg v-if="message.read_at" class="msg-meta-icon text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                      </svg>
                      <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                      </svg>
                      <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                      </svg>
                    </template>
                  </template>
                </div>
              </template>
            </MediaMessageCard>
          </div>
          <p
            v-if="isFullBleedMedia && hasMediaCaption"
            class="msg-media-caption whitespace-pre-wrap break-words leading-snug"
            dir="auto"
          >
            <template v-for="(part, i) in bodyParts" :key="'mc'+i">
              <a
                v-if="part.type === 'link'"
                :href="part.href"
                class="msg-body-link"
                rel="noopener noreferrer"
                @click="onBodyLinkClick(part, $event)"
              ><template v-for="(seg, j) in highlightSegs(part.text)" :key="'mcs'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></a>
              <span v-else-if="part.styles && part.styles.length" :class="formatClass(part)"><template v-for="(seg, j) in highlightSegs(part.text)" :key="'mcs'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></span>
              <template v-else><template v-for="(seg, j) in highlightSegs(part.text)" :key="'mcs'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></template>
            </template>
          </p>
          <div
            v-if="(!isFullBleedMedia || hasMediaCaption) && !hideAudioBubbleMeta"
            class="msg-meta msg-meta--badge"
            :class="isFullBleedMedia ? 'msg-meta--media' : ''"
            dir="ltr"
          >
            <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
            <span v-if="showViews" class="msg-meta-views">
              <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="msg-meta-text">{{ viewsLabel }}</span>
            </span>
            <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              :title="$t('messenger.pinned')" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
            </svg>
            <span v-if="message.edited_at" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
            <span v-if="!isAudioMessage" class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine && !isAudioMessage">
              <PendingClockIcon v-if="showPendingClock" />
              <template v-else-if="showSendTicks">
                <svg v-if="message.read_at" class="msg-meta-icon text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </div>
        </div>

        <div v-else :class="[
          metaStacked ? 'msg-body-stack' : 'msg-body-float',
          isSingleEmojiOnly ? 'msg-body--big-emoji' : '',
          isSingleEmojiOnly && isMine ? 'is-mine-emoji' : '',
        ]">
          <p
            :class="[
              'msg-body-text whitespace-pre-wrap break-words',
              isSingleEmojiOnly ? 'msg-body-text--big-emoji' : 'leading-snug',
              isSingleEmojiOnly && emojiSpinning ? 'is-spinning' : '',
            ]"
            dir="auto"
            @click="onBigEmojiClick"
            @animationend="onBigEmojiAnimationEnd"
          >
            <template v-for="(part, i) in bodyParts" :key="i">
              <a
                v-if="part.type === 'link'"
                :href="part.href"
                :class="['msg-body-link', formatClass(part)]"
                rel="noopener noreferrer"
                @click="onBodyLinkClick(part, $event)"
              ><template v-for="(seg, j) in highlightSegs(part.text)" :key="'s'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></a>
              <span
                v-else-if="part.styles && part.styles.length"
                :class="formatClass(part)"
              ><template v-for="(seg, j) in highlightSegs(part.text)" :key="'s'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></span>
              <template v-else><template v-for="(seg, j) in highlightSegs(part.text)" :key="'s'+j"><mark v-if="seg.hit" class="msg-search-hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template></template>
            </template>
          </p>

          <!-- Channel: always bottom badge. Others: float beside text, wrap down if needed. -->
          <div
            class="msg-meta"
            :class="[
              metaStacked ? 'msg-meta--badge' : 'msg-meta--inline',
              isSingleEmojiOnly ? 'msg-meta--emoji-badge' : '',
            ]"
            dir="ltr"
          >
            <span v-if="postAuthorLabel" class="msg-meta-text msg-meta-author" dir="auto">{{ postAuthorLabel }}</span>
            <span v-if="showViews" class="msg-meta-views">
              <svg class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="msg-meta-text">{{ viewsLabel }}</span>
            </span>
            <svg v-if="pinned" class="msg-meta-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              :title="$t('messenger.pinned')" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" d="M16.05 5.32l2.63 2.63c.39.39.39 1.02 0 1.41l-1.2 1.2c-.28.28-.68.36-1.04.22l-1.88-.75-3.6 3.6.75 1.88c.14.36.06.76-.22 1.04l-1.2 1.2c-.39.39-1.02.39-1.41 0L6.25 14.5c-.39-.39-.39-1.02 0-1.41l1.2-1.2c.28-.28.68-.36 1.04-.22l1.55.62 3.6-3.6-.62-1.55c-.14-.36-.06-.76.22-1.04l1.2-1.2c.39-.39 1.02-.39 1.41 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L4 20" />
            </svg>
            <span v-if="message.edited_at" class="msg-meta-text" dir="auto">{{ $t('messenger.edited') }}</span>
            <span class="msg-meta-text" dir="auto">{{ formattedTime }}</span>
            <template v-if="isMine">
              <PendingClockIcon v-if="showPendingClock" />
              <template v-else-if="showSendTicks">
                <svg v-if="message.read_at" class="msg-meta-icon text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else-if="message.delivered_at" class="msg-meta-icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M1 13l4 4L13 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 13l4 4L23 7" />
                </svg>
                <svg v-else class="msg-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 13l4 4L18 7" />
                </svg>
              </template>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty side (incoming): tap opens context — opposite of the bubble. -->
      <button
        v-if="gutterMenuEnabled && !isMine"
        type="button"
        class="msg-gutter-hit"
        aria-label="message menu"
        @click.stop="onGutterMenu"
      />

      <!-- Own-message avatar: desktop only — absolute in gutter, same as peer -->
      <div v-if="isMine && showAvatarColumn" :class="avatarColumnClass">
        <div v-if="showAvatar && avatarUser" class="msg-avatar-btn msg-avatar-btn--static">
          <MessengerAvatar :user="avatarUser" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import LocationMapPreview from './LocationMapPreview.vue';
import MediaMessageCard from './MediaMessageCard.vue';
import StickerMessageCard from './StickerMessageCard.vue';
import DocumentMessageCard from './DocumentMessageCard.vue';
import ReplyQuotePreview from './ReplyQuotePreview.vue';
import PendingClockIcon from './PendingClockIcon.vue';
import { shapeUiDigits } from './appearance';
import { CLOCK_REVEAL_MS } from './sendPipeline';
import { classifyMessageHref } from './messageLinks';
import { formatMessageBody, stripFormatMarkers } from './messageFormat';
import { openLocationInMaps } from './geolocation';
import { isMediaType } from './mediaHelpers';
import { splitHighlight } from './textHelpers';
import { isAutoDownloadEnabled, isAutoPlayEnabled } from './autoDownloadSettings';
import { mapState, mapGetters } from "@/composables/useStore";
import { peerDisplayName } from '@/utils/messengerPeerName';
import {
  LONG_PRESS_MS,
  SWIPE_REPLY_THRESHOLD,
  TG_EASE_OUT,
  tgTransformTransition,
} from './motion';

export default {
  inject: {
    consumeChatAccessoryTap: { default: null },
  },
  components: {
    MessengerAvatar,
    LocationMapPreview,
    MediaMessageCard,
    StickerMessageCard,
    DocumentMessageCard,
    ReplyQuotePreview,
    PendingClockIcon,
  },
  props: {
    message: { type: Object, required: true },
    isMine: { type: Boolean, default: false },
    selectionMode: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    groupPos: { type: String, default: 'single' }, // single | first | middle | last
    tight: { type: Boolean, default: false },
    showAvatar: { type: Boolean, default: false },
    avatarUser: { type: Object, default: null },
    pinned: { type: Boolean, default: false },
    /** group | channel | private | saved — drives sender / channel chrome */
    chatType: { type: String, default: 'private' },
    chatTitle: { type: String, default: '' },
    showSenderName: { type: Boolean, default: false },
    // Read-only rendering (e.g. inside the pinned-messages sheet): no context
    // menu, swipe, long-press or selection — a plain click emits `bubble-click`.
    static: { type: Boolean, default: false },
    /** Active in-chat search term — highlights matching spans in the body. */
    highlightQuery: { type: String, default: '' },
    /** True when this message is the currently selected search hit. */
    searchCurrent: { type: Boolean, default: false },
  },
  emits: ['edit', 'delete', 'context', 'reply', 'toggle-select', 'enter-select', 'avatar-click', 'forward-tap', 'forward-chat-tap', 'channel-tap', 'scroll-to-reply', 'bubble-click', 'retry', 'open-link', 'cancel-upload', 'open-lightbox', 'open-sticker-pack'],
  data() {
    return {
      lpTimer: null,
      lpStartPos: null,
      lpFired: false,
      lpOnWave: false,
      touchMoved: false,
      // Swipe-to-reply state.
      swipeX: 0,
      swiping: false,
      swipeReleasing: false,
      swipeReleaseTimer: null,
      swipePulse: false,
      swipeArmedFired: false,
      swipePulseTimer: null,
      // Ticks while pending so stalePending can become true without a store update.
      pendingTick: Date.now(),
      pendingTickTimer: null,
      // Delay clock paint so fast wire-sends never flash clock (Telegram-like).
      clockReveal: false,
      clockRevealTimer: null,
      emojiSpinning: false,
      emojiSpinTimer: null,
      emojiDidAutoSpin: false,
    };
  },
  watch: {
    'message.pending': {
      immediate: true,
      handler() {
        this.syncPendingUi();
      },
    },
    'message.awaiting_server': {
      handler() {
        this.syncPendingUi();
      },
    },
    'message.send_status': {
      handler() {
        this.syncPendingUi();
      },
    },
  },
  mounted() {
    if (this.isSingleEmojiOnly && this.isMine && !this.emojiDidAutoSpin) {
      const t = this.message?.created_at ? new Date(this.message.created_at).getTime() : 0;
      const fresh = this.message?.pending || (t && (Date.now() - t) < 2500);
      if (fresh) this.$nextTick(() => this.playBigEmojiSpin({ force: true }));
    }
  },
  computed: {
    ...mapState('messenger', ['settings']),
    ...mapGetters('messenger', ['contactNameByUserId']),
    /** Pending longer than ~20s unlocks retry menu (still shows clock until failed). */
    stalePending() {
      if (!this.message?.pending && this.message?.send_status !== 'queued' && this.message?.send_status !== 'sending') {
        return false;
      }
      if (this.message?.failed) return false;
      const t = Date.parse(this.message.created_at || '');
      const now = this.pendingTick || Date.now();
      if (!Number.isFinite(t)) return true;
      return (now - t) > 20000;
    },
    /** Show the failed ! affordance only for confirmed failures — never for queued. */
    showFailedAffordance() {
      return !!this.message?.failed;
    },
    isPendingLike() {
      if (this.message?.failed) return false;
      // Wire-sent on live WS: awaiting_server + !pending → show single check, not clock.
      if (this.message?.awaiting_server && !this.message?.pending) return false;
      if (this.message?.awaiting_server) return true;
      if (this.message?.pending) return true;
      const s = this.message?.send_status;
      return s === 'queued' || s === 'sending';
    },
    /**
     * Telegram order: clock (if slow) → single check → double.
     * Fast path: clock reveal is delayed so wire-sent wins first (no flash).
     */
    showPendingClock() {
      if (!this.isPendingLike) return false;
      return !!this.clockReveal;
    },
    /** Single/double checks — wire-sent (live WS) or durable server id. */
    showSendTicks() {
      if (this.message?.failed || this.showPendingClock) return false;
      // Still pending, clock not revealed yet — leave icon slot empty.
      if (this.isPendingLike) return false;
      // Live wire path: single check while awaiting durable id.
      if (this.message?.awaiting_server && !this.message?.pending) return true;
      const id = this.message?.id;
      const serverId = id != null && Number.isFinite(Number(id)) && Number(id) > 0
        && String(id) === String(Number(id));
      return serverId;
    },
    bodyParts() {
      return formatMessageBody(this.message?.body);
    },
    /** Plain text body with format markers stripped — for single-emoji detection. */
    plainBodyText() {
      return String(stripFormatMarkers(this.message?.body || '') || '').trim();
    },
    /** One standalone emoji (Telegram big-emoji bubble). */
    isSingleEmojiOnly() {
      if (this.isMedia || this.isLocation || this.isFile) return false;
      if (this.message?.reply_to || this.message?.forwarded_from) return false;
      const text = this.plainBodyText;
      if (!text) return false;
      // One emoji / emoji ZWJ sequence, optional variation selector — no other chars.
      try {
        const emojiOnly = /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})(?:\uFE0F|\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}))*$/u;
        return emojiOnly.test(text) && [...text].length <= 8;
      } catch (e) {
        return false;
      }
    },
    isLocation() {
      return this.message?.type === 'location'
        && Number.isFinite(Number(this.message?.meta?.lat))
        && Number.isFinite(Number(this.message?.meta?.lng));
    },
    isFile() {
      return this.message?.type === 'file';
    },
    isMedia() {
      if (this.message?.type === 'photo' && this.message?.meta?.sticker) return false;
      return isMediaType(this.message?.type) && !this.isFile;
    },
    /** Auto-download only when the matching setting is on (Telegram-style). */
    mediaAutoUnlock() {
      const m = this.message;
      if (!m) return false;
      if (!this.autoDownloadAllowed(m.type)) return false;
      if (m.is_encrypted || m.meta?.encrypted) {
        return !!(m._mediaKey && m._mediaIv && m._e2e_decrypted);
      }
      return !!(m.meta?.url && String(m.meta.url).includes('/messenger/media/'));
    },
    isAudioMessage() {
      const t = this.message?.type;
      return t === 'audio' || t === 'voice';
    },
    /** Empty gutter beside voice / file / full-bleed media opens the context menu. */
    gutterMenuEnabled() {
      return !this.static && (this.isAudioMessage || this.isFile || this.isFullBleedMedia || this.isSticker);
    },
    /** Audio/voice: time + ticks live inside the media card to keep bubble height tight. */
    hideAudioBubbleMeta() {
      if (!this.isAudioMessage) return false;
      return !this.postAuthorLabel && !this.showViews && !this.pinned && !this.message?.edited_at;
    },
    /** Photo / video / location fill the bubble; corners clip to bubbleShape (tail stays outside). */
    isFullBleedMedia() {
      if (this.isSticker) return false;
      if (this.isLocation) return true;
      const t = this.message?.type;
      return t === 'photo' || t === 'video';
    },
    /** Telegram-style sticker: photo with meta.sticker, no bubble chrome. */
    isSticker() {
      return this.message?.type === 'photo' && !!(this.message?.meta?.sticker);
    },
    /** Photo / video / music: Telegram-style ⋮ opens the message menu. */
    showMediaMenuBtn() {
      if (this.static || this.selectionMode || (this.message?.pending && !this.stalePending)) return false;
      const t = this.message?.type;
      return t === 'photo' || t === 'video' || t === 'audio';
    },
    /** File bubble ⋮ (same rules as media menu). */
    showFileMenuBtn() {
      if (this.static || this.selectionMode || (this.message?.pending && !this.stalePending)) return false;
      return this.isFile;
    },
    /** Caption under photo/video — empty body → time badge overlays the media.
     *  Location always overlays (body is auto coords, not a user caption). */
    hasMediaCaption() {
      if (this.isLocation) return false;
      return !!(this.message?.body || '').trim();
    },
    /**
     * Uniform inner media radius (rounded-2xl − p-0.5 ≈ 12px).
     * Keep all corners equally round — no sharp tail corner on the media itself.
     */
    mediaClipStyle() {
      return { borderRadius: '12px' };
    },
    /** Soft pill like Telegram; all corners rounded (not clipped sharp to the tail). */
    mediaTimeBadgeStyle() {
      return { borderRadius: '10px' };
    },
    locationLat() {
      return Number(this.message?.meta?.lat);
    },
    locationLng() {
      return Number(this.message?.meta?.lng);
    },
    swipeActive() {
      return this.swiping || this.swipeX !== 0 || this.swipeReleasing || this.swipePulse;
    },
    /** 0..1 progress toward the reply threshold (Telegram ~56px). */
    swipeProgress() {
      return Math.min(1, Math.abs(this.swipeX) / SWIPE_REPLY_THRESHOLD);
    },
    replyRingOffset() {
      const c = 2 * Math.PI * 16;
      return c * (1 - this.swipeProgress);
    },
    fwdChat() {
      return this.message.forward_from_chat || this.message.meta?.fwd_chat || null;
    },
    // The forwarded sender controls whether tapping their name opens a chat.
    // Default ON when the flag is absent (Telegram-like).
    forwardTapEnabled() {
      if (this.fwdChat?.id) return true;
      const u = this.message.forwarded_from;
      if (!u) return false;
      if (u.forward_tap_to_chat === false || u.forward_tap_to_chat === 0) return false;
      return true;
    },
    /** Original peer / channel title shown under the “Forwarded from” label. */
    forwardedFromName() {
      if (this.fwdChat?.title) return this.fwdChat.title;
      if (this.message.forwarded_from) return this.forwardedName;
      return '';
    },
    /** Legacy single-line string (tests / previews). */
    forwardHeader() {
      if (!this.forwardedFromName) return '';
      return `${this.$t('messenger.forwardedFrom')} ${this.forwardedFromName}`;
    },
    /** Media / location bubbles use p-0.5 — pad the forward header like Telegram. */
    forwardNeedsPad() {
      return !!(this.isFullBleedMedia || this.isMedia || this.isLocation);
    },
    channelHeader() {
      if (this.chatType !== 'channel') return '';
      if (this.fwdChat) return '';
      return this.chatTitle || '';
    },
    /** Channel posts: meta always on its own row. Chats/groups: float beside text. */
    metaStacked() {
      return this.chatType === 'channel' || this.isSingleEmojiOnly;
    },
    senderLabel() {
      if (!this.showSenderName || this.isMine) return '';
      if (this.groupPos === 'middle' || this.groupPos === 'last') return '';
      const u = this.avatarUser || this.message.user;
      if (!u) return '';
      const nick = u.id != null ? this.contactNameByUserId?.[Number(u.id)] : '';
      return peerDisplayName(u, nick);
    },
    senderColor() {
      const id = Number(this.avatarUser?.id || this.message.user_id || 0);
      const palette = ['#e17076', '#eda86c', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'];
      return palette[Math.abs(id) % palette.length];
    },
    postAuthorLabel() {
      const a = this.message.post_author || this.message.meta?.post_author;
      if (!a) return '';
      const nick = a.id != null ? this.contactNameByUserId?.[Number(a.id)] : '';
      return peerDisplayName(a, nick);
    },
    showViews() {
      if (this.chatType === 'channel' && !this.fwdChat) return true;
      if (this.fwdChat?.type === 'channel') return Number(this.message.view_count) > 0;
      return false;
    },
    viewsLabel() {
      const n = Number(this.message.view_count) || 0;
      let raw;
      if (n >= 1000000) raw = `${(n / 1000000).toFixed(1)}M`;
      else if (n >= 1000) raw = `${(n / 1000).toFixed(1)}K`;
      else raw = n.toLocaleString(this.metaLocale);
      return shapeUiDigits(raw, 'meta');
    },
    metaLocale() {
      const loc = this.$i18n?.locale || 'fa';
      if (String(loc).startsWith('fa')) return 'fa-IR';
      if (String(loc).startsWith('ar')) return 'ar';
      if (String(loc).startsWith('tr')) return 'tr-TR';
      return 'en-US';
    },
    formattedTime() {
      if (!this.message.created_at) return '';
      const d = new Date(this.message.created_at);
      return shapeUiDigits(d.toLocaleTimeString(this.metaLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
    },
    bubbleSwipeStyle() {
      if (this.swipeX === 0 && !this.swiping && !this.swipeReleasing) return {};
      return {
        transform: `translateX(${this.swipeX}px)`,
        transition: this.swiping ? 'none' : tgTransformTransition(220, TG_EASE_OUT),
        willChange: 'transform',
      };
    },
    replyIconStyle() {
      const p = this.swipeProgress;
      const style = {
        opacity: Math.min(1, p * 1.35),
        transform: `translateY(-50%) scale(${0.72 + p * 0.28})`,
      };
      // Reveal the icon on the edge the bubble is dragged away from.
      if (this.swipeX > 0) style.left = '4px';
      else style.right = '4px';
      return style;
    },
    forwardedName() {
      const u = this.message.forwarded_from;
      if (!u) return '';
      // Per-viewer contact nickname (saved name), else the person's real name.
      const nick = u.id != null ? this.contactNameByUserId?.[Number(u.id)] : '';
      return peerDisplayName(u, nick);
    },
    hasTail() {
      // Big single-emoji messages are transparent — no bubble / no tail.
      if (this.isSingleEmojiOnly) return false;
      return this.groupPos === 'single' || this.groupPos === 'last';
    },
    showAvatarColumn() {
      if (this.chatType === 'channel') return false;
      if (this.chatType === 'group') return true;
      if (this.chatType === 'private' || this.chatType === 'saved') return true;
      return false;
    },
    avatarColumnClass() {
      // Width-only gutter; self-stretch so absolute avatar can pin to bottom.
      const base = 'msg-avatar-col w-8 flex-shrink-0 self-stretch';
      if (this.chatType === 'group' && !this.isMine) return `${base} relative`;
      return `${base} relative hidden lg:block`;
    },
    bubbleShape() {
      const g = this.groupPos;
      if (this.isMine) {
        if (g === 'first') return 'rounded-2xl rounded-ee-md';
        if (g === 'middle') return 'rounded-s-2xl rounded-e-md';
        if (g === 'last') return 'rounded-s-2xl rounded-ee-none rounded-e-md';
        return 'rounded-2xl rounded-ee-none';
      }
      if (g === 'first') return 'rounded-2xl rounded-es-md';
      if (g === 'middle') return 'rounded-e-2xl rounded-s-md';
      if (g === 'last') return 'rounded-s-md rounded-es-none rounded-e-2xl';
      return 'rounded-2xl rounded-es-none';
    },
  },
  beforeUnmount() {
    this.clearLp();
    this.clearPendingTick();
    this.clearClockReveal();
    if (this.emojiSpinTimer) {
      clearTimeout(this.emojiSpinTimer);
      this.emojiSpinTimer = null;
    }
    if (this.swipeReleaseTimer) {
      clearTimeout(this.swipeReleaseTimer);
      this.swipeReleaseTimer = null;
    }
    if (this.swipePulseTimer) {
      clearTimeout(this.swipePulseTimer);
      this.swipePulseTimer = null;
    }
  },
  methods: {
    /** Telegram-style per-chat-type + media-type auto-download gate. */
    autoDownloadAllowed(type) {
      return isAutoDownloadEnabled(this.settings, this.chatType, type);
    },
    mediaAutoPlay() {
      const m = this.message;
      if (!m) return false;
      if (m.meta?.animation || m.meta?.silent) return isAutoPlayEnabled(this.settings, 'gifs');
      if (m.type === 'video') return isAutoPlayEnabled(this.settings, 'videos');
      return false;
    },
    onBigEmojiClick(e) {
      if (!this.isSingleEmojiOnly) return;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.playBigEmojiSpin();
    },
    playBigEmojiSpin({ force = false } = {}) {
      if (!this.isSingleEmojiOnly) return;
      if (this.emojiSpinning && !force) return;
      if (this.emojiSpinTimer) {
        clearTimeout(this.emojiSpinTimer);
        this.emojiSpinTimer = null;
      }
      this.emojiSpinning = false;
      // Restart CSS animation cleanly.
      this.$nextTick(() => {
        this.emojiSpinning = true;
        this.emojiDidAutoSpin = true;
        this.emojiSpinTimer = setTimeout(() => {
          this.emojiSpinning = false;
          this.emojiSpinTimer = null;
        }, 750);
      });
    },
    onBigEmojiAnimationEnd(e) {
      if (!this.isSingleEmojiOnly) return;
      if (e?.animationName && e.animationName !== 'msg-emoji-coin' && e.animationName !== 'msg-big-emoji-in') return;
      if (e?.animationName === 'msg-emoji-coin') {
        this.emojiSpinning = false;
        if (this.emojiSpinTimer) {
          clearTimeout(this.emojiSpinTimer);
          this.emojiSpinTimer = null;
        }
      }
    },
    clearPendingTick() {
      if (this.pendingTickTimer) {
        clearInterval(this.pendingTickTimer);
        this.pendingTickTimer = null;
      }
    },
    clearClockReveal() {
      if (this.clockRevealTimer) {
        clearTimeout(this.clockRevealTimer);
        this.clockRevealTimer = null;
      }
      this.clockReveal = false;
    },
    /**
     * Telegram-like pending UI:
     * - stay empty briefly while pending (fast path upgrades to check first)
     * - if still pending after CLOCK_REVEAL_MS → show clock
     * - wire-sent / settled → checks only (never clock after check)
     */
    syncPendingUi() {
      this.clearPendingTick();
      const pendingLike = this.isPendingLike;
      if (!pendingLike) {
        this.clearClockReveal();
        return;
      }
      this.pendingTick = Date.now();
      this.pendingTickTimer = setInterval(() => {
        this.pendingTick = Date.now();
      }, 4000);
      if (this.isSingleEmojiOnly && this.isMine && !this.emojiDidAutoSpin) {
        this.$nextTick(() => this.playBigEmojiSpin({ force: true }));
      }
      // Already revealed or timer running — don't reset the delay on every status flicker.
      if (this.clockReveal || this.clockRevealTimer) return;
      this.clockRevealTimer = setTimeout(() => {
        this.clockRevealTimer = null;
        if (this.isPendingLike) this.clockReveal = true;
      }, CLOCK_REVEAL_MS);
    },
    /** Snap the bubble back (optionally animated) after swipe / cancel. */
    resetSwipe(animate = true) {
      const hadOffset = this.swiping || this.swipeX !== 0 || this.swipeReleasing;
      if (!hadOffset && !this.swipePulse) {
        this.swipeArmedFired = false;
        return;
      }
      const fromX = this.swipeX;
      this.swiping = false;
      this.swipeArmedFired = false;
      if (this.swipeReleaseTimer) {
        clearTimeout(this.swipeReleaseTimer);
        this.swipeReleaseTimer = null;
      }
      if (animate && fromX !== 0) {
        this.swipeReleasing = true;
        // Keep offset for one frame so CSS transition can run to 0.
        this.swipeX = fromX;
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            this.swipeX = 0;
          });
        });
        this.swipeReleaseTimer = setTimeout(() => {
          this.swipeReleasing = false;
          this.swipeReleaseTimer = null;
        }, 220);
      } else {
        this.swipeReleasing = false;
        this.swipeX = 0;
      }
    },
    triggerSwipePulse() {
      this.swipePulse = true;
      if (this.swipePulseTimer) clearTimeout(this.swipePulseTimer);
      this.swipePulseTimer = setTimeout(() => {
        this.swipePulse = false;
        this.swipePulseTimer = null;
      }, 420);
    },
    onTouchCancel() {
      this.clearLp();
      this.resetSwipe(true);
    },
    onRootClick(e) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.static) { this.$emit('bubble-click', this.message); return; }
      if (this.selectionMode) {
        this.$emit('toggle-select', this.message.id);
        return;
      }
      // Empty gutter beside photo/video/map/voice → open the message menu
      // (tap on the media/voice card itself still plays / opens lightbox).
      if (!this.gutterMenuEnabled) return;
      if (this.message.pending && !this.stalePending) return;
      if (e.target.closest('[data-msg-bubble], button, a, label, .msg-avatar-btn, .msg-gutter-hit')) return;
      this.$emit('context', { event: e, message: this.message });
    },
    onGutterMenu(e) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.static || this.selectionMode) return;
      if (this.message.pending && !this.stalePending) return;
      this.$emit('context', { event: e, message: this.message });
    },
    onContextMenu(event) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) {
        if (event?.preventDefault) event.preventDefault();
        return;
      }
      if (this.static || this.selectionMode) return;
      // Still sending — no menu yet, unless it's been pending long enough that
      // the send is likely stuck (watchdog / race). Then expose retry/delete.
      if (this.message.pending && !this.stalePending) return;
      // Mobile long-press fires a native `contextmenu` right before our hold
      // timer enters selection — opening then immediately closing the menu.
      // Touch → selection only; mouse right-click → context menu.
      if (this.lpStartPos || (event && event.pointerType === 'touch')) {
        if (event?.preventDefault) event.preventDefault();
        return;
      }
      if (typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        if (event?.preventDefault) event.preventDefault();
        return;
      }
      this.$emit('context', { event, message: this.message });
    },
    /** Time chip / meta strip on media — tap opens the message menu. */
    onMetaMenuTap(event) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.static || this.selectionMode) return;
      if (this.message.pending && !this.stalePending) return;
      this.$emit('context', { event, message: this.message });
    },
    onMediaMenu({ event, message }) {
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) return;
      if (this.static || this.selectionMode) return;
      if (message?.pending && !this.stalePending) return;
      const el = event?.currentTarget;
      if (el && typeof el.getBoundingClientRect === 'function') {
        const r = el.getBoundingClientRect();
        this.$emit('context', {
          event: { clientX: r.left + r.width / 2, clientY: r.bottom + 4 },
          message: message || this.message,
        });
        return;
      }
      this.$emit('context', { event, message: message || this.message });
    },
    /** True when the touch target should keep its own click (lightbox / controls). */
    isMediaOpenTarget(target) {
      if (!target || typeof target.closest !== 'function') return false;
      // Time chip / ⋮ intentionally open the message menu instead.
      if (target.closest('[data-msg-menu-hit], .media-menu-btn')) return false;
      return !!target.closest(
        '[data-media-interactive], .msg-location, button, a, video, audio'
      );
    },
    /** Controls that must not arm long-press / swipe. */
    isMediaControlTarget(target) {
      if (!target || typeof target.closest !== 'function') return false;
      return !!target.closest(
        'button, a, audio, .media-menu-btn, .media-dl-btn, .media-upload-overlay, [data-media-control]'
      );
    },
    onTouchStart(e) {
      // In selection mode the row's click handler toggles selection, so let the
      // native tap through and don't arm any long-press behaviour here.
      if (this.static || this.selectionMode || (this.message.pending && !this.stalePending)) return;
      const t = e.touches && e.touches[0];
      const target = t && document.elementFromPoint(t.clientX, t.clientY);
      // Don't steal long-press from download / menu / cancel / link controls.
      // Photo/video surface itself DOES arm long-press so selection still works.
      if (this.isMediaControlTarget(target)) {
        this.lpStartPos = null;
        this.clearLp();
        return;
      }
      this.lpStartPos = t ? { x: t.clientX, y: t.clientY } : null;
      this.lpFired = false;
      this.touchMoved = false;
      this.lpOnWave = !!(target && typeof target.closest === 'function'
        && target.closest('.voice-wave, .music-wave'));
      this.resetSwipe(false);
      this.clearLp();
      // Long-press → multi-select (Telegram hold-to-select).
      this.lpTimer = setTimeout(() => {
        this.lpFired = true;
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* noop */ } }
        this.$emit('enter-select', this.message.id);
      }, LONG_PRESS_MS);
    },
    onTouchEnd(e) {
      if (this.static || this.selectionMode || (this.message.pending && !this.stalePending)) return;
      this.clearLp();
      const touch = e.changedTouches && e.changedTouches[0];
      const target = touch && document.elementFromPoint(touch.clientX, touch.clientY);
      // A long-press already entered selection mode — swallow the trailing tap
      // (including on photo/video so the lightbox does not open).
      if (this.lpFired) {
        this.resetSwipe(true);
        this.lpOnWave = false;
        if (e.cancelable) e.preventDefault();
        return;
      }
      // Finish a swipe-to-reply gesture.
      if (this.swiping || this.swipeX !== 0) {
        const trigger = this.swipeProgress >= 1 || Math.abs(this.swipeX) > SWIPE_REPLY_THRESHOLD - 4;
        if (trigger) {
          this.triggerSwipePulse();
          if (navigator.vibrate) { try { navigator.vibrate(14); } catch (err) { /* noop */ } }
          this.resetSwipe(true);
          this.$emit('reply', this.message);
        } else {
          this.resetSwipe(true);
        }
        this.lpOnWave = false;
        if (e.cancelable) e.preventDefault();
        return;
      }
      // Tap on photo/video/location/voice surface → let media handlers run.
      if (this.isMediaOpenTarget(target)) {
        this.resetSwipe(true);
        this.lpOnWave = false;
        return;
      }
      // Voice/audio/file: only the empty gutter (or ⋮) opens the menu — not the card body.
      if (this.isAudioMessage || this.isFile) {
        this.resetSwipe(true);
        this.lpOnWave = false;
        return;
      }
      if (this.touchMoved) {
        this.lpOnWave = false;
        return;
      }
      if (!this.lpStartPos) {
        this.lpOnWave = false;
        return;
      }
      if (typeof this.consumeChatAccessoryTap === 'function' && this.consumeChatAccessoryTap()) {
        this.lpOnWave = false;
        if (e.cancelable) e.preventDefault();
        return;
      }
      const pos = this.lpStartPos || { x: 0, y: 0 };
      this.lpOnWave = false;
      // Taps on the reply / forwarded previews must not fall through to the
      // bubble's "open context menu" handler (preventDefault blocks their click).
      if (target && target.closest('[data-reply-preview]')) {
        if (e.cancelable) e.preventDefault();
        this.onReplyTap();
        return;
      }
      if (target && target.closest('[data-forward-preview]') && this.forwardTapEnabled) {
        if (e.cancelable) e.preventDefault();
        this.onForwardTap();
        return;
      }
      // Tap time chip / padding / text → open the message context menu.
      if (e.cancelable) e.preventDefault();
      this.$emit('context', { event: { clientX: pos.x, clientY: pos.y }, message: this.message });
    },
    onTouchMove(e) {
      if (this.static || this.selectionMode || !this.lpStartPos) return;
      // Waveform owns horizontal drag for seeking — don't steal it for reply.
      if (this.lpOnWave) {
        this.clearLp();
        return;
      }
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - this.lpStartPos.x;
      const dy = t.clientY - this.lpStartPos.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (!this.swiping && (adx > 10 || ady > 10)) {
        this.touchMoved = true;
        this.clearLp();
        // Start a horizontal swipe only when the gesture is clearly sideways.
        if (adx > ady && adx > 12) {
          this.swipeReleasing = false;
          this.swipeArmedFired = false;
          if (this.swipeReleaseTimer) {
            clearTimeout(this.swipeReleaseTimer);
            this.swipeReleaseTimer = null;
          }
          this.swiping = true;
        }
      }
      if (this.swiping) {
        // Follow the finger both ways, clamped, with mild resistance past threshold.
        const max = 88;
        let v = dx;
        if (v > max) v = max + (v - max) * 0.18;
        if (v < -max) v = -max + (v + max) * 0.18;
        this.swipeX = v;
        if (!this.swipeArmedFired && Math.abs(v) >= SWIPE_REPLY_THRESHOLD) {
          this.swipeArmedFired = true;
          if (navigator.vibrate) { try { navigator.vibrate(8); } catch (err) { /* noop */ } }
        }
      }
    },
    clearLp() {
      if (this.lpTimer) {
        clearTimeout(this.lpTimer);
        this.lpTimer = null;
      }
    },
    onAvatarClick() {
      const u = this.avatarUser;
      if (!u) return;
      // Never navigate to own profile from a message avatar.
      if (this.isMine) return;
      const id = u.id ?? u.user_id;
      if (id == null) return;
      this.$emit('avatar-click', { ...u, id });
    },
    onForwardTap() {
      if (!this.forwardTapEnabled || !this.message.forwarded_from?.id) return;
      this.$emit('forward-tap', this.message.forwarded_from);
    },
    onForwardHeaderTap() {
      if (this.fwdChat?.id) {
        this.$emit('forward-chat-tap', this.fwdChat);
        return;
      }
      this.onForwardTap();
    },
    onChannelHeaderTap() {
      this.$emit('channel-tap');
    },
    onReplyTap() {
      const replyId = this.message.reply_to?.id;
      if (replyId == null) return;
      this.$emit('scroll-to-reply', replyId);
    },
    onRetry() {
      this.$emit('retry', this.message);
    },
    onBodyLinkClick(part, event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.selectionMode) return;
      const info = classifyMessageHref(part.href);
      if (info.kind === 'invite' || info.kind === 'community') {
        this.$emit('open-link', info);
        return;
      }
      if (info.kind === 'internal') {
        this.$router.push(info.href).catch(() => {
          window.location.assign(info.href);
        });
        return;
      }
      const win = window.open(info.href, '_blank', 'noopener,noreferrer');
      if (win) win.opener = null;
    },
    onMediaLink(part, event) {
      this.onBodyLinkClick(part, event);
    },
    onLocationOpen() {
      openLocationInMaps(this.locationLat, this.locationLng);
    },
    formatClass(part) {
      const styles = part?.styles || [];
      if (!styles.length) return '';
      return styles.map((s) => `msg-fmt-${s}`).join(' ');
    },
    highlightSegs(text) {
      return splitHighlight(text, this.highlightQuery);
    },
  },
};
</script>
<style scoped>
/* Invisible hit target on the empty side of voice / media rows. */
.msg-gutter-hit {
  flex: 1 1 auto;
  align-self: stretch;
  min-width: 2.5rem;
  min-height: 2.75rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
}

.msg-bubble-mine {
  background: var(--tg-bubble-out, #eeffde);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
}
.dark .msg-bubble-mine {
  background: var(--tg-bubble-out-dark, #3e6b41);
  box-shadow: none;
}
.msg-bubble-other {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.dark .msg-bubble-other {
  box-shadow: none;
}

/* Tail anchored on the bubble's bottom outer corner. Logical sides so it
   mirrors automatically for RTL/LTR. */
.msg-tail-other {
  inset-inline-start: -14px;
}

.msg-tail-mine {
  inset-inline-end: -14px;
  transform: scaleX(-1);
}

/* Sit flush with the bubble's bottom edge — absolute so avatar height
   never contributes to the message row (keeps cluster gaps tight). */
.msg-avatar-col {
  pointer-events: none;
}
.msg-avatar-btn {
  position: absolute;
  bottom: 0;
  inset-inline-start: 0;
  line-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 999px;
  transform: translateY(2px);
}
.msg-avatar-btn:focus-visible {
  outline: 2px solid rgba(51, 144, 236, 0.7);
  outline-offset: 2px;
}
.msg-avatar-btn--static {
  cursor: default;
}

/* Cluster spacing only — avatar stays in a flex column beside the bubble. */
.msg-row--tight {
  margin-top: 2px;
}
.msg-row--loose {
  margin-top: 0.625rem;
}
/* Big emoji / stickers need room so glyphs don't paint into the bubble above. */
.msg-row--tight.msg-row--big-emoji,
.msg-row--tight.msg-row--sticker {
  margin-top: 0.55rem;
}
.msg-row--loose.msg-row--big-emoji,
.msg-row--loose.msg-row--sticker {
  margin-top: 0.75rem;
}

/*
  Body + meta layout:
  - channel (stack): body, then badge below (hug content)
  - chat/group (float): meta sits on the last text line; wraps under if no room
*/
.msg-body-stack {
  display: flex;
  flex-direction: column;
}

.msg-body-float {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  column-gap: 6px;
  row-gap: 0;
}

.msg-body-float .msg-body-text {
  flex: 1 1 auto;
  min-width: 0;
}

.msg-meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 3px;
  width: max-content;
  max-width: 100%;
  color: inherit;
  user-select: none;
}

.msg-meta--inline {
  margin-inline-start: auto;
  flex-shrink: 0;
  opacity: 0.55;
  padding: 0;
  background: transparent;
}

.msg-meta--badge {
  align-self: flex-end;
  margin-top: 3px;
  margin-inline-start: auto;
  margin-inline-end: 0;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.07);
  opacity: 0.72;
}

/* Full-bleed media: time under media when a caption is present. */
.msg-meta--media {
  margin-top: 2px;
  margin-bottom: 0;
  margin-inline-end: 2px;
  padding: 1px 5px;
}

/*
  Inner media frame: uniform 12px (≈ bubble rounded-2xl minus p-0.5).
*/
.msg-media-clip {
  isolation: isolate;
  border-radius: 12px;
  overflow: hidden;
}

.msg-media-stage {
  position: relative;
}

.msg-media-frame.has-caption .msg-media-clip {
  /* Media is its own rounded card; caption lives outside the clip. */
  border-radius: 12px;
}

.msg-media-caption {
  width: 100%;
  box-sizing: border-box;
  margin-top: 6px;
  padding-inline: 8px;
  font-size: 15px;
  line-height: 1.35;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Time chip on photo / video / map — same trailing edge as text meta (RTL = left). */
.msg-meta--on-media {
  position: absolute;
  bottom: 5px;
  inset-inline-end: 5px;
  inset-inline-start: auto;
  left: auto;
  right: auto;
  z-index: 5;
  align-self: auto;
  margin: 0;
  padding: 2px 6px;
  border-radius: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  opacity: 1;
  pointer-events: none;
  backdrop-filter: blur(4px);
}

/* Tappable time chip — opens the message menu without opening the lightbox. */
.msg-meta--menu-hit {
  pointer-events: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.msg-meta--on-media .msg-meta-text,
.msg-meta--on-media .msg-meta-icon {
  color: inherit;
}

.msg-meta--on-media .text-sky-400 {
  color: #7dd3fc;
}

.msg-media-frame {
  min-width: 0;
  width: max-content;
  max-width: 100%;
}
.msg-media-frame.has-caption {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
}
.msg-media-frame.has-caption .msg-media-clip {
  width: 100%;
  max-width: 100%;
}

.msg-sticker-bubble {
  background: transparent !important;
  box-shadow: none !important;
}

.msg-sticker-frame {
  width: fit-content;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.msg-sticker-frame .msg-meta--emoji-badge {
  align-self: flex-end;
  margin-top: 2px;
  margin-inline-start: auto;
}

.dark .msg-meta--badge {
  background: rgba(0, 0, 0, 0.22);
}

.msg-meta-views {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.msg-meta-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  display: block;
}

.msg-meta-text {
  font-size: 10.5px;
  line-height: 13px;
  height: 13px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  unicode-bidi: isolate;
  direction: ltr;
  transform: none;
}

.msg-meta-author {
  max-width: 6.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-inline-end: 1px;
}

.msg-body-link {
  color: #3390ec;
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
}

.dark .msg-body-link {
  color: #6ab2f2;
}

.msg-search-hit {
  background: rgba(51, 144, 236, 0.32);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.dark .msg-search-hit {
  background: rgba(106, 178, 242, 0.38);
}

.msg-search-current .msg-search-hit {
  background: rgba(250, 204, 21, 0.55);
}

.dark .msg-search-current .msg-search-hit {
  background: rgba(250, 204, 21, 0.45);
}

.msg-fmt-bold {
  font-weight: 700;
}

.msg-fmt-italic {
  font-style: italic;
}

.msg-fmt-underline {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.msg-fmt-superscript {
  font-size: 0.72em;
  vertical-align: super;
  line-height: 0;
}

.msg-fmt-subscript {
  font-size: 0.72em;
  vertical-align: sub;
  line-height: 0;
}

/* Keep link color when also formatted */
.msg-body-link.msg-fmt-underline {
  text-decoration: underline;
}

/* Single-emoji message — glyph keeps its own aspect; size scales, capped (Telegram). */
.msg-body--big-emoji {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  width: fit-content;
  max-width: min(42vw, 7.25rem);
  min-width: 0;
  /* Reserve vertical room so emoji font overhang + entrance scale don't clip into the prior row. */
  padding-block: 0.35rem 0.1rem;
  overflow: visible;
  perspective: 420px;
}
.msg-body--big-emoji.is-mine-emoji {
  align-items: flex-end;
}
.msg-body-text--big-emoji {
  /* Natural glyph metrics; viewport-aware with a hard max — not a fixed box. */
  font-size: clamp(2.6rem, 18vw, 4.35rem);
  line-height: 1.2;
  letter-spacing: 0;
  text-align: center;
  width: fit-content;
  height: fit-content;
  max-width: 100%;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
  font-variant-emoji: emoji;
  animation: msg-big-emoji-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
  overflow: visible;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transform-origin: center center;
  will-change: transform;
  padding: 0;
  margin: 0;
  display: inline-block;
}
.msg-body-text--big-emoji.is-spinning {
  animation: msg-emoji-coin 0.7s cubic-bezier(0.33, 1, 0.68, 1) both;
}
.msg-body--big-emoji .msg-meta,
.msg-body-stack.msg-body--big-emoji .msg-meta,
.msg-body-float.msg-body--big-emoji .msg-meta,
.msg-meta--emoji-badge {
  align-self: inherit;
  margin-top: 0 !important;
  background: rgba(15, 23, 42, 0.5) !important;
  color: #fff !important;
  border-radius: 999px !important;
  padding: 2px 7px !important;
  opacity: 1 !important;
}
.msg-meta--emoji-badge .msg-meta-text,
.msg-meta--emoji-badge .msg-meta-icon {
  color: inherit !important;
}
@keyframes msg-big-emoji-in {
  0% {
    opacity: 0;
    transform: scale(0.55);
  }
  70% {
    opacity: 1;
    transform: scale(1.04);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes msg-emoji-coin {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  35% {
    transform: rotateY(180deg) scale(1.1);
  }
  70% {
    transform: rotateY(300deg) scale(1.04);
  }
  100% {
    transform: rotateY(360deg) scale(1);
  }
}

/* Selection: overlay only — transform, never layout metrics */
.msg-select-tint {
  background: rgba(51, 144, 236, 0.12);
  z-index: 0;
  opacity: 1;
  transition: opacity var(--tg-dur-fast, 140ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}
.msg-select-tint-enter-active,
.msg-select-tint-leave-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease;
}
.dark .msg-select-tint {
  background: rgba(106, 178, 242, 0.14);
}
.msg-select-circle {
  position: absolute;
  /* Physical right — selection rail is always on the right in this RTL-first chat */
  right: 6px;
  left: auto;
  top: 50%;
  z-index: 6;
  width: 22px;
  height: 22px;
  margin-top: -11px;
  border-radius: 999px;
  border: 2px solid rgba(160, 170, 180, 0.85);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0;
  transform: scale(0.55);
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    opacity var(--tg-dur-normal, 200ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    transform var(--tg-dur-med, 240ms) var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)),
    background var(--tg-dur-fast, 140ms) ease,
    border-color var(--tg-dur-fast, 140ms) ease,
    box-shadow var(--tg-dur-fast, 140ms) ease;
}
.msg-select-circle.is-on {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.msg-select-circle.is-selected {
  background: #31b545;
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(49, 181, 69, 0.22);
  animation: msg-select-pop var(--tg-dur-med, 240ms) var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)) both;
}
.dark .msg-select-circle.is-selected {
  border-color: #0e1621;
  box-shadow: 0 0 0 2px rgba(49, 181, 69, 0.28);
}
.msg-select-check {
  width: 12px;
  height: 12px;
  color: #fff;
  animation: msg-check-in 0.22s var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1)) both;
}
@keyframes msg-select-pop {
  0% { transform: scale(0.72); }
  55% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes msg-check-in {
  0% { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
.msg-row-body {
  transition: transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  will-change: transform;
}
/*
  Circle sits on the physical RIGHT. Only right-aligned bubbles nudge left
  (inward) so the rail fits — no layout metrics change.
  RTL: peers (justify-start) are on the right.
  LTR: mine (justify-end) are on the right.
*/
[dir="rtl"] .msg-row-body.is-selecting:not(.is-mine),
[dir="ltr"] .msg-row-body.is-selecting.is-mine {
  transform: translateX(-38px);
}
[dir="rtl"] .msg-row-body.is-selecting.is-mine,
[dir="ltr"] .msg-row-body.is-selecting:not(.is-mine) {
  transform: none;
}

/* Telegram-style swipe-to-reply FAB + progress ring */
.msg-reply-fab {
  position: absolute;
  top: 50%;
  z-index: 12;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: transform, opacity;
}
.msg-reply-ring {
  position: absolute;
  inset: 0;
  width: 40px;
  height: 40px;
  transform: rotate(-90deg);
}
.msg-reply-ring-track {
  fill: none;
  stroke: rgba(51, 144, 236, 0.18);
  stroke-width: 2.5;
}
.msg-reply-ring-prog {
  fill: none;
  stroke: #3390ec;
  stroke-width: 2.75;
  stroke-linecap: round;
  stroke-dasharray: 100.53; /* 2π·16 */
  transition: stroke-dashoffset 0.04s linear;
}
.dark .msg-reply-ring-track {
  stroke: rgba(106, 178, 242, 0.2);
}
.dark .msg-reply-ring-prog {
  stroke: #6ab2f2;
}
.msg-reply-orb {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3390ec;
  color: #fff;
  box-shadow: 0 2px 10px rgba(51, 144, 236, 0.4);
  transition: transform 0.12s cubic-bezier(0.22, 1, 0.36, 1), background 0.12s ease;
}
.dark .msg-reply-orb {
  background: #3d9aef;
}
.msg-reply-ico {
  width: 15px;
  height: 15px;
  display: block;
}
.msg-reply-fab.is-armed .msg-reply-orb {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(51, 144, 236, 0.55);
}
.msg-reply-fab.is-pulse {
  animation: msg-reply-pulse 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.msg-reply-fab.is-pulse .msg-reply-orb {
  animation: msg-reply-orb-pulse 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes msg-reply-pulse {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes msg-reply-orb-pulse {
  0% { transform: scale(1.05); }
  40% { transform: scale(1.55); }
  100% { transform: scale(0.6); opacity: 0; }
}
</style>

