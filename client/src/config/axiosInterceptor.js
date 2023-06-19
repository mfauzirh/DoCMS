import axios from 'axios'
import router from '@/router';

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If error 401 - unauthorized - redirect to login
    if (error?.response?.status === 401 && router.currentRoute.name !== 'login') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push({
            name: "login",
            params: {
              message: "Your login session is expired",
              status: true,
              msgtype: 'error'
            }
          })
    }
    return Promise.reject(error)
  }
)
