<template>
    <div v-if="loading" class="bg-yellow-100 dark:bg-yellow-400 dark:bg-opacity-20 dark:text-amber-400 text-amber-500 border border-dashed border-yellow-300 rounded-xl p-4 font-semibold flex items-center space-x-2 space-x-reverse mb-6">
        <svg class="w-8 h-8 rtl:ml-2 ltr:mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
            <circle class="stroke-current text-yellow-500 text-opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
            <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
            </circle>
        </svg>
        <p>{{ $t('profile.common.loadingServer') }}</p>
    </div>
    <div v-else-if="user" class="flex flex-col rounded-xl bg-white dark:bg-gray-900 py-8 px-6 lg:p-10">
        <div class="mx-2 w-[40%] md:w-[30%] h-[3px] bg-amber-400 rounded-full"></div>
        <div class="-mt-5 w-max pe-2 text-xl font-bold text-black dark:text-gray-50 bg-white dark:bg-gray-900 py-1">{{ $t('profile.public.aboutMe') }}</div>
        <p class="mt-5 font-medium text-gray-600 dark:text-gray-400 leading-7">{{ user.info.about }}</p>
        <div class="mt-10 w-max pe-2 text-xl font-bold text-black dark:text-gray-50 bg-white dark:bg-gray-900 py-1">{{ $t('profile.about.whatIDo') }}</div>
        <p class="mt-5 font-medium text-gray-600 dark:text-gray-400 leading-7">{{ user.info.job }}</p>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import { useSEO } from "@/composables/useSEO";
export default {
    components: {},
    props: {
        username: String,
    },

    data() {
        return {
            loading: false,
            user: null,
        };
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
    },
    methods: {
        async getUserInfo() {
            this.loading = true;
            await axiosInstance
                .post(`/@${this.username}/about`)
                .then((response) => {
                    this.user = response.data.user;
                    const fullName = `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim()
                    const profilePic = this.user.profile_pic ? (this.user.profile_pic.startsWith('http') ? this.user.profile_pic : `${process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'}${this.user.profile_pic}`) : null
                    useSEO({
                        title: this.$t('profile.seo.profileTitle', { name: fullName }),
                        description: this.user?.info?.about || this.user?.info?.job || this.$t('profile.seo.profileDesc', { name: fullName }),
                        image: profilePic || undefined,
                        url: `/@${this.username}`,
                        type: 'profile',
                        keywords: [
                            fullName,
                            this.username,
                            this.$t('profile.seo.kwUserProfile'),
                            this.$t('profile.seo.kwZanburakUser'),
                            this.user?.info?.job || ''
                        ].filter(Boolean),
                        imageAlt: this.$t('profile.seo.profileTitle', { name: fullName })
                    });
                })
                .catch((error) => {
                    console.error(error);
                    // this.$router.push({ name: "NotFound" });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {},
    beforeMount() {
        this.getUserInfo();
    },
};
</script>
