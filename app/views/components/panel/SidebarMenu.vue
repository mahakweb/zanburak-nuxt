<template>
	<nav class="flex w-full flex-col gap-1.5 pb-1">
		<div
			v-for="section in menuSections"
			:key="section.key"
			class="rounded-xl border border-gray-200/60 bg-white/90 p-1 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-sm dark:border-gray-700/40 dark:bg-gray-800/60 dark:ring-white/[0.03]">
			<Disclosure
				v-if="section.collapsible"
				v-slot="{ open }"
				as="div"
				:default-open="isSectionOpen(section)">
				<DisclosureButton
					class="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-start transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30">
					<div class="flex items-center gap-1.5">
						<span class="h-1 w-1 shrink-0 rounded-full bg-yellow-400"></span>
						<p class="text-[11px] font-bold text-gray-500 dark:text-gray-400">
							{{ $t(section.labelKey) }}
						</p>
						<span
							v-if="!open"
							class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
							{{ section.items.length }}
						</span>
					</div>
					<svg
						class="h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200"
						:class="open ? 'rotate-180' : ''"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</DisclosureButton>
				<DisclosurePanel>
					<ul>
						<li v-for="item in section.items" :key="item.key">
							<component :is="item.route ? 'router-link' : 'button'" v-bind="itemLinkProps(item)" :class="itemClasses(item)">
								<span :class="iconBoxClasses(item)" v-html="item.icon"></span>
								<span class="truncate">{{ $t(item.labelKey) }}</span>
							</component>
						</li>
					</ul>
				</DisclosurePanel>
			</Disclosure>

			<template v-else>
				<div
					v-if="section.labelKey"
					class="mb-0.5 flex items-center gap-1.5 px-2 pb-0.5 pt-0.5">
					<span class="h-1 w-1 shrink-0 rounded-full bg-yellow-400"></span>
					<p class="text-[11px] font-bold text-gray-500 dark:text-gray-400">
						{{ $t(section.labelKey) }}
					</p>
				</div>
				<ul>
					<template v-for="item in section.items" :key="item.key">
						<li v-if="section.key === 'account' && item.key === 'logout'" class="hidden lg:block">
							<ChangeLang class="w-full">
								<template #trigger="{ open, current }">
									<button
										type="button"
										@click.prevent="open"
										:class="itemClasses({})">
										<span :class="iconBoxClasses({})">
											<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
												<circle cx="12" cy="12" r="10"></circle>
												<path d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"></path>
												<path d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>
											</svg>
										</span>
										<span class="flex min-w-0 flex-1 items-center justify-between gap-2 text-start">
											<span class="truncate">{{ $t('panel.language') }}</span>
											<span class="shrink-0 text-[11px] font-normal text-gray-400 dark:text-gray-500">{{ $t(current.name) }}</span>
										</span>
									</button>
								</template>
							</ChangeLang>
						</li>
						<li>
							<component :is="item.route ? 'router-link' : 'button'" v-bind="itemLinkProps(item)" :class="itemClasses(item)">
								<span :class="iconBoxClasses(item)" v-html="item.icon"></span>
								<span class="truncate">{{ $t(item.labelKey) }}</span>
							</component>
						</li>
					</template>
				</ul>
			</template>
		</div>
	</nav>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { PANEL_MENU_SECTIONS } from "@/config/panelMenuItems";
import ChangeLang from "@/views/components/ChangeLang.vue";

export default {
	components: {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		ChangeLang
	},
	data() {
		return {
			menuSections: PANEL_MENU_SECTIONS
		};
	},
	methods: {
		isSectionOpen(section) {
			if (section.defaultOpen) return true;
			return section.items.some((item) => this.isItemActive(item));
		},
		isItemActive(item) {
			if (!item.route) return false;
			if (item.route === "panel-profile") {
				return this.$route.name?.startsWith("panel-profile");
			}
			return this.$route.name === item.route;
		},
		itemLinkProps(item) {
			if (item.route) {
				return {
					to: { name: item.route },
					"data-active": this.isItemActive(item)
				};
			}
			return {
				type: "button",
				onClick: this.logout
			};
		},
		itemClasses(item) {
			const active = this.isItemActive(item);
			const base =
				"group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200";

			if (item.danger) {
				return [
					base,
					"text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
				];
			}

			if (active) {
				return [
					base,
					"bg-gradient-to-l from-yellow-400/20 via-yellow-400/8 to-transparent text-yellow-700 dark:text-yellow-400"
				];
			}

			return [
				base,
				"text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:text-gray-900 dark:hover:text-white"
			];
		},
		iconBoxClasses(item) {
			const active = this.isItemActive(item);
			const base =
				"flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all duration-200 [&_svg]:h-4 [&_svg]:w-4";

			if (item.danger) {
				return [
					base,
					"bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 dark:bg-gray-700/60 dark:text-gray-400 dark:group-hover:bg-red-500/20 dark:group-hover:text-red-400"
				];
			}

			if (active) {
				return [base, "bg-yellow-400 text-gray-900"];
			}

			return [
				base,
				"bg-gray-100 text-gray-500 group-hover:bg-yellow-400/15 group-hover:text-yellow-600 dark:bg-gray-700/60 dark:text-gray-400 dark:group-hover:bg-yellow-400/10 dark:group-hover:text-yellow-400"
			];
		},
		logout() {
			this.$store.dispatch("auth/logout");
			this.$router.push("/");
		},
		scrollToActiveItem() {
			this.$nextTick(() => {
				const activeElement = this.$el.querySelector('[data-active="true"]');
				if (!activeElement) return;

				const scrollableContainer = activeElement.closest(".panel-sidebar-scroll");
				if (!scrollableContainer) return;

				const containerRect = scrollableContainer.getBoundingClientRect();
				const elementRect = activeElement.getBoundingClientRect();
				const scrollTop = scrollableContainer.scrollTop;
				const elementTop = elementRect.top - containerRect.top + scrollTop;
				const scrollPosition = elementTop - containerRect.height / 2 + elementRect.height / 2;

				scrollableContainer.scrollTo({
					top: Math.max(0, scrollPosition),
					behavior: "smooth"
				});
			});
		}
	},
	watch: {
		$route() {
			this.scrollToActiveItem();
		}
	},
	mounted() {
		this.scrollToActiveItem();
	}
};
</script>
