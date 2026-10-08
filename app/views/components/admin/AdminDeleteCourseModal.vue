<script setup>
import { ref, computed } from "vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import { ADMIN_BS_PANEL_SM, ADMIN_BS_CONTENT, ADMIN_BS_BACKDROP } from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    courseIds: {
        type: [Number, String, Array],
        default: null,
    },
});

const emit = defineEmits(["update:modelValue", "deleted"]);

const loading = ref(false);

const normalizedIds = computed(() => {
    if (props.courseIds == null) return [];
    return Array.isArray(props.courseIds) ? props.courseIds : [props.courseIds];
});

const isBulk = computed(() => normalizedIds.value.length > 1);

function close() {
    emit("update:modelValue", false);
}

function showToast(type, message) {
    const options = {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-YekanBakh",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
    };

    if (type === "success") toast.success(message, options);
    else if (type === "warning") toast.warning(message, options);
    else toast.error(message, options);
}

async function confirmDelete() {
    if (!normalizedIds.value.length) return;

    loading.value = true;

    try {
        const { data } = await axiosInstance.post("admin/course/delete", { id: normalizedIds.value });
        const skipped = data?.skipped || [];

        if (skipped.length > 0) {
            showToast("warning", `برخی دوره‌ها حذف نشدند: ${skipped.join("، ")}`);
        } else {
            showToast("success", "دوره(ها) با موفقیت حذف شدند.");
        }

        emit("deleted", {
            deletedIds: data?.deleted_ids || normalizedIds.value,
            skipped,
        });
        close();
    } catch (error) {
        const message = error.response?.data?.message || "حذف دوره با خطا مواجه شد.";
        showToast("error", message);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <BottomSheetDrawer
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :initialHeight="0.4"
        :maxHeight="0.6"
        :minHeight="0.4"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="ADMIN_BS_PANEL_SM"
        :contentClass="ADMIN_BS_CONTENT"
        :backdropClass="ADMIN_BS_BACKDROP"
    >
        <AdminBottomSheetHeader
            title="حذف دوره"
            subtitle="این عملیات قابل بازگشت نیست"
            accent="rose"
            @close="close"
        >
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>

        <AdminBottomSheetConfirm
            variant="danger"
            :message="`از حذف ${isBulk ? 'این دوره‌ها' : 'این دوره'} اطمینان کامل دارید؟`"
            description="تمام فصل‌ها، جلسات و اطلاعات مرتبط حذف خواهند شد. این عملیات قابل بازگشت نیست."
            confirm-label="حذف دوره"
            :loading="loading"
            @cancel="close"
            @confirm="confirmDelete"
        />
    </BottomSheetDrawer>
</template>
