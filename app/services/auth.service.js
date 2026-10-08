import axiosInstance from '@/store/axiosInstance'
import { clearAuthToken, persistAuthToken } from '@/utils/authToken'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

class AuthService {
  login(user) {
    return axiosInstance
      .post('/auth/login', {
        email: user.email,
        password: user.password,
        recaptchaToken: user.recaptchaToken,
      })
      .then((response) => {
        if (response.data.token) {
          persistAuthToken(response.data.token)
          axiosInstance.addHeaders({ Authorization: 'Bearer ' + response.data.token })
        }
        return Promise.resolve(response)
      })
      .catch((error) => Promise.reject(error))
  }

  logout() {
    return axiosInstance
      .post('/auth/logout')
      .then((response) => {
        clearAuthToken()
        if (axiosInstance.defaults?.headers?.common) {
          delete axiosInstance.defaults.headers.common.Authorization
        }
        if (import.meta.client) {
          toast.warning('با موفقیت خارج شدید!', {
            theme: 'colored',
            hideProgressBar: false,
            rtl: localStorage.getItem('direction') == 'rtl',
            bodyClassName: 'font-YekanBakh text-gray-800',
            toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
            transition: toast.TRANSITIONS.BOUNCE,
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
        return response.data
      })
      .catch((error) => {
        clearAuthToken()
        if (axiosInstance.defaults?.headers?.common) {
          delete axiosInstance.defaults.headers.common.Authorization
        }
        return Promise.reject(error)
      })
  }

  register(user) {
    return axiosInstance
      .post('/auth/register', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        password: user.password,
        password_confirmation: user.password_confirmation,
      })
      .then((response) => {
        if (response.data.token) {
          persistAuthToken(response.data.token)
          axiosInstance.addHeaders({ Authorization: 'Bearer ' + response.data.token })
        }
        return Promise.resolve(response)
      })
      .catch((error) => Promise.reject(error))
  }
}

export default new AuthService()
