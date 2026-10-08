<template>
    <div :class="[
        'rounded-lg p-2 md:p-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 relative',
        !isRoot ? 'child-line' : '',
        isLast ? 'last-child' : ''
    ]">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="shrink-0">
                    <!-- for checkbox -->
                </div>
                <div
                    class="shrink-0 w-12 h-8 rounded-lg overflow-hidden bg-gray-200/40 dark:bg-gray-600 border-2 border-gray-200 dark:border-opacity-20">
                    <img onerror="this.style.display='none'" v-if="category.icon" class="w-full h-full object-cover hover:scale-105 duration-150"
                        :src="category.icon" :alt="category.title" />
                    <div v-else class="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-300">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-current"
                                d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z">
                            </path>
                        </svg>
                    </div>
                </div>
                <div class="ms-2 text-gray-700 dark:text-gray-100 text-sm font-semibold line-clamp-1"
                    :title="category.title">{{ category.title }}</div>
            </div>
            <div class="ms-2 flex items-center space-x-1 rtl:space-x-reverse">
                <div class="whitespace-nowrap">
                    <div
                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z"
                                fill="currentColor"></path>
                            <path opacity="0.4"
                                d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z"
                                fill="currentColor"></path>
                            <path opacity="0.7"
                                d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z"
                                fill="currentColor"></path>
                        </svg>
                        {{ category.courses_count }} دوره
                    </div>
                </div>
                <div class="whitespace-nowrap">
                    <div v-if="category.status"
                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </svg>
                        فعال
                    </div>
                    <div v-else
                        class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <svg class="w-4 h-4 me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </svg>
                        غیرفعال
                    </div>
                </div>
                <div class="shrink-0">
                    <Popover class="group relative" v-slot="{ close }">
                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                        <PopoverButton
                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none  flex items-center justify-center">
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path data-v-10f166d7=""
                                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0">
                                </path>
                            </svg>
                        </PopoverButton>
                        <transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                            <PopoverPanel
                                class="text-start flex flex-col z-30 mt-3 end-2 absolute p-2 bg-white rounded-lg shadow w-max min-w-[8rem] dark:bg-gray-900 dark:divide-gray-800">
                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                    <li>
                                        <router-link
                                            :to="{ name: 'admin-category-create', query: { parent: category.slug } }"
                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">افزودن
                                            زیر دسته</router-link>
                                    </li>
                                    <li>
                                        <button type="button" @click="() => { callParentDelete(category.id); close(); }"
                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</button>
                                    </li>
                                    <li>
                                        <router-link
                                            :to="{ name: 'admin-category-edit', params: { categorySlug: category.slug } }"
                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش</router-link>
                                    </li>
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">جزئیات</a>
                                    </li>
                                </ul>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </div>
            </div>
        </div>
        <hr class="border-t border-gray-200 border-dashed dark:border-opacity-10 my-1.5">
        <div class="flex items-center justify-between">
            <div class="p-1 rounded-md bg-gray-200/10 dark:bg-gray-800/60 w-full">
                <div class="text-gray-400 dark:text-gray-500 text-xs font-light line-clamp-1"
                    :title="category.description">
                    {{ category.description }}
                </div>
            </div>
            <div class="ms-3 whitespace-nowrap">
                <div v-if="category.assignment_type == 'manual'"
                    class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                    <svg class="w-3 h-3 me-2" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 328.862 328.862">
                        <path
                            d="M281.103,30h-15V15c0-8.284-6.716-15-15-15s-15,6.716-15,15v15h-15c-8.284,0-15,6.716-15,15 c0,8.284,6.716,15,15,15h15v15c0,8.284,6.716,15,15,15s15-6.716,15-15V60h15c8.284,0,15-6.716,15-15 C296.103,36.716,289.387,30,281.103,30z">
                        </path>
                        <path
                            d="M251.217,195.25L56.286,69.063c-4.609-2.984-10.48-3.21-15.308-0.591c-4.826,2.62-7.835,7.667-7.844,13.158 l-0.375,232.206c-0.01,6.371,4.006,12.054,10.016,14.172c1.633,0.576,3.315,0.854,4.981,0.854c4.464,0,8.802-1.997,11.704-5.617 l71.455-89.101l113.645-11.378c6.34-0.635,11.587-5.206,13.085-11.398C259.143,205.176,256.566,198.712,251.217,195.25z">
                        </path>
                    </svg>
                    دستی
                </div>
                <div v-else
                    class="whitespace-nowrap flex items-center text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                    <svg class="w-3 h-3 me-2" fill="currentColor" viewBox="0 0 24 24" role="img"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 6.768v.002-1.237c-.485.033-.754.293-.99.71L5.87 16.72h2.464l-.753-.96.654-1.363.005.007L12 6.774v-.006zM10.526 13.123h2.946L12 10.076M8.233 14.416h.017l-.01-.013M13.473 13.123v.002M21.496 5.066L13.26.308c-.693-.4-1.827-.4-2.52 0L2.504 5.066c-.693.398-1.26 1.38-1.26 2.182v9.507c0 .802.567 1.782 1.26 2.18l8.236 4.757c.693.4 1.826.4 2.52 0l8.235-4.768c.692-.39 1.26-1.38 1.26-2.174V7.246c0-.8-.567-1.78-1.26-2.18zm-6.066 12.05l-.687-1.384h-5.5l-.673 1.384H5.287l5.396-11.033c.305-.607.777-.9 1.317-.9s1.034.328 1.316.89l5.396 11.043H15.43zM12 6.77V9.244l2.518 5.173H8.25l.758.94h5.972l.674 1.35h2.474l-1.708-.99v.04L12 6.77">
                        </path>
                    </svg>
                    خودکار
                </div>
            </div>
        </div>
    </div>
    <div v-if="category.children && category.children.length" class="mt-2 ms-5 space-y-2 relative child"
        ref="childContainer">
        <CategoryItem v-for="(child, index) in category.children" :key="child.id" :category="child"
            :is-last="index === category.children.length - 1" />
    </div>
</template>

<script>
import { inject } from 'vue';
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
export default {
    name: 'CategoryItem',
    components: {
        Popover, PopoverButton, PopoverPanel, PopoverOverlay
    },
    props: {
        category: {
            type: Object,
            required: true,
        },
        isLast: {
            type: Boolean,
            default: false,
        },
        isRoot: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        callParentDelete(value) {
            this.deleteCategory(value);
        }
    },
    created() {
        this.deleteCategory = inject('deleteCategory');
    },
    mounted() {
        if (this.isLast && this.$refs.childContainer) {
            const height = this.$refs.childContainer.offsetHeight;
            this.$refs.childContainer.style.setProperty('--child-height', `${height}px`);
        }
    },
};
</script>

<style scoped>
.child::before {
    display: block;
    content: '';
    position: absolute;
    top: -0.5rem;
    left: -0.7rem;
    width: 2px;
    height: 100%;
    background-color: #d1d5db;
    /* gray-300 */
}

.child-line::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -0.7rem;
    width: 0.71rem;
    height: 2px;
    background-color: #d1d5db;
    transform: translateY(-50%);
}

.dark .child::before,
.dark .child-line::before {
    background-color: #374151;
    /* gray-700 */
}

:dir(rtl) .child::before {
    left: auto;
    right: -0.7rem;
}

:dir(rtl) .child-line::before {
    left: auto;
    right: -0.7rem;
}


.last-child::after {
    content: "";
    display: block;
    position: absolute;
    left: -0.7rem;
    top: calc(50% + 10px);
    width: 2px;
    height: var(--child-height);
    background: #f3f4f6;
}

:dir(rtl) .last-child::after {
    left: auto;
    right: -0.7rem;
}

.dark .last-child::after {
    background: #1f2937;
}
</style>
