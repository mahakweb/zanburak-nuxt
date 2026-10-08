<template>
    <MasterPage>
        <div class="mx-auto max-w-screen-xl px-2 pb-20">
            <!-- Hero -->
            <section
                class="relative my-5 md:my-8 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div
                    class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-[#0f1524] dark:via-[#151c2c] dark:to-[#0f1a2e]">
                </div>
                <div
                    class="absolute -top-16 -start-16 w-56 h-56 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl">
                </div>
                <div
                    class="absolute -bottom-10 -end-10 w-48 h-48 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl">
                </div>

                <div class="relative grid lg:grid-cols-12 gap-6 px-4 py-8 md:px-10 md:py-10 items-center">
                    <div class="lg:col-span-7 text-center lg:text-start">
                        <span
                            class="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1.5 rounded-full bg-blue-500/15 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 text-[11px] font-bold mb-4 ring-1 ring-blue-500/20">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                <path d="M12 3l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17.8 5.8 22.3l2.4-7.4L2 10.4h7.6L12 3z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                            {{ $t('articles.list.featured') }}
                        </span>

                        <h1 class="text-2xl md:text-3xl xl:text-[2.35rem] font-extrabold tracking-tight text-gray-800 dark:text-white mb-1 leading-tight">
                            {{ $t('articles.list.title') }}
                        </h1>
                        <p class="text-base md:text-lg xl:text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                            {{ $t('articles.list.subtitle') }}
                        </p>

                        <div class="flex justify-center lg:justify-start mb-4">
                            <span class="inline-block w-20 h-0.5 bg-blue-500 rounded-full"></span>
                            <span class="inline-block w-2 h-0.5 mx-1 bg-blue-500/70 rounded-full"></span>
                            <span class="inline-block w-1 h-0.5 bg-blue-500/40 rounded-full"></span>
                        </div>

                        <p
                            class="text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-7 md:leading-8 max-w-xl mx-auto lg:mx-0 mb-2">
                            {{ $t('articles.list.description') }}
                        </p>
                        <p
                            class="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-6 max-w-lg mx-auto lg:mx-0 mb-5">
                            {{ $t('articles.list.descriptionSecondary') }}
                        </p>

                        <div class="flex flex-wrap items-center gap-2 justify-center lg:justify-start mb-6">
                            <span
                                class="inline-flex items-center gap-1 rounded-lg bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                <svg class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                                {{ $t('articles.list.heroTag1') }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-lg bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                <svg class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5" />
                                </svg>
                                {{ $t('articles.list.heroTag2') }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-lg bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                                <svg class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19h16M6 16l3-9 3 5 3-7 3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                {{ $t('articles.list.heroTag3') }}
                            </span>
                        </div>

                        <div class="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                            <a href="#articles-page"
                                class="group h-10 px-5 rounded-xl inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition">
                                {{ $t('articles.list.browse') }}
                                <svg class="w-4 h-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                            <router-link :to="{ name: 'tags-index' }"
                                class="h-10 px-5 rounded-xl inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400/50 hover:text-blue-700 dark:hover:text-blue-300 transition">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                {{ $t('articles.list.categories') }}
                            </router-link>
                        </div>
                    </div>

                    <div class="lg:col-span-5">
                        <svg class="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 855.233 547.777" role="img"
                            artist="Katerina Limpitsouni" source="https://undraw.co/">
                            <g transform="translate(-514 -257.762)">
                                <g transform="translate(700.352 257.762)">
                                    <rect width="14.154" height="57.623" rx="6.03" transform="translate(332.091 79.373)"
                                        fill="#535461" />
                                    <rect width="145.733" height="151.168" transform="translate(326.862 109.853)"
                                        fill="#090814" />
                                    <path
                                        d="M241.237,372.333l8.8,63.928,4.145,30.048,1.525,11.036,12.776,24.906,23.46,45.707,45.25,5.435L416.8,441.128s41.68-79.655-21.69-72.422c-35.532,4.066-31.933-30.359-32.568-59.087-.16-14.464-10.9-26.29-8.144-40.489L291.04,299.911q2.209,10.293,3.323,18.914c3.089,23.518.528,38.181-4.829,47.066C275.273,389.556,241.237,372.333,241.237,372.333Z"
                                        transform="translate(90.6 -137.107)" fill="#ed9da0" />
                                    <ellipse cx="73.321" cy="73.321" rx="73.321" ry="73.321"
                                        transform="translate(331.837 48.08)" fill="#ed9da0" />
                                    <path
                                        d="M225.9,589.1c2.209,8.8-3.363,23.919-10.752,38.767,35.434,3.812,74.289,1.828,74.289,1.828l39.872,10.87L441.543,673.15c4.887-6.324,8.8-14.271,12.033-23.225l-11.124-12.981c-35-21.387-46.44-48.122-48.112-71.66a100.679,100.679,0,0,1,3.089-31.758,106.311,106.311,0,0,1,9.716-25.112l-104.19.489h-.88l-8.563,19.462-.391.88-6.373,14.477L265.028,504.8l-7.536-12.179-4.223-6.842s-62.461-14.506-63.37,22.639a99.22,99.22,0,0,0,.5,12.766c3.108,29.872,19.452,49.734,32.99,63.273A9.774,9.774,0,0,1,225.9,589.1Z"
                                        transform="translate(117.494 -141.924)" fill="#fed700" />
                                    <path
                                        d="M464.263,635.765c1.808,21.72,54.309-7.243,54.309-7.243s16.295-5.435,71.513-40.732a168.6,168.6,0,0,0,63.537-74.181,106.555,106.555,0,0,0,5.288-14.525L620.866,471l-11.094,16.959-36.881,56.352-54.309,36.167S462.455,614.045,464.263,635.765Z"
                                        transform="translate(-356.017 -141.652)" fill="#ed9da0" />
                                    <path d="M61.85,629.244H729.111l-79.7-27.414L450.172,533.289,323.122,489.58H159.48Z"
                                        transform="translate(-60.23 -81.467)" fill="#f2f2f2" />
                                    <path
                                        d="M381.9,440.11l5.669,41.054,12.776,24.906a77.888,77.888,0,0,1,24.261-2.278c-9-1.241-14.819-57.5-14.819-57.5l-.518-.117Z"
                                        transform="translate(-41.246 -140.957)" opacity="0.1" />
                                    <path
                                        d="M387.48,486.314c18.1-2.717,38.924,23.538,38.924,23.538s24.437,23.538,40.732,7.243c15.786-15.786,43.459-13.685,45.179-13.587C503.315,502.257,497.5,446,497.5,446l-.518-.117L410.109,426.57s-5.181,7.937-11.026,18.044C388.536,462.825,375.829,488.064,387.48,486.314Z"
                                        transform="translate(-129.874 -140.652)" fill="#fed700" />
                                    <path
                                        d="M383.7,374.562l8.8,63.928,4.145,30.048C408.782,467.629,423.5,466,423.5,466s-15.386-64.27,9.961-97.749c0,0-.538,0-1.505-.1C417.733,391.786,383.7,374.562,383.7,374.562Z"
                                        transform="translate(-51.861 -139.338)" opacity="0.1" />
                                    <path
                                        d="M495.93,368.219s-46.167-3.617-64.27,9.052-40.12,51.908-40.12,51.908L384.61,444s10.83,1.157,9.93,2.975,14.486,10.86,21.72,8.142,25.346,11.73,27.155,13.577,42.54-2.717,42.54-2.717S470.584,401.708,495.93,368.219Z"
                                        transform="translate(-115.219 -139.328)" fill="#fed700" />
                                    <path
                                        d="M175.2,614.785c20.82,24.437,127.63,19.012,127.63,19.012l39.833,10.85L454.9,677.236c26.4-34.212,25.81-115.744,24.373-148.724-.391-8.856-.831-14.213-.831-14.213s-38.014-23.538-55.218,0c-3.069,4.193-16.84,7.409-19.02,14.213-9.98,31.368,0,85.354,0,85.354l-45.258-4.526L293.193,593.7a59.408,59.408,0,0,0-13.831-1.613C252.1,592.166,157.33,593.808,175.2,614.785Z"
                                        transform="translate(107.755 -142.393)" fill="#ed9da0" />
                                    <path
                                        d="M131.735,526.6s8.142,1.808,24.437-1.808,22.629,3.617,31.68,7.243,32.589,5.435,41.641,1.808,18.1-10.86,37.144-2.717,31.68-8.152,50.683-6.373S349,517.51,349,517.51l-20.2-46.646-6.06-14.007L171.3,446.5h-.723Z"
                                        transform="translate(278.892 -141.102)" fill="#fed700" />
                                    <path
                                        d="M197.7,374.624s49.783-9.961,73.311,2.717,41.631,40.732,41.631,40.732,14.263,37.864,12.3,48.874-33.106,0-33.106,0-38.923-9.052-44.358,4.526-30.781,6.334-30.781,6.334-52.5-14.486-62.461,1.808Z"
                                        transform="translate(280.779 -139.398)" fill="#fed700" />
                                    <path
                                        d="M207.651,442.555c4.477,11.788,17.751,17.663,30.165,19.9a99.6,99.6,0,0,0,36.978-.332,74.348,74.348,0,0,1-19.99-41.054c-3.333-24,5.239-48.493,1.711-72.451-3.626-24.6-19.657-46.186-22.433-70.9,5.513,3.558,11.857-3.206,14.75-9.1a240.156,240.156,0,0,0,13.4-33.567c4.487-14.291,8.5-30.3,20.84-38.787,2.18-1.505,5.122-2.717,7.38-1.32,1.652.977,36.5,29.439,42.29,44.761,5.777,15.239,8.445,34.21,14.145,49.508,13.059,34.994-21.407,78.14-23.46,115.441-.919,16.471.45,32.98,1.818,49.412.225,2.629.645,5.6,2.825,7.077a8.319,8.319,0,0,0,4.672.977,63.838,63.838,0,0,0,21.514-3.6c2.786-.977,5.581-2.17,8.533-2.219,4.36-.068,8.328,2.326,12.512,3.578,14.105,4.242,28.787-4.839,39.031-15.415s18.924-23.391,32.1-29.931c4.311-2.15,9.951-5.259,8.8-9.941a9.461,9.461,0,0,0-2.807-4.1c-5.337-5.366-10.948-10.557-15.317-16.735-6.588-9.335-10.019-20.469-13.362-31.4-4.829-15.816-9.706-32.022-8.8-48.532.43-8.182,2.287-16.226,3-24.437,1.408-16.265-1.779-32.531-4.946-48.542-2.15-10.909-4.487-22.218-11.2-31.084-4.565-6.021-10.84-10.488-15.962-16.05-7.644-8.3-12.434-18.758-18.631-28.191s-14.6-18.367-25.63-20.762c-6.676-1.456-13.626-.342-20.371.782-5.386.909-10.9,1.847-15.992,3.91-4.017,1.6-7.712,5.562-11.828,6.315-8.191,1.535-17.194-1.681-25.962.391-17.057,4.017-32.619,15.454-40.184,31.436a71.942,71.942,0,0,0-3.734,9.775c-1.447,4.692-2.551,9.491-3.646,14.281-.235.977-.459,2.033-.674,3.04h0c-6.7,31.827-2.375,55,.547,88.111s3.636,77.466-5.572,109.478C210.319,415.654,202.725,429.584,207.651,442.555Z"
                                        transform="translate(99.875 -134.066)" fill="#090814" />
                                    <ellipse cx="1.359" cy="1.359" rx="1.359" ry="1.359"
                                        transform="translate(299.707 522.625)" opacity="0.2" />
                                    <g transform="translate(22.475 300.621)">
                                        <path
                                            d="M593.876,641.858,371.449,619.19l-2.717,43.449,100.847,8.172a65.863,65.863,0,0,0,20.732-1.583L594.061,644.7a1.447,1.447,0,0,0-.186-2.844Z"
                                            transform="translate(-168.585 -445.725)" fill="#090814" />
                                        <path
                                            d="M742.788,391.88,514.9,389.07a24,24,0,0,0-15.1,6.683,15.757,15.757,0,0,0-4.711,13.434L520.938,584c1.276,8.667,10,15.352,20.732,15.877l232.925,11.71a25.076,25.076,0,0,0,17.707-5.814c4.524-4,6.587-9.45,5.616-14.826L766.99,407.231C765.268,397.68,754.609,390.921,742.788,391.88Z"
                                            transform="translate(-494.95 -389.07)" fill="#090814" />
                                        <ellipse cx="10.86" cy="10.86" rx="10.86" ry="10.86"
                                            transform="translate(129.868 73.439)" fill="#f2f2f2" />
                                    </g>
                                </g>
                                <g transform="translate(78 -35)">
                                    <rect width="196" height="40" rx="16" transform="translate(483 293)"
                                        fill="#e6e6e6" />
                                    <path
                                        d="M2.109,2.539v-20H9.19a7.361,7.361,0,0,1,3.453.718,4.787,4.787,0,0,1,2.025,1.919,5.416,5.416,0,0,1,.664,2.664,4.424,4.424,0,0,1-.456,2.128,3.692,3.692,0,0,1-1.2,1.336,5.574,5.574,0,0,1-1.616.738v.188a3.9,3.9,0,0,1,1.871.644,4.708,4.708,0,0,1,1.556,1.678,5.265,5.265,0,0,1,.624,2.658,5.365,5.365,0,0,1-.691,2.711,4.759,4.759,0,0,1-2.166,1.913,8.94,8.94,0,0,1-3.835.7ZM4.657.284H9.351a4.888,4.888,0,0,0,3.319-.9,2.866,2.866,0,0,0,.986-2.2,3.522,3.522,0,0,0-.51-1.852A3.733,3.733,0,0,0,11.7-6.025a4.557,4.557,0,0,0-2.219-.51H4.657Zm0-8.966h4.4a4.077,4.077,0,0,0,2.722-.94,3.089,3.089,0,0,0,1.113-2.483,2.984,2.984,0,0,0-.905-2.2,3.91,3.91,0,0,0-2.85-.9H4.657Z"
                                        transform="translate(504.891 320.461)" fill="#090814" />
                                    <g transform="translate(-147 -78.406)">
                                        <path
                                            d="M9.137,17.31a1.12,1.12,0,0,1-.8-.341,1.183,1.183,0,0,1,0-1.646l6.821-6.982a1.118,1.118,0,0,1,1.608,0,1.183,1.183,0,0,1,0,1.646L9.941,16.969A1.12,1.12,0,0,1,9.137,17.31Z"
                                            transform="translate(703.684 378.752)" />
                                        <path
                                            d="M18.095,16.9a1.123,1.123,0,0,1-.859-.4,1.183,1.183,0,0,1,.112-1.642l.575-.512c1.882-1.956,2.759-6.032,1.111-7.72s-5.628-.791-7.54,1.135l-.5.59a1.119,1.119,0,0,1-1.6.12,1.183,1.183,0,0,1-.117-1.641L9.8,6.2q.027-.032.056-.062A9.741,9.741,0,0,1,15.068,3.53a6.132,6.132,0,0,1,5.575,1.448,6.488,6.488,0,0,1,1.414,5.707,10.153,10.153,0,0,1-2.552,5.331q-.028.029-.058.056l-.607.54A1.117,1.117,0,0,1,18.095,16.9Z"
                                            transform="translate(703.821 378)" />
                                        <path
                                            d="M9.162,22.49a5.67,5.67,0,0,1-4.146-1.568A7.078,7.078,0,0,1,3,15.981c0-2.06,2.053-4.993,3.152-6.105L6.2,9.83l.6-.539a1.119,1.119,0,0,1,1.6.1,1.183,1.183,0,0,1-.1,1.643l-.571.516c-1.079,1.1-2.456,3.435-2.456,4.429a4.708,4.708,0,0,0,1.341,3.287c1.655,1.675,5.64.8,7.581-1.105l.4-.547a1.12,1.12,0,0,1,1.591-.24A1.182,1.182,0,0,1,16.417,19l-.451.621a1.157,1.157,0,0,1-.113.133,9.854,9.854,0,0,1-5.236,2.607A8.875,8.875,0,0,1,9.162,22.49Z"
                                            transform="translate(703 378.916)" />
                                    </g>
                                    <rect width="2" height="40" transform="translate(591 293)" fill="#fff" />
                                    <path
                                        d="M.773,1.965,3.22-12.564H5.6L3.154,1.965ZM4.821-14.942A1.39,1.39,0,0,1,3.736-15.4a1.245,1.245,0,0,1-.3-1.092,1.723,1.723,0,0,1,.675-1.1,1.965,1.965,0,0,1,1.243-.448,1.415,1.415,0,0,1,1.1.448,1.247,1.247,0,0,1,.3,1.1A1.741,1.741,0,0,1,6.077-15.4,1.965,1.965,0,0,1,4.821-14.942Z"
                                        transform="translate(536.227 321.035)" />
                                    <g transform="translate(7 -48)">
                                        <path d="M2,0A2,2,0,1,1,0,2,2,2,0,0,1,2,0Z" transform="translate(608 355)"
                                            fill="#090814" />
                                        <path
                                            d="M6,2H18a4,4,0,0,1,4,4V18a4,4,0,0,1-4,4H6a4,4,0,0,1-4-4V6A4,4,0,0,1,6,2ZM18,20a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V18a2,2,0,0,0,2,2Z"
                                            transform="translate(596 349)" />
                                        <path
                                            d="M16,17a1,1,0,0,1-.707-.293L10.3,11.714a1.023,1.023,0,0,0-1.6,0L3.707,16.707a1,1,0,1,1-1.414-1.414l5-5,.014-.013a3.014,3.014,0,0,1,4.387,0l.014.013,5,5A1,1,0,0,1,16,17Z"
                                            transform="translate(596 349)" />
                                        <path
                                            d="M21,17a1,1,0,0,1-.707-.293L17.3,13.714a1.023,1.023,0,0,0-1.6,0l-.993.993a1,1,0,0,1-1.414-1.414l1-1,.014-.013a3.014,3.014,0,0,1,4.387,0l.014.013,3,3A1,1,0,0,1,21,17Z"
                                            transform="translate(596 349)" />
                                    </g>
                                    <g transform="translate(-100 -7)">
                                        <path
                                            d="M6.75,25A2.805,2.805,0,0,1,4,22.143V13.572C4,9.1,6.269,6.153,10.541,5.043a1.372,1.372,0,0,1,1.668,1.039,1.433,1.433,0,0,1-1,1.733c-3.062.8-4.459,2.61-4.459,5.757V15h4.125a2.8,2.8,0,0,1,2.743,2.643l.007.214v4.286A2.805,2.805,0,0,1,10.875,25Z"
                                            transform="translate(749.375 305)" />
                                        <path
                                            d="M15.75,25A2.805,2.805,0,0,1,13,22.143V13.572c0-4.471,2.269-7.418,6.541-8.528a1.372,1.372,0,0,1,1.668,1.039,1.433,1.433,0,0,1-1,1.733c-3.062.8-4.459,2.61-4.459,5.757V15h4.125a2.8,2.8,0,0,1,2.743,2.643l.007.214v4.286A2.805,2.805,0,0,1,19.875,25Z"
                                            transform="translate(728 305)" />
                                    </g>
                                </g>
                                <g transform="translate(278.05 -85.367)">
                                    <path
                                        d="M236.039,463.43a1.858,1.858,0,0,0-1.136,2.365l25.937,74.754a1.858,1.858,0,0,0,2.365,1.136l150.916-52.95a1.858,1.858,0,0,0,1.136-2.365L389.32,411.615a1.858,1.858,0,0,0-2.365-1.136Z"
                                        transform="translate(204.124 -4.027)" fill="#e6e6e6" />
                                    <path
                                        d="M279.711,540.473a14.379,14.379,0,0,1-13.547-9.571l-14.244-40.3a14.354,14.354,0,0,1,8.75-18.317l96.793-32.227c29.729-10.471,41.8,10.368,52.341,40.074a14.354,14.354,0,0,1-8.75,18.317l-.111-.313.111.313-116.574,41.2a14.3,14.3,0,0,1-4.77.821Z"
                                        transform="translate(198.651 -13.604)" fill="#fff" />
                                    <path
                                        d="M410.475,469.535l-68.3,23.962c-.962.338-2.155-.565-2.664-2.015s-.141-2.9.821-3.238l68.3-23.963c.962-.338,2.155.565,2.664,2.015S411.438,469.2,410.475,469.535Z"
                                        transform="translate(169.036 -22.106)" fill="#090814" />
                                    <path
                                        d="M418.428,492.2l-68.3,23.963c-.962.338-2.155-.565-2.664-2.015s-.141-2.9.821-3.238l68.3-23.963c.962-.338,2.155.565,2.664,2.015S419.39,491.867,418.428,492.2Z"
                                        transform="translate(166.365 -29.719)" fill="#090814" />
                                    <ellipse cx="4.334" cy="4.334" rx="4.334" ry="4.334"
                                        transform="translate(477.96 479.998)" fill="#090814" />
                                    <path
                                        d="M284.445,544.488c1.113-2.582,2.428-6.522,5.474-5.088,1.505.653,4.2,2.635,5.295.329l8.57-17.939a2.791,2.791,0,0,1,3.787-1.263l15.235,7.971a21.97,21.97,0,0,1-.365,3.685l-37.1,13.114Z"
                                        transform="translate(181.218 -42.916)" fill="#fed700" />
                                </g>
                                <g transform="translate(540.32 386.688) rotate(11)">
                                    <path
                                        d="M108.781,137.939H12.336A12.35,12.35,0,0,1,0,125.6V12.336A12.35,12.35,0,0,1,12.336,0h89.726l19.055,15.188V125.6A12.35,12.35,0,0,1,108.781,137.939Z"
                                        transform="translate(0 0)" fill="#e6e6e6" />
                                    <path
                                        d="M8.785,0A8.8,8.8,0,0,0,0,8.785V122.051a8.8,8.8,0,0,0,8.785,8.785h96.445a8.8,8.8,0,0,0,8.785-8.785V13.347L97.269,0Z"
                                        transform="translate(3.551 3.551)" fill="#fff" />
                                    <path
                                        d="M45.964,4.109H2.054A2.054,2.054,0,0,1,2.054,0h43.91a2.054,2.054,0,0,1,0,4.109Z"
                                        transform="translate(44.058 32.378)" fill="#fed700" />
                                    <path
                                        d="M54.438,4.109H2.054A2.054,2.054,0,0,1,2.054,0H54.438a2.054,2.054,0,1,1,0,4.109Z"
                                        transform="translate(44.058 39.311)" fill="#fed700" />
                                    <path
                                        d="M45.963,0H2.054a2.054,2.054,0,1,0,0,4.108H45.963a2.054,2.054,0,0,0,0-4.108Z"
                                        transform="translate(44.06 63.447)" fill="#ccc" />
                                    <path
                                        d="M54.437,0H2.054a2.054,2.054,0,1,0,0,4.108H54.437a2.054,2.054,0,1,0,0-4.108Z"
                                        transform="translate(44.06 70.382)" fill="#ccc" />
                                    <path
                                        d="M45.964,4.108H2.054A2.054,2.054,0,0,1,2.054,0h43.91a2.054,2.054,0,0,1,0,4.109Z"
                                        transform="translate(44.058 94.519)" fill="#ccc" />
                                    <path
                                        d="M54.438,4.109H2.054A2.054,2.054,0,0,1,2.054,0H54.438a2.054,2.054,0,1,1,0,4.109Z"
                                        transform="translate(44.058 101.452)" fill="#ccc" />
                                    <circle cx="7.261" cy="7.261" r="7.261" transform="translate(20.566 30.638)"
                                        fill="#fed700" />
                                    <path
                                        d="M2.464,5.522a.753.753,0,0,1-.453-.151L2,5.366.3,4.06a.758.758,0,0,1,.923-1.2L2.325,3.7,4.937.3A.758.758,0,0,1,6,.156H6L5.983.179,6,.157A.759.759,0,0,1,6.14,1.22L3.068,5.226a.758.758,0,0,1-.6.3Z"
                                        transform="translate(24.643 35.146)" fill="#fff" />
                                    <path
                                        d="M14.521,7.262a7.261,7.261,0,0,1-7.26,7.263,1.559,1.559,0,0,1-.187-.007,7.26,7.26,0,1,1,7.446-7.256Z"
                                        transform="translate(21.313 61.706)" fill="#fed700" />
                                    <circle cx="7.261" cy="7.261" r="7.261" transform="translate(20.566 92.779)"
                                        fill="#fed700" />
                                    <path
                                        d="M19.035,15.39H4.108A4.109,4.109,0,0,1,0,11.281V.257a.257.257,0,0,1,.416-.2L19.194,14.932a.257.257,0,0,1-.159.458Z"
                                        transform="translate(101.711 0.287)" fill="#e6e6e6" />
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </section>

            <!-- Main layout -->
            <section class="mt-8 md:mt-14 mb-20">
                <div class="grid lg:grid-cols-12 gap-6">
                    <ArticlesListSidebar :loading="sectionsLoading" :bookmarked="bookmarked" :popular-tags="popularTags"
                        :my-tags="myTags" :categories="categories" :selected-category-slug="selectedCategorySlug"
                        :is-loggedin="isLoggedin" @select-category="selectCategory" />

                    <div class="lg:col-span-9 col-span-12">
                        <!-- Filters -->
                        <div
                            class="flex items-center justify-between pb-6px-2 sm:px-4 sm:flex-row flex-col mb-7 gap-4">
                            <div class="flex items-center flex-wrap lg:w-auto w-full gap-3">
                                <!-- Time filter -->
                                <div class="relative group lg:w-fit w-full sm:w-auto">
                                    <button type="button"
                                        class="flex items-center pe-2 ps-3 h-11 rounded-md  justify-between border-gray-800/80 dark:border-white/20 w-full cursor-pointer bg-white dark:bg-gray-900">
                                        <div class="text-gray-800 dark:text-white text-sm font-semibold">
                                            فیلتر زمانی
                                            <span
                                                class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ms-0.5">({{
                                                timeFilterLabel }})</span>
                                        </div>
                                        <span
                                            class="border-s mx-2 h-6 border-gray-800/40 dark:border-white/20 w-px lg:flex hidden"></span>
                                        <svg class="text-gray-800 dark:text-white shrink-0" width="22" height="22"
                                            viewBox="0 0 22 22" fill="none">
                                            <path
                                                d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path opacity="0.4"
                                                d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                    <div
                                        class="hidden group-hover:block group-focus-within:block absolute top-full w-full z-30 pt-2">
                                        <div
                                            class="bg-white dark:bg-gray-900 shadow-sm rounded-md p-3 border border-gray-100 dark:border-gray-800">
                                            <ul>
                                                <li v-for="opt in timeOptions" :key="opt.value">
                                                    <button type="button" @click="setTimeFilter(opt.value)"
                                                        class="flex py-2 px-3 w-full font-bold text-sm text-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition duration-200 hover:bg-gray-50 rounded-md text-start"
                                                        :class="timeFilter === opt.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''">
                                                        {{ opt.label }}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sort filter -->
                                <div class="relative group lg:w-fit w-full sm:w-auto">
                                    <button type="button"
                                        class="flex items-center pe-2 ps-3 h-11 justify-between rounded-md  dark:border-white/20 border-gray-800/80 w-full cursor-pointer bg-white dark:bg-gray-900">
                                        <div class="text-gray-800 dark:text-white text-sm font-semibold">
                                            فیلتر نمایش
                                            <span
                                                class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ms-0.5">({{
                                                sortLabel }})</span>
                                        </div>
                                        <span
                                            class="border-s mx-2 h-6 border-gray-800/40 dark:border-white/20 w-px lg:flex hidden"></span>
                                        <svg class="text-gray-800 dark:text-white shrink-0" width="22" height="22"
                                            viewBox="0 0 22 22" fill="none">
                                            <path
                                                d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path opacity="0.4"
                                                d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                    <div
                                        class="hidden group-hover:block group-focus-within:block absolute top-full w-full z-30 pt-2">
                                        <div
                                            class="bg-white dark:bg-gray-900 shadow-sm rounded-md p-3 border border-gray-100 dark:border-gray-800">
                                            <ul>
                                                <li v-for="opt in sortOptions" :key="opt.value">
                                                    <button type="button" @click="setSort(opt.value)"
                                                        class="flex py-2 px-3 w-full font-bold text-sm dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 text-gray-700 transition duration-200 hover:bg-gray-50 rounded-md text-start"
                                                        :class="sort === opt.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''">
                                                        {{ opt.label }}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Search -->
                                <div class="relative flex-1 min-w-[180px] lg:max-w-sm w-full">
                                    <input v-model="searchKey" @input="onSearchInput" type="text"
                                        :placeholder="$t('articles.list.searchPlaceholder')"
                                        class="w-full h-11 ps-10 pe-10 rounded-md border-gray-800/80 dark:border-white/20 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                        :class="{ 'opacity-80': showListLoading }" />
                                    <svg v-if="!isSearchBusy"
                                        class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                        viewBox="0 0 20 20" fill="none">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <svg v-else
                                        class="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin"
                                        viewBox="0 0 24 24" fill="none">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="3" />
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            </div>

                            <div v-if="isLoggedin" class="flex items-center sm:mt-0 shrink-0">
                                <span
                                    class="text-base dark:text-white text-gray-800 rtl:ml-4 ltr:mr-4 font-semibold">همه
                                    مطالب</span>
                                <button type="button" @click="goToSavedArticles"
                                    class="w-14 h-7 bg-gray-300/30 dark:bg-gray-700/50 transition-all duration-300 rounded-full relative">
                                    <span
                                        class="w-5 h-5 bg-gray-600 dark:bg-gray-500 transition-all duration-300 rounded-full absolute top-1 start-1"></span>
                                </button>
                                <button type="button" @click="goToSavedArticles"
                                    class="text-base dark:text-white text-gray-800 rtl:mr-4 ltr:ml-4 font-semibold opacity-60 hover:opacity-100 transition">ذخیره‌شده‌ها</button>
                            </div>
                        </div>

                        <!-- Archive -->
                        <div id="articles-page">
                            <div v-if="searchFor" class="mb-4 flex items-center gap-2 px-1">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 text-xs font-semibold">
                                    {{ $t('articles.list.searchActive') }}
                                    <span class="font-bold">{{ searchFor }}</span>
                                </span>
                                <button type="button" @click="clearSearch"
                                    class="p-1 text-gray-400 hover:text-rose-500 transition"
                                    :aria-label="$t('articles.list.clearSearch')">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M9.03 3.344C10.98 2.885 13.02 2.885 14.97 3.344 17.79 4.005 19.99 6.208 20.66 9.03 21.11 10.98 21.11 13.02 20.66 14.97 19.99 17.79 17.79 19.99 14.97 20.66 13.02 21.11 10.98 21.11 9.03 20.66 6.21 19.99 4.01 17.79 3.34 14.97 2.89 13.02 2.89 10.98 3.34 9.03 4.01 6.21 6.21 4.01 9.03 3.344ZM10.71 9.902a.75.75 0 00-1.06 1.06L11.19 12l-1.54 1.54a.75.75 0 101.06 1.06L12.25 13.06l1.54 1.54a.75.75 0 101.06-1.06L13.31 12l1.54-1.54a.75.75 0 00-1.06-1.06L12.25 10.94l-1.54-1.54z"
                                            fill="currentColor" />
                                    </svg>
                                </button>
                            </div>

                            <div class="sm:px-3">
                                <div v-if="showListLoading"
                                    class="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:gap-8 sm:gap-4 gap-y-8">
                                    <ArticleCardLoading v-for="i in 6" :key="'loading-' + i" />
                                </div>

                                <div v-else-if="articles.length"
                                    class="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-12 sm:gap-4 sm:gap-y-4 gap-y-8">
                                    <ArticleCard v-for="item in articles" :key="item.id" :article="item" />
                                    <template v-if="loadingMore">
                                        <ArticleCardLoading v-for="i in 3" :key="'more-' + i" />
                                    </template>
                                </div>

                                <div v-else
                                    class="py-16 text-center rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700">
                                    <p class="text-gray-500 dark:text-gray-400 font-semibold">{{
                                        $t('articles.list.empty') }}</p>
                                </div>

                                <div v-if="hasMore && !showListLoading" ref="infiniteSentinel" class="h-10 mt-4"
                                    aria-hidden="true"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </MasterPage>
</template>

<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
import ArticleCard from "@/views/components/articles/ArticleCard.vue";
import ArticleCardLoading from "@/views/components/articles/ArticleCardLoading.vue";
import ArticlesListSidebar from "@/views/components/articles/ArticlesListSidebar.vue";
import { articleService } from "@/services/article.service";
import axiosInstance from "@/store/axiosInstance";
import debounce from "lodash/debounce";
import { useSEO, generateBreadcrumbSchema } from "@/composables/useSEO";

export default {
    inject: {
        ssrArticlesBootstrap: { from: 'ssrArticlesBootstrap', default: null },
    },
    components: { MasterPage, ArticleCard, ArticleCardLoading, ArticlesListSidebar },
    data() {
        return {
            articles: [],
            featured: [],
            categories: [],
            popularTags: [],
            bookmarked: [],
            myTags: [],
            loading: false,
            refreshing: false,
            searchPending: false,
            initLoading: true,
            sectionsLoading: true,
            searchKey: "",
            searchFor: "",
            sort: "latest",
            timeFilter: "all",
            selectedCategorySlug: null,
            currentPage: 1,
            lastPage: 1,
            timeOptions: [
                { value: "all", label: "بروزترین" },
                { value: "week", label: "هفته پیش" },
                { value: "month", label: "ماه پیش" },
                { value: "year", label: "سال پیش" },
                { value: "oldest", label: "قدیمی‌ترین" },
            ],
            sortOptions: [
                { value: "latest", label: "جدیدترین" },
                { value: "most_liked", label: "بیشترین پسند" },
                { value: "most_viewed", label: "پربازدیدترین" },
                { value: "most_bookmarked", label: "بیشترین ذخیره" },
            ],
            infiniteObserver: null,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        hasMore() {
            return this.currentPage <= this.lastPage;
        },
        timeFilterLabel() {
            return this.timeOptions.find((o) => o.value === this.timeFilter)?.label || "بروزترین";
        },
        sortLabel() {
            if (this.timeFilter === "oldest") {
                return this.timeOptions.find((o) => o.value === "oldest")?.label || "قدیمی‌ترین";
            }
            return this.sortOptions.find((o) => o.value === this.sort)?.label || "جدیدترین";
        },
        showListLoading() {
            return this.initLoading || this.refreshing;
        },
        isSearchBusy() {
            return this.searchPending || (this.refreshing && Boolean(this.searchKey.trim()));
        },
        loadingMore() {
            return this.loading && !this.refreshing && !this.initLoading;
        },
    },
    created() {
        const ssr = this.ssrArticlesBootstrap;
        const payload = ssr && typeof ssr === 'object' && 'value' in ssr ? ssr.value : ssr;
        if (!payload) return;
        const hasQuery = Object.keys(this.$route.query || {}).length > 0;
        if (!hasQuery && Array.isArray(payload.articles)) {
            this.articles = payload.articles;
            this.lastPage = payload.pagination?.last_page || 1;
            this.currentPage = 2;
            this.initLoading = false;
            this.refreshing = false;
        }
        if (payload.featured) this.featured = payload.featured;
        if (payload.categories) this.categories = payload.categories;
        if (payload.popularTags) this.popularTags = payload.popularTags;
        if (payload.bookmarked) this.bookmarked = payload.bookmarked;
        this.sectionsLoading = false;
    },
    mounted() {
        this.applySeo();
        this.syncFromRoute();
        const hasQuery = Object.keys(this.$route.query || {}).length > 0;
        if (this.sectionsLoading) this.loadSections();
        this.loadMyTags();
        if (this.initLoading || hasQuery) {
            this.loadArticles(false);
        }
        this.onPopState = () => {
            this.syncFromRoute();
            this.resetAndLoad(false);
        };
        window.addEventListener("popstate", this.onPopState);
        this.$nextTick(() => this.setupInfiniteScroll());
    },
    beforeUnmount() {
        window.removeEventListener("popstate", this.onPopState);
        this.teardownInfiniteScroll();
    },
    watch: {
        "$route.query": {
            deep: true,
            handler(newQuery, oldQuery) {
                if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) return;
                this.syncFromRoute();
                this.applySeo();
                this.resetAndLoad(false);
            },
        },
        hasMore() {
            this.$nextTick(() => this.setupInfiniteScroll());
        },
        loading(isLoading) {
            if (!isLoading) {
                this.$nextTick(() => this.setupInfiniteScroll());
            }
        },
    },
    methods: {
        applySeo() {
            const breadcrumb = generateBreadcrumbSchema([
                { name: "خانه", url: "/" },
                { name: this.$t("articles.list.title"), url: "/articles" },
            ]);
            useSEO({
                title: this.$t("articles.list.seo.title"),
                description: this.$t("articles.list.seo.description"),
                url: "/articles",
                // Filtered list URLs → always canonicalize to clean /articles (avoid duplicate index)
                canonical: "/articles",
                keywords: this.$t("articles.list.seo.keywords").split("|"),
                schema: [breadcrumb].filter(Boolean),
            });
        },
        syncFromRoute() {
            const q = this.$route.query;
            this.searchKey = q.search || "";
            this.searchFor = this.searchKey;
            this.sort = q.sort || "latest";
            this.selectedCategorySlug = q.category || null;
            this.timeFilter = q.time || "all";
            if (this.timeFilter === "oldest" && (!q.sort || q.sort === "latest")) {
                this.sort = "oldest";
            }
        },
        buildReadableQueryString() {
            const parts = [];
            if (this.searchKey.trim()) parts.push(`search=${encodeURIComponent(this.searchKey.trim())}`);
            const effectiveSort = this.timeFilter === "oldest" ? "oldest" : this.sort;
            if (effectiveSort && effectiveSort !== "latest") parts.push(`sort=${effectiveSort}`);
            if (this.selectedCategorySlug) parts.push(`category=${encodeURIComponent(this.selectedCategorySlug)}`);
            if (this.timeFilter !== "all") parts.push(`time=${this.timeFilter}`);
            return parts.join("&");
        },
        syncBrowserUrl() {
            const query = this.buildReadableQueryString();
            const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
            // Preserve Vue Router history.state or named navigations stop working.
            window.history.pushState({ ...window.history.state }, "", newUrl);
        },
        async loadSections() {
            this.sectionsLoading = true;
            try {
                const res = await articleService.sections();
                this.featured = res.data.featured || [];
                this.categories = res.data.categories || [];
                this.popularTags = res.data.popular_tags || [];
                this.bookmarked = res.data.bookmarked_articles || [];
            } catch (e) {
                console.error(e);
            } finally {
                this.sectionsLoading = false;
            }
        },
        async loadMyTags() {
            if (!this.isLoggedin) return;
            try {
                const res = await axiosInstance.post("/discuss/layouts/getInitData");
                this.myTags = res.data.myTags || [];
            } catch (e) {
                console.error(e);
            }
        },
        buildParams() {
            const effectiveSort = this.timeFilter === "oldest" ? "oldest" : this.sort;
            const params = { page: this.currentPage, perPage: 12, sort: effectiveSort };
            if (this.searchKey.trim()) params.search = this.searchKey.trim();
            if (this.selectedCategorySlug) params.category = this.selectedCategorySlug;
            if (this.timeFilter === "week") {
                params.published_after = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
            } else if (this.timeFilter === "month") {
                params.published_after = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
            } else if (this.timeFilter === "year") {
                params.published_after = new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10);
            }
            return params;
        },
        async loadArticles(append = false) {
            if (append && (this.loading || this.currentPage > this.lastPage)) return;

            if (!append) {
                this.refreshing = true;
                this.articles = [];
                this.teardownInfiniteScroll();
            }

            this.loading = true;
            try {
                const res = await articleService.list(this.buildParams());
                if (append) {
                    this.articles.push(...(res.data.articles || []));
                } else {
                    this.articles = res.data.articles || [];
                }
                this.lastPage = res.data.pagination?.last_page || 1;
                if (append) this.currentPage += 1;
                else this.currentPage = 2;
            } catch (error) {
                if (error?.code !== "ERR_CANCELED" && error?.name !== "CanceledError") {
                    console.error("Error loading articles:", error);
                }
            } finally {
                this.loading = false;
                this.initLoading = false;
                this.refreshing = false;
                this.searchPending = false;
            }
        },
        resetAndLoad(updateUrl = true) {
            this.teardownInfiniteScroll();
            this.currentPage = 1;
            if (updateUrl) this.syncBrowserUrl();
            this.loadArticles(false);
        },
        setupInfiniteScroll() {
            this.teardownInfiniteScroll();
            const sentinel = this.$refs.infiniteSentinel;
            if (!sentinel || !this.hasMore || this.loading || this.refreshing) return;

            this.infiniteObserver = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting) && !this.loading && this.hasMore) {
                        this.loadArticles(true);
                    }
                },
                { rootMargin: "240px", threshold: 0 }
            );
            this.infiniteObserver.observe(sentinel);
        },
        teardownInfiniteScroll() {
            if (this.infiniteObserver) {
                this.infiniteObserver.disconnect();
                this.infiniteObserver = null;
            }
        },
        setTimeFilter(value) {
            this.timeFilter = value;
            if (value === "oldest") {
                this.sort = "oldest";
            } else if (this.sort === "oldest") {
                this.sort = "latest";
            }
            this.resetAndLoad();
        },
        setSort(value) {
            this.sort = value;
            if (value !== "oldest" && this.timeFilter === "oldest") {
                this.timeFilter = "all";
            }
            this.resetAndLoad();
        },
        goToSavedArticles() {
            this.$router.push({ name: "panel-followed", query: { filter: "article" } });
        },
        selectCategory(slug) {
            this.selectedCategorySlug = this.selectedCategorySlug === slug ? null : slug;
            this.resetAndLoad();
        },
        clearSearch() {
            this.searchKey = "";
            this.searchFor = "";
            this.searchPending = false;
            this.resetAndLoad();
        },
        handleSearch: debounce(function () {
            const trimmed = this.searchKey.trim();
            if (trimmed === this.searchFor) {
                this.searchPending = false;
                return;
            }

            if (trimmed.length > 2) {
                this.searchFor = trimmed;
                this.resetAndLoad();
            } else if (this.searchKey.length === 0) {
                this.searchFor = "";
                this.resetAndLoad();
            }

            this.searchPending = false;
        }, 500),
        onSearchInput() {
            const trimmed = this.searchKey.trim();
            this.searchPending = trimmed.length > 2 && trimmed !== this.searchFor;
            this.handleSearch();
        },
    },
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
