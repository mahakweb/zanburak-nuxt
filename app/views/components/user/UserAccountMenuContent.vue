<script setup>
import { computed, ref } from 'vue';
import { useStore } from "@/composables/useStore";
import { usePermission } from '@/composables/usePermission';
import AccountMenuTriggers from '@/views/components/common/AccountMenuTriggers.vue';
import AccountMenuOptions from '@/views/components/common/AccountMenuOptions.vue';
import AccountMenuViewSwap from '@/views/components/common/AccountMenuViewSwap.vue';
import SeoImage from '@/views/components/seo/SeoImage.vue';

const emit = defineEmits(['close']);

const store = useStore();
const { canAccessAdmin } = usePermission();

const currentUser = computed(() => store.state.auth.status.userInfo);
const walletBalance = computed(() => Number(currentUser.value?.wallet_balance ?? 0));
const userScore = computed(() => Number(currentUser.value?.score ?? 0));
const canAccessAdminPanel = computed(() => canAccessAdmin());

// 'main' | 'lang' | 'theme'
const view = ref('main');

function close() {
    view.value = 'main';
    emit('close');
}

function logout() {
    close();
    store.dispatch('auth/logout');
}
</script>

<template>
    <div class="h-full min-h-0 flex flex-col">
        <router-link
            v-if="canAccessAdminPanel"
            :to="{ name: 'admin-index' }"
            @click="close"
            class="mx-[5%] admin-panel-entry group relative mt-3 mb-4 flex min-h-[3.25rem] shrink-0 items-center gap-3 overflow-hidden rounded-xl border border-violet-400/25 bg-gradient-to-l from-violet-600 via-purple-600 to-indigo-600 px-3.5 py-2.5 text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(124,58,237,0.45)] active:translate-y-0 active:scale-[0.99]">
            <span class="admin-panel-entry__glow pointer-events-none absolute inset-0 opacity-70"></span>
            <span class="admin-panel-entry__shimmer pointer-events-none absolute inset-0"></span>
            <span
                class="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2L4 6V11.5C4 16.75 7.5 21.35 12 22.5C16.5 21.35 20 16.75 20 11.5V6L12 2Z"
                        class="fill-white/90" />
                    <path d="M9.5 12.2L11.2 13.9L14.8 10.3" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round" class="text-violet-700" />
                </svg>
            </span>
            <span class="relative z-[1] min-w-0 flex-1">
                <span class="block text-xs font-bold tracking-wide">{{ $t('user.adminPanel') }}</span>
                <span class="mt-0.5 block text-[10px] text-white/80">{{ $t('user.adminPanelHint') }}</span>
            </span>
            <span
                class="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-300 group-hover:translate-x-[-2px] group-hover:bg-white/20 rtl:group-hover:translate-x-[2px]">
                <svg class="h-3.5 w-3.5 ltr:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="text-white" />
                </svg>
            </span>
        </router-link>

        <div class="mb-1 min-h-0 flex-1 overflow-y-auto custom-scrollbar">
            <div class="flex items-center justify-between text-sm text-gray-900 dark:text-white">
                <div class="flex items-center line-clamp-1">
                    <router-link
                        :to="{ name: 'profile-page', params: { username: currentUser.username } }"
                        @click="close"
                        class="w-11 h-11 me-2 text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 border-2 dark:border-gray-500 rounded-xl overflow-hidden">
                        <SeoImage
                            :src="currentUser.profile_pic"
                            :alt="currentUser.username || 'کاربر'"
                            :width="44"
                            :height="44"
                            sizes-preset="avatar"
                            img-class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
                        />
                    </router-link>
                    <div>
                        <div class="text-sm font-semibold line-clamp-1">
                            {{ currentUser.first_name + ' ' + currentUser.last_name }}
                        </div>
                        <div class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{ currentUser.email }}
                        </div>
                    </div>
                </div>
                <div
                    class="border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-200">
                    {{ $t('common.online') }}
                </div>
            </div>

            <div
                class="my-2 border border-gray-100 dark:border-gray-800 rounded-lg p-1.5 flex items-center justify-between gap-2">
                <div class="flex flex-col gap-1">
                    <div class="text-xs text-gray-800 dark:text-gray-100 font-semibold">{{ $t('user.walletBalance') }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ walletBalance.toLocaleString() }}</div>
                </div>
                <div class="flex flex-col gap-1">
                    <div class="text-xs text-gray-800 dark:text-gray-100 font-semibold">{{ $t('user.points') }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ userScore.toLocaleString() }}</div>
                </div>
                <router-link :to="{ name: 'panel-index' }" @click="close"
                    class="flex flex-col gap-1 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-1 rounded">
                    <div class="text-xs text-gray-800 dark:text-gray-100 font-semibold">{{ $t('user.userPanel') }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        <svg aria-hidden="true" class="w-3 h-3 me-2" viewBox="0 0 22 31" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_user_panel)">
                                <path
                                    d="M5.50085 30.1242C8.53625 30.1242 10.9998 27.8749 10.9998 25.1035V20.0828H5.50085C2.46546 20.0828 0.00195312 22.332 0.00195312 25.1035C0.00195312 27.8749 2.46546 30.1242 5.50085 30.1242Z"
                                    fill="#A259FF" />
                                <path
                                    d="M0.00195312 15.062C0.00195312 12.2905 2.46546 10.0413 5.50085 10.0413H10.9998V20.0827H5.50085C2.46546 20.0827 0.00195312 17.8334 0.00195312 15.062Z"
                                    fill="#A259FF" />
                                <path
                                    d="M0.00195312 5.02048C0.00195312 2.24904 2.46546 -0.000244141 5.50085 -0.000244141H10.9998V10.0412H5.50085C2.46546 10.0412 0.00195312 7.79193 0.00195312 5.02048Z"
                                    fill="#A259FF" />
                                <path
                                    d="M11 -0.000244141H16.4989C19.5343 -0.000244141 21.9978 2.24904 21.9978 5.02048C21.9978 7.79193 19.5343 10.0412 16.4989 10.0412H11V-0.000244141Z"
                                    fill="#A259FF" />
                                <path
                                    d="M21.9978 15.062C21.9978 17.8334 19.5343 20.0827 16.4989 20.0827C13.4635 20.0827 11 17.8334 11 15.062C11 12.2905 13.4635 10.0413 16.4989 10.0413C19.5343 10.0413 21.9978 12.2905 21.9978 15.062Z"
                                    fill="#A259FF" />
                            </g>
                            <defs>
                                <clipPath id="clip0_user_panel">
                                    <rect width="22" height="30.1244" fill="white"
                                        transform="translate(0 -0.000244141)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </router-link>
            </div>

            <AccountMenuViewSwap :view="view">
            <div v-if="view === 'main'">
            <ul
                class="border border-gray-100 dark:border-gray-800 rounded-lg p-1.5 text-xs font-medium font-anjoman text-gray-600 dark:text-gray-200">
                <li>
                    <router-link :to="{ name: 'panel-profile' }" @click="close"
                        class="flex items-center ps-4 px-2 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="6" r="4" fill="currentColor" />
                            <ellipse cx="12" cy="17" rx="7" ry="4" fill="currentColor" />
                        </svg>
                        <span class="font-semibold">{{ $t('user.accountInfo') }}</span>
                    </router-link>
                </li>
                <hr class="my-0.5 ms-10 me-8 border-t border-gray-100 dark:border-gray-800 border-dashed" />
                <li>
                    <router-link :to="{ name: 'panel-courses' }" @click="close"
                        class="flex items-center ps-4 px-2 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.50989 2.00001H15.49C15.7225 1.99995 15.9007 1.99991 16.0565 2.01515C17.1643 2.12352 18.0711 2.78958 18.4556 3.68678H5.54428C5.92879 2.78958 6.83555 2.12352 7.94337 2.01515C8.09917 1.99991 8.27741 1.99995 8.50989 2.00001Z"
                                class="fill-current" />
                            <path
                                d="M6.31052 4.72312C4.91989 4.72312 3.77963 5.56287 3.3991 6.67691C3.39117 6.70013 3.38356 6.72348 3.37629 6.74693C3.77444 6.62636 4.18881 6.54759 4.60827 6.49382C5.68865 6.35531 7.05399 6.35538 8.64002 6.35547H15.5321C17.1181 6.35538 18.4835 6.35531 19.5639 6.49382C19.9833 6.54759 20.3977 6.62636 20.7958 6.74693C20.7886 6.72348 20.781 6.70013 20.773 6.67691C20.3925 5.56287 19.2522 4.72312 17.8616 4.72312H6.31052Z"
                                class="fill-current" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M15.3276 7.54204H8.67239C5.29758 7.54204 3.61017 7.54204 2.66232 8.52887C1.71447 9.5157 1.93748 11.0403 2.38351 14.0896L2.80648 16.9811C3.15626 19.3724 3.33115 20.568 4.22834 21.284C5.12553 22 6.4488 22 9.09534 22H14.9046C17.5512 22 18.8745 22 19.7717 21.284C20.6689 20.568 20.8437 19.3724 21.1935 16.9811L21.6165 14.0896C22.0625 11.0404 22.2855 9.51569 21.3377 8.52887C20.3898 7.54204 18.7024 7.54204 15.3276 7.54204ZM14.5812 15.7942C15.1396 15.4481 15.1396 14.5519 14.5812 14.2058L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9099V17.0901C10 17.7829 10.6669 18.2208 11.2096 17.8844L14.5812 15.7942Z"
                                class="fill-current" />
                        </svg>
                        <span class="font-semibold">{{ $t('panel.courses') }}</span>
                    </router-link>
                </li>
                <hr class="my-0.5 ms-10 me-8 border-t border-gray-100 dark:border-gray-800 border-dashed" />
                <li>
                    <router-link :to="{ name: 'panel-financial' }" @click="close"
                        class="flex items-center ps-4 px-2 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M20.4105 9.86058C20.3559 9.8571 20.2964 9.85712 20.2348 9.85715L20.2194 9.85715H17.8015C15.8086 9.85715 14.1033 11.4382 14.1033 13.5C14.1033 15.5618 15.8086 17.1429 17.8015 17.1429H20.2194L20.2348 17.1429C20.2964 17.1429 20.3559 17.1429 20.4105 17.1394C21.22 17.0879 21.9359 16.4495 21.9961 15.5577C22.0001 15.4992 22 15.4362 22 15.3778L22 15.3619V11.6381L22 11.6222C22 11.5638 22.0001 11.5008 21.9961 11.4423C21.9359 10.5506 21.22 9.91209 20.4105 9.86058ZM17.5872 14.4714C18.1002 14.4714 18.5162 14.0365 18.5162 13.5C18.5162 12.9635 18.1002 12.5286 17.5872 12.5286C17.0741 12.5286 16.6581 12.9635 16.6581 13.5C16.6581 14.0365 17.0741 14.4714 17.5872 14.4714Z"
                                class="fill-current" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M20.2341 18.6C20.3778 18.5963 20.4866 18.7304 20.4476 18.8699C20.2541 19.562 19.947 20.1518 19.4542 20.6485C18.7329 21.3755 17.8183 21.6981 16.6882 21.8512C15.5902 22 14.1872 22 12.4158 22H10.3794C8.60803 22 7.20501 22 6.10697 21.8512C4.97692 21.6981 4.06227 21.3755 3.34096 20.6485C2.61964 19.9215 2.29953 18.9997 2.1476 17.8608C1.99997 16.7541 1.99999 15.3401 2 13.5548V13.4452C1.99998 11.6599 1.99997 10.2459 2.1476 9.13924C2.29953 8.00031 2.61964 7.07848 3.34096 6.35149C4.06227 5.62451 4.97692 5.30188 6.10697 5.14876C7.205 4.99997 8.60802 4.99999 10.3794 5L12.4158 5C14.1872 4.99998 15.5902 4.99997 16.6882 5.14876C17.8183 5.30188 18.7329 5.62451 19.4542 6.35149C19.947 6.84817 20.2541 7.43804 20.4476 8.13012C20.4866 8.26959 20.3778 8.40376 20.2341 8.4L17.8015 8.40001C15.0673 8.40001 12.6575 10.5769 12.6575 13.5C12.6575 16.4231 15.0673 18.6 17.8015 18.6L20.2341 18.6ZM5.61446 8.88572C5.21522 8.88572 4.89157 9.21191 4.89157 9.61429C4.89157 10.0167 5.21522 10.3429 5.61446 10.3429H9.46988C9.86912 10.3429 10.1928 10.0167 10.1928 9.61429C10.1928 9.21191 9.86912 8.88572 9.46988 8.88572H5.61446Z"
                                class="fill-current" />
                            <path
                                d="M7.77668 4.02439L9.73549 2.58126C10.7874 1.80625 12.2126 1.80625 13.2645 2.58126L15.2336 4.03197C14.4103 3.99995 13.4909 3.99998 12.4829 4H10.3123C9.39123 3.99998 8.5441 3.99996 7.77668 4.02439Z"
                                class="fill-current" />
                        </svg>
                        <span class="font-semibold">{{ $t('panel.financialTransactions') }}</span>
                    </router-link>
                </li>
                <hr class="my-0.5 ms-10 me-8 border-t border-gray-100 dark:border-gray-800 border-dashed" />
                <li>
                    <router-link :to="{ name: 'panel-questions' }" @click="close"
                        class="flex items-center ps-4 px-2 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                class="fill-current" />
                        </svg>
                        <span class="font-semibold">{{ $t('panel.questions') }}</span>
                    </router-link>
                </li>
                <hr class="my-0.5 ms-10 me-8 border-t border-gray-100 dark:border-gray-800 border-dashed" />
                <li>
                    <router-link :to="{ name: 'panel-missions' }" @click="close"
                        class="flex items-center ps-4 px-2 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.9873,5.73973 C13.5921,5.39577 14,4.74552 14,4 C14,2.89543 13.1046,2 12,2 C10.8954,2 10,2.89543 10,4 C10,4.7472 10.4097,5.39869 11.0168,5.74205 L11.0078,5.76034 C10.3521,7.12693 9.44232,9.08475 8.03664,9.81975 C6.88336,10.4228 5.22628,10.1194 3.99634,9.8944 C3.94215,9.11525 3.29293,8.5 2.5,8.5 C1.67157,8.5 1,9.17157 1,10 C1,10.7347 1.52815,11.346 2.22548,11.4749 L5.17264,19.0836 C5.62005,20.2387 6.7314,21 7.97011,21 L16.0299,21 C17.2686,21 18.3799,20.2387 18.8274,19.0836 L21.7745,11.4749 C22.4718,11.346 23,10.7347 23,10 C23,9.17157 22.3284,8.5 21.5,8.5 C20.7223,8.5 20.0828,9.09186 20.0074,9.84973 C18.7483,10.013 17.1251,10.2213 15.9634,9.61387 C14.5859,8.89364 13.6634,7.07077 12.9873,5.73973 Z"
                                class="fill-current" />
                        </svg>
                        <span class="font-semibold">{{ $t('panel.missions') }}</span>
                    </router-link>
                </li>
            </ul>

            <AccountMenuTriggers class="mt-2" accent="amber" @open="view = $event" />
            </div>

            <AccountMenuOptions v-else :view="view" accent="amber" @back="view = 'main'" />
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
.admin-panel-entry__glow {
    background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.28), transparent 55%);
    animation: menu-entry-glow 3s ease-in-out infinite;
}

.admin-panel-entry__shimmer {
    background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.22) 45%, transparent 65%);
    transform: translateX(-120%);
    animation: menu-entry-shimmer 2.8s ease-in-out infinite;
}

@keyframes menu-entry-glow {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.85; }
}

@keyframes menu-entry-shimmer {
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
