import axiosInstance from "@/store/axiosInstance";

const base = (account) => `/admin/mail/${account}`;

function buildMailForm(payload) {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "attachments" && Array.isArray(value)) {
            value.forEach((file, index) => form.append(`attachments[${index}]`, file));
            return;
        }
        if (Array.isArray(value)) {
            value.forEach((item, index) => form.append(`${key}[${index}]`, item));
            return;
        }
        form.append(key, value);
    });

    return form;
}

export const mailInboxService = {
    getAccounts() {
        return axiosInstance.get("/admin/mail/accounts");
    },
    getFolders(account) {
        return axiosInstance.get(`${base(account)}/folders`);
    },
    getStats(account) {
        return axiosInstance.get(`${base(account)}/stats`);
    },
    listMessages(account, params) {
        return axiosInstance.post(`${base(account)}/messages`, params, {
            timeout: 120000,
            skipCancelOnNavigate: true,
        });
    },
    getMessage(account, uid, folder) {
        // POST avoids flaky GET/proxy issues; skipCancelOnNavigate keeps the read
        // alive if mobile history / same-route sync runs while the IMAP fetch is in flight.
        return axiosInstance.post(
            `${base(account)}/messages/${uid}`,
            { folder },
            { timeout: 120000, skipCancelOnNavigate: true },
        );
    },
    markRead(account, uid, folder) {
        return axiosInstance.post(`${base(account)}/messages/${uid}/mark-read`, { folder });
    },
    markUnread(account, uid, folder) {
        return axiosInstance.post(`${base(account)}/messages/${uid}/mark-unread`, { folder });
    },
    moveMessage(account, uid, folder, targetFolder) {
        return axiosInstance.post(`${base(account)}/messages/${uid}/move`, { folder, target_folder: targetFolder });
    },
    deleteMessage(account, uid, folder, permanent = false) {
        return axiosInstance.delete(`${base(account)}/messages/${uid}`, { data: { folder, permanent } });
    },
    reply(account, uid, payload) {
        return axiosInstance.post(`${base(account)}/messages/${uid}/reply`, buildMailForm(payload), {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    compose(account, payload) {
        return axiosInstance.post(`${base(account)}/compose`, buildMailForm(payload), {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    downloadAttachment(account, uid, folder, part) {
        return axiosInstance.get(`${base(account)}/messages/${uid}/attachments/${encodeURIComponent(part)}`, {
            params: { folder },
            responseType: "blob",
        });
    },
};
