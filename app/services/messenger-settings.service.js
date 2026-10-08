import axiosInstance from '@/store/axiosInstance';

export function getMessengerSettings() {
  return axiosInstance.get('/admin/messenger/settings');
}

export function updateMessengerSettings(payload) {
  return axiosInstance.put('/admin/messenger/settings', payload);
}

export function resetMessengerSettings() {
  return axiosInstance.post('/admin/messenger/settings/reset');
}

export function searchMessengerUsers(q) {
  return axiosInstance.get('/admin/messenger/users', { params: { q } });
}

export function updateMessengerUserAccess(userId, accessEnabled) {
  return axiosInstance.put(`/admin/messenger/users/${userId}/access`, {
    access_enabled: accessEnabled,
  });
}
