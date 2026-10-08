<script setup>
import axiosInstance from '@/store/axiosInstance'

definePageMeta({
  name: "paths",
})

const { data: ssrPathsData } = await useAsyncData('paths-list', async () => {
  try {
    const { data } = await axiosInstance.get('/paths')
    return data?.paths || []
  } catch {
    return []
  }
})

provide('ssrPathsData', ssrPathsData)
</script>

<template>
        <section class="mx-auto max-w-screen-xl px-2">
            <div class="bg-white dark:bg-gray-900 my-10 md:mt-20 rounded-xl">
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div class="md:ps-10 mt-8 md:mt-0 order-last md:order-first col-span-12 md:col-span-7 text-gray-800 dark:text-gray-50 flex flex-col gap-3">
                        <h1 class="max-w-3xl mb-4 text-center ltr:md:text-left rtl:md:text-right text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl text-gray-800 dark:text-white">{{ $t('path.list.hero_title') }}</h1>
                        <p class="text-lg font-light text-gray-500 dark:text-gray-400 text-center md:text-start md:me-16">{{ $t('path.list.hero_description') }}</p>
                        <div class="flex items-center mt-auto gap-2 justify-center md:justify-start">
                            <a href="#paths" class="whitespace-nowrap h-10 rounded-lg flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-amber-400 hover:shadow-md shadow-amber-400 hover:opacity-90">
                                {{ $t('path.list.start_journey') }}
                                <svg class="ms-1 w-4 h-4" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863" fill="currentColor"></path>
                                    <path d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292" fill="currentColor"></path>
                                </svg>
                            </a>
                            <NuxtLink to="" class="whitespace-nowrap h-10 rounded-lg flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-gray-300 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-gray-300 hover:shadow-md shadow-gray-400">
                                {{ $t('path.common.path_guide') }}
                                <svg class="ms-1 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M14.9703 3.3437C13.0166 2.88543 10.9834 2.88543 9.02975 3.3437C6.20842 4.00549 4.0055 6.20841 3.3437 9.02975C2.88543 10.9834 2.88543 13.0166 3.3437 14.9703C4.0055 17.7916 6.20842 19.9945 9.02975 20.6563C10.9834 21.1146 13.0166 21.1146 14.9703 20.6563C17.7916 19.9945 19.9945 17.7916 20.6563 14.9703C21.1146 13.0166 21.1146 10.9834 20.6563 9.02975C19.9945 6.20842 17.7916 4.00549 14.9703 3.3437ZM8.55377 9.12812C8.55377 8.8109 8.81093 8.55374 9.12815 8.55374H12.9573C13.2745 8.55374 13.5317 8.8109 13.5317 9.12812C13.5317 9.44533 13.2745 9.70249 12.9573 9.70249H9.12815C8.81093 9.70249 8.55377 9.44533 8.55377 9.12812ZM8.55377 12C8.55377 11.6828 8.81093 11.4256 9.12815 11.4256H14.8719C15.1891 11.4256 15.4462 11.6828 15.4462 12C15.4462 12.3172 15.1891 12.5743 14.8719 12.5743H9.12815C8.81093 12.5743 8.55377 12.3172 8.55377 12ZM8.55377 14.8718C8.55377 14.5546 8.81093 14.2975 9.12815 14.2975H12C12.3172 14.2975 12.5744 14.5546 12.5744 14.8718C12.5744 15.189 12.3172 15.4462 12 15.4462H9.12815C8.81093 15.4462 8.55377 15.189 8.55377 14.8718Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="flex lg:mt-0 lg:col-span-5 items-center mt-8 md:mt-0">
                        <svg class="mx-auto w-80 h-auto md:scale-110" viewBox="0 0 792.41214 763.67855" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <circle cx="180.18" cy="49.43208" r="49.43208" fill="#ff6584"></circle>
                            <path
                                d="M439.60693,433.14822a81.05685,81.05685,0,0,1-52.68051-19.45347c-4.89745-4.19218-10.1157-11.48032-15.50943-21.66053a49.53621,49.53621,0,0,1-1.57108-42.76506,56.842,56.842,0,0,1-9.38677,7.69937l-1.71614,1.14183-.09914-2.05778c-.06506-1.33843-.098-2.67236-.098-3.9646,0-7.61572,5.76007-15.34359,3.10358-22.383-11.19647-29.66913-46.70888-59.1543,4.75943-105.0715,4.76112-4.24762-1.599-12.74018-1.599-19.16674,0-62.98182,68.43238-157.45982,114.24335-114.22108,26.74027,25.23883,82.45206,43.16815,108.46375,78.27408l.34446,1.04016-1.01509.41065a61.2228,61.2228,0,0,1-16.2668,4.32653,77.56881,77.56881,0,0,0,18.13813,1.51954l.94355-.03295.22983.91707a114.74268,114.74268,0,0,1,3.4058,27.766l-.00423,1.01171a50.592,50.592,0,0,0,16.71267,37.72313,81.24432,81.24432,0,0,1,26.50586,59.95092c0,13.35194-9.07469,30.87859-16.68759,43.23064A24.44537,24.44537,0,0,1,601.8781,358.8776a23.87313,23.87313,0,0,1-19.26673-6.22406A78.94867,78.94867,0,0,0,596.534,372.365l1.03875,1.07029-1.28971.75146a80.99749,80.99749,0,0,1-40.83178,11.02687l-.84018-.00226c-21.78164,0-42.45665,8.43844-56.72369,23.15219A81.67332,81.67332,0,0,1,439.60693,433.14822Z"
                                transform="translate(-203.80173 -68.52653)"
                                fill="#e6e6e6"
                            ></path>
                            <path d="M411.02214,560.12629a1.45772,1.45772,0,0,1-1.44143-1.25232c-.06192-.43516-6.12837-44.18711-.68-102.33528,5.03159-53.70122,21.19-131.04989,69.59439-194.57511a1.45784,1.45784,0,1,1,2.3191,1.7672c-47.9863,62.97665-64.01448,139.75776-69.01059,193.07983-5.41667,57.80982.6022,101.22057.66365,101.6524a1.45906,1.45906,0,0,1-1.4451,1.66328Z" transform="translate(-203.80173 -68.52653)" fill="#ccc"></path>
                            <path d="M455.21934,349.96155a1.45779,1.45779,0,0,1-.85821-2.637,200.92039,200.92039,0,0,1,44.35616-22.57973c24.47208-8.95937,61.68553-17.08166,99.99613-4.88874a1.45763,1.45763,0,1,1-.88408,2.778c-37.5257-11.94236-74.06459-3.95437-98.10958,4.84888A197.61933,197.61933,0,0,0,456.07518,349.683,1.452,1.452,0,0,1,455.21934,349.96155Z" transform="translate(-203.80173 -68.52653)" fill="#ccc"></path>
                            <path d="M387.49888,177.78589a1.45779,1.45779,0,0,1,2.56838-1.04589,200.92088,200.92088,0,0,1,25.7154,42.61492c10.69848,23.76333,21.4796,60.29523,12.07727,99.38443a1.45763,1.45763,0,1,1-2.83443-.68172c9.20894-38.2883-1.38965-74.15706-11.90165-97.50566a197.61951,197.61951,0,0,0-25.28551-41.93252A1.45205,1.45205,0,0,1,387.49888,177.78589Z" transform="translate(-203.80173 -68.52653)" fill="#ccc"></path>
                            <path d="M743.1543,648.7041c-100.26758,0-177.2295-5.27734-230.64746-26.43848-130.10889-51.54-174.21827-72.94335-174.64893-73.15332l.87793-1.79687c.42969.21,44.49512,21.58887,174.50732,73.09082,77.11622,30.5498,203.999,27.8252,379.61524,24.05273,32.95508-.707,67.03222-1.43945,103.32422-2.02246l.03125,2c-36.28516.583-70.36035,1.31446-103.3125,2.02246C838.27051,647.63184,788.34277,648.7041,743.1543,648.7041Z" transform="translate(-203.80173 -68.52653)" fill="#cacaca"></path>
                            <path d="M320.00391,779.9209l-1.41407-1.41406c48.58008-48.58008,67.30078-67.15332,71.26709-71.083L246.71143,604.02441l1.17089-1.62109L392.94238,707.18555l-.84033.83007C391.94141,708.1748,375.35938,724.56543,320.00391,779.9209Z" transform="translate(-203.80173 -68.52653)" fill="#cacaca"></path>
                            <path d="M392.08154,832.20508l-1.36425-1.46289C395.19873,826.55957,500.606,728.40625,521.146,728.40625h.06494l472.0957,4.80762-.01953,2-472.09668-4.80762h-.05811C501.395,730.40625,393.17383,831.18555,392.08154,832.20508Z" transform="translate(-203.80173 -68.52653)" fill="#cacaca"></path>
                            <rect x="658.2432" y="610.68734" width="121.25195" height="2" fill="#cacaca"></rect>
                            <rect x="431.2432" y="610.68734" width="121.25195" height="2" fill="#cacaca"></rect>
                            <path d="M629.29687,518.05573h-70V500.37152h26a6,6,0,0,0,6-6V475.21363a6,6,0,0,0-6-6h-26v-6a8,8,0,0,0-16,0v6h-96.0907a5.9997,5.9997,0,0,0-3.46747,1.10339l-13.527,9.57892a6,6,0,0,0,0,9.79321l13.527,9.579a6.00021,6.00021,0,0,0,3.46747,1.10339h96.0907v17.68421h-70a6,6,0,0,0-6,6v19.1579a6,6,0,0,0,6,6h70v66a8,8,0,0,0,16,0v-66h70a6,6,0,0,0,6-6v-19.1579A6,6,0,0,0,629.29687,518.05573Z" transform="translate(-203.80173 -68.52653)" fill="#3f3d56"></path>
                            <path d="M511.29687,485.71363h-50a3.5,3.5,0,0,1,0-7h50a3.5,3.5,0,0,1,0,7Z" transform="translate(-203.80173 -68.52653)" fill="#fed700"></path>
                            <path d="M573.29687,536.71363h-50a3.5,3.5,0,1,1,0-7h50a3.5,3.5,0,0,1,0,7Z" transform="translate(-203.80173 -68.52653)" fill="#fff"></path>
                            <path d="M333.29687,618.05573V600.37152h26a6,6,0,0,0,6-6V575.21363a6,6,0,0,0-6-6h-26V563.4877a8.18211,8.18211,0,0,0-7.46748-8.25679,8.00067,8.00067,0,0,0-8.53252,7.98272v6l-107.60875,50.349a3.55189,3.55189,0,0,0-1.874,2.111c-.84759,2.58218-2.6281,8.09222-3.83913,12.43791a4.66845,4.66845,0,0,0,4.64963,5.90722c6.9348-.213,11.4977-.536,14.66456-.62427a4.63956,4.63956,0,0,0,1.76982-.40486l92.23789-38.61813v48.84211l0,65.72593a8.1821,8.1821,0,0,0,7.46748,8.25678,8.00067,8.00067,0,0,0,8.53253-7.98271v-97.1579Z" transform="translate(-203.80173 -68.52653)" fill="#3f3d56"></path>
                            <path d="M291.54125,600.68087l-45.62534,20.45306a3.5,3.5,0,0,1-2.86343-6.38755l45.62534-20.45306a3.5,3.5,0,0,1,2.86343,6.38755Z" transform="translate(-203.80173 -68.52653)" fill="#fff"></path>
                            <path d="M902.98823,437.75036,882.13751,439.866a61.77461,61.77461,0,0,0,5.4177,31.25772l-6.25661,58.271.09288-.00134a6.76555,6.76555,0,1,0,11.15686-.81256l13.90492-51.9937Z" transform="translate(-203.80173 -68.52653)" fill="#a0616a"></path>
                            <polygon points="635.054 625.01 626.195 623.483 625.327 596.741 640.942 590.836 635.054 625.01" fill="#a0616a"></polygon>
                            <path d="M837.57614,702.83271,810.33086,698.139l.05934-.34456a10.76144,10.76144,0,0,1,12.43119-8.778l.00066.00011,5.627-2.91843,8.63508,5.37549,2.37834.40973Z" transform="translate(-203.80173 -68.52653)" fill="#2f2e41"></path>
                            <polygon points="723.94 606.495 716.268 611.18 694.542 583.815 705.867 576.9 723.94 606.495" fill="#a0616a"></polygon>
                            <path d="M932.90056,682.86053l-23.59467,14.40931-.18224-.29839a10.76142,10.76142,0,0,1,3.57473-14.79219l.00057-.00035,2.31283-5.90182,10.03831-1.641,2.05966-1.25784Z" transform="translate(-203.80173 -68.52653)" fill="#2f2e41"></path>
                            <path d="M841.88589,530.89854l-5.31572,20.20133s-1.4516,8.37183-.69968,9.12375a10.09259,10.09259,0,0,1,1.84133,6.22263c-.33748,2.04855-3.77741,1.21373-2.05744,4.26288s-3.59576,49.44945-3.59576,49.44945l-4.76175,57.055,17,2c2.44085-1.4292,2.79888-3.05433,1.35791-4.84876,0,0,3.48706-4.02173,1.56457-5.58649s1.55072-2.21881,1.73969-6.21185l10.97306-39.18119,3.63149-8.75852-.94943-4.56891,2.7589-5.24571,1.32637-13.75964,3.59744,36.16107,33.598,38.58151L920.4372,657.524l.97065-2.11442a3.92746,3.92746,0,0,0-1.49876-4.97583h0l-5.61222-5.22008c.48071-2.15058-7.154-7.54171-7.154-7.54171l-12.78273-24.06161,7.93668-67.39668s12-16-3.89739-30.47769C891.88667,509.80475,841.88589,530.89854,841.88589,530.89854Z" transform="translate(-203.80173 -68.52653)" fill="#2f2e41"></path>
                            <path d="M893.04579,504.35884c2.81825-4.18859,9.58558,1.82681,7.3298-5.69244s-7.96332-8.91695-2.85377-16.1133l7.36532-35.87019,0,0a33.002,33.002,0,0,0-8.10668-23.41481l-10.60224-12.1337-1.59307-4.30352L866.539,406.079l-1.50387,5.26346c-5.39127,6.71274-14.21454,15.33246-13.95051,28.01068.50806,24.3974-3.29663,56.8613-12.66839,99.09424,0,0,20.9585-16.3651,27.54831-9.27486s26.44185,5.16274,31.40339.22222a29.37879,29.37879,0,0,0,6.76733-12.03081S890.22759,508.54744,893.04579,504.35884Z" transform="translate(-203.80173 -68.52653)" fill="#fed700"></path>
                            <path d="M904.44069,532.8136l-41.14382-11.6-27,13c12.08914-22.49438,19.44475-59.9472,17.12149-91.76378a36.684,36.684,0,0,1,3.83557-19.59482c3.71175-7.144,9.517-12.19158,18.04294-11.6414l11-1,7,4c10.12859,10.611,14.11334,26.4425,12.53679,41.02794-1.73956,16.09773-3.905,35.6533-4.34156,37.39983-.25627,1.02619.55366,2.8278,1.411,4.73515,1.44731,3.21845,3.24819,7.22406.746,9.7262a7.28152,7.28152,0,0,0-2.454,5.3369,6.527,6.527,0,0,0,2.43385,4.63969c3.19715,2.76171.97221,14.87769.876,15.39207Z" transform="translate(-203.80173 -68.52653)" fill="#2f2e41"></path>
                            <path d="M883.4509,453.14234l-20.67157-3.45173a61.77469,61.77469,0,0,0-3.0077,31.58086L838.386,535.83621l.09.02318a6.76554,6.76554,0,1,0,10.97685,2.15513l27.1102-46.4944Z" transform="translate(-203.80173 -68.52653)" fill="#a0616a"></path>
                            <path d="M859.29687,464.21363l24-5,3.92-17.41823a13.53467,13.53467,0,0,0-27.06933,0C857.72869,451.48862,858.1505,454.29709,859.29687,464.21363Z" transform="translate(-203.80173 -68.52653)" fill="#fed700"></path>
                            <circle cx="671.00841" cy="316.49851" r="18.79813" fill="#a0616a"></circle>
                            <path d="M896.616,370.73846c-1.463-2.61788-7.28171.73123-9.08561-1.66448a19.62437,19.62437,0,0,0-5.35848-5.27421,11.70515,11.70515,0,0,0-11.54043-.12841,23.20611,23.20611,0,0,1-4.14587,2.35577c-1.51849.485-3.50083.11846-4.15839-1.33363q.69563,1.90325,1.39122,3.80653a5.41492,5.41492,0,0,1-6.97454-2.22466q-.12246,1.97071-.24479,3.94146a1.57068,1.57068,0,0,0-1.726-1.10136,2.8303,2.8303,0,0,0-1.92456,2.01341c-1.18732,3.492,1.653,7.56785,5.29464,8.153,2.25238.36192,4.51756-.361,6.77816-.66752s4.87741-.05058,6.30545,1.7285c1.40242,1.74718,1.13078,4.23683,1.212,6.47576s1.05979,4.925,3.28022,5.22369c1.52363.205,2.97957-.85767,4.51426-.76662,2.19052.13,3.5951,2.64767,3.3592,4.82933s-1.6077,4.0493-2.93124,5.7996q3.28193.25968,6.56379.51929l-.84816.23516c5.35255-.262,9.48341-5.45664,10.12276-10.77735S899.23027,375.41647,896.616,370.73846Z" transform="translate(-203.80173 -68.52653)" fill="#2f2e41"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div v-if="loading">
                <div class="flex items-start md:justify-center lg:mx-3 py-10 space-x-3 md:space-x-7 rtl:space-x-reverse max-w-screen-xl overflow-x-auto custom-scrollbar">
                    <div v-for="i in 5" :key="i" class="group relative flex flex-col items-center">
                        <div class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 w-24 h-24 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center transition duration-200 transform group-hover:-translate-y-3">
                            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="fill-gray-400 dark:fill-gray-500" d="M16.3027 15.3365H6.68V20.1818C6.68 20.6337 6.30392 21 5.84 21C5.37608 21 5 20.6337 5 20.1818V3.81818C5 3.36631 5.37608 3 5.84 3H16.3027C17.4037 3 18.2506 3.65926 18.6739 4.48207C19.0965 5.30334 19.1414 6.35681 18.6123 7.28021L18.1096 8.15756C17.757 8.77312 17.757 9.56335 18.1096 10.1789L18.6123 11.0563C19.1414 11.9797 19.0965 13.0331 18.6739 13.8544C18.2506 14.6772 17.4037 15.3365 16.3027 15.3365Z"></path>
                            </svg>
                        </div>
                        <div class="w-24 h-2 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 absolute whitespace-nowrap block text-center dark:bg-gray-700 bg-gray-300 opacity-0 group-hover:opacity-100 -bottom-10 transition duration-200"></div>
                    </div>
                </div>
                <div class="my-12 md:my-20 lg:px-24">
                    <div v-for="i in 2" :key="i" class="flex justify-between sm:mb-28 mb-7 flex-col border-2 border-white dark:border-gray-900/60 rounded-xl p-3 md:p-5 lg:p-7" :class="i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'">
                        <div class="w-full relative lg:mt-0 my-4">
                            <div class="animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 lg:absolute w-14 h-14 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-3" :class="i % 2 === 0 ? 'sm:-end-16 -end-16' : 'sm:-start-16 -start-16'">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="fill-gray-400 dark:fill-gray-500" d="M16.3027 15.3365H6.68V20.1818C6.68 20.6337 6.30392 21 5.84 21C5.37608 21 5 20.6337 5 20.1818V3.81818C5 3.36631 5.37608 3 5.84 3H16.3027C17.4037 3 18.2506 3.65926 18.6739 4.48207C19.0965 5.30334 19.1414 6.35681 18.6123 7.28021L18.1096 8.15756C17.757 8.77312 17.757 9.56335 18.1096 10.1789L18.6123 11.0563C19.1414 11.9797 19.0965 13.0331 18.6739 13.8544C18.2506 14.6772 17.4037 15.3365 16.3027 15.3365Z"></path>
                                </svg>
                            </div>
                            <div class="w-32 h-2 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 mb-6" :class="i % 2 === 0 ? 'md:ms-auto' : 'md:me-auto'"></div>

                            <div class="w-10/12 h-1 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 mb-4" :class="i % 2 === 0 ? 'md:ms-auto' : 'md:me-auto'"></div>
                            <div class="w-10/12 h-1 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 mb-4" :class="i % 2 === 0 ? 'md:ms-auto' : 'md:me-auto'"></div>
                            <div class="w-8/12 h-1 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 mb-6" :class="i % 2 === 0 ? 'md:ms-auto' : 'md:me-auto'"></div>

                            <div class="w-28 h-9 rounded-lg animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700" :class="i % 2 === 0 ? 'md:ms-auto' : 'md:me-auto'"></div>
                        </div>
                        <div class="xl:mt-0 mt-5">
                            <div class="relative dark:shadow dark:bg-gray-900 bg-white px-4 pt-3 pb-5 rounded-xl w-full md:w-96 md:h-56 h-48">
                                <div class="flex items-center justify-center animate-shimmer shimmer-slate-200 dark:shimmer-slate-600 bg-gray-300 dark:bg-gray-700 relative overflow-hidden group rounded-xl z-10 w-full h-full">
                                    <svg class="w-7 h-7 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="M22.0187 16.8203L18.8887 9.50027C18.3187 8.16027 17.4687 7.40027 16.4987 7.35027C15.5387 7.30027 14.6087 7.97027 13.8987 9.25027L11.9987 12.6603C11.5987 13.3803 11.0287 13.8103 10.4087 13.8603C9.77867 13.9203 9.14867 13.5903 8.63867 12.9403L8.41867 12.6603C7.70867 11.7703 6.82867 11.3403 5.92867 11.4303C5.02867 11.5203 4.25867 12.1403 3.74867 13.1503L2.01867 16.6003C1.39867 17.8503 1.45867 19.3003 2.18867 20.4803C2.91867 21.6603 4.18867 22.3703 5.57867 22.3703H18.3387C19.6787 22.3703 20.9287 21.7003 21.6687 20.5803C22.4287 19.4603 22.5487 18.0503 22.0187 16.8203Z"></path>
                                        <path fill="currentColor" d="M6.96984 8.38109C8.83657 8.38109 10.3498 6.86782 10.3498 5.00109C10.3498 3.13437 8.83657 1.62109 6.96984 1.62109C5.10312 1.62109 3.58984 3.13437 3.58984 5.00109C3.58984 6.86782 5.10312 8.38109 6.96984 8.38109Z"></path>
                                    </svg>
                                </div>
                                <svg class="absolute -bottom-2.5 z-0" :class="i % 2 === 0 ? '-start-5' : '-end-5'" width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.4">
                                        <circle cx="2.39778" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="paths && paths.length > 0" class="flex items-start md:justify-center lg:mx-3 py-10 space-x-3 md:space-x-7 rtl:space-x-reverse max-w-screen-xl overflow-x-auto custom-scrollbar">
                    <a v-for="(path, index) in paths" :key="index" :href="`#${path.slug}`" class="group relative sepia hover:sepia-0 flex flex-col items-center">
                        <div class="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center transition duration-200 transform group-hover:bg-white dark:group-hover:bg-gray-900 group-hover:-translate-y-3 relative overflow-hidden">
                            <SeoImage
                                :src="path.icon"
                                :alt="$t('path.common.path_alt', { title: path.title })"
                                :width="40"
                                :height="40"
                                sizes-preset="icon"
                                img-class="w-10 h-10 object-contain"
                                picture-class="flex items-center justify-center"
                            />
                            <InstallmentImageBadge :allows-installment="path.allows_installment" />
                        </div>
                        <span class="absolute whitespace-nowrap block text-center dark:text-gray-200 text-gray-700 font-bold text-lg opacity-0 group-hover:opacity-100 -bottom-10 transition duration-200">{{ $t('path.common.learn', { title: path.title }) }}</span>
                    </a>
                </div>
                <div class="my-12 md:my-20 lg:px-24" id="paths">
                    <div v-for="(path, index) in paths" :key="index" :id="path.slug" class="flex justify-between sm:mb-28 mb-7 flex-col border-2 border-white dark:border-gray-900/60 rounded-xl p-3 md:p-5 lg:p-7" :class="index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'">
                        <div class="relative lg:mt-0 my-4" :class="index % 2 === 0 ? 'text-start' : 'lg:text-end'">
                            <div class="lg:absolute w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-900 flex items-center justify-center mb-3 relative overflow-hidden" :class="index % 2 === 0 ? 'sm:-start-16 -start-16' : 'sm:-end-16 -end-16'">
                                <SeoImage
                                    :src="path.icon"
                                    :alt="$t('path.common.path_alt', { title: path.title })"
                                    :width="40"
                                    :height="40"
                                    sizes-preset="icon"
                                    img-class="w-7/12 h-7/12 object-contain"
                                    picture-class="flex items-center justify-center w-full h-full"
                                />
                                <InstallmentImageBadge :allows-installment="path.allows_installment" />
                            </div>
                            <h3 class="dark:text-white text-gray-800 font-[700] text-2xl mb-4">{{ $t('path.common.learn', { title: path.title }) }}</h3>
                            <p class="dark:text-gray-300 text-gray-500 font-normal text-base leading-7 mb-7 max-w-lg">{{ path.short_description }}</p>
                            <NuxtLink :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="whitespace-nowrap h-10 rounded-lg inline-flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-amber-400 hover:shadow-md shadow-amber-400 hover:opacity-90">
                                {{ $t('path.common.roadmap_of', { title: path.title }) }}
                                <svg class="w-5 h-5 ms-3 ltr:rotate-180 text-current group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M15.7975 10.8106L19.4967 10.4834C20.3269 10.4834 21 11.163 21 12.0013C21 12.8396 20.3269 13.5192 19.4967 13.5192L15.7975 13.192C15.1463 13.192 14.6183 12.6589 14.6183 12.0013C14.6183 11.3426 15.1463 10.8106 15.7975 10.8106Z" fill="currentColor"></path>
                                    <path d="M3.37534 10.8698C3.43316 10.8115 3.64915 10.5647 3.85206 10.3598C5.03568 9.07656 8.12619 6.97815 9.7429 6.33596C9.98835 6.23352 10.6091 6.01542 10.9418 6C11.2592 6 11.5625 6.0738 11.8516 6.2192C12.2127 6.42299 12.5007 6.74463 12.66 7.12355C12.7614 7.38572 12.9207 8.17331 12.9207 8.18763C13.0789 9.04792 13.165 10.4469 13.165 11.9934C13.165 13.465 13.0789 14.8067 12.949 15.6813C12.9349 15.6967 12.7756 16.6738 12.6021 17.0086C12.2847 17.6211 11.664 18 10.9996 18H10.9418C10.5087 17.9857 9.5989 17.6057 9.5989 17.5924C8.06837 16.9502 5.05095 14.9532 3.83788 13.6258C3.83788 13.6258 3.49534 13.2844 3.34698 13.0718C3.11571 12.7656 3.00007 12.3866 3.00007 12.0077C3.00007 11.5847 3.12989 11.1915 3.37534 10.8698Z" fill="currentColor"></path>
                                </svg>
                            </NuxtLink>
                        </div>
                        <div class="xl:mt-0 mt-5">
                            <div class="relative dark:shadow dark:bg-gray-900 bg-white px-4 pt-3 pb-5 rounded-xl">
                                <NuxtLink :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="sepia hover:sepia-0 block relative overflow-hidden group rounded-xl z-10 lg:w-96 w-full md:h-56 h-48">
                                    <SeoImage
                                        :src="path.poster"
                                        :alt="$t('path.common.path_alt', { title: path.title })"
                                        :width="640"
                                        :height="360"
                                        sizes-preset="card"
                                        img-class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
                                    />
                                    <InstallmentImageBadge :allows-installment="path.allows_installment" />
                                </NuxtLink>
                                <svg class="absolute -bottom-2.5 z-0" :class="index % 2 === 0 ? '-end-5' : '-start-5'" width="67" height="68" viewBox="0 0 67 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.4">
                                        <circle cx="2.39778" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="2.39778" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="17.9486" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="33.4993" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="49.0501" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="2.46224" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="18.013" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="33.5648" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="49.1156" r="2.39778" fill="#CBD1DB"></circle>
                                        <circle cx="64.6009" cy="64.6663" r="2.39778" fill="#CBD1DB"></circle>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-16">
                <div class="mx-3 md:mx-auto my-12 md:my-10 max-w-2xl text-center">
                    <h5 class="w-max mx-auto relative mt-1 text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl sm:tracking-tight lg:text-5xl">
                        {{ $t('path.list.faq_title') }}
                        <svg class="stroke-current absolute text-yellow-300 -translate-x-2" viewBox="0 0 410 18" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.4c16.8 16.8 380.8-11.2 397.6 5.602" stroke-width="12" fill="none" fill-rule="evenodd" stroke-linecap="round"></path></svg>
                    </h5>
                    <p class="max-w-2xl mt-8 mx-auto text-base font-medium text-gray-500 dark:text-gray-400">{{ $t('path.list.faq_subtitle') }}</p>
                </div>
                <div class="md:ps-20 lg:ps-32 lg:pe-10">
                    <Disclosure v-slot="{ open }" as="div" v-for="(question, index) in questions" :key="index" class="mb-5 last:mb-0">
                        <DisclosureButton class="flex items-center justify-between w-full p-3 font-medium rounded-xl focus:ring-0 dark:focus:ring-0 bg-gray-400/20 dark:bg-slate-900" :class="[open ? 'text-gray-900 dark:text-amber-400' : 'text-gray-600 dark:text-gray-200']">
                            <div class="flex items-center">
                                <svg class="w-6 h-6 md:w-9 md:h-9 me-2 text-current flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                                <span class="text-start font-semibold">{{ question.question }}</span>
                            </div>
                            <svg class="ms-2 ltr:rotate-180 flex-shrink-0" :class="open && '-rotate-90 transform transition duration-300'" width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" opacity="0.4" d="M12.4789 4.53947L15.8693 4.23962C16.6302 4.23962 17.2471 4.86253 17.2471 5.63081C17.2471 6.3991 16.6302 7.022 15.8693 7.022L12.4789 6.72216C11.882 6.72216 11.3981 6.23353 11.3981 5.63081C11.3981 5.02709 11.882 4.53947 12.4789 4.53947"></path>
                                <path fill="currentColor" d="M1.09392 4.5946C1.14691 4.5411 1.34488 4.31495 1.53085 4.12717C2.61567 2.95102 5.44819 1.02779 6.92994 0.439206C7.1549 0.345316 7.7238 0.145421 8.02875 0.131287C8.3197 0.131287 8.59765 0.198928 8.86261 0.332191C9.19355 0.518962 9.45751 0.813757 9.60348 1.16105C9.69647 1.40133 9.84244 2.12317 9.84244 2.1363C9.98742 2.92477 10.0664 4.20693 10.0664 5.62437C10.0664 6.97315 9.98742 8.20281 9.86844 9.00441C9.85544 9.01855 9.70947 9.91404 9.55049 10.2209C9.25954 10.7823 8.69064 11.1296 8.08174 11.1296H8.02875C7.63182 11.1164 6.79796 10.7681 6.79796 10.756C5.3952 10.1674 2.62966 8.33708 1.51785 7.12055C1.51785 7.12055 1.2039 6.80758 1.06793 6.61274C0.855964 6.33208 0.749982 5.98478 0.749982 5.63749C0.749982 5.24981 0.868961 4.8894 1.09392 4.5946"></path>
                            </svg>
                        </DisclosureButton>
                        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-300 ease-out" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                            <DisclosurePanel>
                                <div class="mt-2 ms-5 md:ms-10 p-2 md:p-3 rounded-xl text-base leading-8 text-gray-600 dark:text-white bg-white/75 dark:bg-gray-900">
                                    {{ question.answer }}
                                </div>
                            </DisclosurePanel>
                        </transition>
                    </Disclosure>
                </div>
            </div>
        </section>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import InstallmentImageBadge from "@/views/components/payment/InstallmentImageBadge.vue";
import { useSEO } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    inject: {
        ssrPathsData: { from: 'ssrPathsData', default: null },
    },
    components: {
        MasterPage,
        InstallmentImageBadge,
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        SeoImage,
    },
    data() {
        return {
            loading: false,
            paths: [],
        };
    },
    computed: {
        questions() {
            return [
                {
                    question: this.$t("path.list.q1"),
                    answer: this.$t("path.list.a1"),
                },
                {
                    question: this.$t("path.list.q2"),
                    answer: this.$t("path.list.a2"),
                },
                {
                    question: this.$t("path.list.q3"),
                    answer: this.$t("path.list.a3"),
                },
            ];
        },
    },
    methods: {
        getPaths() {
            this.loading = true;
            axiosInstance
                .get("/paths")
                .then(
                    (response) => {
                        this.paths = response.data.paths;
                    },
                    (error) => {
                        console.error(error.response.data);
                    }
                )
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        useSEO({
            title: this.$t("path.list.seo.title"),
            description: this.$t("path.list.seo.description"),
            url: "/paths",
            keywords: this.$t("path.list.seo.keywords").split("|")
        });

        if (!this.paths?.length) {
            this.getPaths();
        }
    },
    created() {
        const ssr = this.ssrPathsData;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        if (Array.isArray(payload) && payload.length) {
            this.paths = payload;
            this.loading = false;
        }
    },
};
</script>


