<template>
	<ProfileMasterPage>
		
	</ProfileMasterPage>
</template>

<script>
	import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";

	export default {
		components: {
			ProfileMasterPage
		},
		data() {
			return {
				
			};
		},
		methods: {

		},
		mounted() {
			document.title = this.$t("panel.profile.documentTitle");
		}
	};
</script>
<style>

</style>
