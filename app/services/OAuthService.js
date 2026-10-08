import config from '@/store/config';
export default {
    loginWithProvider(provider, redirect = '/') {
        const redirectParam = encodeURIComponent(redirect);
        window.location.href = `${config.apiBaseUrl}/oauth/${provider}?type=web&redirect=${redirectParam}`; // type include web foe website or mobile
    }
};
