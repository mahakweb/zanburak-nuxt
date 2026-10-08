import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function getToastConfig() {
    return {
        theme: 'colored',
        hideProgressBar: false,
        rtl: import.meta.client
            ? localStorage.getItem('direction') === 'rtl'
            : true,
        bodyClassName: 'font-YekanBakh',
        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
    };
}

export function showToastSuccess(message) {
    toast.success(message, getToastConfig());
}

export function showToastError(message) {
    toast.error(message, getToastConfig());
}

export function showToastWarning(message) {
    toast.warning(message, getToastConfig());
}
