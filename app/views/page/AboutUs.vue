<template>
    <MasterPage>
        <div class="relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute -top-40 start-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl"></div>
                <div class="absolute top-1/3 -end-40 h-96 w-96 rounded-full bg-yellow-200/40 dark:bg-yellow-500/5 blur-3xl"></div>
            </div>

            <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <main class="font-medium space-y-20 md:space-y-28 py-14 md:py-20">
                    <!-- ===================== HERO ===================== -->
                    <section class="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-8">
                        <div class="order-2 md:order-1 text-center md:text-start">
                            <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/60 dark:border-amber-500/30 bg-amber-100/70 dark:bg-amber-500/10 px-4 py-1.5 text-xs md:text-sm font-bold text-amber-700 dark:text-amber-300">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clip-rule="evenodd"></path></svg>
                                {{ $t('about.seo.title') }}
                            </span>
                            <h1 class="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                {{ $t('about.hero.title') }}
                            </h1>
                            <div class="mt-4 flex items-center justify-center md:justify-start gap-1.5">
                                <span class="inline-block h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></span>
                                <span class="inline-block h-1 w-3 rounded-full bg-amber-400"></span>
                                <span class="inline-block h-1 w-1 rounded-full bg-amber-400"></span>
                            </div>
                            <p class="mt-6 text-sm md:text-base leading-7 md:leading-8 text-gray-600 dark:text-gray-300">{{ $t('about.hero.desc') }}</p>
                        </div>
                        <div class="order-1 md:order-2 flex justify-center">
                            <div class="relative">
                                <div class="pointer-events-none absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"></div>
                                <SeoImage
                                    priority
                                    img-class="w-64 md:w-96 drop-shadow-xl"
                                    :src="engineering_team"
                                    :alt="$t('about.seo.title')"
                                />
                            </div>
                        </div>
                    </section>

                    <!-- ===================== FEATURES ===================== -->
                    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                            v-for="(feature, idx) in features"
                            :key="'feature-' + idx"
                            class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/50"
                        >
                            <span class="pointer-events-none absolute -top-16 -end-16 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl opacity-0 transition duration-300 group-hover:opacity-100"></span>
                            <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-400/20 transition group-hover:bg-amber-400/20">
                                <img onerror="this.style.display='none'" :src="feature.icon" class="w-8 h-8" width="32" height="32" loading="lazy" decoding="async" :alt="feature.title" />
                            </span>
                            <h3 class="mt-6 text-base md:text-lg font-bold text-gray-800 dark:text-white transition group-hover:text-amber-600 dark:group-hover:text-amber-400">{{ feature.title }}</h3>
                            <p class="mt-2 flex-1 text-sm leading-7 text-gray-600 dark:text-gray-300">{{ feature.desc }}</p>
                            <router-link
                                v-if="feature.to"
                                :to="feature.to"
                                class="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 transition group-hover:text-amber-600 dark:group-hover:text-amber-400"
                            >
                                {{ $t('about.readMore') }}
                                <svg class="w-4 h-4 rtl:rotate-180 -translate-x-2 rtl:translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </router-link>
                            <a
                                v-else
                                :href="feature.href"
                                v-smooth-scroll
                                class="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 transition group-hover:text-amber-600 dark:group-hover:text-amber-400"
                            >
                                {{ $t('about.readMore') }}
                                <svg class="w-4 h-4 rtl:rotate-180 -translate-x-2 rtl:translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </a>
                        </div>
                    </section>

                    <!-- ===================== DEVELOPER / MISSION ===================== -->
                    <section class="relative">
                        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 m-auto grid max-w-4xl grid-cols-2 opacity-40 dark:opacity-20">
                            <div class="h-56 blur-[106px] bg-gradient-to-br from-amber-300 to-yellow-400 dark:from-amber-600"></div>
                            <div class="h-32 blur-[106px] bg-gradient-to-r from-yellow-300 to-orange-300 dark:to-orange-600"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-12">
                            <div class="flex justify-center">
                                <SeoImage
                                    :src="site_developer_pie"
                                    alt="site-developer"
                                    img-class="w-full max-w-md"
                                />
                            </div>
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 md:p-8 shadow-sm">
                                <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">{{ $t('about.dev.title') }}</h2>
                                <p class="mt-5 text-sm md:text-base leading-8 text-gray-600 dark:text-gray-300">
                                    {{ $t('about.dev.p1') }}
                                    <br /><br />
                                    {{ $t('about.dev.p2') }}
                                </p>
                                <div class="mt-8 divide-y divide-gray-100 dark:divide-gray-800">
                                    <div class="flex items-start gap-4 pb-4">
                                        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd"></path></svg>
                                        </span>
                                        <div>
                                            <h3 class="text-base font-bold text-gray-800 dark:text-white">{{ $t('about.dev.support.title') }}</h3>
                                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('about.dev.support.desc') }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4 pt-4">
                                        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-500">
                                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
                                        </span>
                                        <div>
                                            <h3 class="text-base font-bold text-gray-800 dark:text-white">{{ $t('about.dev.location.title') }}</h3>
                                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('about.dev.location.desc') }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- ===================== TEAM ===================== -->
                    <section id="our-team" class="scroll-mt-24">
                        <div class="mx-auto mb-12 max-w-2xl text-center">
                            <h2 class="inline-flex items-center justify-center gap-3 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                                <svg class="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clip-rule="evenodd"></path></svg>
                                {{ $t('about.team.title') }}
                            </h2>
                            <p class="mt-4 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-400">{{ $t('about.team.desc') }}</p>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                v-for="(person, idx) in team"
                                :key="'member-' + idx"
                                class="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/40"
                            >
                                <div class="flex items-center gap-4">
                                    <div class="relative h-16 w-16 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-yellow-500">
                                        <div class="h-full w-full overflow-hidden rounded-full bg-white dark:bg-gray-900">
                                            <SeoImage
                                                img-class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                :src="person.profilePic"
                                                :alt="person.name"
                                                width="96"
                                                height="96"
                                            />
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <h3 class="text-base md:text-lg font-bold text-gray-800 dark:text-white truncate">{{ person.name }}</h3>
                                        <p class="mt-0.5 inline-flex rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">{{ person.expertise }}</p>
                                    </div>
                                </div>
                                <hr class="my-4 border-gray-100 dark:border-gray-800" />
                                <p class="text-sm leading-7 text-gray-600 dark:text-gray-400">{{ person.description }}</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    </MasterPage>
</template>
<script>
import engineering_team from '@/assets/image/other/engineering-team.svg'
import site_developer_pie from '@/assets/image/other/site-developer-pie.svg'
import elearning from '@/assets/image/about-us/elearning.svg'
import team from '@/assets/image/about-us/team.svg'
import easy_access from '@/assets/image/about-us/easy-access.svg'
import support from '@/assets/image/about-us/support.svg'
import miladmahaki_2 from '@/assets/image/team/miladmahaki-2.jpg'
import hadizarehzadeh from '@/assets/image/team/hadizarehzadeh.jpg'
import mohammad from '@/assets/image/team/mohammad.jpg'
import leilabiyabani from '@/assets/image/team/leilabiyabani.jpg'
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import { useSEO } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        SeoImage,
    },
    data() {
        return {
            engineering_team,
            site_developer_pie,
        };
    },
    computed: {
        features() {
            return [
                {
                    title: this.$t("about.feature.projectBased.title"),
                    desc: this.$t("about.feature.projectBased.desc"),
                    icon: elearning,
                    to: { name: "courses" },
                },
                {
                    title: this.$t("about.feature.expertTeam.title"),
                    desc: this.$t("about.feature.expertTeam.desc"),
                    icon: team,
                    href: "#our-team",
                },
                {
                    title: this.$t("about.feature.easyAccess.title"),
                    desc: this.$t("about.feature.easyAccess.desc"),
                    icon: easy_access,
                    href: "#",
                },
                {
                    title: this.$t("about.feature.support.title"),
                    desc: this.$t("about.feature.support.desc"),
                    icon: support,
                    to: { name: "contact" },
                },
            ];
        },
        team() {
            return [
                {
                    name: this.$t("about.team.milad.name"),
                    expertise: this.$t("about.team.milad.expertise"),
                    profilePic: miladmahaki_2,
                    username: "miladmahaki",
                    description: this.$t("about.team.milad.description"),
                },
                {
                    name: this.$t("about.team.hadi.name"),
                    expertise: this.$t("about.team.hadi.expertise"),
                    profilePic: hadizarehzadeh,
                    username: "zarehadi2",
                    description: this.$t("about.team.hadi.description"),
                },
                {
                    name: this.$t("about.team.mohammad.name"),
                    expertise: this.$t("about.team.mohammad.expertise"),
                    profilePic: mohammad,
                    username: "mohammadghaedrahmati",
                    description: this.$t("about.team.mohammad.description"),
                },
                {
                    name: this.$t("about.team.leila.name"),
                    expertise: this.$t("about.team.leila.expertise"),
                    profilePic: leilabiyabani,
                    username: "leilabiyabani",
                    description: this.$t("about.team.leila.description"),
                },
            ];
        },
    },
    mounted() {
        useSEO({
            title: this.$t('about.seo.title'),
            description: this.$t('about.seo.description'),
            url: '/about',
            keywords: ['درباره ما', 'درباره زنبورک', 'تیم زنبورک', 'آموزش برنامه‌نویسی', 'پلتفرم آموزشی'],
            noindex: false
        });
    },
};
</script>

<style></style>
