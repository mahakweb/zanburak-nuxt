<script setup>
import { computed, ref } from 'vue';
import { useStore } from "@/composables/useStore";
import { useRouter } from 'vue-router';
import { ADMIN_MENU_ITEMS } from '@/config/adminMenuItems';
import { getAccessibleAdminQuickLinks } from '@/utils/adminMenu';
import AccountMenuTriggers from '@/views/components/common/AccountMenuTriggers.vue';
import AccountMenuOptions from '@/views/components/common/AccountMenuOptions.vue';
import AccountMenuViewSwap from '@/views/components/common/AccountMenuViewSwap.vue';

const emit = defineEmits(['close']);

const store = useStore();
const router = useRouter();

// 'main' | 'lang' | 'theme'
const view = ref('main');

const currentUser = computed(() => store.state.auth.status.userInfo);
const unapprovedCommentsCount = computed(() => store.getters['adminComments/unapprovedCommentsCount']);

const roleLabels = computed(() => {
    const roles = currentUser.value?.roles;
    if (!Array.isArray(roles) || roles.length === 0) return [];
    return roles.map((r) => (typeof r === 'string' ? r : r?.display_name || r?.name)).filter(Boolean);
});

const quickLinks = computed(() => {
    return getAccessibleAdminQuickLinks(currentUser.value, ADMIN_MENU_ITEMS).map((link) => ({
        ...link,
        badge: link.key === 'comments' && unapprovedCommentsCount.value > 0
            ? unapprovedCommentsCount.value
            : null,
    }));
});

function close() {
    view.value = 'main';
    emit('close');
}

function logout() {
    close();
    store.dispatch('auth/logout');
    router.push('/');
}
</script>

<template>
    <div class="h-full min-h-0 flex flex-col">
        <router-link
            to="/"
            @click="close"
            class="mx-[5%] site-entry group relative mt-3 mb-4 flex min-h-[3.25rem] shrink-0 items-center gap-3 overflow-hidden rounded-xl border border-amber-400/30 bg-gradient-to-l from-amber-400 via-yellow-400 to-orange-400 px-3.5 py-2.5 text-gray-900 shadow-[0_8px_24px_rgba(251,191,36,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(251,191,36,0.45)] active:translate-y-0 active:scale-[0.99]">
            <span class="site-entry__glow pointer-events-none absolute inset-0 opacity-70"></span>
            <span class="site-entry__shimmer pointer-events-none absolute inset-0"></span>
            <span
                class="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/40 ring-1 ring-white/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true">
                    <path
                        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
                        class="fill-gray-800/90" />
                </svg>
            </span>
            <span class="relative z-[1] min-w-0 flex-1">
                <span class="block text-xs font-bold tracking-wide">{{ $t('common.zanburak') }}</span>
                <span class="mt-0.5 block text-[10px] text-gray-800/70">{{ $t('user.backToMainSite') }}</span>
            </span>
            <span
                class="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/30 ring-1 ring-white/40 transition-all duration-300 group-hover:translate-x-[-2px] group-hover:bg-white/50 rtl:group-hover:translate-x-[2px]">
                <svg class="h-3.5 w-3.5 ltr:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="text-gray-800" />
                </svg>
            </span>
        </router-link>

        <div class="mb-1 min-h-0 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            <div class="flex items-center justify-between gap-2 text-sm text-gray-900 dark:text-white">
                <div class="flex items-center min-w-0">
                    <div
                        class="w-11 h-11 me-2 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400/40 dark:border-amber-400/30 bg-gray-200 dark:bg-gray-700">
                        <img onerror="this.style.display='none'"
                            class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
                            :src="currentUser.profile_pic" :alt="currentUser.username" />
                    </div>
                    <div class="min-w-0">
                        <div class="text-sm font-semibold line-clamp-1">
                            {{ currentUser.first_name + ' ' + currentUser.last_name }}
                        </div>
                        <div dir="ltr" class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{
                            currentUser.email }}</div>
                    </div>
                </div>
                <div v-if="roleLabels.length"
                    class="shrink-0 max-w-[40%] flex flex-wrap justify-end gap-1">
                    <span v-for="role in roleLabels.slice(0, 2)" :key="role"
                        class="rounded-lg border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">
                        {{ role }}
                    </span>
                </div>
            </div>

            <AccountMenuViewSwap :view="view">
            <div v-if="view === 'main'">
                <ul v-if="quickLinks.length"
                    class="mt-3 border border-gray-100 dark:border-gray-800 rounded-lg p-1.5 text-xs font-medium font-anjoman text-gray-600 dark:text-gray-200">
                    <li v-for="(link, idx) in quickLinks" :key="link.key">
                        <router-link :to="{ name: link.link }" @click="close"
                            class="flex items-center justify-between ps-4 pe-2 rounded-lg py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                            <span class="flex items-center min-w-0">
                                <span v-if="link.icon" class="w-4 h-4 me-3 shrink-0 opacity-80" v-html="link.icon"></span>
                                <span class="font-semibold line-clamp-1">{{ link.title }}</span>
                            </span>
                            <span v-if="link.badge"
                                class="ms-2 shrink-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {{ link.badge > 99 ? '99+' : link.badge }}
                            </span>
                        </router-link>
                        <hr v-if="idx < quickLinks.length - 1"
                            class="my-0.5 ms-10 me-8 border-t border-gray-100 dark:border-gray-800 border-dashed" />
                    </li>
                </ul>

                <AccountMenuTriggers class="mt-3" accent="violet" @open="view = $event" />
            </div>

            <AccountMenuOptions v-else class="mt-3" :view="view" accent="violet" @back="view = 'main'" />
            </AccountMenuViewSwap>
        </div>

        <div class="mt-auto pt-2 shrink-0">
            <button @click.prevent="logout"
                class="bg-gray-100/30 dark:bg-gray-800/30 rounded-lg w-full cursor-pointer flex items-center justify-center ps-4 px-2 py-2.5 text-xs font-medium font-anjoman text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-red-500">
                <svg class="w-4 h-4 me-3 rtl:rotate-180" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z"
                        class="fill-current" />
                    <path
                        d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z"
                        class="fill-current" />
                </svg>
                <span class="font-semibold">{{ $t('user.logoutAccount') }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.site-entry__glow {
    background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.45), transparent 55%);
    animation: site-entry-glow 3s ease-in-out infinite;
}

.site-entry__shimmer {
    background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.35) 45%, transparent 65%);
    transform: translateX(-120%);
    animation: site-entry-shimmer 2.8s ease-in-out infinite;
}

@keyframes site-entry-glow {

    0%,
    100% {
        opacity: 0.45;
    }

    50% {
        opacity: 0.85;
    }
}

@keyframes site-entry-shimmer {
    0% {
        transform: translateX(-120%);
    }

    55% {
        transform: translateX(120%);
    }

    100% {
        transform: translateX(120%);
    }
}
</style>
