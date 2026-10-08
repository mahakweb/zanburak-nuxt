<template>
    <MasterPage>
        <div class="mx-2 md:mx-14">
            <div class="flex flex-col items-center my-16">
                <div v-if="receiptLoading" class="max-w-md w-full text-center md:w-2/3 lg:w-1/3 bg-white dark:bg-gray-900 p-6 mx-auto rounded-xl md:rounded-3xl">
                    <div class="animate-pulse mx-auto avatar">
                        <div class="bg-gray-200 dark:bg-gray-700 w-20 h-20 mask mask-squircle"></div>
                    </div>

                    <div class="animate-pulse justify-center mx-auto text-center w-[95%] md:w-[90%]">
                        <div class="mx-auto mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-32 text-center"></div>
                        <!-- <div class="mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-40 mt-6"></div> -->

                        <div class="mt-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-12"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                        </div>
                        <div class="mt-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                        </div>
                        <div class="my-4 w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24"></div>
                        </div>
                        <div class="w-full justify-between flex items-center pt-4 border-gray-100 border-t border-dashed dark:border-opacity-10">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16"></div>
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20"></div>
                        </div>
                        <hr class="my-4 border-gray-100 border-t dark:border-opacity-10 mx-2" />
                        <div class="mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 w-40"></div>
                    </div>
                </div>
                <div v-else id="printable-area" ref="printableArea" class="max-w-md w-full md:w-2/3 lg:w-1/3 bg-white dark:bg-gray-900 p-3 md:p-6 mx-auto rounded-xl md:rounded-3xl">
                    <div v-if="receiptDetail">
                        <div class="mask mask-squircle p-2 bg-opacity-20" :class="[receiptDetail.status ? 'bg-green-500' : 'bg-rose-500']">
                            <svg v-if="receiptDetail.status" class="mx-auto w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L12.0243 14.3899C11.4586 14.9556 10.5414 14.9556 9.97568 14.3899L11 13.3656L9.97568 14.3899L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
                                    class="fill-green-500"
                                ></path>
                            </svg>
                            <svg v-else class="mx-auto w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289ZM7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782Z"
                                    class="fill-rose-500"
                                ></path>
                            </svg>
                        </div>

                        <div class="mx-auto text-center w-[95%] md:w-[90%]">
                            <h3 v-if="receiptDetail.status" class="mt-8 md:text-lg md:whitespace-nowrap text-xl text-gray-900 dark:text-green-400 font-extrabold text-center">{{ $t("payment.success") }}!</h3>
                            <h3 v-else class="mt-8 md:text-lg md:whitespace-nowrap text-xl text-gray-900 dark:text-rose-500 font-extrabold text-center">{{ $t("payment.failed") }}!</h3>

                            <p v-if="receiptDetail.status === 0" class="mb-6 text-gray-600 dark:text-gray-400 my-2">{{ $t("payment.failedDesc") }}.</p>

                            <div class="mt-6 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t("payment.amount") }}:</div>
                                <div class="flex items-center text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ receiptDetail.amount.toLocaleString() }}
                                    <svg class="ms-1 w-3 h-3" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            class=""
                                            d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div v-if="Number(receiptDetail.wallet_paid_amount) > 0" class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t('panel.financial.walletPart') }}</div>
                                <div class="text-end text-gray-800 dark:text-gray-50 font-semibold my-2">{{ Number(receiptDetail.wallet_paid_amount).toLocaleString() }}</div>
                            </div>
                            <div v-if="Number(receiptDetail.gateway_paid_amount) > 0" class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t('panel.financial.gatewayPart') }}</div>
                                <div class="text-end text-gray-800 dark:text-gray-50 font-semibold my-2">{{ Number(receiptDetail.gateway_paid_amount).toLocaleString() }}</div>
                            </div>
                            <div v-if="receiptDetail.status === 1" class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t("payment.trackingCode") }}:</div>
                                <div class="text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ receiptDetail.tracking_number }}
                                </div>
                            </div>
                            <div class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t('receipt.referenceId') }}:</div>
                                <div class="font-sans text-xs text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ receiptDetail.reference_id }}
                                </div>
                            </div>
                            <div class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t("payment.date") }}:</div>
                                <div class="ltr:hidden text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ moment(receiptDetail.updated_at).format("jYYYY/jM/jD") }}
                                </div>
                                <div class="rtl:hidden text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ moment(receiptDetail.updated_at).format("YYYY/M/D") }}
                                </div>
                            </div>
                            <div class="mt-1 w-full justify-between flex items-center border-gray-100 border-t border-dashed dark:border-opacity-10">
                                <div class="text-start text-gray-500 dark:text-gray-400 font-semibold my-2">{{ $t("payment.time") }}:</div>
                                <div class="text-end text-gray-800 dark:text-gray-50 font-semibold my-2">
                                    {{ moment(receiptDetail.updated_at).format("HH:mm a") }}
                                </div>
                            </div>
                            <hr class="my-1 border-gray-100 border-t dark:border-opacity-10 mx-2" />
                            <div v-if="receiptDetail.status === true && receiptDetail.paid_at && receiptDetail.items && receiptDetail.items.length" class="mt-3">
                                <div class="text-start text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                                    {{ $t('receipt.activatedItems') }}
                                </div>
                                <ul class="space-y-0.5">
                                    <li v-for="(pItem, pIndex) in receiptDetail.items" :key="pIndex" class="group py-2 px-1 flex items-center first:rounded-t-lg last:rounded-b-lg bg-gray-100 dark:bg-gray-800">
                                        <!-- Course -->
                                        <template v-if="pItem.payable_type === 'Course' && pItem.payable">
                                            <router-link :to="{ name: 'course.show', params: { courseSlug: pItem.payable.slug } }" class="flex items-center w-full">
                                                <div class="flex-shrink-0 border-2 border-gray-300 dark:border-gray-600 w-12 h-10 rounded-ss-lg rounded-ee-lg overflow-hidden">
                                                    <SeoImage
                                                        :src="pItem.payable.poster"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover transition-all duration-200 transform group-hover:scale-125 group-hover:rotate-12"
                                                    />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.coursePrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                    <p v-if="pItem.payable.english_title" class="line-clamp-1 text-xs text-gray-500 truncate dark:text-gray-400">
                                                        {{ pItem.payable.english_title }}
                                                    </p>
                                                </div>
                                            </router-link>
                                        </template>

                                        <!-- Path -->
                                        <template v-else-if="pItem.payable_type === 'Path' && pItem.payable">
                                            <router-link :to="{ name: 'path.show', params: { pathSlug: pItem.payable.slug } }" class="flex items-center w-full">
                                                <div class="flex-shrink-0 border-2 border-gray-300 dark:border-gray-600 w-12 h-10 rounded-ss-lg rounded-ee-lg overflow-hidden">
                                                    <SeoImage
                                                        v-if="pItem.payable.poster"
                                                        :src="pItem.payable.poster"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover transition-all duration-200 transform group-hover:scale-125 group-hover:rotate-12"
                                                    />
                                                    <SeoImage
                                                        v-else-if="pItem.payable.icon"
                                                        :src="pItem.payable.icon"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover transition-all duration-200 transform group-hover:scale-125 group-hover:rotate-12"
                                                    />
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.pathPrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                    <p v-if="pItem.payable.english_title" class="line-clamp-1 text-xs text-gray-500 truncate dark:text-gray-400">
                                                        {{ pItem.payable.english_title }}
                                                    </p>
                                                </div>
                                            </router-link>
                                        </template>

                                        <!-- Plan (VIP) -->
                                        <template v-else-if="pItem.payable_type === 'Plan' && pItem.payable">
                                            <div class="flex items-center w-full">
                                                <div class="flex-shrink-0 border-2 border-gray-300 dark:border-gray-600 w-12 h-10 rounded-ss-lg rounded-ee-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                    <SeoImage
                                                        v-if="pItem.payable.icon"
                                                        :src="pItem.payable.icon"
                                                        :alt="pItem.payable.title || ''"
                                                        :width="48"
                                                        :height="40"
                                                        sizes-preset="icon"
                                                        img-class="w-full h-full object-cover"
                                                    />
                                                    <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none">
                                                        <path d="M11.1992,1.40101 C11.5997,0.867117 12.4005,0.86717 12.8008,1.40101 L15.5,4.99994 L20.1451,4.99994 C21.2924,4.99994 22.0149,6.23543 21.4525,7.23534 L13.0895,22.1028 C12.6116,22.9524 11.3885,22.9524 10.9106,22.1028 L2.5476,7.23534 C1.98516,6.23543 2.70773,4.99994 3.85497,4.99994 L8.50004,4.99994 L11.1992,1.40101 Z M11.9967,3.66663 L9.33002,7.22218 L11.9967,11.6666 L14.6633,7.22218 L11.9967,3.66663 Z" fill="currentColor"></path>
                                                    </svg>
                                                </div>
                                                <div class="flex-1 min-w-0 ms-4 text-start">
                                                    <p class="line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
                                                        {{ $t('receipt.subscriptionPrefix', { title: pItem.payable.title }) }}
                                                    </p>
                                                    <p v-if="pItem.payable.english_title" class="line-clamp-1 text-xs text-gray-500 truncate dark:text-gray-400">
                                                        {{ pItem.payable.english_title }}
                                                    </p>
                                                </div>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                            </div>
                            <div v-if="receiptDetail.status" class="mt-3 text-xs text-gray-400 dark:text-gray-600">
                                {{ $t("payment.thankYou") }}
                            </div>
                            <div v-else class="mt-3 text-xs text-gray-400 dark:text-gray-600">
                                {{ $t("payment.failedRefundNote") }}
                            </div>
                        </div>
                    </div>
                    <div v-else-if="errorCode" class="">
                        <div v-if="errorCode === 400 || errorCode === 404" class="border border-rose-500 border-opacity-50 rounded-xl justify-center text-center p-4">
                            <svg class="mx-auto w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289ZM7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782Z"
                                    class="fill-rose-500"
                                ></path>
                            </svg>
                            <div class="my-4 text-rose-800 dark:text-rose-500 text-lg font-bold">
                                {{ $t("payment.error") }}
                            </div>
                            <div class="text-rose-700 dark:text-rose-600 font-semibold">
                                {{ $t("payment.unknownError") }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="receiptDetail" class="py-6 text-center flex flex-wrap items-center justify-center gap-2 mt-6 receipt-export-actions">
                    <button
                        type="button"
                        :disabled="exporting"
                        @click="printReceipt"
                        class="rounded-lg py-2 px-4 flex items-center bg-gray-500 border-gray-500 group hover:bg-transparent hover:text-gray-500 dark:hover:text-gray-300 hover:shadow-lg transition duration-200 text-white font-semibold border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ $t('receipt.print') }}
                        <svg class="ms-2.5 w-5 h-5" fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M408,112H106a58,58,0,0,0-58,58V328a56,56,0,0,0,56,56h8v39.68A40.32,40.32,0,0,0,152.32,464H359.68A40.32,40.32,0,0,0,400,423.68V384h8a56,56,0,0,0,56-56V168A56,56,0,0,0,408,112ZM368,423.68a8.35,8.35,0,0,1-8.32,8.32H152.32a8.35,8.35,0,0,1-8.32-8.32V264.32a8.35,8.35,0,0,1,8.32-8.32H359.68a8.35,8.35,0,0,1,8.32,8.32ZM394,207.92a24,24,0,1,1,22-22A24,24,0,0,1,394,207.92Z"></path>
                            <path fill="currentColor" d="M344,48H168a56.09,56.09,0,0,0-55.42,48H399.42A56.09,56.09,0,0,0,344,48Z"></path>
                        </svg>
                    </button>
                    <button
                        type="button"
                        :disabled="exporting"
                        @click="exportPng"
                        class="rounded-lg py-2 px-4 flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ exporting ? $t('receipt.exporting') : $t('receipt.exportPng') }}
                    </button>
                    <button
                        type="button"
                        :disabled="exporting"
                        @click="exportPdf"
                        class="rounded-lg py-2 px-4 flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ $t('receipt.exportPdf') }}
                    </button>
                    <router-link :to="{ name: 'courses' }" class="inline-flex items-center text-white transition-all ease-in-out bg-orange-500 hover:bg-gray-600 rounded-lg py-2 px-4">
                        <span class="font-semibold">
                            {{ $t("course.plural") }}
                        </span>
                        <svg class="ms-2 ltr:rotate-180" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.4" d="M17.6954 12.4962L21.6468 12.1467C22.5335 12.1467 23.2525 12.8727 23.2525 13.7681C23.2525 14.6635 22.5335 15.3895 21.6468 15.3895L17.6954 15.04C16.9997 15.04 16.4357 14.4705 16.4357 13.7681C16.4357 13.0645 16.9997 12.4962 17.6954 12.4962" fill="white"></path>
                            <path d="M4.42637 12.5604C4.48813 12.4981 4.71885 12.2345 4.93559 12.0157C6.19989 10.6449 9.50107 8.40347 11.228 7.71751C11.4902 7.60808 12.1532 7.37512 12.5086 7.35864C12.8477 7.35864 13.1716 7.43748 13.4804 7.59279C13.8661 7.81046 14.1738 8.15403 14.3439 8.55878C14.4522 8.83882 14.6224 9.68009 14.6224 9.69539C14.7913 10.6143 14.8834 12.1086 14.8834 13.7606C14.8834 15.3325 14.7913 16.7656 14.6527 17.6999C14.6375 17.7163 14.4674 18.76 14.2821 19.1177C13.943 19.7719 13.28 20.1766 12.5704 20.1766H12.5086C12.046 20.1613 11.0742 19.7554 11.0742 19.7413C9.43931 19.0553 6.21621 16.9221 4.92044 15.5043C4.92044 15.5043 4.55455 15.1396 4.39608 14.9125C4.14904 14.5854 4.02552 14.1806 4.02552 13.7759C4.02552 13.3241 4.16419 12.904 4.42637 12.5604" fill="white"></path>
                        </svg>
                    </router-link>
                </div>
            </div>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import { computed } from "vue";
import moment from "moment-jalaali";
import {
    buildPaymentReceiptFilename,
    downloadPaymentReceiptPdf,
    downloadPaymentReceiptPng,
    printPaymentReceipt,
} from "@/utils/paymentReceiptExport";
import { showToastError } from "@/utils/toastConfig";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        SeoImage,
    },
    setup() {
        moment().format("jYYYY/jM/jD");
        const isRtl = computed(() => (localStorage.getItem("direction") === "rtl" ? true : false));
        if (isRtl.value) moment.loadPersian();

        return {
            moment,
        };
    },
    data() {
        return {
            receiptDetail: null,
            errorCode: null,
            receiptLoading: false,
            exporting: false,
        };
    },
    mounted() {
        document.title = this.$t("receipt.pageTitle");
        this.getReceiptDetail();
    },
    methods: {
        getReceiptDetail() {
            this.receiptLoading = true;
            axiosInstance.post("/payment/receipt/detail", { uuid: this.$route.params.uuid }).then(
                (response) => {
                    this.receiptDetail = response.data.detail;
                    this.receiptLoading = false;
                },
                (error) => {
                    this.errorCode = error.response.status;
                    this.receiptLoading = false;
                }
            );
        },
        getPrintableElement() {
            return this.$refs.printableArea || document.getElementById('printable-area');
        },
        exportFilename(ext) {
            return buildPaymentReceiptFilename(this.receiptDetail?.reference_id, ext);
        },
        printReceipt() {
            const element = this.getPrintableElement();
            if (!element) return;
            printPaymentReceipt(element);
        },
        async exportPng() {
            const element = this.getPrintableElement();
            if (!element) return;

            this.exporting = true;
            try {
                await downloadPaymentReceiptPng(element, this.exportFilename('png'));
            } catch (error) {
                console.error('Payment receipt PNG export failed:', error);
                showToastError(this.$t('receipt.exportError'));
            } finally {
                this.exporting = false;
            }
        },
        async exportPdf() {
            const element = this.getPrintableElement();
            if (!element) return;

            this.exporting = true;
            try {
                await downloadPaymentReceiptPdf(element, this.exportFilename('pdf'));
            } catch (error) {
                console.error('Payment receipt PDF export failed:', error);
                showToastError(this.$t('receipt.exportError'));
            } finally {
                this.exporting = false;
            }
        },
    },
};
</script>

<style>
@media print {
    body *:not(#payment-receipt-print-root):not(#payment-receipt-print-root *) {
        display: none !important;
    }

    #payment-receipt-print-root {
        display: block !important;
        position: static !important;
    }

    #payment-receipt-print-root #printable-area,
    #payment-receipt-print-root #printable-area * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .receipt-export-actions {
        display: none !important;
    }
}

@page {
    size: A5 portrait;
    margin: 10mm;
}
</style>
