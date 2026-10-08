<script setup>
import axiosInstance from '@/store/axiosInstance'
import TypewriterText from '@/views/components/common/TypewriterText.vue'

definePageMeta({
  name: 'home',
})

const { data: ssrHomeData } = await useAsyncData('index-home', async () => {
  try {
    const { data } = await axiosInstance.get('/index/home')
    return data || null
  } catch {
    return null
  }
})

provide('ssrHomeData', ssrHomeData)
</script>

<template>
        <div class="mx-auto max-w-screen-xl px-2 space-y-32 pb-16">
            <section class="bg-white dark:bg-gray-900 my-10 md:my-20 rounded-xl">
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div class="mr-auto place-self-center lg:col-span-7">
                        <ClientOnly>
                            <TypewriterText tag="h1"
                                class="max-w-2xl mb-4 text-center ltr:md:text-left rtl:md:text-right text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl text-gray-800 dark:text-white"
                                :text="`${$t('index.heroTitle')}!`" :speed="25" :repeat="true" :repeat-after="5000"
                                :show-cursor="true" cursor-color="#facc15" :cursor-width="3" :cursor-blink-speed="700" />
                            <template #fallback>
                                <h1
                                    class="max-w-2xl mb-4 text-center ltr:md:text-left rtl:md:text-right text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl text-gray-800 dark:text-white">
                                    {{ $t('index.heroTitle') }}!
                                </h1>
                            </template>
                        </ClientOnly>
                        <p
                            class="max-w-2xl mb-6 text-center ltr:md:text-left rtl:md:text-right font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                            {{ $t(`index.heroDesc`) }}
                        </p>
                        <NuxtLink :to="{ name: 'courses' }"
                            class="inline-flex items-center justify-center px-5 py-2 mr-3 text-base font-medium text-center text-black rounded-lg bg-yellow-400 hover:bg-opacity-90 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900">
                            {{ $t("index.heroCta") }}
                            <svg class="w-5 h-5 ltr:ml-2 rtl:mr-2" viewBox="0 0 23 23" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02974C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.0055 17.7916 6.20842 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437ZM7.72959 9.23905C7.93266 8.99536 8.29484 8.96244 8.53853 9.16551L10.5279 10.8233C11.2627 11.4357 11.2627 12.5643 10.5279 13.1766L8.53853 14.8344C8.29484 15.0375 7.93266 15.0046 7.72959 14.7609C7.52651 14.5172 7.55943 14.155 7.80313 13.9519L9.7925 12.2941C9.9762 12.141 9.9762 11.8589 9.7925 11.7058L7.80313 10.048C7.55943 9.84493 7.52651 9.48275 7.72959 9.23905ZM12.4786 13.8188C12.1614 13.8188 11.9042 14.076 11.9042 14.3932C11.9042 14.7104 12.1614 14.9676 12.4786 14.9676H15.8291C16.1463 14.9676 16.4035 14.7104 16.4035 14.3932C16.4035 14.076 16.1463 13.8188 15.8291 13.8188H12.4786Z">
                                </path>
                            </svg>
                        </NuxtLink>
                    </div>
                    <div class="flex lg:mt-0 lg:col-span-5 items-center mt-8 md:mt-0">
                        <div class="hero-illustration w-full my-auto">
                            <svg class="hero-devices-svg w-full h-52 lg:h-60" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" data-name="Layer 1" width="1139.17088"
                                height="654.54324" viewBox="0 0 1139.17088 654.54324" aria-hidden="true">
                                <defs>
                                    <linearGradient id="heroScreenShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#fed700" />
                                        <stop offset="45%" stop-color="#ffe566" />
                                        <stop offset="55%" stop-color="#fff3a0" />
                                        <stop offset="100%" stop-color="#fed700" />
                                    </linearGradient>
                                </defs>
                                <g class="hero-decor">
                                    <circle cx="246.82682" cy="521.76476" r="59.24334" fill="#f2f2f2"
                                        class="hero-decor-circle" />
                                    <circle cx="256.45989" cy="513.095" r="59.24334" fill="#fed700"
                                        class="hero-decor-accent" />
                                    <rect x="304.17137" y="447.54324" width="732.99951" height="2" fill="#3f3d56" />
                                    <rect x="586.17137" y="32.54324" width="254.99951" height="2" fill="#3f3d56" />
                                    <rect x="406.17137" y="560.54324" width="732.99951" height="2" fill="#3f3d56" />
                                    <rect x="192.67161" y="652.54324" width="254.99951" height="2" fill="#3f3d56" />
                                    <rect x="471" y="550" width="28" height="28" fill="#fed700"
                                        class="hero-decor-square" />
                                    <path
                                        d="M546.41456,684.72838h-34v-34h34Zm-32.52174-1.47826H544.9363V652.20664H513.89282Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <rect x="796" y="22" width="28" height="28" fill="#fed700"
                                        class="hero-decor-square hero-decor-square--delay" />
                                    <path
                                        d="M871.41456,156.72838h-34v-34h34Zm-32.52174-1.47826H869.9363V124.20664H838.89282Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <rect x="1078" y="550" width="28" height="28" fill="#fed700"
                                        class="hero-decor-square hero-decor-square--delay2" />
                                    <path
                                        d="M1153.41456,684.72838h-34v-34h34Zm-32.52174-1.47826h31.04348V652.20664h-31.04348Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <path
                                        d="M350.58593,777.27162a87,87,0,1,1,87-87A87.09858,87.09858,0,0,1,350.58593,777.27162Zm0-172a85,85,0,1,0,85,85A85.09629,85.09629,0,0,0,350.58593,605.27162Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56"
                                        class="hero-decor-ring" />
                                    <path
                                        d="M980.58593,655.27162a55,55,0,1,1,55-55A55.06223,55.06223,0,0,1,980.58593,655.27162Zm0-108a53,53,0,1,0,53,53A53.05963,53.05963,0,0,0,980.58593,547.27162Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56"
                                        class="hero-decor-ring hero-decor-ring--delay" />
                                </g>
                                <g class="hero-laptop">
                                    <path
                                        d="M714.20735,141.38055H454.03775v-5.36232h-117.971v5.36232H74.82467a17.5985,17.5985,0,0,0-17.59852,17.59851V515.23125a17.59856,17.59856,0,0,0,17.59852,17.59858H714.20735a17.59856,17.59856,0,0,0,17.59852-17.59858V158.97906A17.5985,17.5985,0,0,0,714.20735,141.38055Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <rect class="hero-screen" x="50.4058" y="49.75362" width="627.3913"
                                        height="353.91304" fill="#fed700" />
                                    <circle cx="363.56522" cy="33.66667" r="6.43478" fill="#fed700"
                                        class="hero-screen-dot" />
                                    <polygon points="498.374 403.667 50.406 403.667 50.406 49.754 498.374 403.667"
                                        opacity="0.1" />
                                    <circle cx="148.57375" cy="316.87641" r="60.3068" fill="#f2f2f2" />
                                    <rect x="509.95272" y="240.62175" width="58.6052" height="12.24586"
                                        fill="#3f3d56" />
                                    <rect class="hero-code-line" x="439.10165" y="145.27896" width="200.30733"
                                        height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--2" x="439.10165" y="161.89834"
                                        width="200.30733" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--3" x="439.10165" y="178.51773"
                                        width="200.30733" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--4" x="439.10165" y="195.13711"
                                        width="200.30733" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--5" x="439.10165" y="211.7565"
                                        width="200.30733" height="5.24823" fill="#3f3d56" />
                                    <rect x="614.91726" y="56.9338" width="24.49173" height="24.49173" fill="#f2f2f2" />
                                    <path
                                        d="M681.1947,215.52507h-29.74v-29.74h29.74Zm-28.44691-1.293h27.15387V187.07816H652.74779Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <path
                                        d="M749.42165,519.96024H688.19234v-4.41153a.87468.87468,0,0,0-.87471-.87471h-20.9929a.87468.87468,0,0,0-.87471.87471v4.41153H652.32945v-4.41153a.87467.87467,0,0,0-.8747-.87471H630.46184a.87468.87468,0,0,0-.8747.87471v4.41153H616.46657v-4.41153a.87468.87468,0,0,0-.8747-.87471H594.599a.87468.87468,0,0,0-.87471.87471v4.41153H580.60369v-4.41153a.87468.87468,0,0,0-.87471-.87471H558.73607a.87468.87468,0,0,0-.8747.87471v4.41153H544.7408v-4.41153a.87468.87468,0,0,0-.8747-.87471H522.87319a.87467.87467,0,0,0-.8747.87471v4.41153H508.87792v-4.41153a.87468.87468,0,0,0-.87471-.87471h-20.9929a.87468.87468,0,0,0-.87471.87471v4.41153H473.015v-4.41153a.87468.87468,0,0,0-.8747-.87471H307.69588a.87468.87468,0,0,0-.8747.87471v4.41153H293.70061v-4.41153a.87468.87468,0,0,0-.8747-.87471H271.833a.87467.87467,0,0,0-.8747.87471v4.41153H257.83773v-4.41153a.87468.87468,0,0,0-.87471-.87471h-20.9929a.87468.87468,0,0,0-.87471.87471v4.41153H221.97484v-4.41153a.87467.87467,0,0,0-.8747-.87471H200.10723a.87468.87468,0,0,0-.8747.87471v4.41153H186.112v-4.41153a.87468.87468,0,0,0-.8747-.87471H164.24435a.87468.87468,0,0,0-.87471.87471v4.41153H150.24908v-4.41153a.87468.87468,0,0,0-.87471-.87471H128.38146a.87468.87468,0,0,0-.8747.87471v4.41153H114.38619v-4.41153a.87468.87468,0,0,0-.8747-.87471H92.51858a.87467.87467,0,0,0-.8747.87471v4.41153H51.40747a20.99293,20.99293,0,0,0-20.99291,20.99291v9.4925A20.99291,20.99291,0,0,0,51.40747,571.4385H749.42165a20.9929,20.9929,0,0,0,20.99291-20.99285v-9.4925A20.99292,20.99292,0,0,0,749.42165,519.96024Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <path
                                        d="M193.58593,477.27162a76,76,0,1,1,76-76A76.08614,76.08614,0,0,1,193.58593,477.27162Zm0-150a74,74,0,1,0,74,74A74.08385,74.08385,0,0,0,193.58593,327.27162Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                </g>
                                <g class="hero-phone">
                                    <path
                                        d="M1087.58593,354.6866h-2.37862V289.525a37.71374,37.71374,0,0,0-37.71385-37.71377H909.44A37.71373,37.71373,0,0,0,871.72613,289.525V647.00639A37.71374,37.71374,0,0,0,909.44,684.72017h138.05348a37.71374,37.71374,0,0,0,37.71385-37.71378V401.06969h2.37862Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <path class="hero-screen hero-screen--phone"
                                        d="M1077.176,291.74159v356.96a28.16523,28.16523,0,0,1-28.16016,28.17H910.296a28.16511,28.16511,0,0,1-28.16-28.17v-356.96a28.163,28.163,0,0,1,28.16-28.16h16.83a13.3792,13.3792,0,0,0,12.39,18.43h79.09a13.37908,13.37908,0,0,0,12.38995-18.43h18.02A28.16308,28.16308,0,0,1,1077.176,291.74159Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#fed700" />
                                    <rect x="928.57968" y="376.21769" width="41.32357" height="12.24586"
                                        fill="#3f3d56" />
                                    <rect class="hero-code-line" x="878.62133" y="280.8749" width="141.24028"
                                        height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--2" x="878.62133" y="297.49429"
                                        width="141.24028" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--3" x="878.62133" y="314.11367"
                                        width="141.24028" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--4" x="878.62133" y="330.73306"
                                        width="141.24028" height="5.24823" fill="#3f3d56" />
                                    <rect class="hero-code-line hero-code-line--5" x="878.62133" y="347.35244"
                                        width="141.24028" height="5.24823" fill="#3f3d56" />
                                    <rect x="929.68352" y="211.17873" width="24.49173" height="24.49173"
                                        fill="#f2f2f2" />
                                    <path d="M969.47386,340.03163v29.74h29.74v-29.74Zm28.45,28.45h-27.16v-27.16h27.16Z"
                                        transform="translate(-30.41456 -122.72838)" fill="#3f3d56" />
                                    <path
                                        d="M1077.176,610.58162v38.12a28.16523,28.16523,0,0,1-28.16016,28.17H910.296a28.16511,28.16511,0,0,1-28.16-28.17v-192.21l116.87,92.33,2,1.58,21.74,17.17,2.03,1.61Z"
                                        transform="translate(-30.41456 -122.72838)" opacity="0.1" />
                                    <circle cx="937.24147" cy="498.70691" r="43.86783" fill="#f2f2f2" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <HomeStatsSection :stats="stats" :loading="homeLoading" />



            <!-- <section class="container mx-auto px-4 space-y-6 bg-slate-50 py-8 md:py-12 lg:py-20">

                <div class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">

                    <h2 class="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>

                    <p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        The product can personalize user experiences by understanding individual preferences and
                        tailoring
                        recommendations or content based on user behavior and historical data.
                    </p>

                </div>

                <div class="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current">
                                <path
                                    d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z">
                                </path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">Next.js 13</h3>
                                <p class="text-sm text-muted-foreground">App dir, Routing, Layouts, Loading UI and API
                                    routes.</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current">
                                <path
                                    d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 0 0-3.107-.534A23.892 23.892 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z">
                                </path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">React 18</h3>
                                <p class="text-sm">Server and Client Components. Use hook.</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current">
                                <path
                                    d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z">
                                </path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">Database</h3>
                                <p class="text-sm text-muted-foreground">ORM using Prisma and deployed on PlanetScale.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current">
                                <path
                                    d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z">
                                </path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">Components</h3>
                                <p class="text-sm text-muted-foreground">UI components built using Radix UI and styled
                                    with Tailwind
                                    CSS.</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                class="h-12 w-12 fill-current">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">Authentication</h3>
                                <p class="text-sm text-muted-foreground">Authentication using NextAuth.js and
                                    middlewares.</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-lg border bg-white select-none hover:shadow hover:shadow-teal-200 p-2">
                        <div class="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current">
                                <path
                                    d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z">
                                </path>
                            </svg>
                            <div class="space-y-2">
                                <h3 class="font-bold">Subscriptions</h3>
                                <p class="text-sm text-muted-foreground">Free and paid subscriptions using Stripe.</p>
                            </div>
                        </div>
                    </div>

                </div>

            </section> -->



            <!-- start latest courses -->
            <section v-if="latestCourses && latestCourses.length > 0" class="">
                <div class="mx-auto max-w-screen-xl px-2">
                    <div class="flex lg:flex-row flex-col">
                        <div class="lg:w-2/6 w-full lg:my-6 mb-10 lg:text-start text-center">
                            <h3 class="dark:text-white text-gray-700 font-extrabold text-3xl mb-3">{{
                                $t('index.latestCourses') }}</h3>
                            <p class="font-light dark:text-gray-400 text-gray-600 mb-3 lg:max-w-xs">
                                {{ $t('index.latestCoursesDesc') }}
                            </p>
                            <div class="flex items-center lg:justify-start justify-center gap-5 lg:mt-4">
                                <NuxtLink :to="{ name: 'courses' }"
                                    class="lg:w-auto w-40 lg:me-6 lg:mb-0 bg-yellow-400 rounded-lg py-2 px-4 font-medium text-gray-800 text-sm hover:bg-opacity-80 dark:hover:bg-opacity-80">
                                    {{ $t('index.viewAllCourses') }} </NuxtLink>
                                <div class="swiper-navigation gap-3 items-center justify-center flex">
                                    <button type="button"
                                        class="custom-prev-lates-courses-swiper swiper-button-prev disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M7.12872 6.34863L2.5608 5.94466C1.53567 5.94466 0.704529 6.7839 0.704529 7.81901C0.704529 8.85412 1.53567 9.69336 2.5608 9.69336L7.12872 9.28938C7.93292 9.28938 8.58491 8.63105 8.58491 7.81901C8.58491 7.00561 7.93292 6.34863 7.12872 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M22.4681 6.42292C22.3967 6.35083 22.13 6.04614 21.8795 5.79314C20.4179 4.20852 16.6016 1.61734 14.6053 0.824345C14.3022 0.697847 13.5357 0.428528 13.1248 0.409485C12.7328 0.409485 12.3583 0.500618 12.0014 0.680164C11.5555 0.931801 11.1999 1.32898 11.0032 1.79689C10.8779 2.12061 10.6812 3.09315 10.6812 3.11084C10.4859 4.17315 10.3795 5.9006 10.3795 7.81032C10.3795 9.62754 10.4859 11.2843 10.6462 12.3643C10.6637 12.3833 10.8604 13.5898 11.0746 14.0033C11.4666 14.7596 12.2331 15.2275 13.0534 15.2275H13.1248C13.6596 15.2098 14.7831 14.7405 14.7831 14.7242C16.673 13.9312 20.399 11.4652 21.897 9.82613C21.897 9.82613 22.3199 9.40447 22.5031 9.14195C22.7887 8.76381 22.9315 8.29591 22.9315 7.828C22.9315 7.30568 22.7712 6.82009 22.4681 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button type="button"
                                        class="custom-next-lates-courses-swiper swiper-button-next disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            class="rotate-3 lg:w-4/6 lg:border-2 lg:border-white lg:dark:border-gray-700 lg:p-2 lg:rounded-xl lg:rounded-e-none lg:border-e-0 lg:rounded-s-none lg:border-s-0">
                            <swiper :grabCursor="true" :direction="'horizontal'" :slidesPerView="3" :spaceBetween="1"
                                :navigation="{
                                    prevEl: '.custom-prev-lates-courses-swiper',
                                    nextEl: '.custom-next-lates-courses-swiper',
                                }" :breakpoints="{
                                    '@0.00': {
                                        slidesPerView: 1.05,
                                        spaceBetween: 10,
                                    },
                                    '@0.25': {
                                        slidesPerView: 1.08,
                                        spaceBetween: 10,
                                    },
                                    '@0.50': {
                                        slidesPerView: 1.12,
                                        spaceBetween: 10,
                                    },
                                    '@0.75': {
                                        slidesPerView: 2.4,
                                        spaceBetween: 12,
                                    },
                                    '@1.00': {
                                        slidesPerView: 2.3,
                                        spaceBetween: 12,
                                    },
                                    '@1.25': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                    '@1.50': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                    '@1.75': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                }" :modules="modules" class="">
                                <swiper-slide v-for="(course, index) in latestCourses" :key="index" class="h-auto">
                                    <CourseCard2 class="" :course="course" />
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                </div>
            </section>
            <!-- end latest courses -->

            <HomePopularCategories :categories="categories" />

            <!-- start free courses -->
            <section v-if="freeCourses && freeCourses.length > 0" class="">
                <div class="mx-auto max-w-screen-xl px-2">
                    <div class="flex lg:flex-row flex-col">
                        <div class="lg:w-2/6 w-full lg:my-6 mb-10 lg:text-start text-center">
                            <h3 class="dark:text-white text-gray-700 font-extrabold text-3xl mb-3">{{
                                $t('index.freeCourses') }}</h3>
                            <p class="font-light dark:text-gray-400 text-gray-600 mb-3 lg:max-w-xs">
                                {{ $t('index.freeCoursesDesc') }}
                            </p>
                            <div class="flex items-center lg:justify-start justify-center gap-5 lg:mt-4">
                                <NuxtLink :to="{ name: 'courses', query: { 'type[0]': 'free' } }"
                                    class="lg:w-auto w-40 lg:me-6 lg:mb-0 bg-yellow-400 rounded-lg py-2 px-4 font-medium text-gray-800 text-sm hover:bg-opacity-80 dark:hover:bg-opacity-80">
                                    {{ $t('index.viewFreeCourses') }} </NuxtLink>
                                <div class="swiper-navigation gap-3 items-center justify-center flex">
                                    <button type="button"
                                        class="custom-prev-free-courses-swiper swiper-button-prev disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M7.12872 6.34863L2.5608 5.94466C1.53567 5.94466 0.704529 6.7839 0.704529 7.81901C0.704529 8.85412 1.53567 9.69336 2.5608 9.69336L7.12872 9.28938C7.93292 9.28938 8.58491 8.63105 8.58491 7.81901C8.58491 7.00561 7.93292 6.34863 7.12872 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M22.4681 6.42292C22.3967 6.35083 22.13 6.04614 21.8795 5.79314C20.4179 4.20852 16.6016 1.61734 14.6053 0.824345C14.3022 0.697847 13.5357 0.428528 13.1248 0.409485C12.7328 0.409485 12.3583 0.500618 12.0014 0.680164C11.5555 0.931801 11.1999 1.32898 11.0032 1.79689C10.8779 2.12061 10.6812 3.09315 10.6812 3.11084C10.4859 4.17315 10.3795 5.9006 10.3795 7.81032C10.3795 9.62754 10.4859 11.2843 10.6462 12.3643C10.6637 12.3833 10.8604 13.5898 11.0746 14.0033C11.4666 14.7596 12.2331 15.2275 13.0534 15.2275H13.1248C13.6596 15.2098 14.7831 14.7405 14.7831 14.7242C16.673 13.9312 20.399 11.4652 21.897 9.82613C21.897 9.82613 22.3199 9.40447 22.5031 9.14195C22.7887 8.76381 22.9315 8.29591 22.9315 7.828C22.9315 7.30568 22.7712 6.82009 22.4681 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button type="button"
                                        class="custom-next-free-courses-swiper swiper-button-next disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            class="-rotate-3 lg:w-4/6 lg:border-2 lg:border-white lg:dark:border-gray-700 lg:p-2 lg:rounded-xl lg:rounded-e-none lg:border-e-0 lg:rounded-s-none lg:border-s-0">
                            <swiper :grabCursor="true" :direction="'horizontal'" :slidesPerView="3" :spaceBetween="1"
                                :navigation="{
                                    prevEl: '.custom-prev-free-courses-swiper',
                                    nextEl: '.custom-next-free-courses-swiper',
                                }" :breakpoints="{
                                    '@0.00': {
                                        slidesPerView: 1.05,
                                        spaceBetween: 10,
                                    },
                                    '@0.25': {
                                        slidesPerView: 1.08,
                                        spaceBetween: 10,
                                    },
                                    '@0.50': {
                                        slidesPerView: 1.12,
                                        spaceBetween: 10,
                                    },
                                    '@0.75': {
                                        slidesPerView: 2.4,
                                        spaceBetween: 12,
                                    },
                                    '@1.00': {
                                        slidesPerView: 2.3,
                                        spaceBetween: 12,
                                    },
                                    '@1.25': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                    '@1.50': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                    '@1.75': {
                                        slidesPerView: 2.8,
                                        spaceBetween: 12,
                                    },
                                }" :modules="modules" class="">
                                <swiper-slide v-for="(course, index) in freeCourses" :key="index" class="h-auto">
                                    <CourseCard2 class="" :course="course" />
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                </div>
            </section>
            <!-- end free courses -->

            <!-- start paths -->
            <section v-if="paths && paths.length > 0" class="">
                <div class="mx-auto max-w-screen-xl px-2">
                    <div class="flex lg:flex-row flex-col">
                        <div class="lg:w-2/6 w-full lg:my-6 mb-10 lg:text-start text-center">
                            <h3 class="dark:text-white text-gray-700 font-extrabold text-3xl mb-3">{{
                                $t('index.learningPaths') }}</h3>
                            <p class="font-light dark:text-gray-400 text-gray-600 mb-3 lg:max-w-xs">{{
                                $t('index.learningPathsDesc') }}</p>
                            <div class="flex items-center lg:justify-start justify-center gap-5 lg:mt-4">
                                <NuxtLink :to="{ name: 'paths' }"
                                    class="lg:w-auto w-40 lg:me-6 lg:mb-0 bg-yellow-400 rounded-lg py-2 px-4 font-medium text-gray-800 text-sm hover:bg-opacity-80 dark:hover:bg-opacity-80">
                                    {{ $t('index.viewAllPaths') }} </NuxtLink>
                                <div class="swiper-navigation gap-3 items-center justify-center flex">
                                    <button type="button"
                                        class="custom-prev-path-swiper swiper-button-prev disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M7.12872 6.34863L2.5608 5.94466C1.53567 5.94466 0.704529 6.7839 0.704529 7.81901C0.704529 8.85412 1.53567 9.69336 2.5608 9.69336L7.12872 9.28938C7.93292 9.28938 8.58491 8.63105 8.58491 7.81901C8.58491 7.00561 7.93292 6.34863 7.12872 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M22.4681 6.42292C22.3967 6.35083 22.13 6.04614 21.8795 5.79314C20.4179 4.20852 16.6016 1.61734 14.6053 0.824345C14.3022 0.697847 13.5357 0.428528 13.1248 0.409485C12.7328 0.409485 12.3583 0.500618 12.0014 0.680164C11.5555 0.931801 11.1999 1.32898 11.0032 1.79689C10.8779 2.12061 10.6812 3.09315 10.6812 3.11084C10.4859 4.17315 10.3795 5.9006 10.3795 7.81032C10.3795 9.62754 10.4859 11.2843 10.6462 12.3643C10.6637 12.3833 10.8604 13.5898 11.0746 14.0033C11.4666 14.7596 12.2331 15.2275 13.0534 15.2275H13.1248C13.6596 15.2098 14.7831 14.7405 14.7831 14.7242C16.673 13.9312 20.399 11.4652 21.897 9.82613C21.897 9.82613 22.3199 9.40447 22.5031 9.14195C22.7887 8.76381 22.9315 8.29591 22.9315 7.828C22.9315 7.30568 22.7712 6.82009 22.4681 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    <button type="button"
                                        class="custom-next-path-swiper swiper-button-next disabled:opacity-50">
                                        <svg class="w-5 h-5 dark:text-white text-gray-600 ltr:rotate-180"
                                            viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4"
                                                d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863"
                                                fill="currentColor"></path>
                                            <path
                                                d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292"
                                                fill="currentColor"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            class="rotate-3 lg:w-4/6 lg:border-2 lg:border-white lg:dark:border-gray-700 lg:p-2 lg:rounded-xl lg:rounded-e-none lg:border-e-0 lg:rounded-s-none lg:border-s-0">
                            <swiper :grabCursor="true" :direction="'horizontal'" :slidesPerView="2" :spaceBetween="1"
                                :navigation="{
                                    prevEl: '.custom-prev-path-swiper',
                                    nextEl: '.custom-next-path-swiper',
                                }" :breakpoints="{
                                    '@0.00': {
                                        slidesPerView: 1.08,
                                        spaceBetween: 10,
                                    },
                                    '@0.25': {
                                        slidesPerView: 1.1,
                                        spaceBetween: 10,
                                    },
                                    '@0.50': {
                                        slidesPerView: 1.15,
                                        spaceBetween: 10,
                                    },
                                    '@0.75': {
                                        slidesPerView: 2.4,
                                        spaceBetween: 12,
                                    },
                                    '@1.00': {
                                        slidesPerView: 2.3,
                                        spaceBetween: 12,
                                    },
                                    '@1.25': {
                                        slidesPerView: 2.2,
                                        spaceBetween: 12,
                                    },
                                    '@1.50': {
                                        slidesPerView: 2.2,
                                        spaceBetween: 12,
                                    },
                                    '@1.75': {
                                        slidesPerView: 2.2,
                                        spaceBetween: 12,
                                    },
                                }" :modules="modules" class="">
                                <swiper-slide v-for="(path, index) in paths" :key="index" class="h-auto">
                                    <div class="group shrink-0 h-full w-full bg-white dark:bg-gray-900 rounded-lg p-4">
                                        <div class="h-full flex flex-col justify-between gap-3">
                                            <div class="">
                                                <div class="flex items-center justify-between gap-2">
                                                    <NuxtLink
                                                        :to="{ name: 'path.show', params: { pathSlug: path.slug } }"
                                                        class="relative w-14 h-14 overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-600">
                                                        <SeoImage
                                                            :src="path.icon"
                                                            :alt="path.title || 'مسیر یادگیری'"
                                                            :width="56"
                                                            :height="56"
                                                            sizes-preset="icon"
                                                            img-class="w-full h-full rounded-lg object-cover transform transition duration-200 hover:scale-110"
                                                        />
                                                        <InstallmentImageBadge
                                                            :allows-installment="path.allows_installment" />
                                                    </NuxtLink>
                                                    <div
                                                        class="rotate-12 group-hover:rotate-0 duration-300 flex items-center text-gray-800 bg-gray-100 dark:bg-gray-200 h-6 pe-3 ps-2 rounded">
                                                        <svg class="me-2 w-5 h-5" viewBox="0 0 25 26" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <circle opacity="0.15" cx="13.0035" cy="14.2262" r="8.07682"
                                                                transform="rotate(-36.651 13.0035 14.2262)"
                                                                fill="currentColor">
                                                            </circle>
                                                            <path
                                                                d="M3.15389 7.70712C7.35899 10.1461 7.88486 10.1461 12.0899 7.70712C16.295 5.26812 16.295 5.26812 12.0899 2.82914C7.88486 0.390149 7.35899 0.390142 3.15389 2.82914C1.05134 4.04863 6.10352e-05 4.65838 6.10352e-05 5.26813V10.7559C6.10352e-05 11.0926 0.273054 11.3656 0.609809 11.3656C0.946563 11.3656 1.21956 11.0926 1.21956 10.7559L1.21956 6.77631C1.21956 6.67967 1.32672 6.62118 1.40856 6.67255C1.87465 6.96515 2.45643 7.30259 3.15389 7.70712Z"
                                                                fill="currentColor"></path>
                                                            <path
                                                                d="M3.15389 8.31691C7.35899 10.7559 7.88486 10.7559 12.0899 8.31691L12.3298 8.17775C12.5202 8.06725 12.7602 8.18843 12.7742 8.4081C12.7953 8.74004 12.8048 9.11436 12.8048 9.53637C12.8048 12.5851 11.5853 13.1949 7.60095 13.1949C3.35013 13.1949 2.43905 12.5851 2.43905 9.53637C2.43905 9.11456 2.44809 8.74039 2.46848 8.40857C2.48201 8.18842 2.72242 8.06653 2.91317 8.17725L3.15389 8.31691Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                        <span class="text-xs font-medium">{{ $t('search.contains') }} {{
                                                            path.published_courses.length
                                                        }}
                                                            {{ $t('index.coursesWord') }}</span>
                                                    </div>
                                                </div>
                                                <NuxtLink
                                                    :to="{ name: 'path.show', params: { pathSlug: path.slug } }">
                                                    <h3
                                                        class="mt-5 font-semibold text-gray-800 dark:text-gray-50 line-clamp-1 hover:text-gray-500 dark:hover:text-gray-300">
                                                        {{
                                                            path.title }}
                                                    </h3>
                                                </NuxtLink>
                                                <p
                                                    class="text-sm font-light text-gray-500 dark:text-gray-400 line-clamp-3">
                                                    {{
                                                        path.short_description }}</p>
                                            </div>
                                            <div
                                                class="pt-3 border-t border-gray-200 dark:border-opacity-20 flex items-center justify-end">
                                                <NuxtLink
                                                    :to="{ name: 'path.show', params: { pathSlug: path.slug } }"
                                                    target="_blank"
                                                    class="hover:bg-opacity-80 bg-yellow-400 text-gray-800 text-sm font-medium flex items-center gap-2 rounded-lg px-4 py-1.5">
                                                    {{ $t('index.viewPathInfo') }}
                                                    <svg class="w-4 h-4 ltr:rotate-180" viewBox="0 0 25 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="currentColor" opacity="0.4"
                                                            d="M16.0371 11.2149L19.7925 10.8828C20.6352 10.8828 21.3185 11.5727 21.3185 12.4237C21.3185 13.2746 20.6352 13.9646 19.7925 13.9646L16.0371 13.6325C15.376 13.6325 14.84 13.0913 14.84 12.4237C14.84 11.755 15.376 11.2149 16.0371 11.2149Z">
                                                        </path>
                                                        <path fill="currentColor"
                                                            d="M3.42647 11.2759C3.48516 11.2166 3.70443 10.9662 3.91042 10.7582C5.11199 9.45544 8.24938 7.3252 9.89061 6.67327C10.1398 6.56928 10.7699 6.34787 11.1077 6.33221C11.43 6.33221 11.7378 6.40714 12.0313 6.55474C12.3979 6.76162 12.6902 7.08814 12.8519 7.47281C12.9549 7.73895 13.1166 8.53849 13.1166 8.55302C13.2772 9.42636 13.3647 10.8465 13.3647 12.4165C13.3647 13.9105 13.2772 15.2725 13.1454 16.1604C13.131 16.176 12.9693 17.1679 12.7932 17.5078C12.4709 18.1296 11.8408 18.5142 11.1664 18.5142H11.1077C10.668 18.4997 9.74443 18.1139 9.74443 18.1005C8.19068 17.4486 5.1275 15.4212 3.89602 14.0737C3.89602 14.0737 3.54829 13.7271 3.39767 13.5113C3.1629 13.2004 3.04551 12.8157 3.04551 12.431C3.04551 12.0016 3.17729 11.6024 3.42647 11.2759Z">
                                                        </path>
                                                    </svg>
                                                </NuxtLink>
                                            </div>
                                        </div>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                </div>
            </section>
            <!-- end paths -->

            <!-- start latest articles -->
            <section v-if="latestArticlesLoading || latestArticles.length" class="lg:pt-32 lg:pb-40">
                <div class="mx-auto max-w-screen-xl px-2">
                    <div
                        class="relative flex lg:flex-row flex-col gap-8 lg:gap-10 p-2 border-2 dark:border-gray-900 border-white rounded-2xl">
                        <svg class="absolute top-10 -start-7" width="49" height="46" viewBox="0 0 49 46" fill="none"
                            aria-hidden="true">
                            <circle cx="13.2432" cy="32.1084" r="13.2432" fill="#DC2626"></circle>
                            <circle cx="39.7298" cy="17.5407" r="9.27027" fill="#DC2626" fill-opacity="0.4"></circle>
                            <circle cx="19.865" cy="5.62176" r="5.2973" fill="#DC2626" fill-opacity="0.7"></circle>
                        </svg>
                        <div
                            class="lg:w-3/6 w-full lg:text-start text-center md:px-14 px-9 py-20 dark:bg-gray-900 bg-white bg-opacity-40 dark:bg-opacity-40 rounded-2xl">
                            <h3 class="dark:text-white text-gray-700 font-extrabold text-4xl mb-3">
                                {{ $t('index.latestArticles') }}
                            </h3>
                            <p class="font-light text-base dark:text-gray-300 text-gray-500 mb-4 leading-8">
                                {{ $t('index.latestArticlesDesc') }}
                            </p>
                            <NuxtLink :to="{ name: 'articles-index' }"
                                class="inline-flex items-center justify-center lg:w-auto w-44 bg-yellow-400 rounded-lg py-2 px-4 font-medium text-gray-800 text-sm hover:bg-opacity-80 transition">
                                {{ $t('index.viewAllArticles') }}
                                <svg class="w-4 h-4 ms-2 ltr:rotate-180" viewBox="0 0 14 10" fill="none"
                                    aria-hidden="true">
                                    <path class="fill-current" opacity="0.4"
                                        d="M9.57831 4.47732L12.273 4.23901C12.8777 4.23901 13.368 4.73409 13.368 5.3447C13.368 5.95532 12.8777 6.4504 12.273 6.4504L9.57831 6.21209C9.10391 6.21209 8.7193 5.82373 8.7193 5.3447C8.7193 4.86488 9.10391 4.47732 9.57831 4.47732" />
                                    <path class="fill-current"
                                        d="M0.529516 4.52111C0.571632 4.47859 0.728973 4.29885 0.876777 4.14961C1.73897 3.21483 3.9902 1.68628 5.16787 1.21848C5.34666 1.14386 5.79882 0.984988 6.04119 0.973755C6.27243 0.973755 6.49334 1.02751 6.70392 1.13343C6.96695 1.28187 7.17674 1.51617 7.29275 1.79219C7.36666 1.98316 7.48267 2.55687 7.48267 2.5673C7.5979 3.19396 7.66068 4.213 7.66068 5.33955C7.66068 6.41154 7.5979 7.38885 7.50334 8.02595C7.493 8.03718 7.37699 8.7489 7.25064 8.99282C7.0194 9.43895 6.56724 9.71497 6.0833 9.71497H6.04119C5.72571 9.70454 5.06298 9.42772 5.06298 9.41809C3.94809 8.9503 1.75009 7.49557 0.866446 6.52869C0.866446 6.52869 0.616927 6.27995 0.508855 6.12509C0.34039 5.90202 0.256158 5.626 0.256158 5.34998C0.256158 5.04186 0.350721 4.75541 0.529516 4.52111" />
                                </svg>
                            </NuxtLink>
                        </div>
                        <div class="lg:w-3/6 w-full lg:absolute end-10 -top-1/2 lg:mt-0 mt-13 ">
                            <div class="grid sm:grid-cols-2 gap-4">
                                <template v-if="latestArticlesLoading">
                                    <ArticleCardLoading v-for="i in 4" :key="'article-loading-' + i"
                                        :class="i === 2 || i === 4 ? 'lg:mt-10' : ''" />
                                </template>
                                <template v-else>
                                    <ArticleCard v-for="(article, index) in latestArticles" :key="article.id"
                                        :article="article" :class="index === 1 || index === 3 ? 'lg:mt-10' : ''" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- end latest articles -->

            <section class="">
                <div class="flex flex-col items-center justify-center mb-6">
                    <h4 class="flex items-center gap-2 dark:text-white text-gray-700 font-extrabold text-3xl">
                        {{ $t('index.whyZanburak') }}
                    </h4>
                    <div class="flex justify-center md:justify-start">
                        <span class="inline-block w-2 h-1 bg-teal-500 rounded-full"></span>
                        <span class="inline-block w-5 h-1 mx-1 bg-teal-500 rounded-full"></span>
                        <span class="inline-block w-20 h-1 bg-teal-500 rounded-full"></span>
                    </div>
                </div>
                <div class="mx-auto max-w-screen-lg px-2">
                    <div class="font-anjoman px-6 lg:w-[80%] mx-auto lg:grid lg:grid-cols-3 gap-3">
                        <div
                            class="hover:translate-x-2 lg:hover:-translate-y-3 duration-200 rounded-2xl bg-white dark:bg-gray-900 p-3 lg:p-5 flex flex-col justify-center text-center">
                            <div class="relative mx-auto">
                                <div class="absolute start-0 -bottom-1 w-4 h-4 lg:w-8 lg:h-8 bg-pink-400/20 rounded-xl">
                                </div>
                                <svg width="28" height="29" class="z-10 text-pink-400 lg:w-9 lg:h-9 h-5 w-5"
                                    viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.4822 3.95133C15.51 4.42655 17.1316 5.91484 17.6838 7.83499L18.458 7.37444C20.4352 6.1981 23 7.55122 23 9.77073L23 14.5944C23 16.6951 20.6776 18.0613 18.7037 17.1219L17.5485 16.572C16.8965 18.2938 15.3643 19.6076 13.4822 20.0487C10.9345 20.6457 8.24347 20.653 5.69246 20.0551C3.59198 19.5629 1.96547 17.9809 1.49366 15.9713L1.42818 15.6925C0.857273 13.2608 0.857274 10.7392 1.42818 8.30754L1.49366 8.02865C1.96547 6.0191 3.59198 4.43714 5.69246 3.94488C8.24347 3.34704 10.9345 3.35426 13.4822 3.95133ZM17.9906 14.8481C18.3134 13.1277 18.3414 11.3698 18.0745 9.64278L19.4213 8.84156C20.188 8.38543 21.1825 8.9101 21.1825 9.77073L21.1825 14.5944C21.1825 15.4089 20.2819 15.9387 19.5166 15.5744L17.9906 14.8481Z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                            <h3 class="mt-3 mb-1 text-lg font-extrabold text-gray-800 dark:text-gray-50">{{
                                $t('index.featureVideoTitle') }}
                            </h3>
                            <p class="text-sm font-light text-gray-400 dark:text-gray-500">{{
                                $t('index.featureVideoDesc') }}</p>
                        </div>
                        <div
                            class="my-3 lg:my-0 hover:translate-x-2 lg:hover:-translate-y-3 duration-200 rounded-2xl bg-white dark:bg-gray-900 p-3 lg:p-5 flex flex-col justify-center text-center">
                            <div class="relative mx-auto">
                                <div
                                    class="absolute -start-1 -bottom-1 w-4 h-4 lg:w-8 lg:h-8 bg-pink-400/20 rounded-xl">
                                </div>
                                <svg width="28" height="29" class="z-10 text-pink-400 lg:w-8 lg:h-8 h-5 w-5"
                                    viewBox="2 0 28 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.17756 2.63068C5.29428 4.24542 4.23977 6.52208 4.00501 9.31384C0.759826 9.66531 0 11.1943 0 15.8181C0 20.4194 0.752432 21.956 3.9577 22.3172C3.95562 22.3476 3.95456 22.3782 3.95456 22.4091C3.95456 26.0492 6.90559 29 10.5456 29H11.8637C12.5917 29 13.1818 28.4098 13.1818 27.6818C13.1818 26.9538 12.5917 26.3636 11.8637 26.3636H10.5456C8.36153 26.3636 6.59092 24.5931 6.59092 22.4091L6.5909 22.4012C10.9121 22.2912 11.8637 20.9925 11.8637 15.8181C11.8637 10.6718 10.9224 9.35923 6.66063 9.23703C6.89267 7.15658 7.69283 5.66164 8.89359 4.63209C10.3665 3.36921 12.6395 2.6364 15.7745 2.63637C18.9125 2.63634 21.2108 3.36213 22.7064 4.62554C23.9243 5.6543 24.7391 7.1493 24.9749 9.23705C20.7139 9.35941 19.7728 10.6721 19.7728 15.8181C19.7728 21.2458 20.8197 22.4091 25.7046 22.4091C30.5895 22.4091 31.6364 21.2458 31.6364 15.8181C31.6364 11.1941 30.8765 9.66515 27.6309 9.31379C27.392 6.50179 26.3141 4.22196 24.4077 2.61158C22.2674 0.803509 19.2711 -3.70837e-05 15.7744 1.2837e-09C12.2747 3.70863e-05 9.29683 0.813592 7.17756 2.63068Z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                            <h3 class="mt-3 mb-1 text-lg font-extrabold text-gray-800 dark:text-gray-50">{{
                                $t('index.featureSupportTitle') }}
                            </h3>
                            <p class="text-sm font-light text-gray-400 dark:text-gray-500">{{
                                $t('index.featureSupportDesc') }}</p>
                        </div>
                        <div
                            class="hover:translate-x-2 lg:hover:-translate-y-3 duration-200 rounded-2xl bg-white dark:bg-gray-900 p-3 lg:p-5 flex flex-col justify-center text-center">
                            <div class="relative mx-auto">
                                <div class="absolute start-0 bottom-0 w-4 h-4 lg:w-8 lg:h-8 bg-pink-400/20 rounded-xl">
                                </div>
                                <svg width="28" height="29" viewBox="0 0 28 29" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="titleId"
                                    class="z-10 text-pink-400 lg:w-10 lg:h-10 h-5 w-5" aria-label="clock icon">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M14 5.33755C9.09277 5.33755 5.11538 9.31494 5.11538 14.2222C5.11538 19.1284 9.09284 23.1068 14 23.1068C18.9072 23.1068 22.8846 19.1284 22.8846 14.2222C22.8846 9.31494 18.9072 5.33755 14 5.33755ZM3.5 14.2222C3.5 8.4228 8.20063 3.72217 14 3.72217C19.7993 3.72217 24.5 8.4228 24.5 14.2222C24.5 20.0204 19.7994 24.7222 14 24.7222C8.20056 24.7222 3.5 20.0204 3.5 14.2222Z"
                                        fill="currentColor"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.6409 9.55548C14.087 9.55548 14.4486 9.9171 14.4486 10.3632V14.3183L17.4743 16.1265C17.8572 16.3553 17.9821 16.8512 17.7533 17.2342C17.5244 17.617 17.0285 17.742 16.6456 17.5131L13.2265 15.4699C12.9826 15.3241 12.8333 15.0609 12.8333 14.7765V10.3632C12.8333 9.9171 13.1949 9.55548 13.6409 9.55548Z"
                                        fill="currentColor"></path>
                                </svg>
                            </div>
                            <h3 class="mt-3 mb-1 text-lg font-extrabold text-gray-800 dark:text-gray-50">{{
                                $t('index.featureUpdateTitle') }}
                            </h3>
                            <p class="text-sm font-light text-gray-400 dark:text-gray-500">{{
                                $t('index.featureUpdateDesc') }}</p>
                        </div>
                    </div>
                </div>
            </section>


            <section class="">
                <div
                    class="flex lg:flex-row flex-col sm:mx-10 relative items-center justify-end py-8 pt-24 lg:pt-8 sm:px-16 px-9 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-400 rounded-3xl">
                    <img class="absolute xl:start-0 lg:scale-100 scale-75 start-1/2 transform lg:translate-x-0 translate-x-1/2 lg:-top-28 -top-32"
                        src="@/assets/image/other/instagram-2.png" alt="اینستاگرام زنبورک" width="250" height="250" loading="lazy" decoding="async">
                    <h6
                        class="lg:me-20 md:text-xl text-lg text-white font-extrabold lg:font-bold lg:mb-0 mb-5 xl:mt-0 sm:mt-8 md:text-start text-center">
                        ما هر روز کلی مطالب آموزشی جالب در اینستاگراممون منتشر می‌کنیم!</h6><a
                        class="px-5 py-3 flex items-center text-xs lg:text-base bg-white rounded-lg text-red-600 font-semibold transition duration-200 hover:text-white hover:bg-transparent border border-white whitespace-nowrap"
                        href="https://www.instagram.com/zanburakir/" target="_blank" rel="noreferrer">مشاهده پست های
                        اینستاگرام<svg width="16" height="11" viewBox="0 0 16 11" fill="none" class="mr-2"
                            aria-hidden="true">
                            <path fill="currentColor" opacity="0.4"
                                d="M10.8229 4.15815L13.8465 3.89075C14.525 3.89075 15.0752 4.44626 15.0752 5.13142C15.0752 5.81658 14.525 6.37209 13.8465 6.37209L10.8229 6.10469C10.2905 6.10469 9.85898 5.66892 9.85898 5.13142C9.85898 4.59301 10.2905 4.15815 10.8229 4.15815">
                            </path>
                            <path fill="currentColor"
                                d="M0.66943 4.20734C0.716688 4.15962 0.893236 3.95795 1.05908 3.79048C2.02653 2.74158 4.55259 1.02643 5.87402 0.501533C6.07464 0.417801 6.58199 0.239533 6.85395 0.226929C7.11342 0.226929 7.3613 0.287252 7.59759 0.406097C7.89273 0.57266 8.12812 0.83556 8.25831 1.14528C8.34123 1.35956 8.47141 2.0033 8.47141 2.01501C8.6007 2.71817 8.67114 3.86161 8.67114 5.12569C8.67114 6.32855 8.6007 7.42516 8.49459 8.14003C8.483 8.15264 8.35282 8.95124 8.21105 9.22495C7.95158 9.72554 7.44423 10.0353 6.90121 10.0353H6.85395C6.49996 10.0235 5.75632 9.71293 5.75632 9.70213C4.50533 9.17723 2.03901 7.54491 1.04749 6.46C1.04749 6.46 0.767513 6.18089 0.646247 6.00712C0.457217 5.75683 0.362701 5.44711 0.362701 5.13739C0.362701 4.79166 0.468808 4.47024 0.66943 4.20734">
                            </path>
                        </svg></a>
                </div>
            </section>
        </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
// import { ref } from "vue";
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import CourseCard2 from "@/views/components/course/CourseCard2.vue";
import CourseCard2Loading from "@/views/components/course/CourseCard2Loading.vue";
import HomeStatsSection from "@/views/components/home/HomeStatsSection.vue";
import HomePopularCategories from "@/views/components/home/HomePopularCategories.vue";
import ArticleCard from "@/views/components/articles/ArticleCard.vue";
import ArticleCardLoading from "@/views/components/articles/ArticleCardLoading.vue";
import InstallmentImageBadge from "@/views/components/payment/InstallmentImageBadge.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { useSEO, generateOrganizationSchema } from "@/composables/useSEO";
export default {
    inject: {
        ssrHomeData: { from: 'ssrHomeData', default: null },
    },
    components: {
        MasterPage,
        CourseCard2,
        Swiper,
        SwiperSlide,
        CourseCard2Loading,
        HomeStatsSection,
        HomePopularCategories,
        ArticleCard,
        ArticleCardLoading,
        InstallmentImageBadge,
        SeoImage,
    },
    data() {
        return {
            latestCourses: [],
            latestArticles: [],
            latestArticlesLoading: false,
            freeCourses: [],
            paths: [],
            categories: [],
            stats: null,
            homeLoading: true,
            modules: [Navigation],
        };
    },
    methods: {
        pickDiverseArticles(articles, limit = 4) {
            const list = Array.isArray(articles) ? articles : [];
            const picked = [];
            const seenCats = new Set();
            for (const article of list) {
                const catKey = article?.category?.id
                    ?? article?.category?.slug
                    ?? `nocat-${article?.id}`;
                if (seenCats.has(catKey)) continue;
                seenCats.add(catKey);
                picked.push(article);
                if (picked.length >= limit) return picked;
            }
            for (const article of list) {
                if (picked.some((item) => item.id === article.id)) continue;
                picked.push(article);
                if (picked.length >= limit) break;
            }
            return picked;
        },
        applyHomePayload(data) {
            const payload = data || {};
            this.latestCourses = payload.latest_courses || [];
            this.freeCourses = payload.free_courses || [];
            this.paths = payload.paths || [];
            this.categories = payload.categories || [];
            this.stats = payload.stats || null;
            this.latestArticles = this.pickDiverseArticles(payload.articles || [], 4);
            this.homeLoading = false;
            this.latestArticlesLoading = false;
        },
        async loadHome() {
            this.homeLoading = true;
            this.latestArticlesLoading = true;
            try {
                const response = await axiosInstance.get("/index/home");
                this.applyHomePayload(response.data || {});
            } catch (e) {
                this.applyHomePayload({});
            }
        },
    },
    created() {
        const ssr = this.ssrHomeData;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        if (payload) {
            this.applyHomePayload(payload);
        }
    },
    mounted() {
        if (this.homeLoading) {
            this.loadHome();
        }

        const organizationSchema = generateOrganizationSchema();

        useSEO({
            title: this.$t('index.seoTitle'),
            description: this.$t('index.seoDescription'),
            url: '/',
            keywords: this.$t('index.seoKeywords').split('|'),
            schema: organizationSchema,
            noindex: false
        });
    },
};
</script>

<style scoped>
.hero-illustration {
    position: relative;
}

.hero-illustration::before {
    content: '';
    position: absolute;
    inset: 10% 5%;
    background: radial-gradient(ellipse at center, rgba(254, 215, 0, 0.12) 0%, transparent 70%);
    pointer-events: none;
    animation: heroAmbientPulse 5s ease-in-out infinite;
}

.hero-laptop {
    transform-origin: 380px 320px;
    animation: heroFloatLaptop 5s ease-in-out infinite;
}

.hero-phone {
    transform-origin: 980px 480px;
    animation: heroFloatPhone 4.2s ease-in-out infinite 0.6s;
}

.hero-screen {
    animation: heroScreenGlow 3s ease-in-out infinite;
}

.hero-screen-dot {
    animation: heroDotPulse 2s ease-in-out infinite;
}

.hero-code-line {
    animation: heroCodeFade 2.4s ease-in-out infinite;
}

.hero-code-line--2 {
    animation-delay: 0.3s;
}

.hero-code-line--3 {
    animation-delay: 0.6s;
}

.hero-code-line--4 {
    animation-delay: 0.9s;
}

.hero-code-line--5 {
    animation-delay: 1.2s;
}

.hero-decor-accent {
    animation: heroDecorPulse 4s ease-in-out infinite;
}

.hero-decor-square {
    animation: heroSquareFloat 3.5s ease-in-out infinite;
}

.hero-decor-square--delay {
    animation-delay: 0.8s;
}

.hero-decor-square--delay2 {
    animation-delay: 1.6s;
}

.hero-decor-ring {
    animation: heroRingPulse 5s ease-in-out infinite;
}

.hero-decor-ring--delay {
    animation-delay: 1.2s;
}

@keyframes heroFloatLaptop {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes heroFloatPhone {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-14px) rotate(-1deg);
    }
}

@keyframes heroScreenGlow {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.88;
    }
}

@keyframes heroDotPulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.45;
    }
}

@keyframes heroCodeFade {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.35;
    }
}

@keyframes heroAmbientPulse {

    0%,
    100% {
        opacity: 0.6;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.05);
    }
}

@keyframes heroDecorPulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.75;
        transform: scale(0.96);
    }
}

@keyframes heroSquareFloat {

    0%,
    100% {
        transform: translateY(0);
        opacity: 1;
    }

    50% {
        transform: translateY(-6px);
        opacity: 0.85;
    }
}

@keyframes heroRingPulse {

    0%,
    100% {
        opacity: 0.9;
    }

    50% {
        opacity: 0.5;
    }
}

@media (prefers-reduced-motion: reduce) {

    .hero-illustration::before,
    .hero-laptop,
    .hero-phone,
    .hero-screen,
    .hero-screen-dot,
    .hero-code-line,
    .hero-decor-accent,
    .hero-decor-square,
    .hero-decor-ring {
        animation: none;
    }
}
</style>
