<template>
	<div class="grid xl:grid-cols-24 grid-cols-12 gap-6">
		<div class="xl:col-span-17 col-span-12">
			<div wire:id="skuesL52KZHG7axnUSrm" wire:init="loadAdvertisements" wire:initial-data='{"fingerprint":{"id":"skuesL52KZHG7axnUSrm","name":"articles.layouts.show-advertisement","locale":"fa","path":"articles\/best-nosql-databases","method":"GET","v":"acj"},"effects":{"listeners":[]},"serverMemo":{"children":[],"errors":[],"htmlHash":"0b5f5b80","data":{"adsPlacement":"article_header","subject":[],"currentUrl":"https:\/\/roocket.ir\/articles\/best-nosql-databases","class":null,"readyToLoad":false},"dataMeta":{"enums":{"adsPlacement":"Roocket\\RoocketMain\\Enums\\Advertisement\\AdsPlacement"},"models":{"subject":{"class":"App\\Article","id":817,"relations":["user","faqs","rates","categories","tags"],"connection":"mysql","collectionClass":null}}},"checksum":"f86d304684a7f3bf5028f974d2cb8a3c6ad69f1617adb4d6e89ba852ec186579"}}'></div>

			<!-- Livewire Component wire-end:skuesL52KZHG7axnUSrm -->
			<div x-data="{ focusMode: false, fullScreenMode: false, optionControl: false }" @keyup.escape.window="$dispatch('overlay-hide'), $dispatch('focus-option-control', false), (focusMode = false), (fullScreenMode = false), ($refs.body.style.overflow = 'visible')" @focus-handler.window="focusMode = $event.detail" @focus-option-control.window="optionControl = $event.detail" :class="{ 'absolute z-50 max-w-7xl top-24': focusMode, 'absolute z-50 w-full h-full overflow-scroll top-0 right-0': fullScreenMode }">
				<div :class="{ 'bg-white dark:bg-dark-930 rounded-md': optionControl, 'mb-24': focusMode }" @click.away="$dispatch('focus-handler', false), $dispatch('focus-option-control', false)">
					<div div="" class="bg-white dark:bg-dark-930 dark:shadow-whiteShadow p-8 shadow-sm rounded-md mb-8">
						<div :class="{ 'max-w-7xl mx-auto my-0': fullScreenMode }">
							<div class="flex justify-center items-center mb-11 hidden" x-clock="" x-data="" :class="{ hidden: !optionControl }">
								<div class="ml-4 cursor-pointer" @click="$dispatch('overlay-hide'), $dispatch('focus-option-control', false), (focusMode = false), (fullScreenMode = false), ($refs.body.style.overflow = 'visible')">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 20C1 24.0947 1.22071 27.3168 1.78509 29.8563C2.34695 32.3845 3.23603 34.1743 4.53086 35.4691C5.82569 36.764 7.61553 37.6531 10.1437 38.2149C12.6832 38.7793 15.9053 39 20 39C24.0947 39 27.3168 38.7793 29.8563 38.2149C32.3845 37.6531 34.1743 36.764 35.4691 35.4691C36.764 34.1743 37.6531 32.3845 38.2149 29.8563C38.7793 27.3168 39 24.0947 39 20C39 15.9053 38.7793 12.6832 38.2149 10.1437C37.6531 7.61553 36.764 5.82569 35.4691 4.53086C34.1743 3.23603 32.3845 2.34695 29.8563 1.78509C27.3168 1.22071 24.0947 1 20 1C15.9053 1 12.6832 1.22071 10.1437 1.78509C7.61553 2.34695 5.82569 3.23603 4.53086 4.53086C3.23603 5.82569 2.34695 7.61553 1.78509 10.1437C1.22071 12.6832 1 15.9053 1 20Z" stroke="#98A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
										<path d="M25 15L20 20M20 20L15 25M20 20L25 25M20 20L15 15" stroke="#98A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
								</div>
								<div class="cursor-pointer" x-data="{ toggleFullscreenMode: function() { fullScreenMode = !fullScreenMode, focusMode = !focusMode, $refs.body.style.overflow = fullScreenMode ? 'hidden' : 'visible' } }" @click="toggleFullscreenMode()">
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M26.3518 12.1877C26.2313 12.1345 26.1016 12.1057 25.9699 12.1028L20.3131 12.1028C20.1812 12.1028 20.0506 12.1288 19.9288 12.1793C19.807 12.2297 19.6963 12.3037 19.6031 12.3969C19.4148 12.5852 19.309 12.8406 19.309 13.1069C19.309 13.3732 19.4148 13.6286 19.6031 13.8169C19.7914 14.0052 20.0468 14.111 20.3131 14.111L23.5587 14.1039L14.239 23.4236L14.2461 20.178C14.2461 20.0461 14.2201 19.9156 14.1697 19.7937C14.1192 19.6719 14.0452 19.5612 13.952 19.468C13.8588 19.3748 13.7481 19.3008 13.6263 19.2503C13.5044 19.1999 13.3739 19.1739 13.242 19.1739C13.1101 19.1739 12.9796 19.1999 12.8578 19.2503C12.7359 19.3008 12.6252 19.3748 12.532 19.468C12.4388 19.5612 12.3648 19.6719 12.3143 19.7937C12.2639 19.9156 12.2379 20.0461 12.2379 20.178L12.2379 25.8348C12.2408 25.9665 12.2696 26.0962 12.3228 26.2167C12.4242 26.4596 12.6173 26.6527 12.8602 26.7541C12.9806 26.8072 13.1104 26.8361 13.242 26.8389L18.8989 26.8389C19.0309 26.8395 19.1617 26.8139 19.2838 26.7636C19.4058 26.7133 19.5167 26.6394 19.6101 26.5461C19.7034 26.4527 19.7774 26.3418 19.8276 26.2197C19.8779 26.0977 19.9035 25.9669 19.903 25.8348C19.9035 25.7028 19.8779 25.572 19.8276 25.45C19.7774 25.3279 19.7034 25.217 19.6101 25.1236C19.5167 25.0303 19.4058 24.9564 19.2838 24.9061C19.1617 24.8558 19.0309 24.8302 18.8989 24.8308L15.6532 24.8378L24.9729 15.5182L24.9658 18.7638C24.9653 18.8958 24.9909 19.0266 25.0412 19.1487C25.0914 19.2707 25.1654 19.3816 25.2587 19.475C25.3521 19.5683 25.463 19.6423 25.585 19.6925C25.7071 19.7428 25.8379 19.7684 25.9699 19.7679C26.1019 19.7684 26.2328 19.7428 26.3548 19.6925C26.4769 19.6423 26.5878 19.5683 26.6811 19.475C26.7745 19.3816 26.8484 19.2707 26.8987 19.1487C26.949 19.0266 26.9746 18.8958 26.974 18.7638L26.974 13.1069C26.9711 12.9753 26.9423 12.8455 26.8892 12.7251C26.7877 12.4822 26.5946 12.2891 26.3518 12.1877Z"
											fill="#98A3B8"
										></path>
										<path d="M1 20C1 24.0947 1.22071 27.3168 1.78509 29.8563C2.34695 32.3845 3.23603 34.1743 4.53086 35.4691C5.82569 36.764 7.61553 37.6531 10.1437 38.2149C12.6832 38.7793 15.9053 39 20 39C24.0947 39 27.3168 38.7793 29.8563 38.2149C32.3845 37.6531 34.1743 36.764 35.4691 35.4691C36.764 34.1743 37.653 32.3845 38.2149 29.8563C38.7793 27.3168 39 24.0947 39 20C39 15.9053 38.7793 12.6832 38.2149 10.1437C37.653 7.61553 36.764 5.82569 35.4691 4.53086C34.1743 3.23603 32.3845 2.34695 29.8563 1.78509C27.3168 1.22071 24.0947 1 20 1C15.9053 1 12.6832 1.22071 10.1437 1.78509C7.61553 2.34695 5.82569 3.23603 4.53086 4.53086C3.23603 5.82569 2.34695 7.61553 1.78509 10.1437C1.22071 12.6832 1 15.9053 1 20Z" stroke="#98A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
								</div>
							</div>

							<div class="mb-8 h-48 sm:h-450 overflow-hidden rounded-xl">
								<img class="w-full h-full object-cover lozad" data-src="https://static.roocket.ir/public/image/2018/1/21/nosql.png" alt="بهترین دیتابیس های NoSQL" src="https://static.roocket.ir/public/image/2018/1/21/nosql.png" data-loaded="true" />
							</div>

							<div class="flex items-center sm:flex-row flex-col">
								<div class="ml-6 flex items-center space-x-2 space-x-reverse sm:mb-0 mb-5">
									<a href="/articles?category=database" class="flex items-center rounded-lg text-blue-700 hover:text-white hover:bg-blue-700 transition duration-200 font-semibold px-5 py-2 bg-blue-50">
										<svg class="ml-2" width="18" height="17" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd" d="M11.7915 11.0486C11.292 11.0486 10.887 11.4535 10.887 11.9531C10.887 12.4526 11.2919 12.8575 11.7915 12.8575L15.4209 12.8575C15.9205 12.8575 16.3254 12.4526 16.3254 11.9531C16.3254 11.4535 15.9205 11.0486 15.4209 11.0486L11.7915 11.0486ZM8.16228 14.6788C7.66276 14.6788 7.25781 15.0838 7.25781 15.5833C7.25781 16.0828 7.66276 16.4878 8.16228 16.4878L15.4212 16.4878C15.9207 16.4878 16.3257 16.0828 16.3257 15.5833C16.3257 15.0838 15.9207 14.6788 15.4212 14.6788L8.16228 14.6788Z" fill="currentColor"></path>
											<path d="M16.3021 4.92382C15.3306 4.83267 14.2064 4.79518 12.9123 4.79518C4.92001 4.79518 3.00712 6.22507 2.07443 12.8965C1.93217 13.9141 1.84681 14.8097 1.83266 15.597M16.3021 4.92382C21.3305 5.39564 22.2667 7.30528 21.4851 12.8965C20.5524 19.568 18.6395 20.9979 10.6472 20.9979C3.87388 20.9979 1.75406 19.9709 1.83266 15.597M16.3021 4.92382C16.3021 4.92382 16.4398 4.09117 16.3021 2.99488C15.963 0.294405 4.81796 0.647123 3.63956 2.99488C1.83233 6.59543 1.83266 15.597 1.83266 15.597" stroke="currentColor" stroke-width="1.80894" stroke-linecap="round" stroke-linejoin="round"></path>
										</svg>
										دیتابیس
									</a>
								</div>
								<div class="flex items-center text-gray-300 dark:text-gray-920">
									<svg class="ml-2 -mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63449 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z" stroke="#98A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
										<path d="M15.391 14.0178L12 11.9948V7.63379" stroke="#98A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									ﺯﻣﺎﻥ ﻣﻄﺎﻟﻌﻪ: 3 دقیقه
								</div>
							</div>
							<div class="mt-5">
								<h1 class="mb-6 text-biscay-700 dark:text-white sm:text-45 font-bold text-2xl text-right leading-snug">بهترین دیتابیس های NoSQL</h1>
								<article class="content-area">
									<p dir="rtl">دیتابیس های NoSQL (که با نام Not Only SQL هم شناخته می شوند) سیستم های دیتابیس غیر رابطه ای هستند که برای ذخیره سازی و دریافت اطلاعات استفاده می شوند. امروزه دیتابیس های NoSQL بطور گسترده در بخش هایی از اپلیکیشن های وب real-time مورد استفاده قرار می گیرند. دیتابیس های NoSQL همچنین میتونند بعنوان دیتابیس های با اطلاعات سنگین یا Cloud مورد استفاده قرار گیرند.</p>

									<p dir="rtl">در این مقاله به چند نمونه از این دیتابیس ها می پردازیم :</p>

									<p dir="rtl">
										<span style="font-size: 20px"><strong>1) CouchDB</strong></span>
									</p>

									<p dir="rtl" style="text-align: center">
										<span style="font-size: 20px"
											><strong><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/couchDB.jpg" style="height: 116px; width: 392px" src="https://static.roocket.ir/public/images/2018/1/21/couchDB.jpg" data-loaded="true" /></strong
										></span>
									</p>

									<p dir="rtl">CouchDB یک دیتابیس متن باز NoSQL هست که از JSON برای ذخیره سازی اطلاعات و از جاوا اسکریپت بعنوان زبان کوئری استفاده میکنه. CouchDB نوعی از سیستم کنترلی multi-version رو اعمال میکنه تا از انسداد فایل دیتابیس هنگام نوشتن (writing) جلوگیری کنه. به این سیستم Erlang گویند که زیر مجوز Apache هست. این دیتابیس محبوب ترین دیتابیس NoSQL در سال 2016 شناخته شده.</p>

									<p dir="rtl">
										<span style="font-size: 20px"><strong>2) MongoDB</strong></span>
									</p>

									<p dir="rtl" style="text-align: center">
										<span style="font-size: 20px"
											><strong><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/mongoDB.jpg" style="height: 136px; width: 307px" src="https://static.roocket.ir/public/images/2018/1/21/mongoDB.jpg" data-loaded="true" /></strong
										></span>
									</p>

									<p dir="rtl">MongoDB در بین دیتابیس های NoSQL شناخته شده ترین هست. این یک دیتابیس متن بازه که مستندگراست. MongoDB یک دیتابیس قابل دسترس و گسترش هست که با ++C نوشته شده. MongoDB میتونه بعنوان فایل سیستم هم استفاده بشه. در MongoDB جاوا اسکریپت میتونه بعنوان زبان کوئری استفاده بشه و همچنین یکی از گزینه های محبوب استفاده با فریمورک های جاوا اسکریپت هست.</p>

									<p dir="rtl">
										<span style="font-size: 20px"><strong>3) Cassandra</strong></span>
									</p>

									<p dir="rtl" style="text-align: center">
										<span style="font-size: 20px"
											><strong><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/Cassandra.jpg" style="height: 258px; width: 385px" src="https://static.roocket.ir/public/images/2018/1/21/Cassandra.jpg" data-loaded="true" /></strong
										></span>
									</p>

									<p dir="rtl">Cassandra یک سیستم ذخیره اطلاعات توزیع شده برای مدیریت مقدار زیادی از اطلاعات ساختار یافته هست. عموما این اطلاعات بین تعدادی سرور توزیع یافتند. Cassandra به شما بیشترین حد انعطاف رو برای توزیع اطلاعات میده. همچنین شما میتونید به ظرفیت ذخیره سازی اطلاعات اضافه کنید و سرویستون رو آنلاین نگه دارید. ازاونجا که تمام گره ها (node) در دسته (cluster) یکی هستند هیچ پیچیدگی برای پیکربندی اون وجود نداره. Cassandra با زبان جاوا نوشته شده و MapReduce رو با Apache Hadoop پشتیبانی میکنه. Cassandra Query Language - CQL یک زبان شبیه SQL هست که مخصوص کوئری نوشتن برای دیتابیس های Cassandra هست.</p>

									<p dir="rtl">
										<span style="font-size: 20px"><strong>4) Redis</strong></span>
									</p>

									<p dir="rtl" style="text-align: center">
										<span style="font-size: 20px"
											><strong><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/redis.jpg" style="height: 155px; width: 312px" src="https://static.roocket.ir/public/images/2018/1/21/redis.jpg" data-loaded="true" /></strong
										></span>
									</p>

									<p dir="rtl">Redis یک سیستم ذخیره سازی اطلاعات توسط کلید ها و مقادیر است. و بعنوان معروف ترین ذخیره ساز کلید/مقدار (Value/Key) شناخته میشه. Redis زبان های C++, PHP, Ruby, Python, Perl رو پشتیبانی میکنه و خودش با زبان C نوشته شده.</p>

									<p dir="rtl">همچنین زیر مجوز BSD هست.</p>

									<p dir="rtl">
										<span style="font-size: 20px"><strong>5) HBASE</strong></span>
									</p>

									<p dir="rtl" style="text-align: center">
										<span style="font-size: 20px"
											><strong><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/hbase.jpg" style="height: 101px; width: 297px" src="https://static.roocket.ir/public/images/2018/1/21/hbase.jpg" data-loaded="true" /></strong
										></span>
									</p>

									<p dir="rtl">HBase یک دیتابیس توزیع شده و غیررابطه ایست که برای دیتابیس های BigTable با اطلاعات زیاد توسط گوگل طراحی شده. یکی از اهداف اصلی HBase اینه که میزبان میلیاردها ردیف از میلیون ها ستون باشه. شما میتونید سرورها رو هرزمان که بخواهید, با هدف افزایش ظرفیت, اضافه کنید. و همچنین چندین گره ی اصلی رو برای اطمینان از دسترسی بالای اطلاعات اضافه کنید. HBase با جاوا 8 نوشته شده و زیر مجوز Apache هست. HBase دسترسی ساده ای به API Java برای دسترسی مشتری ها دارد.&nbsp;</p>

									<p dir="rtl">در مقالات بعدی درمورد سایر دیتابیس های برتر NoSQL که تازه وارد تر هستند صحبت می کنیم.&nbsp;</p>

									<p dir="rtl">طبق نظرسنجی ای که ما از بین برنامه نویس های مختلف در گوگل پلاس داشتیم. درمورد تمام دیتابیس های SQL و NoSQL نظرسنجی کردیم و شما میتونید محبوب ترین دیتابیس های 2016 رو مشاهده کنید :</p>

									<p dir="rtl" style="text-align: center"><img alt="" class="lozad" data-src="https://static.roocket.ir/public/images/2018/1/21/Screenshot%20(85).jpg" style="height: 520px; width: 360px" src="https://static.roocket.ir/public/images/2018/1/21/Screenshot%20(85).jpg" data-loaded="true" /></p>

									<p dir="rtl"><a href="http://www.improgrammer.net/" target="_blank" rel="noopener nofollow">منبع</a></p>
								</article>

								<div class="mb-4"></div>
							</div>
							<div>
								<div class="px-5 py-3 flex items-center justify-between bg-dark-550 dark:bg-dark-890 bg-opacity-10 rounded-lg sm:flex-row flex-col">
									<p class="text-sm font-medium text-gray-360 dark:text-gray-920 sm:mb-0 mb-5">چه امتیازی برای این مقاله میدهید؟</p>

									<div wire:id="OgRuayOBdIRWBZciVVCS" class="flex space-x-reverse space-x-2 items-center">
										<div class="relative" x-data="{ title : 0 }">
											<span class="text-yellow-400 absolute z-40 overflow-hidden whitespace-nowrap flex top-0" style="width: 60%">
												<span class="cursor-pointer" :class="{ '!text-yellow-300' : title &gt;= 1 }" wire:click="setRate(1)" @mouseenter="title = 1" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
												</span>
												<span class="cursor-pointer" :class="{ '!text-yellow-300' : title &gt;= 2 }" wire:click="setRate(2)" @mouseenter="title = 2" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
												</span>
												<span class="cursor-pointer" :class="{ '!text-yellow-300' : title &gt;= 3 }" wire:click="setRate(3)" @mouseenter="title = 3" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
												</span>
												<span class="cursor-pointer" :class="{ '!text-yellow-300' : title &gt;= 4 }" wire:click="setRate(4)" @mouseenter="title = 4" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
												</span>
												<span class="cursor-pointer" :class="{ '!text-yellow-300' : title &gt;= 5 }" wire:click="setRate(5)" @mouseenter="title = 5" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
												</span>
											</span>
											<span class="flex w-full whitespace-nowrap text-gray-300 relative z-10">
												<span class="cursor-pointer relative" :class="{ '!text-yellow-300' : title &gt;= 1 }" wire:click="setRate(1)" @mouseenter="title = 1" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
													<div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold" x-show="title == 1" style="display: none">خیلی بد</div>
												</span>
												<span class="cursor-pointer relative" :class="{ '!text-yellow-300' : title &gt;= 2 }" wire:click="setRate(2)" @mouseenter="title = 2" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
													<div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold" x-show="title == 2" style="display: none">بد</div>
												</span>
												<span class="cursor-pointer relative" :class="{ '!text-yellow-300' : title &gt;= 3 }" wire:click="setRate(3)" @mouseenter="title = 3" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
													<div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold" x-show="title == 3" style="display: none">متوسط</div>
												</span>
												<span class="cursor-pointer relative" :class="{ '!text-yellow-300' : title &gt;= 4 }" wire:click="setRate(4)" @mouseenter="title = 4" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
													<div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold" x-show="title == 4" style="display: none">خوب</div>
												</span>
												<span class="cursor-pointer relative" :class="{ '!text-yellow-300' : title &gt;= 5 }" wire:click="setRate(5)" @mouseenter="title = 5" @mouseleave="title = 0">
													<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" class="w-5">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
													</svg>
													<div class="absolute text-sm bg-yellow-300 text-gray-700 px-1 rounded mt-1 font-bold" x-show="title == 5" style="display: none">عالی</div>
												</span>
											</span>
										</div>
										<div class="font-bold text-gray-300">3 از 1 رای</div>
									</div>

									<!-- Livewire Component wire-end:OgRuayOBdIRWBZciVVCS -->
								</div>
								<hr class="mt-7 mb-10 border-gray-100 dark:border-white dark:border-opacity-10" />
								<div>
									<div class="mb-5 flex items-center justify-between sm:flex-row flex-col">
										<div class="self-center sm:mb-0 mb-4">
											<span class="flex items-center text-gray-300 dark:text-gray-920 font-normal text-base">
												<svg class="ml-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M13.7389 2.24634H6.6581C4.19056 2.24634 2.64355 3.99346 2.64355 6.4659V13.1375C2.64355 15.6099 4.18239 17.357 6.6581 17.357H13.7381C16.2138 17.357 17.7542 15.6099 17.7542 13.1375V6.4659C17.7542 3.99346 16.2138 2.24634 13.7389 2.24634Z" stroke="currentColor" stroke-width="1.22519" stroke-linecap="round" stroke-linejoin="round"></path>
													<path d="M12.9685 11.4495L10.1987 9.79715V6.23511" stroke="currentColor" stroke-width="1.22519" stroke-linecap="round" stroke-linejoin="round"></path>
												</svg>
												7 سال پیش
											</span>
										</div>
										<div class="flex items-center max-w-lg flex-wrap self-center">
											<div wire:id="ctN3ee7mXxt8cl6t1ilO" class="relative mb-2 mx-1 group inline-block" wire:init="load">
												<a href="/tag/دیتابیس" class="bg-gray-100 dark:bg-dark-890 dark:shadow-whiteShadow dark:text-gray-920 hover:bg-gray-400 text-sm h-7 pb-1 hover:text-white flex font-medium pt-1.5 items-center px-3 rounded text-biscay-700">
													<span class="hashtag three-point-overflow max-w-150">دیتابیس</span>
												</a>
												<div class="absolute bottom-full z-50 pb-8 hidden group-hover:block -right-2">
													<div class="bg-white dark:bg-dark-890 shadow-toolTip rounded-xl py-4 px-5">
														<div class="flex items-center">
															<a href="/tag/دیتابیس" class="hashtag text-biscay-700 dark:text-white font-bold text-base three-point-overflow max-w-150">دیتابیس</a>
															<button wire:loading.remove="" wire:target="toggleFollow" wire:click="toggleFollow" href="#" class="bg-blue-700 dark:bg-transparent dark:border-white dark:hover:border-blue-450 dark:hover:text-blue-450 py-2 mr-8 w-85 text-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">دنبال کردن</button>
															<button wire:loading.flex="" wire:target="toggleFollow" href="#" class="bg-blue-700 py-2 mr-8 w-85 text-center justify-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">
																<svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
																	<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
																	<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
																		<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
																		<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
																		<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
																	</circle>
																</svg>
															</button>
														</div>
													</div>
													<svg class="absolute text-white dark:text-dark-890 bottom-2 right-2" width="44" height="38" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor"></path>
													</svg>
												</div>
											</div>

											<!-- Livewire Component wire-end:ctN3ee7mXxt8cl6t1ilO -->
											<div wire:id="FhN1QL3bNMdur4xrcgdC" class="relative mb-2 mx-1 group inline-block" wire:init="load">
												<a href="/tag/برنامه_نویسی" class="bg-gray-100 dark:bg-dark-890 dark:shadow-whiteShadow dark:text-gray-920 hover:bg-gray-400 text-sm h-7 pb-1 hover:text-white flex font-medium pt-1.5 items-center px-3 rounded text-biscay-700">
													<span class="hashtag three-point-overflow max-w-150">برنامه_نویسی</span>
												</a>
												<div class="absolute bottom-full z-50 pb-8 hidden group-hover:block -right-2">
													<div class="bg-white dark:bg-dark-890 shadow-toolTip rounded-xl py-4 px-5">
														<div class="flex items-center">
															<a href="/tag/برنامه_نویسی" class="hashtag text-biscay-700 dark:text-white font-bold text-base three-point-overflow max-w-150">برنامه_نویسی</a>
															<button wire:loading.remove="" wire:target="toggleFollow" wire:click="toggleFollow" href="#" class="bg-blue-700 dark:bg-transparent dark:border-white dark:hover:border-blue-450 dark:hover:text-blue-450 py-2 mr-8 w-85 text-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">دنبال کردن</button>
															<button wire:loading.flex="" wire:target="toggleFollow" href="#" class="bg-blue-700 py-2 mr-8 w-85 text-center justify-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">
																<svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
																	<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
																	<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
																		<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
																		<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
																		<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
																	</circle>
																</svg>
															</button>
														</div>
													</div>
													<svg class="absolute text-white dark:text-dark-890 bottom-2 right-2" width="44" height="38" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor"></path>
													</svg>
												</div>
											</div>

											<!-- Livewire Component wire-end:FhN1QL3bNMdur4xrcgdC -->
											<div wire:id="T6pUAdXcYPuEzgjCuUfz" class="relative mb-2 mx-1 group inline-block" wire:init="load">
												<a href="/tag/دیتابیس_nosql" class="bg-gray-100 dark:bg-dark-890 dark:shadow-whiteShadow dark:text-gray-920 hover:bg-gray-400 text-sm h-7 pb-1 hover:text-white flex font-medium pt-1.5 items-center px-3 rounded text-biscay-700">
													<span class="hashtag three-point-overflow max-w-150">دیتابیس_nosql</span>
												</a>
												<div class="absolute bottom-full z-50 pb-8 hidden group-hover:block -right-2">
													<div class="bg-white dark:bg-dark-890 shadow-toolTip rounded-xl py-4 px-5">
														<div class="flex items-center">
															<a href="/tag/دیتابیس_nosql" class="hashtag text-biscay-700 dark:text-white font-bold text-base three-point-overflow max-w-150">دیتابیس_nosql</a>
															<button wire:loading.remove="" wire:target="toggleFollow" wire:click="toggleFollow" href="#" class="bg-blue-700 dark:bg-transparent dark:border-white dark:hover:border-blue-450 dark:hover:text-blue-450 py-2 mr-8 w-85 text-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">دنبال کردن</button>
															<button wire:loading.flex="" wire:target="toggleFollow" href="#" class="bg-blue-700 py-2 mr-8 w-85 text-center justify-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">
																<svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
																	<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
																	<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
																		<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
																		<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
																		<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
																	</circle>
																</svg>
															</button>
														</div>
													</div>
													<svg class="absolute text-white dark:text-dark-890 bottom-2 right-2" width="44" height="38" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor"></path>
													</svg>
												</div>
											</div>

											<!-- Livewire Component wire-end:T6pUAdXcYPuEzgjCuUfz -->
											<div wire:id="Yntq5f9aeL5lfMprIyc5" class="relative mb-2 mx-1 group inline-block" wire:init="load">
												<a href="/tag/بهترین_دیتابیس_nosql" class="bg-gray-100 dark:bg-dark-890 dark:shadow-whiteShadow dark:text-gray-920 hover:bg-gray-400 text-sm h-7 pb-1 hover:text-white flex font-medium pt-1.5 items-center px-3 rounded text-biscay-700">
													<span class="hashtag three-point-overflow max-w-150">بهترین_دیتابیس_nosql</span>
												</a>
												<div class="absolute bottom-full z-50 pb-8 hidden group-hover:block -right-2">
													<div class="bg-white dark:bg-dark-890 shadow-toolTip rounded-xl py-4 px-5">
														<div class="flex items-center">
															<a href="/tag/بهترین_دیتابیس_nosql" class="hashtag text-biscay-700 dark:text-white font-bold text-base three-point-overflow max-w-150">بهترین_دیتابیس_nosql</a>
															<button wire:loading.remove="" wire:target="toggleFollow" wire:click="toggleFollow" href="#" class="bg-blue-700 dark:bg-transparent dark:border-white dark:hover:border-blue-450 dark:hover:text-blue-450 py-2 mr-8 w-85 text-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">دنبال کردن</button>
															<button wire:loading.flex="" wire:target="toggleFollow" href="#" class="bg-blue-700 py-2 mr-8 w-85 text-center justify-center text-white font-bold text-xs rounded border border-blue-700 transition duration-200 hover:shadow-lg hover:text-blue-700 hover:bg-white">
																<svg class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
																	<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
																	<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
																		<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
																		<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
																		<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
																	</circle>
																</svg>
															</button>
														</div>
													</div>
													<svg class="absolute text-white dark:text-dark-890 bottom-2 right-2" width="44" height="38" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M24.5981 36.5C23.4434 38.5 20.5566 38.5 19.4019 36.5L1.21539 5C0.060688 3 1.50407 0.5 3.81347 0.5L40.1865 0.5C42.4959 0.5 43.9393 3 42.7846 5L24.5981 36.5Z" fill="currentColor"></path>
													</svg>
												</div>
											</div>

											<!-- Livewire Component wire-end:Yntq5f9aeL5lfMprIyc5 -->
										</div>
									</div>
									<div>
										<div class="flex items-center justify-between sm:flex-row flex-col">
											<ul class="flex items-center self-center sm:mb-0 mb-4">
												<li>
													<a class="flex items-center text-gray-300 dark:text-gray-920 text-22 font-normal ml-6 cursor-pointer group hover:text-green-700" href="#comments_list">
														<svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path stroke="currentColor" d="M12.877 1C15.3295 1 17.2387 1.11137 18.732 1.39866C20.2202 1.68498 21.2207 2.13251 21.9215 2.75018C23.3136 3.97734 23.877 6.19513 23.877 10.6667C23.877 13.5482 23.6182 15.6685 22.9217 17.0498C22.5874 17.7127 22.164 18.1797 21.6313 18.4903C21.0928 18.8042 20.371 19 19.3772 19C18.096 19 17.1345 19.2877 16.3825 19.7971C15.6486 20.2944 15.2059 20.9455 14.8766 21.4637C14.8268 21.542 14.7802 21.6161 14.736 21.6862C14.4599 22.1245 14.2813 22.4082 14.0332 22.6307C13.8121 22.8291 13.5032 23 12.8772 23C12.2513 23 11.9424 22.8291 11.7213 22.6307C11.4732 22.4081 11.2946 22.1245 11.0185 21.6862C10.9743 21.6161 10.9277 21.542 10.8778 21.4636C10.5485 20.9454 10.1058 20.2944 9.37185 19.7971C8.61993 19.2877 7.65835 19 6.3772 19C5.3887 19 4.66913 18.7993 4.13083 18.4789C3.59659 18.1609 3.17049 17.6832 2.83402 17.0102C2.13502 15.612 1.87695 13.488 1.87695 10.6667C1.87695 6.25195 2.4387 4.02841 3.83557 2.78674C4.53837 2.16203 5.54048 1.70608 7.02679 1.41246C8.5185 1.11777 10.4265 1 12.877 1Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
															<path stroke="currentColor" d="M13.877 9H17.877" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
															<path stroke="currentColor" d="M7.87598 13H17.876" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
														</svg>
														<span class="mr-1 text-xl">8</span>
													</a>
												</li>
												<li wire:id="mfUHWtCY7hB1KAWu4Lvc" class="flex items-center text-gray-300 text-22 font-normal group hover:text-red-700 ml-6 cursor-pointer" wire:click="like">
													<svg width="20" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path class="stroke-current text-dark-350 group-hover:text-red-700" d="M8.44863 1C10.139 1 11.681 1.84142 12.8486 2.8C14.0163 1.84142 15.5583 1 17.2486 1C20.8937 1 23.8486 3.71049 23.8486 7.05386C23.8486 13.795 16.1761 17.721 13.6467 18.8321C13.1372 19.056 12.5601 19.056 12.0506 18.8321C9.52122 17.721 1.84863 13.7948 1.84863 7.0537C1.84863 3.71033 4.80355 1 8.44863 1Z" stroke-width="2"></path>
													</svg>
													<span class="mr-1 text-xl">3</span>
												</li>
												<!-- Livewire Component wire-end:mfUHWtCY7hB1KAWu4Lvc -->
												<li wire:id="gxE0TIoBlCgTcQUqDGZU" class="cursor-pointer text-gray-300 hover:text-blue-700" wire:click="bookmark">
													<svg width="20" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path class="stroke-current" d="M4.23184 22.6504L4.2318 22.6503L4.22199 22.6572C3.04557 23.4827 1.42138 22.7355 1.30875 21.2832C1.17635 19.576 0.999972 16.4481 1 11.8995V11.8175V11.8174C0.999969 10.0118 1.00095 8.43863 1.12977 7.12592C1.26037 5.79506 1.53145 4.60334 2.16086 3.63263C3.47704 1.60273 6.01221 1.01675 9.99537 1.00034C13.9832 0.983922 16.5219 1.56713 17.8395 3.6099C18.468 4.58436 18.7388 5.78163 18.8693 7.11699C18.9981 8.43473 18.9991 10.012 18.999 11.8183V11.8995C18.999 16.4481 18.8226 19.576 18.6902 21.2832C18.5776 22.7355 16.9534 23.4827 15.777 22.6572L15.7771 22.6571L15.7672 22.6504C14.7352 21.9445 13.7802 21.1846 13.036 20.5921L13.0227 20.5815C12.6844 20.3122 12.3775 20.0678 12.1367 19.8893C11.6849 19.5545 11.3077 19.3258 10.9582 19.185C10.5777 19.0318 10.2705 18.999 9.99952 18.999C9.72852 18.999 9.4213 19.0318 9.04088 19.185C8.69134 19.3258 8.31411 19.5545 7.86233 19.8893C7.62156 20.0678 7.3145 20.3123 6.97629 20.5815L6.96307 20.5921C6.21886 21.1846 5.26383 21.9445 4.23184 22.6504Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
														<path class="stroke-current" d="M11.999 5.00391C12.999 5.00391 13.499 5.00011 14.2489 5.74813C14.9989 6.49615 14.9989 8.99982 14.9989 9.99976" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
													</svg>
												</li>
												<!-- Livewire Component wire-end:gxE0TIoBlCgTcQUqDGZU -->
											</ul>
											<div class="flex items-center self-center">
												<ul class="flex items-center ml-6">
													<li class="ml-6">
														<a class="group" href="https://telegram.me/share/url?url=https://roocket.ir/articles/best-nosql-databases/&amp;text=بهترین دیتابیس های NoSQL">
															<svg class="text-gray-300 dark:text-gray-920 dark:group-hover:text-blue-450 group-hover:text-blue-700" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M17.1812 1.43782C17.7318 1.99732 17.8964 2.77587 17.9588 3.34141C18.0285 3.97263 18.0045 4.69678 17.9256 5.4424C17.7668 6.94177 17.3632 8.72911 16.8229 10.4495C16.2832 12.1676 15.5849 13.89 14.8061 15.2427C14.4181 15.9167 13.9837 16.5454 13.505 17.0413C13.0477 17.5152 12.4168 18.0068 11.6219 18.1408L11.6176 18.1415C11.468 18.1663 11.3222 18.1718 11.2707 18.1737L11.2609 18.1741C10.7419 18.1952 10.2937 18.0121 9.98772 17.8478C9.66058 17.6721 9.35359 17.4401 9.07985 17.1969C8.5311 16.7094 7.99629 16.0696 7.5611 15.4022C7.32265 15.0366 7.09674 14.6361 6.91208 14.2216C6.63817 13.6067 6.80539 12.908 7.21969 12.377L9.73332 9.41514C9.862 9.26352 9.85262 9.03887 9.71176 8.89843C9.5709 8.75799 9.34558 8.74865 9.19351 8.87694L6.22286 11.3831C5.65663 11.8222 4.90778 11.9923 4.26019 11.6847C3.84611 11.488 3.44689 11.2509 3.08219 11.0001C2.39352 10.5265 1.73368 9.93895 1.24978 9.32648C1.00835 9.0209 0.780261 8.67087 0.624908 8.2922C0.474791 7.92628 0.345162 7.41644 0.467579 6.85874L0.467781 6.85782C0.635068 6.09628 1.13641 5.49328 1.61157 5.05408C2.11193 4.59159 2.74107 4.167 3.41658 3.78435C4.77199 3.01656 6.48839 2.32034 8.19992 1.77943C9.91233 1.23824 11.6895 0.830547 13.18 0.669997C13.921 0.590182 14.6431 0.565528 15.2739 0.636933C15.8403 0.701053 16.6237 0.871296 17.1812 1.43782Z" fill="currentColor" fill-opacity="0.5"></path>
															</svg>
														</a>
													</li>
													<li>
														<a class="group" href="https://twitter.com/share?text=بهترین دیتابیس های NoSQL&amp;url=https://roocket.ir/articles/best-nosql-databases/">
															<svg class="text-gray-300 dark:text-gray-920 dark:group-hover:text-blue-450 group-hover:text-blue-700" width="24" height="24" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M7.92323 18.5503C16.2597 18.5503 20.8207 11.6419 20.8207 5.65282C20.8207 5.45861 20.8164 5.26008 20.8078 5.06586C21.695 4.42422 22.4607 3.62945 23.0689 2.7189C22.2425 3.08655 21.3652 3.32665 20.4668 3.43102C21.4128 2.86402 22.121 1.97328 22.4603 0.923938C21.5704 1.45132 20.5973 1.82333 19.5825 2.02405C18.8988 1.29756 17.9948 0.816536 17.0103 0.65535C16.0257 0.494165 15.0155 0.661795 14.1358 1.13232C13.2561 1.60285 12.5559 2.35007 12.1435 3.25845C11.7311 4.16684 11.6294 5.18579 11.8541 6.15778C10.0522 6.06736 8.28947 5.59928 6.6801 4.78388C5.07073 3.96849 3.65068 2.82399 2.51201 1.42458C1.93328 2.42238 1.75618 3.60311 2.01672 4.72679C2.27726 5.85048 2.95588 6.8328 3.91466 7.47411C3.19487 7.45126 2.49084 7.25746 1.86075 6.90874V6.96484C1.8601 8.01196 2.2221 9.02699 2.88521 9.83739C3.54832 10.6478 4.47162 11.2035 5.49815 11.4102C4.83137 11.5926 4.13156 11.6192 3.45287 11.4879C3.74253 12.3884 4.30612 13.176 5.06497 13.7408C5.82382 14.3056 6.74008 14.6194 7.68586 14.6384C6.0802 15.8997 4.09675 16.5838 2.05496 16.5806C1.69286 16.58 1.33113 16.5578 0.97168 16.5141C3.04592 17.8448 5.45882 18.5516 7.92323 18.5503Z" fill="currentColor" fill-opacity="0.5"></path>
															</svg>
														</a>
													</li>
												</ul>
												<div class="flex items-center relative border border-gray-210 dark:border-opacity-0 overflow-hidden text-gray-300 dark:text-gray-200 rounded-3xl" x-data="">
													<input x-ref="articleLinkInput" style="direction: ltr" class="outline-none py-1.5 pl-8 pr-3 dark:bg-dark-890 border-none font-normal text-xs" type="text" readonly="" value="https://roocket.ir/articles/best-nosql-databases/" />
													<div @click="$clipboard($refs.articleLinkInput.value), successtoast.fire('لینک مورد نظر با موفقیت کپی شد')" class="absolute left-3 cursor-pointer">
														<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.1251 9.37753C11.1735 9.03246 11.2048 8.65154 11.2224 8.23142C11.342 8.16599 11.4325 8.09594 11.5044 8.02404C11.6726 7.85578 11.8308 7.58558 11.9433 7.07954C12.0583 6.56181 12.1108 5.86547 12.1108 4.91155C12.1108 3.00521 11.8476 2.22592 11.4625 1.84091C11.0775 1.45589 10.2983 1.19269 8.3919 1.19269C7.43799 1.19269 6.74164 1.24514 6.22392 1.3602C5.71788 1.47266 5.44768 1.63081 5.27942 1.79907C5.20752 1.87097 5.13746 1.96148 5.07203 2.08106C5.36761 2.06867 5.68259 2.06306 6.01814 2.06306C10.3187 2.06306 11.2404 2.98479 11.2404 7.2853C11.2404 11.5858 10.3187 12.5075 6.01814 12.5075C1.71762 12.5075 0.795898 11.5858 0.795898 7.2853C0.795898 3.79726 1.40225 2.53194 3.92593 2.17833C4.4152 0.577466 5.64584 0.164062 8.3919 0.164062C12.1899 0.164062 13.1394 1.11356 13.1394 4.91155C13.1394 7.65762 12.726 8.88826 11.1251 9.37753Z" fill="currentColor" fill-opacity="0.56"></path>
														</svg>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div :class="{ 'px-5': optionControl }" x-show="!focusMode">
						<div class="flex bg-white dark:bg-dark-930 dark:shadow-whiteShadow shadow-sm rounded px-12 pt-7 pb-9 mb-6 sm:flex-row flex-col items-center">
							<a class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden inline-flex border-3 border-blue-700 sm:ml-8 ml-2" href="/@reza.sys">
								<img class="w-full h-full hover:scale-110 transition duration-200 transform object-cover lozad" data-src="/img/default.png" alt="/@reza.sys" src="/img/default.png" data-loaded="true" />
							</a>
							<div class="w-full">
								<div class="flex sm:flex-row flex-col justify-between items-center sm:text-right text-center">
									<div>
										<span class="text-gray-800 sm:text-2xl dark:text-white dark:hover:text-blue-450 hover:text-blue-700 transition duration-200 text-lg font-bold">
											<a href="/articles/best-nosql-databases/">امیررضا سیستانه ای</a>
										</span>
										<h6 class="text-blue-350 text-15 font-medium"></h6>
									</div>
									<div class="my-1.5">
										<div wire:id="5OqxnsamFZjgrNUS6Udc">
											<button class="h-8 text-xs font-semibold px-6 border border-blue-700 dark:border-blue-450 dark:text-blue-450 dark:hover:text-white dark:hover:bg-blue-450 rounded text-blue-700 hover:bg-blue-700 hover:text-white transition duration-200" wire:loading.remove="" wire:click="follow">دنبال کردن</button>
											<button class="h-8 text-xs font-semibold px-6 border border-blue-700 dark:border-blue-450 dark:text-blue-450 dark:hover:text-white dark:hover:bg-blue-450 rounded text-blue-700 hover:bg-blue-700 hover:text-white transition duration-200" wire:loading="" wire:target="follow">
												<svg class="w-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
													<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
													<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
														<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
														<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
														<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
													</circle>
												</svg>
											</button>
										</div>

										<!-- Livewire Component wire-end:5OqxnsamFZjgrNUS6Udc -->
									</div>
								</div>

								<p class="text-gray-300 dark:text-gray-920 sm:text-sm text-base leading-normal mt-1.5"></p>
							</div>
						</div>

						<div wire:id="qsPBZPLmxuOM5oAhZRBO" wire:init="loadAdvertisements" wire:initial-data='{"fingerprint":{"id":"qsPBZPLmxuOM5oAhZRBO","name":"articles.layouts.show-advertisement","locale":"fa","path":"articles\/best-nosql-databases","method":"GET","v":"acj"},"effects":{"listeners":[]},"serverMemo":{"children":[],"errors":[],"htmlHash":"0b5f5b80","data":{"adsPlacement":"article_after_author_intro","subject":[],"currentUrl":"https:\/\/roocket.ir\/articles\/best-nosql-databases","class":null,"readyToLoad":false},"dataMeta":{"enums":{"adsPlacement":"Roocket\\RoocketMain\\Enums\\Advertisement\\AdsPlacement"},"models":{"subject":{"class":"App\\Article","id":817,"relations":["user","faqs","rates","categories","tags"],"connection":"mysql","collectionClass":null}}},"checksum":"df0d869f57ad58cda031673fa4af1e2168188368c6989256ed17a20f00a36767"}}'></div>

						<!-- Livewire Component wire-end:qsPBZPLmxuOM5oAhZRBO -->

						<div wire:id="rfExVRal8itlNRcxdiFL" x-data="" wire:init="loadComments" id="comments-list" class="lg:px-10 px-4 pt-9 pb-6 bg-white dark:bg-dark-930 shadow-sm rounded-lg">
							<div class="flex items-center sm:flex-row flex-col justify-between mb-6">
								<span class="text-blue-700 dark:text-white text-27 font-bold sm:mb-0 mb-3 flex items-center">
									<i class="w-2 h-2 bg-blue-700 dark:bg-white rounded-full ml-1 md:flex hidden"></i>
									دیدگاه و پرسش
								</span>

								<div class="flex flex-wrap justify-center sm:w-fit-content w-full relative">
									<div wire:id="C1OWJtJSzzm1vjH3fYgX" x-data="" class="sm:w-fit-content w-full flex justify-center">
										<div class="cursor-pointer group border text-sm justify-center sm:ml-3 border-blue-700 text-blue-700 dark:hover:border-blue-700 dark:text-white dark:border-white px-3 h-12 rounded flex items-center font-semibold sm:w-fit-content w-full transition duration-200 hover:bg-blue-700 hover:text-white" wire:loading.remove="" wire:target="subscriptionComments" wire:click="subscriptionComments">دنبال کردن نظرات</div>
										<div class="group border text-sm border-blue-700 text-blue-700 dark:border-white dark:text-white px-3 h-12 sm:ml-3 rounded flex justify-center items-center font-semibold sm:w-fit-content w-full transition duration-200" wire:loading.flex="" wire:target="subscriptionComments">
											<svg class="w-6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
												<circle class="stroke-current text-blue-700 dark:text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
												<circle class="stroke-current text-blue-700 dark:text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
													<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
													<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
													<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
												</circle>
											</svg>
										</div>
									</div>
									<button @click="$dispatch('show-send-comment', { id: 0 })" class="group border justify-center sm:mt-0 mt-4 sm:w-fit-content w-full border-blue-700 bg-blue-700 text-sm dark:hover:bg-transparent dark:hover:text-white dark:hover:border-white text-white px-3 h-12 rounded flex items-center font-semibold transition duration-200 hover:bg-white hover:text-blue-700 hover:shadow-sm">
										افزودن دیدگاه و پرسش جدید
										<svg class="mr-1" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path stroke="currentColor" opacity="0.5" d="M4.75 12.5C4.75 14.2328 4.84383 15.5741 5.07592 16.6184C5.30612 17.6543 5.66226 18.3514 6.15542 18.8446C6.64859 19.3377 7.34575 19.6939 8.38157 19.9241C9.4259 20.1562 10.7672 20.25 12.5 20.25C14.2328 20.25 15.5741 20.1562 16.6184 19.9241C17.6543 19.6939 18.3514 19.3377 18.8446 18.8446C19.3377 18.3514 19.6939 17.6543 19.9241 16.6184C20.1562 15.5741 20.25 14.2328 20.25 12.5C20.25 10.7672 20.1562 9.4259 19.9241 8.38157C19.6939 7.34575 19.3377 6.64859 18.8446 6.15542C18.3514 5.66226 17.6543 5.30613 16.6184 5.07592C15.5741 4.84383 14.2328 4.75 12.5 4.75C10.7672 4.75 9.4259 4.84383 8.38157 5.07592C7.34575 5.30613 6.64859 5.66226 6.15542 6.15542C5.66226 6.64859 5.30612 7.34575 5.07592 8.38157C4.84383 9.4259 4.75 10.7672 4.75 12.5Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
											<path stroke="currentColor" opacity="0.5" d="M7.01992 17.9803C8.24521 19.2055 9.25998 20.0876 10.1626 20.662C11.0578 21.2316 11.8026 21.4728 12.5 21.4728C13.1974 21.4728 13.9422 21.2316 14.8374 20.662C15.74 20.0876 16.7548 19.2055 17.9801 17.9803C19.2054 16.755 20.0874 15.7402 20.6618 14.8376C21.2314 13.9424 21.4726 13.1976 21.4726 12.5002C21.4726 11.8027 21.2314 11.058 20.6618 10.1627C20.0874 9.26017 19.2054 8.24539 17.9801 7.0201C16.7548 5.79482 15.74 4.91274 14.8374 4.33839C13.9422 3.76874 13.1974 3.5276 12.5 3.5276C11.8026 3.5276 11.0578 3.76874 10.1626 4.33839C9.25998 4.91274 8.24521 5.79482 7.01992 7.0201C5.79463 8.24539 4.91255 9.26017 4.33821 10.1627C3.76856 11.058 3.52741 11.8027 3.52741 12.5002C3.52741 13.1976 3.76856 13.9424 4.33821 14.8376C4.91255 15.7402 5.79463 16.755 7.01992 17.9803Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
											<path stroke="currentColor" d="M9.66699 12.4997H12.5003M15.3337 12.4997H12.5003M12.5003 12.4997V9.66634V15.333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
										</svg>
									</button>
								</div>
							</div>

							<div
								wire:id="Hx5Fr7vKCGF47SyQ7HNr"
								x-data="{ show : 0  , message : window.Livewire.find('Hx5Fr7vKCGF47SyQ7HNr').entangle('message').defer }"
								x-on:show-send-comment.window="
        if($event.detail.id === 0) show = 1
    "
								x-on:hide-send-comment.window="show = 0"
							>
								<div class="border border-gray-210 dark:border-opacity-10 rounded-lg mb-8 pt-9 pb-8 md:px-7 px-4" x-show="show" style="display: none">
									<div class="border-b border-gray-210 dark:border-opacity-10">
										<div class="flex mb-4 space-x-2 space-x-reverse">
											<div wire:id="uH7JeDsthBshJU0N2I1Z" class="relative hvr-ripple-out" style="" x-data="{ hover : false}" @mouseenter="hover = true" @mouseleave="hover = false">
												<div class="w-14 h-14 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-green-700">
													<a href="/@mehrsahayati">
														<img class="transition duration-200 transform group-hover:scale-110 w-full h-full lozad" data-src="/img/default.png" alt="user-avatar" />
														<div class="w-full h-full absolute top-0 right-0 bg-biscay-700 bg-opacity-20 z-0"></div>
													</a>
												</div>
											</div>

											<!-- Livewire Component wire-end:uH7JeDsthBshJU0N2I1Z -->
											<div class="flex relative justify-center flex-col space-y-1">
												<h6 class="font-semibold text-xl text-chambray-700 dark:text-white leading-6">
													<a href="/@mehrsahayati"> مهرسا حیاتی </a>
												</h6>
												<a href="/@mehrsahayati" class="text-gray-360 dark:text-gray-200 text-sm"> mehrsahayati@ </a>
											</div>
										</div>
									</div>
									<div>
										<div class="mt-5" x-show="show" style="display: none">
											<div class="space-y-3">
												<form class="form" id="form-6a423cdc47b5d" wire:submit.prevent="onSubmit">
													<div @editor-6a423cdc47b5d-content-update.window="message = $event.detail.content">
														<div>
															<div class="" x-data="editorData()" x-init="$watch('content' , v =&gt; $dispatch(`editor-6a423cdc47b5d-content-update` , { content : v}) )">
																<div class="flex justify-end items-end">
																	<span class="mute-text mb-1 font-bold text-gray-500 relative" x-show="window.wordsCount(content) &gt; 0" x-text="window.wordsCount(content) + ' کلمه'" style="display: none">0 کلمه</span>
																</div>
																<div class="roocket-editor">
																	<div class="flex justify-between sm:flex-row flex-col editor-section mb-4" id="editor_section_head" ref="buttons-section">
																		<div class="group flex items-center rounded-md bg-opacity-5 py-2 w-fit-content sm:mb-0 mb-4 cursor-pointer relative justify-center bg-gray-500 dark:bg-dark-900 dark:hover:bg-blue-700 hover:bg-blue-550 transition duration-200 px-2" :class="{ active: help }" x-on:click="help = !help">
																			<div class="flex items-center" x-data="{ hover : false }">
																				<span class="ml-2" @mouseenter="hover = true" @mouseleave="hover = false">
																					<svg class="w-6 text-biscay-700 dark:text-white group-hover:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																						<path opacity="0.4" d="M7.809 2H16.19C19.23 2 21 3.78 21 6.83V17.16C21 20.26 19.23 22 16.19 22H7.809C4.72 22 3 20.26 3 17.16V6.83C3 3.78 4.72 2 7.809 2Z" fill="currentColor"></path>
																						<path fill-rule="evenodd" clip-rule="evenodd" d="M15.92 6.6499V6.6599C16.351 6.6599 16.7 7.0099 16.7 7.4399C16.7 7.8699 16.351 8.2199 15.92 8.2199H12.931C12.5 8.2199 12.15 7.8699 12.15 7.4289C12.15 6.9999 12.5 6.6499 12.931 6.6499H15.92ZM8.08004 12.7399H15.92C16.351 12.7399 16.7 12.3899 16.7 11.9599C16.7 11.5299 16.351 11.1789 15.92 11.1789H8.08004C7.65004 11.1789 7.30004 11.5299 7.30004 11.9599C7.30004 12.3899 7.65004 12.7399 8.08004 12.7399ZM8.08004 17.3099H15.92C16.22 17.3499 16.51 17.1999 16.67 16.9499C16.83 16.6899 16.83 16.3599 16.67 16.1099C16.51 15.8499 16.22 15.7099 15.92 15.7399H8.08004C7.68104 15.7799 7.38004 16.1199 7.38004 16.5299C7.38004 16.9289 7.68104 17.2699 8.08004 17.3099Z" fill="currentColor"></path>
																					</svg>
																				</span>
																				<span class="font-semibold text-sm text-biscay-700 dark:text-white group-hover:text-white transition duration-200">راهنما</span>
																			</div>
																		</div>
																		<ul class="flex flex-wrap flex-row-reverse sm:justify-end bg-gray-500 bg-opacity-5 sm:py-3 pt-3 md:px-4 px-2 flex-wrap sm:mb-0 sm:space-x-3 rounded-md dark:bg-dark-900">
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-3 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z" class=""></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">تاکید</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-3 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M208 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm96-384H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" class="opacity-40"></path>
																						<path fill="currentColor" d="M158.75 96h82.5l-80 320h-82.5z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">تاکید</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30" id="emoji">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 224c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm-160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm194.4 64H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z" class=""></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">ایموجی</div></div>
																			</li>
																			<li class="sm:border-r border-solid border-biscay-700"></li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M44.45 252.59l37.11-37.1c9.84-9.84 26.78-3.3 27.29 10.6a184.45 184.45 0 0 0 9.69 52.72 16.08 16.08 0 0 1-3.78 16.61l-13.09 13.09c-28 28-28.9 73.66-1.15 102a72.07 72.07 0 0 0 102.32.51L270 343.79A72 72 0 0 0 270 242a75.64 75.64 0 0 0-10.34-8.57 16 16 0 0 1-6.95-12.6A39.86 39.86 0 0 1 264.45 191l21.06-21a16.06 16.06 0 0 1 20.58-1.74A152.05 152.05 0 0 1 327 400l-.36.37-67.2 67.2c-59.27 59.27-155.7 59.26-215 0s-59.26-155.72.01-214.98z" class="opacity-40"></path>
																						<path fill="currentColor" d="M410.33 203.49c28-28 28.9-73.66 1.15-102a72.07 72.07 0 0 0-102.32-.49L242 168.21A72 72 0 0 0 242 270a75.64 75.64 0 0 0 10.34 8.57 16 16 0 0 1 6.94 12.6A39.81 39.81 0 0 1 247.55 321l-21.06 21.05a16.07 16.07 0 0 1-20.58 1.74A152.05 152.05 0 0 1 185 112l.36-.37 67.2-67.2c59.27-59.27 155.7-59.26 215 0s59.27 155.7 0 215l-37.11 37.1c-9.84 9.84-26.78 3.3-27.29-10.6a184.45 184.45 0 0 0-9.69-52.72 16.08 16.08 0 0 1 3.78-16.61z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">لینک</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M176 32H48A48 48 0 0 0 0 80v128a48 48 0 0 0 48 48h80v64a64.06 64.06 0 0 1-64 64h-8a23.94 23.94 0 0 0-24 23.88V456a23.94 23.94 0 0 0 23.88 24H64a160 160 0 0 0 160-160V80a48 48 0 0 0-48-48z" class="opacity-40"></path>
																						<path fill="currentColor" d="M464 32H336a48 48 0 0 0-48 48v128a48 48 0 0 0 48 48h80v64a64.06 64.06 0 0 1-64 64h-8a23.94 23.94 0 0 0-24 23.88V456a23.94 23.94 0 0 0 23.88 24H352a160 160 0 0 0 160-160V80a48 48 0 0 0-48-48z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">نقله قول</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-5 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M422.12 18.16a12 12 0 0 1 8.2 14.9l-136.5 470.2a12 12 0 0 1-14.89 8.2l-61-17.7a12 12 0 0 1-8.2-14.9l136.5-470.2a12 12 0 0 1 14.89-8.2z" class="opacity-40"></path>
																						<path fill="currentColor" d="M636.23 247.26l-144.11-135.2a12.11 12.11 0 0 0-17 .5L431.62 159a12 12 0 0 0 .81 17.2L523 256l-90.59 79.7a11.92 11.92 0 0 0-.81 17.2l43.5 46.4a12 12 0 0 0 17 .6l144.11-135.1a11.94 11.94 0 0 0 .02-17.54zm-427.8-88.2l-43.5-46.4a12 12 0 0 0-17-.5l-144.11 135a11.94 11.94 0 0 0 0 17.5l144.11 135.1a11.92 11.92 0 0 0 17-.5l43.5-46.4a12 12 0 0 0-.81-17.2L117 256l90.6-79.7a11.92 11.92 0 0 0 .83-17.24z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">قرار دادن کد</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-5 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M424.49 120.48a12 12 0 0 0-17 0L272 256l-39.51-39.52a12 12 0 0 0-17 0L160 272v48h352V208zM64 336V128H48a48 48 0 0 0-48 48v256a48 48 0 0 0 48 48h384a48 48 0 0 0 48-48v-16H144a80.09 80.09 0 0 1-80-80z" class="opacity-40"></path>
																						<path fill="currentColor" d="M528 32H144a48 48 0 0 0-48 48v256a48 48 0 0 0 48 48h384a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48zM208 80a48 48 0 1 1-48 48 48 48 0 0 1 48-48zm304 240H160v-48l55.52-55.52a12 12 0 0 1 17 0L272 256l135.52-135.52a12 12 0 0 1 17 0L512 208z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">آپلود تصویر</div></div>
																			</li>
																			<li class="sm:border-r border-solid border-biscay-700 hidden sm:flex"></li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" class="opacity-40"></path>
																						<path fill="currentColor" d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">لیست شماره‌ای</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M496 384H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" class="opacity-40"></path>
																						<path fill="currentColor" d="M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">لیست</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M448 96v320h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H320a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V288H160v128h32a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32V96H32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-32v128h192V96h-32a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16z" class=""></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">عنوان</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white">
																						<path fill="currentColor" d="M108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z" class="opacity-40"></path>
																						<path fill="currentColor" d="M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" class="fa-primary"></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">خط جدا کننده</div></div>
																			</li>
																			<li class="sm:border-r border-solid border-biscay-700 hidden sm:flex"></li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white !text-gray-400">
																						<path fill="currentColor" d="M255.545 8c-66.269.119-126.438 26.233-170.86 68.685L48.971 40.971C33.851 25.851 8 36.559 8 57.941V192c0 13.255 10.745 24 24 24h134.059c21.382 0 32.09-25.851 16.971-40.971l-41.75-41.75c30.864-28.899 70.801-44.907 113.23-45.273 92.398-.798 170.283 73.977 169.484 169.442C423.236 348.009 349.816 424 256 424c-41.127 0-79.997-14.678-110.63-41.556-4.743-4.161-11.906-3.908-16.368.553L89.34 422.659c-4.872 4.872-4.631 12.815.482 17.433C133.798 479.813 192.074 504 256 504c136.966 0 247.999-111.033 248-247.998C504.001 119.193 392.354 7.755 255.545 8z" class=""></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">عقب</div></div>
																			</li>
																			<li class="cursor-pointer relative flex justify-4o....................................................... sm:mb-0 mb-3 items-center sm:w-fit-content w-30">
																				<span>
																					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 text-biscay-700 hover:text-biscay-500 dark:text-white !text-gray-400">
																						<path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z" class=""></path>
																					</svg>
																				</span>
																				<div class="absolute top-6 left-0 right-0 flex justify-center hidden z-40"><div class="text-biscay-700 bg-gray-80 whitespace-nowrap rounded text-sm px-1">جلو</div></div>
																			</li>
																		</ul>
																	</div>
																	<div class="bg-blue-700 dark:bg-dark-900 bg-opacity-10 border-b border-solid border-blue-200 hidden" :class="{ hidden: !help }">
																		<ul class="flex flex-wrap items-start w-full">
																			<li class="p-3 font-medium text-blue-700 dark:text-blue-450 dark:hover:text-white cursor-pointer hover:underline" id="code" x-on:click="helpsection = 'code'" :class="{ active: helpsection === 'code' }">کد و ارور</li>
																			<li class="p-3 font-medium text-blue-700 dark:text-blue-450 dark:hover:text-white cursor-pointer hover:underline" id="link" x-on:click="helpsection = 'link'" :class="{ active: helpsection === 'link' }">لینک</li>
																			<li class="p-3 font-medium text-blue-700 dark:text-blue-450 dark:hover:text-white cursor-pointer hover:underline" id="mention" x-on:click="helpsection = 'mention'" :class="{ active: helpsection === 'mention' }">اشاره به کاربران</li>
																			<li class="p-3 font-medium text-blue-700 dark:text-blue-450 dark:hover:text-white cursor-pointer hover:no-underline underline mr-auto">
																				<a href="https://roocket.ir/articles/learn-use-markdown/">راهنمای کامل</a>
																			</li>
																		</ul>
																		<template x-if="helpsection != ''">
																			<div class="content-area px-4 text-gray-400">
																				<template x-if="helpsection === 'code' ">
																					<div>
																						<p dir="rtl">برای نمایش قطعه کدها یا ارورهای خود می‌توانید از دکمه وارد کردن کد در بالا استفاده کنید یا می‌توانید از طریق <strong>markdown</strong> آن‌ها را در بین دو علامت ```code``` قرار دهید. خروجی این کار می‌تواند به نمایش بهتر کد و ارورهای شما کمک کند.&nbsp;</p>
																						<p dir="rtl">دقت کنید که ``` به معنی backtick می‌باشد سه backtick باز در ابتدا و بعد قرار دادن کدها یا ارورها و در نهایت سه backtick بسته. شما میتونید مکان قرار گیری دکمه backtick را در تصویر زیر مشاهده کنید :</p>
																						<p dir="rtl" style="text-align: center"><img src="https://roocket.ir/public/images/2019/8/7/TOn1U.png" alt="آموزش کار با Markdown" width="703" height="334" /></p>
																						<p>یک نمونه برای مشاهده روش استفاده از این علامت :</p>
																						<pre class="language-javascript"><code class="hljs"><span class="hljs-string"><span class="hljs-string">``</span></span><span class="hljs-string"><span class="hljs-string">`.my-link {text-decoration: underline;}`</span></span><span class="hljs-string"><span class="hljs-string">``</span></span></code></pre>
																					</div>
																				</template>
																				<template x-if="helpsection === 'link'">
																					<div>
																						<p>راحت‌ترین راه برای وارد کردن لینک استفاده از دکمه افزودن لینک در بالاست، اما اگر احساس می‌کنید که نیاز به ویژگی‌های دیگه‌ای از <strong>MarkDown</strong> دارید میتونید به متن زیر دقت کنید.</p>
																						<p>اگر لینک شما هیچ عنوانی ندارد می‌توانید خیلی ساده فقط لینک‌تان را کپی کنید و نیاز به کار خاصی نیست، مابقی رو ما برای‌تان انجام میدهیم.</p>
																					</div>
																				</template>
																				<template x-if="helpsection === 'mention'">
																					<div>
																						<p>در صورتی که مایل هستید شخصی از گفتگو یا پاسخ شما از طریق ایمیل یا پیامک مطلع شود میتوانید با استفاده از <strong>@</strong> و تایپ کردن نام‌ کاربری شخص، برای کاربر مورد نظر یک نوتیفیکیشن ارسال کنید</p>
																					</div>
																				</template>
																			</div>
																		</template>
																	</div>
																	<textarea
																		@editor-6a423cdc47b5d-content-init.window="content = $event.detail.content"
																		@focus="
																			$dispatch('guide', { status: 'body' });
																			content = $event.target.value;
																		"
																		@blur="content = $event.target.value"
																		x-model="content"
																		class="leading-loose w-full p-4 text-base dark:placeholder-gray-920 dark:text-white placeholder-gray-400 dark:border-dark-900 border-gray-100 dark:bg-dark-900"
																		x-ref="textarea"
																		id="editor-textarea-6a423cdc47b5d"
																		data-editor="240"
																		type="text"
																		rows="10"
																		placeholder="متن مورد نظر خود را وارد کنید ..."
																		data-editor-enable="1"
																		data-tribute="true"
																		style="height: 240px"
																	>
																	</textarea>
																	<div id="markdown-preview" class="hidden bg-gray-210 bg-opacity-80 dark:bg-opacity-30 cursor-not-allowed overflow-y-auto px-4 mb-4 content-area scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300 scrollbar-thumb-rounded" style="height: 240px; overflow-y: auto"></div>
																</div>
															</div>
														</div>
														<div class="flex sm:flex-row flex-col justify-between items-center mt-7" x-data="editorPreview('6a423cdc47b5d')">
															<div class="flex items-center sm:mb-0 mb-5" x-bind="togglePreview">
																<span class="text-base text-biscay-700 dark:text-white ml-4 font-semibold">پیش نمایش متن</span>
																<button type="button" :class="{ ' !bg-blue-700': preview }" class="w-14 h-7 bg-gray-300 dark:bg-gray-200 bg-opacity-30 transition-all duration-300 rounded-full relative">
																	<i class="w-5 h-5 bg-biscay-700 rounded-full absolute right-1 transition-all duration-300 top-1" :class="{ 'right-8 !bg-white': preview }"></i>
																</button>
															</div>
															<div class="flex items-center">
																<button wire:loading.remove="" wire:target="onSubmit" class="w-24 h-10 bg-blue-700 border-blue-700 border text-white text-sm font-bold ml-4 rounded-md transition duration-200 dark:hover:bg-transparent hover:bg-white hover:text-blue-700">ثبت دیدگاه</button>
																<button wire:loading.flex="" wire:target="onSubmit" type="button" class="w-24 h-10 bg-flex justify-center items-center bg-blue-700 border-blue-700 border text-white text-sm font-bold ml-4 rounded-md transition duration-200">
																	<svg class="w-5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
																		<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
																		<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
																			<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
																			<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
																			<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
																		</circle>
																	</svg>
																</button>
																<button type="button" @click="show = 0" class="w-24 h-10 border border-gray-300 text-gray-300 text-sm font-bold rounded-md transition duration-200 hover:bg-gray-300 hover:text-white">انصراف</button>
															</div>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Livewire Component wire-end:Hx5Fr7vKCGF47SyQ7HNr -->
							<div>
								<div class="-mb-6">
									<div class="space-y-10 space-y-reverse">
										
									</div>
								</div>

								<div class="mt-16 flex items-center justify-center"></div>
							</div>
						</div>

						<!-- Livewire Component wire-end:rfExVRal8itlNRcxdiFL -->
					</div>
				</div>
			</div>
		</div>

		<div class="xl:col-span-7 col-span-12">
			<div x-data="" @click="$nextTick(()=&gt; $dispatch('overlay-show')), $nextTick(()=&gt; $dispatch('focus-handler' , true)), $nextTick(()=&gt; $dispatch('focus-option-control' , true))" class="shadow-cardShadow-md text-blue-700 dark:hover:text-white dark:text-blue-450 bg-white dark:bg-transparent rounded-md lg:flex hidden justify-center py-4 px-8 cursor-pointer mb-5 dark:border-blue-450 dark:hover:bg-blue-450 border-2 border-transparent transition duration-200 hover:border-blue-700">
				<span class="font-semibold text-xl mt-1">مطالعه با تمرکز بیشتر</span>
				<svg class="mr-3" width="25" height="25" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M2.41688 18.1288C2.37276 17.4812 1.84226 16.9683 1.19322 16.9683C0.507763 16.9683 -0.0428014 17.5424 0.00264505 18.2263C0.515783 25.9488 3.03578 28.4687 10.7584 28.9818C11.4423 29.0272 12.0164 28.4766 12.0164 27.7912C12.0164 27.1421 11.5034 26.6116 10.8559 26.5675C9.60431 26.4823 8.54323 26.3431 7.63897 26.1421C6.00121 25.7781 5.02961 25.2444 4.38477 24.5996C3.73994 23.9548 3.20626 22.9832 2.84228 21.3454C2.64133 20.4412 2.50213 19.3802 2.41688 18.1288ZM26.4636 18.1288C26.5078 17.4812 27.0383 16.9683 27.6873 16.9683C28.3728 16.9683 28.9233 17.5424 28.8779 18.2263C28.3647 25.9487 25.8448 28.4686 18.1224 28.9817C17.4385 29.0272 16.8644 28.4766 16.8644 27.7912C16.8644 27.1421 17.3774 26.6116 18.0249 26.5675C19.2764 26.4822 20.3374 26.343 21.2416 26.1421C22.8793 25.7781 23.8509 25.2444 24.4958 24.5996C25.1406 23.9548 25.6743 22.9832 26.0382 21.3454C26.2392 20.4412 26.3784 19.3802 26.4636 18.1288ZM28.9842 14.5879C28.9843 14.5733 28.9843 14.5587 28.9843 14.5441C28.9843 14.5295 28.9843 14.5149 28.9842 14.5004V14.5879ZM28.8779 10.8622C28.9233 11.5462 28.3728 12.1203 27.6873 12.1203C27.0383 12.1203 26.5078 11.6073 26.4637 10.9598C26.3784 9.70817 26.2392 8.64709 26.0382 7.74283C25.6743 6.10507 25.1406 5.13346 24.4958 4.48863C23.8509 3.84379 22.8793 3.31011 21.2416 2.94613C20.3374 2.74519 19.2764 2.60599 18.0249 2.52073C17.3774 2.47661 16.8644 1.94612 16.8644 1.29707C16.8644 0.611617 17.4385 0.0610516 18.1224 0.106498C25.8449 0.619635 28.3648 3.13963 28.8779 10.8622ZM2.41686 10.9598C2.37275 11.6073 1.84225 12.1203 1.1932 12.1203C0.507747 12.1203 -0.0428162 11.5462 0.00262451 10.8622C0.515715 3.13953 3.03567 0.619571 10.7584 0.106479C11.4423 0.0610376 12.0164 0.611601 12.0164 1.29705C12.0164 1.9461 11.5034 2.4766 10.8559 2.52071C9.60431 2.60597 8.54323 2.74517 7.63897 2.94613C6.00121 3.31011 5.02961 3.84379 4.38477 4.48863C3.73994 5.13346 3.20626 6.10507 2.84228 7.74283C2.64132 8.64709 2.50211 9.70817 2.41686 10.9598ZM14.4403 0.00012207L14.482 0.000132514H14.3985L14.4403 0.00012207Z"
						fill="currentColor"
					></path>
					<path d="M7.24609 14.3881H21.7379" stroke="currentColor" stroke-width="2.4153" stroke-linecap="round" stroke-linejoin="round"></path>
					<path d="M12.0767 19.2188H16.9073" stroke="currentColor" stroke-width="2.4153" stroke-linecap="round" stroke-linejoin="round"></path>
					<path d="M9.66113 9.5575H19.3223" stroke="currentColor" stroke-width="2.4153" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</div>

			<div class="flex border border-gray-80 dark:border-opacity-0 dark:bg-dark-930 dark:shadow-whiteShadow border-opacity-60 rounded-md px-4 py-5 mb-5">
				<div class="ml-3 flex-shrink-0">
					<a href="/@reza.sys" class="rounded-full flex-shrink-0 flex border border-blue-700 overflow-hidden w-14 h-14">
						<img class="w-full h-full hover:scale-110 transition duration-200 transform object-cover lozad" data-src="/img/default.png?width=50&amp;height=50" src="/img/default.png?width=50&amp;height=50" data-loaded="true" />
					</a>
				</div>
				<div>
					<a href="/@reza.sys" class="text-biscay-700 dark:hover:text-blue-450 hover:text-blue-700 dark:text-white transition duration-200 text-22 font-bold mb-2">امیررضا سیستانه ای</a>
					<p class="text-gray-300 dark:text-gray-920 font-normal text-xs mb-3"></p>
					<div class="flex items-end justify-between">
						<div wire:id="cFfQjMdi98N2DKDBVvsn">
							<button class="font-medium text-white text-10 dark:hover:text-blue-450 dark:hover:bg-transparent dark:bg-blue-450 bg-blue-700 py-1 px-5 rounded hover:text-blue-700 hover:bg-transparent border border-blue-700 transition" wire:loading.remove="" wire:click="follow">دنبال کردن</button>
							<button class="font-medium text-white text-10 dark:hover:text-blue-450 dark:hover:bg-transparent dark:bg-blue-450 bg-blue-700 py-1 px-5 rounded hover:text-blue-700 hover:bg-transparent border border-blue-700 transition" wire:loading="" wire:target="follow">
								<svg class="w-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
									<circle class="stroke-current text-white text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
									<circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
										<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
										<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
										<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
									</circle>
								</svg>
							</button>
						</div>

						<!-- Livewire Component wire-end:cFfQjMdi98N2DKDBVvsn -->
					</div>
				</div>
			</div>
			<div class="border border-gray-80 dark:border-opacity-0 dark:shadow-whiteShadow dark:bg-dark-930 border-opacity-60 rounded-md py-7 px-5 mb-5">
				<div class="flex items-start mb-4">
					<div class="ml-2 text-biscay-700 dark:text-white">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.7 10C0.7 12.0428 0.81037 13.6365 1.08778 14.8848C1.36343 16.1251 1.79459 16.9809 2.40685 17.5932C3.0191 18.2054 3.87493 18.6366 5.11522 18.9122C6.36346 19.1896 7.95723 19.3 10 19.3C12.0428 19.3 13.6365 19.1896 14.8848 18.9122C16.1251 18.6366 16.9809 18.2054 17.5931 17.5932C18.2054 16.9809 18.6366 16.1251 18.9122 14.8848C19.1896 13.6365 19.3 12.0428 19.3 10C19.3 7.95723 19.1896 6.36346 18.9122 5.11522C18.6366 3.87493 18.2054 3.01911 17.5931 2.40685C16.9809 1.7946 16.1251 1.36343 14.8848 1.08778C13.6365 0.810369 12.0428 0.700001 10 0.700001C7.95723 0.700001 6.36346 0.810369 5.11522 1.08778C3.87493 1.36343 3.0191 1.7946 2.40685 2.40685C1.79459 3.01911 1.36343 3.87493 1.08778 5.11522C0.81037 6.36346 0.7 7.95723 0.7 10Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path opacity="0.4" d="M8.3335 5.83337H11.6668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M5.8335 10H14.1668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path opacity="0.4" d="M8.3335 14.1666L11.6668 14.1666" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>

					<div>
						<span class="mb-4 text-biscay-700 dark:text-white text-17 font-bold">۵ مقاله اخیر</span>
						<p class="font-normal text-13 dark:text-gray-920 text-dark-550">۵ مقاله اخیر از این قسمت برای شما در دسترس است</p>
					</div>
				</div>
				<div class="mb-8">
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="/articles/local-and-session-storage/" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">Local Storage و Session Storage: ذخیره داده در مرورگر کاربر</a>
							</div>
							<div class="flex items-center justify-end">
								<div class="flex items-center">
									<svg class="ml-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63581 8.1283C4.58728 8.1283 2.83789 8.43802 2.83789 9.67844C2.83789 10.9189 4.57619 11.2397 6.63581 11.2397C8.68434 11.2397 10.4332 10.9294 10.4332 9.68953C10.4332 8.44962 8.69544 8.1283 6.63581 8.1283Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63561 6.35906C7.97994 6.35906 9.06953 5.26897 9.06953 3.92464C9.06953 2.58031 7.97994 1.49072 6.63561 1.49072C5.29128 1.49072 4.20119 2.58031 4.20119 3.92464C4.19665 5.26443 5.27917 6.35452 6.61846 6.35906H6.63561Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<a href="/@arastoo" class="text-gray-300 text-10 font-medium"> ارسطو عباسی </a>
								</div>
								<span class="h-3 w-1md mx-2 bg-gray-100"></span>
								<div class="flex items-center">
									<svg class="ml-1" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2.85187 1.92625C2.71292 2.0652 2.64721 2.22804 2.61882 2.3966C3.13084 2.29797 3.76738 2.26079 4.55539 2.26079C5.34342 2.26079 5.97998 2.29798 6.49201 2.39661C6.46363 2.22804 6.39791 2.0652 6.25896 1.92625C6.04593 1.71322 5.58232 1.47856 4.55542 1.47856C3.52852 1.47856 3.0649 1.71322 2.85187 1.92625ZM2.29872 1.37311C1.87261 1.79922 1.81771 2.31778 1.81748 2.6498C0.898178 3.10172 0.644043 4.02215 0.644043 5.78099C0.644043 7.53984 0.898178 8.46027 1.81748 8.91219C1.81771 9.24421 1.87258 9.76281 2.29872 10.1889C2.72128 10.6115 3.43107 10.8658 4.55542 10.8658C5.67976 10.8658 6.38955 10.6115 6.81211 10.1889C7.23827 9.76279 7.29313 9.24417 7.29335 8.91216C8.2126 8.46022 8.46673 7.5398 8.46673 5.78099C8.46673 4.02219 8.2126 3.10177 7.29336 2.64983C7.29312 2.31782 7.23824 1.79923 6.81211 1.37311C6.38955 0.950547 5.67976 0.696289 4.55542 0.696289C3.43107 0.696289 2.72128 0.950547 2.29872 1.37311ZM6.49202 9.16538C5.97999 9.26401 5.34342 9.3012 4.55539 9.3012C3.76738 9.3012 3.13084 9.26402 2.61881 9.16539C2.64719 9.33398 2.7129 9.49684 2.85187 9.6358C3.0649 9.84884 3.52852 10.0835 4.55542 10.0835C5.58232 10.0835 6.04593 9.84884 6.25896 9.6358C6.39793 9.49683 6.46364 9.33397 6.49202 9.16538ZM1.91515 8.04673C1.62439 7.78504 1.42631 7.24962 1.42631 5.78099C1.42631 4.31237 1.62439 3.77695 1.91515 3.51526C2.06246 3.38268 2.30219 3.25757 2.73881 3.17024C3.18011 3.08197 3.76603 3.04305 4.55539 3.04305C5.34474 3.04305 5.93066 3.08197 6.37196 3.17024C6.80858 3.25757 7.04831 3.38268 7.19562 3.51526C7.48638 3.77695 7.68446 4.31237 7.68446 5.78099C7.68446 7.24962 7.48638 7.78504 7.19562 8.04673C7.04831 8.1793 6.80858 8.30442 6.37196 8.39175C5.93066 8.48002 5.34474 8.51893 4.55539 8.51893C3.76603 8.51893 3.18011 8.48002 2.73881 8.39175C2.30219 8.30442 2.06246 8.1793 1.91515 8.04673Z"
											fill="#98A3B8"
										></path>
										<path d="M4.55566 4.21643C4.55566 4.21643 4.55566 4.9987 4.55566 5.38983C4.55566 5.78097 4.55566 5.78097 4.9468 5.78097C5.33794 5.78097 6.51134 5.78097 6.51134 5.78097" stroke="#98A3B8" stroke-width="0.782269" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="text-gray-300 text-10 font-medium">زمان مطالعه: 12 دقیقه</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="/articles/what-is-core-web-vitals/" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">Core Web Vitals چیست؟ راهنمای کامل بهینه‌سازی سایت برای گوگل</a>
							</div>
							<div class="flex items-center justify-end">
								<div class="flex items-center">
									<svg class="ml-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63581 8.1283C4.58728 8.1283 2.83789 8.43802 2.83789 9.67844C2.83789 10.9189 4.57619 11.2397 6.63581 11.2397C8.68434 11.2397 10.4332 10.9294 10.4332 9.68953C10.4332 8.44962 8.69544 8.1283 6.63581 8.1283Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63561 6.35906C7.97994 6.35906 9.06953 5.26897 9.06953 3.92464C9.06953 2.58031 7.97994 1.49072 6.63561 1.49072C5.29128 1.49072 4.20119 2.58031 4.20119 3.92464C4.19665 5.26443 5.27917 6.35452 6.61846 6.35906H6.63561Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<a href="/@arastoo" class="text-gray-300 text-10 font-medium"> ارسطو عباسی </a>
								</div>
								<span class="h-3 w-1md mx-2 bg-gray-100"></span>
								<div class="flex items-center">
									<svg class="ml-1" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2.85187 1.92625C2.71292 2.0652 2.64721 2.22804 2.61882 2.3966C3.13084 2.29797 3.76738 2.26079 4.55539 2.26079C5.34342 2.26079 5.97998 2.29798 6.49201 2.39661C6.46363 2.22804 6.39791 2.0652 6.25896 1.92625C6.04593 1.71322 5.58232 1.47856 4.55542 1.47856C3.52852 1.47856 3.0649 1.71322 2.85187 1.92625ZM2.29872 1.37311C1.87261 1.79922 1.81771 2.31778 1.81748 2.6498C0.898178 3.10172 0.644043 4.02215 0.644043 5.78099C0.644043 7.53984 0.898178 8.46027 1.81748 8.91219C1.81771 9.24421 1.87258 9.76281 2.29872 10.1889C2.72128 10.6115 3.43107 10.8658 4.55542 10.8658C5.67976 10.8658 6.38955 10.6115 6.81211 10.1889C7.23827 9.76279 7.29313 9.24417 7.29335 8.91216C8.2126 8.46022 8.46673 7.5398 8.46673 5.78099C8.46673 4.02219 8.2126 3.10177 7.29336 2.64983C7.29312 2.31782 7.23824 1.79923 6.81211 1.37311C6.38955 0.950547 5.67976 0.696289 4.55542 0.696289C3.43107 0.696289 2.72128 0.950547 2.29872 1.37311ZM6.49202 9.16538C5.97999 9.26401 5.34342 9.3012 4.55539 9.3012C3.76738 9.3012 3.13084 9.26402 2.61881 9.16539C2.64719 9.33398 2.7129 9.49684 2.85187 9.6358C3.0649 9.84884 3.52852 10.0835 4.55542 10.0835C5.58232 10.0835 6.04593 9.84884 6.25896 9.6358C6.39793 9.49683 6.46364 9.33397 6.49202 9.16538ZM1.91515 8.04673C1.62439 7.78504 1.42631 7.24962 1.42631 5.78099C1.42631 4.31237 1.62439 3.77695 1.91515 3.51526C2.06246 3.38268 2.30219 3.25757 2.73881 3.17024C3.18011 3.08197 3.76603 3.04305 4.55539 3.04305C5.34474 3.04305 5.93066 3.08197 6.37196 3.17024C6.80858 3.25757 7.04831 3.38268 7.19562 3.51526C7.48638 3.77695 7.68446 4.31237 7.68446 5.78099C7.68446 7.24962 7.48638 7.78504 7.19562 8.04673C7.04831 8.1793 6.80858 8.30442 6.37196 8.39175C5.93066 8.48002 5.34474 8.51893 4.55539 8.51893C3.76603 8.51893 3.18011 8.48002 2.73881 8.39175C2.30219 8.30442 2.06246 8.1793 1.91515 8.04673Z"
											fill="#98A3B8"
										></path>
										<path d="M4.55566 4.21643C4.55566 4.21643 4.55566 4.9987 4.55566 5.38983C4.55566 5.78097 4.55566 5.78097 4.9468 5.78097C5.33794 5.78097 6.51134 5.78097 6.51134 5.78097" stroke="#98A3B8" stroke-width="0.782269" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="text-gray-300 text-10 font-medium">زمان مطالعه: 12 دقیقه</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="/articles/what-is-kubernetes/" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">Kubernetes (K8s) به زبان ساده: ارکستراسیون کانتینرها برای حرفه‌ای‌ها</a>
							</div>
							<div class="flex items-center justify-end">
								<div class="flex items-center">
									<svg class="ml-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63581 8.1283C4.58728 8.1283 2.83789 8.43802 2.83789 9.67844C2.83789 10.9189 4.57619 11.2397 6.63581 11.2397C8.68434 11.2397 10.4332 10.9294 10.4332 9.68953C10.4332 8.44962 8.69544 8.1283 6.63581 8.1283Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63561 6.35906C7.97994 6.35906 9.06953 5.26897 9.06953 3.92464C9.06953 2.58031 7.97994 1.49072 6.63561 1.49072C5.29128 1.49072 4.20119 2.58031 4.20119 3.92464C4.19665 5.26443 5.27917 6.35452 6.61846 6.35906H6.63561Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<a href="/@arastoo" class="text-gray-300 text-10 font-medium"> ارسطو عباسی </a>
								</div>
								<span class="h-3 w-1md mx-2 bg-gray-100"></span>
								<div class="flex items-center">
									<svg class="ml-1" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2.85187 1.92625C2.71292 2.0652 2.64721 2.22804 2.61882 2.3966C3.13084 2.29797 3.76738 2.26079 4.55539 2.26079C5.34342 2.26079 5.97998 2.29798 6.49201 2.39661C6.46363 2.22804 6.39791 2.0652 6.25896 1.92625C6.04593 1.71322 5.58232 1.47856 4.55542 1.47856C3.52852 1.47856 3.0649 1.71322 2.85187 1.92625ZM2.29872 1.37311C1.87261 1.79922 1.81771 2.31778 1.81748 2.6498C0.898178 3.10172 0.644043 4.02215 0.644043 5.78099C0.644043 7.53984 0.898178 8.46027 1.81748 8.91219C1.81771 9.24421 1.87258 9.76281 2.29872 10.1889C2.72128 10.6115 3.43107 10.8658 4.55542 10.8658C5.67976 10.8658 6.38955 10.6115 6.81211 10.1889C7.23827 9.76279 7.29313 9.24417 7.29335 8.91216C8.2126 8.46022 8.46673 7.5398 8.46673 5.78099C8.46673 4.02219 8.2126 3.10177 7.29336 2.64983C7.29312 2.31782 7.23824 1.79923 6.81211 1.37311C6.38955 0.950547 5.67976 0.696289 4.55542 0.696289C3.43107 0.696289 2.72128 0.950547 2.29872 1.37311ZM6.49202 9.16538C5.97999 9.26401 5.34342 9.3012 4.55539 9.3012C3.76738 9.3012 3.13084 9.26402 2.61881 9.16539C2.64719 9.33398 2.7129 9.49684 2.85187 9.6358C3.0649 9.84884 3.52852 10.0835 4.55542 10.0835C5.58232 10.0835 6.04593 9.84884 6.25896 9.6358C6.39793 9.49683 6.46364 9.33397 6.49202 9.16538ZM1.91515 8.04673C1.62439 7.78504 1.42631 7.24962 1.42631 5.78099C1.42631 4.31237 1.62439 3.77695 1.91515 3.51526C2.06246 3.38268 2.30219 3.25757 2.73881 3.17024C3.18011 3.08197 3.76603 3.04305 4.55539 3.04305C5.34474 3.04305 5.93066 3.08197 6.37196 3.17024C6.80858 3.25757 7.04831 3.38268 7.19562 3.51526C7.48638 3.77695 7.68446 4.31237 7.68446 5.78099C7.68446 7.24962 7.48638 7.78504 7.19562 8.04673C7.04831 8.1793 6.80858 8.30442 6.37196 8.39175C5.93066 8.48002 5.34474 8.51893 4.55539 8.51893C3.76603 8.51893 3.18011 8.48002 2.73881 8.39175C2.30219 8.30442 2.06246 8.1793 1.91515 8.04673Z"
											fill="#98A3B8"
										></path>
										<path d="M4.55566 4.21643C4.55566 4.21643 4.55566 4.9987 4.55566 5.38983C4.55566 5.78097 4.55566 5.78097 4.9468 5.78097C5.33794 5.78097 6.51134 5.78097 6.51134 5.78097" stroke="#98A3B8" stroke-width="0.782269" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="text-gray-300 text-10 font-medium">زمان مطالعه: 17 دقیقه</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="/articles/what-is-postman/" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">Postman چیست؟ راهنمای کامل تست و دیباگ کردن APIها</a>
							</div>
							<div class="flex items-center justify-end">
								<div class="flex items-center">
									<svg class="ml-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63581 8.1283C4.58728 8.1283 2.83789 8.43802 2.83789 9.67844C2.83789 10.9189 4.57619 11.2397 6.63581 11.2397C8.68434 11.2397 10.4332 10.9294 10.4332 9.68953C10.4332 8.44962 8.69544 8.1283 6.63581 8.1283Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63561 6.35906C7.97994 6.35906 9.06953 5.26897 9.06953 3.92464C9.06953 2.58031 7.97994 1.49072 6.63561 1.49072C5.29128 1.49072 4.20119 2.58031 4.20119 3.92464C4.19665 5.26443 5.27917 6.35452 6.61846 6.35906H6.63561Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<a href="/@arastoo" class="text-gray-300 text-10 font-medium"> ارسطو عباسی </a>
								</div>
								<span class="h-3 w-1md mx-2 bg-gray-100"></span>
								<div class="flex items-center">
									<svg class="ml-1" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2.85187 1.92625C2.71292 2.0652 2.64721 2.22804 2.61882 2.3966C3.13084 2.29797 3.76738 2.26079 4.55539 2.26079C5.34342 2.26079 5.97998 2.29798 6.49201 2.39661C6.46363 2.22804 6.39791 2.0652 6.25896 1.92625C6.04593 1.71322 5.58232 1.47856 4.55542 1.47856C3.52852 1.47856 3.0649 1.71322 2.85187 1.92625ZM2.29872 1.37311C1.87261 1.79922 1.81771 2.31778 1.81748 2.6498C0.898178 3.10172 0.644043 4.02215 0.644043 5.78099C0.644043 7.53984 0.898178 8.46027 1.81748 8.91219C1.81771 9.24421 1.87258 9.76281 2.29872 10.1889C2.72128 10.6115 3.43107 10.8658 4.55542 10.8658C5.67976 10.8658 6.38955 10.6115 6.81211 10.1889C7.23827 9.76279 7.29313 9.24417 7.29335 8.91216C8.2126 8.46022 8.46673 7.5398 8.46673 5.78099C8.46673 4.02219 8.2126 3.10177 7.29336 2.64983C7.29312 2.31782 7.23824 1.79923 6.81211 1.37311C6.38955 0.950547 5.67976 0.696289 4.55542 0.696289C3.43107 0.696289 2.72128 0.950547 2.29872 1.37311ZM6.49202 9.16538C5.97999 9.26401 5.34342 9.3012 4.55539 9.3012C3.76738 9.3012 3.13084 9.26402 2.61881 9.16539C2.64719 9.33398 2.7129 9.49684 2.85187 9.6358C3.0649 9.84884 3.52852 10.0835 4.55542 10.0835C5.58232 10.0835 6.04593 9.84884 6.25896 9.6358C6.39793 9.49683 6.46364 9.33397 6.49202 9.16538ZM1.91515 8.04673C1.62439 7.78504 1.42631 7.24962 1.42631 5.78099C1.42631 4.31237 1.62439 3.77695 1.91515 3.51526C2.06246 3.38268 2.30219 3.25757 2.73881 3.17024C3.18011 3.08197 3.76603 3.04305 4.55539 3.04305C5.34474 3.04305 5.93066 3.08197 6.37196 3.17024C6.80858 3.25757 7.04831 3.38268 7.19562 3.51526C7.48638 3.77695 7.68446 4.31237 7.68446 5.78099C7.68446 7.24962 7.48638 7.78504 7.19562 8.04673C7.04831 8.1793 6.80858 8.30442 6.37196 8.39175C5.93066 8.48002 5.34474 8.51893 4.55539 8.51893C3.76603 8.51893 3.18011 8.48002 2.73881 8.39175C2.30219 8.30442 2.06246 8.1793 1.91515 8.04673Z"
											fill="#98A3B8"
										></path>
										<path d="M4.55566 4.21643C4.55566 4.21643 4.55566 4.9987 4.55566 5.38983C4.55566 5.78097 4.55566 5.78097 4.9468 5.78097C5.33794 5.78097 6.51134 5.78097 6.51134 5.78097" stroke="#98A3B8" stroke-width="0.782269" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="text-gray-300 text-10 font-medium">زمان مطالعه: 14 دقیقه</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="/articles/what-is-xss-csrf/" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">XSS و CSRF چیست؟ چگونه از وب اپلیکیشن خود در برابر این حملات محافظت کنیم؟</a>
							</div>
							<div class="flex items-center justify-end">
								<div class="flex items-center">
									<svg class="ml-1" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63581 8.1283C4.58728 8.1283 2.83789 8.43802 2.83789 9.67844C2.83789 10.9189 4.57619 11.2397 6.63581 11.2397C8.68434 11.2397 10.4332 10.9294 10.4332 9.68953C10.4332 8.44962 8.69544 8.1283 6.63581 8.1283Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M6.63561 6.35906C7.97994 6.35906 9.06953 5.26897 9.06953 3.92464C9.06953 2.58031 7.97994 1.49072 6.63561 1.49072C5.29128 1.49072 4.20119 2.58031 4.20119 3.92464C4.19665 5.26443 5.27917 6.35452 6.61846 6.35906H6.63561Z" stroke="#98A3B8" stroke-width="0.779661" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<a href="/@arastoo" class="text-gray-300 text-10 font-medium"> ارسطو عباسی </a>
								</div>
								<span class="h-3 w-1md mx-2 bg-gray-100"></span>
								<div class="flex items-center">
									<svg class="ml-1" width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2.85187 1.92625C2.71292 2.0652 2.64721 2.22804 2.61882 2.3966C3.13084 2.29797 3.76738 2.26079 4.55539 2.26079C5.34342 2.26079 5.97998 2.29798 6.49201 2.39661C6.46363 2.22804 6.39791 2.0652 6.25896 1.92625C6.04593 1.71322 5.58232 1.47856 4.55542 1.47856C3.52852 1.47856 3.0649 1.71322 2.85187 1.92625ZM2.29872 1.37311C1.87261 1.79922 1.81771 2.31778 1.81748 2.6498C0.898178 3.10172 0.644043 4.02215 0.644043 5.78099C0.644043 7.53984 0.898178 8.46027 1.81748 8.91219C1.81771 9.24421 1.87258 9.76281 2.29872 10.1889C2.72128 10.6115 3.43107 10.8658 4.55542 10.8658C5.67976 10.8658 6.38955 10.6115 6.81211 10.1889C7.23827 9.76279 7.29313 9.24417 7.29335 8.91216C8.2126 8.46022 8.46673 7.5398 8.46673 5.78099C8.46673 4.02219 8.2126 3.10177 7.29336 2.64983C7.29312 2.31782 7.23824 1.79923 6.81211 1.37311C6.38955 0.950547 5.67976 0.696289 4.55542 0.696289C3.43107 0.696289 2.72128 0.950547 2.29872 1.37311ZM6.49202 9.16538C5.97999 9.26401 5.34342 9.3012 4.55539 9.3012C3.76738 9.3012 3.13084 9.26402 2.61881 9.16539C2.64719 9.33398 2.7129 9.49684 2.85187 9.6358C3.0649 9.84884 3.52852 10.0835 4.55542 10.0835C5.58232 10.0835 6.04593 9.84884 6.25896 9.6358C6.39793 9.49683 6.46364 9.33397 6.49202 9.16538ZM1.91515 8.04673C1.62439 7.78504 1.42631 7.24962 1.42631 5.78099C1.42631 4.31237 1.62439 3.77695 1.91515 3.51526C2.06246 3.38268 2.30219 3.25757 2.73881 3.17024C3.18011 3.08197 3.76603 3.04305 4.55539 3.04305C5.34474 3.04305 5.93066 3.08197 6.37196 3.17024C6.80858 3.25757 7.04831 3.38268 7.19562 3.51526C7.48638 3.77695 7.68446 4.31237 7.68446 5.78099C7.68446 7.24962 7.48638 7.78504 7.19562 8.04673C7.04831 8.1793 6.80858 8.30442 6.37196 8.39175C5.93066 8.48002 5.34474 8.51893 4.55539 8.51893C3.76603 8.51893 3.18011 8.48002 2.73881 8.39175C2.30219 8.30442 2.06246 8.1793 1.91515 8.04673Z"
											fill="#98A3B8"
										></path>
										<path d="M4.55566 4.21643C4.55566 4.21643 4.55566 4.9987 4.55566 5.38983C4.55566 5.78097 4.55566 5.78097 4.9468 5.78097C5.33794 5.78097 6.51134 5.78097 6.51134 5.78097" stroke="#98A3B8" stroke-width="0.782269" stroke-linecap="round" stroke-linejoin="round"></path>
									</svg>
									<span class="text-gray-300 text-10 font-medium">زمان مطالعه: 9 دقیقه</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-center">
					<a href="/articles" class="group inline-flex items-center justify-center text-blue-700 dark:text-blue-450 dark:border-blue-450 dark:hover:text-white dark:hover:bg-blue-450 font-medium text-13 border border-blue-700 py-3 px-5 rounded hover:bg-blue-700 hover:text-white transition">
						مشاهده همه مقالات
						<svg class="mr-2" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill="currentColor" opacity="0.4" d="M11.1642 8.34338L13.7785 8.11218C14.3652 8.11218 14.8408 8.59249 14.8408 9.18489C14.8408 9.77729 14.3652 10.2576 13.7785 10.2576L11.1642 10.0264C10.704 10.0264 10.3308 9.64962 10.3308 9.18489C10.3308 8.71937 10.704 8.34338 11.1642 8.34338Z"></path>
							<path fill="currentColor" d="M2.38529 8.38587C2.42615 8.34461 2.5788 8.17024 2.72219 8.02545C3.55866 7.11855 5.74274 5.6356 6.88527 5.18176C7.05873 5.10937 7.4974 4.95523 7.73253 4.94434C7.95688 4.94434 8.1712 4.99649 8.3755 5.09925C8.63068 5.24326 8.83421 5.47057 8.94677 5.73836C9.01846 5.92363 9.13102 6.48022 9.13102 6.49034C9.24281 7.09831 9.30371 8.08694 9.30371 9.17989C9.30371 10.2199 9.24281 11.1681 9.15106 11.7861C9.14104 11.797 9.02849 12.4875 8.90591 12.7242C8.68156 13.157 8.2429 13.4248 7.77339 13.4248H7.73253C7.42647 13.4147 6.78351 13.1461 6.78351 13.1368C5.70188 12.6829 3.56946 11.2716 2.71217 10.3336C2.71217 10.3336 2.4701 10.0922 2.36525 9.94199C2.20181 9.72558 2.12009 9.4578 2.12009 9.19001C2.12009 8.89108 2.21183 8.61318 2.38529 8.38587Z"></path>
						</svg>
					</a>
				</div>
			</div>

			<div class="hidden lg:block">
				<div wire:id="BUQ3lOKLH83DODt8md0O" wire:init="loadAdvertisements">
					<div class="space-y-4 mb-4">
						<a href="https://app.pachim.sh/register?ref=TWNIDQKS" class="lg:flex group hidden flex-col bg-white group-hover:bg-gray-50 overflow-hidden items-center border border-gray-80 border-opacity-60 dark:border-opacity-5 rounded-lg">
							<div class="inline-block overflow-hidden w-full h-48">
								<img class="w-full h-full object-cover transform transition duration-200" src="https://static.roocket.ir/images/ads/2026/4/4/o3Y6TuHjTKkKIR4lc6pQ3dBGfRhg1NUBN3K84sj8.gif" />
							</div>
						</a>
					</div>
				</div>

				<!-- Livewire Component wire-end:BUQ3lOKLH83DODt8md0O -->
			</div>

			<div class="border border-gray-80 dark:border-opacity-0 mb-5 dark:shadow-whiteShadow dark:bg-dark-930 border-opacity-60 rounded-md py-7 px-5">
				<div class="flex items-start mb-4">
					<div class="text-biscay-700 dark:text-white ml-2">
						<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3.7 10C3.7 12.0428 3.81037 13.6365 4.08778 14.8848C4.36343 16.1251 4.79459 16.9809 5.40685 17.5932C6.0191 18.2054 6.87493 18.6366 8.11522 18.9122C9.36346 19.1896 10.9572 19.3 13 19.3C15.0428 19.3 16.6365 19.1896 17.8848 18.9122C19.1251 18.6366 19.9809 18.2054 20.5931 17.5932C21.2054 16.9809 21.6366 16.1251 21.9122 14.8848C22.1896 13.6365 22.3 12.0428 22.3 10C22.3 7.95723 22.1896 6.36346 21.9122 5.11522C21.6366 3.87493 21.2054 3.01911 20.5931 2.40685C19.9809 1.7946 19.1251 1.36343 17.8848 1.08778C16.6365 0.810369 15.0428 0.700001 13 0.700001C10.9572 0.700001 9.36346 0.810369 8.11522 1.08778C6.87493 1.36343 6.0191 1.7946 5.40685 2.40685C4.79459 3.01911 4.36343 3.87493 4.08778 5.11522C3.81037 6.36346 3.7 7.95723 3.7 10Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path opacity="0.4" d="M11.3335 5.83331H14.6668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path d="M8.8335 10H17.1668" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path opacity="0.4" d="M11.3335 14.1667L14.6668 14.1667" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M5.46011 13.7404L6.22153 15.2615C6.29615 15.4109 6.44019 15.5144 6.60723 15.5384L8.31056 15.7836C8.7314 15.8443 8.89887 16.3544 8.5943 16.6466L7.36258 17.8302C7.24153 17.9465 7.18643 18.1139 7.21506 18.2782L7.50575 19.9491C7.57734 20.3624 7.1374 20.6778 6.76125 20.4822L5.23884 19.6928C5.08959 19.6153 4.91084 19.6153 4.76116 19.6928L3.23875 20.4822C2.8626 20.6778 2.42266 20.3624 2.49468 19.9491L2.78494 18.2782C2.81357 18.1139 2.75847 17.9465 2.63742 17.8302L1.4057 16.6466C1.10113 16.3544 1.2686 15.8443 1.68944 15.7836L3.39277 15.5384C3.55981 15.5144 3.70428 15.4109 3.77891 15.2615L4.53989 13.7404C4.72819 13.3643 5.27181 13.3643 5.46011 13.7404Z" fill="white" stroke="#FFA826" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</div>
					<div>
						<span class="mb-4 text-biscay-700 dark:text-white text-17 font-bold">مطالب مرتبط</span>
						<p class="font-normal dark:text-gray-920 text-10 text-dark-550">شما می‌توانید مطالب مرتبط به این مطلب را اینجا مشاهده کنید</p>
					</div>
				</div>
				<div class="mb-8">
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-html" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش html</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learning-php" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش php</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-css" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش css</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/skills/wordpress" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش وردپرس</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/skills/javascript" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش جاوا اسکریپت</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-python" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش پایتون</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/skills/flutter" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش فلاتر</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-react-js" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش react</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش برنامه نویسی</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/articles/50-beautiful-and-free-wordpress-themes" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">قالب وردپرس رایگان</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-mysql" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش mysql</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-angular" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش انگولار</a>
							</div>
						</div>
					</div>
					<div class="flex items-start bg-white dark:bg-dark-890 rounded shadow-sm mb-3 py-4 px-4">
						<div class="space-y-2 w-full">
							<div class="relative">
								<span class="w-1 h-full bg-blue-700 dark:bg-blue-450 rounded-l-md -right-4 absolute"></span>
								<a href="https://roocket.ir/series/learn-dart" class="text-biscay-700 dark:text-white dark:hover:text-blue-450 font-bold text-15 hover:text-blue-700 transition duration-200">آموزش زبان دارت</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {};
</script>
