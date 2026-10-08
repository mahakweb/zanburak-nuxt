<script setup>
	import { ref, onMounted } from "vue";

	const themeArray = ref(["system", "dark", "light"]);

	const currentThemeIndex = ref(
		localStorage.getItem("theme")
			? parseInt(themeArray.value.indexOf(localStorage.getItem("theme")))
			: 0
	);

	function changeTheme(next_theme = true) {
		if (next_theme) currentThemeIndex.value++;
		if (currentThemeIndex.value > 2) currentThemeIndex.value = 0;

		if (currentThemeIndex.value == 0) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
				localStorage.setItem("theme", "system");
			} else {
				document.documentElement.classList.remove("dark");
				localStorage.setItem("theme", "system");
			}
		} else if (currentThemeIndex.value == 1) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else if (currentThemeIndex.value == 2) {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
		document.documentElement.dispatchEvent(new Event("onChangeTheme"));
	}

	onMounted(() => {
		changeTheme(false);
	});
</script>

<template>
	<div>
		<button
			@click="changeTheme"
			class="text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 rounded-full text-sm p-3"
		>
			<span
				v-if="currentThemeIndex == 0"
				:title="$t('theme.system')"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
						stroke="currentColor"
						stroke-width="1.5"
					></path>
					<path
						opacity="0.5"
						d="M22 21H2"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					></path>
					<path
						opacity="0.5"
						d="M15 15H9"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					></path>
				</svg>
			</span>
			<span v-else-if="currentThemeIndex == 1" :title="$t('theme.dark')">
				<svg
					class="w-5 h-5"
					width="20"
					height="21"
					viewBox="-1 -2 25 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M19.9358 14.3652C20.0691 14.0415 19.9906 13.6679 19.7389 13.4276C19.4872 13.1873 19.115 13.1308 18.8051 13.2857C17.7584 13.8091 16.5801 14.1034 15.3317 14.1034C10.9835 14.1034 7.45846 10.5246 7.45846 6.1098C7.45846 4.32254 8.0352 2.67449 9.01033 1.34372C9.21644 1.06244 9.22917 0.680892 9.04229 0.386091C8.85541 0.0912907 8.50809 -0.054977 8.17055 0.0189828C3.50017 1.04235 2.17361e-07 5.25905 0 10.3077C-2.50276e-07 16.1208 4.64155 20.8333 10.3672 20.8333C14.6778 20.8333 18.372 18.1625 19.9358 14.3652Z"
						fill="currentColor"
					></path>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M13.0928 3.67116L13.7596 1.84183C13.9751 1.25035 14.4797 0.939795 14.9987 0.910156C15.5177 0.939795 16.0222 1.25035 16.2378 1.84183L16.9045 3.67116L18.7063 4.34807C19.9329 4.8089 19.9329 6.57032 18.7063 7.03114L16.9045 7.70806L16.2378 9.53738C16.0222 10.1289 15.5177 10.4394 14.9987 10.4691C14.4797 10.4394 13.9751 10.1289 13.7596 9.53738L13.0928 7.70806L11.2911 7.03114C10.0644 6.57032 10.0644 4.8089 11.2911 4.34807L13.0928 3.67116Z"
						fill="currentColor"
						fill-opacity="0.4"
					></path>
				</svg>
			</span>
			<span v-else :title="$t('theme.light')">
				<svg
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						fill-rule="evenodd"
						clip-rule="evenodd"
					></path>
				</svg>
			</span>
		</button>
	</div>
	<!-- <div class="bg-gray-400 dark:bg-gray-950 w-24 h-24"></div> -->
</template>

<style></style>
