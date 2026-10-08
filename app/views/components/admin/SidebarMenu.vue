<template>
    <div class="">
        <div class="py-1 md:py-4 lg:bg-gray-100/50 lg:dark:bg-gray-800/40 max-w-[15rem] mx-auto space-y-2 lg:space-y-[1rem] lg:px-2 text-xs lg:text-[15px] font-medium">
            <div v-for="menuItem in menuItemsWithBadges" :key="menuItem.key" class="text-gray-800 dark:text-white dark:hover:text-yellow-400 hover:text-black">
                <Disclosure v-if="menuItem.submenu && menuItem.submenu.length > 0" :default-open="menuItem.submenu?.some((sub) => $route.name === sub.link)" v-slot="{ open }">
                    <DisclosureButton class="flex justify-between w-full p-2 group">
                        <div class="flex items-center">
                            <span v-html="menuItem.icon" class="w-[1.1rem] h-[1.1rem] me-3"></span>
                            <span>{{ menuItem.title }}</span>
                        </div>
                        <svg v-if="!open" class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12H18M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </DisclosureButton>
                    <DisclosurePanel class="my-2 space-y-3 ms-4 ps-6 border-s border-gray-300 dark:border-gray-600 lg:text-[13px] font-normal">
                        <router-link v-for="sub in menuItem.submenu" :key="sub.key" :to="sub.link ? { name: sub.link } : '#'" class="flex items-center justify-between text-gray-800 dark:text-white dark:hover:text-yellow-400 hover:text-yellow-400" :data-active="$route.name == sub.link" :data-route-name="sub.link">
                            <div class="flex items-center">
                                <i class="w-1 h-1 bg-current me-8 -ms-[1.65rem] rounded-full" :class="{ 'text-black dark:text-amber-400 font-semibold': $route.name == sub.link }"></i>
                                <span :class="{ 'font-bold lg:text-[14px] text-black dark:text-amber-400': $route.name == sub.link }">{{ sub.title }}</span>
                            </div>
                            <span v-if="sub.badge && sub.badge > 0" class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">{{ sub.badge }}</span>
                        </router-link>
                    </DisclosurePanel>
                </Disclosure>
                <router-link v-if="!menuItem.submenu || menuItem.submenu.length === 0" :to="menuItem.link ? { name: menuItem.link } : '#'" class="flex items-center w-full p-2 text-gray-800 dark:text-white dark:hover:text-yellow-400 hover:text-yellow-400" :data-active="$route.name == menuItem.link" :data-route-name="menuItem.link">
                    <span v-html="menuItem.icon" class="w-5 h-5 me-3"></span>
                    <span :class="{ 'text-black dark:text-amber-400 font-bold': $route.name == menuItem.link }">{{ menuItem.title }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ADMIN_MENU_ITEMS } from "@/config/adminMenuItems";
import { filterAdminMenuByPermission } from "@/utils/adminMenu";

export default {
    components: {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
    },
    computed: {
        unapprovedCommentsCount() {
            return this.$store.getters['adminComments/unapprovedCommentsCount'];
        },
        user() {
            return this.$store.state.auth.status.userInfo;
        },
        visibleMenuItems() {
            return filterAdminMenuByPermission(this.user, this.menuItems);
        },
        menuItemsWithBadges() {
            return this.visibleMenuItems.map(item => {
                if (item.submenu) {
                    return {
                        ...item,
                        submenu: item.submenu.map(sub => {
                            if (sub.key === 'comments') {
                                return {
                                    ...sub,
                                    badge: this.unapprovedCommentsCount > 0 ? this.unapprovedCommentsCount : null
                                };
                            }
                            return sub;
                        })
                    };
                }
                return item;
            });
        }
    },
    data() {
        return {
            menuItems: ADMIN_MENU_ITEMS,
        };
    },
    methods: {
        logout() {
            this.$store.dispatch("auth/logout");
            this.$router.push("/");
        },
        scrollToActiveItem() {
            this.$nextTick(() => {
                // Find the active menu item using data attributes
                const activeElement = this.$el.querySelector('[data-active="true"]');
                
                if (activeElement) {
                    // Find the scrollable parent container
                    let scrollableContainer = activeElement.parentElement;
                    while (scrollableContainer && scrollableContainer !== document.body) {
                        const style = window.getComputedStyle(scrollableContainer);
                        if (style.overflow === 'auto' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflowY === 'scroll') {
                            break;
                        }
                        scrollableContainer = scrollableContainer.parentElement;
                    }
                    
                    if (scrollableContainer && scrollableContainer !== document.body) {
                        // Calculate the position relative to the scrollable container
                        const containerRect = scrollableContainer.getBoundingClientRect();
                        const elementRect = activeElement.getBoundingClientRect();
                        const scrollTop = scrollableContainer.scrollTop;
                        const elementTop = elementRect.top - containerRect.top + scrollTop;
                        
                        // Scroll to center the element
                        const scrollPosition = elementTop - (containerRect.height / 2) + (elementRect.height / 2);
                        
                        scrollableContainer.scrollTo({
                            top: Math.max(0, scrollPosition),
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback to scrollIntoView
                        activeElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                }
            });
        },
    },
    watch: {
        '$route'() {
            this.scrollToActiveItem();
        },
    },
    mounted() {
        this.scrollToActiveItem();
        // Fetch unapproved comments count from Vuex
        this.$store.dispatch('adminComments/fetchUnapprovedCommentsCount');
    },
};
</script>

<style></style>
