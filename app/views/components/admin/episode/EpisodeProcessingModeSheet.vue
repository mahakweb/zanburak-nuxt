<template>
  <BottomSheetDrawer
    :model-value="modelValue"
    :max-width-class="'max-w-2xl sm:max-w-2xl'"
    :initialHeight="0.52"
    :maxHeight="0.8"
    :minHeight="0.32"
    :autoCloseOnMin="false"
    :closeOnBackdrop="true"
    :lockScroll="true"
    :panelClass="panelClass"
    :contentClass="'px-5 pb-5 overflow-auto custom-scrollbar'"
    :backdropClass="'bg-gray-900/40 backdrop-blur-sm'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div dir="rtl" class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="pt-2 pb-3.5 text-center">
        <div
          class="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 text-amber-500 ring-1 ring-amber-400/30"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-gray-900 dark:text-white">
          انتخاب روش پردازش ویدیو
        </h3>
        <p
          class="mx-auto mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          نحوه انکود و تبدیل کیفیت‌های ویدیو را مشخص کنید
        </p>
      </div>

      <!-- Mode cards (uniform size and fonts) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          class="group relative rounded-2xl border p-3.5 text-start transition-all duration-200 flex flex-col justify-between"
          :class="
            selected === mode.id
              ? 'border-amber-400 bg-amber-500/10 dark:bg-amber-400/10 shadow-sm ring-2 ring-amber-400/40'
              : 'border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40 hover:border-amber-400/50 hover:bg-gray-50 dark:hover:bg-gray-800/70'
          "
          @click="selected = mode.id"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl shadow-xs transition-colors"
                :class="
                  selected === mode.id
                    ? mode.id === 'local'
                      ? 'bg-sky-500 text-white'
                      : 'bg-amber-500 text-gray-900 font-bold'
                    : mode.id === 'local'
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                      : 'bg-amber-400/20 text-amber-700 dark:text-amber-400'
                "
              >
                <svg
                  v-if="mode.id === 'local'"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <rect x="2" y="4" width="20" height="13" rx="2" />
                  <path stroke-linecap="round" d="M8 21h8M12 17v4" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <rect x="3" y="4" width="18" height="7" rx="2" />
                  <rect x="3" y="14" width="18" height="7" rx="2" />
                  <path stroke-linecap="round" d="M7 7.5h.01M7 17.5h.01" />
                </svg>
              </div>

              <!-- Radio checkmark -->
              <span
                class="flex h-5 w-5 items-center justify-center rounded-full border transition-all"
                :class="
                  selected === mode.id
                    ? 'border-amber-500 bg-amber-500 text-gray-900 ring-2 ring-amber-400/30'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                "
              >
                <svg
                  v-if="selected === mode.id"
                  class="h-3 w-3 stroke-[3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>

            <span class="block text-xs font-bold text-gray-900 dark:text-white leading-tight">
              {{ mode.title }}
            </span>
            <span class="mt-1 block text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              {{ mode.description }}
            </span>
          </div>

          <ul class="mt-3 space-y-1 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
            <li
              v-for="point in mode.points"
              :key="point"
              class="flex items-center gap-1.5 text-[10.5px] text-gray-600 dark:text-gray-300"
            >
              <svg
                class="h-3 w-3 shrink-0 text-emerald-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ point }}</span>
            </li>
          </ul>
        </button>
      </div>

      <!-- Local mode: app availability + status -->
      <div v-if="selected === 'local'" class="mt-3 space-y-2">
        <div
          class="rounded-xl border p-3 text-xs leading-relaxed"
          :class="
            canUseLocal
              ? 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-700/40 dark:bg-sky-900/20 dark:text-sky-200'
              : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200'
          "
        >
          <template v-if="!isDesktopSupported">
            مرورگر شما از باز کردن برنامه دسکتاپ پشتیبانی نمی‌کند. از سیستم‌عامل ویندوز استفاده کنید یا پردازش روی سرور را انتخاب نمایید.
          </template>
          <template v-else-if="!canUseLocal">
            <div class="space-y-2">
              <div class="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-100 text-xs">
                <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>برنامه «پردازش محلی زنبورک» یافت نشد</span>
              </div>
              <p class="text-amber-800 dark:text-amber-200 text-[11px]">
                برای پردازش سریع و بدون صف، برنامه ویندوز را دانلود و نصب کنید:
              </p>
              <div class="pt-0.5 flex flex-wrap items-center gap-2">
                <a
                  :href="effectiveDownloadUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition shadow-sm text-xs"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  دانلود نرم‌افزار پردازش محلی
                </a>
                <button
                  type="button"
                  class="px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 underline hover:no-underline"
                  @click="probeProtocol(true)"
                >
                  بررسی مجدد
                </button>
                <button
                  type="button"
                  class="px-1.5 py-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  @click="manualOverride = true"
                >
                  (نصب کرده‌ام، ادامه)
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 text-sky-800 dark:text-sky-200">
              <svg class="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="font-medium">برنامه پردازش محلی آماده است. تبدیل ویدیو روی همین سیستم انجام می‌شود.</span>
            </div>
          </template>
        </div>

        <div
          v-if="optionsHref || settingsSummary"
          class="rounded-xl border border-gray-200/80 bg-white p-2.5 text-xs dark:border-gray-700/80 dark:bg-gray-900/60"
        >
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400 text-[11px]">کیفیت‌های انتخابی:</span>
            <router-link
              v-if="optionsHref"
              :to="optionsHref"
              class="font-bold text-amber-600 hover:underline dark:text-amber-400 text-[11px]"
            >
              ویرایش کیفیت‌ها
            </router-link>
          </div>
          <p class="mt-1 text-gray-700 dark:text-gray-300 text-[11px]">
            {{ settingsSummary }}
          </p>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="mt-4 flex items-stretch gap-2.5">
        <button
          type="button"
          class="h-10 flex-1 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('update:modelValue', false)"
        >
          انصراف
        </button>
        <button
          type="button"
          class="h-10 flex-[1.4] rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-xs font-bold text-gray-900 transition hover:from-amber-500 hover:to-yellow-500 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="selected === 'local' && !canUseLocal"
          @click="confirm"
        >
          {{
            selected === "local"
              ? "تایید و پردازش با برنامه محلی"
              : "تایید و پردازش با سرور ورکر"
          }}
        </button>
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** VideoProcessOptions object (see utils/videoProcessOptions.js). */
  options: { type: Object, default: () => ({}) },
  /** How long the browser waits for the protocol handler before giving up. */
  probeTimeout: { type: Number, default: 900 },
  /** URL of the desktop installer, if a download exists. */
  appDownloadUrl: { type: String, default: "" },
  /** Router location to the full quality/watermark settings. */
  optionsHref: { type: [String, Object], default: null },
});

const emit = defineEmits(["update:modelValue", "start", "launch"]);

const PROTOCOL = "zanburak-video://";
const STORAGE_COOKIE = "zb_local_processor_ready";

const panelClass =
  "bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]";

const modes = [
  {
    id: "server",
    title: "پردازش روی سرور ورکر",
    description: "ویدیو روی سرور آپلود و در صف پردازش قرار می‌گیرد.",
    points: ["بدون نیاز به برنامه جانبی", "ترافیک و منابع از سرور مصرف می‌شود"],
  },
  {
    id: "local",
    title: "پردازش روی این کامپیوتر",
    description: "تبدیل کیفیت‌ها با سرعت بالا روی سخت‌افزار سیستم شما انجام می‌شود.",
    points: ["سریع‌تر و بدون انتظار در صف", "صرفه‌جویی در ترافیک آپلود خام"],
  },
];

const selected = ref("local");
const isDesktopSupported = ref(true);
const appAvailable = ref(true);
const isAndroid = ref(false);
const manualOverride = ref(false);

const effectiveDownloadUrl = computed(
  () => props.appDownloadUrl || "https://dl.zanburak.ir/apps/ZanburakVideoProcessor-Setup.exe"
);

const canUseLocal = computed(
  () => (isDesktopSupported.value && appAvailable.value) || manualOverride.value
);

const settingsSummary = computed(() => {
  const opts = props.options || {};
  const outputs = opts.outputs || ["stream"];
  const labels = [];
  if (outputs.includes("stream")) {
    labels.push(`استریم ${(opts.stream_qualities || []).join("، ")}p`);
  }
  if (outputs.includes("download")) {
    labels.push(`دانلود ${(opts.download_qualities || []).join("، ")}p`);
  }
  const wm = opts.watermark;
  labels.push(
    wm?.enabled
      ? `واترمارک ${wm.type === "image" ? "تصویر" : "متن"}`
      : "بدون واترمارک"
  );
  if (opts.thumbnails_enabled) {
    labels.push("پیش‌نمایش تامب‌نیل");
  }
  return labels.join(" · ");
});

function hasCookie(name) {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${name}=`));
}

let probeTimer = null;

/**
 * Best-effort protocol detection: an installed handler normally drops focus from
 * the page. We never block the UI forever — after probeTimeout we assume installed
 * so the admin is not stuck when detection is unreliable.
 */
function probeProtocol(force = false) {
  if (force) {
    appAvailable.value = false;
  } else {
    if (appAvailable.value) return;
    if (hasCookie(STORAGE_COOKIE)) {
      appAvailable.value = true;
      return;
    }
  }

  let settled = false;
  const settle = (value) => {
    if (settled) return;
    settled = true;
    appAvailable.value = value;
    if (value) {
      document.cookie = `${STORAGE_COOKIE}=1; max-age=${
        60 * 60 * 24 * 30
      }; path=/; SameSite=Lax`;
    }
    cleanup();
  };
  const onBlur = () => settle(true);
  const onVisibility = () => {
    if (document.hidden) settle(true);
  };
  const cleanup = () => {
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onVisibility);
    if (probeTimer) clearTimeout(probeTimer);
    probeTimer = null;
  };

  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);
  probeTimer = setTimeout(() => settle(false), props.probeTimeout);

  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `${PROTOCOL}probe`;
    document.body.appendChild(iframe);
    setTimeout(() => {
      try {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      } catch (e) {}
    }, 2000);
  } catch (e) {
    settle(false);
  }
}

function confirm() {
  if (selected.value === "local" && !canUseLocal.value) return;
  emit("update:modelValue", false);
  emit("start", { mode: selected.value, storage_disk: props.options?.storage_disk || "static" });
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    probeProtocol();
  }
);

onMounted(() => {
  if (typeof window === "undefined") return;
  isDesktopSupported.value = !/Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent || ""
  );
  isAndroid.value = /Android/i.test(navigator.userAgent || "");
  if (!isDesktopSupported.value) selected.value = "server";
});

onBeforeUnmount(() => {
  if (probeTimer) clearTimeout(probeTimer);
});
</script>
