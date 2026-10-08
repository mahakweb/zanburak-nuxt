import axiosInstance from '@/store/axiosInstance';

// ── Admin: Certificate Templates ────────────────────────────────
export async function listCertificateTemplates(params = {}) {
  const r = await axiosInstance.get('/admin/certificate-templates', { params });
  return r.data;
}

export async function getCertificateTemplate(id) {
  const r = await axiosInstance.get(`/admin/certificate-templates/${id}`);
  return r.data;
}

export async function createCertificateTemplate(payload) {
  const r = await axiosInstance.post('/admin/certificate-templates', payload);
  return r.data;
}

export async function updateCertificateTemplate(id, payload) {
  const r = await axiosInstance.post(`/admin/certificate-templates/${id}/update`, payload);
  return r.data;
}

export async function deleteCertificateTemplate(id) {
  const r = await axiosInstance.delete(`/admin/certificate-templates/${id}`);
  return r.data;
}

export async function duplicateCertificateTemplate(id) {
  const r = await axiosInstance.post(`/admin/certificate-templates/${id}/duplicate`);
  return r.data;
}

export async function uploadCertificateTemplateAsset(id, type, file) {
  const fd = new FormData();
  fd.append('type', type);
  fd.append('file', file);
  const r = await axiosInstance.post(`/admin/certificate-templates/${id}/upload`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return r.data;
}

export async function listCertificateFonts() {
  const r = await axiosInstance.get('/admin/certificate-fonts');
  return r.data;
}

export async function uploadCertificateFont(slug, file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await axiosInstance.post(`/admin/certificate-fonts/${slug}/upload`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return r.data;
}

// ── Admin: Certificate Issuance ─────────────────────────────────
export async function listAdminCertificates(params = {}) {
  const r = await axiosInstance.post('/admin/certificates', params);
  return r.data;
}

export async function getCertificateStats(params = {}) {
  const r = await axiosInstance.get('/admin/certificates/stats', { params });
  return r.data;
}

export async function getCertificateDetails(uuid) {
  const r = await axiosInstance.get(`/admin/certificates/${uuid}/details`);
  return r.data;
}

export async function createAdminCertificate(payload) {
  const r = await axiosInstance.post('/admin/certificates/create', payload);
  return r.data;
}

export async function updateAdminCertificate(uuid, payload) {
  const r = await axiosInstance.post(`/admin/certificates/${uuid}/update`, payload);
  return r.data;
}

export async function issueAdminCertificate(uuid, payload = {}) {
  const r = await axiosInstance.post(`/admin/certificates/${uuid}/issue`, payload);
  return r.data;
}

export async function revokeAdminCertificate(uuid) {
  const r = await axiosInstance.post(`/admin/certificates/${uuid}/revoke`);
  return r.data;
}

export async function deleteAdminCertificate(uuid, forceDelete = false) {
  const r = await axiosInstance.delete(`/admin/certificates/${uuid}/delete`, {
    params: { force_delete: forceDelete },
  });
  return r.data;
}

export async function exportAdminCertificates(params = {}) {
  const r = await axiosInstance.get('/admin/certificates/export', {
    params,
    responseType: 'blob',
  });
  return r.data;
}

export async function searchCertificateUsers(search) {
  const r = await axiosInstance.get('/admin/certificates/users', { params: { search } });
  return r.data;
}

export async function searchCertificateCourses(search) {
  const r = await axiosInstance.get('/admin/certificates/courses', { params: { search } });
  return r.data;
}

// ── Public / Student ──────────────────────────────────────────
export async function getCertificate(uuid) {
  const r = await axiosInstance.get(`/certificate/${uuid}`);
  return r.data;
}

export async function getCertificateRenderData(uuid, templateId = null) {
  const params = templateId ? { template_id: templateId } : {};
  const r = await axiosInstance.get(`/certificate/${uuid}/render`, { params });
  return r.data;
}

export async function verifyCertificate(serial, token = null) {
  const payload = { serial };
  if (token) payload.token = token;
  const r = await axiosInstance.post('/certificate/verify', payload);
  return r.data;
}

export async function listPanelCertificateTemplates() {
  const r = await axiosInstance.get('/panel/certificate-templates');
  return r.data;
}

export async function updatePanelCertificateTemplate(uuid, certificateTemplateId) {
  const r = await axiosInstance.post(`/panel/certificates/${uuid}/template`, {
    certificate_template_id: certificateTemplateId,
  });
  return r.data;
}

export const CERTIFICATE_PLACEHOLDERS = [
  { key: 'student_name', label: 'نام دانشجو' },
  { key: 'course_name', label: 'نام دوره' },
  { key: 'completion_date', label: 'تاریخ اتمام' },
  { key: 'certificate_serial', label: 'سریال گواهینامه' },
  { key: 'certificate_id', label: 'شناسه گواهینامه' },
  { key: 'qr_code', label: 'QR Code' },
  { key: 'instructor_name', label: 'نام مدرس' },
  { key: 'duration', label: 'مدت زمان' },
  { key: 'grade', label: 'نمره' },
];
