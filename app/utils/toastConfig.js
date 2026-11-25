import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function getToastConfig(customOptions = {}) {
    const isClient = typeof window !== 'undefined';
    const isRtl = isClient ? (localStorage.getItem('direction') !== 'ltr') : true;

    return {
        theme: 'colored',
        hideProgressBar: false,
        autoClose: 3500,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        rtl: isRtl,
        bodyClassName: 'font-YekanBakh text-sm font-semibold',
        toastClassName: 'zb-modern-toast',
        transition: toast.TRANSITIONS.SLIDE,
        position: toast.POSITION.BOTTOM_RIGHT,
        ...customOptions,
    };
}

export function showToastSuccess(message, options = {}) {
    return toast.success(message, getToastConfig(options));
}

export function showToastError(message, options = {}) {
    return toast.error(message, getToastConfig(options));
}

export function showToastWarning(message, options = {}) {
    return toast.warning(message, getToastConfig(options));
}

export function showToastInfo(message, options = {}) {
    return toast.info(message, getToastConfig(options));
}
