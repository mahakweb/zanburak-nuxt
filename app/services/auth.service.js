import axiosInstance from '@/store/axiosInstance'
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
  }

  logout() {
    return axiosInstance
      .post('/auth/logout')
      .then((response) => {
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
  }
}

export default new AuthService()
