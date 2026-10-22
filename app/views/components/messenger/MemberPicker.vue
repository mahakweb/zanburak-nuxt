<template>
  <div class="mp-root">
    <div v-if="selected.length" class="mp-chips">
      <span class="mp-chips-label">{{ $t('messenger.selectedMembers') }}</span>
      <button
        v-for="u in selected"
        :key="'chip-' + u.id"
        type="button"
        class="mp-chip"
        @click="toggle(u)"
      >
        <span class="truncate max-w-[9rem]">{{ displayName(u) }}</span>
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <input
      v-model="query"
      v-no-autofill="'strong'"
      type="search"
      name="messenger-member-picker"
      class="mp-search"
      :placeholder="$t('messenger.memberSearchPlaceholder')"
      :disabled="disabled"
      @input="onQueryInput"
    />

    <p v-if="contactsLoading && !rows.length" class="mp-status">{{ $t('messenger.loadingContacts') }}</p>
    <p v-else-if="searchLoading" class="mp-status">{{ $t('messenger.searchingMembers') }}</p>
    <p v-if="error" class="mp-status mp-status--error">
      {{ error }}
      <button type="button" class="mp-retry" @click="loadContacts">{{ $t('messenger.refresh') }}</button>
    </p>

    <div v-if="rows.length" class="mp-list" role="listbox" :aria-label="$t('messenger.contactsToAdd')">
      <p class="mp-section">{{ sectionLabel }}</p>
      <button
        v-for="u in rows"
        :key="u.id"
        type="button"
        role="option"
        :aria-selected="isSelected(u.id)"
        class="mp-row"
        :disabled="disabled"
        @click="toggle(u)"
      >
        <MessengerAvatar :user="u" :name="displayName(u)" size="sm" :online="!!u.is_online" />
        <span class="mp-copy">
          <span class="mp-name">{{ displayName(u) }}</span>
          <span v-if="subtitle(u)" class="mp-sub"><bdi dir="ltr">{{ subtitle(u) }}</bdi></span>
        </span>
        <span class="mp-check" :class="{ 'is-on': isSelected(u.id) }" aria-hidden="true">
          <svg v-if="isSelected(u.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </button>
    </div>
    <p v-else-if="!contactsLoading && !searchLoading && !error" class="mp-status">
      {{ query.trim() ? $t('messenger.noMemberMatches') : $t('messenger.noAddableContacts') }}
    </p>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import { getContacts, getBlockedContacts, searchUsers } from '@/services/messenger';

const SEARCH_MIN = 3;

export default {
  name: 'MemberPicker',
  components: { MessengerAvatar },
  props: {
    selected: { type: Array, default: () => [] },
    excludeIds: { type: Array, default: () => [] },
    selfId: { type: [Number, String], default: null },
    max: { type: Number, default: 200 },
    allowSearch: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:selected', 'limit'],
  data() {
    return {
      query: '',
      contacts: [],
      remote: [],
      blockedIds: [],
      contactsLoading: false,
      searchLoading: false,
      error: '',
      searchTimer: null,
      searchSeq: 0,
    };
  },
  computed: {
    excluded() {
      const set = new Set(this.excludeIds.map((id) => Number(id)));
      this.blockedIds.forEach((id) => set.add(Number(id)));
      if (this.selfId != null && this.selfId !== '') set.add(Number(this.selfId));
      return set;
    },
    selectedIds() {
      return new Set(this.selected.map((u) => Number(u.id)));
    },
    filteredContacts() {
      const q = this.query.trim().toLowerCase();
      return this.contacts.filter((u) => {
        if (this.excluded.has(Number(u.id))) return false;
        if (!q) return true;
        return this.haystack(u).includes(q);
      });
    },
    rows() {
      const q = this.query.trim();
      const seen = new Set();
      const out = [];
      const push = (u) => {
        const id = Number(u?.id);
        if (!id || seen.has(id) || this.excluded.has(id)) return;
        seen.add(id);
        out.push(u);
      };
      this.filteredContacts.forEach(push);
      if (q.length >= SEARCH_MIN) this.remote.forEach(push);
      return out;
    },
    sectionLabel() {
      return this.query.trim().length >= SEARCH_MIN
        ? this.$t('messenger.usersSection')
        : this.$t('messenger.contactsToAdd');
    },
  },
  mounted() {
    this.loadContacts();
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer);
    this.searchSeq += 1;
  },
  methods: {
    displayName(u) {
      if (u?.contact_name) return u.contact_name;
      const full = `${u?.first_name || ''} ${u?.last_name || ''}`.trim();
      return full || u?.username || `#${u?.id || ''}`;
    },
    subtitle(u) {
      const username = u?.username ? `@${u.username}` : '';
      if (!username) return '';
      if (username.replace('@', '') === this.displayName(u)) return '';
      return username;
    },
    haystack(u) {
      return [this.displayName(u), u.first_name, u.last_name, u.username, u.contact_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    },
    isSelected(id) {
      return this.selectedIds.has(Number(id));
    },
    personFromContact(ct) {
      const u = ct.contact_user || {};
      return {
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        username: u.username,
        profile_pic: u.profile_pic,
        is_online: u.is_online,
        contact_name: ct.name || '',
      };
    },
    async loadContacts() {
      this.contactsLoading = true;
      this.error = '';
      let contactsFailed = false;
      try {
        const [contactsRes, blockedRes] = await Promise.all([
          getContacts('name_asc').catch(() => { contactsFailed = true; return { data: [] }; }),
          getBlockedContacts().catch(() => ({ data: [] })),
        ]);
        const contacts = contactsRes.data || contactsRes || [];
        const blocked = blockedRes.data || blockedRes || [];
        this.blockedIds = blocked
          .map((row) => Number(row.contact_user?.id || row.contact_user_id))
          .filter(Boolean);
        this.contacts = (Array.isArray(contacts) ? contacts : [])
          .filter((ct) => ct?.contact_user?.id && !ct.is_blocked)
          .map((ct) => this.personFromContact(ct));
        if (contactsFailed && !this.contacts.length) {
          this.error = this.$t('messenger.memberSearchError');
        }
      } catch (e) {
        this.contacts = [];
        this.error = this.$t('messenger.memberSearchError');
      } finally {
        this.contactsLoading = false;
      }
    },
    onQueryInput() {
      clearTimeout(this.searchTimer);
      const q = this.query.trim();
      if (q.length < SEARCH_MIN || !this.allowSearch) {
        this.searchSeq += 1;
        this.remote = [];
        this.searchLoading = false;
        return;
      }
      this.searchLoading = true;
      this.searchTimer = setTimeout(() => this.runSearch(q), 300);
    },
    async runSearch(q) {
      const seq = ++this.searchSeq;
      try {
        const res = await searchUsers(q, 20);
        if (seq !== this.searchSeq || this.query.trim() !== q) return;
        const rows = res.data || res || [];
        this.error = '';
        this.remote = (Array.isArray(rows) ? rows : []).map((u) => ({
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          profile_pic: u.profile_pic,
          is_online: u.is_online,
        }));
      } catch (e) {
        if (seq !== this.searchSeq) return;
        if (e?.code === 'ERR_CANCELED') return;
        this.remote = [];
        this.error = e?.response?.data?.message || this.$t('messenger.memberSearchError');
      } finally {
        if (seq === this.searchSeq) this.searchLoading = false;
      }
    },
    toggle(u) {
      if (this.disabled || !u?.id) return;
      const next = this.selected.slice();
      const i = next.findIndex((x) => Number(x.id) === Number(u.id));
      if (i >= 0) {
        next.splice(i, 1);
        this.$emit('update:selected', next);
        return;
      }
      if (next.length >= this.max) {
        this.$emit('limit');
        return;
      }
      next.push(u);
      this.$emit('update:selected', next);
    },
  },
};
</script>

<style scoped>
.mp-root { display: flex; flex-direction: column; gap: 8px; }
.mp-search {
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  border: 1px solid #c5ced6;
  background: #f7f9fb;
  color: #111827;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.mp-search:focus {
  border-color: #3390ec;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(51, 144, 236, 0.16);
}
.dark .mp-search {
  background: #0e1621;
  border-color: rgba(255, 255, 255, 0.16);
  color: #f3f4f6;
}
.mp-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.mp-chips-label { font-size: 11px; color: #707579; width: 100%; }
.mp-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.12);
  color: #3390ec;
  font-size: 12px;
  padding: 4px 8px;
}
.mp-list {
  max-height: 16.5rem;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #f7f9fb;
}
.dark .mp-list {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}
.mp-section {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 6px 10px 2px;
  font-size: 11px;
  font-weight: 600;
  color: #707579;
  background: inherit;
}
.mp-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  text-align: start;
}
.mp-copy {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
}
.mp-row:hover { background: rgba(0, 0, 0, 0.04); }
.dark .mp-row:hover { background: rgba(255, 255, 255, 0.05); }
.mp-row:disabled { opacity: 0.5; }
.mp-name {
  display: block;
  max-width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
}
.dark .mp-name { color: #f3f4f6; }
.mp-sub {
  display: block;
  max-width: 100%;
  margin-top: 1px;
  font-size: 12px;
  line-height: 1.3;
  color: #8b98a5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
}
.mp-sub bdi {
  unicode-bidi: isolate;
  direction: ltr;
}
.mp-check {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1.5px solid #c5cdd4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.dark .mp-check { border-color: rgba(255, 255, 255, 0.28); }
.mp-check.is-on { background: #3390ec; border-color: #3390ec; }
.mp-check svg { width: 14px; height: 14px; }
.mp-status { font-size: 12px; color: #8b98a5; text-align: center; padding: 8px 4px; }
.mp-status--error { color: #e05353; }
.mp-retry { margin-inline-start: 6px; color: #3390ec; font-weight: 600; }
</style>
