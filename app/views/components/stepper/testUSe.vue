<template>
    <div class="w-full max-w-screen-xl mx-auto p-2 md:p-4">
        <VerticalStepper :multiple="false" :defaultOpened="[0]" class="max-w-xl">
            <StepItem :isLast="false">
                <template #header>
                    <div class="text-sm font-semibold">header step 1</div>
                </template>
                <template #content>
                    <div class="h-48 bg-white dark:bg-gray-900/50 text-gray-500 border-2 border-gray-200 dark:border-gray-700 border-dashed font-semibold rounded-xl p-4 flex items-center justify-center">content step 1</div>
                </template>
                <template #buttons="{ next }">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <button @click.prevent="next" class="group relative inline-flex h-[calc(32px+8px)] items-center justify-center rounded-xl bg-neutral-950 py-1 ps-6 pe-14 text-sm font-semibold text-neutral-50">
                            <span class="z-10 pr-2">بعدی</span>
                            <div class="absolute end-1 inline-flex h-8 w-8 items-center justify-end rounded-lg bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                                <div class="me-2 flex items-center justify-center">
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-50 rtl:rotate-180"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </div>
                            </div>
                        </button>
                    </div>
                </template>
            </StepItem>

            <StepItem :isLast="false">
                <template #header>
                    <div class="text-sm font-semibold">header step 2</div>
                </template>
                <template #content>
                    <div class="h-48 bg-white dark:bg-gray-900/50 text-gray-500 border-2 border-gray-200 dark:border-gray-700 border-dashed font-semibold rounded-xl p-4 flex items-center justify-center">content step 2</div>
                </template>
                <template #buttons="{ next, prev }">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <button @click.prevent="prev" class="group relative inline-flex h-[calc(32px+8px)] items-center justify-center rounded-xl bg-neutral-950 py-1 pe-6 ps-14 text-sm font-semibold text-neutral-50">
                            <span class="z-10 ps-2">قبلی</span>
                            <div class="absolute start-1 inline-flex h-8 w-8 items-center justify-start rounded-lg bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                                <div class="ms-2 flex items-center justify-center">
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-50 ltr:rotate-180"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </div>
                            </div>
                        </button>
                        <button @click.prevent="next" class="group relative inline-flex h-[calc(32px+8px)] items-center justify-center rounded-xl bg-neutral-950 py-1 ps-6 pe-14 text-sm font-semibold text-neutral-50">
                            <span class="z-10 pr-2">بعدی</span>
                            <div class="absolute end-1 inline-flex h-8 w-8 items-center justify-end rounded-lg bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                                <div class="me-2 flex items-center justify-center">
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-50 rtl:rotate-180"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </div>
                            </div>
                        </button>
                    </div>
                </template>
            </StepItem>

            <StepItem :isLast="true">
                <template #header>
                    <div class="text-sm font-semibold">header step 3</div>
                </template>
                <template #content>
                    <div class="h-48 bg-white dark:bg-gray-900/50 text-gray-500 border-2 border-gray-200 dark:border-gray-700 border-dashed font-semibold rounded-xl p-4 flex items-center justify-center">content step 3</div>
                </template>
                <template #buttons="{ prev }">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <button @click.prevent="prev" class="group relative text-sm font-semibold inline-flex h-[calc(32px+8px)] items-center justify-center rounded-xl bg-neutral-950 py-1 pe-6 ps-14 text-neutral-50">
                            <span class="z-10 ps-2">قبلی</span>
                            <div class="absolute start-1 inline-flex h-8 w-8 items-center justify-start rounded-lg bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                                <div class="ms-2 flex items-center justify-center">
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-neutral-50 ltr:rotate-180"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </div>
                            </div>
                        </button>
                        <button class="relative overflow-hidden rounded-xl h-10 bg-yellow-400 text-sm font-semibold px-5 flex items-center justify-center text-gray-800 duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90">ثبت نهایی</button>
                    </div>
                </template>
            </StepItem>
        </VerticalStepper>
    </div>
</template>
<script>
import VerticalStepper from "@/views/components/stepper/VerticalStepper.vue";
import StepItem from "@/views/components/stepper/StepItem.vue";
export default {
    components: {
        VerticalStepper,
        StepItem,
    },
    data() {
        return {};
    },
    methods: {
        async submit() {},
    },
};
</script>
<style scoped></style>
